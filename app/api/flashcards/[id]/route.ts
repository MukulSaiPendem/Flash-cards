import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const flashcard = await prisma.flashcard.findUnique({
      where: { id },
    })

    if (!flashcard) {
      return NextResponse.json({ error: "Flashcard not found" }, { status: 404 })
    }

    return NextResponse.json(flashcard)
  } catch (error) {
    console.error("Error fetching flashcard:", error)
    return NextResponse.json({ error: "Failed to fetch flashcard" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { frontText, backText, category } = await request.json()

    // Validate input
    if (!frontText && !backText && !category) {
      return NextResponse.json({ error: "At least one field must be provided for update" }, { status: 400 })
    }

    const updatedFlashcard = await prisma.flashcard.update({
      where: { id },
      data: {
        ...(frontText && { frontText }),
        ...(backText && { backText }),
        ...(category && { category }),
      },
    })

    return NextResponse.json(updatedFlashcard)
  } catch (error) {
    console.error("Error updating flashcard:", error)
    return NextResponse.json({ error: "Failed to update flashcard" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    await prisma.flashcard.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting flashcard:", error)
    return NextResponse.json({ error: "Failed to delete flashcard" }, { status: 500 })
  }
}
