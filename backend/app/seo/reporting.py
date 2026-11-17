"""
Automated SEO Reporting & Digest Engine
Compiles daily health status, weekly competitor shifts, and monthly keyword digests.
"""

from datetime import datetime
from typing import Dict, Any

def generate_seo_digest(audit_data: Dict[str, Any]) -> str:
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    
    report = f"""# ToolBox Automated SEO Digest
**Generated At:** {timestamp}
**Target Site:** {audit_data.get('target', 'https://toolbox-1llw.vercel.app')}

## Health Summary
- **Robots.txt Status:** {audit_data.get('robots_status', 'Unknown')}
- **Sitemap Status:** {audit_data.get('sitemap_status', 'Unknown')}
- **Total Sitemap URLs:** {audit_data.get('sitemap_url_count', 0)}
- **Homepage Canonical:** {audit_data.get('homepage_canonical', 'Unknown')}
- **Google Verification Tag:** {'Present' if audit_data.get('google_verification_found') else 'Absent'}
- **Errors Encountered:** {len(audit_data.get('errors', []))}

---
*Report generated automatically by ToolBox AI SEO Growth Engine.*
"""
    return report
