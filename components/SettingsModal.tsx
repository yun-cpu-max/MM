import React from 'react';
import { CloseIcon } from '../constants';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLeader: boolean;
    onLeaveMeeting: () => void;
    onManageMembers: () => void;
    onEditRules: () => void;
    onEditProfile: () => void;
}

const MenuItem: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="w-full text-left px-4 py-3 text-onSurface hover:bg-gray-100 transition-colors rounded-lg flex items-center space-x-3"
    >
        {children}
    </button>
);


const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, isLeader, onLeaveMeeting, onManageMembers, onEditRules, onEditProfile }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-surface rounded-xl shadow-2xl w-full max-w-sm m-4 transform transition-all duration-300 scale-95 opacity-0 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
                style={{animation: 'scale-in 0.2s ease-out forwards'}}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold">설정</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-2">
                    <div className="space-y-1">
                        {isLeader ? (
                            <>
                                <MenuItem onClick={onManageMembers}>
                                    <span>👥</span>
                                    <span>멤버 관리</span>
                                </MenuItem>
                                <MenuItem onClick={onEditRules}>
                                    <span>⚙️</span>
                                    <span>규칙 수정</span>
                                </MenuItem>
                            </>
                        ) : (
                            <MenuItem onClick={onEditProfile}>
                                <span>👤</span>
                                <span>내 정보 수정</span>
                            </MenuItem>
                        )}
                         <MenuItem onClick={onLeaveMeeting}>
                            <span>🚪</span>
                            <span>모임 나가기</span>
                        </MenuItem>
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SettingsModal;