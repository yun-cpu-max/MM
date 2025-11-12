
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

export interface MeetingData {
    meeting: Meeting;
    currentUser: Member;
    members: Member[];
    sessions: MeetingSession[];
    expenses: Expense[];
    announcements: Announcement[];
    fineVote: FineVote;
}

export interface MeetingDataHook extends MeetingData {
    updateAttendance: (sessionId: string, memberId: string, status: AttendanceStatus) => void;
    addExpense: (expense: Omit<Expense, 'id'>) => void;
    addVote: (option: string) => void;
}
