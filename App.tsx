
import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import FinanceScreen from './screens/FinanceScreen';
import NoticeScreen from './screens/NoticeScreen';
import MembersScreen from './screens/MembersScreen';
import { useMeetingData } from './hooks/useMeetingData';
import type { Screen } from './types';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const meetingData = useMeetingData();
  
  const screenTitles: Record<Screen, string> = {
    home: '대시보드',
    attendance: '출결 관리',
    finance: '재정 관리',
    notice: '공지/자료실',
    members: '멤버 랭킹',
  };

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
        <Header title={screenTitles[activeScreen]} groupName={meetingData.meeting.name} />
        <main className="flex-grow overflow-y-auto pb-20 bg-background">
          {renderScreen()}
        </main>
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      </div>
    </div>
  );
};

export default App;
