'use server'

import { createClient } from '@/utils/supabase/server'
import { recipeSchema } from '@/lib/schemas'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function createRecipe(data: z.infer<typeof recipeSchema>) {
    const result = recipeSchema.safeParse(data)
    if (!result.success) {
        return { error: result.error.flatten() }
    }

    const { ingredients, ...rest } = result.data
    // Transform ingredients { value } -> string
    const ingredientsArray = ingredients.map(i => i.value)

    const supabase = createClient()
    const { error } = await supabase.from('recipes').insert({
        ...rest,
        ingredients: ingredientsArray
    })

    if (error) {
        console.error(error)
        return { error: error.message }
    }

    revalidatePath('/')
    redirect('/')
}

export async function updateRecipe(id: string, data: z.infer<typeof recipeSchema>) {
    const result = recipeSchema.safeParse(data)
    if (!result.success) {
        return { error: result.error.flatten() }
    }

    const { ingredients, ...rest } = result.data
    const ingredientsArray = ingredients.map(i => i.value)

    const supabase = createClient()
    const { error } = await supabase.from('recipes').update({
        ...rest,
        ingredients: ingredientsArray,
        updated_at: new Date().toISOString(),
    }).eq('id', id)

    if (error) return { error: error.message }

    revalidatePath(`/recipes/${id}`)
    revalidatePath('/')
    redirect(`/recipes/${id}`)
}

export async function deleteRecipe(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('recipes').delete().eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/')
    redirect('/')
}
