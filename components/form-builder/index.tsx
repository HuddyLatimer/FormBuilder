'use client'

// Types handled via 'any' or interface to avoid prisma client mismatches in build environment
import { useState, useTransition, useMemo, useCallback } from 'react'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { updateFormContent, publishForm, deleteForm } from '@/actions/form'
import {
    Loader2, Save, Send, Eye, Plus, Trash2,
    Type, Mail, Hash, AlignLeft, CheckSquare,
    ChevronDown, Layout, Settings2, Sparkles,
    ArrowLeft, Globe, Lock, GripVertical,
    Zap, Boxes, MousePointer2
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface FormBuilderProps {
    form: any
}

const FIELD_TYPES = [
    { type: 'text', label: 'Short Text', icon: Type },
    { type: 'email', label: 'Email Address', icon: Mail },
    { type: 'number', label: 'Form Number', icon: Hash },
    { type: 'textarea', label: 'Long Answer', icon: AlignLeft },
    { type: 'checkbox', label: 'Multiple Choice', icon: CheckSquare },
    { type: 'select', label: 'Dropdown', icon: ChevronDown },
]

export function FormBuilder({ form }: FormBuilderProps) {
    const [fields, setFields] = useState<any[]>(form.fields || [])
    const [loading, startTransition] = useTransition()
    const [activeTab, setActiveTab] = useState<'editor' | 'settings' | 'submissions'>('editor')
    const [activeId, setActiveId] = useState<string | null>(null)
    const [themeColor, setThemeColor] = useState('#3b82f6')
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeIdStr = active.id as string
        const overIdStr = over.id as string

        // If we're dragging a sidebar item over the canvas fields
        if (activeIdStr.startsWith('sidebar-') && fields.find(f => f.id === overIdStr)) {
            // We don't necessarily need to move items here, 
            // but we could show a placeholder.
            // For now, let's keep it simple and handle onDragEnd.
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        const activeIdStr = active.id as string
        const overIdStr = over.id as string

        // CASE 1: Reordering existing fields
        if (!activeIdStr.startsWith('sidebar-') && activeIdStr !== overIdStr) {
            setFields((items) => {
                const oldIndex = items.findIndex((i) => i.id === activeIdStr)
                const newIndex = items.findIndex((i) => i.id === overIdStr)
                return arrayMove(items, oldIndex, newIndex)
            })
            return
        }

        // CASE 2: Dragging from sidebar into the list
        if (activeIdStr.startsWith('sidebar-')) {
            const type = activeIdStr.replace('sidebar-', '')
            const typeInfo = FIELD_TYPES.find(f => f.type === type)

            const newField = {
                id: `temp-${Date.now()}`,
                type,
                label: typeInfo?.label || `New ${type}`,
                placeholder: '',
                required: false,
                options: []
            }

            setFields((items) => {
                const overIndex = items.findIndex((i) => i.id === overIdStr)
                if (overIndex === -1) return [...items, newField]

                const newItems = [...items]
                newItems.splice(overIndex, 0, newField)
                return newItems
            })
        }
    }

    const addField = (type: string) => {
        const typeInfo = FIELD_TYPES.find(f => f.type === type)
        const newField = {
            id: `temp-${Date.now()}`,
            type,
            label: typeInfo?.label || `New ${type}`,
            placeholder: '',
            required: false,
            order: fields.length,
            options: []
        }
        setFields((prev) => [...prev, newField])
    }

    const removeField = (id: string) => {
        setFields(prev => prev.filter(f => f.id !== id))
    }

    const updateField = (id: string, key: string, value: any) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f))
    }

    const handleSave = async () => {
        startTransition(async () => {
            const ordered = fields.map((f, index) => ({ ...f, order: index }))
            await updateFormContent(form.id, JSON.stringify(ordered))
        })
    }

    const handleFormDelete = async () => {
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        startTransition(async () => {
            await deleteForm(form.id)
            setShowDeleteModal(false)
        })
    }

    const activeSidebarItem = useMemo(() => {
        if (!activeId || !activeId.startsWith('sidebar-')) return null
        return FIELD_TYPES.find(f => `sidebar-${f.type}` === activeId)
    }, [activeId])

    const activeFieldItem = useMemo(() => {
        if (!activeId || activeId.startsWith('sidebar-')) return null
        return fields.find(f => f.id === activeId)
    }, [activeId, fields])

    return (
        <div className="flex h-screen w-full flex-col bg-[#020203] text-white">
            <header className="flex h-16 items-center justify-between border-b border-white/5 bg-black/40 px-6 backdrop-blur-xl z-[100]">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-white/10 transition-all">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="h-6 w-px bg-white/5" />
                    <div className="flex items-center gap-3">
                        <img src="/favicon.png" alt="Logo" className="h-6 w-6 object-contain" />
                        <div>
                            <h1 className="text-sm font-bold text-white tracking-tight leading-none">{form.title}</h1>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                {form.published ? 'Deployment Active' : 'Staging Environment'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/50 border border-white/5">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                            activeTab === 'editor' ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <Layout className="h-3.5 w-3.5" />
                        Infrastructure
                    </button>
                    <button
                        onClick={() => setActiveTab('submissions')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                            activeTab === 'submissions' ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <Send className="h-3.5 w-3.5" />
                        Responses
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                            activeTab === 'settings' ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <Zap className="h-3.5 w-3.5" />
                        Logic & Themes
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleFormDelete}
                        disabled={loading}
                        className="flex items-center justify-center h-10 w-10 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        title="Delete Form"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                    <div className="h-6 w-px bg-white/5 mx-1" />
                    <Link
                        href={`/forms/${form.urlSlug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-white/5 text-xs font-bold text-zinc-400 hover:text-white hover:border-white/10 transition-all"
                    >
                        <Eye className="h-4 w-4" />
                        Preview
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    >
                        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        Sync Schema
                    </button>
                </div>
            </header>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-1 overflow-hidden">
                    {activeTab === 'editor' ? (
                        <>
                            <aside className="w-80 border-r border-white/5 bg-[#050507] p-8 overflow-y-auto">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-2">
                                        <Boxes className="h-4 w-4 text-blue-400" />
                                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Modules</h3>
                                    </div>
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                                </div>

                                <div className="grid gap-4">
                                    {FIELD_TYPES.map((field) => (
                                        <DraggableSidebarItem key={field.type} {...field} />
                                    ))}
                                </div>

                                <div className="mt-12 p-6 rounded-[2rem] bg-zinc-900/20 border border-white/5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <MousePointer2 className="h-3.5 w-3.5 text-zinc-500" />
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Protocol</span>
                                    </div>
                                    <p className="text-[11px] text-zinc-600 leading-relaxed font-medium">
                                        Drag modules directly into the canvas array to initialize them at specific positions.
                                    </p>
                                </div>
                            </aside>

                            <main className="flex-1 overflow-y-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-[length:250px] bg-repeat p-16 relative">
                                <div className="fixed top-0 right-0 w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
                                <div className="fixed bottom-0 left-0 w-[40%] h-[40%] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />

                                <div className="relative mx-auto max-w-2xl">
                                    <div className="mb-12 text-center">
                                        <h2 className="text-4xl font-black tracking-tighter mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">Build Protocol</h2>
                                        <p className="text-zinc-500 text-sm font-medium">Coordinate your intake modules and define validation logic.</p>
                                    </div>

                                    <div className="space-y-6 rounded-[3rem] border border-white/10 bg-black/40 p-12 backdrop-blur-3xl shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)]">
                                        <SortableContext
                                            items={fields.map(f => f.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {fields.length === 0 && (
                                                <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-white/5 bg-zinc-900/10 py-24 text-center transition-all hover:bg-zinc-900/20">
                                                    <div className="h-16 w-16 rounded-[2rem] bg-zinc-900 border border-white/5 flex items-center justify-center mb-6 text-zinc-800 shadow-2xl">
                                                        <Plus className="h-8 w-8" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-zinc-400 mb-2 whitespace-nowrap">Workspace Unititialized</h3>
                                                    <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Drag a module from the sidebar</p>
                                                </div>
                                            )}

                                            {fields.map((field) => (
                                                <SortableField
                                                    key={field.id}
                                                    field={field}
                                                    onRemove={removeField}
                                                    onUpdate={updateField}
                                                />
                                            ))}
                                        </SortableContext>
                                    </div>
                                </div>
                            </main>
                        </>
                    ) : activeTab === 'submissions' ? (
                        <main className="flex-1 overflow-y-auto bg-black p-12">
                            <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-10">
                                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                        <Send className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-extrabold tracking-tight text-white">Transmission Logs</h2>
                                        <p className="text-zinc-500 font-medium">Real-time data stream from your active deployment.</p>
                                    </div>
                                </div>

                                {(!form.submissions || form.submissions.length === 0) ? (
                                    <div className="rounded-[2.5rem] border border-white/5 bg-zinc-900/20 p-24 text-center">
                                        <div className="h-20 w-20 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto mb-6 text-zinc-800">
                                            <Boxes className="h-10 w-10" />
                                        </div>
                                        <h3 className="text-xl font-bold text-zinc-400 mb-2 tracking-tight">Zero transmissions detected</h3>
                                        <p className="text-sm text-zinc-600 max-w-sm mx-auto">Your intake module is active but hasn't received any data packets yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-6">
                                        {form.submissions.map((submission: any) => (
                                            <div key={submission.id} className="group relative rounded-[2rem] border border-white/5 bg-zinc-900/30 p-8 transition-all hover:bg-zinc-900/60 hover:border-blue-500/30">
                                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-400">
                                                            <Sparkles className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-white uppercase tracking-widest">Entry #{submission.id.slice(-6)}</p>
                                                            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                                                                Transmitted {formatDistanceToNow(new Date(submission.createdAt))} ago
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                    {submission.values.map((v: any) => {
                                                        const field = form.fields.find((f: any) => f.id === v.fieldId)
                                                        return (
                                                            <div key={v.id} className="space-y-1.5 p-4 rounded-2xl bg-black/40 border border-white/5">
                                                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{field?.label || 'Unknown Field'}</p>
                                                                <p className="text-sm text-zinc-300 font-medium leading-relaxed">{v.value}</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </main>
                    ) : (
                        <main className="flex-1 overflow-y-auto bg-black p-12">
                            {/* Settings view content (kept same as before for brevity but within the portal) */}
                            <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-10">
                                    <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500">
                                        <Zap className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-extrabold tracking-tight">Logic & Advanced Configuration</h2>
                                        <p className="text-zinc-500 font-medium">Architect behavioral rules and aesthetic signatures.</p>
                                    </div>
                                </div>

                                <div className="grid gap-8 md:grid-cols-2">
                                    <div className="space-y-8 rounded-[2.5rem] border border-white/5 bg-zinc-900/40 p-10">
                                        <div className="flex items-center gap-3 text-zinc-400">
                                            <Globe className="h-5 w-5" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Visibility Control</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { title: 'Global Discovery', desc: 'Allow public search engine indexing.' },
                                                { title: 'Authentication Wall', desc: 'Secure responses via user login.' }
                                            ].map(item => (
                                                <div key={item.title} className="flex items-center justify-between p-5 rounded-2xl bg-black/40 border border-white/5 group hover:border-white/10 transition-all">
                                                    <div>
                                                        <p className="text-sm font-bold">{item.title}</p>
                                                        <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-wider">{item.desc}</p>
                                                    </div>
                                                    <div className="h-6 w-11 rounded-full bg-zinc-800 p-1 cursor-pointer">
                                                        <div className="h-4 w-4 rounded-full bg-zinc-600" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-8 rounded-[2.5rem] border border-white/5 bg-zinc-900/40 p-10">
                                        <div className="flex items-center gap-3 text-zinc-400">
                                            <Sparkles className="h-5 w-5" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Aesthetic Signature</h3>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Core Accent</p>
                                                <div className="flex gap-4">
                                                    {['#3b82f6', '#10b981', '#f43f5e', '#a855f7', '#f59e0b'].map(color => (
                                                        <button
                                                            key={color}
                                                            onClick={() => setThemeColor(color)}
                                                            className={cn(
                                                                "h-10 w-10 rounded-2xl border-2 transition-all hover:scale-110",
                                                                themeColor === color ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "border-transparent"
                                                            )}
                                                            style={{ backgroundColor: color }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                                <p className="text-sm font-bold">Refractive Overlays</p>
                                                <div className="h-7 w-12 rounded-full bg-blue-600 p-1 flex justify-end">
                                                    <div className="h-5 w-5 rounded-full bg-white shadow-xl" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    )}
                </div>

                <DragOverlay dropAnimation={{
                    duration: 250,
                    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.4',
                            },
                        },
                    }),
                }}>
                    {activeSidebarItem && (
                        <div className="flex w-64 items-center justify-between rounded-[1.25rem] border border-blue-500 bg-zinc-900 p-4 shadow-2xl shadow-blue-500/20 opacity-80 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                    <activeSidebarItem.icon className="h-4 w-4" />
                                </div>
                                <span className="text-[13px] font-bold text-white">{activeSidebarItem.label}</span>
                            </div>
                        </div>
                    )}
                    {activeFieldItem && (
                        <div className="w-[600px] rounded-3xl border border-blue-500/50 bg-zinc-900/90 p-6 shadow-2xl shadow-blue-500/20 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <GripVertical className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-bold text-white">{activeFieldItem.label}</span>
                            </div>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Decommission Protocol"
                description={`You are about to permanently purge ${form.title} from the active deployment list. All transmission logs and module configurations will be lost. Proceed with caution.`}
                confirmText="Terminate Form"
                isDestructive
                isLoading={loading}
            />
        </div>
    )
}

function DraggableSidebarItem({ type, label, icon: Icon }: any) {
    const { attributes, listeners, setNodeRef, isDragging } = useSortable({
        id: `sidebar-${type}`,
        data: {
            type: 'sidebar',
        }
    })

    return (
        <button
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn(
                "group flex items-center justify-between rounded-[1.5rem] border border-white/5 bg-zinc-900/40 p-5 transition-all outline-none",
                "hover:bg-zinc-900 hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]",
                isDragging && "opacity-20 cursor-grabbing border-blue-600"
            )}
        >
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-zinc-950 flex items-center justify-center text-zinc-600 group-hover:text-blue-400 transition-colors">
                    <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">{label}</span>
            </div>
            <Plus className="h-4 w-4 text-zinc-800 group-hover:text-blue-500 transition-all group-hover:rotate-90" />
        </button>
    )
}

function SortableField({ field, onRemove, onUpdate }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: field.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const IconComp = useMemo(() => {
        const info = FIELD_TYPES.find(f => f.type === field.type)
        return info?.icon || Type
    }, [field.type])

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative rounded-[2rem] border transition-all duration-300",
                isDragging
                    ? "opacity-40 border-blue-500 shadow-2xl scale-[0.98] z-50 bg-zinc-900"
                    : "border-white/5 bg-zinc-900/30 hover:border-blue-500/30 hover:bg-zinc-900/60 p-8 shadow-lg"
            )}
        >
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <button
                        {...attributes}
                        {...listeners}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900/50 text-zinc-700 hover:text-white hover:bg-zinc-800 transition-all cursor-grab active:cursor-grabbing border border-white/5"
                    >
                        <GripVertical className="h-5 w-5" />
                    </button>
                    <div className="h-10 w-10 rounded-xl bg-zinc-900/50 flex items-center justify-center text-zinc-600 border border-white/5">
                        <IconComp className="h-5 w-5" />
                    </div>
                    <div className="flex-1 max-w-sm">
                        <input
                            value={field.label}
                            onChange={(e) => onUpdate(field.id, 'label', e.target.value)}
                            className="bg-transparent text-lg font-bold placeholder:text-zinc-800 transition-all focus:outline-none focus:text-blue-400 w-full tracking-tight"
                            placeholder="Enter module identifier..."
                        />
                    </div>
                </div>
                <button
                    onClick={() => onRemove(field.id)}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-500/5 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-xl"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>

            <div className="mb-8 pointer-events-none select-none px-14">
                {field.type === 'textarea' ? (
                    <div className="w-full rounded-[1.5rem] border border-white/5 bg-black/40 h-32 p-6 text-sm text-zinc-700">
                        {field.placeholder || 'Define long answer parameters...'}
                    </div>
                ) : field.type === 'checkbox' ? (
                    <div className="flex items-center gap-4 px-6 py-5 rounded-[1.5rem] border border-white/5 bg-black/40">
                        <div className="h-5 w-5 rounded-lg border border-white/20" />
                        <span className="text-sm text-zinc-700 font-medium">Coordinate multiple choices preview</span>
                    </div>
                ) : field.type === 'select' ? (
                    <div className="flex items-center justify-between w-full px-6 py-5 rounded-[1.5rem] border border-white/5 bg-black/40 text-sm text-zinc-700 font-medium">
                        <span>Select branch...</span>
                        <ChevronDown className="h-5 w-5" />
                    </div>
                ) : (
                    <div className="w-full rounded-[1.5rem] border border-white/5 bg-black/40 px-6 py-5 text-sm text-zinc-700 font-medium tracking-tight">
                        {field.placeholder || `Initialize ${field.type} input...`}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 px-14">
                <div className="flex items-center">
                    <button
                        onClick={() => onUpdate(field.id, 'required', !field.required)}
                        className={cn(
                            "flex items-center gap-3 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                            field.required
                                ? "bg-blue-600 text-white shadow-[0_0_25px_rgba(59,130,246,0.3)]"
                                : "bg-zinc-800/50 text-zinc-500 hover:text-white border border-white/5"
                        )}
                    >
                        {field.required ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                        {field.required ? 'Strict' : 'Open'}
                    </button>
                </div>
                <div className="relative">
                    <input
                        value={field.placeholder || ''}
                        onChange={(e) => onUpdate(field.id, 'placeholder', e.target.value)}
                        placeholder="Placeholder Override"
                        className="w-full rounded-2xl border border-white/5 bg-black/40 px-5 py-2.5 text-xs font-medium text-zinc-500 outline-none focus:border-blue-500/50 transition-all font-mono tracking-tighter"
                    />
                </div>
            </div>
        </div>
    )
}
