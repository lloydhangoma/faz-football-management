import React from 'react';
import SectionLayout from '../../components/About/SectionLayout';

const President: React.FC = () => {
  return (
    <SectionLayout 
      title="President's Corner"
      subtitle="A message from the FAZ President"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* President Profile */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-20">
            <div className="bg-green-600 h-48 flex items-center justify-center">
              {/* Placeholder for president image */}
              <div className="text-white text-center">
                <p className="text-sm">President Image</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900">President Name</h3>
              <p className="text-green-600 font-semibold">FAZ President</p>
              <p className="text-sm text-gray-600 mt-2">Contact information placeholder</p>
            </div>
          </div>
        </div>

        {/* President's Message */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome Message</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Placeholder - Add the President's welcome message here. This should include insights into the current state of Zambian football, future vision, and strategic priorities.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Add more paragraphs as needed for the full message.
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-green-900 mb-3">Key Priorities</h3>
            <ul className="space-y-2">
              <li className="text-gray-700 flex items-start">
                <span className="text-green-600 mr-3">•</span>
                <span>Placeholder priority 1</span>
              </li>
              <li className="text-gray-700 flex items-start">
                <span className="text-green-600 mr-3">•</span>
                <span>Placeholder priority 2</span>
              </li>
              <li className="text-gray-700 flex items-start">
                <span className="text-green-600 mr-3">•</span>
                <span>Placeholder priority 3</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};

export default President;
