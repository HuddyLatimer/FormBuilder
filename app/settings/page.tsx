import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { SettingsClient } from '@/components/settings/SettingsClient'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-[#020203] text-white selection:bg-blue-500/30">
            {/* Background Atmosphere */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/5 blur-[120px] rounded-full" />
            </div>

            <nav className="relative z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center gap-8">
                            <Link href="/dashboard" className="flex items-center gap-3 group">
                                <div className="flex h-9 w-9 items-center justify-center overflow-hidden transition-all">
                                    <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-white transition-all group-hover:tracking-tighter">
                                    Protocol
                                </span>
                            </Link>
                        </div>

                        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Workspace
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="mb-12 border-b border-white/5 pb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Command Center Settings</h1>
                    <p className="text-zinc-500 text-lg font-medium">Manage your session, security, and interface preferences.</p>
                </div>

                <SettingsClient user={user} />
            </main>
        </div>
    )
}
