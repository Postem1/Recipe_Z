"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { recipeSchema, type RecipeSchema } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createRecipe, updateRecipe } from "@/app/recipes/actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Trash2 } from "lucide-react"

interface RecipeFormProps {
    initialData?: RecipeSchema & { id?: string }
}

export function RecipeForm({ initialData }: RecipeFormProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    const form = useForm<RecipeSchema>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(recipeSchema) as any,
        defaultValues: initialData || {
            title: "",
            ingredients: [{ value: "" }],
            instructions: "",
            is_favorite: false,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "ingredients",
    })

    const supabase = createClient()

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage.from('recipe-images').upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('recipe-images').getPublicUrl(filePath)

            form.setValue('photo_url', data.publicUrl)
            toast({ title: "Image uploaded successfully" })

        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error"
            toast({
                title: 'Error uploading image',
                description: message,
                variant: "destructive"
            })
        } finally {
            setUploading(false)
        }
    }

    async function onSubmit(values: RecipeSchema) {
        setLoading(true)
        let res;
        if (initialData?.id) {
            res = await updateRecipe(initialData.id, values)
        } else {
            res = await createRecipe(values)
        }

        if (res?.error) {
            toast({
                title: "Error saving recipe",
                description: typeof res.error === 'string' ? res.error : "Check form fields",
                variant: "destructive"
            })
            setLoading(false)
        }
        // Redirects on success
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto pb-12">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">New Recipe</h1>
                    <p className="text-muted-foreground">Add a new recipe to your collection.</p>
                </div>

                <FormField
                    control={form.control}
                    name="photo_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Recipe Photo</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-4">
                                    {field.value && (
                                        <div className="h-24 w-24 relative rounded-md overflow-hidden border">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={field.value} alt="Preview" className="object-cover w-full h-full" />
                                        </div>
                                    )}
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Input type="file" id="picture" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                    </div>
                                    {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Grandma's Apple Pie" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Short description of the dish..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {["Breakfast", "Lunch", "Dinner", "Dessert", "Snacks"].map((c) => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="servings"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Servings</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="prep_time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prep Time (mins)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cook_time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cook Time (mins)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <FormLabel>Ingredients</FormLabel>
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}>
                            <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {fields.map((field, index) => (
                            <FormField
                                key={field.id}
                                control={form.control}
                                name={`ingredients.${index}.value`}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center gap-2">
                                            <FormControl>
                                                <Input placeholder={`Ingredient ${index + 1}`} {...field} />
                                            </FormControl>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                    <FormMessage>{form.formState.errors.ingredients?.message || form.formState.errors.ingredients?.root?.message}</FormMessage>
                </div>

                <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea className="min-h-[150px]" placeholder="Step 1: ..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" size="lg" disabled={loading || uploading}>
                    {loading ? "Saving..." : "Create Recipe"}
                </Button>
            </form>
        </Form>
    )
}
