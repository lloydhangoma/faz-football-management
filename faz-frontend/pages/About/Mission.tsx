import React from 'react';
import SectionLayout from '../../components/About/SectionLayout';
import ContentCard from '../../components/About/ContentCard';

const Mission: React.FC = () => {
  return (
    <SectionLayout 
      title="Mission Statement"
      subtitle="Our Commitment to Football in Zambia"
    >
      <div className="space-y-8">
        {/* Main Mission Statement */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg border-2 border-green-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-800 leading-relaxed font-semibold">
            Placeholder - Add the FAZ's formal mission statement here. This should articulate the organization's core purpose and fundamental reason for existence.
          </p>
        </div>

        {/* Vision Section */}
        <ContentCard
          title="Vision"
          content="Placeholder - Add FAZ's vision statement describing the long-term aspirations and desired future state of football in Zambia."
        />

        {/* Core Objectives */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Core Objectives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContentCard
              title="Excellence"
              content="Promote excellence in football at all levels, from grassroots development to professional competition."
            />
            <ContentCard
              title="Development"
              content="Foster the development of football talent and infrastructure across the nation."
            />
            <ContentCard
              title="Integrity"
              content="Maintain the highest standards of integrity, fairness, and transparency in all football activities."
            />
            <ContentCard
              title="Accessibility"
              content="Ensure football is accessible to all Zambians, regardless of background or circumstance."
            />
          </div>
        </div>

        {/* Strategic Pillars */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Strategic Pillars</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-green-600 bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold text-gray-900 mb-2">1. Pillar One</h4>
              <p className="text-gray-700">Placeholder description of the first strategic pillar.</p>
            </div>
            <div className="border-l-4 border-green-600 bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold text-gray-900 mb-2">2. Pillar Two</h4>
              <p className="text-gray-700">Placeholder description of the second strategic pillar.</p>
            </div>
            <div className="border-l-4 border-green-600 bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold text-gray-900 mb-2">3. Pillar Three</h4>
              <p className="text-gray-700">Placeholder description of the third strategic pillar.</p>
            </div>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};

export default Mission;
