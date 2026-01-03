'use client';

import { useResumeStore, Experience, Education } from '../store/useResumeStore';
import { EditableField } from './EditableField';
import { Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Reorder } from 'framer-motion';
import { ScaleButton } from './ScaleButton';
import { SectionDragWrapper } from './SectionDragWrapper';
import { ActionPill } from './ActionPill';

export function MainContent() {
    const {
        personalInfo,
        summary,
        experience,
        education,
        portfolio,
        sectionOrder,
        activeItemId,
        reorderSections,
        updatePersonalInfo,
        updateSummary,
        addExperience,
        removeExperience,
        updateExperience,
        reorderExperience,
        addEducation,
        removeEducation,
        updateEducation,
        reorderEducation,
        updatePortfolio,
        setActiveItem,
        duplicateItem,
        layout // Destructure layout settings
    } = useResumeStore();

    // Internal List Reordering (DnD Kit / Hello Pangea)
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        if (result.type === 'EXPERIENCE') {
            reorderExperience(result.source.index, result.destination.index);
        } else if (result.type === 'EDUCATION') {
            reorderEducation(result.source.index, result.destination.index);
        }
    };

    // Helper for Move Up/Down via Pill
    const handleMove = (type: 'EXPERIENCE' | 'EDUCATION', index: number, direction: 'UP' | 'DOWN') => {
        const newIndex = direction === 'UP' ? index - 1 : index + 1;
        if (type === 'EXPERIENCE') {
            if (newIndex >= 0 && newIndex < experience.length) {
                reorderExperience(index, newIndex);
            }
        } else {
            if (newIndex >= 0 && newIndex < education.length) {
                reorderEducation(index, newIndex);
            }
        }
    };

    const renderSection = (id: string) => {
        switch (id) {
            case 'summary':
                return (
                    <SectionDragWrapper key="summary" id="summary">
                        <section className="mb-0 relative" onClick={() => setActiveItem('summary')}>
                            <h3 className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-4 border-b-2 border-blue-500/20 pb-2 inline-block">
                                Profile
                            </h3>
                            <div className="relative group">
                                <EditableField
                                    value={summary}
                                    onSave={updateSummary}
                                    multiline
                                    warningThreshold={350}
                                    className="text-sm md:text-base leading-relaxed text-gray-600"
                                />
                            </div>
                        </section>
                    </SectionDragWrapper>
                );
            case 'experience':
                return (
                    <SectionDragWrapper key="experience" id="experience">
                        <section onClick={() => setActiveItem(null)}>
                            <h3 className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-6 border-b-2 border-blue-500/20 pb-2 inline-block">
                                Work Experience
                            </h3>

                            <Droppable droppableId="experience" type="EXPERIENCE">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-8">
                                        {experience.map((exp, index) => {
                                            const isActive = activeItemId === exp.id;
                                            return (
                                                <Draggable key={exp.id} draggableId={exp.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveItem(exp.id);
                                                            }}
                                                            className={clsx(
                                                                "relative group pl-4 border-l-2 transition-all duration-200",
                                                                isActive ? "border-blue-500 bg-blue-50/50 rounded-r-lg" : "border-gray-100 hover:border-blue-200",
                                                                snapshot.isDragging && "opacity-50"
                                                            )}
                                                        >
                                                            {/* Action Pill */}
                                                            <ActionPill
                                                                isVisible={isActive}
                                                                onDuplicate={() => duplicateItem('experience', exp.id)}
                                                                onDelete={() => removeExperience(exp.id)}
                                                                onMoveUp={() => handleMove('EXPERIENCE', index, 'UP')}
                                                                onMoveDown={() => handleMove('EXPERIENCE', index, 'DOWN')}
                                                            />

                                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                                                                <div className="font-bold text-lg text-gray-800 uppercase">
                                                                    <EditableField value={exp.role} onSave={(val) => updateExperience(exp.id, 'role', val)} />
                                                                </div>
                                                                <div className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-1 rounded">
                                                                    <EditableField value={exp.period} onSave={(val) => updateExperience(exp.id, 'period', val)} />
                                                                </div>
                                                            </div>
                                                            <div className="font-medium text-sm text-gray-500 mb-2 uppercase tracking-wide">
                                                                <EditableField value={exp.company} onSave={(val) => updateExperience(exp.id, 'company', val)} />
                                                            </div>
                                                            <div className="text-sm text-gray-600 leading-relaxed">
                                                                <EditableField value={exp.description} onSave={(val) => updateExperience(exp.id, 'description', val)} multiline />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                            <div className="mt-2 group/add opacity-0 group-hover:opacity-100 transition-opacity export-exclude">
                                <button
                                    onClick={(e) => { e.stopPropagation(); addExperience(); }}
                                    className="group relative inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-300"
                                >
                                    <Plus size={14} />
                                    <span>Add Position</span>
                                </button>
                            </div>
                        </section>
                    </SectionDragWrapper>
                );
            case 'education':
                return (
                    <SectionDragWrapper key="education" id="education">
                        <section onClick={() => setActiveItem(null)}>
                            <h3 className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-6 border-b-2 border-blue-500/20 pb-2 inline-block">
                                Education
                            </h3>

                            <Droppable droppableId="education" type="EDUCATION">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                                        {education.map((edu, index) => {
                                            const isActive = activeItemId === edu.id;
                                            return (
                                                <Draggable key={edu.id} draggableId={edu.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveItem(edu.id);
                                                            }}
                                                            className={clsx(
                                                                "relative group pl-4 border-l-2 transition-all duration-200",
                                                                isActive ? "border-blue-500 bg-blue-50/50 rounded-r-lg" : "border-gray-100 hover:border-blue-200",
                                                                snapshot.isDragging && "opacity-50"
                                                            )}
                                                        >
                                                            <ActionPill
                                                                isVisible={isActive}
                                                                onDuplicate={() => duplicateItem('education', edu.id)}
                                                                onDelete={() => removeEducation(edu.id)}
                                                                onMoveUp={() => handleMove('EDUCATION', index, 'UP')}
                                                                onMoveDown={() => handleMove('EDUCATION', index, 'DOWN')}
                                                            />

                                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                                                <div className="font-bold text-lg text-gray-800 uppercase">
                                                                    <EditableField value={edu.degree} onSave={(val) => updateEducation(edu.id, 'degree', val)} />
                                                                </div>
                                                                <div className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-1 rounded">
                                                                    <EditableField value={edu.year} onSave={(val) => updateEducation(edu.id, 'year', val)} />
                                                                </div>
                                                            </div>
                                                            <div className="font-medium text-sm text-gray-500 uppercase tracking-wide">
                                                                <EditableField value={edu.institution} onSave={(val) => updateEducation(edu.id, 'institution', val)} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                            <div className="mt-2 group/add opacity-0 group-hover:opacity-100 transition-opacity export-exclude">
                                <button
                                    onClick={(e) => { e.stopPropagation(); addEducation(); }}
                                    className="group relative inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-300"
                                >
                                    <Plus size={14} />
                                    <span>Add Education</span>
                                </button>
                            </div>
                        </section>
                    </SectionDragWrapper>
                );
            case 'portfolio':
                return (
                    <SectionDragWrapper key="portfolio" id="portfolio">
                        <section onClick={() => setActiveItem('portfolio')}>
                            <h3 className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-4 border-b-2 border-blue-500/20 pb-2 inline-block">
                                <EditableField value={portfolio.title} onSave={(val) => updatePortfolio('title', val)} />
                            </h3>
                            <div className="text-sm md:text-base leading-relaxed text-gray-600">
                                <EditableField value={portfolio.description} onSave={(val) => updatePortfolio('description', val)} multiline warningThreshold={300} />
                            </div>
                        </section>
                    </SectionDragWrapper>
                )
            default:
                return null;
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <main
                className="w-full md:w-[65%] bg-white text-gray-800 p-8 md:p-12 space-y-12"
                onClick={() => setActiveItem(null)} // Click background to deselect
            >

                {/* HERO / HEADER SECTION (Static) */}
                <div className="mt-12 md:mt-0" onClick={(e) => e.stopPropagation()}>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-2 uppercase">
                        <EditableField
                            value={personalInfo.fullName}
                            onSave={(val) => updatePersonalInfo('fullName', val)}
                            placeholder="YOUR NAME"
                        />
                    </h1>
                    <h2 className="text-xl md:text-2xl font-medium tracking-widest text-gray-600 uppercase mb-8">
                        <EditableField
                            value={personalInfo.title}
                            onSave={(val) => updatePersonalInfo('title', val)}
                            placeholder="JOB TITLE"
                        />
                    </h2>
                </div>

                {/* Draggable Sections */}
                <Reorder.Group
                    axis="y"
                    values={sectionOrder}
                    onReorder={reorderSections}
                    className="flex flex-col"
                    style={{ gap: `${layout?.sectionGap || 48}px` }}
                >
                    {sectionOrder.map((sectionId) => renderSection(sectionId))}
                </Reorder.Group>

            </main>
        </DragDropContext>
    );
}
