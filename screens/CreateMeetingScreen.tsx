import React, { useState } from 'react';
import Card from '../components/Card';
import type { NewMeetingData } from '../types';

interface CreateMeetingScreenProps {
  onMeetingCreate: (meetingData: NewMeetingData) => void;
  onCancel: () => void;
}

const CreateMeetingScreen: React.FC<CreateMeetingScreenProps> = ({ onMeetingCreate, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [lateFine, setLateFine] = useState('');
  const [absentFine, setAbsentFine] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeeting: NewMeetingData = {
      name,
      description,
      rules: {
        initialDeposit: Number(initialDeposit) || 0,
        lateFine: Number(lateFine) || 0,
        absentFine: Number(absentFine) || 0,
      }
    };
    onMeetingCreate(newMeeting);
  };
  
  const FormInput: React.FC<{label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string, required?: boolean, isNumeric?: boolean}> = 
  ({label, id, value, onChange, type = 'text', placeholder, required = false, isNumeric = false}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className={`mt-1 relative rounded-md shadow-sm ${isNumeric ? 'flex' : 'block'}`}>
            {isNumeric && <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">₩</span>}
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${isNumeric ? 'rounded-none rounded-r-md' : 'rounded-md'}`}
                required={required}
            />
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-surface border-b border-gray-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-onSurface">새 모임 생성</h1>
          <p className="text-sm text-onSurfaceSecondary">모임의 기본 정보를 설정해주세요.</p>
        </div>
      </header>
      <main className="p-4">
        <form onSubmit={handleSubmit}>
          <Card>
            <div className="space-y-6">
              <FormInput label="모임 이름" id="meeting-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 사이드 프로젝트 '모임 총무'" required />
              <FormInput label="모임 한 줄 소개" id="meeting-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="예: 모임 관리를 위한 웹 앱 개발" required />
              
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">규칙 설정</h3>
                <p className="mt-1 text-sm text-gray-500">모임 운영에 필요한 벌금 규칙을 설정합니다.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 <FormInput label="초기 보증금" id="deposit" value={initialDeposit} onChange={(e) => setInitialDeposit(e.target.value.replace(/\D/g, ''))} type="number" placeholder="20000" isNumeric />
                 <FormInput label="지각 벌금" id="late-fine" value={lateFine} onChange={(e) => setLateFine(e.target.value.replace(/\D/g, ''))} type="number" placeholder="3000" isNumeric />
                 <FormInput label="결석 벌금" id="absent-fine" value={absentFine} onChange={(e) => setAbsentFine(e.target.value.replace(/\D/g, ''))} type="number" placeholder="5000" isNumeric />
              </div>

            </div>
          </Card>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              모임 생성하기
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateMeetingScreen;