'use client'

import { deleteForm } from '@/actions/form'
import Link from 'next/link'
import { Calendar, FileText, ChevronRight, Activity, Globe, Lock, Trash2, Loader2 } from 'lucide-react'
import { useTransition, useState } from 'react'
import { ConfirmModal } from '@/components/shared/ConfirmModal'

export function FormCard({ form }: { form: any }) {
    const [isPending, startTransition] = useTransition()

    const date = new Date(form.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        startTransition(async () => {
            await deleteForm(form.id)
            setShowDeleteModal(false)
        })
    }

    return (
        <div className="group relative block rounded-[2rem] border border-white/5 bg-[#0A0A0B]/50 transition-all hover:bg-zinc-900/60 hover:border-white/10 hover:-translate-y-1 shadow-2xl overflow-hidden">
            <Link href={`/builder/${form.id}`} className="absolute inset-0 z-0" />

            {/* Reflective Accent */}
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            <div className="relative z-10 p-6 flex flex-col h-full pointer-events-none">
                <div className="flex items-start justify-between mb-6 pointer-events-auto">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        {form.published ? (
                            <Globe className="h-5 w-5 text-emerald-400" />
                        ) : (
                            <Lock className="h-5 w-5 text-zinc-600" />
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDelete}
                            disabled={isPending}
                            className="h-8 w-8 rounded-lg bg-red-500/5 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>

                        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${form.published
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-800/50 text-zinc-500 border border-white/5'
                            }`}>
                            <div className={`h-1 w-1 rounded-full ${form.published ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                            {form.published ? 'Live' : 'Draft'}
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">
                        {form.title}
                    </h3>
                    <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed font-medium">
                        {form.description || 'No description provided for this form.'}
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/5 bg-black/40 p-3 space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                            <Activity className="h-3 w-3" />
                            Entries
                        </div>
                        <div className="text-xl font-bold text-white tracking-tighter">{form._count.submissions}</div>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-black/40 p-3 space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                            <Calendar className="h-3 w-3" />
                            Created
                        </div>
                        <div className="text-sm font-bold text-zinc-400">{date}</div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5 group-hover:border-white/10 transition-colors">
                    <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-tight group-hover:text-blue-500 transition-colors">Open Builder</span>
                    <ChevronRight className="h-4 w-4 text-zinc-700 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Infrastructure?"
                description={`This will permanently decommission ${form.title} and purge all associated entries. This action is terminal and cannot be reversed.`}
                confirmText="Decommission"
                isDestructive
                isLoading={isPending}
            />
        </div>
    )
}
