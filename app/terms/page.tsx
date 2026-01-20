import { ArrowLeft, ShieldCheck, Scale } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#020203] text-white">
            <div className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
                    <Link href="/login" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                    <span className="font-bold text-sm tracking-tight">Legal Center</span>
                </div>
            </div>

            <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                        <Scale className="h-6 w-6 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
                </div>

                <p className="text-zinc-500 text-sm mb-12 italic">Last Updated: January 19, 2026</p>

                <div className="prose prose-invert max-w-none space-y-10">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest text-[12px] opacity-60">01. Acceptance of Terms</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            By accessing and using Protocol (the "Service"), you agree to be bound by these Terms of Service.
                            Our service is designed for professional and enterprise internal data collection operations in the year 2026.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest text-[12px] opacity-60">02. Data Usage</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            You retain all ownership of the data collected through your forms. Protocol provides the infrastructure
                            but does not claim ownership of user submissions.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest text-[12px] opacity-60">03. Restrictions</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            Users may not use the platform for phishing, illegal data harvesting, or any activity that violates
                            international privacy standards as defined in local jurisdictions.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
