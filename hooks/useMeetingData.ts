import { useState, useCallback, useMemo, useEffect } from 'react';
import type { MeetingDataHook, Member, MeetingSession, Expense, FineVote, Announcement, Meeting, MeetingRules, MeetingInfo, NewMeetingData, SettlementPeriod } from '../types';
import { AttendanceStatus } from '../types';
import { MOCK_MEMBERS, MOCK_PENDING_MEMBERS, MOCK_MEETINGS_LIST, MOCK_ANNOUNCEMENTS, MOCK_MEETING, MOCK_FINE_VOTE, MOCK_PERIODS } from '../data/mockData';

export const useMeetingData = (meetingId: string | null, currentUser: Member | null): MeetingDataHook => {
  const [meetings, setMeetings] = useState<MeetingInfo[]>(MOCK_MEETINGS_LIST);
  const [meeting, setMeeting] = useState<Meeting>(MOCK_MEETING);
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [pendingMembers, setPendingMembers] = useState<Member[]>(MOCK_PENDING_MEMBERS);
  const [periods, setPeriods] = useState<SettlementPeriod[]>(MOCK_PERIODS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [fineVote, setFineVote] = useState<FineVote>(MOCK_FINE_VOTE);
  
  const activePeriod = useMemo(() => periods.find(p => !p.isSettled), [periods]);
  
  useEffect(() => {
    if (!meetingId) {
        setMeeting(MOCK_MEETING);
        return;
    };
    const selectedMeetingInfo = MOCK_MEETINGS_LIST.find(m => m.id === meetingId);
    setMeeting(prev => ({
      ...prev,
      name: selectedMeetingInfo?.name || '모임 선택 안됨',
      description: selectedMeetingInfo?.description || '',
    }));
    setMembers(MOCK_MEMBERS);
    setPendingMembers(MOCK_PENDING_MEMBERS);
    setPeriods(MOCK_PERIODS);
    setAnnouncements(MOCK_ANNOUNCEMENTS);
    setFineVote(MOCK_FINE_VOTE);
  }, [meetingId]);


  const updateAttendance = useCallback((sessionId: string, memberId: string, status: AttendanceStatus) => {
    setPeriods(prevPeriods => prevPeriods.map(p => {
        if (!p.isSettled) {
            return {
                ...p,
                sessions: p.sessions.map(session =>
                    session.id === sessionId
                        ? { ...session, attendance: session.attendance.map(att => att.memberId === memberId ? { ...att, status } : att) }
                        : session
                )
            };
        }
        return p;
    }));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
      setPeriods(prevPeriods => prevPeriods.map(p => {
          if (!p.isSettled) {
              return { ...p, expenses: [...p.expenses, { ...expense, id: `e${Date.now()}` }] };
          }
          return p;
      }));
  }, []);

  const addVote = useCallback((option: string) => {
      setFineVote(prev => ({
          ...prev,
          options: prev.options.map(o => o.option === option ? { ...o, votes: o.votes + 1 } : o)
      }));
  }, []);

  const addMeeting = useCallback((meetingData: NewMeetingData) => {
    const newMeetingInfo: MeetingInfo = {
      id: `${Date.now()}`,
      name: meetingData.name,
      description: meetingData.description
    };
    setMeetings(prev => [...prev, newMeetingInfo]);
  }, []);

  const updateMeetingRules = useCallback((newRules: MeetingRules) => {
    setMeeting(prev => ({ ...prev, rules: newRules }));
  }, []);

  const updateMember = useCallback((memberId: string, updatedData: Partial<Pick<Member, 'name'>>) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ...updatedData } : m));
  }, []);

  const removeMember = useCallback((memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  }, []);

  const approveMember = useCallback((memberId: string) => {
      const memberToApprove = pendingMembers.find(m => m.id === memberId);
      if (memberToApprove) {
          setPendingMembers(prev => prev.filter(m => m.id !== memberId));
          setMembers(prev => [...prev, { ...memberToApprove, balance: meeting.rules.initialDeposit }]);
      }
  }, [pendingMembers, meeting.rules.initialDeposit]);

  const rejectMember = useCallback((memberId: string) => {
      setPendingMembers(prev => prev.filter(m => m.id !== memberId));
  }, []);
  
  const addAnnouncement = useCallback((title: string, content: string) => {
    const newAnnouncement: Announcement = {
      id: `a${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      files: []
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  }, []);

  const settleCurrentPeriod = useCallback(() => {
    if (!activePeriod) return;

    const settledSessions = activePeriod.sessions.filter(s => s.attendance.some(a => a.status !== AttendanceStatus.Pending));
    const totalExpenses = activePeriod.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const costPerMember = members.length > 0 ? totalExpenses / members.length : 0;

    const memberDetails = members.map(member => {
      const fines = settledSessions.reduce((total, session) => {
        const att = session.attendance.find(a => a.memberId === member.id);
        if (att?.status === AttendanceStatus.Late) return total + meeting.rules.lateFine;
        if (att?.status === AttendanceStatus.Absent) return total + meeting.rules.absentFine;
        return total;
      }, 0);
      const newBalance = member.balance - fines - costPerMember;
      return { ...member, fines, newBalance };
    });
    
    const now = new Date();
    const reportTitle = `${now.getFullYear()}년 ${now.getMonth() + 1}월 정산 리포트`;
    const reportContent = `
## ${activePeriod.name} 정산 내역

**총 지출:** ${totalExpenses.toLocaleString()}원
**1인당 부담액:** ${costPerMember.toLocaleString()}원

---

### 멤버별 정산 상세

${memberDetails.map(m => `- **${m.name}**: (시작 ${m.balance.toLocaleString()}원) - (벌금 ${m.fines.toLocaleString()}원) - (N빵 ${costPerMember.toLocaleString()}원) = **새 잔액: ${m.newBalance.toLocaleString()}원**`).join('\n')}
    `;
    
    addAnnouncement(reportTitle, reportContent);

    setMembers(memberDetails.map(({ id, name, isLeader, avatarUrl, newBalance }) => ({ id, name, isLeader, avatarUrl, balance: newBalance })));

    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const newPeriod: SettlementPeriod = {
      id: `p-${Date.now()}`,
      name: `${nextMonth.getFullYear()}년 ${nextMonth.getMonth() + 1}월 정산`,
      startDate: nextMonth.toISOString().split('T')[0],
      endDate: null,
      sessions: [],
      expenses: [],
      isSettled: false
    };

    setPeriods(prev => [...prev.map(p => p.id === activePeriod.id ? { ...p, isSettled: true, endDate: now.toISOString().split('T')[0] } : p), newPeriod]);

  }, [activePeriod, members, meeting.rules, addAnnouncement]);

  const finalCurrentUser = useMemo((): Member => {
    if (!currentUser) {
      return { id: 'fallback', name: 'Guest', isLeader: false, avatarUrl: '', balance: 0 };
    }
    const currentMemberData = members.find(m => m.id === currentUser.id) || currentUser;
    const isLeader = meetingId === '1' && currentUser.id === '1';
    return {
      ...currentMemberData,
      isLeader,
    };
  }, [currentUser, members, meetingId]);

  const allSessions = useMemo(() => periods.flatMap(p => p.sessions), [periods]);

  const totalFines = useMemo(() => allSessions.reduce((total, session) => {
      return total + session.attendance.reduce((sessionTotal, att) => {
          if (att.status === AttendanceStatus.Late) return sessionTotal + meeting.rules.lateFine;
          if (att.status === AttendanceStatus.Absent) return sessionTotal + meeting.rules.absentFine;
          return sessionTotal;
      }, 0)
  }, 0), [allSessions, meeting.rules]);

  return {
    meeting,
    currentUser: finalCurrentUser,
    members,
    pendingMembers,
    periods,
    sessions: activePeriod?.sessions || [],
    allSessions,
    expenses: activePeriod?.expenses || [],
    announcements,
    fineVote: {...fineVote, totalFines },
    meetings,
    updateAttendance,
    addExpense,
    addVote,
    addMeeting,
    updateMeetingRules,
    updateMember,
    removeMember,
    approveMember,
    rejectMember,
    addAnnouncement,
    settleCurrentPeriod,
  };
};