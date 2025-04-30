
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Module } from '@/utils/types';
import { calculateModuleProgress } from '@/utils/storage';
import LessonCard from './LessonCard';

interface ModuleAccordionProps {
  modules: Module[];
  isTutorMode: boolean;
  onUpdateLesson: (moduleId: string, lessonId: string, updatedLesson: any) => void;
}

const ModuleAccordion: React.FC<ModuleAccordionProps> = ({
  modules,
  isTutorMode,
  onUpdateLesson
}) => {
  return (
    <Accordion type="multiple" collapsible className="w-full">
      {modules.map((module) => {
        const progress = calculateModuleProgress(module.id, modules);
        
        return (
          <AccordionItem key={module.id} value={module.id} className="border rounded-md mb-4">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex flex-col items-start w-full">
                <div className="flex justify-between w-full">
                  <h2 className="text-left font-medium">{module.title}</h2>
                  <span className="text-sm font-semibold">{progress}%</span>
                </div>
                <div className="w-full mt-2">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2 pb-4">
              <div className="grid gap-2">
                {module.lessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isTutorMode={isTutorMode}
                    onUpdateLesson={(updatedLesson) => 
                      onUpdateLesson(module.id, lesson.id, updatedLesson)
                    }
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default ModuleAccordion;
