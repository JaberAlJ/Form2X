
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { PaperData, ResearchSection, Reference } from '../types';
import katex from 'katex';

interface Props {
    data: PaperData;
}

/**
 * Replaces citation tags like [cite:r1] with formatted numbers like [1],
 * and internal references like [fig:id] or [tab:id] with [Fig. X] or [Table X].
 */
const resolveCitations = (text: string, references: Reference[], sections: ResearchSection[]) => {
    if (!text) return text;

    // Handle references [cite:r1]
    let processedText = text.replace(/\[cite:([^\]]+)\]/g, (match, refId) => {
        const index = references.findIndex(r => r.id === refId);
        return index !== -1 ? `[${index + 1}]` : match;
    });

    // Handle figures [fig:id]
    processedText = processedText.replace(/\[fig:([^\]]+)\]/g, (match, figId) => {
        let count = 0;
        for (const section of sections) {
            if (section.figures) {
                for (const fig of section.figures) {
                    count++;
                    if (fig.id === figId) return `Fig. ${count}`;
                }
            }
        }
        return match;
    });

    // Handle tables [tab:id]
    processedText = processedText.replace(/\[tab:([^\]]+)\]/g, (match, tabId) => {
        let count = 0;
        for (const section of sections) {
            if (section.tables) {
                for (const tab of section.tables) {
                    count++;
                    if (tab.id === tabId) return `Table ${count}`;
                }
            }
        }
        return match;
    });

    return processedText;
};

/**
 * Component to render text containing LaTeX (surrounded by $) and IEEE Citations.
 * Uses KaTeX for mathematical notation.
 */
const LatexText: React.FC<{ text: string, references?: Reference[], sections?: ResearchSection[] }> = ({ text, references = [], sections = [] }) => {
    const processedText = useMemo(() => resolveCitations(text, references, sections), [text, references, sections]);

    const parts = useMemo(() => {
        if (!processedText) return [];
        const regex = /\$([^$]+)\$/g;
        const result = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(processedText)) !== null) {
            if (match.index > lastIndex) {
                result.push({ type: 'text', content: processedText.substring(lastIndex, match.index) });
            }
            result.push({ type: 'latex', content: match[1] });
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < processedText.length) {
            result.push({ type: 'text', content: processedText.substring(lastIndex) });
        }
        return result;
    }, [processedText]);

    return (
        <>
            {parts.map((part, idx) => {
                if (part.type === 'latex') {
                    try {
                        const html = katex.renderToString(part.content, { throwOnError: false });
                        return <span key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
                    } catch (e) {
                        return <span key={idx} className="text-red-500">${part.content}$</span>;
                    }
                }
                return <span key={idx}>{part.content}</span>;
            })}
        </>
    );
};

