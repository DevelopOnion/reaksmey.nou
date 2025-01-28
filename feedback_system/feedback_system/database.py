from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Using SQLite for simplicity. This will create a file named 'feedback.db' in your current directory
SQLALCHEMY_DATABASE_URL = "sqlite:///./feedback.db"

# Create the SQLite engine. The check_same_thread=False argument is needed for SQLite only
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()