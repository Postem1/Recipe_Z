import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { RecipeForm } from "@/components/recipe-form"

export default async function EditRecipePage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: recipe, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !recipe) {
        notFound()
    }

    if (recipe.user_id !== user.id) {
        redirect('/')
    }

    // Transform ingredients string[] to {value}[] for form
    const formattedRecipe = {
        ...recipe,
        ingredients: (recipe.ingredients as string[] | null)?.map(val => ({ value: val })) || [{ value: "" }]
    }

    return (
        <div className="container py-10">
            <RecipeForm initialData={formattedRecipe} />
        </div>
    )
}
