import React, { useState } from 'react';
import Card from '../components/Card';
import type { MeetingRules } from '../types';

interface EditRulesScreenProps {
  currentRules: MeetingRules;
  onSave: (newRules: MeetingRules) => void;
  onBack: () => void;
}

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


const EditRulesScreen: React.FC<EditRulesScreenProps> = ({ currentRules, onSave, onBack }) => {
  const [rules, setRules] = useState(currentRules);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRules(prev => ({ ...prev, [id]: Number(value.replace(/\D/g, '')) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(rules);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center p-4 bg-surface border-b border-gray-200 shadow-sm">
        <button onClick={onBack} className="mr-2 p-2 rounded-full hover:bg-gray-100">
           &#x2190;
        </button>
        <div>
          <h1 className="text-xl font-bold text-onSurface">규칙 수정</h1>
          <p className="text-sm text-onSurfaceSecondary">모임의 벌금 규칙을 변경합니다.</p>
        </div>
      </header>
      <main className="p-4">
        <form onSubmit={handleSubmit}>
          <Card>
            <div className="space-y-6">
              <FormInput label="초기 보증금" id="initialDeposit" value={String(rules.initialDeposit)} onChange={handleChange} type="number" placeholder="20000" isNumeric />
              <FormInput label="지각 벌금" id="lateFine" value={String(rules.lateFine)} onChange={handleChange} type="number" placeholder="3000" isNumeric />
              <FormInput label="결석 벌금" id="absentFine" value={String(rules.absentFine)} onChange={handleChange} type="number" placeholder="5000" isNumeric />
            </div>
          </Card>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              저장하기
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditRulesScreen;
