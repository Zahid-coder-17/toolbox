"""
Technical SEO Audit & Availability Scanner
Performs daily and on-demand automated checks of production endpoints.
"""

import sys
import json
import urllib.request
import urllib.error
import re
from typing import Dict, Any, List

DEFAULT_TARGET_URL = "https://toolbox-1llw.vercel.app"

def fetch_url(url: str, timeout: int = 10) -> Dict[str, Any]:
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "ToolBox-SEO-Auditor/1.0 (Automated Health Check)"}
        )
        with urllib.request.urlopen(req, timeout=timeout) as response:
            body = response.read().decode("utf-8", errors="ignore")
            return {
                "status": response.status,
                "url": url,
                "body": body,
                "headers": dict(response.headers)
            }
    except urllib.error.HTTPError as e:
        return {"status": e.code, "url": url, "error": str(e), "body": ""}
    except Exception as e:
        return {"status": 0, "url": url, "error": str(e), "body": ""}

def run_technical_audit(base_url: str = DEFAULT_TARGET_URL) -> Dict[str, Any]:
    print(f"[*] Starting Technical SEO Audit for: {base_url}")
    results = {
        "target": base_url,
        "robots_status": None,
        "sitemap_status": None,
        "sitemap_url_count": 0,
        "homepage_canonical": None,
        "google_verification_found": False,
        "tested_routes": 0,
        "errors": []
    }

    # 1. Inspect robots.txt
    robots_res = fetch_url(f"{base_url}/robots.txt")
    results["robots_status"] = robots_res["status"]
    if robots_res["status"] == 200:
        if "Disallow: /api/" in robots_res["body"] and "Sitemap:" in robots_res["body"]:
            results["robots_valid"] = True
        else:
            results["errors"].append("robots.txt missing expected directives")
    else:
        results["errors"].append(f"robots.txt failed with status {robots_res['status']}")

    # 2. Inspect sitemap.xml
    sitemap_res = fetch_url(f"{base_url}/sitemap.xml")
    results["sitemap_status"] = sitemap_res["status"]
    urls = []
    if sitemap_res["status"] == 200:
        urls = re.findall(r"<loc>(.*?)</loc>", sitemap_res["body"])
        results["sitemap_url_count"] = len(urls)
    else:
        results["errors"].append(f"sitemap.xml failed with status {sitemap_res['status']}")

    # 3. Inspect Homepage Canonical and Verification
    home_res = fetch_url(f"{base_url}/")
    if home_res["status"] == 200:
        canonical_match = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', home_res["body"], re.I)
        results["homepage_canonical"] = canonical_match.group(1) if canonical_match else None
        
        g_match = re.search(r'<meta[^>]+name=["\']google-site-verification["\'][^>]*>', home_res["body"], re.I)
        results["google_verification_found"] = bool(g_match)
    else:
        results["errors"].append(f"Homepage failed with status {home_res['status']}")

    results["tested_routes"] = len(urls)
    results["success"] = len(results["errors"]) == 0
    return results

if __name__ == "__main__":
    report = run_technical_audit()
    print(json.dumps(report, indent=2))
    if not report["success"]:
        sys.exit(1)
