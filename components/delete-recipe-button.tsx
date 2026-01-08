"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteRecipe } from "@/app/recipes/actions"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function DeleteRecipeButton({ id }: { id: string }) {
    const { toast } = useToast()
    const [deleting, setDeleting] = useState(false)

    async function handleDelete() {
        setDeleting(true)
        const res = await deleteRecipe(id)
        if (res?.error) {
            toast({ title: "Error deleting recipe", description: res.error, variant: "destructive" })
            setDeleting(false)
        } else {
            toast({ title: "Recipe deleted" })
            // Router push handled in action? Next server actions redirect don't prevent client code execution.
            // Usually redirect happens in server action.
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={deleting}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Recipe?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your recipe.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                        {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
