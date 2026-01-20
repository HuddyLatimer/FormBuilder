import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#020203] text-white">
            <div className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
                    <Link href="/login" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                    <span className="font-bold text-sm tracking-tight text-violet-400">Security</span>
                </div>
            </div>

            <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 shadow-2xl shadow-violet-500/10">
                        <Lock className="h-6 w-6 text-violet-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
                </div>

                <p className="text-zinc-500 text-sm mb-12 italic">Revision: 2026.1.19</p>

                <div className="prose prose-invert max-w-none space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest text-[12px] opacity-60">Security Standards</h2>
                        <div className="grid gap-4">
                            <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/40">
                                <h3 className="font-bold text-sm mb-2 text-violet-300">Encryption at Rest</h3>
                                <p className="text-zinc-400 text-sm leading-normal">All form data and user profile information is encrypted using industry-standard AES-256 protocols within our Supabase-managed storage.</p>
                            </div>
                            <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/40">
                                <h3 className="font-bold text-sm mb-2 text-blue-300">Identity Protection</h3>
                                <p className="text-zinc-400 text-sm leading-normal">We do not share your workspace data with third-party advertising networks. Your user profile is used strictly for authentication.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest text-[12px] opacity-60">Data Collection</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We collect minimal data required to provide the service: your email, workspace name, and the form configurations you create.
                            Submission data is strictly private and only accessible to form creators.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
