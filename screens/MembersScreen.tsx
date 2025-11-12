

import React, { useMemo } from 'react';
import type { MeetingDataHook } from '../types';
import Card from '../components/Card';
import { AttendanceStatus } from '../types';

interface MembersScreenProps {
  data: MeetingDataHook;
}

const MembersScreen: React.FC<MembersScreenProps> = ({ data }) => {
  const { members, allSessions, meeting } = data;

  const memberStats = useMemo(() => {
    return members.map(member => {
      let present = 0;
      let late = 0;
      let absent = 0;
      let totalFines = 0;
      
      allSessions.forEach(session => {
        const attendance = session.attendance.find(a => a.memberId === member.id);
        if (attendance) {
          switch (attendance.status) {
            case AttendanceStatus.Present:
              present++;
              break;
            case AttendanceStatus.Late:
              late++;
              totalFines += meeting.rules.lateFine;
              break;
            case AttendanceStatus.Absent:
              absent++;
              totalFines += meeting.rules.absentFine;
              break;
          }
        }
      });
      
      const totalAttendedSessions = present + late + absent;
      const attendanceRate = totalAttendedSessions > 0 ? (present + late) / totalAttendedSessions * 100 : 100;

      return {
        ...member,
        attendanceRate,
        totalFines,
        lateCount: late,
        absentCount: absent,
      };
    }).sort((a, b) => b.attendanceRate - a.attendanceRate || a.totalFines - b.totalFines);
  }, [members, allSessions, meeting.rules]);
  
  const bestMember = memberStats[0];
  const lateKing = [...memberStats].sort((a,b) => b.lateCount - a.lateCount || b.totalFines - a.totalFines)[0];

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bestMember && (
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="text-center">
              <span className="text-2xl">🥇</span>
              <h3 className="text-lg font-bold text-yellow-800">성실왕</h3>
              <img src={bestMember.avatarUrl} alt={bestMember.name} className="w-16 h-16 rounded-full mx-auto my-2 border-2 border-yellow-400" />
              <p className="font-semibold text-xl">{bestMember.name}</p>
              <p className="text-sm text-yellow-700">출석률 {bestMember.attendanceRate.toFixed(1)}%</p>
            </div>
          </Card>
        )}
        {lateKing && lateKing.lateCount > 0 && (
           <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              <span className="text-2xl">⏰</span>
              <h3 className="text-lg font-bold text-blue-800">지각왕</h3>
              <img src={lateKing.avatarUrl} alt={lateKing.name} className="w-16 h-16 rounded-full mx-auto my-2 border-2 border-blue-400" />
              <p className="font-semibold text-xl">{lateKing.name}</p>
              <p className="text-sm text-blue-700">{lateKing.lateCount}회 지각</p>
            </div>
          </Card>
        )}
      </div>
      
      <Card title="전체 멤버 랭킹">
        <div className="space-y-2">
          {memberStats.map((member, index) => (
            <div key={member.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-lg font-bold w-8 text-center">{index + 1}</span>
              <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full mx-3" />
              <div className="flex-grow">
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-onSurfaceSecondary">
                  출석률 {member.attendanceRate.toFixed(1)}% &bull; 누적 벌금: {member.totalFines.toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MembersScreen;
