'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Heart, X } from "lucide-react"

export function RecipeFilters() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const category = searchParams.get('category')
    const isFavorite = searchParams.get('favorite') === 'true'

    const handleCategoryChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== 'all') {
            params.set('category', value)
        } else {
            params.delete('category')
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const toggleFavorite = () => {
        const params = new URLSearchParams(searchParams)
        if (isFavorite) {
            params.delete('favorite')
        } else {
            params.set('favorite', 'true')
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams)
        params.delete('category')
        params.delete('favorite')
        replace(`${pathname}?${params.toString()}`)
    }

    const hasFilters = category || isFavorite

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <Select value={category || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                    <SelectItem value="Lunch">Lunch</SelectItem>
                    <SelectItem value="Dinner">Dinner</SelectItem>
                    <SelectItem value="Dessert">Dessert</SelectItem>
                    <SelectItem value="Snacks">Snacks</SelectItem>
                </SelectContent>
            </Select>

            <Button
                variant={isFavorite ? "secondary" : "outline"}
                onClick={toggleFavorite}
                className={isFavorite ? "bg-red-100 text-red-600 border-red-200 hover:bg-red-200" : "bg-white"}
            >
                <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                Favorites
            </Button>

            {hasFilters && (
                <Button variant="ghost" onClick={clearFilters} className="text-gray-500">
                    <X className="mr-2 h-4 w-4" /> Clear
                </Button>
            )}
        </div>
    )
}
