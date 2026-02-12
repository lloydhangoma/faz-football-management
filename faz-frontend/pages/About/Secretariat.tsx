import React from 'react';
import SectionLayout from '../../components/About/SectionLayout';

interface TeamMember {
  id: number;
  name: string;
  title: string;
  email?: string;
  image?: string;
}

const Secretariat: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Team Member 1",
      title: "Position Placeholder",
      email: "member1@faz.org.zm"
    },
    {
      id: 2,
      name: "Team Member 2",
      title: "Position Placeholder",
      email: "member2@faz.org.zm"
    },
    {
      id: 3,
      name: "Team Member 3",
      title: "Position Placeholder",
      email: "member3@faz.org.zm"
    },
    {
      id: 4,
      name: "Team Member 4",
      title: "Position Placeholder",
      email: "member4@faz.org.zm"
    },
    {
      id: 5,
      name: "Team Member 5",
      title: "Position Placeholder",
      email: "member5@faz.org.zm"
    },
    {
      id: 6,
      name: "Team Member 6",
      title: "Position Placeholder",
      email: "member6@faz.org.zm"
    },
  ];

  return (
    <SectionLayout 
      title="Secretariat"
      subtitle="Meet the FAZ Leadership Team"
    >
      <div className="space-y-8">
        {/* Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Secretariat Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            The FAZ Secretariat is the executive arm of the Football Association of Zambia, responsible for implementing the decisions of the Executive Committee and managing day-to-day operations. Our team works tirelessly to develop football across the nation.
          </p>
        </div>

        {/* Team Members Grid */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Executive Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {/* Placeholder Image */}
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <p className="text-sm">Team Member Image</p>
                  </div>
                </div>
                
                {/* Member Info */}
                <div className="p-4">
                  <h4 className="text-lg font-bold text-gray-900">{member.name}</h4>
                  <p className="text-green-600 font-semibold text-sm">{member.title}</p>
                  {member.email && (
                    <p className="text-gray-600 text-sm mt-2">
                      <a href={`mailto:${member.email}`} className="hover:text-green-600 transition">
                        {member.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Departments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Department 1</h4>
              <p className="text-gray-700 text-sm">Placeholder description of department 1 and its responsibilities.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Department 2</h4>
              <p className="text-gray-700 text-sm">Placeholder description of department 2 and its responsibilities.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Department 3</h4>
              <p className="text-gray-700 text-sm">Placeholder description of department 3 and its responsibilities.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Department 4</h4>
              <p className="text-gray-700 text-sm">Placeholder description of department 4 and its responsibilities.</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-green-900 mb-4">Contact the Secretariat</h3>
          <p className="text-gray-700">
            <strong>Address:</strong> Placeholder address<br />
            <strong>Phone:</strong> Placeholder phone number<br />
            <strong>Email:</strong> <a href="mailto:info@faz.org.zm" className="text-green-600 hover:underline">info@faz.org.zm</a>
          </p>
        </div>
      </div>
    </SectionLayout>
  );
};

export default Secretariat;
