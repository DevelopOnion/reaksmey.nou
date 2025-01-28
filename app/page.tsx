"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StyledContent from "./components/StyledContent"
import { useEffect, useState } from "react"

// This would typically come from a database
const facilities = [
  { id: 1, name: "Library", averageRating: 0 },
  { id: 2, name: "Cafeteria", averageRating: 0 },
  { id: 3, name: "Parking Lot", averageRating: 0 },
  { id: 4, name: "Sport Area", averageRating: 0 },
  { id: 5, name: "Classroom", averageRating: 0 },
  { id: 6, name: "Lab Room", averageRating: 0 },
  { id: 7, name: "Hall", averageRating: 0 },
  { id: 8, name: "Park", averageRating: 0 },
  { id: 9, name: "Bathroom", averageRating: 0 },
]

export default function Home() {
  const [ratedFacilities, setRatedFacilities] = useState<number[]>([])

  useEffect(() => {
    const rated = JSON.parse(localStorage.getItem("ratedFacilities") || "[]")
    setRatedFacilities(rated)
  }, [])

  return (
    <StyledContent>
      <div className="min-h-screen bg-[#f8f7fd] p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl text-center mb-12 custom-title">RATE YOUR CAMPUS SPOTS</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <Card
                key={facility.id}
                className="group border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
              >
                <CardHeader className="bg-[#e2d9f3] border-b-4 border-black p-6">
                  <CardTitle className="flex justify-between items-center text-xl custom-title">
                    {facility.name}
                    <div className="flex flex-col items-end">
                      <span className="text-base font-normal bg-white px-3 py-1 rounded-full border-2 border-black">
                        {facility.averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs mt-1">
                        {ratedFacilities.includes(facility.id) ? "You've rated" : "Not rated yet"}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <Button
                    asChild
                    className="w-full bg-[#ffd966] hover:bg-[#ffd966]/90 text-black border-2 border-black font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Link href={`/facility/${facility.id}`}>
                      {ratedFacilities.includes(facility.id) ? "RATE AGAIN" : "RATE NOW!"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </StyledContent>
  )
}

