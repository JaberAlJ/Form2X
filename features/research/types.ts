
export interface Author {
    id: string;
    name: string;
    dept: string;
    org: string;
    location: string;
    email: string;
}

export interface Figure {
    id: string;
    imageData: string;
    caption: string;
}

export interface Table {
    id: string;
    rows: string[][];
    caption: string;
}

export interface Equation {
    id: string;
    latex: string;
}

export type ReferenceType = 'publication' | 'book' | 'website' | 'other';

export interface Reference {
    id: string;
    type: ReferenceType;
    text: string;
    title?: string;
    authors?: string;
    journal?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    year?: string;
    publisher?: string;
    url?: string;
    doi?: string;
    accessDate?: string;
}

export interface ResearchSection {
    id: string;
    title: string;
    content: string;
    level: 1 | 2 | 3;
    figures?: Figure[];
    tables?: Table[];
    bulletPoints?: string[];
    equations?: Equation[];
}

export interface StyleConfig {
    fontFamily: 'Times New Roman' | 'Arial' | 'Helvetica';
    baseFontSize: number;
    lineSpacing: number;
    marginSize: number; // In inches
    columnLayout: '1-column' | '2-column';
}

export interface PaperData {
    title: string;
    authors: Author[];
    abstract: string;
    keywords: string;
    sections: ResearchSection[];
    acknowledgment: string;
    references: Reference[];
    style: StyleConfig;
}

export type SectionField = keyof PaperData;
