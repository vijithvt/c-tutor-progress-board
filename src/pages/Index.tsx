
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TutorModeToggle from '@/components/TutorModeToggle';
import ProgressSummary from '@/components/ProgressSummary';
import ModuleAccordion from '@/components/ModuleAccordion';
import ClassScheduler from '@/components/ClassScheduler';
import { 
  loadData, 
  saveData, 
  calculateClassHours,
  calculateTotalHours
} from '@/utils/storage';
import { AppState, Lesson } from '@/utils/types';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const data = loadData();
    // Update the PIN and Google Meet URL on initial load
    return {
      ...data,
      tutorPin: '2695',
      googleMeetLink: 'https://meet.google.com/qdt-ught-pbf',
      isTutorMode: false
    };
  });

  const { modules, classSchedules, googleMeetLink, tutorPin, isTutorMode } = appState;
  
  // Save data when appState changes (except isTutorMode)
  useEffect(() => {
    const { isTutorMode, ...dataToSave } = appState;
    saveData(dataToSave);
  }, [modules, classSchedules, googleMeetLink, tutorPin]);

  const classHours = calculateClassHours(classSchedules);
  const totalHours = calculateTotalHours(modules);

  const updateLesson = (moduleId: string, lessonId: string, updatedLesson: Lesson) => {
    setAppState(prevState => {
      const updatedModules = prevState.modules.map(module => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.map(lesson => 
              lesson.id === lessonId ? updatedLesson : lesson
            )
          };
        }
        return module;
      });
      
      return {
        ...prevState,
        modules: updatedModules
      };
    });
  };

  const updateMeetLink = (link: string) => {
    if (!isTutorMode) return;
    
    setAppState(prevState => ({
      ...prevState,
      googleMeetLink: link
    }));
    
    toast.success('Google Meet link updated');
  };

  const updateSchedules = (updatedSchedules: AppState['classSchedules']) => {
    setAppState(prevState => ({
      ...prevState,
      classSchedules: updatedSchedules
    }));
  };

  const toggleTutorMode = (enabled: boolean) => {
    setAppState(prevState => ({
      ...prevState,
      isTutorMode: enabled
    }));
  };

  const updatePin = (pin: string) => {
    setAppState(prevState => ({
      ...prevState,
      tutorPin: pin
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <Header 
          googleMeetLink={googleMeetLink}
          isTutorMode={isTutorMode}
          onUpdateMeetLink={updateMeetLink}
        />
        
        <TutorModeToggle 
          isTutorMode={isTutorMode}
          tutorPin={tutorPin}
          onToggleTutorMode={toggleTutorMode}
          onUpdatePin={updatePin}
        />
        
        <ProgressSummary 
          modules={modules} 
          totalHours={totalHours}
          classHours={classHours}
        />
        
        <Tabs defaultValue="syllabus">
          <TabsList className="mb-4">
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
            <TabsTrigger value="schedule">Class Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="syllabus" className="space-y-6">
            <ModuleAccordion 
              modules={modules}
              isTutorMode={isTutorMode}
              onUpdateLesson={updateLesson}
            />
          </TabsContent>
          
          <TabsContent value="schedule">
            <ClassScheduler 
              schedules={classSchedules}
              isTutorMode={isTutorMode}
              onUpdateSchedules={updateSchedules}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
