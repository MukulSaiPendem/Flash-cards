"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface CategoryCount {
  category: string
  count: number
}

export default function FlashcardGrid() {
  const [categories, setCategories] = useState<CategoryCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }

        const data = await response.json()
        setCategories(data)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load categories",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [toast])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-32 animate-pulse">
            <CardContent className="p-6 flex items-center justify-center">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600">No flashcards yet. Create your first flashcard!</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link href={`/review?category=${category.category}`} key={`${category.category}-${category.count}`}>
          <Card className="h-32 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              <h3 className="font-medium text-lg mb-2">{category.category}</h3>
              <Badge variant="outline">{category.count} cards</Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
