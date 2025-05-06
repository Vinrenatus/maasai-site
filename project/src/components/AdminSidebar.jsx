import React from 'react';

const AdminSidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { label: 'News', key: 'news' },
    { label: 'Products', key: 'products' },
    { label: 'Contacts', key: 'contacts' },
    { label: 'Warrior Applications', key: 'applications' },
    { label: 'Users', key: 'users' },
  ];

  return (
    <div className="w-64 border-r p-4">
      <ul className="space-y-4">
        {sections.map((section) => (
          <li key={section.key}>
            <button
              onClick={() => setActiveSection(section.key)}
              className={`w-full text-left px-2 py-1 rounded ${
                activeSection === section.key ? 'bg-gray-200 font-bold' : 'hover:bg-gray-100'
              }`}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
