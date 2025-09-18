/** --- API data types --- */

export type ShortPostData = {
    id?: string | null;
    summary?: string | null;
    assets?: {
        asset?:
            | {
                  '*attrs'?: {
                      type?: string | null;
                  } | null;
                  '*children'?: {
                      title?: string | null;
                      summary?: string | null;
                      image?: string | null;
                      resource?: string | null;
                  } | null;
              }[]
            | null;
    } | null;
    headline?: string | null;
    releaseDate?: string | null;
    modified?: number | null;
    modifiedDate?: string | null;
    isContentful?: boolean | null;
} | null;

export interface TotalShortPosts {
    matching_count: number;
    returned_count: number | null;
    latestModified: string | number;
    release: ShortPostData[];
    totalPosts: number;
}

export interface FullPostData {
    id: string;
    origin: string | null;
    active: string | null;
    language: string;
    headline: string;
    body: string;
}

export interface PostListPage {
    path: string;
    context: {
        newsData?: ShortPostData[] | null;
        postData?: FullPostData | null;
        currentPage?: number | null;
        pathname?: string | null;
        numPages?: number | null;
    };
    header?: any;
    footer?: any;
}

/** --- Component data types --- */

export type PostData = {
    body: any;
    featuredImage?: { url: string };
    headline: string;
    releaseDate: string;
    origin?: string;
    footnote?: { footnote: string };
    introText?: { introText: string };
    source?: string;
};

export type PageContext = {
    postData: PostData;
    headerData: { contentfulSiteHeader: any };
    footerData: { contentfulFooterWrapper: any };
    slug: string;
};

export type PostProps = {
    pageContext: PageContext;
};
