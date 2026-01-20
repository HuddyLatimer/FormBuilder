import { logout } from '@/actions/auth'
import { LogOut, LayoutDashboard, Settings, FileText, Plus } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
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

                            <div className="hidden md:flex items-center gap-1">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/5 ring-1 ring-white/10 transition-colors"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Workspace
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <form action={logout}>
                                <button className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-red-400 transition-colors">
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {children}
            </main>
        </div>
    )
}
