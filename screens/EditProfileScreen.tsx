import React, { useState } from 'react';
import Card from '../components/Card';
import type { Member } from '../types';

interface EditProfileScreenProps {
  currentUser: Member;
  onSave: (updatedUser: Member) => void;
  onBack: () => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ currentUser, onSave, onBack }) => {
  const [name, setName] = useState(currentUser.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...currentUser, name });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center p-4 bg-surface border-b border-gray-200 shadow-sm">
        <button onClick={onBack} className="mr-2 p-2 rounded-full hover:bg-gray-100">
           &#x2190;
        </button>
        <div>
          <h1 className="text-xl font-bold text-onSurface">내 정보 수정</h1>
          <p className="text-sm text-onSurfaceSecondary">프로필 정보를 변경합니다.</p>
        </div>
      </header>
      <main className="p-4">
        <form onSubmit={handleSubmit}>
          <Card>
            <div className="space-y-6">
                <div className="text-center">
                    <img src={currentUser.avatarUrl} alt={name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary-light" />
                </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
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

export default EditProfileScreen;
