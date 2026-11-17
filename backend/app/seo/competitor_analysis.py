"""
Competitor Intelligence & Benchmark Engine
Monitors competitor strengths, weaknesses, and calculates tactical advantages.
"""

from typing import List, Dict, Any

COMPETITOR_DATABASE = [
    {
        "domain": "smallseotools.com",
        "category": "text",
        "domain_rating": 84,
        "traffic_tier": "Very High",
        "weakness": "Excessive intrusive video ads, interstitial redirects, remote server logging",
        "toolbox_advantage": "Clean interface, zero ad clutter on tools, 100% in-browser privacy guarantee"
    },
    {
        "domain": "ilovepdf.com",
        "category": "pdf",
        "domain_rating": 89,
        "traffic_tier": "Very High",
        "weakness": "Files uploaded to third-party cloud servers; strict task rate limits for free tier",
        "toolbox_advantage": "Zero server uploads; files processed inside client RAM via WebAssembly/pdf-lib"
    },
    {
        "domain": "tinypng.com",
        "category": "image",
        "domain_rating": 88,
        "traffic_tier": "High",
        "weakness": "Capped at 20 images of 5MB each on free tier; uploads image data to external servers",
        "toolbox_advantage": "Unlimited client-side batch conversions without upload limits or subscription paywalls"
    },
    {
        "domain": "calculator.net",
        "category": "calculators",
        "domain_rating": 86,
        "traffic_tier": "Very High",
        "weakness": "Outdated desktop-centric tables that clip on mobile viewports; no direct CSV export",
        "toolbox_advantage": "Touch-friendly modern cards, real-time reactive sliders, downloadable CSV schedules"
    }
]

def get_competitor_insights() -> List[Dict[str, Any]]:
    return COMPETITOR_DATABASE

def compare_domain(target_category: str) -> List[Dict[str, Any]]:
    return [c for c in COMPETITOR_DATABASE if c["category"] == target_category]
