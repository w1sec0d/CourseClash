import { RequestDuelResponse } from "../../types/duel";

interface DuelInfoProps {
  duelResponse: RequestDuelResponse | null;
  error: string | null;
}

export default function DuelInfo({ duelResponse, error }: DuelInfoProps) {
  return (
    <>
      {duelResponse && (
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
          <h3 className="font-bold text-emerald-800 mb-2">Duelo Solicitado:</h3>
          <p className="text-gray-700">ID del Duelo: {duelResponse.duelId}</p>
          <p className="text-gray-700">Mensaje: {duelResponse.message}</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg">
          <h3 className="font-bold text-red-700 mb-2">Error:</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </>
  );
}
