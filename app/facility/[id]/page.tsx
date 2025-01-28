import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FacilityRatingForm from "./facility-rating-form"
import StyledContent from "../../components/StyledContent"
import {
  Book,
  Coffee,
  Car,
  Dumbbell,
  School,
  FlaskRoundIcon as Flask,
  Users,
  TreesIcon as Tree,
  TableIcon as Toilet,
} from "lucide-react"

function getFacilitySticker(facilityId: number) {
  const stickers = {
    1: <Book className="w-16 h-16 text-blue-500" />,
    2: <Coffee className="w-16 h-16 text-brown-500" />,
    3: <Car className="w-16 h-16 text-gray-500" />,
    4: <Dumbbell className="w-16 h-16 text-green-500" />,
    5: <School className="w-16 h-16 text-red-500" />,
    6: <Flask className="w-16 h-16 text-purple-500" />,
    7: <Users className="w-16 h-16 text-orange-500" />,
    8: <Tree className="w-16 h-16 text-green-600" />,
    9: <Toilet className="w-16 h-16 text-blue-400" />,
  }
  return (
    <div className="flex justify-center items-center p-4">
      {stickers[facilityId as keyof typeof stickers] || <div className="w-16 h-16 bg-gray-200 rounded-full" />}
    </div>
  )
}

const facilities = [
  {
    id: 1,
    name: "Library",
    averageRating: 0,
    description: "A quiet place for study and research with extensive book collections and digital resources.",
  },
  {
    id: 2,
    name: "Cafeteria",
    averageRating: 0,
    description: "Various food options for students and staff, offering a range of cuisines and dietary options.",
  },
  {
    id: 3,
    name: "Parking Lot",
    averageRating: 0,
    description: "Spacious area for vehicle parking, serving students, staff, and visitors.",
  },
  {
    id: 4,
    name: "Sport Area",
    averageRating: 0,
    description: "Facilities for various sports and physical activities, promoting student health and recreation.",
  },
  {
    id: 5,
    name: "Classroom",
    averageRating: 0,
    description: "Well-equipped learning spaces for lectures and group discussions.",
  },
  {
    id: 6,
    name: "Lab Room",
    averageRating: 0,
    description: "Specialized rooms with equipment for practical experiments and research.",
  },
  { id: 7, name: "Hall", averageRating: 0, description: "Large space for events, gatherings, and ceremonies." },
  {
    id: 8,
    name: "Park in front of IDRI",
    averageRating: 0,
    description: "Green space in front of IDRI, perfect for relaxation and outdoor studying.",
  },
  {
    id: 9,
    name: "Bathroom",
    averageRating: 0,
    description: "Essential facilities for personal hygiene and comfort.",
  },
]

export default function FacilityPage({ params }: { params: { id: string } }) {
  const facility = facilities.find((f) => f.id === Number.parseInt(params.id))

  if (!facility) {
    notFound()
  }

  return (
    <StyledContent>
      <div className="min-h-screen bg-[#f8f7fd] p-8">
        <div className="relative space-y-6 max-w-2xl mx-auto">
          <Card className="overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="bg-[#e2d9f3] p-8 border-b-4 border-black">
              <CardTitle className="custom-title text-4xl text-center">{facility.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white">{getFacilitySticker(facility.id)}</CardContent>
          </Card>
          <div className="bg-[#ffd966] border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="custom-title text-2xl mb-6 text-center">RATE THIS SPOT!</h2>
            <FacilityRatingForm facilityId={facility.id} />
          </div>
        </div>
      </div>
    </StyledContent>
  )
}

export async function generateStaticParams() {
  return facilities.map((facility) => ({
    id: facility.id.toString(),
  }))
}

