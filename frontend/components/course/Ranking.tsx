import { RankingProps } from '../../app/curso/types';

interface RankingCardProps {
  ranking: RankingProps[];
}

const RankingCard: React.FC<RankingCardProps> = ({ ranking }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Top 5 estudiantes</h3>
        <button className="text-blue-500 hover:text-blue-700">Ver todos</button>
      </div>
      <div className="space-y-4">
        {ranking.map((user) => (
          <div key={user.id} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                Nivel {user.level}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                XP: {user.xp}
              </span>
              <span className="text-sm text-gray-500">
                {user.completedTasks}/{user.totalTasks}
              </span>
            </div>
            <div className="flex-shrink-0">
              {user.trend === 'up' && (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {user.trend === 'down' && (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              {user.trend === 'stable' && (
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingCard;
