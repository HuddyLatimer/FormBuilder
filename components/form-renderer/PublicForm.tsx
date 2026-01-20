'use client'

import { submitForm } from '@/actions/submission'
// Prisma types handled via 'any' to ensure build stability in diverse environments
import { useState } from 'react'
import { Loader2, CheckCircle2, ChevronRight, Lock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PublicForm({ form }: { form: any }) {
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [pending, setPending] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setPending(true)
        setErrors({})

        const res = await submitForm(form.id, formData)
        setPending(false)

        if (res.errors) {
            setErrors(res.errors)
        } else if (res.success) {
            setSubmitted(true)
        } else if (res.error) {
            alert(res.error)
        }
    }

    if (submitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#020203] p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full" />
                </div>

                <div className="relative w-full max-w-lg rounded-[3rem] border border-white/10 bg-black/40 p-12 text-center backdrop-blur-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-700">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] mb-8 animate-in slide-in-from-bottom-4">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Transmission Successful</h2>
                    <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                        Data received. Your submission has been securely committed to the {form.title} dataset.
                    </p>
                    <div className="mt-12 flex items-center justify-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                        <Sparkles className="h-4 w-4" />
                        End of Session
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020203] text-zinc-300 py-20 px-6 sm:px-8 relative overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-600/5 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-2xl">
                <div className="mb-16 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <Lock className="h-3 w-3" />
                        Secure Data Intake
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tighter text-white sm:text-6xl">
                        {form.title}
                    </h1>
                    {form.description && (
                        <p className="text-xl text-zinc-500 font-medium leading-relaxed">
                            {form.description}
                        </p>
                    )}
                </div>

                <div className="rounded-[3rem] border border-white/10 bg-black/40 p-8 sm:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

                    <form action={handleSubmit} className="space-y-10">
                        {form.fields.sort((a: any, b: any) => a.order - b.order).map((field: any) => (
                            <div key={field.id} className="space-y-4">
                                <label
                                    htmlFor={field.id}
                                    className="block text-sm font-bold text-zinc-400 tracking-tight ml-1"
                                >
                                    {field.label} {field.required && <span className="text-blue-500 ml-1 opacity-50">*</span>}
                                </label>

                                <div className="group relative">
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            name={field.id}
                                            id={field.id}
                                            required={field.required}
                                            placeholder={field.placeholder || ''}
                                            rows={5}
                                            className="block w-full rounded-2xl border border-white/10 bg-[#0A0A0B]/50 px-5 py-4 text-sm text-white outline-none transition-all placeholder:text-zinc-800 focus:bg-[#0A0A0B] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 resize-none"
                                        />
                                    ) : field.type === 'checkbox' ? (
                                        <div className="flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-[#0A0A0B]/50 transition-all hover:bg-[#0A0A0B] cursor-pointer group">
                                            <div className="relative flex h-5 w-5 items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    name={field.id}
                                                    id={field.id}
                                                    required={field.required}
                                                    className="peer h-5 w-5 rounded-lg border-white/10 bg-transparent text-blue-600 transition-all focus:ring-0 focus:ring-offset-0 appearance-none border checked:bg-blue-600 checked:border-blue-600"
                                                />
                                                <CheckCircle2 className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="text-sm font-medium text-zinc-400 peer-checked:text-white transition-colors">Confirm selection</span>
                                        </div>
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.id}
                                            id={field.id}
                                            required={field.required}
                                            placeholder={field.placeholder || ''}
                                            className="block w-full rounded-2xl border border-white/10 bg-[#0A0A0B]/50 px-5 py-4 text-sm text-white outline-none transition-all placeholder:text-zinc-800 focus:bg-[#0A0A0B] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5"
                                        />
                                    )}
                                </div>

                                {errors[field.id] && (
                                    <p className="mt-2 text-xs font-bold text-red-400 tracking-tight ml-1">
                                        {errors[field.id]}
                                    </p>
                                )}
                            </div>
                        ))}

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={pending}
                                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-[1.5rem] bg-white px-8 py-5 text-lg font-black text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            >
                                <div className="absolute inset-x-0 h-full bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                                {pending ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        Submit Configuration
                                        <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                            <p className="mt-6 text-center text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                                Protected by Protocol Enterprise
                            </p>
                        </div>
                    </form>
                </div>

                <div className="mt-20 flex flex-col items-center gap-6">
                    <img src="/logo.png" alt="Logo" className="h-10 w-10 hue-rotate-[220deg] opacity-20 hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-8 text-[11px] font-bold text-zinc-600 uppercase tracking-widest">
                        <span>© 2026</span>
                        <div className="h-1.5 w-px bg-white/5" />
                        <span>Privacy Standard</span>
                        <div className="h-1.5 w-px bg-white/5" />
                        <span>Terms enforced</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
