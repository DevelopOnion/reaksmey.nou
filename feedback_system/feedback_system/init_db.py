from sqlalchemy.orm import Session
from . import models
from .database import SessionLocal

def init_facilities():
    facilities = [
        {"name": "Library", "description": "Main campus library"},
        {"name": "Cafeteria", "description": "Main dining area"},
        {"name": "Parking Lot", "description": "Student parking area"},
        {"name": "Sport Area", "description": "Sports and recreation facilities"},
        {"name": "Classroom", "description": "General purpose classrooms"},
        {"name": "Lab Room", "description": "Research and teaching laboratories"},
        {"name": "Hall", "description": "Main assembly hall"},
        {"name": "Park", "description": "Campus park and recreation area"},
        {"name": "Bathroom", "description": "Campus restrooms"},
    ]
    
    db = SessionLocal()
    try:
        # Check if facilities already exist
        if db.query(models.Facility).first() is None:
            for facility in facilities:
                db_facility = models.Facility(**facility)
                db.add(db_facility)
            db.commit()
            print("Facilities initialized successfully")
        else:
            print("Facilities already initialized")
    finally:
        db.close()

if __name__ == "__main__":
    init_facilities() 