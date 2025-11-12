
import { useState, useCallback } from 'react';
import type { MeetingDataHook, Member, MeetingSession, Expense, FineVote, Announcement, Meeting, MeetingRules } from '../types';
import { AttendanceStatus } from '../types';

const MOCK_MEMBERS: Member[] = [
  { id: '1', name: '김민준', isLeader: true, avatarUrl: 'https://picsum.photos/seed/1/200' },
  { id: '2', name: '이서연', isLeader: false, avatarUrl: 'https://picsum.photos/seed/2/200' },
  { id: '3', name: '박도윤', isLeader: false, avatarUrl: 'https://picsum.photos/seed/3/200' },
  { id: '4', name: '최지우', isLeader: false, avatarUrl: 'https://picsum.photos/seed/4/200' },
  { id: '5', name: '정하은', isLeader: false, avatarUrl: 'https://picsum.photos/seed/5/200' },
];

const MOCK_SESSIONS: MeetingSession[] = [
  { id: 's1', date: '2024-07-15', topic: '1주차: 프로젝트 기획', attendance: [
    { memberId: '1', status: AttendanceStatus.Present },
    { memberId: '2', status: AttendanceStatus.Present },
    { memberId: '3', status: AttendanceStatus.Late },
    { memberId: '4', status: AttendanceStatus.Present },
    { memberId: '5', status: AttendanceStatus.Absent },
  ]},
  { id: 's2', date: '2024-07-22', topic: '2주차: UI/UX 디자인', attendance: [
    { memberId: '1', status: AttendanceStatus.Present },
    { memberId: '2', status: AttendanceStatus.Present },
    { memberId: '3', status: AttendanceStatus.Present },
    { memberId: '4', status: AttendanceStatus.Late },
    { memberId: '5', status: AttendanceStatus.Present },
  ]},
  { id: 's3', date: '2024-07-29', topic: '3주차: 프론트엔드 개발', attendance: [
    { memberId: '1', status: AttendanceStatus.Present },
    { memberId: '2', status: AttendanceStatus.Late },
    { memberId: '3', status: AttendanceStatus.Present },
    { memberId: '4', status: AttendanceStatus.Present },
    { memberId: '5', status: AttendanceStatus.Present },
  ]},
  { id: 's4', date: '2024-08-05', topic: '4주차: 백엔드 개발', attendance: [
    { memberId: '1', status: AttendanceStatus.Pending },
    { memberId: '2', status: AttendanceStatus.Pending },
    { memberId: '3', status: AttendanceStatus.Pending },
    { memberId: '4', status: AttendanceStatus.Pending },
    { memberId: '5', status: AttendanceStatus.Pending },
  ]},
];

const MOCK_EXPENSES: Expense[] = [
    { id: 'e1', description: '스터디룸 대여 (3시간)', amount: 25000, date: '2024-07-15', receiptUrl: 'https://picsum.photos/seed/receipt1/400/600', paidByMemberId: '1' },
    { id: 'e2', description: '커피 및 간식', amount: 18500, date: '2024-07-22', receiptUrl: 'https://picsum.photos/seed/receipt2/400/600', paidByMemberId: '2' },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
    { id: 'a1', title: '다음 주 발표 순서 공지', content: '다음 주 발표는 최지우님, 정하은님 순서로 진행됩니다. 자료는 미리 공유해주세요.', date: '2024-07-25', files: [{ name: '발표가이드.pdf', url: '#', type: 'pdf' }] },
    { id: 'a2', title: '프로젝트 중간 점검', content: '이번 주 금요일까지 각자 맡은 파트 진행 상황 노션에 업데이트 바랍니다.', date: '2024-07-23', files: [{ name: '프로젝트 노션 링크', url: '#', type: 'link' }] },
];

const MOCK_RULES: MeetingRules = {
  initialDeposit: 20000,
  lateFine: 3000,
  absentFine: 5000,
};

const MOCK_MEETING: Meeting = {
    name: '사이드 프로젝트 "모임 총무"',
    description: '모임 관리를 위한 웹 앱 개발 스터디',
    rules: MOCK_RULES,
};

const MOCK_FINE_VOTE: FineVote = {
    topic: '누적된 벌금, 어디에 사용할까요?',
    options: [
        { option: '프로젝트 종료 후 회식비', votes: 3 },
        { option: '스터디 간식비로 사용', votes: 1 },
        { option: '부족한 스터디 비품 구매', votes: 0 },
    ],
    totalFines: 0 // Will be calculated
};


export const useMeetingData = (): MeetingDataHook => {
  const [sessions, setSessions] = useState<MeetingSession[]>(MOCK_SESSIONS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [fineVote, setFineVote] = useState<FineVote>(MOCK_FINE_VOTE);

  const updateAttendance = useCallback((sessionId: string, memberId: string, status: AttendanceStatus) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? {
              ...session,
              attendance: session.attendance.map(att =>
                att.memberId === memberId ? { ...att, status } : att
              ),
            }
          : session
      )
    );
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
      setExpenses(prev => [...prev, { ...expense, id: `e${Date.now()}` }]);
  }, []);

  const addVote = useCallback((option: string) => {
      setFineVote(prev => ({
          ...prev,
          options: prev.options.map(o => o.option === option ? { ...o, votes: o.votes + 1 } : o)
      }));
  }, []);

  const totalFines = sessions.reduce((total, session) => {
      return total + session.attendance.reduce((sessionTotal, att) => {
          if (att.status === AttendanceStatus.Late) return sessionTotal + MOCK_RULES.lateFine;
          if (att.status === AttendanceStatus.Absent) return sessionTotal + MOCK_RULES.absentFine;
          return sessionTotal;
      }, 0)
  }, 0);

  return {
    meeting: MOCK_MEETING,
    currentUser: MOCK_MEMBERS[0],
    members: MOCK_MEMBERS,
    sessions,
    expenses,
    announcements: MOCK_ANNOUNCEMENTS,
    fineVote: {...fineVote, totalFines },
    updateAttendance,
    addExpense,
    addVote,
  };
};
