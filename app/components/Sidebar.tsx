'use client';

import { useResumeStore } from '../store/useResumeStore';
import { EditableField } from './EditableField';
import { SkillBar } from './SkillBar';
import { Phone, Mail, Globe, MapPin, Plus, Trash2, Camera, GripVertical } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import clsx from 'clsx';
import { ScaleButton } from './ScaleButton';

export function Sidebar() {
    const {
        personalInfo,
        skills,
        interests,
        updatePersonalInfo,
        addSkill,
        updateSkill,
        removeSkill,
        reorderSkills,
        updateInterests,
        layout
    } = useResumeStore();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updatePersonalInfo('photoUrl', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        reorderSkills(result.source.index, result.destination.index);
    };

    return (
        <aside className="w-full md:w-[35%] bg-sidebar-bg text-sidebar-text flex flex-col min-h-screen">

            {/* HEADER WITH PHOTO */}
            <div className="bg-accent-yellow p-8 flex justify-center items-center relative group">
                <div className="relative w-48 h-48 rounded-full border-4 border-white/20 overflow-hidden bg-gray-800">
                    {personalInfo.photoUrl ? (
                        <Image
                            src={personalInfo.photoUrl}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <Camera size={48} />
                        </div>
                    )}

                    {/* Upload Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer export-exclude z-10"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <span className="text-white font-medium text-sm">Change Photo</span>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                    />
                </div>
            </div>

            <div className="p-8 space-y-12">

                {/* CONTACT SECTION */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold uppercase tracking-widest border-b-2 border-accent-yellow pb-2 mb-6 w-fit">
                        Contact
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-accent-yellow flex items-center justify-center text-sidebar-bg shrink-0">
                                <Phone size={20} />
                            </div>
                            <div className="w-full">
                                <div className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Phone</div>
                                <EditableField
                                    value={personalInfo.phone}
                                    onSave={(val) => updatePersonalInfo('phone', val)}
                                    className="text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-accent-yellow flex items-center justify-center text-sidebar-bg shrink-0">
                                <Mail size={20} />
                            </div>
                            <div className="w-full">
                                <div className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Email</div>
                                <EditableField
                                    value={personalInfo.email}
                                    onSave={(val) => updatePersonalInfo('email', val)}
                                    className="text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-accent-yellow flex items-center justify-center text-sidebar-bg shrink-0">
                                <Globe size={20} />
                            </div>
                            <div className="w-full">
                                <div className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Website</div>
                                <EditableField
                                    value={personalInfo.website}
                                    onSave={(val) => updatePersonalInfo('website', val)}
                                    className="text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-accent-yellow flex items-center justify-center text-sidebar-bg shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div className="w-full">
                                <div className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Address</div>
                                <EditableField
                                    value={personalInfo.address}
                                    onSave={(val) => updatePersonalInfo('address', val)}
                                    multiline
                                    className="text-sm font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SKILLS SECTION */}
                <div className="group/skills">
                    <div className="flex justify-between items-center border-b-2 border-accent-yellow pb-2 mb-6">
                        <h3 className="text-xl font-bold uppercase tracking-widest">Skills</h3>
                        <ScaleButton
                            onClick={addSkill}
                            variant="ghost"
                            className="text-accent-yellow hover:text-white hover:bg-white/10 transition-colors no-print p-1 h-8 w-8 opacity-0 group-hover/skills:opacity-100 export-exclude"
                            title="Add Skill"
                        >
                            <Plus size={20} />
                        </ScaleButton>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="skills-list" direction={layout?.skillsMode === 'grid' ? "horizontal" : "vertical"}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={clsx(
                                        "space-y-4",
                                        layout?.skillsMode === 'grid' && "flex flex-wrap gap-4 !space-y-0"
                                    )}
                                >
                                    {skills.map((skill, index) => (
                                        <Draggable key={skill.id} draggableId={skill.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={clsx(
                                                        snapshot.isDragging && "opacity-50",
                                                        layout?.skillsMode === 'grid' ? "w-[45%]" : "w-full"
                                                    )}
                                                >
                                                    <SkillBar
                                                        id={skill.id}
                                                        name={skill.name}
                                                        level={skill.level}
                                                        onChange={(field, val) => updateSkill(skill.id, field, val)}
                                                        onDelete={() => removeSkill(skill.id)}
                                                        compact={layout?.skillsMode === 'grid'}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                {/* INTERESTS SECTION */}
                <div>
                    <h3 className="text-xl font-bold uppercase tracking-widest border-b-2 border-accent-yellow pb-2 mb-6 w-fit">
                        Interests
                    </h3>
                    <EditableField
                        value={interests.join(', ')}
                        onSave={updateInterests} // Store implementation splits by comma
                        multiline
                        className="text-sm font-medium leading-relaxed"
                        placeholder="Coding, Hiking, Gaming..."
                    />
                </div>

            </div>
        </aside>
    );
}
