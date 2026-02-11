
import ResumeBuilder from '@/features/resume/ResumeBuilder';

export const metadata = {
    title: 'Form2Resume - ATS Optimized Resume Generator',
    description: 'Generate a high-fidelity, structured, ATS-optimized resume from a simple form.',
};

export default function ResumePage() {
    return <ResumeBuilder />;
}
