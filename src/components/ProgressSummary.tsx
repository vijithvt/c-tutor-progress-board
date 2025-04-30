
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Module } from '@/utils/types';
import { calculateOverallProgress } from '@/utils/storage';

interface ProgressSummaryProps {
  modules: Module[];
  totalHours?: number;
  classHours?: number;
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ modules, totalHours = 0, classHours = 0 }) => {
  const progress = calculateOverallProgress(modules);
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Progress Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between mb-2">
          <div className="text-lg font-semibold mb-2 sm:mb-0">Overall: {progress}% Complete</div>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="text-sm font-medium">
              <span className="text-gray-500">Class Hours:</span> {classHours} hrs
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
};

export default ProgressSummary;
