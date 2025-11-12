import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import FinanceScreen from './screens/FinanceScreen';
import NoticeScreen from './screens/NoticeScreen';
import MembersScreen from './screens/MembersScreen';
import LoginScreen from './screens/LoginScreen';
import MeetingListScreen from './screens/MeetingListScreen';
import CreateMeetingScreen from './screens/CreateMeetingScreen';
import SettingsModal from './components/SettingsModal';
import { useMeetingData } from './hooks/useMeetingData';
import type { Screen, AppState, NewMeetingData, Member } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const meetingData = useMeetingData(selectedMeetingId, currentUser);
  
  const screenTitles: Record<Screen, string> = {
    home: '대시보드',
    attendance: '출결 관리',
    finance: '재정 관리',
    notice: '공지/자료실',
    members: '멤버 랭킹',
  };

  const handleLogout = () => {
    setIsSettingsModalOpen(false);
    setSelectedMeetingId(null);
    setCurrentUser(null);
    setAppState('login');
    setActiveScreen('home');
  };
  
  const handleCreateMeeting = (newMeeting: NewMeetingData) => {
    meetingData.addMeeting(newMeeting);
    setAppState('meetingList');
  }

  const handleLeaveMeeting = () => {
    setIsSettingsModalOpen(false);
    setSelectedMeetingId(null);
    setAppState('meetingList');
  }

  if (appState === 'login') {
    return <LoginScreen onLoginSuccess={(user) => {
        setCurrentUser(user);
        setAppState('meetingList');
    }} />;
  }

  if (appState === 'meetingList') {
    return <MeetingListScreen 
      meetings={meetingData.meetings}
      onSelectMeeting={(id) => {
        setSelectedMeetingId(id);
        setAppState('inMeeting');
      }} 
      onCreateMeeting={() => setAppState('createMeeting')}
      />;
  }

  if (appState === 'createMeeting') {
    return <CreateMeetingScreen 
      onMeetingCreate={handleCreateMeeting}
      onCancel={() => setAppState('meetingList')}
    />;
  }
  
  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen data={meetingData} />;
      case 'attendance':
        return <AttendanceScreen data={meetingData} />;
      case 'finance':
        return <FinanceScreen data={meetingData} />;
      case 'notice':
        return <NoticeScreen data={meetingData} />;
      case 'members':
        return <MembersScreen data={meetingData} />;
      default:
        return <HomeScreen data={meetingData} />;
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased text-onSurface bg-background md:max-w-md md:mx-auto md:shadow-lg md:border md:border-gray-200">
      <div className="flex flex-col h-screen">
        <Header 
          title={screenTitles[activeScreen]} 
          groupName={meetingData.meeting.name}
          onLogout={handleLogout}
          onSettingsClick={() => setIsSettingsModalOpen(true)}
        />
        <main className="flex-grow overflow-y-auto pb-20 bg-background">
          {renderScreen()}
        </main>
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      </div>
      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          isLeader={meetingData.currentUser.isLeader}
          onLeaveMeeting={handleLeaveMeeting}
        />
      )}
    </div>
  );
};

export default App;