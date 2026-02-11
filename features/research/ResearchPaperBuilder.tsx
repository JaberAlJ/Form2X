'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    FileText,
    Download,
    Plus,
    Trash2,
    Users,
    Settings2,
    Eye,
    Maximize2,
    Minimize2,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Sun,
    Moon,
    Type,
    AlignLeft,
    Square,
    Columns,
    Quote,
    LayoutTemplate,
    Heading1,
    BookOpen,
    Image as ImageIcon,
    Grid,
    FileJson,
    Upload,
    Loader2,
    ChevronDown,
    ChevronUp,
    DownloadCloud,
    DownloadIcon,
    AlertCircle
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { INITIAL_PAPER_DATA } from './constants';
import { PaperData, ResearchSection, Author, Reference } from './types';
import ResearchPaperPreview from './components/ResearchPaperPreview';
import { exportToHtml, exportToJson, printToPdf } from './utils/export';
import { InputField, ImageUploader, TableEditor } from '@/components/ui/FormFields';
import { FormSection, EntryWrapper } from '@/components/ui/Containers';
import { StyleOption } from '@/components/ui/StyleOption';

// Validation Helpers
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ResearchPaperBuilder: React.FC = () => {
    const [data, setData] = useState<PaperData>(INITIAL_PAPER_DATA);
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const [sidebarTab, setSidebarTab] = useState<'content' | 'settings'>('content');
    const [zoom, setZoom] = useState(0.8);
    const [isExporting, setIsExporting] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const previewContainerRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const isDarkMode = resolvedTheme === 'dark';

    useEffect(() => {
        const handleResize = () => {
            if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.clientWidth;
                const padding = window.innerWidth < 768 ? 32 : 96;
                const availableWidth = containerWidth - padding;
                if (availableWidth < 794) setZoom(availableWidth / 794);
                else setZoom(0.8);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeTab]);

    const errors = useMemo(() => {
        const e: any = {
            title: '',
            authors: [],
            abstract: '',
            sections: [],
            references: []
        };

        if (!data.title.trim()) e.title = "Required";
        if (!data.abstract.trim()) e.abstract = "Required";

        e.authors = data.authors.map(author => ({
            name: !author.name.trim() ? "Required" : "",
            email: author.email && !validateEmail(author.email) ? "Invalid format" : ""
        }));

        e.sections = data.sections.map(section => ({
            title: !section.title.trim() ? "Required" : ""
        }));

        e.references = data.references.map(ref => ({
            text: !ref.text.trim() ? "Required" : ""
        }));

        return e;
    }, [data]);

    const hasAnyErrors = useMemo(() => {
        const check = (obj: any): boolean => {
            if (typeof obj === 'string') return obj !== "";
            if (Array.isArray(obj)) return obj.some(check);
            if (typeof obj === 'object' && obj !== null) return Object.values(obj).some(check);
            return false;
        };
        return check(errors);
    }, [errors]);

    const updateField = <K extends keyof PaperData>(field: K, value: PaperData[K]) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const addAuthor = () => {
        const newAuthor: Author = { id: Math.random().toString(36).substr(2, 9), name: '', dept: '', org: '', location: '', email: '' };
        updateField('authors', [...data.authors, newAuthor]);
    };

    const updateAuthor = (id: string, field: keyof Author, value: string) => {
        updateField('authors', data.authors.map(a => a.id === id ? { ...a, [field]: value } : a));
    };

    const removeAuthor = (id: string) => {
        updateField('authors', data.authors.filter(a => a.id !== id));
    };

    const addSection = () => {
        const newSection: ResearchSection = { id: Math.random().toString(36).substr(2, 9), title: '', content: '', level: 1 };
        updateField('sections', [...data.sections, newSection]);
    };

    const updateSection = (id: string, field: keyof ResearchSection, value: any) => {
        updateField('sections', data.sections.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const removeSection = (id: string) => {
        updateField('sections', data.sections.filter(s => s.id !== id));
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newSections = [...data.sections];
        const target = direction === 'up' ? index - 1 : index + 1;
        if (target >= 0 && target < newSections.length) {
            [newSections[index], newSections[target]] = [newSections[target], newSections[index]];
            updateField('sections', newSections);
        }
    };

    const addReference = () => {
        const newRef: Reference = { id: `r${data.references.length + 1}`, text: '' };
        updateField('references', [...data.references, newRef]);
    };

    const updateReference = (id: string, text: string) => {
        updateField('references', data.references.map(r => r.id === id ? { ...r, text } : r));
    };

    const removeReference = (id: string) => {
        updateField('references', data.references.filter(r => r.id !== id));
    };

    const addElement = (sectionId: string, type: 'figures' | 'tables' | 'equations' | 'bulletPoints') => {
        const section = data.sections.find(s => s.id === sectionId);
        if (!section) return;
        const items = section[type] || [];
        let newItem: any;
        if (type === 'figures') newItem = { id: Math.random().toString(36).substr(2, 9), imageData: '', caption: '' };
        else if (type === 'tables') newItem = { id: Math.random().toString(36).substr(2, 9), caption: '', rows: [['Header 1', 'Header 2'], ['', '']] };
        else if (type === 'equations') newItem = { id: Math.random().toString(36).substr(2, 9), latex: '' };
        else if (type === 'bulletPoints') newItem = '';

        updateSection(sectionId, type, [...items, newItem]);
    };

    const performExport = async (type: 'html' | 'json') => {
        if (hasAnyErrors) {
            alert("Please fix the errors in your paper before exporting.");
            return;
        }

        setIsExporting(true);
        await new Promise(r => setTimeout(r, 800));
        try {
            if (type === 'html') exportToHtml(data, isDarkMode);
            else if (type === 'json') exportToJson(data);
        } finally {
            setIsExporting(false);
        }
    };

    const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (json.title && json.authors) setData(json as PaperData);
            } catch (err) { alert("Invalid research data."); }
        };
        reader.readAsText(file);
    };

    if (!mounted) {
        return (
            <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors" />
        );
    }

    return (
        <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
            <aside className={`fixed inset-y-0 left-0 z-40 w-full md:relative flex flex-col h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all ${activeTab === 'preview' ? '-translate-x-full md:w-0 opacity-0 invisible' : 'translate-x-0 lg:w-5/12 xl:w-1/3 opacity-100 visible'}`}>
                <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-600 rounded-lg"><BookOpen className="w-5 h-5 text-white" /></div>
                        <h1 className="font-bold text-slate-800 dark:text-slate-100 italic transition-colors">Form2<span className="text-indigo-600">Research</span></h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setTheme(isDarkMode ? 'light' : 'dark')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-600 dark:text-slate-400">
                            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleImportJson} className="hidden" accept=".json" />
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-600 dark:text-slate-400"><Upload className="w-4 h-4" /></button>
                        <button onClick={() => performExport('json')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-600 dark:text-slate-400"><FileJson className="w-4 h-4" /></button>
                        <button onClick={() => performExport('html')} className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm flex items-center gap-2"><DownloadIcon className="w-4 h-4" />HTML</button>
                    </div>
                </header>

                <div className="flex bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0 p-1">
                    <button onClick={() => setSidebarTab('content')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all ${sidebarTab === 'content' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500'}`}><LayoutTemplate className="w-3.5 h-3.5" />Manuscript</button>
                    <button onClick={() => setSidebarTab('settings')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all ${sidebarTab === 'settings' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500'}`}><Settings2 className="w-3.5 h-3.5" />Formatting</button>
                </div>

                {sidebarTab === 'settings' && (
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-slate-900/50">
                        <StyleOption label="Column Layout" icon={<Columns className="w-3.5 h-3.5" />}>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => updateField('style', { ...data.style, columnLayout: '1-column' })} className={`py-2 text-[10px] font-bold rounded border transition-all ${data.style.columnLayout === '1-column' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200'}`}>SINGLE COLUMN</button>
                                <button onClick={() => updateField('style', { ...data.style, columnLayout: '2-column' })} className={`py-2 text-[10px] font-bold rounded border transition-all ${data.style.columnLayout === '2-column' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200'}`}>DOUBLE COLUMN</button>
                            </div>
                        </StyleOption>
                        <StyleOption label="Font Family" icon={<Type className="w-3.5 h-3.5" />}>
                            <select value={data.style.fontFamily} onChange={e => updateField('style', { ...data.style, fontFamily: e.target.value as any })} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none">
                                <option value="Times New Roman">Times New Roman (IEEE)</option>
                                <option value="Arial">Arial</option>
                                <option value="Helvetica">Helvetica</option>
                            </select>
                        </StyleOption>
                        <StyleOption label="Margin Size (inches)" icon={<Square className="w-3.5 h-3.5" />}>
                            <div className="flex items-center gap-4">
                                <input type="range" min="0.5" max="1.0" step="0.05" value={data.style.marginSize} onChange={e => updateField('style', { ...data.style, marginSize: parseFloat(e.target.value) })} className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-8">{data.style.marginSize}"</span>
                            </div>
                        </StyleOption>
                    </div>
                )}

                {sidebarTab === 'content' && (
                    <div className="flex-1 overflow-y-auto p-6 space-y-10 bg-white dark:bg-slate-900">
                        {hasAnyErrors && (
                            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold uppercase tracking-wide">Review Required</p>
                                    <p className="text-[11px] opacity-90">Please complete all required fields marked in red.</p>
                                </div>
                            </div>
                        )}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-indigo-100 dark:border-indigo-900 pb-2"><Heading1 className="w-5 h-5 text-indigo-600" /><h2 className="font-bold text-slate-800 dark:text-slate-200">Front Matter</h2></div>
                            <InputField required label="Paper Title" value={data.title} onChange={v => updateField('title', v)} placeholder="Full technical title..." error={errors.title} />
                            <div className="space-y-4">
                                <div className="flex items-center justify-between"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Authors & Affiliations</label><button onClick={addAuthor} className="text-[10px] font-bold text-indigo-600 uppercase flex items-center gap-1"><Plus className="w-3 h-3" /> Add Author</button></div>
                                {data.authors.map((author, idx) => (
                                    <EntryWrapper key={author.id} onRemove={() => removeAuthor(author.id)}>
                                        <InputField required label="Full Name" value={author.name} onChange={v => updateAuthor(author.id, 'name', v)} error={errors.authors[idx]?.name} />
                                        <InputField label="Department" value={author.dept} onChange={v => updateAuthor(author.id, 'dept', v)} />
                                        <InputField label="Organization / University" value={author.org} onChange={v => updateAuthor(author.id, 'org', v)} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <InputField label="Location (City, Country)" value={author.location} onChange={v => updateAuthor(author.id, 'location', v)} />
                                            <InputField label="Email" value={author.email} onChange={v => updateAuthor(author.id, 'email', v)} error={errors.authors[idx]?.email} />
                                        </div>
                                    </EntryWrapper>
                                ))}
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Abstract<span className="text-red-500"> *</span></label>
                                    {errors.abstract && <span className="text-[9px] font-bold text-red-500 uppercase">{errors.abstract}</span>}
                                </div>
                                <textarea value={data.abstract} onChange={e => updateField('abstract', e.target.value)} rows={4} className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border ${errors.abstract ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]' : 'border-slate-200 dark:border-slate-700'} rounded-md text-sm outline-none focus:ring-2 ${errors.abstract ? 'focus:ring-red-500/20' : 'focus:ring-indigo-500/20'} transition-all resize-none`} />
                            </div>
                            <InputField label="Keywords" value={data.keywords} onChange={v => updateField('keywords', v)} placeholder="Separated by commas..." />
                        </section>

                        <FormSection icon={<LayoutTemplate className="w-5 h-5 text-indigo-600" />} title="Sections" onAdd={addSection}>
                            {data.sections.map((section, idx) => (
                                <EntryWrapper key={section.id} onRemove={() => removeSection(section.id)} onMoveUp={idx > 0 ? () => moveSection(idx, 'up') : undefined} onMoveDown={idx < data.sections.length - 1 ? () => moveSection(idx, 'down') : undefined}>
                                    <div className="grid grid-cols-4 gap-2">
                                        <div className="col-span-3"><InputField required label="Section Title" value={section.title} onChange={v => updateSection(section.id, 'title', v)} error={errors.sections[idx]?.title} /></div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Level</label>
                                            <select value={section.level} onChange={e => updateSection(section.id, 'level', parseInt(e.target.value))} className="w-full px-2 py-2 bg-white dark:bg-slate-800 border border-slate-200 rounded-md text-sm outline-none">
                                                <option value={1}>I.</option>
                                                <option value={2}>A.</option>
                                                <option value={3}>1)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Content</label>
                                        <textarea value={section.content} onChange={e => updateSection(section.id, 'content', e.target.value)} rows={3} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none" />
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <button onClick={() => addElement(section.id, 'figures')} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hover:bg-slate-200 transition-colors flex items-center gap-1"><ImageIcon className="w-3 h-3" /> FIGURE</button>
                                        <button onClick={() => addElement(section.id, 'tables')} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hover:bg-slate-200 transition-colors flex items-center gap-1"><Grid className="w-3 h-3" /> TABLE</button>
                                        <button onClick={() => addElement(section.id, 'equations')} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hover:bg-slate-200 transition-colors flex items-center gap-1"><span className="text-[10px]">Σ</span> EQUATION</button>
                                    </div>

                                    {section.figures?.map((fig, fIdx) => (
                                        <div key={fig.id} className="p-3 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900 rounded-lg space-y-2 mt-2">
                                            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-indigo-500">FIGURE {fIdx + 1}</span><button onClick={() => updateSection(section.id, 'figures', section.figures?.filter(f => f.id !== fig.id))}><Trash2 className="w-3 h-3 text-slate-300 hover:text-red-500" /></button></div>
                                            <ImageUploader imageData={fig.imageData} onUpload={base64 => {
                                                const newFigs = [...(section.figures || [])];
                                                newFigs[fIdx].imageData = base64;
                                                updateSection(section.id, 'figures', newFigs);
                                            }} onRemove={() => {
                                                const newFigs = [...(section.figures || [])];
                                                newFigs[fIdx].imageData = '';
                                                updateSection(section.id, 'figures', newFigs);
                                            }} />
                                            <InputField label="Caption" value={fig.caption} onChange={v => {
                                                const newFigs = [...(section.figures || [])];
                                                newFigs[fIdx].caption = v;
                                                updateSection(section.id, 'figures', newFigs);
                                            }} />
                                        </div>
                                    ))}

                                    {section.tables?.map((tab, tIdx) => (
                                        <div key={tab.id} className="p-3 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900 rounded-lg space-y-2 mt-2">
                                            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-indigo-500">TABLE {tIdx + 1}</span><button onClick={() => updateSection(section.id, 'tables', section.tables?.filter(t => t.id !== tab.id))}><Trash2 className="w-3 h-3 text-slate-300 hover:text-red-500" /></button></div>
                                            <TableEditor rows={tab.rows} onChange={rows => {
                                                const newTabs = [...(section.tables || [])];
                                                newTabs[tIdx].rows = rows;
                                                updateSection(section.id, 'tables', newTabs);
                                            }} />
                                            <InputField label="Caption" value={tab.caption} onChange={v => {
                                                const newTabs = [...(section.tables || [])];
                                                newTabs[tIdx].caption = v;
                                                updateSection(section.id, 'tables', newTabs);
                                            }} />
                                        </div>
                                    ))}

                                    {section.equations?.map((eq, eIdx) => (
                                        <div key={eq.id} className="p-3 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900 rounded-lg space-y-2 mt-2">
                                            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-indigo-500">EQUATION {eIdx + 1}</span><button onClick={() => updateSection(section.id, 'equations', section.equations?.filter(e => e.id !== eq.id))}><Trash2 className="w-3 h-3 text-slate-300 hover:text-red-500" /></button></div>
                                            <textarea value={eq.latex} onChange={e => {
                                                const newEqs = [...(section.equations || [])];
                                                newEqs[eIdx].latex = e.target.value;
                                                updateSection(section.id, 'equations', newEqs);
                                            }} placeholder="\mathcal{L} = \sum w_i^2..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-mono outline-none" />
                                        </div>
                                    ))}
                                </EntryWrapper>
                            ))}
                        </FormSection>

                        <section className="space-y-4">
                            <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900 pb-2"><div className="flex items-center gap-2"><Quote className="w-5 h-5 text-indigo-600" /><h2 className="font-bold text-slate-800 dark:text-slate-200">References</h2></div><button onClick={addReference} className="p-1 hover:bg-indigo-50 rounded transition-colors"><Plus className="w-5 h-5 text-indigo-600" /></button></div>
                            <p className="text-[10px] text-slate-400 italic">Use [cite:r1] in content to link here.</p>
                            {data.references.map((ref, idx) => (
                                <div key={ref.id} className="flex gap-2 items-start group">
                                    <div className="pt-3 font-bold text-xs text-slate-300">[{idx + 1}]</div>
                                    <div className="flex-1 space-y-1">
                                        <InputField required label={`Ref ID: ${ref.id}`} value={ref.text} onChange={v => updateReference(ref.id, v)} error={errors.references[idx]?.text} />
                                    </div>
                                    <button onClick={() => removeReference(ref.id)} className="p-2 mt-4 text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </section>
                    </div>
                )}
            </aside>

            <main className={`flex-1 overflow-hidden bg-slate-200/50 dark:bg-slate-950 flex flex-col relative transition-colors ${activeTab === 'edit' ? 'hidden md:flex' : 'flex'}`}>
                <header className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-800 p-2 rounded-full shadow-xl z-20">
                    <div className="flex items-center border-r dark:border-slate-700 pr-2">
                        <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ZoomOut className="w-4 h-4" /></button>
                        <span className="text-[10px] font-bold w-12 text-center text-slate-500">{Math.round(zoom * 100)}%</span>
                        <button onClick={() => setZoom(z => Math.min(2.0, z + 0.1))} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ZoomIn className="w-4 h-4" /></button>
                        <button onClick={() => setZoom(0.8)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setActiveTab('edit')} className={`p-2 rounded-full transition-all ${activeTab === 'edit' ? 'bg-indigo-600 text-white shadow-md scale-110' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><PenLine className="w-4 h-4" /></button>
                        <button onClick={() => setActiveTab('preview')} className={`p-2 rounded-full transition-all ${activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-md scale-110' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Eye className="w-4 h-4" /></button>
                    </div>
                </header>

                <div ref={previewContainerRef} className="flex-1 overflow-auto p-4 md:p-12 scrollbar-thin">
                    <div className="mx-auto flex justify-center" style={{ width: `${794 * zoom}px`, paddingTop: '40px' }}>
                        <div ref={previewRef} className="origin-top shadow-2xl bg-white" style={{ transform: `scale(${zoom})`, width: '210mm', minHeight: '297mm', height: 'fit-content' }}>
                            <ResearchPaperPreview data={data} />
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 no-print z-50">
                <button
                    onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-xl active:scale-95 transition-all"
                >
                    {activeTab === 'edit' ? <Eye className="w-5 h-5" /> : <PenLine className="w-5 h-5" />}
                    {activeTab === 'edit' ? 'Preview' : 'Edit'}
                </button>
            </div>
        </div>
    );
};

const PenLine = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
);

export default ResearchPaperBuilder;
