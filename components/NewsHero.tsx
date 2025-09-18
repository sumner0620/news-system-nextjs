import heroData from './data/hero.data.ts';
import CenteredCta from './centered-cta/centered-cta-client-wrapper';

import '../styles/_news-hero.scss';

type NewsHeroProps = {
    headline?: string;
    subheadline?: string;
};

export default function NewsHero(props: NewsHeroProps) {
    const { headline, subheadline } = props;

    const combinedProps = {
        ...heroData,
        ...(headline && { headline }),
        ...(subheadline && { subheadline }),
    };

    return (
        <section className="padding-bottom65 padding-top65 news-hero">
            <CenteredCta {...combinedProps} />
        </section>
    );
}


