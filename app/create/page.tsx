"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateFlashcard() {
  const [frontText, setFrontText] = useState("")
  const [backText, setBackText] = useState("")
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [categories, setCategories] = useState(["General", "Science", "Math", "History", "Language", "Programming"])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (response.ok) {
          const data = await response.json()
          const categoryNames = data.map((item: { category: string }) => item.category)
          // Combine with default categories and remove duplicates
          setCategories([...new Set([...categories, ...categoryNames])])
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!frontText || !backText) {
      toast({
        title: "Error",
        description: "Please fill in both front and back text fields",
        variant: "destructive",
      })
      return
    }

    const finalCategory = isCustomCategory && customCategory ? customCategory : category || "General"

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frontText,
          backText,
          category: finalCategory,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your flashcard has been created",
        })
        setFrontText("")
        setBackText("")
        setCategory("")
        setCustomCategory("")

        // If it was a new category, add it to the list
        if (isCustomCategory && customCategory && !categories.includes(customCategory)) {
          setCategories([...categories, customCategory])
        }

        setIsCustomCategory(false)
        router.refresh()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to create flashcard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create flashcard",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create New Flashcard</h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-rose-600">New Flashcard</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="frontText">Question (Front)</Label>
              <Textarea
                id="frontText"
                placeholder="Enter the question or front text"
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backText">Answer (Back)</Label>
              <Textarea
                id="backText"
                placeholder="Enter the answer or back text"
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              {!isCustomCategory ? (
                <div className="flex flex-col space-y-2">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" onClick={() => setIsCustomCategory(true)} className="mt-2">
                    Add Custom Category
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Input
                    id="customCategory"
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={() => setIsCustomCategory(false)} className="mt-2">
                    Use Existing Category
                  </Button>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Flashcard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
