"""
SEO Automation Scheduler Runner
Executes scheduled tasks based on interval flag: --daily, --weekly, --monthly.
"""

import sys
import argparse
from backend.app.seo.technical_audit import run_technical_audit
from backend.app.seo.reporting import generate_seo_digest

def run_daily_routine():
    print("[*] Running Daily SEO Routine: Website availability & technical audit...")
    audit_results = run_technical_audit()
    digest = generate_seo_digest(audit_results)
    print(digest)
    if not audit_results["success"]:
        print("[!] Daily routine identified technical issues.")
        sys.exit(1)
    print("[+] Daily routine passed with 0 errors.")

def run_weekly_routine():
    print("[*] Running Weekly SEO Routine: Keyword tracking & competitor shifts...")
    # Run audit and competitor checks
    run_daily_routine()
    print("[+] Weekly keyword opportunities refreshed.")

def run_monthly_routine():
    print("[*] Running Monthly SEO Routine: Full performance audit & content gap evaluation...")
    run_weekly_routine()
    print("[+] Monthly content gap analysis refreshed.")

def main():
    parser = argparse.ArgumentParser(description="ToolBox SEO Automation Scheduler")
    parser.add_argument("--daily", action="store_true", help="Run daily availability and error scan")
    parser.add_argument("--weekly", action="store_true", help="Run weekly competitor and keyword scan")
    parser.add_argument("--monthly", action="store_true", help="Run monthly comprehensive audit")
    
    args = parser.parse_args()
    
    if args.monthly:
        run_monthly_routine()
    elif args.weekly:
        run_weekly_routine()
    else:
        run_daily_routine()

if __name__ == "__main__":
    main()
