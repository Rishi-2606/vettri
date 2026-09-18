"""Add rules_json column to schemes and recommendation_feedback table.

Run once: python -m scripts.add_rules_v2
"""
from sqlalchemy import text
from app.database import engine, Base

# Import all models to register them with SQLAlchemy metadata
from app.models import (  # noqa: F401
    User,
    Profile,
    Scheme,
    UserDocument,
    RecommendationFeedback,
)


def run():
    with engine.begin() as conn:
        conn.execute(
            text("ALTER TABLE schemes ADD COLUMN IF NOT EXISTS rules_json JSONB")
        )
        print("[OK] schemes.rules_json column ensured")

    Base.metadata.create_all(bind=engine)
    print("[OK] recommendation_feedback + user_documents tables ensured")


if __name__ == "__main__":
    run()