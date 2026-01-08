import { z } from "zod"

export const authSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export type AuthSchema = z.infer<typeof authSchema>

export const recipeSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    ingredients: z.array(z.object({ value: z.string().min(1, "Ingredient cannot be empty") })).min(1, "At least one ingredient is required"),
    instructions: z.string().min(1, "Instructions are required"),
    prep_time: z.coerce.number().min(0).optional(),
    cook_time: z.coerce.number().min(0).optional(),
    servings: z.coerce.number().min(1).optional(),
    category: z.enum(["Breakfast", "Lunch", "Dinner", "Dessert", "Snacks"]).optional(),
    photo_url: z.string().optional(),
    is_favorite: z.boolean().default(false),
})

export type RecipeSchema = z.infer<typeof recipeSchema>
