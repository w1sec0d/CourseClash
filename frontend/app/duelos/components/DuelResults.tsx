interface EloChange {
  change: number;
  current: number;
  previous: number;
}

interface DuelResultsData {
  is_draw: boolean;
  player1_elo: EloChange;
  player1_rank: string;
  player1_score: number;
  player2_elo: EloChange;
  player2_rank: string;
  player2_score: number;
  winner_id: string;
  player1_id: string;
  player2_id: string;
}

interface DuelResultsProps {
  results: DuelResultsData;
  playerId: string;
  opponentId: string;
}

export function DuelResults({
  results,
  playerId,
  opponentId,
}: DuelResultsProps) {
  const isWinner = results.winner_id === playerId;
  const isPlayer1 = playerId === results.player1_id;

  const playerScore = isPlayer1 ? results.player1_score : results.player2_score;
  const opponentScore = isPlayer1
    ? results.player2_score
    : results.player1_score;
  const playerElo = isPlayer1 ? results.player1_elo : results.player2_elo;
  const opponentElo = isPlayer1 ? results.player2_elo : results.player1_elo;
  const playerRank = isPlayer1 ? results.player1_rank : results.player2_rank;
  const opponentRank = isPlayer1 ? results.player2_rank : results.player1_rank;

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-2xl w-full bg-white rounded-xl shadow-lg p-8'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-800 mb-2'>
            {results.is_draw ? '¡Empate!' : isWinner ? '¡Victoria!' : 'Derrota'}
          </h2>
          <p className='text-gray-600'>
            {results.is_draw
              ? 'Ambos jugadores han empatado'
              : isWinner
              ? '¡Has ganado el duelo!'
              : 'Tu oponente ha ganado el duelo'}
          </p>
        </div>

        <div className='grid grid-cols-2 gap-8'>
          {/* Player Stats */}
          <div className='bg-emerald-50 rounded-lg p-6'>
            <h3 className='text-xl font-semibold text-emerald-800 mb-4'>
              Tus Resultados
            </h3>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Puntuación:</span>
                <span
                  className={`font-semibold ${
                    playerScore >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {playerScore > 0 ? '+' : ''}
                  {playerScore}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Rango:</span>
                <span className='font-semibold text-emerald-800'>
                  {playerRank}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>ELO:</span>
                <div className='text-right'>
                  <span className='font-semibold text-emerald-800'>
                    {playerElo.current}
                  </span>
                  <span
                    className={`ml-2 ${
                      playerElo.change >= 0
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    }`}
                  >
                    ({playerElo.change > 0 ? '+' : ''}
                    {playerElo.change})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Opponent Stats */}
          <div className='bg-gray-50 rounded-lg p-6'>
            <h3 className='text-xl font-semibold text-gray-800 mb-4'>
              Resultados del Oponente
            </h3>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Puntuación:</span>
                <span
                  className={`font-semibold ${
                    opponentScore >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {opponentScore > 0 ? '+' : ''}
                  {opponentScore}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Rango:</span>
                <span className='font-semibold text-gray-800'>
                  {opponentRank}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>ELO:</span>
                <div className='text-right'>
                  <span className='font-semibold text-gray-800'>
                    {opponentElo.current}
                  </span>
                  <span
                    className={`ml-2 ${
                      opponentElo.change >= 0
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    }`}
                  >
                    ({opponentElo.change > 0 ? '+' : ''}
                    {opponentElo.change})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 text-center'>
          <button
            onClick={() => window.location.reload()}
            className='bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors'
          >
            Volver a Jugar
          </button>
        </div>
      </div>
    </div>
  );
}
