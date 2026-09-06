"""Check the actual generated site; do not depend on any particular sample post."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote, urlparse, quote
import json
import os
import subprocess

root = Path('dist').resolve()
report_dir = Path('verification')
report_dir.mkdir(exist_ok=True)
required = ['index.html', 'about/index.html', 'tags/index.html', 'atom.xml', 'rss.xml', 'sitemap-index.xml']
for relative in required:
    assert (root / relative).is_file(), f'Missing generated page: {relative}'

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if value and key in {'src', 'href'}:
                self.urls.append(value)

banned = ['retypeset-comment.radishzz.cc', 'views.radishzz.cc', 'api.apiflash.com', 'dab0e4b9-9cbf-43c3-af60-b09d3b545c38', 'AUCrz5F1e5qbnmKKDXl2Sf8u6y0kOpEO1wLs6HMMmlM']
failures = []
for page in root.rglob('*.html'):
    text = page.read_text(encoding='utf-8')
    for value in banned:
        assert value not in text, f'Demo integration remains in {page}: {value}'
    parser = Links()
    parser.feed(text)
    for value in parser.urls:
        url = urlparse(value)
        if url.scheme in {'mailto', 'tel', 'data', 'javascript'} or value.startswith('#'):
            continue
        if url.netloc and url.netloc != 'codesica.github.io':
            continue
        if not url.path:
            continue
        path = unquote(url.path)
        target = (root / path.lstrip('/')) if path.startswith('/') else (page.parent / path)
        if not target.exists() and not (target / 'index.html').is_file():
            failures.append(f'{page.relative_to(root)} -> {value}')
assert not failures, '\n'.join(failures)

posts = sorted(root.glob('posts/**/index.html'))
first_post = '/' + posts[0].parent.relative_to(root).as_posix() + '/' if posts else ''
report = {'required_pages': required, 'html_pages': len(list(root.rglob('*.html'))), 'post_count': len(posts), 'first_post': first_post, 'internal_links': 'pass', 'demo_tracking_removed': True}
(report_dir / 'static-checks.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
(report_dir / 'first-post.txt').write_text(quote(first_post, safe='/'), encoding='utf-8')
sha = os.environ.get('GITHUB_SHA') or subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip()
(root / 'build.json').write_text(json.dumps({'commit': sha, 'first_post': first_post}), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))
