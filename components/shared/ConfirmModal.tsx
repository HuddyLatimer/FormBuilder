'use client'

import { X, AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    isDestructive?: boolean
    isLoading?: boolean
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
    isLoading = false
}: ConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020203]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0A0B] p-8 shadow-[0_0_80px_-20px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
                {/* Detail accent */}
                <div className={cn(
                    "absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent",
                    isDestructive ? "via-red-500/50" : "via-blue-500/50"
                )} />

                <div className="flex items-center justify-between mb-6">
                    <div className={cn(
                        "h-12 w-12 rounded-2xl border flex items-center justify-center",
                        isDestructive
                            ? "bg-red-500/10 border-red-500/20 text-red-500"
                            : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    )}>
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white hover:border-white/10 transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-2 mb-8">
                    <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed">{description}</p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 rounded-2xl bg-zinc-900 border border-white/5 px-4 py-3.5 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            "flex-[2] flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50",
                            isDestructive
                                ? "bg-red-600 hover:bg-red-500 shadow-xl shadow-red-600/20"
                                : "bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20"
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
