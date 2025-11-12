
import React, { useMemo } from 'react';
import type { MeetingDataHook } from '../types';
import { AttendanceStatus } from '../types';
import Card from '../components/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface HomeScreenProps {
  data: MeetingDataHook;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ data }) => {
  const { currentUser, sessions, announcements, meeting, fineVote } = data;

  const myStats = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    let totalFines = 0;

    sessions.forEach(session => {
      const myAttendance = session.attendance.find(att => att.memberId === currentUser.id);
      if (myAttendance) {
        if (myAttendance.status === AttendanceStatus.Present) present++;
        if (myAttendance.status === AttendanceStatus.Late) {
          late++;
          totalFines += meeting.rules.lateFine;
        }
        if (myAttendance.status === AttendanceStatus.Absent) {
          absent++;
          totalFines += meeting.rules.absentFine;
        }
      }
    });
    
    const totalMeetings = sessions.filter(s => s.attendance.some(a => a.status !== AttendanceStatus.Pending)).length;
    const attendanceRate = totalMeetings > 0 ? Math.round((present / totalMeetings) * 100) : 100;

    return { present, late, absent, totalFines, attendanceRate };
  }, [sessions, currentUser.id, meeting.rules]);

  const attendanceData = [
    { name: '출석', value: myStats.present },
    { name: '지각', value: myStats.late },
    { name: '결석', value: myStats.absent },
  ];
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];
  
  const upcomingMeeting = sessions.find(s => s.attendance.some(a => a.status === AttendanceStatus.Pending));

  return (
    <div className="p-4 space-y-6">
      <Card title={`👋 ${currentUser.name}님, 안녕하세요!`}>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-1/3 h-32">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={attendanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} labelLine={false}>
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}회`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full sm:w-2/3 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-secondary">{myStats.attendanceRate}%</p>
              <p className="text-sm text-onSurfaceSecondary">나의 출석률</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{myStats.totalFines.toLocaleString()}원</p>
              <p className="text-sm text-onSurfaceSecondary">누적 벌금</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="💰 총 누적 벌금">
            <div className="text-center">
                <p className="text-3xl font-bold text-primary-dark">{fineVote.totalFines.toLocaleString()}원</p>
                <p className="text-sm text-onSurfaceSecondary mt-1">벌금 사용처 투표가 진행중입니다!</p>
            </div>
        </Card>
        
        {upcomingMeeting && (
          <Card title="🗓️ 다음 모임">
            <div className="space-y-2">
              <p className="font-semibold">{new Date(upcomingMeeting.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
              <p className="text-onSurfaceSecondary">{upcomingMeeting.topic}</p>
            </div>
          </Card>
        )}
      </div>

      <Card title="🔔 최신 공지">
        <ul className="space-y-3">
          {announcements.slice(0, 2).map(ann => (
            <li key={ann.id} className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-onSurface">{ann.title}</p>
              <p className="text-sm text-onSurfaceSecondary truncate">{ann.content}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default HomeScreen;
