"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

const aspectsForFacility = {
  1: ["Quietness", "Book Availability", "Study Space", "Internet Speed"],
  2: ["Food Quality", "Variety", "Cleanliness", "Price"],
  3: ["Availability", "Security", "Lighting", "Accessibility"],
  4: ["Equipment Quality", "Cleanliness", "Availability", "Variety of Sports"],
  5: ["Comfort", "Technology", "Acoustics", "Lighting"],
  6: ["Equipment Quality", "Safety", "Cleanliness", "Space"],
  7: ["Capacity", "Acoustics", "Comfort", "Technology"],
  8: ["Cleanliness", "Seating", "Greenery", "Quietness"],
  9: ["Cleanliness", "Availability", "Privacy", "Maintenance"],
}

export default function FacilityRatingForm({ facilityId }: { facilityId: number }) {
  const [ratings, setRatings] = useState<{ [key: string]: number }>({})
  const [feedback, setFeedback] = useState("")
  const router = useRouter()

  const aspects = aspectsForFacility[facilityId as keyof typeof aspectsForFacility] || []

  const isFormComplete = useMemo(() => {
    return aspects.every((aspect) => ratings[aspect] !== undefined)
  }, [aspects, ratings])

  const handleRatingChange = (aspect: string, value: number) => {
    setRatings((prev) => ({ ...prev, [aspect]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormComplete) return
    console.log({ facilityId, ratings, feedback })

    // Update local storage
    const ratedFacilities = JSON.parse(localStorage.getItem("ratedFacilities") || "[]")
    if (!ratedFacilities.includes(facilityId)) {
      ratedFacilities.push(facilityId)
      localStorage.setItem("ratedFacilities", JSON.stringify(ratedFacilities))
    }

    alert("Thank you for your feedback!")
    router.push("/") // Redirect to the main page
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {aspects.map((aspect) => (
        <div key={aspect} className="bg-white border-2 border-black rounded-xl p-4">
          <Label className="text-lg font-bold mb-2 block">{aspect}</Label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer transition-all ${
                  star <= (ratings[aspect] || 0) ? "text-black fill-black" : "text-gray-300"
                }`}
                onClick={() => handleRatingChange(aspect, star)}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="bg-white border-2 border-black rounded-xl p-4">
        <Label htmlFor="feedback" className="text-lg font-bold mb-2 block">
          Additional Feedback
        </Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="border-2 border-black rounded-lg focus:ring-2 focus:ring-black"
        />
      </div>
      <Button
        type="submit"
        disabled={!isFormComplete}
        className={`w-full text-white text-lg font-bold py-4 rounded-xl transition-colors ${
          isFormComplete ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isFormComplete ? "SUBMIT RATING" : "COMPLETE ALL RATINGS TO SUBMIT"}
      </Button>
    </form>
  )
}

