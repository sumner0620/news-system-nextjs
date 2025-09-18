import Post from '../components/Post';
import { createSlug } from '@/lib/utils';
import { readFromS3 } from '@/lib/aws-s3-storage';
import { getHeaderAndFooterData } from '@/lib/getNewsPosts';
import { notFound } from 'next/navigation';

const getCachedDetailedPosts = async () => {
    const posts = await readFromS3('news/details.json');
    return posts;
};

export async function generateStaticParams() {
    const posts = await getCachedDetailedPosts();

    return posts.map((post: any) => ({
        slug: createSlug(post.headline, post.releaseDate),
    }));
}

export default async function NewsPostPage({
    params,
}: {
    params: { slug: string };
}) {
    const posts = await getCachedDetailedPosts();
    const postData = posts.find(
        (post: any) =>
            createSlug(post.headline, post.releaseDate) === params.slug
    );

    if (!postData) {
        notFound();
    }

    const { headerData, footerData } = await getHeaderAndFooterData();

    return (
        <Post
            pageContext={{
                postData,
                headerData,
                footerData,
                slug: params.slug,
            }}
        />
    );
}
