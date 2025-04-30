
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import { Lesson, LessonStatus } from '@/utils/types';

interface LessonCardProps {
  lesson: Lesson;
  isTutorMode: boolean;
  onUpdateLesson: (updatedLesson: Lesson) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ 
  lesson, 
  isTutorMode,
  onUpdateLesson
}) => {
  const [editing, setEditing] = useState(false);

  const handleStatusChange = (status: LessonStatus) => {
    const now = new Date().toISOString();
    let updatedTimeLog = { ...lesson.timeLog };
    
    if (status === 'In Progress' && !updatedTimeLog.startDateTime) {
      updatedTimeLog.startDateTime = now;
    } else if (status === 'Completed' && updatedTimeLog.startDateTime && !updatedTimeLog.endDateTime) {
      updatedTimeLog.endDateTime = now;
      
      // Calculate duration in minutes
      const start = new Date(updatedTimeLog.startDateTime);
      const end = new Date(now);
      const durationMs = end.getTime() - start.getTime();
      updatedTimeLog.duration = Math.round(durationMs / (1000 * 60));
    }
    
    onUpdateLesson({
      ...lesson,
      status,
      timeLog: updatedTimeLog
    });
  };

  const handleTimeChange = (field: 'startDateTime' | 'endDateTime', value: string) => {
    let updatedTimeLog = { ...lesson.timeLog };
    updatedTimeLog[field] = value;
    
    // Recalculate duration if both start and end times are set
    if (updatedTimeLog.startDateTime && updatedTimeLog.endDateTime) {
      const start = new Date(updatedTimeLog.startDateTime);
      const end = new Date(updatedTimeLog.endDateTime);
      const durationMs = end.getTime() - start.getTime();
      updatedTimeLog.duration = Math.round(durationMs / (1000 * 60));
    }
    
    onUpdateLesson({
      ...lesson,
      timeLog: updatedTimeLog
    });
  };

  const handleDurationChange = (value: string) => {
    const duration = parseInt(value, 10) || 0;
    
    onUpdateLesson({
      ...lesson,
      timeLog: {
        ...lesson.timeLog,
        duration
      }
    });
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '0h 0m';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return `${hours}h ${remainingMinutes}m`;
  };

  const statusStyles = {
    'Not Started': 'bg-red-100 text-red-800 border-red-200',
    'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Completed': 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <Card className={`mb-2 border-l-4 ${statusStyles[lesson.status]}`}>
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{lesson.title}</h3>
            
            {isTutorMode ? (
              <div className="min-w-[140px]">
                <Select
                  value={lesson.status}
                  onValueChange={(value) => handleStatusChange(value as LessonStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <span className={`text-xs font-semibold px-2 py-1 rounded ${statusStyles[lesson.status]}`}>
                {lesson.status}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {editing && isTutorMode ? (
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-1">
                  <span className="text-xs">Start:</span>
                  <Input
                    type="datetime-local"
                    value={lesson.timeLog.startDateTime || ''}
                    onChange={(e) => handleTimeChange('startDateTime', e.target.value)}
                    className="h-7 py-1 px-2 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">End:</span>
                  <Input
                    type="datetime-local"
                    value={lesson.timeLog.endDateTime || ''}
                    onChange={(e) => handleTimeChange('endDateTime', e.target.value)}
                    className="h-7 py-1 px-2 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">Duration (mins):</span>
                  <Input
                    type="number"
                    value={lesson.timeLog.duration?.toString() || '0'}
                    onChange={(e) => handleDurationChange(e.target.value)}
                    className="h-7 w-16 py-1 px-2 text-xs"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setEditing(false)}
                  className="h-6 text-xs"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                {lesson.timeLog.startDateTime ? (
                  <>
                    <span>Started: {new Date(lesson.timeLog.startDateTime).toLocaleString()}</span>
                    {lesson.timeLog.endDateTime && (
                      <span className="ml-2">
                        - Ended: {new Date(lesson.timeLog.endDateTime).toLocaleString()}
                      </span>
                    )}
                    <span className="ml-2">
                      ({formatDuration(lesson.timeLog.duration)})
                    </span>
                    {isTutorMode && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setEditing(true)}
                        className="ml-2 h-6 text-xs"
                      >
                        Edit
                      </Button>
                    )}
                  </>
                ) : (
                  <span>Not started yet</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonCard;