const ResearchPaperPreview: React.FC<Props> = ({ data }) => {
    const { title, authors, abstract, keywords, sections, acknowledgment, references, style } = data;
    const containerRef = useRef<HTMLDivElement>(null);
    const [pageCount, setPageCount] = useState(1);

    const A4_HEIGHT_PX = 1122.5; // Approx 297mm at 96dpi

    /**
     * Page Height Management
     * Calculates the total number of pages based on the scroll height.
     * This is used to render the red 'Page Cut Line' guides for users.
     */
    useEffect(() => {
        const updatePageCount = () => {
            if (containerRef.current) {
                const height = containerRef.current.scrollHeight;
                setPageCount(Math.ceil(height / A4_HEIGHT_PX));
            }
        };

        updatePageCount();
        const observer = new ResizeObserver(updatePageCount);
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [data, style.columnLayout]);

    const romanize = (num: number) => {
        const lookup: any = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
        let roman = '';
        for (const i in lookup) {
            while (num >= lookup[i]) {
                roman += i;
                num -= lookup[i];
            }
        }
        return roman;
    };

    /**
     * IEEE Heading Prefix Logic
     * Level 1: Roman Numerals (I., II., III.)
     * Level 2: Alphabetic (A., B., C.)
     * Level 3: Numeric with parenthesis (1), 2), 3))
     */
    const getHeadingPrefix = (section: ResearchSection, allSections: ResearchSection[]) => {
        const idx = allSections.indexOf(section);
        if (section.level === 1) {
            const count = allSections.filter((s, i) => s.level === 1 && i <= idx).length;
            return `${romanize(count)}. `;
        }
        if (section.level === 2) {
            let parentIdx = -1;
            for (let i = idx - 1; i >= 0; i--) { if (allSections[i].level === 1) { parentIdx = i; break; } }
            const count = allSections.filter((s, i) => s.level === 2 && i > parentIdx && i <= idx).length;
            return `${String.fromCharCode(64 + count)}. `;
        }
        if (section.level === 3) {
            let parentIdx = -1;
            for (let i = idx - 1; i >= 0; i--) { if (allSections[i].level === 2) { parentIdx = i; break; } }
            const count = allSections.filter((s, i) => s.level === 3 && i > parentIdx && i <= idx).length;
            return `${count}) `;
        }
        return '';
    };

    const authorCount = authors.length;
    const authorCols = authorCount === 1 ? 1 : (authorCount === 2 || authorCount === 4 ? 2 : 3);

    let figureCounter = 0;
    let tableCounter = 0;
    let equationCounter = 0;

    return (
        <div id="paper-container" ref={containerRef} className="paper-wrapper relative">
            <style>{`
        .paper-wrapper {
          width: 210mm;
          min-height: 297mm;
          padding: ${style.marginSize}in;
          font-family: '${style.fontFamily}', serif;
          font-size: ${style.baseFontSize}pt;
          line-height: ${style.lineSpacing};
          background: white;
          color: black !important;
          box-sizing: border-box;
          margin: 0 auto;
          position: relative;
          orphans: 3;
          widows: 3;
        }

        .page-guide {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          border-top: 1px dashed rgba(239, 68, 68, 0.4);
          pointer-events: none;
          z-index: 100;
        }
        .page-guide-label {
          position: absolute;
          right: 4px;
          top: -14px;
          font-size: 8px;
          font-family: sans-serif;
          color: rgba(239, 68, 68, 0.6);
          text-transform: uppercase;
          font-weight: bold;
        }

        .paper-title { font-size: 24pt; text-align: center; margin-bottom: 24pt; font-weight: normal; color: black; break-after: avoid; }
        .author-grid { display: grid; grid-template-columns: repeat(${authorCols}, 1fr); gap: 16pt 24pt; margin-bottom: 24pt; text-align: center; width: 100%; color: black; break-after: avoid; }
        .author-block { font-size: 11pt; display: flex; flex-direction: column; align-items: center; }
        .author-name { font-size: 12pt; margin-bottom: 2pt; }
        .author-detail { font-size: 10pt; line-height: 1.2; }
        
        .paper-content { 
          column-count: ${style.columnLayout === '2-column' ? 2 : 1}; 
          column-gap: 0.25in; 
          text-align: justify; 
          color: black; 
          column-fill: balance;
          display: block;
        }

        /* 
          Strict Heading & Group Logic
          Prevents headings from being isolated at the bottom of a page/column
          by ensuring they stay with the following content block.
        */
        .strict-group {
          break-inside: avoid;
          display: block;
          width: 100%;
          margin-bottom: 8pt;
        }

        .abstract-section { font-weight: bold; font-style: italic; margin-bottom: 8pt; break-inside: avoid; }
        .abstract-label { font-weight: bold; font-style: normal; margin-right: 4pt; }
        .keywords-section { font-weight: bold; font-style: italic; margin-bottom: 12pt; break-inside: avoid; }
        .keywords-label { font-weight: bold; font-style: normal; margin-right: 4pt; }
        
        .section-h1 { font-size: 10pt; text-align: center; text-transform: uppercase; margin: 12pt 0 6pt 0; font-weight: normal; color: black; break-after: avoid; }
        .section-h2 { font-size: 10pt; font-style: italic; margin: 10pt 0 4pt 0; font-weight: normal; color: black; break-after: avoid; }
        .section-h3 { font-size: 10pt; font-style: italic; margin: 8pt 0 4pt 0; display: inline; margin-right: 4pt; color: black; }
        
        .section-content { margin-bottom: 8pt; text-indent: 1.5em; color: black; }
        .section-content.inline { display: inline; text-indent: 0; }
        
        .bullet-list {
          margin: 8pt 0 12pt 1.5em;
          padding: 0;
          list-style-type: disc;
          text-align: justify;
          break-inside: auto;
        }
        .bullet-item {
          margin-bottom: 4pt;
          padding-left: 0.25em;
          break-inside: avoid;
        }

        .equation-block {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 12pt 0;
          position: relative;
          width: 100%;
          break-inside: avoid;
        }
        .equation-render {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        .equation-number {
          margin-left: 10pt;
          font-size: 10pt;
        }
        
        .figure-container { margin: 16pt 0; text-align: center; break-inside: avoid; }
        .figure-img { max-width: 100%; height: auto; display: block; margin: 0 auto 6pt auto; }
        .figure-caption { font-size: 8pt; line-height: 1.2; text-align: center; color: black; }
        
        .table-container { margin: 16pt 0; text-align: center; break-inside: avoid; }
        .table-caption { font-size: 8pt; text-transform: uppercase; margin-bottom: 8pt; text-align: center; line-height: 1.4; color: black; letter-spacing: 0.05em; }
        
        .ieee-table { border-collapse: collapse; margin: 0 auto; font-size: 8pt; min-width: 85%; border: 0.75pt solid black; color: black; }
        .ieee-table tr:first-child { border-bottom: 0.75pt solid black; font-weight: bold; }
        .ieee-table td { border: 0.5pt solid black; padding: 4pt 8pt; text-align: center; }

        .references-title { font-size: 10pt; text-align: center; text-transform: uppercase; margin-top: 16pt; margin-bottom: 8pt; color: black; break-after: avoid; }
        .reference-item { font-size: 8pt; margin-bottom: 4pt; padding-left: 20pt; text-indent: -20pt; color: black; break-inside: avoid; }
        
        @media print {
          @page { size: A4; margin: 0; }
          .paper-wrapper { padding: 0 ${style.marginSize}in !important; box-shadow: none !important; margin: 0 !important; width: 210mm !important; background: white !important; }
          .page-guide { display: none !important; }
        }
      `}</style>

            {Array.from({ length: pageCount - 1 }).map((_, i) => (
                <div key={i} className="page-guide no-print" style={{ top: `${(i + 1) * A4_HEIGHT_PX}px` }}>
                    <span className="page-guide-label">Page {i + 1} Cut Line</span>
                </div>
            ))}

            <div className="paper-header">
                <h1 className="paper-title"><LatexText text={title} references={references} sections={sections} /></h1>
                <div className="author-grid">
                    {authors.map((author) => (
                        <div key={author.id} className="author-block">
                            <div className="author-name">{author.name}</div>
                            <div className="author-detail">{author.dept}</div>
                            <div className="author-detail">{author.org}</div>
                            <div className="author-detail">{author.location}</div>
                            <div className="author-detail">{author.email}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="paper-content">
                <div className="abstract-section">
                    <span className="abstract-label">Abstract—</span><LatexText text={abstract} references={references} sections={sections} />
                </div>
                <div className="keywords-section">
                    <span className="keywords-label">Keywords—</span><LatexText text={keywords} references={references} sections={sections} />
                </div>

                {sections.map((section) => (
                    <div key={section.id}>
                        <div className="strict-group">
                            {section.level === 1 && <h2 className="section-h1">{getHeadingPrefix(section, sections)}{section.title}</h2>}
                            {section.level === 2 && <h3 className="section-h2">{getHeadingPrefix(section, sections)}{section.title}</h3>}
                            {section.level === 3 && <h4 className="section-h3">{getHeadingPrefix(section, sections)}{section.title}</h4>}
                            <div className={`section-content ${section.level === 3 ? 'inline' : ''}`}>
                                <LatexText text={section.content} references={references} sections={sections} />
                            </div>
                        </div>

                        {section.bulletPoints && section.bulletPoints.length > 0 && (
                            <ul className="bullet-list">
                                {section.bulletPoints.map((bullet, bIdx) => (
                                    bullet && <li key={bIdx} className="bullet-item"><LatexText text={bullet} references={references} sections={sections} /></li>
                                ))}
                            </ul>
                        )}

                        {section.equations?.map(eq => {
                            equationCounter++;
                            let renderedEq = '';
                            try {
                                renderedEq = katex.renderToString(eq.latex, { displayMode: true, throwOnError: false });
                            } catch (e) {
                                renderedEq = `<span class="text-red-500">${eq.latex}</span>`;
                            }
                            return (
                                <div key={eq.id} className="equation-block">
                                    <div className="equation-render" dangerouslySetInnerHTML={{ __html: renderedEq }} />
                                    <div className="equation-number">({equationCounter})</div>
                                </div>
                            );
                        })}

                        {section.figures?.map(fig => {
                            figureCounter++;
                            return (
                                <div key={fig.id} className="figure-container">
                                    {fig.imageData && <img src={fig.imageData} alt={`Fig. ${figureCounter}`} className="figure-img" />}
                                    <div className="figure-caption">Fig. {figureCounter}. <LatexText text={fig.caption} references={references} sections={sections} /></div>
                                </div>
                            );
                        })}

                        {section.tables?.map(tab => {
                            tableCounter++;
                            return (
                                <div key={tab.id} className="table-container">
                                    <div className="table-caption">
                                        TABLE {romanize(tableCounter)}. <LatexText text={tab.caption} references={references} sections={sections} />
                                    </div>
                                    <table className="ieee-table">
                                        <tbody>
                                            {tab.rows.map((row, rIdx) => (
                                                <tr key={rIdx}>{row.map((cell, cIdx) => <td key={cIdx}><LatexText text={cell} references={references} sections={sections} /></td>)}</tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}
                    </div>
                ))}

                {acknowledgment && (
                    <div className="strict-group acknowledgment-section">
                        <h2 className="section-h1">Acknowledgment</h2>
                        <div className="section-content"><LatexText text={acknowledgment} references={references} sections={sections} /></div>
                    </div>
                )}

                {references.length > 0 && (
                    <div className="references-section">
                        <div className="strict-group">
                            <h2 className="references-title">References</h2>
                        </div>
                        {references.map((ref, idx) => (
                            <div key={ref.id} className="reference-item">[{idx + 1}] <LatexText text={ref.text} references={references} sections={sections} /></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResearchPaperPreview;
