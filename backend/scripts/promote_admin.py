"""Promote a user to admin.

Usage:
    python -m scripts.promote_admin user@example.com
"""
import sys
from app.database import SessionLocal
from app.models.user import User


def promote(email: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email.lower()).first()
        if not user:
            print(f"[ERR] No user found with email: {email}")
            return
        user.is_admin = True
        db.commit()
        print(f"[OK] {user.email} is now an admin")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python -m scripts.promote_admin <email>")
        sys.exit(1)
    promote(sys.argv[1])