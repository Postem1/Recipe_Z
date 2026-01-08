export interface Recipe {
    id: string
    user_id: string
    title: string
    description: string | null
    ingredients: string[]
    instructions: string
    prep_time: number | null
    cook_time: number | null
    servings: number | null
    category: string | null
    photo_url: string | null
    is_favorite: boolean
    created_at: string
    updated_at: string
}
