import React, { useState } from 'react';
import Card from '../components/Card';
import type { Member } from '../types';
import { MOCK_MEMBERS } from '../data/mockData';

interface LoginScreenProps {
  onLoginSuccess: (user: Member) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === 'test' && password === '1111') {
      setError('');
      // 'test' user is the leader (MOCK_MEMBERS[0])
      onLoginSuccess(MOCK_MEMBERS[0]);
    } else if (id === 'test2' && password === '1111') {
      setError('');
      // 'test2' user is a regular member (MOCK_MEMBERS[1])
      onLoginSuccess(MOCK_MEMBERS[1]);
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-dark">모임 총무</h1>
          <p className="text-onSurfaceSecondary mt-2">로그인하여 모임을 관리하세요.</p>
        </div>
        <Card>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">아이디</label>
              <input
                type="text"
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="test (리더), test2 (멤버)"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="password-input" className="block text-sm font-medium text-gray-700">비밀번호</label>
              <input
                type="password"
                id="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="1111"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light">
                로그인
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
