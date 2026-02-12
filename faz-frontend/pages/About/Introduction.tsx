import React from 'react';
import SectionLayout from '../../components/About/SectionLayout';
import ContentCard from '../../components/About/ContentCard';

const Introduction: React.FC = () => {
  return (
    <SectionLayout 
      title="Introduction"
      subtitle="About the Football Association of Zambia"
    >
      <div className="space-y-6">
        <ContentCard
          title="Who We Are"
          content="The Football Association of Zambia (FAZ) is the governing body for football in Zambia. We are responsible for organizing and promoting football at all levels, from grassroots to professional competitions."
        />

        <ContentCard
          title="Our History"
          content="Placeholder content - Add detailed history of FAZ here, including founding date, key milestones, and major achievements."
        />

        <ContentCard
          title="Our Role"
          content="The FAZ oversees the national teams, domestic leagues, cup competitions, and youth development programs. We work to develop football talent and promote the sport across the nation."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg font-bold text-green-900 mb-2">Vision</h4>
            <p className="text-gray-700">Placeholder - Add FAZ vision statement here</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg font-bold text-green-900 mb-2">Values</h4>
            <p className="text-gray-700">Placeholder - Add FAZ core values here</p>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};

export default Introduction;
