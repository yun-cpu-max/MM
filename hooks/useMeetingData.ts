import { useState, useCallback, useMemo, useEffect } from 'react';
import type { MeetingDataHook, Member, MeetingSession, Expense, FineVote, Announcement, Meeting, MeetingRules, MeetingInfo, NewMeetingData } from '../types';
import { AttendanceStatus } from '../types';
import { MOCK_MEMBERS, MOCK_PENDING_MEMBERS, MOCK_MEETINGS_LIST, MOCK_SESSIONS, MOCK_EXPENSES, MOCK_ANNOUNCEMENTS, MOCK_MEETING, MOCK_FINE_VOTE } from '../data/mockData';

export const useMeetingData = (meetingId: string | null, currentUser: Member | null): MeetingDataHook => {
  const [meetings, setMeetings] = useState<MeetingInfo[]>(MOCK_MEETINGS_LIST);
  const [meeting, setMeeting] = useState<Meeting>(MOCK_MEETING);
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [pendingMembers, setPendingMembers] = useState<Member[]>(MOCK_PENDING_MEMBERS);
  const [sessions, setSessions] = useState<MeetingSession[]>(MOCK_SESSIONS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [fineVote, setFineVote] = useState<FineVote>(MOCK_FINE_VOTE);
  

  useEffect(() => {
    if (!meetingId) {
        setMeeting(MOCK_MEETING);
        return;
    };
    const selectedMeetingInfo = MOCK_MEETINGS_LIST.find(m => m.id === meetingId);
    // In a real app, you would fetch all meeting data here based on ID.
    // We are just updating the name/desc and keeping other mock data.
    setMeeting(prev => ({
      ...prev,
      name: selectedMeetingInfo?.name || '모임 선택 안됨',
      description: selectedMeetingInfo?.description || '',
    }));
    // Also reset other data to mocks for the selected meeting
    setMembers(MOCK_MEMBERS);
    setPendingMembers(MOCK_PENDING_MEMBERS);
    setSessions(MOCK_SESSIONS);
    setExpenses(MOCK_EXPENSES);
    setFineVote(MOCK_FINE_VOTE);
  }, [meetingId]);


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

  const addMeeting = useCallback((meetingData: NewMeetingData) => {
    const newMeetingInfo: MeetingInfo = {
      id: `${Date.now()}`,
      name: meetingData.name,
      description: meetingData.description
    };
    // Note: In a real app, you'd also create and store the full meeting details.
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
          setMembers(prev => [...prev, memberToApprove]);
      }
  }, [pendingMembers]);

  const rejectMember = useCallback((memberId: string) => {
      setPendingMembers(prev => prev.filter(m => m.id !== memberId));
  }, []);
  
  const finalCurrentUser = useMemo((): Member => {
    if (!currentUser) {
      return { id: 'fallback', name: 'Guest', isLeader: false, avatarUrl: '' };
    }
    const isLeader = meetingId === '1' && currentUser.id === '1';
    return {
      ...currentUser,
      isLeader,
    };
  }, [currentUser, meetingId]);


  const totalFines = useMemo(() => sessions.reduce((total, session) => {
      return total + session.attendance.reduce((sessionTotal, att) => {
          if (att.status === AttendanceStatus.Late) return sessionTotal + meeting.rules.lateFine;
          if (att.status === AttendanceStatus.Absent) return sessionTotal + meeting.rules.absentFine;
          return sessionTotal;
      }, 0)
  }, 0), [sessions, meeting.rules]);

  return {
    meeting,
    currentUser: finalCurrentUser,
    members,
    pendingMembers,
    sessions,
    expenses,
    announcements: MOCK_ANNOUNCEMENTS,
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
  };
};