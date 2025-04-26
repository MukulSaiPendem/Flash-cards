import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Get all categories with count of flashcards
    const categories = await prisma.flashcard.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
    })

    // Format the response
    const formattedCategories = categories.map((item) => ({
      category: item.category,
      count: item._count.category,
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
