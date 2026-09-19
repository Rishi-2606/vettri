"""Add the initial 12 base schemes from frontend/src/data/schemes.json.

Merge-safe: existing slugs are skipped, nothing is deleted.

Usage:  python -m scripts.seed_initial
"""
import json
from pathlib import Path
from datetime import date
from app.database import SessionLocal, Base, engine
from app.models.scheme import Scheme


def seed_from_json(json_path: Path):
    data = json.loads(json_path.read_text(encoding="utf-8"))
    db = SessionLocal()
    added, skipped = 0, 0
    try:
        for s in data:
            existing = db.query(Scheme).filter(Scheme.slug == s["slug"]).first()
            if existing:
                skipped += 1
                continue

            benefits = s.get("benefits", {})
            elig = s.get("eligibility", {})

            scheme = Scheme(
                slug=s["slug"],
                short_name=s["shortName"],
                category=s["category"],
                status=s.get("status", "active"),
                name=s["name"],
                department=s["department"],
                description=s["description"],
                min_age=elig.get("minAge"),
                max_age=elig.get("maxAge"),
                max_income=elig.get("maxIncome"),
                eligible_categories=elig.get("category"),
                eligible_genders=elig.get("gender"),
                eligible_business_status=elig.get("businessStatus"),
                education=elig.get("education"),
                max_loan=benefits.get("maxLoan"),
                interest_rate=benefits.get("interestRate"),
                subsidy_percent=benefits.get("subsidyPercent") or 0,
                moratorium=benefits.get("moratorium"),
                repayment_years=benefits.get("repaymentYears"),
                documents=s.get("documents", []),
                source_url=s.get("sourceUrl"),
                last_verified=date.fromisoformat(s["lastVerified"])
                if s.get("lastVerified")
                else None,
            )
            db.add(scheme)
            added += 1
        db.commit()
        total = db.query(Scheme).count()
        print(f"[OK] Added: {added}, Skipped: {skipped}")
        print(f"[OK] Total schemes in DB: {total}")
    finally:
        db.close()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    json_path = Path("../frontend/src/data/schemes.json")
    if not json_path.exists():
        raise SystemExit(f"Missing {json_path}")
    seed_from_json(json_path)