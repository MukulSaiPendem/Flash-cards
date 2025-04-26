"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Flashcard } from "@/lib/types"
import FlashcardComponent from "@/components/flashcard"

export default function ReviewFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [categories, setCategories] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = (id: string) => {
    // Remove the deleted flashcard from the state
    const updatedFlashcards = flashcards.filter((card) => card.id !== id)
    setFlashcards(updatedFlashcards)

    // Update filtered flashcards
    if (selectedCategory === "All") {
      setFilteredFlashcards(updatedFlashcards)
    } else {
      setFilteredFlashcards(updatedFlashcards.filter((card) => card.category === selectedCategory))
    }

    // Adjust current index if needed
    if (currentIndex >= filteredFlashcards.length - 1) {
      setCurrentIndex(Math.max(0, filteredFlashcards.length - 2))
    }
  }

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await fetch("/api/flashcards")
        if (!response.ok) {
          throw new Error("Failed to fetch flashcards")
        }

        const data = await response.json()
        setFlashcards(data)

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map((card: Flashcard) => card.category))) as string[]

        setCategories(["All", ...uniqueCategories])
        setFilteredFlashcards(data)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load flashcards",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFlashcards()
  }, [toast])

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredFlashcards(flashcards)
    } else {
      setFilteredFlashcards(flashcards.filter((card) => card.category === selectedCategory))
    }
    setCurrentIndex(0)
  }, [selectedCategory, flashcards])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredFlashcards.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredFlashcards.length - 1 ? prev + 1 : 0))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  if (filteredFlashcards.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Review Flashcards</h1>
        <Card className="p-8 max-w-md mx-auto">
          <p className="text-gray-600 mb-4">No flashcards found. Create some flashcards to start reviewing!</p>
          <Button onClick={() => router.push("/create")} className="bg-rose-500 hover:bg-rose-600">
            Create Flashcards
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Review Flashcards</h1>

      <div className="max-w-md mx-auto mb-8">
        <Label htmlFor="category-filter" className="mb-2 block">
          Filter by Category
        </Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger id="category-filter">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-rose-500 h-2.5 rounded-full"
            style={{ width: `${((currentIndex + 1) / filteredFlashcards.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-center mt-2 text-sm text-gray-600">
          {currentIndex + 1} of {filteredFlashcards.length}
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <FlashcardComponent flashcard={filteredFlashcards[currentIndex]} onDelete={handleDelete} />
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={handlePrevious} className="bg-teal-500 hover:bg-teal-600" aria-label="Previous flashcard">
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={handleNext} className="bg-teal-500 hover:bg-teal-600" aria-label="Next flashcard">
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
