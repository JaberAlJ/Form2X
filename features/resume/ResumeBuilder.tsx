'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    FileText,
    Download,
    ChevronUp,
    ChevronDown,
    Plus,
    Trash2,
    Layout,
    User,
    GraduationCap,
    Briefcase,
    FolderKanban,
    Wrench,
    ToggleLeft,
    ToggleRight,
    Eye,
    Maximize2,
    Minimize2,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Settings2,
    PenLine,
    Award,
    BookOpen,
    HeartHandshake,
    ShieldCheck,
    Users,
    Palette,
    Type,
    AlignLeft,
    Square,
    AlertCircle,
    FileJson,
    Upload,
    Loader2,
    Sun,
    Moon
} from 'lucide-react';

import { INITIAL_RESUME_DATA } from './constants';
import { ResumeData, SectionType, StyleConfig } from './types';
import ResumePreview from './components/ResumePreview';
import { exportToHtml, exportToJson } from './utils/export';
import { InputField, BulletPoints } from '@/components/ui/FormFields';
import { FormSection, EntryWrapper } from '@/components/ui/Containers';
import { StyleOption } from '@/components/ui/StyleOption';

// Validation Helpers
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateUrl = (url: string) => {
    if (!url) return true;
    try {
        const testUrl = url.startsWith('http') ? url : `https://${url}`;
        new URL(testUrl);
        return true;
    } catch { return false; }
};

