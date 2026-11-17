"""
AI SEO Content Generator & Brief Builder
Generates structured outlines for high-intent educational guides and tutorials.
"""

from typing import Dict, Any, List

def generate_article_brief(topic: str, primary_keyword: str, category: str) -> Dict[str, Any]:
    """
    Generates a structured outline and SEO metadata for an educational guide.
    Ensures informational intent without cannibalizing the core interactive tool.
    """
    slug = primary_keyword.lower().replace(" ", "-").replace("?", "").replace(":", "")
    
    return {
        "title": f"Complete Guide: {topic}",
        "slug": slug,
        "primary_keyword": primary_keyword,
        "category": category,
        "suggested_word_count": 1200,
        "search_intent": "Informational",
        "recommended_sections": [
            {
                "heading": f"Understanding {topic}",
                "guidance": "Explain the core mechanics, underlying mathematics, or technical challenges."
            },
            {
                "heading": "Why Privacy and Client-Side Execution Matter",
                "guidance": "Highlight how in-browser execution prevents confidential data leaks."
            },
            {
                "heading": "Step-by-Step Practical Walkthrough",
                "guidance": "Numbered practical steps linking directly to the relevant ToolBox utility."
            },
            {
                "heading": "Frequently Asked Questions",
                "guidance": "Address 3-5 specific questions about file limits, mobile usage, and format fidelity."
            }
        ]
    }
