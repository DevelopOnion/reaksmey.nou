from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class FacilityBase(BaseModel):
    name: str
    description: Optional[str] = None

class FacilityCreate(FacilityBase):
    pass

class Facility(FacilityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class FeedbackBase(BaseModel):
    user_id: Optional[str] = None
    rating: float
    comment: Optional[str] = None
    facility_id: int

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackResponse(FeedbackBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class FacilityWithFeedback(Facility):
    feedbacks: List[FeedbackResponse] = []
    average_rating: float = 0
    total_feedback: int = 0

    class Config:
        from_attributes = True