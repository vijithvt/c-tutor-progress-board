
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
import { Calendar, X } from 'lucide-react';
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
  const [newMode, setNewMode] = useState<'Online' | 'Offline'>('Online');

  const addSchedule = () => {
    if (!newDateTime) {
      toast.error('Please select a date and time');
      return;
    }

    const newSchedule: ClassSchedule = {
      id: uuidv4(),
      dateTime: newDateTime,
      mode: newMode
    };

    onUpdateSchedules([...schedules, newSchedule]);
    setNewDateTime('');
    toast.success('Class scheduled successfully');
  };

  const deleteSchedule = (id: string) => {
    onUpdateSchedules(schedules.filter(schedule => schedule.id !== id));
    toast.success('Class schedule removed');
  };

  // Sort schedules by dateTime (earliest first)
  const sortedSchedules = [...schedules].sort((a, b) => 
    new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );

  // Filter future schedules
  const futureSchedules = sortedSchedules.filter(
    schedule => new Date(schedule.dateTime).getTime() > Date.now()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Classes</CardTitle>
      </CardHeader>
      <CardContent>
        {isTutorMode && (
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="flex items-center relative w-full sm:w-auto">
              <Calendar className="absolute left-2 h-4 w-4 text-gray-500" />
              <Input 
                type="datetime-local" 
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                className="pl-8"
              />
            </div>
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
        )}

        {futureSchedules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No upcoming classes scheduled
          </div>
        ) : (
          <div className="space-y-2">
            {futureSchedules.map((schedule) => (
              <div 
                key={schedule.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <div className="font-medium">
                    {new Date(schedule.dateTime).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(schedule.dateTime).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {' • '}
                    <span className={schedule.mode === 'Online' ? 'text-blue-600' : 'text-gray-700'}>
                      {schedule.mode}
                    </span>
                  </div>
                </div>
                {isTutorMode && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteSchedule(schedule.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        
        {schedules.length > 0 && schedules.length !== futureSchedules.length && (
          <div className="mt-4 text-xs text-gray-500">
            {schedules.length - futureSchedules.length} past class(es) not shown
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassScheduler;
