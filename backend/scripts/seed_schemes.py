"""Seed schemes from frontend schemes.json into PostgreSQL.

Run:  python -m scripts.seed_schemes
"""
import json
from pathlib import Path
from datetime import date
from app.database import SessionLocal, Base, engine
from app.models.scheme import Scheme


def seed_from_json(json_path: Path):
    data = json.loads(json_path.read_text(encoding="utf-8"))
    db = SessionLocal()
    try:
        # Wipe existing (dev only)
        db.query(Scheme).delete()
        db.commit()

        for s in data:
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
                if s.get("lastVerified") else None,
            )
            db.add(scheme)
        db.commit()
        count = db.query(Scheme).count()
        print(f"[OK] Seeded {count} schemes")
    finally:
        db.close()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)

    # Look for schemes.json in the frontend folder
    json_path = Path("../frontend/src/data/schemes.json")
    if not json_path.exists():
        raise SystemExit(
            f"Missing {json_path}. "
            "Run 'npm run export-schemes' in frontend first."
        )
    seed_from_json(json_path)