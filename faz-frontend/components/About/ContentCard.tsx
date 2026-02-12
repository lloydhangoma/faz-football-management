import React from 'react';

interface ContentCardProps {
  title: string;
  content: string | React.ReactNode;
  icon?: React.ReactNode;
}

const ContentCard: React.FC<ContentCardProps> = ({ title, content, icon }) => {
  return (
    <div className="bg-white border-l-4 border-green-600 p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-start gap-4">
        {icon && <div className="text-green-600 flex-shrink-0">{icon}</div>}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <div className="text-gray-700 leading-relaxed">
            {typeof content === 'string' ? <p>{content}</p> : content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
