import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Heart, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DeleteRecipeButton } from "@/components/delete-recipe-button"
import { Recipe } from "@/lib/types"

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

export default async function RecipePage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: recipeData, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !recipeData) {
        notFound()
    }

    const recipe = recipeData as Recipe
    const { data: { user } } = await supabase.auth.getUser()
    const isOwner = user?.id === recipe.user_id

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-6 flex justify-between items-start">
                <Link href="/" className="text-orange-600 hover:underline">← Back to Recipes</Link>
                {isOwner && (
                    <div className="flex gap-2">
                        <Link href={`/recipes/${recipe.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4 mr-2" /> Edit
                            </Button>
                        </Link>
                        <DeleteRecipeButton id={recipe.id} />
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="rounded-xl overflow-hidden shadow-md aspect-video relative bg-slate-100">
                        {recipe.photo_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={recipe.photo_url} alt={recipe.title} className="object-cover w-full h-full" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                        )}
                        {recipe.is_favorite && (
                            <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-red-500 shadow-sm">
                                <Heart className="h-6 w-6 fill-current" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {recipe.category && <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">{recipe.category}</Badge>}
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">{recipe.title}</h1>
                    </div>

                    <div className="flex gap-6 text-sm text-gray-600 border-y py-4">
                        <div className="flex items-center gap-2"><Clock className="h-5 w-5" /> <strong>Prep:</strong> {recipe.prep_time || 0}m</div>
                        <div className="flex items-center gap-2"><Clock className="h-5 w-5" /> <strong>Cook:</strong> {recipe.cook_time || 0}m</div>
                        <div className="flex items-center gap-2"><Users className="h-5 w-5" /> <strong>Serves:</strong> {recipe.servings || "-"}</div>
                    </div>

                    <div className="prose prose-orange">
                        <p className="text-gray-700 leading-relaxed text-lg">{recipe.description}</p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="md:col-span-1 bg-orange-50/50 p-6 rounded-xl h-fit border border-orange-100">
                    <h3 className="text-xl font-bold mb-4 text-orange-900 border-b border-orange-200 pb-2">Ingredients</h3>
                    <ul className="space-y-3">
                        {recipe.ingredients?.map((ingredient, i) => (
                            <li key={i} className="flex gap-3 text-gray-700 font-medium">
                                <span className="text-orange-400 mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0"></span>
                                <span className="flex-1">{ingredient}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">Instructions</h3>
                    <div className="text-gray-800 leading-loose whitespace-pre-line text-lg">
                        {recipe.instructions}
                    </div>
                </div>
            </div>
        </div>
    )
}
