"""Add is_admin column to users table if missing.

Run once:  python -m scripts.migrate_admin_column
"""
from sqlalchemy import text
from app.database import engine


def run():
    with engine.begin() as conn:
        conn.execute(
            text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS "
                "is_admin BOOLEAN NOT NULL DEFAULT FALSE"
            )
        )
        print("[OK] users.is_admin column ensured")


if __name__ == "__main__":
    run()