import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';

export interface Experience {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
}

export interface Education {
    id: string;
    degree: string;
    institution: string;
    year: string;
}

export interface Skill {
    id: string;
    name: string;
    level: number; // 0-100
}

export interface ResumeData {
    personalInfo: {
        fullName: string;
        title: string;
        phone: string;
        email: string;
        website: string;
        address: string;
        photoUrl: string | null;
    };
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    interests: string[];
    portfolio: {
        title: string;
        description: string;
    };
    sectionOrder: string[]; // Order of main content sections
    activeItemId: string | null;
    layout: {
        sectionGap: number; // in pixels
        skillsMode: 'list' | 'grid';
    };
}

interface ResumeState extends ResumeData {
    updatePersonalInfo: (field: keyof ResumeData['personalInfo'], value: string) => void;
    updateSummary: (value: string) => void;
    updatePortfolio: (field: keyof ResumeData['portfolio'], value: string) => void;

    addExperience: () => void;
    removeExperience: (id: string) => void;
    updateExperience: (id: string, field: keyof Experience, value: string) => void;

    addEducation: () => void;
    removeEducation: (id: string) => void;
    updateEducation: (id: string, field: keyof Education, value: string) => void;

    addSkill: () => void;
    removeSkill: (id: string) => void;
    updateSkill: (id: string, field: keyof Skill, value: string | number) => void;

    updateInterests: (value: string) => void;

    resetResume: () => void;
    reorderExperience: (startIndex: number, endIndex: number) => void;
    reorderEducation: (startIndex: number, endIndex: number) => void;
    reorderSkills: (startIndex: number, endIndex: number) => void;
    reorderSections: (newOrder: string[]) => void;

    setActiveItem: (id: string | null) => void;
    duplicateItem: (type: 'experience' | 'education', id: string) => void;
    updateLayout: (field: keyof ResumeData['layout'], value: number | string) => void;

    undo: () => void;
    redo: () => void;
}

const initialData: ResumeData = {
    personalInfo: {
        fullName: "JONATHAN DOE",
        title: "Web Designer",
        phone: "+1 222 333 4444",
        email: "your.email@example.com",
        website: "www.yourwebsite.com",
        address: "123 Street Name, City, Country",
        photoUrl: null,
    },
    summary: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
    experience: [
        {
            id: '1',
            role: 'WEBDESIGNER',
            company: 'Company Name',
            period: '2016 - PRES',
            description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.',
        },
        {
            id: '2',
            role: 'TRAINEE',
            company: 'Company Name',
            period: '2014 - 2016',
            description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.',
        }
    ],
    education: [
        {
            id: '1',
            degree: 'MASTER DEGREE',
            institution: 'University Name',
            year: '2012 - 2014',
        }
    ],
    skills: [
        { id: '1', name: 'Photoshop', level: 90 },
        { id: '2', name: 'Illustrator', level: 80 },
        { id: '3', name: 'Indesign', level: 70 },
    ],
    interests: ["Music", "Reading", "Traveling"],
    portfolio: {
        title: "PORTFOLIO",
        description: "Check out my latest work at www.myportfolio.com",
    },
    sectionOrder: ["summary", "experience", "education", "portfolio"],
    activeItemId: null,
    layout: {
        sectionGap: 48,
        skillsMode: 'list',
    },
};

