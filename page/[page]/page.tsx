/* eslint-disable react/no-danger, @next/next/no-img-element */
import React from 'react';
import { notFound } from 'next/navigation';

import NewsHero from '../../components/NewsHero';
import StickyMenu from '../../../components/newsroom/components/StickyMenu';
import CtaButton from '../../../components/cta-button/cta-button-view';
import BaseLayout from '../../../components/layout/layout';
import ClientLayoutHelper from '@/app/components/layout/client-layout-helper';
import { getHeaderAndFooterData } from '@/lib/getNewsPosts';
import MuiPaginationClient from '../../components/MuiPaginationClient';

import {
    findImage,
    transformDate,
    convertToISO8601,
    createSlug,
} from '../../utils';
import getNewsData from '../../utils/getNewsData';

import '../../../assets/scss/master/master.scss';
import '../../styles/_post-index.scss';

const POSTS_PER_PAGE = 10;

export async function generateStaticParams() {
    const { numPages } = await getNewsData();

    return Array.from({ length: numPages - 1 }, (_, i) => ({
        page: `${i + 2}`,
    }));
}

const PostIndex = async ({ params }: { params: { page: string } }) => {
    const pageNumber = parseInt(params.page, 10);
    const { allPosts, numPages } = await getNewsData();

    if (pageNumber > numPages || isNaN(pageNumber) || pageNumber < 2) {
        return notFound();
    }

    const start = (pageNumber - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const pagePosts = allPosts.slice(start, end);

    const { headerData, footerData } = await getHeaderAndFooterData();

    const feedHtml = (
        <>
            <NewsHero {...headerData} />
            <section className="padding-bottom50 background background--color0 black-text">
                <StickyMenu pathname="/news" />
                <div className="container">
                    <div className="news-feed">
                        <ul>
                            {pagePosts.map((item: any) => {
                                const { id, releaseDate, headline } = item;

                                return (
                                    <li key={id} className="post-listing">
                                        <img
                                            src={
                                                findImage(item) ||
                                                'https://images.ctfassets.net/t21gix3kzulv/3m1hheB7Okv7IdppkEMSxl/b0107620062968f8c479eef7f9f77f53/CTCT_Logo_H_Stack_FC_RGB.svg'
                                            }
                                            alt={headline}
                                        />
                                        <aside>
                                            <time
                                                dateTime={convertToISO8601(
                                                    releaseDate
                                                )}
                                            >
                                                {transformDate(releaseDate)}
                                            </time>
                                            <h6>{headline}</h6>
                                            <CtaButton
                                                buttonText="Read more"
                                                color="outline"
                                                label="Read more"
                                                size="Regular"
                                                rel="noopener noreferrer"
                                                href={`/news/${createSlug(
                                                    headline,
                                                    releaseDate
                                                )}`}
                                            />
                                        </aside>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="post-pagination">
                            <MuiPaginationClient
                                totalPages={numPages}
                                currentPage={pageNumber}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );

    return (
        <BaseLayout>
            <div className="main-grid test">
                <ClientLayoutHelper
                    header={headerData}
                    footer={footerData}
                    customHtml={feedHtml}
                />
            </div>
        </BaseLayout>
    );
};

export default PostIndex;
