import React from 'react';
import { Plus, Trash2, CalendarDays } from 'lucide-react';
import { EntryWrapper } from './Containers';

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    type?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
    label, value, onChange, placeholder, required, error, type = "text"
}) => (
    <div className="space-y-1 w-full relative">
        <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {error && <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">{error}</span>}
        </div>
        <div className="relative group/input">
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${error
                    ? 'border-red-300 dark:border-red-900 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                    } ${type === 'date' ? 'pr-8' : ''}`}
            />
            {type === 'date' && (
                <CalendarDays className="w-4 h-4 text-slate-300 dark:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover/input:text-blue-400 transition-colors" />
            )}
        </div>
    </div>
);

interface BulletPointsProps {
    bullets: string[];
    onAdd: () => void;
    onChange: (idx: number, val: string) => void;
    onRemove: (idx: number) => void;
    onMove: (idx: number, direction: 'up' | 'down') => void;
}

export const BulletPoints: React.FC<BulletPointsProps> = ({ bullets, onAdd, onChange, onRemove, onMove }) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bullet Points</label>
            <button onClick={onAdd} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tighter flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Bullet
            </button>
        </div>
        <div className="space-y-3">
            {bullets.map((bullet, idx) => (
                <EntryWrapper
                    key={idx}
                    onRemove={() => onRemove(idx)}
                    onMoveUp={idx > 0 ? () => onMove(idx, 'up') : undefined}
                    onMoveDown={idx < bullets.length - 1 ? () => onMove(idx, 'down') : undefined}
                >
                    <textarea
                        rows={1}
                        value={bullet}
                        onChange={e => {
                            onChange(idx, e.target.value);
                            e.target.style.height = 'inherit';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onFocus={e => {
                            e.target.style.height = 'inherit';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        placeholder="Describe your achievement..."
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                    />
                </EntryWrapper>
            ))}
        </div>
    </div>
);

export const ImageUploader: React.FC<{ imageData: string, onUpload: (base64: string) => void, onRemove: () => void }> = ({ imageData, onUpload, onRemove }) => {
    const fileRef = React.useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => onUpload(event.target?.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Image / Diagram</label>
            <div className={`relative border-2 border-dashed rounded-lg transition-all flex flex-col items-center justify-center min-h-[140px] px-4 text-center ${imageData ? 'border-indigo-200 bg-indigo-50/10' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600'}`}>
                {imageData ? (
                    <div className="relative w-full aspect-video flex items-center justify-center p-2 group">
                        <img src={imageData} alt="Uploaded" className="max-h-full max-w-full object-contain rounded shadow-sm" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                            <button onClick={onRemove} className="p-2 bg-white rounded-full text-red-500 shadow-xl hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2"><Plus className="w-5 h-5 text-slate-400" /></div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Upload an image or diagram</p>
                        <p className="text-[10px] text-slate-400">PNG, JPG or SVG up to 5MB</p>
                        <button onClick={() => fileRef.current?.click()} className="mt-3 text-[10px] font-bold text-indigo-600 border border-indigo-200 dark:border-indigo-900 px-3 py-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all uppercase">Browse Files</button>
                    </>
                )
                }
                <input type="file" ref={fileRef} onChange={handleFile} className="hidden" accept="image/*" />
            </div>
        </div>
    );
};

export const TableEditor: React.FC<{ rows: string[][], onChange: (rows: string[][]) => void }> = ({ rows, onChange }) => {
    const updateCell = (r: number, c: number, v: string) => {
        const newRows = [...rows.map(row => [...row])];
        newRows[r][c] = v;
        onChange(newRows);
    };

    const addRow = () => onChange([...rows, Array(rows[0].length).fill('')]);
    const addCol = () => onChange(rows.map(row => [...row, '']));
    const removeRow = (r: number) => rows.length > 1 && onChange(rows.filter((_, i) => i !== r));
    const removeCol = (c: number) => rows[0].length > 1 && onChange(rows.map(row => row.filter((_, i) => i !== c)));

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data Table</label>
                <div className="flex gap-2">
                    <button onClick={addCol} className="text-[9px] font-bold text-indigo-600 uppercase border border-indigo-100 dark:border-indigo-900 px-2 py-0.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all">+ COL</button>
                    <button onClick={addRow} className="text-[9px] font-bold text-indigo-600 uppercase border border-indigo-100 dark:border-indigo-900 px-2 py-0.5 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all">+ ROW</button>
                </div>
            </div>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900/50">
                <table className="w-full border-collapse">
                    <tbody>
                        {rows.map((row, rIdx) => (
                            <tr key={rIdx} className="group/row flex">
                                {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="p-0 border-r border-b border-slate-100 dark:border-slate-800 last:border-r-0 flex-1 min-w-[100px] relative group/cell">
                                        <input
                                            value={cell}
                                            onChange={e => updateCell(rIdx, cIdx, e.target.value)}
                                            className={`w-full px-2 py-1.5 text-xs outline-none bg-transparent transition-colors ${rIdx === 0 ? 'font-bold bg-slate-50 dark:bg-slate-800/50' : 'text-slate-600 dark:text-slate-300'}`}
                                        />
                                        {rIdx === 0 && row.length > 1 && (
                                            <button onClick={() => removeCol(cIdx)} className="absolute -top-1 -right-1 p-0.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-full text-red-500 opacity-0 group-hover/cell:opacity-100 hover:scale-110 transition-all z-10 shadow-sm"><Trash2 className="w-2.5 h-2.5" /></button>
                                        )}
                                    </td>
                                ))}
                                {rows.length > 1 && (
                                    <td className="w-8 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
                                        <button onClick={() => removeRow(rIdx)} className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover/row:opacity-100 transition-all"><Trash2 className="w-3 h-3" /></button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
