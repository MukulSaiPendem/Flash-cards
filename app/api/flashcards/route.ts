import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const flashcards = await prisma.flashcard.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(flashcards)
  } catch (error) {
    console.error("Error fetching flashcards:", error)
    return NextResponse.json({ error: "Failed to fetch flashcards" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { frontText, backText, category } = await request.json()

    // Validate input
    if (!frontText || !backText) {
      return NextResponse.json({ error: "Front text and back text are required" }, { status: 400 })
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        frontText,
        backText,
        category: category || "General",
      },
    })

    return NextResponse.json(flashcard, { status: 201 })
  } catch (error) {
    console.error("Error creating flashcard:", error)
    return NextResponse.json({ error: "Failed to create flashcard" }, { status: 500 })
  }
}
