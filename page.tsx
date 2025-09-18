/* eslint-disable react/no-danger, @next/next/no-img-element */
import React from 'react';
import MuiPaginationClient from './components/MuiPaginationClient';
import NewsHero from './components/NewsHero';
import StickyMenu from '../components/newsroom/components/StickyMenu';
import CtaButton from '../components/cta-button/cta-button-view';
import ClientLayoutHelper from '../components/layout/client-layout-helper';
import BaseLayout from '../components/layout/layout';
import { getHeaderAndFooterData } from '@/lib/getNewsPosts';
import {
    findImage,
    transformDate,
    convertToISO8601,
    createSlug,
} from './utils';
import getNewsData from './utils/getNewsData';
import {
    generateContentfulMetaData,
    getMetaRobots,
    getCanonicalLink,
    getXDefaultLink,
} from '../assets/common/page-functions';

import '../assets/scss/master/master.scss';
import './styles/_post-index.scss';

const PostIndex = async () => {
    const currentPage = 1;
    const pagePath = '/news';
    const { headerData, footerData } = await getHeaderAndFooterData();
    const { numPages, recentPosts } = await getNewsData();
    const seoComponent = await generateContentfulMetaData({
        params: { pathname: ['news'] },
    });

    // Apply metaRobots function for /news pathname
    const metaRobotsValue = getMetaRobots(seoComponent, '/news');

    // Get canonical and x-default links based on the current path
    const canonicalHref = getCanonicalLink(seoComponent, pagePath);
    const xDefaultHref = getXDefaultLink(seoComponent, pagePath);

    const feedHtml = (
        <>
            <NewsHero />
            <section className="padding-bottom50 background background--color0 black-text">
                <StickyMenu pathname="/news" />
                <div className="container">
                    <div className="news-feed">
                        <ul>
                            {recentPosts.map((item: any) => {
                                const { id, releaseDate, summary, headline } =
                                    item;
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
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );

    return (
        <>
            <meta name="robots" content={metaRobotsValue} />
            {canonicalHref && <link rel="canonical" href={canonicalHref} />}
            <link rel="alternate" hrefLang="x-default" href={xDefaultHref} />
            <BaseLayout>
                <div className="main-grid">
                    <ClientLayoutHelper
                        header={headerData}
                        footer={footerData}
                        customHtml={feedHtml}
                    />
                </div>
            </BaseLayout>
        </>
    );
};

export default PostIndex;
