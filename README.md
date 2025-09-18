## News System (Next.js) - Extracted Module

This repository contains an extracted subset of a larger application that powers a news/press release section. Files are provided primarily as showcase code.

### Important note on structure and imports
**This folder structure does not match the original app.** Many imports reference paths, aliases, or components that exist only in the source app (for example: `@/lib/*`, `@/app/*`, `../../components/layout/*`, and `../../assets/*`).

### File guide
- `page.tsx`: Example news index page at `/news` (single-page variant). Composes `NewsHero`, lists recent posts, shows pagination, and injects SEO/meta from app-level utilities.
- `page/page.tsx`: App Router page for the base news listing. Composes `NewsHero`, renders a list of posts from `pageContext`, and outputs layout via higher-level layout components from the original app.
- `page/[page]/page.tsx`: App Router page for paginated listings (e.g., `/news/page/2`). Fetches posts for the requested page, builds the feed, and renders pagination.
- `[slug]/page.tsx`: Dynamic route for an individual news post page (e.g., `/news/2024-06-01-sample-headline`). Delegates UI to `components/Post.tsx`.

- `components/NewsHero.tsx`: Hero/banner for the news pages. Merges default `components/data/hero.data.ts` with optional overrides and renders a CTA/hero section.
- `components/MuiPaginationClient.tsx`: Client component wrapping Material UI `Pagination` to link between news listing pages.
- `components/Post.tsx`: Single post view. Renders title, date, hero image, intro/body HTML (with basic Markdown link conversion), and layout wrappers.
- `components/data/hero.data.ts`: Typed default data object for `NewsHero` (headline, theme, flags, section info).

- `utils/index.ts`: Utility helpers used across pages/components:
  - `findImage` (recursively find an `image` URL on an object)
  - `transformDate` (format to `MMM D, YYYY`)
  - `convertToISO8601` (safe ISO string for `<time dateTime>`)
  - `createSlug` (date-prefixed slug from headline/date)
  - `convertLinkMarkdownToHTML` (very small `[text](url)` to `<a>` converter)
- `utils/getNewsData.ts`: Fetches cached news JSON from storage (S3 in the original app), returning `{ allPosts, numPages, recentPosts }` used by listing pages.

- `getNewsPosts.ts`: Script/util used in the original build pipeline. Fetches and caches all posts, slices them into pages, writes recent details, and generates sitemap entries. Also exports `getHeaderAndFooterData` for layout.

- `styles/_news-hero.scss`, `styles/_post-index.scss`, `styles/_posts.scss`: SCSS partials that style the hero, list view, and post view respectively. Expect additional global styles from the source app.
- `types/`: TypeScript types referenced by components (for example `PostProps`, `newsTypes`). These may be partial relative to the original app.

### Known gaps
- External components referenced but not included here (e.g., `StickyMenu`, `CtaButton`, `BaseLayout`, `ClientLayoutHelper`) are in the original app.
- Import aliases like `@/*` require matching tsconfig/webpack config in the host app.
- Styles import from `assets/*` assumes a global stylesheet setup in the original app.

API driven news system. 