import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FlashcardGrid from "@/components/flashcard-grid"

export default async function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-rose-600 mb-4">FlashCard Buddy</h1>
        <p className="text-gray-600 max-w-md mx-auto">Create and review flashcards to boost your learning experience</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <Link href="/create">
          <Button className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600">Create New Flashcard</Button>
        </Link>
        <Link href="/review">
          <Button className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600">Review Flashcards</Button>
        </Link>
      </div>

      <div className="relative max-w-md mx-auto mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input type="text" placeholder="Search flashcards..." className="pl-10 w-full" />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Flashcard Topics</h2>
        <FlashcardGrid />
      </div>
    </main>
  )
}