export const useResumeStore = create<ResumeState>()(
    temporal(
        persist(
            (set) => ({
                ...initialData,

                updatePersonalInfo: (field, value) =>
                    set((state) => ({
                        personalInfo: { ...state.personalInfo, [field]: value },
                    })),

                updateSummary: (value) => set({ summary: value }),

                updatePortfolio: (field, value) =>
                    set((state) => ({
                        portfolio: { ...state.portfolio, [field]: value }
                    })),

                addExperience: () =>
                    set((state) => ({
                        experience: [
                            {
                                id: crypto.randomUUID(),
                                role: 'NEW ROLE',
                                company: 'Company Name',
                                period: 'YEAR - YEAR',
                                description: 'Job description goes here...',
                            },
                            ...state.experience,
                        ],
                    })),

                removeExperience: (id) =>
                    set((state) => ({
                        experience: state.experience.filter((exp) => exp.id !== id),
                    })),

                updateExperience: (id, field, value) =>
                    set((state) => ({
                        experience: state.experience.map((exp) =>
                            exp.id === id ? { ...exp, [field]: value } : exp
                        ),
                    })),

                addEducation: () =>
                    set((state) => ({
                        education: [
                            ...state.education,
                            {
                                id: crypto.randomUUID(),
                                degree: 'DEGREE NAME',
                                institution: 'Institution Name',
                                year: 'YEAR - YEAR',
                            },
                        ],
                    })),

                removeEducation: (id) =>
                    set((state) => ({
                        education: state.education.filter((edu) => edu.id !== id),
                    })),

                updateEducation: (id, field, value) =>
                    set((state) => ({
                        education: state.education.map((edu) =>
                            edu.id === id ? { ...edu, [field]: value } : edu
                        ),
                    })),

                addSkill: () =>
                    set((state) => ({
                        skills: [...state.skills, { id: crypto.randomUUID(), name: 'New Skill', level: 50 }],
                    })),

                removeSkill: (id) =>
                    set((state) => ({
                        skills: state.skills.filter((skill) => skill.id !== id),
                    })),

                updateSkill: (id, field, value) =>
                    set((state) => ({
                        skills: state.skills.map((skill) =>
                            skill.id === id ? { ...skill, [field]: value } : skill
                        ),
                    })),

                updateInterests: (value) =>
                    set({ interests: value.split(',').map((i) => i.trim()) }),

                resetResume: () => set({ ...initialData }),

                reorderExperience: (startIndex, endIndex) =>
                    set((state) => {
                        const result = Array.from(state.experience);
                        const [removed] = result.splice(startIndex, 1);
                        result.splice(endIndex, 0, removed);
                        return { experience: result };
                    }),

                reorderEducation: (startIndex, endIndex) =>
                    set((state) => {
                        const result = Array.from(state.education);
                        const [removed] = result.splice(startIndex, 1);
                        result.splice(endIndex, 0, removed);
                        return { education: result };
                    }),

                reorderSkills: (startIndex, endIndex) =>
                    set((state) => {
                        const result = Array.from(state.skills);
                        const [removed] = result.splice(startIndex, 1);
                        result.splice(endIndex, 0, removed);
                        return { skills: result };
                    }),

                reorderSections: (newOrder) => set({ sectionOrder: newOrder }),

                setActiveItem: (id) => set({ activeItemId: id }),

                duplicateItem: (type, id) => set((state) => {
                    if (type === 'experience') {
                        const index = state.experience.findIndex(e => e.id === id);
                        if (index === -1) return {};
                        const item = state.experience[index];
                        const newItem = { ...item, id: crypto.randomUUID() };
                        const newExperience = [...state.experience];
                        newExperience.splice(index + 1, 0, newItem);
                        return { experience: newExperience };
                    } else if (type === 'education') {
                        const index = state.education.findIndex(e => e.id === id);
                        if (index === -1) return {};
                        const item = state.education[index];
                        const newItem = { ...item, id: crypto.randomUUID() };
                        const newEducation = [...state.education];
                        newEducation.splice(index + 1, 0, newItem);
                        return { education: newEducation };
                    }
                    return {};
                }),

                updateLayout: (field, value) => set((state) => ({
                    // @ts-ignore - simple key assignment
                    layout: { ...state.layout, [field]: value }
                })),

                undo: () => { },
                redo: () => { },
            }),
            {
                name: 'resume-storage',
            }
        ),
        {
            limit: 100,
        }
    )
);
