# Production checklist

Status at 15 November 2026, from comparing southallstories.uk with davidmarsden-test.micro.blog.

## Already confirmed

- Templates match the production theme source (`davidmarsden/southall-stories-uk`), apart from the data pages section.
- On the test blog, the plugin's templates and stylesheets are used, and the CSS and JavaScript load in the same order as production.
- `style.css`, `southall-browse.css`, `southall-identity.css`, `hamburger.js`, `archive.js` and `lightbox.js` match production (style.css differs only in comments and blank lines).
- `southall-pages.css`: the plugin copy fixes a stray `}}}` in production.

## Fixed in this branch

- **Palette.** Micro.blog does not compile the plugin's `_variables-light.scss`. Without a fix, the background, link colour and underline style fall back to Microwave's defaults in light and dark mode. `static/css/southall-palette.css` restates production's values and loads straight after the Bootstrap files.
- **Search.** The test blog served Microwave's `search.js` (153 lines) instead of production's amended copy (187 lines). The plugin now ships production's copy.
- **Data pages.** The homepage section links to data.southallstories.uk. The menu link stays as a Micro.blog page, as on production.

## Still to do before switching

1. **Give the test blog content.** It has no posts, so the article layout, category pages, the homepage lead story and search have never been tested. Import 5 to 10 real posts with categories, images and a title-less note, and add the Search Space page.
2. **Production plugins (as installed on southallstories.uk, November 2026)**: Microwave Theme 1.21.0, Twitter cards, Search Space, Open Graph basics (supplies the og:image), YouTube Embed Shortcode, Video streaming (studio.js), Conversation on Micro.blog, Reply by email, Photo collections, SocialSpec; Bayou Theme installed but disabled. Earlier note: SocialSpec, Search Space, Collections, and whichever plugins provide the "Reply by email" and "Also on Micro.blog" links (`reply-by-email.html`, `conversation-link.html`). The article template skips those links if their partials are missing, rather than failing the build. Production loads `collections.css` and `studio.js`; the test blog does not.
3. **Merge to `main`**, rebuild the test blog, and check the build log.
4. **Compare page by page** at desktop and phone width, light and dark: home, an article, a category, archive, search, about, subscribe. Check social previews with a link-preview tool.
5. **Newsletter**: the newsletter design is a Micro.blog newsletter template (copy in `docs/newsletter-template.html`), not part of the theme files. If it is set in the blog's Email Newsletter settings it should be unaffected by the switch; send a test after switching to confirm.
6. **Back up**: export the production theme and note its settings.
7. **Switch production**: choose Microwave as the theme, install the plugin from GitHub, rebuild, and check the same pages. Roll back by reselecting the custom theme.
8. **Tidy up afterwards**: remove `_variables-light.scss` and the unused `custom.css` (no page links to it), and retire the custom-theme copies so there is one source of truth.
