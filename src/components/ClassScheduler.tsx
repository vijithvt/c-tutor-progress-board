
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, Edit, Trash2, X } from 'lucide-react';
import { ClassSchedule } from '@/utils/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface ClassSchedulerProps {
  schedules: ClassSchedule[];
  isTutorMode: boolean;
  onUpdateSchedules: (schedules: ClassSchedule[]) => void;
}

const ClassScheduler: React.FC<ClassSchedulerProps> = ({ 
  schedules, 
  isTutorMode,
  onUpdateSchedules 
}) => {
  const [newDateTime, setNewDateTime] = useState('');
  const [newEndDateTime, setNewEndDateTime] = useState('');
  const [newMode, setNewMode] = useState<'Online' | 'Offline'>('Online');
  const [editScheduleId, setEditScheduleId] = useState<string | null>(null);
  const [showAllClasses, setShowAllClasses] = useState(false);

  const addSchedule = () => {
    if (!newDateTime) {
      toast.error('Please select a start date and time');
      return;
    }

    if (!newEndDateTime) {
      toast.error('Please select an end date and time');
      return;
    }

    // Validate end time is after start time
    const startTime = new Date(newDateTime).getTime();
    const endTime = new Date(newEndDateTime).getTime();
    
    if (endTime <= startTime) {
      toast.error('End time must be after start time');
      return;
    }

    const newSchedule: ClassSchedule = {
      id: uuidv4(),
      dateTime: newDateTime,
      endDateTime: newEndDateTime,
      mode: newMode
    };

    onUpdateSchedules([...schedules, newSchedule]);
    setNewDateTime('');
    setNewEndDateTime('');
    toast.success('Class scheduled successfully');
  };

  const deleteSchedule = (id: string) => {
    onUpdateSchedules(schedules.filter(schedule => schedule.id !== id));
    toast.success('Class schedule removed');
  };

  const startEditSchedule = (schedule: ClassSchedule) => {
    setNewDateTime(schedule.dateTime);
    setNewEndDateTime(schedule.endDateTime);
    setNewMode(schedule.mode);
    setEditScheduleId(schedule.id);
  };

  const saveEditSchedule = () => {
    if (!editScheduleId) return;
    
    if (!newDateTime || !newEndDateTime) {
      toast.error('Please select both start and end date/time');
      return;
    }

    // Validate end time is after start time
    const startTime = new Date(newDateTime).getTime();
    const endTime = new Date(newEndDateTime).getTime();
    
    if (endTime <= startTime) {
      toast.error('End time must be after start time');
      return;
    }

    const updatedSchedules = schedules.map(schedule => {
      if (schedule.id === editScheduleId) {
        return {
          ...schedule,
          dateTime: newDateTime,
          endDateTime: newEndDateTime,
          mode: newMode
        };
      }
      return schedule;
    });

    onUpdateSchedules(updatedSchedules);
    setEditScheduleId(null);
    setNewDateTime('');
    setNewEndDateTime('');
    setNewMode('Online');
    toast.success('Class schedule updated');
  };

  const cancelEdit = () => {
    setEditScheduleId(null);
    setNewDateTime('');
    setNewEndDateTime('');
    setNewMode('Online');
  };

  // Sort schedules by dateTime (earliest first)
  const sortedSchedules = [...schedules].sort((a, b) => 
    new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );

  // Filter future schedules
  const futureSchedules = sortedSchedules.filter(
    schedule => new Date(schedule.dateTime).getTime() > Date.now()
  );

  // Past schedules
  const pastSchedules = sortedSchedules.filter(
    schedule => new Date(schedule.dateTime).getTime() <= Date.now()
  );

  // Calculate duration in hours
  const calculateDuration = (start: string, end: string): string => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    const durationHours = Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10;
    return `${durationHours} hr${durationHours !== 1 ? 's' : ''}`;
  };

  // Display schedules based on filter
  const schedulesToDisplay = showAllClasses ? sortedSchedules : futureSchedules;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Class Schedule</CardTitle>
        {schedules.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAllClasses(!showAllClasses)}
          >
            {showAllClasses ? 'Show Upcoming Only' : 'Show All Classes'}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isTutorMode && !editScheduleId && (
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center relative w-full sm:w-auto">
                <Calendar className="absolute left-2 h-4 w-4 text-gray-500" />
                <Input 
                  type="datetime-local" 
                  value={newDateTime}
                  onChange={(e) => setNewDateTime(e.target.value)}
                  className="pl-8"
                  placeholder="Start time"
                />
              </div>
              <div className="flex items-center relative w-full sm:w-auto">
                <Clock className="absolute left-2 h-4 w-4 text-gray-500" />
                <Input 
                  type="datetime-local" 
                  value={newEndDateTime}
                  onChange={(e) => setNewEndDateTime(e.target.value)}
                  className="pl-8"
                  placeholder="End time"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={newMode}
                onValueChange={(value) => setNewMode(value as 'Online' | 'Offline')}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addSchedule} className="w-full sm:w-auto">
                Schedule Class
              </Button>
            </div>
          </div>
        )}

        {isTutorMode && editScheduleId && (
          <div className="flex flex-col gap-2 mb-4 bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-bold mb-2">Edit Class</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center relative w-full sm:w-auto">
                <Calendar className="absolute left-2 h-4 w-4 text-gray-500" />
                <Input 
                  type="datetime-local" 
                  value={newDateTime}
                  onChange={(e) => setNewDateTime(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex items-center relative w-full sm:w-auto">
                <Clock className="absolute left-2 h-4 w-4 text-gray-500" />
                <Input 
                  type="datetime-local" 
                  value={newEndDateTime}
                  onChange={(e) => setNewEndDateTime(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={newMode}
                onValueChange={(value) => setNewMode(value as 'Online' | 'Offline')}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={saveEditSchedule} className="w-full sm:w-auto">
                  Save Changes
                </Button>
                <Button onClick={cancelEdit} variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {schedulesToDisplay.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No classes scheduled
          </div>
        ) : (
          <div className="space-y-2">
            {schedulesToDisplay.map((schedule) => {
              const isPast = new Date(schedule.dateTime).getTime() <= Date.now();
              return (
                <div 
                  key={schedule.id} 
                  className={`flex items-center justify-between p-3 rounded-md ${
                    isPast ? 'bg-gray-100' : 'bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="font-medium">
                      {new Date(schedule.dateTime).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      {isPast && <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">Past</span>}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(schedule.dateTime).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {' - '}
                      {new Date(schedule.endDateTime).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {' • '}
                      <span className={schedule.mode === 'Online' ? 'text-blue-600' : 'text-gray-700'}>
                        {schedule.mode}
                      </span>
                      {' • '}
                      <span className="text-green-600 font-medium">
                        {calculateDuration(schedule.dateTime, schedule.endDateTime)}
                      </span>
                    </div>
                  </div>
                  {isTutorMode && (
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => startEditSchedule(schedule)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteSchedule(schedule.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassScheduler;
