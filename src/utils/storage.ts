import { AppData } from './types';
import { initialModules } from './initialData';

const STORAGE_KEY = 'c-tutor-progress-data';
const DEFAULT_PIN = '2695';

export const getInitialData = (): AppData => {
  return {
    modules: initialModules,
    classSchedules: [],
    googleMeetLink: 'https://meet.google.com/qdt-ught-pbf',
    tutorPin: DEFAULT_PIN,
  };
};

export const loadData = (): AppData => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Failed to load data from localStorage', error);
  }

  // If no data or error, return default data
  return getInitialData();
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to localStorage', error);
  }
};

export const calculateTotalHours = (modules: AppData['modules']): number => {
  let totalMinutes = 0;
  
  modules.forEach(module => {
    module.lessons.forEach(lesson => {
      if (lesson.timeLog.duration) {
        totalMinutes += lesson.timeLog.duration;
      }
    });
  });
  
  return Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place
};

export const calculateModuleProgress = (moduleId: string, modules: AppData['modules']): number => {
  const module = modules.find(m => m.id === moduleId);
  if (!module) return 0;
  
  const totalLessons = module.lessons.length;
  if (totalLessons === 0) return 0;
  
  const completedLessons = module.lessons.filter(lesson => 
    lesson.status === 'Completed'
  ).length;
  
  return Math.round((completedLessons / totalLessons) * 100);
};

export const calculateOverallProgress = (modules: AppData['modules']): number => {
  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  if (totalLessons === 0) return 0;
  
  const completedLessons = modules.reduce((acc, module) => {
    return acc + module.lessons.filter(lesson => lesson.status === 'Completed').length;
  }, 0);
  
  return Math.round((completedLessons / totalLessons) * 100);
};

export const calculateClassHours = (classSchedules: AppData['classSchedules']): number => {
  let totalMinutes = 0;
  
  classSchedules.forEach(schedule => {
    if (schedule.endDateTime) {
      const startTime = new Date(schedule.dateTime).getTime();
      const endTime = new Date(schedule.endDateTime).getTime();
      const durationMs = endTime - startTime;
      if (durationMs > 0) {
        totalMinutes += durationMs / (1000 * 60); // Convert ms to minutes
      }
    }
  });
  
  return Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place
};
