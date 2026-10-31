#!/usr/bin/env python3
"""Create a compact, standards-compliant RSS feed from Southall Stories' public RSS."""
import argparse
import html
import re
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

SOURCE = "https://southallstories.uk/feed.xml"
MARKDOWN_NS = "http://sourceforge.net/projects/feedparser/"
CONTENT_NS = "http://purl.org/rss/1.0/modules/content/"
MAX_ITEMS = 15
MAX_BYTES = 350_000

def strip_markup(value):
    return re.sub(r"\\s+", " ", html.unescape(re.sub(r"<[^>]*>", " ", value or ""))).strip()

def build(raw):
    root = ET.fromstring(raw)
    channel = root.find("channel")
    if root.tag != "rss" or channel is None:
        raise ValueError("Expected an RSS 2.0 feed with a channel")
    items = channel.findall("item")
    if not items:
        raise ValueError("Source RSS contains no items; refusing to publish an empty feed")
    # Retain standard RSS channel metadata but remove optional large payloads.
    for child in list(channel):
        if child.tag == "item":
            channel.remove(child)
        elif child.tag not in {"title", "link", "description", "language", "lastBuildDate", "pubDate", "ttl", "copyright", "managingEditor", "webMaster"}:
            channel.remove(child)
    for original in items[:MAX_ITEMS]:
        item = ET.SubElement(channel, "item")
        for field in ("title", "link", "guid", "pubDate", "author", "category"):
            for node in original.findall(field):
                item.append(ET.fromstring(ET.tostring(node, encoding="unicode")))
        desc = original.findtext("description") or ""
        if not desc:
            desc = original.findtext(f"{{{CONTENT_NS}}}encoded") or ""
        ET.SubElement(item, "description").text = strip_markup(desc)[:1200]
    result = ET.tostring(root, encoding="utf-8", xml_declaration=True)
    if len(result) > MAX_BYTES:
        raise ValueError(f"Generated feed is unexpectedly large: {len(result)} bytes")
    return result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", default=SOURCE)
    parser.add_argument("--output", default="public/syndication.xml")
    args = parser.parse_args()
    request = urllib.request.Request(args.source, headers={"User-Agent": "SouthallStories-Syndication/1.0"})
    with urllib.request.urlopen(request, timeout=50) as response:
        raw = response.read(12_000_001)
    if len(raw) > 12_000_000:
        raise ValueError("Source feed exceeds 12 MB safety limit")
    result = build(raw)
    target = Path(args.output)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(result)
    # Validate output before publishing.
    ET.parse(target)
    print(f"Generated {target} ({len(result)} bytes)")

if __name__ == "__main__":
    main()
