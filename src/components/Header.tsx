
import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HeaderProps {
  googleMeetLink: string;
  isTutorMode: boolean;
  onUpdateMeetLink: (link: string) => void;
}

const Header: React.FC<HeaderProps> = ({ googleMeetLink, isTutorMode, onUpdateMeetLink }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(googleMeetLink)
      .then(() => {
        toast.success('Google Meet link copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateMeetLink(e.target.value);
  };

  return (
    <header className="bg-white shadow-md p-4 rounded-lg mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-primary mb-4 sm:mb-0">
          C Programming Class Tracker
        </h1>
        
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <div className="flex items-center w-full sm:w-auto">
            <div className="mr-2 text-sm font-medium">Google Meet:</div>
            {isTutorMode ? (
              <input
                type="text"
                value={googleMeetLink}
                onChange={handleLinkChange}
                className="p-2 border rounded flex-grow text-sm"
                placeholder="Enter Google Meet link"
              />
            ) : (
              <div className="p-2 border rounded bg-gray-50 text-sm truncate max-w-[200px] sm:max-w-xs">
                {googleMeetLink}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="ml-1"
              title="Copy link"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
