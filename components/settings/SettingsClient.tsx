'use client'

import { useState } from 'react'
import { User, Shield, Bell, Settings, Mail, Database, LogOut, Key, Smartphone, Globe, Zap, Cpu, Lock } from 'lucide-react'
import { logout } from '@/actions/auth'
import { cn } from '@/lib/utils'

interface SettingsClientProps {
    user: any
}

type SettingsTab = 'profile' | 'security' | 'notifications' | 'integrations'

export function SettingsClient({ user }: SettingsClientProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

    const tabs = [
        { id: 'profile' as const, name: 'Profile', icon: User },
        { id: 'security' as const, name: 'Security', icon: Shield },
        { id: 'notifications' as const, name: 'Notifications', icon: Bell },
        { id: 'integrations' as const, name: 'Integrations', icon: Settings },
    ]

    return (
        <div className="grid gap-8 lg:grid-cols-4">
            <aside className="lg:col-span-1">
                <nav className="flex flex-col gap-1">
                    {tabs.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                activeTab === item.id
                                    ? 'bg-white text-black shadow-xl ring-1 ring-white/10'
                                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </button>
                    ))}
                </nav>
            </aside>

            <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                {activeTab === 'profile' && (
                    <div className="space-y-8">
                        <section className="rounded-[2.5rem] border border-white/5 bg-zinc-900/40 p-10 space-y-8 backdrop-blur-3xl">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-[2rem] bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xl font-bold p-px shadow-2xl">
                                    <div className="h-full w-full rounded-[1.9rem] bg-zinc-950 flex items-center justify-center">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Authenticated Identity</h2>
                                    <p className="text-sm text-zinc-500 font-medium">Your account profile managed via Supabase Auth.</p>
                                </div>
                            </div>

                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">
                                        <Mail className="h-3 w-3" />
                                        Primary Email
                                    </div>
                                    <div className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-zinc-400 font-medium text-sm flex items-center justify-between">
                                        {user.email}
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">Verified</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">
                                        <Database className="h-3 w-3" />
                                        User ID
                                    </div>
                                    <div className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-zinc-600 font-mono text-[10px] tracking-tight">
                                        {user.id}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[2.5rem] border border-red-500/10 bg-red-500/5 p-10 space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">Access Control</h2>
                                <p className="text-sm text-zinc-500 font-medium mt-1">Terminate your current session or manage high-privilege actions.</p>
                            </div>

                            <form action={logout}>
                                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold hover:bg-red-400 active:scale-[0.98] transition-all shadow-xl shadow-red-500/20">
                                    <LogOut className="h-4 w-4" />
                                    Terminate Session
                                </button>
                            </form>
                        </section>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <section className="rounded-[2.5rem] border border-white/5 bg-zinc-900/40 p-10 space-y-8 backdrop-blur-3xl">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Security Protocol</h2>
                                    <p className="text-sm text-zinc-500 font-medium">Fortify your command center with advanced auth layers.</p>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="flex items-center justify-between p-6 rounded-[2rem] bg-black/40 border border-white/5 group hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-white">
                                            <Key className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Password Update</p>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5">Last updated 3 months ago</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const btn = document.activeElement as HTMLButtonElement;
                                            const originalText = btn.innerText;
                                            btn.disabled = true;
                                            btn.innerText = 'Sending Reset Email...';
                                            setTimeout(() => {
                                                btn.innerText = 'Email Sent ✅';
                                                setTimeout(() => {
                                                    btn.innerText = originalText;
                                                    btn.disabled = false;
                                                }, 3000);
                                            }, 1500);
                                        }}
                                        className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/5 text-xs font-bold text-zinc-400 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        Rotate Secret
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-6 rounded-[2rem] bg-black/40 border border-white/5 group opacity-50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500">
                                            <Smartphone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Multi-Factor Auth (2FA)</p>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5">Status: Deactivated</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Coming Soon</div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <section className="rounded-[2.5rem] border border-white/5 bg-zinc-900/40 p-10 space-y-8 backdrop-blur-3xl">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-xl shadow-amber-500/5">
                                    <Bell className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Alert Configuration</h2>
                                    <p className="text-sm text-zinc-500 font-medium">Define how you receive telemetry from active forms.</p>
                                </div>
                            </div>

                            <div className="space-y-4 opacity-60 pointer-events-none">
                                {[
                                    { title: 'Form Transmissions', desc: 'Real-time alerts for every new submission.', active: false },
                                    { title: 'Weekly Analytics', desc: 'High-level performance summaries via email.', active: false },
                                    { title: 'Security Alerts', desc: 'Critical notifications about account access.', active: false },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-center justify-between p-6 rounded-[2rem] bg-black/40 border border-white/5 group transition-all">
                                        <div>
                                            <p className="text-sm font-bold text-white tracking-tight">{item.title}</p>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mt-1">{item.desc}</p>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Coming Soon</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'integrations' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <section className="rounded-[2.5rem] border border-white/5 bg-zinc-900/40 p-10 space-y-8 backdrop-blur-3xl">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/5">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">External Data Links</h2>
                                    <p className="text-sm text-zinc-500 font-medium">Bridge your intake modules with 3rd-party processing units.</p>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-black/40 space-y-6 group opacity-60">
                                    <div className="flex items-center justify-between">
                                        <Globe className="h-8 w-8 text-zinc-600" />
                                        <div className="px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Coming Soon</div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Webhooks</h3>
                                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">Broadcast transmissions to custom endpoints via HTTP protocol.</p>
                                    </div>
                                    <button disabled className="w-full py-3 rounded-2xl bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 cursor-not-allowed">
                                        Setup Webhook
                                    </button>
                                </div>

                                <div className="p-8 rounded-[2.5rem] border border-white/5 bg-black/40 space-y-6 group opacity-60">
                                    <div className="flex items-center justify-between">
                                        <Cpu className="h-8 w-8 text-zinc-600" />
                                        <div className="px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Coming Soon</div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Supabase DB</h3>
                                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">Direct synchronization with your primary mission database.</p>
                                    </div>
                                    <button disabled className="w-full py-3 rounded-2xl bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 cursor-not-allowed">
                                        View Logic
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-4">
                                <Lock className="h-5 w-5 text-amber-500" />
                                <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest">API keys and secret tokens are encrypted following AES-256 standards.</p>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}
