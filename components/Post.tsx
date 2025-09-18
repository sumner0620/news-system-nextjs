/* eslint-disable react/no-danger */
import React from 'react';
import { PostProps } from '@/types/newsTypes';
import { convertLinkMarkdownToHTML } from '../utils';
import BlueCaretLeft from '@/app/assets/images/BlueCaretLeft';
import ClientLayoutHelper from '@/app/components/layout/client-layout-helper';
import BaseLayout from '@/app/components/layout/layout';
import {
    generateContentfulMetaData,
    getMetaRobots,
    getCanonicalLink,
    getXDefaultLink,
} from '../../assets/common/page-functions';

import '@/app/assets/scss/master/master.scss';
import '@/app/news/styles/_posts.scss';

const Post: React.FC<PostProps> = ({ pageContext }) => {
    const {
        postData: {
            body,
            featuredImage,
            headline,
            releaseDate,
            origin,
            footnote,
            introText,
            source,
        },
        headerData,
        footerData,
        slug,
    } = pageContext;

    const pagePath = `/news/${slug}`;

    const formattedDate = new Date(releaseDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const seoComponent = generateContentfulMetaData({
        params: { pathname: ['news'] },
    });

    const metaRobotsValue = getMetaRobots(seoComponent, '/news');

    // Get canonical and x-default links based on the current path
    const canonicalHref = getCanonicalLink(seoComponent, pagePath);
    const xDefaultHref = getXDefaultLink(seoComponent, pagePath);

    const postHtml = (
        <section className="padding-top165 padding-bottom50 background background--color0 black-text">
            <div className="container">
                <div className="post-inner-container">
                    <div className="back-link--pressrelease">
                        <BlueCaretLeft />
                        <a href="/news">Back to press releases</a>
                    </div>

                    <h1 className="post-title">{headline}</h1>

                    {featuredImage && (
                        <img
                            className="post-image"
                            src={featuredImage.url}
                            alt={headline}
                        />
                    )}

                    {introText && (
                        <div
                            className="post-intro"
                            dangerouslySetInnerHTML={{
                                __html: convertLinkMarkdownToHTML(
                                    introText.introText
                                ),
                            }}
                        />
                    )}

                    <time>{formattedDate}</time>
                    <div
                        className="post-body"
                        dangerouslySetInnerHTML={{
                            __html: convertLinkMarkdownToHTML(body),
                        }}
                    />
                    {/* <TextBlock raw={body.raw} /> */}

                    {footnote && (
                        <div
                            className="post-footnote"
                            dangerouslySetInnerHTML={{
                                __html: convertLinkMarkdownToHTML(
                                    footnote.footnote
                                ),
                            }}
                        />
                    )}

                    {source && <cite>{source}</cite>}
                </div>
            </div>
        </section>
    );

    return (
        <>
            <meta name="robots" content={metaRobotsValue} />
            {canonicalHref && <link rel="canonical" href={canonicalHref} />}
            <link rel="alternate" hrefLang="x-default" href={xDefaultHref} />
            <BaseLayout>
                <div className="single-post main-grid">
                    <ClientLayoutHelper
                        customHtml={postHtml}
                        header={headerData}
                        footer={footerData}
                        slug={slug}
                    />
                </div>
            </BaseLayout>
        </>
    );
};

export default Post;
