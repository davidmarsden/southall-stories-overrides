# Southall Stories overrides

Micro.blog plugin candidate for Southall Stories, layered on the Microwave base theme.

**Status: test candidate.** See `docs/production-checklist.md` for what is confirmed and what remains. The existing custom theme remains authoritative until a test blog build passes. This repository contains the selected editorial layouts, mobile navigation and Southall styles. Some dependencies, including archive templates and inherited partials, require verification.

## Test procedure

1. On `davidmarsden-test`, retain an export and note the current theme/plugin configuration.
2. Install this repository as a Micro.blog plugin using the GitHub repository URL, with Microwave selected as the base theme.
3. Rebuild and inspect logs. Verify homepage, article, category, archive, search, mobile navigation, social metadata and light/dark colours.
4. If broken, disable the plugin and restore the original test configuration. Do not enable it on southallstories.uk yet.

## Data pages

The homepage has a "Data pages" section (`layouts/partials/data-pages.html`) linking to data.southallstories.uk. To add a data page, copy one card in that partial. The menu link comes from the "Data pages" page in Micro.blog, not from the plugin.

## Ownership

The plugin owns Southall-specific templates and assets. Micro.blog owns content and configuration. Microwave owns inherited assets. Third-party plugins (SocialSpec, Search Space, Collections) remain separately managed.

Migration research and audit: https://github.com/davidmarsden/southall-stories-uk/pull/5
