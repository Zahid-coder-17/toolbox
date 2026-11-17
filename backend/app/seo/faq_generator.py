"""
Automated FAQ Generator & Schema Formatter
Generates tool-specific technical and security questions based on real user queries.
"""

from typing import List, Dict, Any

STANDARD_FAQ_TEMPLATES = [
    {
        "pattern": "What is the {tool_name} tool?",
        "answer_template": "The {tool_name} is a free online utility designed for {category} workflows, processing your data directly in your browser without server uploads."
    },
    {
        "pattern": "Is {tool_name} completely free to use?",
        "answer_template": "Yes, 100% free with no registration, subscriptions, or hidden limits."
    },
    {
        "pattern": "Is my data private and secure?",
        "answer_template": "Yes. All processing executes locally in your device browser. No documents, images, or texts are ever uploaded or saved on external servers."
    },
    {
        "pattern": "Can I use {tool_name} on mobile phones?",
        "answer_template": "Yes. The interface is fully responsive on iOS Safari and Android Chrome with touch-friendly controls."
    }
]

def generate_tool_faqs(tool_name: str, category: str) -> List[Dict[str, str]]:
    faqs = []
    for item in STANDARD_FAQ_TEMPLATES:
        q = item["pattern"].format(tool_name=tool_name, category=category)
        a = item["answer_template"].format(tool_name=tool_name, category=category)
        faqs.append({"question": q, "answer": a})
    return faqs
