
export interface ContactLink {
    id: string;
    label: string;
    url: string;
}

export interface HeaderData {
    fullName: string;
    location: string;
    phone: string;
    email: string;
    links: ContactLink[];
}

export interface EducationEntry {
    id: string;
    university: string;
    college: string;
    degree: string;
    major: string;
    minor?: string;
    graduationDate: string;
    gpa: string;
    coursework: string;
}

export interface ExperienceEntry {
    id: string;
    jobTitle: string;
    organization: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
}

export interface ProjectEntry {
    id: string;
    title: string;
    organization: string;
    startDate: string;
    endDate: string;
    bullets: string[];
}

export interface CertificationEntry {
    id: string;
    name: string;
    organization: string;
    date: string;
    expirationDate?: string;
}

export interface LeadershipEntry {
    id: string;
    role: string;
    organization: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
}

export interface HonorEntry {
    id: string;
    name: string;
    organization: string;
    year: string;
    description?: string;
}

export interface PublicationEntry {
    id: string;
    title: string;
    authors: string;
    journal: string;
    year: string;
    doi?: string;
}

export interface VolunteerEntry {
    id: string;
    role: string;
    organization: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
}

export interface SkillCategory {
    id: string;
    label: string;
    skills: string;
}

export type SectionType =
    | 'education'
    | 'experience'
    | 'projects'
    | 'certifications'
    | 'leadership'
    | 'honors'
    | 'publications'
    | 'volunteer'
    | 'skills';

export interface StyleConfig {
    fontFamily: 'Arial' | 'Times New Roman' | 'Calibri' | 'Helvetica';
    baseFontSize: number;
    lineSpacing: number;
    marginSize: number;
    headerStyle: 'Bold' | 'BoldAllCaps';
    bulletStyle: '•' | '-';
    textColor: 'Black' | 'DarkGray';
}

export interface ResumeData {
    header: HeaderData;
    education: EducationEntry[];
    experience: ExperienceEntry[];
    projects: ProjectEntry[];
    certifications: CertificationEntry[];
    leadership: LeadershipEntry[];
    honors: HonorEntry[];
    publications: PublicationEntry[];
    volunteer: VolunteerEntry[];
    skills: SkillCategory[];
    enabledSections: Record<SectionType, boolean>;
    sectionOrder: SectionType[];
    style: StyleConfig;
}
