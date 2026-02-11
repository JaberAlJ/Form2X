
import ResearchPaperBuilder from '@/features/research/ResearchPaperBuilder';

export const metadata = {
    title: 'Form2Research - IEEE Format Research Paper Generator',
    description: 'Generate high-quality IEEE format research papers from a simple form with LaTeX support.',
};

export default function ResearchPage() {
    return <ResearchPaperBuilder />;
}
