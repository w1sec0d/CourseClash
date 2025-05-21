import React from 'react';
import TabNavigation from '@/components/TabNavigation';
import CourseStats from './CourseStats';
import CourseMetrics from './CourseMetrics';

type TabId = string;

interface CourseHeaderProps {
  title: string;
  bannerImage: string;
  ranking: string;
  progress: number;
  semester: string;
  shields: number;
  totalShields: number;
  coins: number;
  power: number;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: Array<{
    id: string;
    label: string;
  }>;
  tabColor?: string;
  textColor?: string;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  bannerImage,
  ranking,
  progress,
  semester,
  shields,
  totalShields,
  coins,
  power,
  activeTab,
  onTabChange,
  tabs,
  tabColor = 'indigo',
  textColor = 'gray-50'
}) => {
  return (
    <div>
      <div className="bg-green-500 rounded-t-lg mb-6 overflow-hidden">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          <img 
            alt="Banner del curso" 
            src={bannerImage} 
            className="object-cover opacity-60 w-full h-full"
          />
          <div className="absolute inset-0 flex items-end m-3">
            <p className="text-2xl sm:text-4xl font-bold text-white drop-shadow-lg">{title}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
            <CourseStats ranking={ranking} progress={progress} semester={semester} />
            <CourseMetrics 
              shields={shields} 
              totalShields={totalShields} 
              coins={coins} 
              power={power} 
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
            <div>
              <TabNavigation<TabId> 
                tabs={tabs as Array<{id: TabId, label: string}>}
                activeTab={activeTab as TabId}
                onTabChange={onTabChange as (tabId: TabId) => void}
                tabColor={tabColor}
                text={textColor}
              />
            </div>
          </div>
    </div>
  );
};

export default CourseHeader;
