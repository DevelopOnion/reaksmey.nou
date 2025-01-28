from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from . import models
from . import schemas
from .database import engine, get_db

# Create FastAPI instance
app = FastAPI()

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Route to create feedback
@app.post("/feedback/", response_model=schemas.FeedbackResponse)
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    db_feedback = models.Feedback(
        user_id=feedback.user_id,
        rating=feedback.rating,
        comment=feedback.comment,
        category=feedback.category
    )
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