import { NextResponse } from "next/server"

interface RatingPayload {
  facilityId: string;
  ratings: Record<string, number>;
  feedback?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RatingPayload

    // Validate required fields
    if (!body.facilityId || !body.ratings || Object.keys(body.ratings).length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate ratings are numbers between 1-5
    const validRatings = Object.values(body.ratings).every(
      rating => Number.isInteger(rating) && rating >= 1 && rating <= 5
    )
    
    if (!validRatings) {
      return NextResponse.json(
        { error: "Ratings must be integers between 1 and 5" },
        { status: 400 }
      )
    }

    // Calculate average rating
    const averageRating =
      Object.values(body.ratings).reduce((a, b) => a + b, 0) / 
      Object.values(body.ratings).length

    // Send feedback to FastAPI backend
    const response = await fetch("http://localhost:9000/feedback/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: "anonymous", // You can implement user authentication later
        rating: averageRating,
        comment: body.feedback,
        category: body.facilityId
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to submit feedback")
    }

    return NextResponse.json(
      { 
        message: "Rating received successfully",
        averageRating 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing rating:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

