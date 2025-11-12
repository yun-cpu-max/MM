import React from 'react';
import type { Member } from '../types';
import Card from '../components/Card';

interface ManageMembersScreenProps {
  members: Member[];
  pendingMembers: Member[];
  currentUser: Member;
  onRemoveMember: (memberId: string) => void;
  onApproveMember: (memberId: string) => void;
  onRejectMember: (memberId: string) => void;
  onBack: () => void;
}

const ManageMembersScreen: React.FC<ManageMembersScreenProps> = ({ members, pendingMembers, currentUser, onRemoveMember, onApproveMember, onRejectMember, onBack }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center p-4 bg-surface border-b border-gray-200 shadow-sm">
        <button onClick={onBack} className="mr-2 p-2 rounded-full hover:bg-gray-100">
           &#x2190;
        </button>
        <div>
          <h1 className="text-xl font-bold text-onSurface">멤버 관리</h1>
          <p className="text-sm text-onSurfaceSecondary">멤버를 관리하거나 초대 코드를 공유하세요.</p>
        </div>
      </header>
      <main className="p-4 space-y-6">
        {currentUser.isLeader && pendingMembers.length > 0 && (
            <Card title={`승인 대기 중인 멤버 (${pendingMembers.length})`}>
                 <div className="space-y-2">
                    {pendingMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                                <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full mr-3" />
                                <p className="font-semibold">{member.name}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onApproveMember(member.id)}
                                    className="px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 border border-green-200 rounded-md hover:bg-green-200 transition-colors"
                                >
                                    수락
                                </button>
                                <button
                                    onClick={() => onRejectMember(member.id)}
                                    className="px-3 py-1 text-sm font-semibold text-red-700 bg-red-100 border border-red-200 rounded-md hover:bg-red-200 transition-colors"
                                >
                                    거절
                                </button>
                            </div>
                        </div>
                    ))}
                 </div>
            </Card>
        )}
        <Card title={`현재 멤버 (${members.length})`}>
          <div className="space-y-2">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                     <p className="font-semibold">{member.name} {member.id === currentUser.id && '(나)'}</p>
                     {member.isLeader && <p className="text-xs text-primary font-semibold">모임장</p>}
                  </div>
                </div>
                {currentUser.isLeader && member.id !== currentUser.id && (
                  <button
                    onClick={() => onRemoveMember(member.id)}
                    className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-100 border border-red-200 rounded-md hover:bg-red-200 transition-colors"
                  >
                    강퇴
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
         <Card title="멤버 초대">
             <div className="space-y-3 text-center">
                <p className="text-onSurfaceSecondary">새로운 멤버를 초대하기 위한 코드 또는 링크입니다.</p>
                <div>
                    <p className="text-sm text-gray-500">초대 코드</p>
                    <p className="text-2xl font-mono tracking-widest bg-gray-100 p-2 rounded-lg">KICKOFF7</p>
                </div>
                <button className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors">
                    초대 링크 복사하기
                </button>
             </div>
        </Card>
      </main>
    </div>
  );
};

export default ManageMembersScreen;