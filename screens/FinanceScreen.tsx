
import React from 'react';
import type { MeetingDataHook } from '../types';
// FIX: Import AttendanceStatus to resolve 'Cannot find name' error.
import { AttendanceStatus } from '../types';
import Card from '../components/Card';
import { PlusIcon } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface FinanceScreenProps {
  data: MeetingDataHook;
}

const FinanceScreen: React.FC<FinanceScreenProps> = ({ data }) => {
  const { expenses, fineVote, members, currentUser, addVote, settleCurrentPeriod } = data;
  
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const costPerMember = members.length > 0 ? totalExpenses / members.length : 0;
  
  const voteData = fineVote.options.map(o => ({ name: o.option, 투표수: o.votes }));
  
  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
          <p className="text-sm text-onSurfaceSecondary">이번 주기 N빵 총액</p>
          <p className="text-2xl font-bold text-primary-dark">{totalExpenses.toLocaleString()}원</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-onSurfaceSecondary">1인당 부담액</p>
          <p className="text-2xl font-bold text-onSurface">{costPerMember.toLocaleString()}원</p>
        </Card>
      </div>

      <Card title="이번 주기 공동 회비 사용 내역" action={
        <button className="bg-primary text-onPrimary p-2 rounded-full shadow-md hover:bg-primary-light">
          <PlusIcon className="w-5 h-5" />
        </button>
      }>
        {expenses.length > 0 ? (
            <ul className="space-y-3">
            {expenses.map(exp => {
                const payer = members.find(m => m.id === exp.paidByMemberId);
                return (
                <li key={exp.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                    <p className="font-semibold">{exp.description}</p>
                    <p className="text-sm text-onSurfaceSecondary">{exp.date} &bull; {payer?.name} 결제</p>
                    </div>
                    <div className="text-right">
                    <p className="font-bold text-lg">{exp.amount.toLocaleString()}원</p>
                    {exp.receiptUrl && <a href={exp.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">영수증 보기</a>}
                    </div>
                </li>
                );
            })}
            </ul>
        ) : (
            <p className="text-center text-onSurfaceSecondary py-4">이번 주기에 등록된 지출 내역이 없습니다.</p>
        )}
      </Card>
      
      <Card title={`💰 누적 벌금 사용 투표 (${fineVote.totalFines.toLocaleString()}원)`}>
        <p className="text-onSurfaceSecondary mb-4">{fineVote.topic}</p>
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={voteData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
              <Tooltip formatter={(value) => `${value}표`}/>
              <Legend />
              <Bar dataKey="투표수" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col space-y-2">
          {fineVote.options.map(option => (
            <button
              key={option.option}
              onClick={() => addVote(option.option)}
              className="w-full text-left p-3 border rounded-lg hover:bg-primary-light/10 hover:border-primary transition-colors flex justify-between items-center"
            >
              <span>{option.option}</span>
              <span className="font-bold text-primary">{option.votes}표</span>
            </button>
          ))}
        </div>
      </Card>

       <Card title="주기별 정산">
        {currentUser.isLeader ? (
            <>
                <p className="text-onSurfaceSecondary mb-4">이번 주기를 마감하고, 멤버별 환급액 리포트를 생성하여 공지사항에 자동으로 게시합니다.</p>
                <button 
                    onClick={settleCurrentPeriod}
                    className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                    disabled={expenses.length === 0 && !data.sessions.some(s => s.attendance.some(a => a.status !== AttendanceStatus.Present && a.status !== AttendanceStatus.Pending))}
                >
                    이번 주기 정산 및 리포트 생성
                </button>
            </>
        ) : (
            <p className="text-onSurfaceSecondary text-center py-4">정산이 마감되면 모임장이 공지사항에 리포트를 공유합니다.</p>
        )}
      </Card>
    </div>
  );
};

export default FinanceScreen;