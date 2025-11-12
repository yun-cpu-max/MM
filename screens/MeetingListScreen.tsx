import React from 'react';
import Card from '../components/Card';
import { PlusIcon } from '../constants';
import type { MeetingInfo } from '../types';

interface MeetingListScreenProps {
  meetings: MeetingInfo[];
  onSelectMeeting: (meetingId: string) => void;
  onCreateMeeting: () => void;
}

const MeetingListScreen: React.FC<MeetingListScreenProps> = ({ meetings, onSelectMeeting, onCreateMeeting }) => {
  return (
    <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-surface border-b border-gray-200 shadow-sm">
            <div>
                <h1 className="text-xl font-bold text-onSurface">모임 목록</h1>
                <p className="text-sm text-onSurfaceSecondary">참여하고 있는 모임</p>
            </div>
        </header>
        <main className="p-4 space-y-4 pb-24">
            {meetings.map(meeting => (
                <Card key={meeting.id} className="hover:shadow-lg hover:border-primary transition-all cursor-pointer">
                    <button onClick={() => onSelectMeeting(meeting.id)} className="w-full text-left p-2">
                        <h2 className="text-lg font-bold text-primary-dark">{meeting.name}</h2>
                        <p className="text-onSurfaceSecondary mt-1">{meeting.description}</p>
                    </button>
                </Card>
            ))}
        </main>
        <div className="fixed bottom-6 right-6">
             <button
                onClick={onCreateMeeting}
                className="bg-primary text-onPrimary p-4 rounded-full shadow-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
                aria-label="새 모임 생성"
            >
                <PlusIcon className="w-6 h-6" />
            </button>
        </div>
    </div>
  );
};

export default MeetingListScreen;