
import React from 'react';
import type { MeetingDataHook, AnnouncementFile } from '../types';
import Card from '../components/Card';
import { PlusIcon } from '../constants';

interface NoticeScreenProps {
  data: MeetingDataHook;
}

const FileIcon: React.FC<{ type: AnnouncementFile['type'] }> = ({ type }) => {
    const iconClass = "w-5 h-5 text-onSurfaceSecondary";
    if (type === 'pdf') return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
    if (type === 'link') return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>;
};


const NoticeScreen: React.FC<NoticeScreenProps> = ({ data }) => {
  const { announcements, currentUser } = data;
  
  const allFiles = announcements.flatMap(a => a.files);

  return (
    <div className="p-4 space-y-6">
      <Card title="공지사항" action={
          currentUser.isLeader ? (
            <button className="bg-primary text-onPrimary p-2 rounded-full shadow-md hover:bg-primary-light">
              <PlusIcon className="w-5 h-5" />
            </button>
          ) : null
      }>
        <div className="space-y-4">
          {announcements.map(ann => (
            <details key={ann.id} className="p-4 bg-gray-50 rounded-lg group" open={ann.title.includes('리포트')}>
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                <span>{ann.title}</span>
                <span className="text-sm text-onSurfaceSecondary transition-transform transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-3 pt-3 border-t">
                <p className="text-onSurfaceSecondary whitespace-pre-wrap">{ann.content}</p>
                {ann.files.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-semibold text-sm mb-1">첨부파일</h4>
                    <ul className="space-y-1">
                      {ann.files.map(file => (
                        <li key={file.name}>
                          <a href={file.url} className="flex items-center text-blue-600 hover:underline text-sm space-x-2">
                             <FileIcon type={file.type} />
                             <span>{file.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </Card>
      
      <Card title="자료실">
        {allFiles.length > 0 ? (
           <ul className="space-y-2">
            {allFiles.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                   <FileIcon type={file.type} />
                   <span className="font-medium">{file.name}</span>
                </div>
                <a href={file.url} className="text-sm font-semibold text-primary hover:text-primary-dark">다운로드</a>
              </li>
            ))}
          </ul>
        ) : (
            <p className="text-center text-onSurfaceSecondary">공유된 파일이 없습니다.</p>
        )}
      </Card>
    </div>
  );
};

export default NoticeScreen;