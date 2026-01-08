"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { authSchema, type AuthSchema } from "@/lib/schemas"
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
import { signup } from "@/app/auth/actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import Link from "next/link"

export function SignupForm() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const form = useForm<AuthSchema>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: AuthSchema) {
        setLoading(true)
        const res = await signup(values)
        if (res?.error) {
            toast({
                title: "Signup failed",
                description: res.error,
                variant: "destructive"
            })
            setLoading(false)
        } else {
            toast({
                title: "Account created!",
                description: "You have successfully signed up.",
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm border p-8 rounded-lg bg-white shadow-sm">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">Sign Up</h1>
                    <p className="text-gray-500">Create an account to save recipes</p>
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </Button>
                <div className="text-center text-sm">
                    Already have an account? <Link href="/login" className="underline font-medium text-orange-600">Login</Link>
                </div>
            </form>
        </Form>
    )
}
