'use client'

import { login } from '@/actions/auth'
import { Github, Fingerprint, Eye, EyeOff, AlertCircle, FileText, ChevronRight, LayoutPanelTop, CheckCircle2, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { useState, use } from 'react'

export default function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string, message?: string }>
}) {
    const { error, message } = use(searchParams)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#000000] text-white selection:bg-blue-500/30">
            {/* Background Orbs */}
            <div className="fixed -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
            <div className="fixed -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

            {/* Left Column: Auth Section */}
            <div className="relative flex flex-1 flex-col justify-between p-8 lg:p-12 xl:p-20 z-10">
                <div>
                    <Link href="/" className="mb-20 flex items-center gap-3 group w-fit">
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden transition-all">
                            <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            Protocol
                        </span>
                    </Link>

                    <div className="mx-auto w-full max-w-[400px]">
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Welcome back</h1>
                        <p className="text-zinc-400 text-[15px]">Enter your workspace credentials to continue.</p>

                        <div className="mt-10 space-y-3">
                            <button
                                type="button"
                                className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-white/5 bg-[#0A0A0B] py-3.5 text-sm font-medium transition-all hover:bg-zinc-900/80 active:scale-[0.98]"
                            >
                                <Github className="h-5 w-5 text-zinc-300" />
                                <span>Continue with GitHub</span>
                            </button>
                            <button
                                type="button"
                                className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-white/5 bg-[#0A0A0B] py-3.5 text-sm font-medium transition-all hover:bg-zinc-900/80 active:scale-[0.98]"
                            >
                                <Fingerprint className="h-5 w-5 text-zinc-300" />
                                <span>Passkey Login</span>
                            </button>
                        </div>

                        <div className="relative my-10 px-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase">
                                <span className="bg-[#000000] px-4 text-zinc-600 font-bold tracking-[0.2em]">OR</span>
                            </div>
                        </div>

                        <form action={login} className="space-y-6">
                            {error && (
                                <div className="flex items-start gap-3 rounded-xl bg-red-500/5 p-4 text-xs text-red-400 border border-red-500/20">
                                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                    <p>{decodeURIComponent(error)}</p>
                                </div>
                            )}
                            {message && (
                                <div className="flex items-start gap-3 rounded-xl bg-emerald-500/5 p-4 text-xs text-emerald-400 border border-emerald-500/20">
                                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                                    <p>{decodeURIComponent(message)}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-zinc-400 ml-1">Email address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="name@company.com"
                                        className="w-full rounded-xl border border-white/10 bg-[#0A0A0B]/50 pl-11 pr-4 py-3.5 text-sm outline-none transition-all placeholder:text-zinc-700 focus:bg-[#0A0A0B] focus:border-white/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[13px] font-bold text-zinc-400">Password</label>
                                    <Link href="#" className="text-[11px] font-bold text-blue-500 hover:text-blue-400 transition-colors">Forgot password?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-white/10 bg-[#0A0A0B]/50 pl-11 pr-12 py-3.5 text-sm outline-none transition-all placeholder:text-zinc-700 focus:bg-[#0A0A0B] focus:border-white/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-4 flex items-center text-zinc-600 hover:text-zinc-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="group relative overflow-hidden mt-4 flex w-full items-center justify-center rounded-xl bg-white px-4 py-4 text-[15px] font-bold text-black transition-all hover:bg-zinc-100 active:scale-[0.98]"
                            >
                                <span>Sign in to Dashboard</span>
                                <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </button>
                        </form>

                        <div className="mt-10 text-center text-[13px]">
                            <span className="text-zinc-500 font-medium">New to Protocol? </span>
                            <Link href="/signup" className="text-white font-bold hover:underline underline-offset-4">
                                Initialize account
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-20 text-[11px] font-medium text-zinc-600 flex items-center gap-6">
                    <span>&copy; 2026 Protocol</span>
                    <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
                    <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
                </div>
            </div>

            {/* Right Column: Premium Hero Section */}
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-[#050507] border-l border-white/5 relative p-20 overflow-hidden text-left">
                {/* Abstract Pattern Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-violet-600/10 pointer-events-none" />

                <div className="relative z-10 w-full max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-12 shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)]">
                        <LayoutPanelTop className="h-3 w-3" />
                        Enterprise Builder
                    </div>

                    <h2 className="text-[52px] font-bold tracking-tight text-white leading-[1.05] mb-10">
                        Build Better <br />
                        <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent italic pr-2">Tools</span>
                        Twice as Fast.
                    </h2>

                    <div className="space-y-8 mt-16 max-w-md">
                        <div>
                            <p className="text-xl text-zinc-400 font-medium leading-relaxed">
                                "Protocol is exactly what we needed to move away from rigid Google Forms for our internal intake."
                            </p>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-blue-400 overflow-hidden">
                                    <img src="https://ui-avatars.com/api/?name=Alex+Chen&background=0D0D0D&color=3B82F6" alt="Avatar" className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white tracking-tight">Alex Chen</p>
                                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Founding Engineer at Cloudscale</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support floating panel */}
                <div className="absolute bottom-12 right-12 flex items-center gap-6 text-zinc-600 text-[11px] font-bold tracking-wide">
                    <Link href="/docs" className="flex items-center gap-2 hover:text-white transition-colors group">
                        <FileText className="h-4 w-4" />
                        <span>Developer Docs</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