const ResumeBuilder: React.FC = () => {
    const [data, setData] = useState<ResumeData>(INITIAL_RESUME_DATA);
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const [sidebarTab, setSidebarTab] = useState<'content' | 'layout' | 'styles'>('content');
    const [zoom, setZoom] = useState(0.8);
    const [previewHeight, setPreviewHeight] = useState(1056);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const previewRef = useRef<HTMLDivElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const handleResize = () => {
            if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.clientWidth;
                const padding = window.innerWidth < 768 ? 32 : 96;
                const availableWidth = containerWidth - padding;

                if (availableWidth < 816) {
                    setZoom(availableWidth / 816);
                } else {
                    setZoom(0.8);
                }
            }

            if (previewRef.current) {
                setPreviewHeight(previewRef.current.scrollHeight);
            }
        };

        handleResize();
        const timer = setTimeout(handleResize, 100);
        window.addEventListener('resize', handleResize);

        const observer = new MutationObserver(handleResize);
        if (previewRef.current) {
            observer.observe(previewRef.current, { childList: true, subtree: true });
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [activeTab, data]);

    const errors = useMemo(() => {
        const e: any = {
            header: {},
            education: [],
            experience: [],
            projects: [],
            certifications: [],
            leadership: [],
            honors: [],
            publications: [],
            volunteer: [],
            skills: []
        };

        if (!data.header.fullName.trim()) e.header.fullName = "Required";
        if (!data.header.location.trim()) e.header.location = "Required";
        if (!data.header.phone.trim()) e.header.phone = "Required";
        if (!data.header.email.trim()) e.header.email = "Required";
        else if (!validateEmail(data.header.email)) e.header.email = "Invalid format";

        e.header.links = data.header.links.map(l => ({
            url: l.url && !validateUrl(l.url) ? "Invalid URL" : ""
        }));

        e.education = data.education.map(item => ({
            university: !item.university.trim() ? "Required" : "",
            degree: !item.degree.trim() ? "Required" : "",
            graduationDate: !item.graduationDate.trim() ? "Required" : ""
        }));

        e.experience = data.experience.map(item => ({
            jobTitle: !item.jobTitle.trim() ? "Required" : "",
            organization: !item.organization.trim() ? "Required" : "",
            startDate: !item.startDate.trim() ? "Required" : ""
        }));

        e.projects = data.projects.map(item => ({
            title: !item.title.trim() ? "Required" : "",
            startDate: !item.startDate.trim() ? "Required" : ""
        }));

        e.certifications = data.certifications.map(item => ({
            name: !item.name.trim() ? "Required" : "",
            organization: !item.organization.trim() ? "Required" : "",
            date: !item.date.trim() ? "Required" : ""
        }));

        e.leadership = data.leadership.map(item => ({
            role: !item.role.trim() ? "Required" : "",
            organization: !item.organization.trim() ? "Required" : "",
            startDate: !item.startDate.trim() ? "Required" : ""
        }));

        e.honors = data.honors.map(item => ({
            name: !item.name.trim() ? "Required" : "",
            organization: !item.organization.trim() ? "Required" : "",
            year: !item.year.trim() ? "Required" : ""
        }));

        e.publications = data.publications.map(item => ({
            title: !item.title.trim() ? "Required" : "",
            authors: !item.authors.trim() ? "Required" : "",
            year: !item.year.trim() ? "Required" : ""
        }));

        e.volunteer = data.volunteer.map(item => ({
            role: !item.role.trim() ? "Required" : "",
            organization: !item.organization.trim() ? "Required" : "",
            startDate: !item.startDate.trim() ? "Required" : ""
        }));

        e.skills = data.skills.map(item => ({
            label: !item.label.trim() ? "Required" : "",
            skills: !item.skills.trim() ? "Required" : ""
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

    const updateHeader = (field: string, value: string) => {
        setData(prev => ({
            ...prev,
            header: { ...prev.header, [field]: value }
        }));
    };

    const addHeaderLink = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        setData(prev => ({
            ...prev,
            header: { ...prev.header, links: [...prev.header.links, { id: newId, label: '', url: '' }] }
        }));
    };

    const updateHeaderLink = (id: string, field: 'label' | 'url', value: string) => {
        setData(prev => ({
            ...prev,
            header: {
                ...prev.header,
                links: prev.header.links.map(link => link.id === id ? { ...link, [field]: value } : link)
            }
        }));
    };

    const removeHeaderLink = (id: string) => {
        setData(prev => ({
            ...prev,
            header: {
                ...prev.header,
                links: prev.header.links.filter(link => link.id !== id)
            }
        }));
    };

    const toggleSection = (section: SectionType) => {
        setData(prev => ({
            ...prev,
            enabledSections: {
                ...prev.enabledSections,
                [section]: !prev.enabledSections[section]
            }
        }));
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newOrder = [...data.sectionOrder];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const movingType = newOrder[index];
        const isSpecialSection = ['certifications', 'leadership', 'honors', 'publications', 'volunteer'].includes(movingType);

        if (targetIndex >= 0 && targetIndex < newOrder.length) {
            if (isSpecialSection && targetIndex === 0 && newOrder[targetIndex] === 'education') return;
            [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
            setData(prev => ({ ...prev, sectionOrder: newOrder }));
        }
    };

    const updateStyle = (field: keyof StyleConfig, value: any) => {
        setData(prev => ({
            ...prev,
            style: { ...prev.style, [field]: value }
        }));
    };

    const addEntry = (section: keyof Omit<ResumeData, 'header' | 'enabledSections' | 'sectionOrder' | 'skills' | 'style'>) => {
        const newId = Math.random().toString(36).substr(2, 9);
        let newEntry: any;
        switch (section) {
            case 'education': newEntry = { id: newId, university: '', college: '', degree: '', major: '', graduationDate: '', gpa: '', coursework: '' }; break;
            case 'experience': newEntry = { id: newId, jobTitle: '', organization: '', location: '', startDate: '', endDate: '', bullets: [''] }; break;
            case 'projects': newEntry = { id: newId, title: '', organization: '', startDate: '', endDate: '', bullets: [''] }; break;
            case 'certifications': newEntry = { id: newId, name: '', organization: '', date: '', expirationDate: '' }; break;
            case 'leadership':
            case 'volunteer': newEntry = { id: newId, role: '', organization: '', location: '', startDate: '', endDate: '', bullets: [''] }; break;
            case 'honors': newEntry = { id: newId, name: '', organization: '', year: '', description: '' }; break;
            case 'publications': newEntry = { id: newId, title: '', authors: '', journal: '', year: '', doi: '' }; break;
        }
        setData(prev => ({ ...prev, [section]: [...(prev[section] as any[]), newEntry] }));
    };

    const removeEntry = (section: keyof ResumeData, id: string) => {
        setData(prev => ({ ...prev, [section]: (prev[section] as any[]).filter(item => item.id !== id) }));
    };

    const moveEntry = (section: keyof ResumeData, index: number, direction: 'up' | 'down') => {
        const items = [...(data[section] as any[])];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < items.length) {
            [items[index], items[targetIndex]] = [items[targetIndex], items[index]];
            setData(prev => ({ ...prev, [section]: items }));
        }
    };

    const updateEntry = (section: keyof ResumeData, id: string, field: string, value: any) => {
        setData(prev => ({ ...prev, [section]: (prev[section] as any[]).map(item => item.id === id ? { ...item, [field]: value } : item) }));
    };

    const addBullet = (section: 'experience' | 'projects' | 'leadership' | 'volunteer', entryId: string) => {
        setData(prev => ({ ...prev, [section]: (prev[section] as any[]).map(item => item.id === entryId ? { ...item, bullets: [...item.bullets, ''] } : item) }));
    };

    const updateBullet = (section: 'experience' | 'projects' | 'leadership' | 'volunteer', entryId: string, bulletIndex: number, value: string) => {
        setData(prev => ({ ...prev, [section]: (prev[section] as any[]).map(item => item.id === entryId ? { ...item, bullets: item.bullets.map((b: string, i: number) => i === bulletIndex ? value : b) } : item) }));
    };

    const removeBullet = (section: 'experience' | 'projects' | 'leadership' | 'volunteer', entryId: string, bulletIndex: number) => {
        setData(prev => ({ ...prev, [section]: (prev[section] as any[]).map(item => item.id === entryId ? { ...item, bullets: item.bullets.filter((_: any, i: number) => i !== bulletIndex) } : item) }));
    };

    const addSkillCategory = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        setData(prev => ({ ...prev, skills: [...prev.skills, { id: newId, label: '', skills: '' }] }));
    };

    const removeSkillCategory = (id: string) => {
        setData(prev => ({ ...prev, skills: prev.skills.filter(cat => cat.id !== id) }));
    };

    const updateSkillCategory = (id: string, field: 'label' | 'skills', value: string) => {
        setData(prev => ({ ...prev, skills: prev.skills.map(cat => cat.id === id ? { ...cat, [field]: value } : cat) }));
    };

    const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (json.header && json.style) {
                    setData(json as ResumeData);
                } else {
                    alert("Invalid resume data format.");
                }
            } catch (err) {
                console.error("Failed to parse JSON", err);
                alert("Failed to import: Invalid JSON file.");
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const performExport = async (type: 'html' | 'json') => {
        if (hasAnyErrors) {
            alert("Please fix the errors in your resume before exporting.");
            return;
        }

        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            if (type === 'html') exportToHtml(data, isDarkMode);
            else if (type === 'json') exportToJson(data);
        } finally {
            setIsExporting(false);
        }
    };

    const isPreviewOnly = activeTab === 'preview';

    return (
        <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-full flex flex-col md:relative md:flex h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl md:shadow-none transition-all duration-500 ease-in-out no-print ${isPreviewOnly ? '-translate-x-full md:w-0 overflow-hidden opacity-0 invisible' : 'translate-x-0 lg:w-5/12 xl:w-1/3 opacity-100 visible'}
      `}>

                <header className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0 z-30 transition-colors">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-600 rounded-lg"><FileText className="w-5 h-5 text-white" /></div>
                        <h1 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">Form2<span className="text-blue-600">Resume</span></h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-600 dark:text-slate-400"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <div className="flex gap-1 items-center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImportJson}
                                className="hidden"
                                accept=".json"
                            />
                            <button
                                disabled={isExporting}
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-600 dark:text-slate-400 disabled:opacity-50"
                                title="Import JSON"
                            >
                                <Upload className="w-4 h-4" />
                            </button>
                            <button
                                disabled={isExporting}
                                onClick={() => performExport('json')}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-600 dark:text-slate-400 disabled:opacity-50"
                                title="Export JSON"
                            >
                                {isExporting ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <FileJson className="w-4 h-4" />}
                            </button>
                            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                            <button
                                disabled={isExporting}
                                onClick={() => performExport('html')}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                                title="Export as standalone HTML file"
                            >
                                {isExporting ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <Download className="w-4 h-4" />}
                                HTML
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0 p-1 transition-colors">
                    <button onClick={() => setSidebarTab('content')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all ${sidebarTab === 'content' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}><PenLine className="w-3.5 h-3.5" />Content</button>
                    <button onClick={() => setSidebarTab('layout')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all ${sidebarTab === 'layout' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}><Layout className="w-3.5 h-3.5" />Layout</button>
                    <button onClick={() => setSidebarTab('styles')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all ${sidebarTab === 'styles' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}><Palette className="w-3.5 h-3.5" />Styles</button>
                </div>

                {sidebarTab === 'layout' && (
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 dark:bg-slate-900/50 transition-colors">
                        <div className="flex items-center gap-2 mb-6"><Layout className="w-4 h-4 text-blue-600" /><h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Section Arrangement</h2></div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center"><User className="w-4 h-4 text-slate-400 dark:text-slate-500" /></div><span className="text-sm font-bold text-slate-600 dark:text-slate-400">HEADER</span></div>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Fixed Top</span>
                            </div>
                            {data.sectionOrder.map((section, idx) => (
                                <div key={section} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-200 dark:hover:border-blue-900 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => toggleSection(section)} className={`transition-colors p-1 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 ${data.enabledSections[section] ? 'text-blue-600' : 'text-slate-300 dark:text-slate-600'}`}>{data.enabledSections[section] ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}</button>
                                        <span className={`text-sm font-bold uppercase tracking-tight ${data.enabledSections[section] ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600 line-through'}`}>{section}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button disabled={idx === 0} onClick={() => moveSection(idx, 'up')} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 rounded-lg text-slate-400 dark:text-slate-500 disabled:opacity-20 transition-all"><ChevronUp className="w-4 h-4" /></button>
                                        <button disabled={idx === data.sectionOrder.length - 1} onClick={() => moveSection(idx, 'down')} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 rounded-lg text-slate-400 dark:text-slate-500 disabled:opacity-20 transition-all"><ChevronDown className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center"><Wrench className="w-4 h-4 text-slate-400 dark:text-slate-500" /></div><span className="text-sm font-bold text-slate-600 dark:text-slate-400">SKILLS</span></div>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Fixed Bottom</span>
                            </div>
                        </div>
                    </div>
                )}

                {sidebarTab === 'styles' && (
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 dark:bg-slate-900/50 space-y-8 transition-colors">
                        <div>
                            <div className="flex items-center gap-2 mb-4"><Palette className="w-4 h-4 text-blue-600" /><h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Global Styles</h2></div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-6 bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100/50 dark:border-blue-900/30">"These style options are optimized for Applicant Tracking Systems (ATS)."</p>

                            <div className="space-y-6">
                                <StyleOption label="Font Family" icon={<Type className="w-3.5 h-3.5" />}>
                                    <select value={data.style.fontFamily} onChange={e => updateStyle('fontFamily', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all">
                                        <option value="Arial">Arial (Sans-Serif)</option>
                                        <option value="Times New Roman">Times New Roman (Serif)</option>
                                        <option value="Calibri">Calibri (Sans-Serif)</option>
                                        <option value="Helvetica">Helvetica (Sans-Serif)</option>
                                    </select>
                                </StyleOption>

                                <StyleOption label="Base Font Size" icon={<span className="text-[10px] font-bold">12</span>}>
                                    <div className="flex items-center gap-4">
                                        <input type="range" min="10" max="12" step="0.5" value={data.style.baseFontSize} onChange={e => updateStyle('baseFontSize', parseFloat(e.target.value))} className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-8">{data.style.baseFontSize}pt</span>
                                    </div>
                                </StyleOption>

                                <StyleOption label="Line Spacing" icon={<AlignLeft className="w-3.5 h-3.5" />}>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[1.0, 1.15, 1.2].map(v => (
                                            <button key={v} onClick={() => updateStyle('lineSpacing', v)} className={`py-1.5 text-xs font-bold rounded border transition-all ${data.style.lineSpacing === v ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700'}`}>{v}</button>
                                        ))}
                                    </div>
                                </StyleOption>

                                <StyleOption label="Page Margins" icon={<Square className="w-3.5 h-3.5" />}>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[0.5, 0.75, 1.0].map(v => (
                                            <button key={v} onClick={() => updateStyle('marginSize', v)} className={`py-1.5 text-xs font-bold rounded border transition-all ${data.style.marginSize === v ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700'}`}>{v}"</button>
                                        ))}
                                    </div>
                                </StyleOption>

                                <StyleOption label="Section Title Emphasis" icon={<Settings2 className="w-3.5 h-3.5" />}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => updateStyle('headerStyle', 'Bold')} className={`py-2 text-[10px] font-bold rounded border transition-all ${data.style.headerStyle === 'Bold' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>BOLD</button>
                                        <button onClick={() => updateStyle('headerStyle', 'BoldAllCaps')} className={`py-2 text-[10px] font-bold rounded border transition-all ${data.style.headerStyle === 'BoldAllCaps' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>BOLD + CAPS</button>
                                    </div>
                                </StyleOption>

                                <StyleOption label="Bullet Style" icon={<span className="text-[12px] font-bold">•</span>}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => updateStyle('bulletStyle', '•')} className={`py-2 text-sm font-bold rounded border transition-all ${data.style.bulletStyle === '•' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>• Bullet</button>
                                        <button onClick={() => updateStyle('bulletStyle', '-')} className={`py-2 text-sm font-bold rounded border transition-all ${data.style.bulletStyle === '-' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>- Hyphen</button>
                                    </div>
                                </StyleOption>

                                <StyleOption label="Text Color" icon={<Palette className="w-3.5 h-3.5" />}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => updateStyle('textColor', 'Black')} className={`flex items-center justify-center gap-2 py-2 text-[10px] font-bold rounded border transition-all ${data.style.textColor === 'Black' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                            <div className="w-3 h-3 rounded-full bg-black border border-white/20"></div> BLACK
                                        </button>
                                        <button onClick={() => updateStyle('textColor', 'DarkGray')} className={`flex items-center justify-center gap-2 py-2 text-[10px] font-bold rounded border transition-all ${data.style.textColor === 'DarkGray' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                            <div className="w-3 h-3 rounded-full bg-[#333] border border-white/20"></div> DARK GRAY
                                        </button>
                                    </div>
                                </StyleOption>
                            </div>
                        </div>
                    </div>
                )}

                {sidebarTab === 'content' && (
                    <div className="flex-1 overflow-y-auto p-6 space-y-10 scroll-smooth bg-white dark:bg-slate-900 pb-24 md:pb-6 transition-colors">
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
                            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 transition-colors"><User className="w-5 h-5 text-blue-600" /><h2 className="font-bold text-slate-800 dark:text-slate-200">Contact Information</h2></div>
                            <div className="grid grid-cols-1 gap-4">
                                <InputField required label="Full Name" value={data.header.fullName} onChange={v => updateHeader('fullName', v)} error={errors.header.fullName} />
                                <InputField required label="City, State, ZIP" value={data.header.location} onChange={v => updateHeader('location', v)} error={errors.header.location} />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField required label="Phone" type="tel" value={data.header.phone} onChange={v => updateHeader('phone', v)} error={errors.header.phone} />
                                    <InputField required label="Email" type="email" value={data.header.email} onChange={v => updateHeader('email', v)} error={errors.header.email} />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between"><label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Additional Links</label><button onClick={addHeaderLink} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase flex items-center gap-1"><Plus className="w-3 h-3" /> Add Link</button></div>
                                    {data.header.links.map((link, idx) => (
                                        <div key={link.id} className="flex gap-2 items-start group">
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                <InputField label="Label" value={link.label} onChange={v => updateHeaderLink(link.id, 'label', v)} placeholder="LinkedIn..." />
                                                <InputField label="URL / Handle" value={link.url} onChange={v => updateHeaderLink(link.id, 'url', v)} placeholder="username" error={errors.header.links[idx]?.url} />
                                            </div>
                                            <button onClick={() => removeHeaderLink(link.id)} className="p-2 mt-4 text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {data.enabledSections.education && (
                            <FormSection icon={<GraduationCap className="w-5 h-5 text-blue-600" />} title="Education" onAdd={() => addEntry('education')}>
                                {data.education.map((edu, idx) => (
                                    <EntryWrapper
                                        key={edu.id}
                                        onRemove={() => removeEntry('education', edu.id)}
                                        onMoveUp={idx > 0 ? () => moveEntry('education', idx, 'up') : undefined}
                                        onMoveDown={idx < data.education.length - 1 ? () => moveEntry('education', idx, 'down') : undefined}
                                    >
                                        <InputField required label="University" value={edu.university} onChange={v => updateEntry('education', edu.id, 'university', v)} error={errors.education[idx]?.university} />
                                        <InputField label="College / School" value={edu.college} onChange={v => updateEntry('education', edu.id, 'college', v)} />
                                        <div className="grid grid-cols-2 gap-3">
                                            <InputField required label="Degree" value={edu.degree} onChange={v => updateEntry('education', edu.id, 'degree', v)} error={errors.education[idx]?.degree} />
                                            <InputField label="Major" value={edu.major} onChange={v => updateEntry('education', edu.id, 'major', v)} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <InputField label="Minor" value={edu.minor || ''} onChange={v => updateEntry('education', edu.id, 'minor', v)} />
                                            <InputField required label="Grad Date" type="date" value={edu.graduationDate} onChange={v => updateEntry('education', edu.id, 'graduationDate', v)} error={errors.education[idx]?.graduationDate} />
                                            <InputField label="GPA" value={edu.gpa} onChange={v => updateEntry('education', edu.id, 'gpa', v)} />
                                        </div>
                                        <InputField label="Relevant Coursework" value={edu.coursework} onChange={v => updateEntry('education', edu.id, 'coursework', v)} placeholder="e.g., Data Structures, AI" />
                                    </EntryWrapper>
                                ))}
                            </FormSection>
                        )}

                        {data.enabledSections.experience && (
                            <FormSection icon={<Briefcase className="w-5 h-5 text-blue-600" />} title="Experience" onAdd={() => addEntry('experience')}>
                                {data.experience.map((exp, idx) => (
                                    <EntryWrapper
                                        key={exp.id}
                                        onRemove={() => removeEntry('experience', exp.id)}
                                        onMoveUp={idx > 0 ? () => moveEntry('experience', idx, 'up') : undefined}
                                        onMoveDown={idx < data.experience.length - 1 ? () => moveEntry('experience', idx, 'down') : undefined}
                                    >
                                        <InputField required label="Job Title" value={exp.jobTitle} onChange={v => updateEntry('experience', exp.id, 'jobTitle', v)} error={errors.experience[idx]?.jobTitle} />
                                        <InputField required label="Organization" value={exp.organization} onChange={v => updateEntry('experience', exp.id, 'organization', v)} error={errors.experience[idx]?.organization} />
                                        <div className="grid grid-cols-2 gap-3">
                                            <InputField required label="Start Date" type="date" value={exp.startDate} onChange={v => updateEntry('experience', exp.id, 'startDate', v)} error={errors.experience[idx]?.startDate} />
                                            <div className="flex flex-col">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">End Date</label>
                                                    <button onClick={() => updateEntry('experience', exp.id, 'endDate', 'Present')} className="text-[9px] font-bold text-blue-600 uppercase hover:underline">Set Present</button>
                                                </div>
                                                <input type={exp.endDate === 'Present' ? 'text' : 'date'} value={exp.endDate} onChange={e => updateEntry('experience', exp.id, 'endDate', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                            </div>
                                        </div>
                                        <InputField label="Location" value={exp.location} onChange={v => updateEntry('experience', exp.id, 'location', v)} />
                                        <BulletPoints bullets={exp.bullets} onAdd={() => addBullet('experience', exp.id)} onChange={(idx, v) => updateBullet('experience', exp.id, idx, v)} onRemove={(idx) => removeBullet('experience', exp.id, idx)} />
                                    </EntryWrapper>
                                ))}
                            </FormSection>
                        )}

                        {data.enabledSections.projects && (
                            <FormSection icon={<FolderKanban className="w-5 h-5 text-blue-600" />} title="Projects" onAdd={() => addEntry('projects')}>
                                {data.projects.map((proj, idx) => (
                                    <EntryWrapper
                                        key={proj.id}
                                        onRemove={() => removeEntry('projects', proj.id)}
                                        onMoveUp={idx > 0 ? () => moveEntry('projects', idx, 'up') : undefined}
                                        onMoveDown={idx < data.projects.length - 1 ? () => moveEntry('projects', idx, 'down') : undefined}
                                    >
                                        <InputField required label="Title" value={proj.title} onChange={v => updateEntry('projects', proj.id, 'title', v)} error={errors.projects[idx]?.title} />
                                        <InputField label="Organization / Course" value={proj.organization} onChange={v => updateEntry('projects', proj.id, 'organization', v)} />
                                        <div className="grid grid-cols-2 gap-3">
                                            <InputField required label="Start Date" type="date" value={proj.startDate} onChange={v => updateEntry('projects', proj.id, 'startDate', v)} error={errors.projects[idx]?.startDate} />
                                            <InputField label="End Date" type="date" value={proj.endDate} onChange={v => updateEntry('projects', proj.id, 'endDate', v)} />
                                        </div>
                                        <BulletPoints bullets={proj.bullets} onAdd={() => addBullet('projects', proj.id)} onChange={(idx, v) => updateBullet('projects', proj.id, idx, v)} onRemove={(idx) => removeBullet('projects', proj.id, idx)} />
                                    </EntryWrapper>
                                ))}
                            </FormSection>
                        )}

                        {data.enabledSections.certifications && (
                            <FormSection icon={<ShieldCheck className="w-5 h-5 text-blue-600" />} title="Certifications" onAdd={() => addEntry('certifications')}>
                                {data.certifications.map((cert, idx) => (
                                    <EntryWrapper
                                        key={cert.id}
                                        onRemove={() => removeEntry('certifications', cert.id)}
                                        onMoveUp={idx > 0 ? () => moveEntry('certifications', idx, 'up') : undefined}
                                        onMoveDown={idx < data.certifications.length - 1 ? () => moveEntry('certifications', idx, 'down') : undefined}
                                    >
                                        <InputField required label="Certification Name" value={cert.name} onChange={v => updateEntry('certifications', cert.id, 'name', v)} error={errors.certifications[idx]?.name} />
                                        <InputField required label="Issuing Organization" value={cert.organization} onChange={v => updateEntry('certifications', cert.id, 'organization', v)} error={errors.certifications[idx]?.name} />
                                        <div className="grid grid-cols-2 gap-3">
                                            <InputField required label="Date Earned" type="date" value={cert.date} onChange={v => updateEntry('certifications', cert.id, 'date', v)} error={errors.certifications[idx]?.date} />
                                            <InputField label="Expiration Date" type="date" value={cert.expirationDate || ''} onChange={v => updateEntry('certifications', cert.id, 'expirationDate', v)} />
                                        </div>
                                    </EntryWrapper>
                                ))}
                            </FormSection>
                        )}

                        {data.enabledSections.leadership && (
                            <FormSection icon={<Users className="w-5 h-5 text-blue-600" />} title="Leadership & Activities" onAdd={() => addEntry('leadership')}>
                                {data.leadership.map((lead, idx) => (
                                    <EntryWrapper
                                        key={lead.id}
                                        onRemove={() => removeEntry('leadership', lead.id)}
                                        onMoveUp={idx > 0 ? () => moveEntry('leadership', idx, 'up') : undefined}
                                        onMoveDown={idx < data.leadership.length - 1 ? () => moveEntry('leadership', idx, 'down') : undefined}
                                    >
                                        <InputField required label="Role / Title" value={lead.role} onChange={v => updateEntry('leadership', lead.id, 'role', v)} error={errors.leadership[idx]?.role} />
                                        <InputField required label="Organization / Club" value={lead.organization} onChange={v => updateEntry('leadership', lead.id, 'organization', v)} error={errors.leadership[idx]?.organization} />
                                        <InputField label="Location" value={lead.location} onChange={v => updateEntry('leadership', lead.id, 'location', v)} />
                                        <div className="grid grid-cols-2 gap-3">
                                            <InputField required label="Start Date" type="date" value={lead.startDate} onChange={v => updateEntry('leadership', lead.id, 'startDate', v)} error={errors.leadership[idx]?.startDate} />
                                            <div className="flex flex-col">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">End Date</label>
                                                    <button onClick={() => updateEntry('leadership', lead.id, 'endDate', 'Present')} className="text-[9px] font-bold text-blue-600 uppercase hover:underline">Set Present</button>
                                                </div>
                                                <input type={lead.endDate === 'Present' ? 'text' : 'date'} value={lead.endDate} onChange={e => updateEntry('leadership', lead.id, 'endDate', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                            </div>
                                        </div>
                                        <BulletPoints bullets={lead.bullets} onAdd={() => addBullet('leadership', lead.id)} onChange={(idx, v) => updateBullet('leadership', lead.id, idx, v)} onRemove={(idx) => removeBullet('leadership', lead.id, idx)} />
                                    </EntryWrapper>
                                ))}
                            </FormSection>
                        )}

                        {data.enabledSections.honors && (
                            <FormSection icon={<Award className="w-5 h-5 text-blue-600" />} title="Honors & Awards" onAdd={() => addEntry('honors')}>
                                {data.honors.map((honor, idx) => (
                                    <EntryWrapper
                                        key={honor.id}
                                        onRemove={() => removeEntry('honors', honor.id)}
                                        onMoveUp={idx > 0 ? () => moveEntry('honors', idx, 'up') : undefined}
                                        onMoveDown={idx < data.honors.length - 1 ? () => moveEntry('honors', idx, 'down') : undefined}
                                    >
                                        <InputField required label="Award Name" value={honor.name} onChange={v => updateEntry('honors', honor.id, 'name', v)} error={errors.honors[idx]?.name} />
                                        <InputField required label="Issuing Organization" value={honor.organization} onChange={v => updateEntry('honors', honor.id, 'organization', v)} error={errors.honors[idx]?.organization} />
                                        <InputField required label="Year Received" value={honor.year} onChange={v => updateEntry('honors', honor.id, 'year', v)} error={errors.honors[idx]?.year} />
                                        <InputField label="Description" value={honor.description || ''} onChange={v => updateEntry('honors', honor.id, 'description', v)} />
                                    </EntryWrapper>
                                ))}
                            </FormSection>
                        )}

                        {data.enabledSections.publications && (
                            <FormSection icon={<BookOpen className="w-5 h-5 text-blue-600" />} title="Publications" onAdd={() => addEntry('publications')}>
                                {data.publications.map((pub, idx) => (
                                    <EntryWrapper
                                        key={pub.id}
                                        onRemove={() => removeEntry('publications', pub.id)}
                                        onMoveUp={idx > 0 ? () => moveEntry('publications', idx, 'up') : undefined}
                                        onMoveDown={idx < data.publications.length - 1 ? () => moveEntry('publications', idx, 'down') : undefined}
                                    >
                                        <InputField required label="Publication Title" value={pub.title} onChange={v => updateEntry('publications', pub.id, 'title', v)} error={errors.publications[idx]?.title} />
                                        <InputField required label="Authors" value={pub.authors} onChange={v => updateEntry('publications', pub.id, 'authors', v)} error={errors.publications[idx]?.authors} />
                                        <InputField label="Journal / Conference" value={pub.journal} onChange={v => updateEntry('publications', pub.id, 'journal', v)} />
                                        <div className="grid grid-cols-2 gap-3">
                                            <InputField required label="Year" value={pub.year} onChange={v => updateEntry('publications', pub.id, 'year', v)} error={errors.publications[idx]?.year} />
                                            <InputField label="DOI / URL" value={pub.doi || ''} onChange={v => updateEntry('publications', pub.id, 'doi', v)} />
                                        </div>
                                    </EntryWrapper>
                                ))}
                            </FormSection>
                        )}

                        {data.enabledSections.volunteer && (
                            <FormSection icon={<HeartHandshake className="w-5 h-5 text-blue-600" />} title="Volunteer Experience" onAdd={() => addEntry('volunteer')}>
                                {data.volunteer.map((vol, idx) => (
                                    <EntryWrapper
                                        key={vol.id}
                                        onRemove={() => removeEntry('volunteer', vol.id)}
                                        onMoveUp={idx > 0 ? () => moveEntry('volunteer', idx, 'up') : undefined}
                                        onMoveDown={idx < data.volunteer.length - 1 ? () => moveEntry('volunteer', idx, 'down') : undefined}
                                    >
                                        <InputField required label="Role" value={vol.role} onChange={v => updateEntry('volunteer', vol.id, 'role', v)} error={errors.volunteer[idx]?.role} />
                                        <InputField required label="Organization" value={vol.organization} onChange={v => updateEntry('volunteer', vol.id, 'organization', v)} error={errors.volunteer[idx]?.organization} />
                                        <InputField label="Location" value={vol.location} onChange={v => updateEntry('volunteer', vol.id, 'location', v)} />
                                        <div className="grid grid-cols-2 gap-3">
                                            <InputField required label="Start Date" type="date" value={vol.startDate} onChange={v => updateEntry('volunteer', vol.id, 'startDate', v)} error={errors.volunteer[idx]?.startDate} />
                                            <div className="flex flex-col">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">End Date</label>
                                                    <button onClick={() => updateEntry('volunteer', vol.id, 'endDate', 'Present')} className="text-[9px] font-bold text-blue-600 uppercase hover:underline">Set Present</button>
                                                </div>
                                                <input type={vol.endDate === 'Present' ? 'text' : 'date'} value={vol.endDate} onChange={e => updateEntry('volunteer', vol.id, 'endDate', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                            </div>
                                        </div>
                                        <BulletPoints bullets={vol.bullets} onAdd={() => addBullet('volunteer', vol.id)} onChange={(idx, v) => updateBullet('volunteer', vol.id, idx, v)} onRemove={(idx) => removeBullet('volunteer', vol.id, idx)} />
                                    </EntryWrapper>
                                ))}
                            </FormSection>
                        )}

                        {data.enabledSections.skills && (
                            <FormSection icon={<Wrench className="w-5 h-5 text-blue-600" />} title="Skills" onAdd={addSkillCategory}>
                                <div className="space-y-4">
                                    {data.skills.map((cat, idx) => (
                                        <EntryWrapper
                                            key={cat.id}
                                            onRemove={() => removeSkillCategory(cat.id)}
                                            onMoveUp={idx > 0 ? () => moveEntry('skills', idx, 'up') : undefined}
                                            onMoveDown={idx < data.skills.length - 1 ? () => moveEntry('skills', idx, 'down') : undefined}
                                        >
                                            <InputField required label="Category" value={cat.label} onChange={v => updateSkillCategory(cat.id, 'label', v)} error={errors.skills[idx]?.label} />
                                            <InputField required label="Skills" value={cat.skills} onChange={v => updateSkillCategory(cat.id, 'skills', v)} error={errors.skills[idx]?.skills} />
                                        </EntryWrapper>
                                    ))}
                                </div>
                            </FormSection>
                        )}
                    </div>
                )}
            </aside>

            <main className={`flex-1 overflow-hidden bg-slate-100 dark:bg-slate-950 flex flex-col relative no-print transition-colors duration-300 ${activeTab === 'edit' ? 'hidden md:flex' : 'flex'}`}>
                <header className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-800 p-1.5 rounded-full shadow-lg z-20 transition-all hover:bg-white dark:hover:bg-slate-900">
                    <div className="flex items-center border-r border-slate-200 dark:border-slate-800 pr-1 mr-1">
                        <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 transition-colors"><ZoomOut className="w-4 h-4" /></button>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-10 text-center select-none">{Math.round(zoom * 100)}%</span>
                        <button onClick={() => setZoom(z => Math.min(2.0, z + 0.1))} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 transition-colors"><ZoomIn className="w-4 h-4" /></button>
                        <button onClick={() => setZoom(0.8)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 transition-colors" title="Fit to Screen"><RotateCcw className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex items-center border-r border-slate-200 dark:border-slate-800 pr-1 mr-1">
                        <button onClick={() => setActiveTab('edit')} className={`p-1.5 rounded-full transition-all ${activeTab === 'edit' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title="Edit Mode"><PenLine className="w-4 h-4" /></button>
                        <button onClick={() => setActiveTab('preview')} className={`p-1.5 rounded-full transition-all ${activeTab === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title="Preview Mode"><Eye className="w-4 h-4" /></button>
                    </div>
                    <button onClick={() => setActiveTab(activeTab === 'preview' ? 'edit' : 'preview')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 transition-colors">
                        {isPreviewOnly ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </header>

                <div ref={previewContainerRef} className="flex-1 overflow-auto p-4 md:p-12 transition-all duration-300">
                    <div className="mx-auto flex justify-center" style={{ width: `${816 * zoom}px`, paddingTop: '40px' }}>
                        <div
                            ref={previewRef}
                            className="origin-top shadow-2xl transition-transform duration-200 bg-white"
                            style={{
                                transform: `scale(${zoom})`,
                                width: '816px',
                                minHeight: '1056px',
                                height: 'fit-content'
                            }}
                        >
                            <ResumePreview data={data} />
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:hidden no-print z-50">
                <button
                    onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-xl active:scale-95 transition-all"
                >
                    {activeTab === 'edit' ? <Eye className="w-5 h-5" /> : <PenLine className="w-5 h-5" />}
                    {activeTab === 'edit' ? 'Preview' : 'Edit'}
                </button>
            </div>
        </div>
    );
};

export default ResumeBuilder;
