import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface FormSectionProps {
    icon: React.ReactNode;
    title: string;
    onAdd: () => void;
    children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ icon, title, onAdd, children }) => (
    <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 transition-colors">
            <div className="flex items-center gap-2">
                {icon}
                <h2 className="font-bold text-slate-800 dark:text-slate-200">{title}</h2>
            </div>
            <button onClick={onAdd} className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 rounded transition-colors">
                <Plus className="w-5 h-5" />
            </button>
        </div>
        {children}
    </section>
);

interface EntryWrapperProps {
    onRemove: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    children: React.ReactNode;
}

export const EntryWrapper: React.FC<EntryWrapperProps> = ({ onRemove, onMoveUp, onMoveDown, children }) => (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3 relative group transition-colors">
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onMoveUp && (
                <button onClick={onMoveUp} className="p-1 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Move Up">
                    <ChevronUp className="w-4 h-4" />
                </button>
            )}
            {onMoveDown && (
                <button onClick={onMoveDown} className="p-1 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Move Down">
                    <ChevronDown className="w-4 h-4" />
                </button>
            )}
            <button onClick={onRemove} className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors" title="Remove Entry">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
        <div className="pt-2 group-hover:pt-0 transition-all">
            {children}
        </div>
    </div>
);
