import urllib.request
import re
import time
import json

base_url = 'https://toolbox-1llw.vercel.app'
sitemap_url = f'{base_url}/sitemap.xml'

print('Fetching sitemap from:', sitemap_url)
req = urllib.request.Request(sitemap_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
with urllib.request.urlopen(req) as resp:
    sitemap_xml = resp.read().decode('utf-8')

urls = re.findall(r'<loc>(.*?)</loc>', sitemap_xml)
print(f'Discovered {len(urls)} URLs in sitemap.')

audit_results = []
for idx, url in enumerate(urls, 1):
    start = time.time()
    try:
        r = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'})
        with urllib.request.urlopen(r, timeout=12) as response:
            latency = int((time.time() - start) * 1000)
            status = response.status
            body = response.read().decode('utf-8', errors='ignore')
            
            title_m = re.search(r'<title>(.*?)</title>', body, re.IGNORECASE)
            title = title_m.group(1).strip() if title_m else 'MISSING'
            
            desc_m = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', body, re.IGNORECASE)
            if not desc_m:
                desc_m = re.search(r'<meta[^>]*content=["\'](.*?)["\'][^>]*name=["\']description["\']', body, re.IGNORECASE)
            desc = desc_m.group(1).strip() if desc_m else 'MISSING'
            
            canon_m = re.search(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', body, re.IGNORECASE)
            canonical = canon_m.group(1).strip() if canon_m else 'MISSING'
            
            robots_m = re.search(r'<meta[^>]*name=["\']robots["\'][^>]*content=["\'](.*?)["\']', body, re.IGNORECASE)
            robots = robots_m.group(1).strip() if robots_m else 'default'
            
            h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', body, re.IGNORECASE | re.DOTALL)
            
            schemas = re.findall(r'"@type"\s*:\s*"([^"]+)"', body)
            
            og_title = bool(re.search(r'property=["\']og:title["\']', body))
            og_image = bool(re.search(r'property=["\']og:image["\']', body))
            
            result = {
                'url': url,
                'status': status,
                'latency_ms': latency,
                'title_len': len(title),
                'title': title[:60] + '...' if len(title) > 60 else title,
                'desc_len': len(desc),
                'desc': desc[:80] + '...' if len(desc) > 80 else desc,
                'canonical_match': canonical == url,
                'canonical': canonical,
                'robots': robots,
                'h1_count': len(h1s),
                'schemas': list(set(schemas)),
                'og_present': og_title and og_image,
                'size_bytes': len(body)
            }
            audit_results.append(result)
            print(f"[{idx:02d}/{len(urls):02d}] {status} ({latency}ms) {url}")
            print(f"     Title: {result['title']} ({result['title_len']} chars)")
            print(f"     H1 count: {len(h1s)} | Canon match: {canonical == url} | Robots: {robots} | Schemas: {result['schemas']}")
    except Exception as e:
        print(f"[{idx:02d}/{len(urls):02d}] ERR {url} -> {e}")
        audit_results.append({'url': url, 'status': 'ERR', 'error': str(e)})

with open('audit_results.json', 'w', encoding='utf-8') as f:
    json.dump(audit_results, f, indent=2)

print(f"\nAudit completed for {len(audit_results)} URLs. Results saved to audit_results.json")
