from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with feedback
    feedbacks = relationship("Feedback", back_populates="facility")

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), nullable=True)
    rating = Column(Float)
    comment = Column(Text, nullable=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with facility
    facility = relationship("Facility", back_populates="feedbacks")