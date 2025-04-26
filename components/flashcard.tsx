"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { Flashcard } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function FlashcardComponent({
  flashcard,
  onDelete,
}: {
  flashcard: Flashcard
  onDelete?: (id: string) => void
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/flashcards/${flashcard.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Flashcard deleted successfully",
        })
        if (onDelete) {
          onDelete(flashcard.id)
        }
      } else {
        throw new Error("Failed to delete flashcard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete flashcard",
        variant: "destructive",
      })
    }
  }

  return (
    <>
    <div className="w-full max-w-md perspective-1000 cursor-pointer" onClick={handleFlip}>
      <div
        className={`relative w-full h-64 transition-transform duration-500 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of card */}
        <Card
          className={`absolute w-full h-full backface-hidden p-6 flex flex-col justify-between ${
            isFlipped ? "invisible" : ""
          }`}
        >
          <CardContent className="p-0 flex flex-col h-full justify-between">
            <div>
              <Badge className="mb-4 bg-rose-100 text-rose-800 hover:bg-rose-200">{flashcard.category}</Badge>
              <div className="text-xl font-medium text-center mt-4">{flashcard.frontText}</div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">Click to flip</p>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card className={`absolute w-full h-full backface-hidden p-6 rotate-y-180 ${!isFlipped ? "invisible" : ""}`}>
          <CardContent className="p-0 flex flex-col h-full justify-between">
            <div>
              <Badge className="mb-4 bg-teal-100 text-teal-800 hover:bg-teal-200">Answer</Badge>
              <div className="text-xl font-medium text-center mt-4">{flashcard.backText}</div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">Click to flip back</p>
          </CardContent>
        </Card>
      </div>
    </div>
  <div className="mt-4 flex justify-end">
    <Button
      variant="outline"
      size="icon"
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
      onClick={(e) => {
        e.stopPropagation()
        setShowDeleteDialog(true)
      }}
      aria-label="Delete flashcard"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
  <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the flashcard.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={(e) => {
            e.stopPropagation()
            handleDelete()
            setShowDeleteDialog(false)
          }}
          className="bg-red-500 hover:bg-red-600"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  </>
  )
}
