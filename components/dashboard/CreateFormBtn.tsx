'use client'

import { createForm } from '@/actions/form'
import { Plus, X, Loader2, Sparkles, FilePlus } from 'lucide-react'
import { useState, useActionState, useEffect } from 'react'

type FormState = {
    id?: string
    error?: string
} | null

export function CreateFormBtn() {
    const [isOpen, setIsOpen] = useState(false)
    const [state, action, pending] = useActionState<FormState, FormData>(createForm, null)

    // Close modal on success
    useEffect(() => {
        if (!pending && state?.id) {
            setIsOpen(false)
        }
    }, [pending, state])

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="group relative flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-blue-500/10"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl" />
                <Plus className="h-4 w-4" />
                Create New Form
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020203]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0A0B] p-8 shadow-[0_0_80px_-20px_rgba(59,130,246,0.15)] animate-in zoom-in-95 duration-300">
                        {/* Detail accent */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                    <FilePlus className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">Form Configuration</h2>
                                    <p className="text-xs text-zinc-500 font-medium">Define metadata for your new dataset.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white hover:border-white/10 transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form action={action} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-zinc-400 ml-1">Title</label>
                                <input
                                    name="title"
                                    required
                                    autoFocus
                                    placeholder="e.g. Q1 Customer Satisfaction"
                                    className="w-full rounded-2xl border border-white/10 bg-zinc-900/50 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:bg-zinc-900 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-zinc-400 ml-1">Description (Optional)</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    placeholder="What is the purpose of this form?"
                                    className="w-full rounded-2xl border border-white/10 bg-zinc-900/50 px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:bg-zinc-900 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 resize-none"
                                />
                            </div>

                            {state?.error && (
                                <div className="flex items-center gap-2 rounded-xl bg-red-500/5 border border-red-500/20 p-4 text-xs font-medium text-red-400 animate-in shake duration-500">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                    {state.error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 rounded-2xl bg-zinc-900 border border-white/5 px-4 py-3.5 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={pending}
                                    className="flex-[2] flex min-w-[140px] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {pending ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4" />
                                            Initialize Form
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
