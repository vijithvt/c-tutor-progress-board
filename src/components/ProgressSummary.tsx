
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateOverallProgress } from '@/utils/storage';
import { Module } from '@/utils/types';

interface ProgressSummaryProps {
  modules: Module[];
  totalHours: number;
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ modules, totalHours }) => {
  const overallProgress = calculateOverallProgress(modules);
  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = modules.reduce((acc, module) => {
    return acc + module.lessons.filter(lesson => lesson.status === 'Completed').length;
  }, 0);
  const inProgressLessons = modules.reduce((acc, module) => {
    return acc + module.lessons.filter(lesson => lesson.status === 'In Progress').length;
  }, 0);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Overall Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium">Course Completion</span>
              <span className="text-sm font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-primary">{totalHours}</div>
            <div className="text-xs text-gray-500 uppercase">Hours Completed</div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="text-xl font-semibold">{totalLessons}</div>
              <div className="text-xs text-gray-500 text-center">Total Lessons</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xl font-semibold text-lesson-completed">{completedLessons}</div>
              <div className="text-xs text-gray-500 text-center">Completed</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xl font-semibold text-lesson-in-progress">{inProgressLessons}</div>
              <div className="text-xs text-gray-500 text-center">In Progress</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressSummary;
