import {
    convertUnixToDateString,
    createSlug,
    delay,
    fetchWithRetry,
} from './utils';
import { getCachedPageContentful } from '@/api/contentful';
import { readFromS3, writeToS3 } from './aws-s3-storage';
import {
    ShortPostData,
    TotalShortPosts,
    PostListPage,
} from '../types/newsTypes';
import { SitemapEntryData } from '@/types/sitemapTypes';

const listURL =
    '[REDACTED_API_LIST_URL]';
const getURL =
    '[REDACTED_API_GET_URL]';

async function fetchAllPosts(
    totalPosts: number,
    latestModified: string | number | null
): Promise<ShortPostData[]> {
    const offsetSlices = [...Array(Math.ceil(Number(totalPosts) / 50)).keys()];

    const responses = await Promise.all(
        offsetSlices.map((idx) =>
            fetchWithRetry<TotalShortPosts>(
                listURL.replace('{offset}', `${idx * 50}`),
                5,
                500
            )
        )
    );

    const data = responses
        .flat()
        .reduce((acc: ShortPostData[], next) => acc.concat(next.release), [])
        .sort(
            (a, b) =>
                new Date(b?.releaseDate ?? 0).getTime() -
                new Date(a?.releaseDate ?? 0).getTime()
        );

    if (latestModified) {
        await writeToS3(`news/all-${latestModified}.json`, data);
    }

    return data;
}

/**
 * Generate sitemap entry data for news pages
 */
export const generateNewsSitemapEntries = (
    allPostPages: PostListPage[],
    detailedPosts: any[]
): SitemapEntryData[] => {
    const sitemapEntries: SitemapEntryData[] = [];

    // Add news listing pages to sitemap
    allPostPages.forEach((page) => {
        sitemapEntries.push({
            path: page.path,
            lastModified: new Date(), // Use current date for listing pages
        });
    });

    // Add individual news posts to sitemap
    detailedPosts.forEach((post) => {
        const slug = createSlug(post.headline, post.releaseDate);

        if (!slug) return;

        // Determine last modified date for post
        let lastModifiedDate: Date;
        if (
            post?.source === 'contentful' ||
            typeof post.modified === 'number'
        ) {
            lastModifiedDate = new Date(post.modified * 1000);
        } else {
            lastModifiedDate = new Date(post.modified);
        }

        sitemapEntries.push({
            path: `/news/${slug}`,
            lastModified: lastModifiedDate,
        });
    });

    return sitemapEntries;
};

export const getNewsPosts = async () => {
    try {
        const allPostPages: PostListPage[] = [];
        const detailedPostsPages: PostListPage[] = [];

        const { totalPosts, latestModified } =
            await fetchWithRetry<TotalShortPosts>(
                listURL.replace('{offset}', '0')
            ).then((data) => ({
                totalPosts: data.matching_count,
                latestModified: data.latestModified,
            }));

        let allPosts: ShortPostData[] | null = null;

        try {
            allPosts = await readFromS3(`news/all-${latestModified}.json`);
        } catch (err) {
            allPosts = null;
        }

        if (!allPosts) {
            allPosts = await fetchAllPosts(totalPosts, latestModified);
        }

        const postsPerPage = 10;
        const numPages = totalPosts ? Math.ceil(totalPosts / postsPerPage) : 1;

        for (let i = 0; i < numPages; i++) {
            const start = i * postsPerPage;
            const end = start + postsPerPage;
            const pagePosts = allPosts.slice(start, end);

            if (i === 0) {
                await writeToS3(`news/recentPosts.json`, allPosts.slice(0, 10));
            }

            allPostPages.push({
                path: i === 0 ? `/news` : `/news/page/${i + 1}`,
                context: {
                    newsData: pagePosts,
                    currentPage: i + 1,
                    numPages,
                },
            });
        }

        if (!allPosts) {
            return;
        }

        const allPostIds = allPosts
            .filter((p) => !p?.isContentful)
            .map((p) => p?.id);

        let cachedDetailPosts = [];
        try {
            cachedDetailPosts = await readFromS3('news/details.json');
        } catch (err) {
            cachedDetailPosts = [];
        }

        const detailedPosts = [];
        for (const id of allPostIds) {
            const cachedPost =
                cachedDetailPosts &&
                cachedDetailPosts?.find((x: any) => x?.id === id)
                    ? cachedDetailPosts?.find((x: any) => x?.id === id)
                    : null;
            const postModificationDate = allPosts?.find((x) => x?.id)?.modified;
            const isPostModified =
                postModificationDate &&
                Number(postModificationDate) > Number(latestModified);

            /* check to ensure that we don't need to get an updated copy of the post */
            if (cachedPost && !isPostModified) {
                detailedPosts.push(cachedPost);
            } else {
                /* 
                    unfortunately we need to loop fetch calls with 
                    retry because Promise.all runs concurrently 
                */
                await delay(500);
                const post = await fetchWithRetry(
                    getURL.replace('{postID}', id ?? ''),
                    5,
                    500
                );

                console.log(`we had to fetch (or refetch) post ${id}`);
                detailedPosts.push(post);
            }
        }

        detailedPosts.sort((a, b) => {
            const dateA =
                typeof a.modified === 'number'
                    ? a.modified * 1000
                    : new Date(a.modified).getTime();
            const dateB =
                typeof b.modified === 'number'
                    ? b.modified * 1000
                    : new Date(b.modified).getTime();
            return dateB - dateA;
        });

        await writeToS3('news/details.json', detailedPosts);

        detailedPosts.forEach((post) => {
            const slug = createSlug(post.headline, post.releaseDate);

            detailedPostsPages.push({
                path: `/news/${slug}/`,
                context: {
                    postData: post,
                    pathname: slug,
                },
            });
        });

        // Generate sitemap entries
        const sitemapEntries = generateNewsSitemapEntries(
            allPostPages,
            detailedPosts
        );

        return {
            detailedPosts,
            allPostPages,
            sitemapEntries,
            numPages,
        };
    } catch (err) {
        console.log(`error fetching news posts ${err}`);
    }
};

export const getHeaderAndFooterData = async () => {
    try {
        const {
            headerComponent: headerData,
            footerComponent: footerData,
            contentfulId,
        } = await getCachedPageContentful('/newsroom');

        return { headerData, footerData, pageId: contentfulId };
    } catch (err) {
        console.error('Error fetching header/footer:', err);
        return { headerData: null, footerData: null };
    }
};
