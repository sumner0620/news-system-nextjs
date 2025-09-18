/* eslint-disable react/no-danger, @next/next/no-img-element */
import React from 'react';
import NewsHero from '../components/NewsHero';
import StickyMenu from '../../components/newsroom/components/StickyMenu';
import CtaButton from '../../components/cta-button/cta-button-view';
import ClientLayoutHelper from '../../components/layout/client-layout-helper';
import BaseLayout from '../../components/layout/layout';

import {
    findImage,
    transformDate,
    convertToISO8601,
    createSlug,
} from '../utils';

import '../../assets/scss/master/master.scss';
import '../styles/_post-index.scss';

const PostIndex = ({ pageContext }: any) => {
    const posts = pageContext?.newsData;
    const header = pageContext?.headerData?.contentfulSiteHeader;
    const footer = pageContext?.footerData?.contentfulFooterWrapper;

    const feedHtml = (
        <>
            <NewsHero />
            <section className="padding-bottom50 background background--color0 black-text">
                <StickyMenu pathname="/news" />
                <div className="container">
                    <div className="news-feed">
                        <ul>
                            {posts && posts?.length ? (
                                posts.map((item: any) => {
                                    const {
                                        id,
                                        releaseDate,
                                        summary,
                                        headline,
                                        url,
                                    } = item;
                                    return (
                                        <li key={id} className="post-listing">
                                            <img
                                                src={
                                                    findImage(item) ||
                                                    '[redacted_image_src]'
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
                                })
                            ) : (
                                <li>no posts</li>
                            )}
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );

    return (
        <BaseLayout>
            <div className="main-grid">
                <ClientLayoutHelper
                    header={header}
                    footer={footer}
                    dangerousHtml={feedHtml}
                />
            </div>
        </BaseLayout>
    );
};

export default PostIndex;
