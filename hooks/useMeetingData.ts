import { useState, useCallback, useMemo } from 'react';
import type { MeetingDataHook, Member, MeetingSession, Expense, FineVote, Announcement, Meeting, MeetingRules, MeetingInfo, NewMeetingData } from '../types';
import { AttendanceStatus } from '../types';
import { MOCK_MEMBERS, MOCK_MEETINGS_LIST, MOCK_SESSIONS, MOCK_EXPENSES, MOCK_ANNOUNCEMENTS, MOCK_MEETING, MOCK_FINE_VOTE } from '../data/mockData';

export const useMeetingData = (meetingId: string | null, currentUser: Member | null): MeetingDataHook => {
  const [sessions, setSessions] = useState<MeetingSession[]>(MOCK_SESSIONS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [fineVote, setFineVote] = useState<FineVote>(MOCK_FINE_VOTE);
  const [meetings, setMeetings] = useState<MeetingInfo[]>(MOCK_MEETINGS_LIST);

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

  const addMeeting = useCallback((meeting: NewMeetingData) => {
    const newMeetingInfo: MeetingInfo = {
      id: `${Date.now()}`,
      name: meeting.name,
      description: meeting.description
    };
    // Note: In a real app, you'd also create and store the full meeting details.
    setMeetings(prev => [...prev, newMeetingInfo]);
  }, []);
  
  const meeting = useMemo(() => {
    if (!meetingId) return MOCK_MEETING; // Return default if no meeting is selected
    const selectedMeetingInfo = MOCK_MEETINGS_LIST.find(m => m.id === meetingId);
    return {
      ...MOCK_MEETING, // Use mock as a base for rules etc.
      name: selectedMeetingInfo?.name || '모임 선택 안됨',
      description: selectedMeetingInfo?.description || '',
    };
  }, [meetingId]);

  const finalCurrentUser = useMemo((): Member => {
    if (!currentUser) {
      // Should not happen when in a meeting, but return a fallback
      return { id: 'fallback', name: 'Guest', isLeader: false, avatarUrl: '' };
    }
    // Logic to determine if the user is a leader for the selected meeting
    // For this mock-up, user '1' is the leader of meeting '1'.
    const isLeader = meetingId === '1' && currentUser.id === '1';
    return {
      ...currentUser,
      isLeader,
    };
  }, [currentUser, meetingId]);


  const totalFines = sessions.reduce((total, session) => {
      return total + session.attendance.reduce((sessionTotal, att) => {
          if (att.status === AttendanceStatus.Late) return sessionTotal + meeting.rules.lateFine;
          if (att.status === AttendanceStatus.Absent) return sessionTotal + meeting.rules.absentFine;
          return sessionTotal;
      }, 0)
  }, 0);

  return {
    meeting,
    currentUser: finalCurrentUser,
    members: MOCK_MEMBERS,
    sessions,
    expenses,
    announcements: MOCK_ANNOUNCEMENTS,
    fineVote: {...fineVote, totalFines },
    meetings,
    updateAttendance,
    addExpense,
    addVote,
    addMeeting,
  };
};
