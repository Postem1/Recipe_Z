import { RecipeForm } from "@/components/recipe-form"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function NewRecipePage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Protect route
    if (!user) {
        redirect('/login')
    }

    return (
        <div className="container py-10">
            <RecipeForm />
        </div>
    )
}
