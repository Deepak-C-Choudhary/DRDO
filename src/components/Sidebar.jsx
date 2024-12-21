
// src/components/Sidebar.jsx
import { useState } from 'react';

const Sidebar = () => {
  const [expandedSections, setExpandedSections] = useState(new Set());

  const menuItems = [
    {
      title: 'Detection',
      subItems: ['Sub-section 1.1', 'Sub-section 1.2', 'Sub-section 1.3'],
    },
    {
      title: 'Enhancement',
      subItems: ['Sub-section 2.1', 'Sub-section 2.2', 'Sub-section 2.3'],
    },
    {
      title: 'Tracking',
      subItems: ['Sub-section 3.1', 'Sub-section 3.2', 'Sub-section 3.3'],
    },
  ];

  const toggleSection = (index) => {
    const newExpandedSections = new Set(expandedSections);
    if (newExpandedSections.has(index)) {
      newExpandedSections.delete(index);
    } else {
      newExpandedSections.add(index);
    }
    setExpandedSections(newExpandedSections);
  };

  return (
    <div className="w-64 bg-blue-600 text-white min-h-screen sticky top-0">
      <div className="py-4">
        <h1 className="text-xl font-bold px-6 py-3 mb-4">UW-dash</h1>
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              className="w-full text-left px-6 py-3 hover:bg-blue-700"
              onClick={() => toggleSection(index)}
            >
              {item.title}
            </button>
            {expandedSections.has(index) && (
              <div className="bg-blue-700">
                {item.subItems.map((subItem, subIndex) => (
                  <button
                    key={subIndex}
                    className="w-full text-left px-8 py-2 hover:bg-blue-800"
                  >
                    {subItem}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
