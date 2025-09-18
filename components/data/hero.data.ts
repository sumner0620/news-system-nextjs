type Section = {
    background: string | null;
    contentful_id: string;
    id: string;
    name: string | null;
    textColor: string | null;
};

export type CenteredCtaData = {
    __typename: 'ContentfulCenteredCta';
    actAsHero: boolean;
    breadcrumbs: unknown | null;
    contentful_id: string;
    contentSize: unknown | null;
    headline: string;
    id: string;
    sectionIntro: unknown | null;
    textAfterCta: string | null;
    useWhiteTextInContentArea: boolean;
    stepSignUpFormOrButtons: unknown | null;
    centeredCtaHtml: string | null;
    alternateComponents: unknown | null;
    personalizationOn: boolean;
    useLoadingAnimation: boolean;
    section: Section;
    sectionCallback: string;
    pathname: string;
    geolocatedCountryCode: string;
};

const heroData: CenteredCtaData = {
    __typename: 'ContentfulCenteredCta',
    actAsHero: true,
    breadcrumbs: null,
    contentful_id: '3z6Vma9WcOBM41J33Ues6J',
    contentSize: null,
    headline: 'Press releases',
    id: '0db5ae7f-0621-5aeb-be3f-aaf4673f3fe6',
    sectionIntro: null,
    textAfterCta: null,
    useWhiteTextInContentArea: true,
    stepSignUpFormOrButtons: null,
    centeredCtaHtml: null,
    alternateComponents: null,
    personalizationOn: false,
    useLoadingAnimation: false,
    section: {
        background: '#1330bf',
        contentful_id: '2RCYGkIdOQuOTGST3ysjQt',
        id: 'd8bd30f6-f4ee-5a76-908d-59b39f76cb61',
        name: null,
        textColor: '',
    },
    sectionCallback: 'sectionCallback() {}',
    pathname: '/newsroom',
    geolocatedCountryCode: 'en_US_USD',
};

export default heroData;


