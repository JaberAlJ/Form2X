
import React, { Fragment } from 'react';
import { ResumeData, SectionType } from '../types';

interface Props {
    data: ResumeData;
}

const ResumePreview: React.FC<Props> = ({ data }) => {
    const {
        header, education, experience, projects, skills, enabledSections, sectionOrder,
        certifications, leadership, honors, publications, volunteer, style
    } = data;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        if (dateStr.toLowerCase() === 'present') return 'Present';

        // Check if it's in YYYY-MM-DD format
        const parts = dateStr.split('-');
        if (parts.length >= 2) {
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const day = parts[2] ? parseInt(parts[2]) : 1;
            const date = new Date(year, month, day);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            }
        }
        return dateStr;
    };

    const renderSection = (type: SectionType) => {
        if (!enabledSections[type]) return null;

        const bulletChar = style.bulletStyle;
        const isAllCaps = style.headerStyle === 'BoldAllCaps';

        switch (type) {
            case 'education':
                return (
                    <section key="education" className="resume-section">
                        <h2 className={`section-title ${isAllCaps ? 'all-caps' : ''}`}>EDUCATION</h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="entry mb-3">
                                <div className="flex justify-between font-bold">
                                    <span>{edu.university}</span>
                                    <span>{formatDate(edu.graduationDate)}</span>
                                </div>
                                <div className="italic text-[0.95em]">{edu.college}</div>
                                <div className="text-[0.95em]">{edu.degree} in {edu.major}{edu.minor ? `, Minor in ${edu.minor}` : ''}</div>
                                <div className="text-[0.95em]">GPA: {edu.gpa}</div>
                                {edu.coursework && (
                                    <div className="mt-1 text-[0.9em]">
                                        <span className="font-bold">Relevant Coursework:</span> {edu.coursework}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                );
            case 'experience':
                return (
                    <section key="experience" className="resume-section">
                        <h2 className={`section-title ${isAllCaps ? 'all-caps' : ''}`}>EXPERIENCE</h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="entry mb-3">
                                <div className="flex justify-between font-bold">
                                    <span>{exp.jobTitle}</span>
                                    <span>{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                                </div>
                                <div className="flex justify-between italic text-[0.95em]">
                                    <span>{exp.organization}</span>
                                    <span>{exp.location}</span>
                                </div>
                                <ul className="list-none ml-4 mt-1">
                                    {exp.bullets.map((bullet, idx) => (
                                        bullet ? <li key={idx} className="leading-tight text-justify flex gap-2 text-[0.95em]">
                                            <span className="shrink-0">{bulletChar}</span>
                                            <span>{bullet}</span>
                                        </li> : null
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                );
            case 'projects':
                return (
                    <section key="projects" className="resume-section">
                        <h2 className={`section-title ${isAllCaps ? 'all-caps' : ''}`}>PROJECTS</h2>
                        {projects.map((proj) => (
                            <div key={proj.id} className="entry mb-3">
                                <div className="flex justify-between font-bold">
                                    <span>{proj.title}</span>
                                    <span>{formatDate(proj.startDate)} – {formatDate(proj.endDate)}</span>
                                </div>
                                <div className="italic text-[0.95em]">{proj.organization}</div>
                                <ul className="list-none ml-4 mt-1">
                                    {proj.bullets.map((bullet, idx) => (
                                        bullet ? <li key={idx} className="leading-tight text-justify flex gap-2 text-[0.95em]">
                                            <span className="shrink-0">{bulletChar}</span>
                                            <span>{bullet}</span>
                                        </li> : null
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                );
            case 'certifications':
                return (
                    <section key="certifications" className="resume-section">
                        <h2 className={`section-title ${isAllCaps ? 'all-caps' : ''}`}>CERTIFICATIONS</h2>
                        {certifications.map((cert) => (
                            <div key={cert.id} className="entry mb-2">
                                <div className="flex justify-between">
                                    <span className="font-bold">{cert.name}</span>
                                    <span>{formatDate(cert.date)}{cert.expirationDate ? ` – ${formatDate(cert.expirationDate)}` : ''}</span>
                                </div>
                                <div className="italic text-[0.95em]">{cert.organization}</div>
                            </div>
                        ))}
                    </section>
                );
            case 'leadership':
                return (
                    <section key="leadership" className="resume-section">
                        <h2 className={`section-title ${isAllCaps ? 'all-caps' : ''}`}>LEADERSHIP & ACTIVITIES</h2>
                        {leadership.map((lead) => (
                            <div key={lead.id} className="entry mb-3">
                                <div className="flex justify-between font-bold">
                                    <span>{lead.role}</span>
                                    <span>{formatDate(lead.startDate)} – {formatDate(lead.endDate)}</span>
                                </div>
                                <div className="flex justify-between italic text-[0.95em]">
                                    <span>{lead.organization}</span>
                                    <span>{lead.location}</span>
                                </div>
                                <ul className="list-none ml-4 mt-1">
                                    {lead.bullets.map((bullet, idx) => (
                                        bullet ? <li key={idx} className="leading-tight text-justify flex gap-2 text-[0.95em]">
                                            <span className="shrink-0">{bulletChar}</span>
                                            <span>{bullet}</span>
                                        </li> : null
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                );
            case 'honors':
                return (
                    <section key="honors" className="resume-section">
                        <h2 className={`section-title ${isAllCaps ? 'all-caps' : ''}`}>HONORS & AWARDS</h2>
                        {honors.map((honor) => (
                            <div key={honor.id} className="entry mb-2">
                                <div className="flex justify-between">
                                    <span className="font-bold">{honor.name} — {honor.organization}</span>
                                    <span>{honor.year}</span>
                                </div>
                                {honor.description && <div className="text-[0.9em]">{honor.description}</div>}
                            </div>
                        ))}
                    </section>
                );
            case 'publications':
                return (
                    <section key="publications" className="resume-section">
                        <h2 className={`section-title ${isAllCaps ? 'all-caps' : ''}`}>PUBLICATIONS</h2>
                        {publications.map((pub) => (
                            <div key={pub.id} className="entry mb-2 text-justify text-[0.95em]">
                                {pub.authors}. ({pub.year}). <span className="italic">{pub.title}</span>. {pub.journal}. {pub.doi && `DOI: ${pub.doi}`}
                            </div>
                        ))}
                    </section>
                );
            case 'volunteer':
                return (
                    <section key="volunteer" className="resume-section">
                        <h2 className={`section-title ${isAllCaps ? 'all-caps' : ''}`}>VOLUNTEER EXPERIENCE</h2>
                        {volunteer.map((vol) => (
                            <div key={vol.id} className="entry mb-3">
                                <div className="flex justify-between font-bold">
                                    <span>{vol.role}</span>
                                    <span>{formatDate(vol.startDate)} – {formatDate(vol.endDate)}</span>
                                </div>
                                <div className="flex justify-between italic text-[0.95em]">
                                    <span>{vol.organization}</span>
                                    <span>{vol.location}</span>
                                </div>
                                <ul className="list-none ml-4 mt-1">
                                    {vol.bullets.map((bullet, idx) => (
                                        bullet ? <li key={idx} className="leading-tight text-justify flex gap-2 text-[0.95em]">
                                            <span className="shrink-0">{bulletChar}</span>
                                            <span>{bullet}</span>
                                        </li> : null
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                );
            case 'skills':
                return (
                    <section key="skills" className="resume-section">
                        <h2 className={`section-title ${isAllCaps ? 'all-caps' : ''}`}>SKILLS</h2>
                        {skills.map((cat, idx) => (
                            <div key={cat.id} className={`${idx < skills.length - 1 ? "mb-1" : ""} text-[0.95em]`}>
                                <span className="font-bold">{cat.label}:</span> {cat.skills}
                            </div>
                        ))}
                    </section>
                );
            default:
                return null;
        }
    };

    const formatUrl = (url: string) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `https://${url}`;
    };

    const contactItems = [
        header.location && { text: header.location },
        header.phone && { text: header.phone, href: `tel:${header.phone}` },
        header.email && { text: header.email, href: `mailto:${header.email}` },
        ...header.links.filter(l => l.url).map(l => ({ text: l.url, href: formatUrl(l.url) }))
    ].filter(Boolean) as { text: string; href?: string }[];

    const textColorValue = style.textColor === 'Black' ? '#000000' : '#333333';

    return (
        <div id="resume-container" className="resume-wrapper">
            <style>{`
        .resume-wrapper {
          width: 816px; /* 8.5in at 96dpi */
          min-height: 1056px; /* 11in at 96dpi */
          padding: ${style.marginSize}in;
          font-family: '${style.fontFamily}', serif;
          font-size: ${style.baseFontSize}pt;
          color: ${textColorValue};
          line-height: ${style.lineSpacing};
          box-sizing: border-box;
          background: white;
        }
        .header-name {
          font-size: ${style.baseFontSize + 7}pt;
          font-weight: bold;
          text-align: center;
          margin-bottom: 2pt;
          text-transform: uppercase;
        }
        .header-contact {
          text-align: center;
          font-size: ${style.baseFontSize - 1}pt;
          margin-bottom: 8pt;
        }
        .header-contact a {
          color: inherit;
          text-decoration: none;
        }
        .header-contact a:hover {
          text-decoration: underline;
        }
        .section-title {
          font-size: ${style.baseFontSize + 1}pt;
          font-weight: bold;
          border-bottom: 1px solid ${textColorValue};
          margin-bottom: 4pt;
          margin-top: 10pt;
        }
        .all-caps { text-transform: uppercase; }
        .entry { margin-bottom: 6pt; }
        .entry-header { display: flex; justify-content: space-between; font-weight: bold; }
        .entry-subsite { display: flex; justify-content: space-between; font-style: italic; font-size: 0.95em; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .font-bold { font-weight: bold; }
        .italic { font-style: italic; }
        .text-justify { text-align: justify; }
        .list-none { list-style: none; padding: 0; }
        .shrink-0 { flex-shrink: 0; }
        .gap-2 { gap: 0.5rem; }

        @media print {
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          .resume-wrapper { 
            width: 100% !important; 
            min-height: auto !important; 
            box-shadow: none !important; 
            margin: 0 !important; 
            padding: 0 ${style.marginSize}in !important; 
          }
          @page { margin: 0; size: A4; }
        }
      `}</style>

            <header className="resume-header">
                <h1 className="header-name">{header.fullName}</h1>
                <div className="header-contact">
                    {contactItems.map((item, idx) => (
                        <Fragment key={idx}>
                            {item.href ? (
                                <a href={item.href} target="_blank" rel="noopener noreferrer">
                                    {item.text}
                                </a>
                            ) : (
                                <span>{item.text}</span>
                            )}
                            {idx < contactItems.length - 1 && ' | '}
                        </Fragment>
                    ))}
                </div>
            </header>

            {sectionOrder.map(renderSection)}
            {renderSection('skills')}
        </div>
    );
};

export default ResumePreview;
