interface PendingChallenge {
  duelId: string;
  requesterId: string;
  requesterName: string;
  timestamp: string;
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
  if (challenges.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <p className="font-semibold text-gray-700 mb-2">Desafíos Pendientes</p>
      <div className="space-y-3">
        {challenges.map((challenge) => (
          <div
            key={challenge.duelId}
            className="justify-between items-center bg-emerald-50 rounded-lg flex p-3"
          >
            <div className="items-center flex">
              <div>
                <p className="font-medium text-gray-800">¡Desafío recibido!</p>
                <p className="text-xs text-gray-500">ID: {challenge.duelId}</p>
                <p className="text-xs text-gray-500">
                  Recibido: {new Date(challenge.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onAccept(challenge.duelId)}
                disabled={acceptLoading}
                className="hover:bg-emerald-600 bg-emerald-500 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50"
              >
                {acceptLoading ? "Aceptando..." : "Aceptar"}
              </button>
              <button
                onClick={() => onReject(challenge.duelId)}
                className="hover:bg-gray-300 bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
              >
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
