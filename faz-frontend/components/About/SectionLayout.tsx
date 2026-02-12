import React from 'react';

interface SectionLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const SectionLayout: React.FC<SectionLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-900 to-green-800 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-green-100 text-lg">{subtitle}</p>}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </div>
    </div>
  );
};

export default SectionLayout;
