import React from 'react';

interface Tab<TabId> {
  id: TabId;
  label: string;
}

interface TabNavigationProps<TabId> {
  tabs: Tab<TabId>[];
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  tabColor?: string;
  text?: string;
}

const TabNavigation = <TabId extends string>({
  tabs,
  activeTab,
  onTabChange,
  tabColor = "indigo",
  text = "gray-500"
}: TabNavigationProps<TabId>) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? `border-${tabColor}-500 text-${tabColor}-500`
                : `border-transparent text-${text} hover:text-${text}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
