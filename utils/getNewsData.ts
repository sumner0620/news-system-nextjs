import { listFilesInFolder, readFromS3 } from '@/lib/aws-s3-storage.ts';

const getNewsData = async (postsPerPage = 10) => {
    const newsFiles: any = await listFilesInFolder('news/');
    const latest = newsFiles
        .filter((x: any) => x?.LastModified && x?.Key?.includes('all-'))
        .sort(
            (a: any, b: any) =>
                b?.LastModified.getTime() - a.LastModified.getTime()
        )[0];
    const { Key: allPostsLatest } = latest;
    const allPosts = await readFromS3(allPostsLatest);
    const numPages = Math.ceil(allPosts.length / postsPerPage);
    const recentPosts = await readFromS3('news/recentPosts.json');

    return {
        allPosts,
        numPages,
        recentPosts,
    };
};

export default getNewsData;
