export type AppState = 'login' | 'meetingList' | 'inMeeting' | 'createMeeting' | 'manageMembers' | 'editRules' | 'editProfile';

export type Screen = 'home' | 'attendance' | 'finance' | 'notice' | 'members';

export enum AttendanceStatus {
  Present = 'present',
  Late = 'late',
  Absent = 'absent',
  Pending = 'pending'
}

export interface Member {
  id: string;
  name: string;
  isLeader: boolean;
  avatarUrl: string;
  balance: number;
}

export interface MeetingSession {
  id: string;
  date: string; // YYYY-MM-DD
  topic: string;
  attendance: { memberId: string; status: AttendanceStatus }[];
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  receiptUrl: string | null;
  paidByMemberId: string;
}

export interface AnnouncementFile {
  name: string;
  url: string;
  type: 'pdf' | 'link' | 'file';
}
export interface Announcement {
  id:string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  files: AnnouncementFile[];
}

export interface FineVote {
  topic: string;
  options: { option: string; votes: number }[];
  totalFines: number;
}

export interface MeetingRules {
  initialDeposit: number;
  lateFine: number;
  absentFine: number;
}
export interface Meeting {
  name: string;
  description: string;
  rules: MeetingRules;
}

export interface MeetingInfo {
    id: string;
    name: string;
    description: string;
}

export interface NewMeetingData {
    name: string;
    description: string;
    rules: MeetingRules;
}

export interface SettlementPeriod {
    id: string;
    name: string;
    startDate: string;
    endDate: string | null;
    sessions: MeetingSession[];
    expenses: Expense[];
    isSettled: boolean;
}

export interface MeetingData {
    meeting: Meeting;
    currentUser: Member;
    members: Member[];
    pendingMembers: Member[];
    periods: SettlementPeriod[];
    sessions: MeetingSession[]; // Active period sessions
    allSessions: MeetingSession[]; // All sessions from all periods
    expenses: Expense[]; // Active period expenses
    announcements: Announcement[];
    fineVote: FineVote;
    meetings: MeetingInfo[];
}

export interface MeetingDataHook extends MeetingData {
    updateAttendance: (sessionId: string, memberId: string, status: AttendanceStatus) => void;
    addExpense: (expense: Omit<Expense, 'id'>) => void;
    addVote: (option: string) => void;
    addMeeting: (meeting: NewMeetingData) => void;
    updateMeetingRules: (newRules: MeetingRules) => void;
    updateMember: (memberId: string, updatedData: Partial<Pick<Member, 'name'>>) => void;
    removeMember: (memberId: string) => void;
    approveMember: (memberId: string) => void;
    rejectMember: (memberId: string) => void;
    addAnnouncement: (title: string, content: string) => void;
    settleCurrentPeriod: () => void;
}