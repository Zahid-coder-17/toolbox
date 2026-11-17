"""
Intelligent Keyword Research & Clustering Engine
Manages target keywords, intent categorization, search volume tiers, and URL mappings.
"""

from typing import List, Dict, Any

KEYWORD_INVENTORY = [
    {"keyword": "word counter", "category": "text", "volume": 1800000, "intent": "Transactional", "url": "/tools/text/word-counter", "difficulty": 45},
    {"keyword": "character counter", "category": "text", "volume": 450000, "intent": "Transactional", "url": "/tools/text/character-counter", "difficulty": 30},
    {"keyword": "case converter", "category": "text", "volume": 300000, "intent": "Transactional", "url": "/tools/text/case-converter", "difficulty": 25},
    {"keyword": "json formatter", "category": "text", "volume": 650000, "intent": "Transactional", "url": "/tools/text/json-formatter", "difficulty": 48},
    {"keyword": "base64 encoder decoder", "category": "text", "volume": 500000, "intent": "Transactional", "url": "/tools/text/base64-encoder-decoder", "difficulty": 35},
    {"keyword": "text diff checker", "category": "text", "volume": 220000, "intent": "Transactional", "url": "/tools/text/text-diff-checker", "difficulty": 32},
    {"keyword": "slug generator", "category": "text", "volume": 90000, "intent": "Transactional", "url": "/tools/text/slug-generator", "difficulty": 20},
    {"keyword": "uuid generator", "category": "text", "volume": 400000, "intent": "Transactional", "url": "/tools/text/uuid-generator", "difficulty": 34},
    {"keyword": "image compressor", "category": "image", "volume": 1200000, "intent": "Transactional", "url": "/tools/image/image-compressor", "difficulty": 62},
    {"keyword": "image resizer", "category": "image", "volume": 850000, "intent": "Transactional", "url": "/tools/image/image-resizer", "difficulty": 50},
    {"keyword": "jpg to png", "category": "image", "volume": 950000, "intent": "Transactional", "url": "/tools/image/jpg-to-png", "difficulty": 45},
    {"keyword": "png to webp", "category": "image", "volume": 320000, "intent": "Transactional", "url": "/tools/image/png-to-webp", "difficulty": 38},
    {"keyword": "heic to jpg", "category": "image", "volume": 1100000, "intent": "Transactional", "url": "/tools/image/heic-to-jpg", "difficulty": 58},
    {"keyword": "qr code generator", "category": "image", "volume": 2200000, "intent": "Transactional", "url": "/tools/image/qr-code-generator", "difficulty": 75},
    {"keyword": "favicon generator", "category": "image", "volume": 180000, "intent": "Transactional", "url": "/tools/image/favicon-generator", "difficulty": 35},
    {"keyword": "color picker from image", "category": "image", "volume": 750000, "intent": "Transactional", "url": "/tools/image/color-picker", "difficulty": 48},
    {"keyword": "pdf compressor", "category": "pdf", "volume": 2500000, "intent": "Transactional", "url": "/tools/pdf/pdf-compressor", "difficulty": 78},
    {"keyword": "pdf merger", "category": "pdf", "volume": 3100000, "intent": "Transactional", "url": "/tools/pdf/pdf-merger", "difficulty": 82},
    {"keyword": "pdf splitter", "category": "pdf", "volume": 650000, "intent": "Transactional", "url": "/tools/pdf/pdf-splitter", "difficulty": 52},
    {"keyword": "pdf to jpg", "category": "pdf", "volume": 1400000, "intent": "Transactional", "url": "/tools/pdf/pdf-to-jpg", "difficulty": 65},
    {"keyword": "age calculator", "category": "calculators", "volume": 3800000, "intent": "Transactional", "url": "/tools/calculators/age-calculator", "difficulty": 70},
    {"keyword": "percentage calculator", "category": "calculators", "volume": 2900000, "intent": "Transactional", "url": "/tools/calculators/percentage-calculator", "difficulty": 68},
    {"keyword": "emi calculator", "category": "calculators", "volume": 1900000, "intent": "Transactional", "url": "/tools/calculators/emi-calculator", "difficulty": 74},
    {"keyword": "compound interest calculator", "category": "calculators", "volume": 800000, "intent": "Transactional", "url": "/tools/calculators/compound-interest-calculator", "difficulty": 60},
]

def get_keywords_by_category(category: str) -> List[Dict[str, Any]]:
    if category == "all":
        return KEYWORD_INVENTORY
    return [kw for kw in KEYWORD_INVENTORY if kw["category"] == category]

def calculate_priority_score(volume: int, difficulty: int) -> float:
    # High volume + low difficulty = highest priority
    score = (volume / 50000) * (1 - (difficulty / 100))
    return round(score, 2)

def get_high_opportunity_keywords() -> List[Dict[str, Any]]:
    opportunities = []
    for kw in KEYWORD_INVENTORY:
        score = calculate_priority_score(kw["volume"], kw["difficulty"])
        opportunities.append({**kw, "priority_score": score})
    return sorted(opportunities, key=lambda x: x["priority_score"], reverse=True)
