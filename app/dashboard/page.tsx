import { getForms } from '@/actions/form'
import { CreateFormBtn } from '@/components/dashboard/CreateFormBtn'
import { FormCard } from '@/components/dashboard/FormCard'
import { LayoutGrid, ListFilter, Search, Plus } from 'lucide-react'

export default async function DashboardPage() {
    const { forms, error } = await getForms()

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                        Active Workspace
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white">Your Forms</h1>
                    <p className="text-zinc-400 max-w-lg leading-relaxed">
                        Design, deploy, and analyze your internal data collection forms from one central command center.
                    </p>
                </div>
                {!error && (
                    <div className="flex items-center gap-3">
                        <div className="relative group hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 transition-colors group-focus-within:text-blue-500" />
                            <input
                                placeholder="Search forms..."
                                className="bg-zinc-900/50 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm outline-none w-64 focus:bg-zinc-900 focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                            />
                        </div>
                        <CreateFormBtn />
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {error ? (
                    <div className="p-8 rounded-[2.5rem] border border-red-500/20 bg-red-500/5 text-center space-y-4">
                        <div className="mx-auto h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                            <Plus className="h-6 w-6 rotate-45" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Infrastructure Error</h2>
                        <p className="text-zinc-400 max-w-md mx-auto text-sm leading-relaxed">
                            {error}. This usually indicates that the <code className="text-red-400 bg-red-400/10 px-1 rounded">DATABASE_URL</code> is missing or incorrect in your Netlify settings.
                        </p>
                        <div className="pt-4">
                            <a href="https://app.netlify.com" target="_blank" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
                                Resolve in Netlify Console →
                            </a>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm font-bold text-zinc-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2 text-white">
                                    <LayoutGrid className="h-4 w-4" />
                                    Grid View
                                </div>
                                <div className="h-4 w-px bg-white/5" />
                                <div className="flex items-center gap-2 opacity-100 hover:text-zinc-300 pointer-events-none cursor-not-allowed">
                                    <ListFilter className="h-4 w-4" />
                                    Filters
                                </div>
                            </div>
                            <div className="text-xs font-bold text-zinc-600">
                                {forms.length} total forms
                            </div>
                        </div>

                        {forms.length === 0 ? (
                            <div className="group relative overflow-hidden flex flex-col items-center justify-center rounded-[2.5rem] border border-white/5 bg-zinc-900/20 p-20 text-center transition-all hover:bg-zinc-900/40">
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                <div className="h-16 w-16 rounded-3xl bg-zinc-900 ring-1 ring-white/10 flex items-center justify-center mb-6 shadow-2xl transition-transform group-hover:scale-110">
                                    <Plus className="h-8 w-8 text-zinc-700" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Initialize your first form</h3>
                                <p className="text-zinc-500 max-w-xs text-sm">You haven&apos;t created any forms yet. Start by defining a schema for your workspace.</p>
                                <div className="mt-8">
                                    <CreateFormBtn />
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                {forms.map((form: any) => (
                                    <FormCard key={form.id} form={form} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
