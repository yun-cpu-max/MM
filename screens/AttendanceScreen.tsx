
import React from 'react';
import type { MeetingDataHook, MeetingSession } from '../types';
import { AttendanceStatus } from '../types';
import Card from '../components/Card';

interface AttendanceScreenProps {
  data: MeetingDataHook;
}

const statusInfo = {
  [AttendanceStatus.Present]: { text: '출석', color: 'bg-green-100 text-green-800', button: 'border-green-500 bg-green-500 text-white' },
  [AttendanceStatus.Late]: { text: '지각', color: 'bg-yellow-100 text-yellow-800', button: 'border-yellow-500 bg-yellow-500 text-white' },
  [AttendanceStatus.Absent]: { text: '결석', color: 'bg-red-100 text-red-800', button: 'border-red-500 bg-red-500 text-white' },
  [AttendanceStatus.Pending]: { text: '대기', color: 'bg-gray-100 text-gray-800', button: 'border-gray-300 bg-white text-gray-700' },
};

const AttendanceCheckCard: React.FC<{
  session: MeetingSession;
  members: MeetingDataHook['members'];
  updateAttendance: MeetingDataHook['updateAttendance'];
}> = ({ session, members, updateAttendance }) => {
  return (
    <Card title="오늘 출석 체크" className="bg-primary-light/5">
       <p className="text-center text-onSurfaceSecondary mb-4">{new Date(session.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} - {session.topic}</p>
       <div className="space-y-3">
        {members.map(member => {
          const attendance = session.attendance.find(a => a.memberId === member.id);
          const currentStatus = attendance?.status || AttendanceStatus.Pending;
          return (
            <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full mr-3" />
                <span className="font-semibold">{member.name}</span>
              </div>
              <div className="flex space-x-1">
                {(Object.keys(statusInfo) as Array<keyof typeof statusInfo>).filter(s => s !== 'pending').map(status => (
                  <button
                    key={status}
                    onClick={() => updateAttendance(session.id, member.id, status as AttendanceStatus)}
                    className={`px-2 py-1 text-xs font-semibold rounded border transition-colors duration-200 ${currentStatus === status ? statusInfo[status].button : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    {statusInfo[status].text}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
       </div>
    </Card>
  );
};

const AttendanceHistory: React.FC<{ sessions: MeetingSession[]; members: MeetingDataHook['members'] }> = ({ sessions, members }) => {
  return (
    <Card title="출결 현황">
      <div className="space-y-4">
        {sessions.filter(s => s.attendance.every(a => a.status !== AttendanceStatus.Pending)).reverse().map(session => (
          <div key={session.id}>
            <p className="font-bold mb-2">{new Date(session.date).toLocaleDateString('ko-KR')} - {session.topic}</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {session.attendance.map(att => {
                const member = members.find(m => m.id === att.memberId);
                const info = statusInfo[att.status];
                return (
                  <div key={att.memberId} className={`p-2 rounded-md text-center text-sm ${info.color}`}>
                    <p className="font-semibold">{member?.name}</p>
                    <p>{info.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ data }) => {
  const { currentUser, members, sessions, allSessions, updateAttendance } = data;
  const todaySession = sessions.find(s => s.attendance.some(a => a.status === AttendanceStatus.Pending));
  
  return (
    <div className="p-4 space-y-6">
      {currentUser.isLeader && todaySession && (
        <AttendanceCheckCard session={todaySession} members={members} updateAttendance={updateAttendance} />
      )}
      <AttendanceHistory sessions={allSessions} members={members} />
    </div>
  );
};

export default AttendanceScreen;