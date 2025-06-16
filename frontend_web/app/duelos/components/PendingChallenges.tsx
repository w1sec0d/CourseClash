import { ChallengerInfo } from '@/components/ChallengerInfo';

interface PendingChallenge {
  duelId: string;
  requesterId: string;
  requesterName: string;
  timestamp: string;
  category?: string;
}

interface PendingChallengesProps {
  challenges: PendingChallenge[];
  onAccept: (duelId: string) => void;
  onReject: (duelId: string) => void;
  acceptLoading: boolean;
}

export default function PendingChallenges({
  challenges,
  onAccept,
  onReject,
  acceptLoading,
}: PendingChallengesProps) {
  // Mapeo de emojis para categorías
  const categoryEmojis: { [key: string]: string } = {
    matematica: "🔢",
    historia: "📚",
    geografia: "🌍",
    ciencias: "🔬",
    literatura: "📖",
    fisica: "⚛️",
    quimica: "🧪",
    biologia: "🧬",
  };

  // Función para obtener el emoji de una categoría
  const getCategoryEmoji = (categoryName?: string) => {
    if (!categoryName) return "📝";
    return categoryEmojis[categoryName] || "📝";
  };

  // Función para obtener el nombre de la categoría
  const getCategoryDisplayName = (categoryName?: string) => {
    const displayNames: { [key: string]: string } = {
      matematica: "Matemática",
      historia: "Historia", 
      geografia: "Geografía",
      ciencias: "Ciencias",
      literatura: "Literatura",
      fisica: "Física",
      quimica: "Química",
      biologia: "Biología",
    };
    if (!categoryName) return "Conocimiento General";
    return displayNames[categoryName] || categoryName;
  };

  if (challenges.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="flex items-center mb-4">
        <div className="bg-purple-100 rounded-full mr-3 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-lg font-bold text-gray-800">
          ¡Desafíos Recibidos! ({challenges.length})
        </p>
      </div>
      
      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.duelId}
            className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200 shadow-md p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-200 rounded-full mr-3 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-800 text-lg">
                      ¡Nuevo Desafío!
                    </h3>
                    <p className="text-sm text-purple-600">
                      {challenge.requesterName} te ha retado
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <ChallengerInfo 
                    requesterId={challenge.requesterId}
                    requesterName={challenge.requesterName}
                  />
                  
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 min-w-[80px]">Categoría:</span>
                    <span className="ml-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {getCategoryEmoji(challenge.category)} {getCategoryDisplayName(challenge.category)}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 min-w-[80px]">Recibido:</span>
                    <span className="ml-2 text-gray-600 text-sm">
                      {new Date(challenge.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => onAccept(challenge.duelId)}
                  disabled={acceptLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {acceptLoading ? "Aceptando..." : "Aceptar Duelo"}
                </button>
                <button
                  onClick={() => onReject(challenge.duelId)}
                  className="bg-purple-200 hover:bg-purple-300 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
