# Lightweight Southall Stories syndication feed

The public `https://southallstories.uk/feed.xml` was reported by Micro.blog's source importer as 4,878,310 bytes and skipped. **Do not alter the main RSS feed.**

This standalone GitHub Actions workflow downloads the existing public RSS, retains the latest 15 entries and standard RSS identifiers, converts descriptions to bounded plain text, removes duplicate full-text / source-markdown payloads, and validates that the generated feed is under 350 KB. It publishes through GitHub Pages every three hours and can be triggered manually.

## Activation (requires repository administrator)

1. Merge the PR.
2. Under **Settings → Pages**, select **GitHub Actions** as the build/deployment source. If GitHub Pages is unavailable, do not change the Micro.blog source URL.
3. Run **Actions → Publish lightweight Southall syndication feed → Run workflow**.
4. Verify that `https://davidmarsden.github.io/southall-stories-overrides/syndication.xml` loads valid RSS, contains recent posts, and is below 350 KB.
5. In the **personal** Micro.blog account's **Sources**, replace the Southall Stories source URL with that GitHub Pages feed, and refresh it. Do not add both feeds or duplicate posts may be imported.

This feed is hosted on GitHub Pages, **not** `southallstories.uk/syndication.xml`. A same-domain alias can be considered later, but should not be assumed to exist. It also does not depend on the Micro.blog theme or plugin deployment.

If the upstream feed is unavailable or invalid, the workflow fails rather than deploying an empty feed. Existing published Pages content remains in place.

## Limitations

The feed intentionally contains short plain-text descriptions rather than full articles. The original post links and GUIDs are preserved so subscribers can read the articles on Southall Stories. Publication requires a successful Pages deployment; no live endpoint has been verified yet.
