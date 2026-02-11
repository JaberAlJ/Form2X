import React from 'react';

interface StyleOptionProps {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

export const StyleOption: React.FC<StyleOptionProps> = ({ label, icon, children }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <div className="w-5 h-5 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors">
                {icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        {children}
    </div>
);
