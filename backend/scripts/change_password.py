"""Change a user's password.

Usage:
    python -m scripts.change_password admin@vettri.in newpassword123
"""
import sys
from app.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User


def change_password(email: str, new_password: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email.lower()).first()
        if not user:
            print(f"[ERR] No user found with email: {email}")
            return
        user.password_hash = hash_password(new_password)
        db.commit()
        print(f"[OK] Password changed for {user.email}")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python -m scripts.change_password <email> <new_password>")
        sys.exit(1)
    change_password(sys.argv[1], sys.argv[2])