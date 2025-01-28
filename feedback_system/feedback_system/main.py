from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from . import models, schemas
from .database import engine, get_db

# Create FastAPI instance
app = FastAPI()

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Facility routes
@app.post("/facilities/", response_model=schemas.Facility)
def create_facility(facility: schemas.FacilityCreate, db: Session = Depends(get_db)):
    db_facility = models.Facility(**facility.dict())
    db.add(db_facility)
    db.commit()
    db.refresh(db_facility)
    return db_facility

@app.get("/facilities/", response_model=List[schemas.FacilityWithFeedback])
def get_all_facilities(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    facilities = db.query(models.Facility).offset(skip).limit(limit).all()
    
    # Calculate analytics for each facility
    result = []
    for facility in facilities:
        avg_rating = db.query(func.avg(models.Feedback.rating))\
            .filter(models.Feedback.facility_id == facility.id)\
            .scalar() or 0
        total_feedback = db.query(models.Feedback)\
            .filter(models.Feedback.facility_id == facility.id)\
            .count()
        
        facility_data = schemas.FacilityWithFeedback(
            id=facility.id,
            name=facility.name,
            description=facility.description,
            created_at=facility.created_at,
            feedbacks=facility.feedbacks,
            average_rating=float(avg_rating),
            total_feedback=total_feedback
        )
        result.append(facility_data)
    
    return result

@app.get("/facilities/{facility_id}", response_model=schemas.FacilityWithFeedback)
def get_facility(facility_id: int, db: Session = Depends(get_db)):
    facility = db.query(models.Facility).filter(models.Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    avg_rating = db.query(func.avg(models.Feedback.rating))\
        .filter(models.Feedback.facility_id == facility_id)\
        .scalar() or 0
    total_feedback = db.query(models.Feedback)\
        .filter(models.Feedback.facility_id == facility_id)\
        .count()
    
    return schemas.FacilityWithFeedback(
        id=facility.id,
        name=facility.name,
        description=facility.description,
        created_at=facility.created_at,
        feedbacks=facility.feedbacks,
        average_rating=float(avg_rating),
        total_feedback=total_feedback
    )

# Feedback routes
@app.post("/feedback/", response_model=schemas.FeedbackResponse)
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    # Verify facility exists
    facility = db.query(models.Facility).filter(models.Facility.id == feedback.facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    db_feedback = models.Feedback(**feedback.dict())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

# Route to get all feedback
@app.get("/feedback/", response_model=List[schemas.FeedbackResponse])
def get_all_feedback(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    feedbacks = db.query(models.Feedback).offset(skip).limit(limit).all()
    return feedbacks

# Route to get feedback analytics
@app.get("/feedback/analytics")
def get_feedback_analytics(db: Session = Depends(get_db)):
    total_feedback = db.query(models.Feedback).count()
    avg_rating = db.query(func.avg(models.Feedback.rating)).scalar() or 0
    
    return {
        "total_feedback": total_feedback,
        "average_rating": float(avg_rating)
    }

# Route to get facility-specific analytics
@app.get("/feedback/facility/{facility_id}")
def get_facility_analytics(facility_id: str, db: Session = Depends(get_db)):
    facility_feedback = db.query(models.Feedback).filter(models.Feedback.category == facility_id)
    total_feedback = facility_feedback.count()
    avg_rating = facility_feedback.with_entities(func.avg(models.Feedback.rating)).scalar() or 0
    
    return {
        "total_feedback": total_feedback,
        "average_rating": float(avg_rating)
    }

if __name__ == "__main__":
    import uvicorn
    import socket
    
    def find_free_port(start_port=8000):
        port = start_port
        max_port = start_port + 1000
        
        while port < max_port:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.bind(('', port))
                    s.listen(1)
                    print(f"Found free port: {port}")
                    return port
            except OSError:
                port += 1
        raise RuntimeError("Could not find a free port")
    
    try:
        port = find_free_port(9000)
        print(f"Starting server on port {port}")
        uvicorn.run(app, host="0.0.0.0", port=port)
    except Exception as e:
        print(f"Failed to start server: {e}")