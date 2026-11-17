"""
ToolBox SEO & Growth Engine — FastAPI Application
Exposes programmatic endpoints for automated technical audits, keyword research, and competitor intelligence.
"""

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.app.seo.technical_audit import run_technical_audit
from backend.app.seo.keyword_research import get_keywords_by_category, get_high_opportunity_keywords
from backend.app.seo.competitor_analysis import get_competitor_insights
from backend.app.seo.search_console import fetch_search_console_performance

app = FastAPI(
    title="ToolBox SEO Automation Engine API",
    version="1.0.0",
    description="High-performance backend API powering automated technical audits, keyword tracking, and competitor intelligence."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "service": "ToolBox SEO Automation Engine",
        "status": "Operational",
        "version": "1.0.0"
    }

@app.get("/api/seo/audit")
def get_audit(target: str = Query("https://toolbox-1llw.vercel.app", description="Target domain to audit")):
    return run_technical_audit(target)

@app.get("/api/seo/keywords")
def get_keywords(category: str = Query("all", description="Tool category filter")):
    return {
        "category": category,
        "keywords": get_keywords_by_category(category),
        "high_priority_opportunities": get_high_opportunity_keywords()[:10]
    }

@app.get("/api/seo/competitors")
def get_competitors():
    return {
        "competitors": get_competitor_insights()
    }

@app.get("/api/seo/gsc")
def get_search_console_telemetry(days: int = Query(28, description="Reporting window in days")):
    return fetch_search_console_performance(days=days)
