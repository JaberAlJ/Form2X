import { ResumeData } from './types';

export const INITIAL_RESUME_DATA: ResumeData = {
    header: {
        fullName: "Alex Engineering",
        location: "San Francisco, CA 94105",
        phone: "555-0123",
        email: "alex.eng@example.com",
        links: [
            { id: '1', label: 'LinkedIn', url: 'linkedin.com/in/alex-eng' },
            { id: '2', label: 'GitHub', url: 'github.com/alex-eng' }
        ]
    },
    education: [
        {
            id: '1',
            university: "Stanford University",
            college: "School of Engineering",
            degree: "Bachelor of Science",
            major: "Mechanical Engineering",
            minor: "Computer Science",
            graduationDate: "2024-06-15",
            gpa: "3.85 / 4.0",
            coursework: "Robotics, Control Systems, Thermal Dynamics, Data Structures"
        }
    ],
    experience: [
        {
            id: '1',
            jobTitle: "Robotics Intern",
            organization: "Tech Innovators Inc.",
            location: "San Jose, CA",
            startDate: "2023-05-01",
            endDate: "2023-08-31",
            bullets: [
                "Collaborated with senior engineers to design and prototype autonomous navigation modules for warehouse robots.",
                "Improved sensor fusion algorithms using Python and C++, resulting in a 15% reduction in obstacle collision rates.",
                "Documented technical specifications and presented findings to executive leadership."
            ]
        }
    ],
    projects: [
        {
            id: '1',
            title: "Self-Balancing Inverted Pendulum",
            organization: "University Capstone",
            startDate: "2023-09-01",
            endDate: "2024-05-15",
            bullets: [
                "Engineered a PID control system for a 2-degree-of-freedom inverted pendulum.",
                "Integrated IMU and rotary encoders with an Arduino-based controller.",
                "Developed a custom GUI for real-time monitoring of system stability parameters."
            ]
        }
    ],
    certifications: [
        {
            id: 'c1',
            name: "Certified SolidWorks Professional (CSWP)",
            organization: "Dassault Systèmes",
            date: "2024-01-15"
        },
        {
            id: 'c2',
            name: "Engineer In Training (EIT)",
            organization: "NCEES",
            date: "2024-03-01"
        }
    ],
    leadership: [
        {
            id: 'l1',
            role: "President",
            organization: "American Society of Mechanical Engineers (ASME)",
            location: "Stanford, CA",
            startDate: "2023-09-01",
            endDate: "Present",
            bullets: [
                "Lead a student chapter of 150+ members, coordinating weekly technical workshops and professional networking events.",
                "Manage a $5,000 annual budget for student projects and national design competitions."
            ]
        }
    ],
    honors: [
        {
            id: 'h1',
            name: "Tau Beta Pi Engineering Honor Society",
            organization: "National Chapter",
            year: "2023",
            description: "Elected based on distinguished scholarship and exemplary character."
        },
        {
            id: 'h2',
            name: "Dean's Award for Academic Excellence",
            organization: "Stanford School of Engineering",
            year: "2022",
            description: "Awarded for maintaining a GPA in the top 5% of the engineering class."
        }
    ],
    publications: [
        {
            id: 'p1',
            title: "Optimizing PID Parameters for Small-Scale Inverted Pendulums",
            authors: "Alex Engineering, J. Doe",
            journal: "Journal of Undergraduate Research",
            year: "2024",
            doi: "10.1234/jur.2024.5678"
        }
    ],
    volunteer: [
        {
            id: 'v1',
            role: "STEM Mentor",
            organization: "FIRST Robotics",
            location: "Palo Alto, CA",
            startDate: "2022-10-01",
            endDate: "2023-05-31",
            bullets: [
                "Mentored high school students in CAD design and mechanical assembly for regional competitions.",
                "Facilitated weekly learning sessions on fundamental mechanical principles and team collaboration."
            ]
        }
    ],
    skills: [
        { id: '1', label: "Design", skills: "SolidWorks, AutoCAD, Fusion 360, UI/UX Prototyping" },
        { id: '2', label: "Analysis & Control", skills: "MATLAB, Simulink, Python (NumPy/Pandas), PID Tuning" },
        { id: '3', label: "Programming", skills: "C++, Python, Arduino, JavaScript/TypeScript" }
    ],
    enabledSections: {
        education: true,
        experience: true,
        projects: true,
        certifications: true,
        leadership: true,
        honors: true,
        publications: true,
        volunteer: true,
        skills: true
    },
    sectionOrder: [
        'education',
        'experience',
        'projects',
        'certifications',
        'leadership',
        'honors',
        'publications',
        'volunteer'
    ],
    style: {
        fontFamily: 'Times New Roman',
        baseFontSize: 11,
        lineSpacing: 1.2,
        marginSize: 0.75,
        headerStyle: 'BoldAllCaps',
        bulletStyle: '•',
        textColor: 'Black'
    }
};
