import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  // Here you would typically save this data to your database
  // You'd want to calculate an average rating from the aspect ratings
  const averageRating =
    Object.values(body.ratings).reduce((a: number, b: number) => a + b, 0) / Object.values(body.ratings).length

  console.log("Received rating:", {
    facilityId: body.facilityId,
    averageRating,
    aspectRatings: body.ratings,
    feedback: body.feedback,
  })

  // For now, we'll just send back a success response
  return NextResponse.json({ message: "Rating received successfully" })
}

