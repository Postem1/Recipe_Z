import { Recipe } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

interface RecipeCardProps {
    recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    // Use placeholder if no photo
    const photo = recipe.photo_url || "/placeholder-recipe.jpg" // Need to handle placeholder

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow group h-full flex flex-col">
            <div className="relative aspect-video w-full overflow-hidden">
                {/* Use standard img tag for external URLs if domain not allowed in next.config, or configure it. 
              Safest is valid img or configured Supabase domain. 
              I'll use Next Image but I need to allow the domain. 
              For now, simple img for speed or configure domain. 
              I'll use img to avoid configuration hassle for now. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={photo}
                    alt={recipe.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                {recipe.is_favorite && (
                    <div className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-500">
                        <Heart className="h-4 w-4 fill-current" />
                    </div>
                )}
            </div>
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-orange-600 transition-colors">
                        <Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                    </h3>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {recipe.prep_time ? recipe.prep_time + (recipe.cook_time || 0) : 0}m</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {recipe.servings} pp</span>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1">
                <p className="text-sm text-gray-500 line-clamp-2">
                    {recipe.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                    {recipe.category && <Badge variant="secondary" className="text-xs">{recipe.category}</Badge>}
                </div>
            </CardContent>
            <CardFooter className="p-4 border-t bg-slate-50">
                <Link href={`/recipes/${recipe.id}`} className="w-full">
                    <Button variant="outline" className="w-full text-xs h-8">View Recipe</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
