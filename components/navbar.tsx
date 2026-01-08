import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { UserNav } from '@/components/user-nav'
import { SearchInput } from '@/components/search-input'

export async function Navbar() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="border-b bg-white">
            <div className="flex h-16 items-center px-4 container mx-auto">
                <Link href="/" className="text-xl font-bold text-orange-600 mr-6">
                    Recipe Z
                </Link>
                <div className="flex items-center space-x-4 flex-1">
                    <SearchInput />
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    {user ? (
                        <UserNav user={user} />
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login"><Button variant="ghost">Login</Button></Link>
                            <Link href="/signup"><Button>Sign Up</Button></Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
