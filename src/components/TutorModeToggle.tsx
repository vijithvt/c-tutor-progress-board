
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';

interface TutorModeToggleProps {
  isTutorMode: boolean;
  tutorPin: string;
  onToggleTutorMode: (enabled: boolean) => void;
  onUpdatePin: (pin: string) => void;
}

const TutorModeToggle: React.FC<TutorModeToggleProps> = ({
  isTutorMode,
  tutorPin,
  onToggleTutorMode,
  onUpdatePin
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === tutorPin) {
      onToggleTutorMode(true);
      toast.success('Tutor mode enabled');
      setPinInput('');
    } else {
      toast.error('Incorrect PIN');
    }
  };

  const handleExitTutorMode = () => {
    onToggleTutorMode(false);
    toast.info('Exited tutor mode');
  };

  const handlePinChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4 && /^\d+$/.test(newPin)) {
      onUpdatePin(newPin);
      setNewPin('');
      setShowPinChange(false);
      toast.success('PIN updated successfully');
    } else {
      toast.error('PIN must be 4 digits');
    }
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-6">
      {isTutorMode ? (
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <Unlock className="h-5 w-5 mr-2 text-green-500" />
            <span className="font-medium">Tutor Mode Active</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {!showPinChange ? (
              <Button 
                variant="outline" 
                onClick={() => setShowPinChange(true)}
                className="w-full sm:w-auto"
              >
                Change PIN
              </Button>
            ) : (
              <form onSubmit={handlePinChange} className="flex gap-2">
                <Input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="New 4-digit PIN"
                  className="w-32"
                  maxLength={4}
                />
                <Button type="submit">Save</Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => {
                    setShowPinChange(false);
                    setNewPin('');
                  }}
                >
                  Cancel
                </Button>
              </form>
            )}
            <Button 
              variant="destructive" 
              onClick={handleExitTutorMode}
              className="w-full sm:w-auto"
            >
              Exit Tutor Mode
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center mr-auto mb-2 sm:mb-0">
            <Lock className="h-5 w-5 mr-2 text-gray-600" />
            <span className="font-medium">Enter Tutor Mode</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter 4-digit PIN"
              className="w-full sm:w-32"
              maxLength={4}
            />
            <Button type="submit" className="w-full sm:w-auto">
              Unlock
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TutorModeToggle;
