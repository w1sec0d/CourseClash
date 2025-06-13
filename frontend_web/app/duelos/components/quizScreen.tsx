import { useState, useEffect } from "react";
import { Question } from "./Question";
import { DuelHeader } from "./DuelHeader";
import { DuelResults } from "./DuelResults";
// import { PowerUps } from './PowerUps';
// import { StreakAlert } from './StreakAlert';

interface QuestionData {
  id: string;
  text: string;
  answer: string;
  options: string[];
}

interface DuelResultsData {
  is_draw: boolean;
  player1_id: string;
  player2_id: string;
  player1_elo: {
    change: number;
    current: number;
    previous: number;
  };
  player1_rank: string;
  player1_score: number;
  player2_elo: {
    change: number;
    current: number;
    previous: number;
  };
  player2_rank: string;
  player2_score: number;
  winner_id: string;
}

interface QuizScreenProps {
  wsConnection: WebSocket | null;
  playerId: string;
  opponentId: string;
  onExit?: () => void;
}

export default function QuizScreen({
  wsConnection,
  playerId,
  opponentId,
  onExit,
}: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(
    null
  );
  const [isWaiting, setIsWaiting] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [playerProgress, setPlayerProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [totalQuestions] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [duelResults, setDuelResults] = useState<DuelResultsData | null>(null);

  useEffect(() => {
    if (!wsConnection) return;

    console.log(`[${playerId}] Setting up WebSocket message handler`);
    console.log(
      `[${playerId}] WebSocket readyState: ${wsConnection.readyState}`
    );
    setIsInitializing(false); // Mark as initialized once we have a connection

    const handleMessage = (event: MessageEvent) => {
      try {
        console.log(`[${playerId}] Raw WebSocket message:`, event.data);
        console.log(`[${playerId}] Message type:`, typeof event.data);

        // Handle plain text messages
        if (typeof event.data === "string" && !event.data.startsWith("{")) {
          console.log(`[${playerId}] Received text message:`, event.data);

          if (event.data.includes("Esperando al oponente")) {
            setIsWaiting(true);
            setError(null);
          } else if (
            event.data === "¡Oponente conectado! El duelo comenzará pronto." ||
            event.data === "¡Duelo listo!"
          ) {
            console.log(
              `[${playerId}] Both players connected, waiting for first question...`
            );
            setIsWaiting(true);
            setError(null);
          }
          return;
        }

        // Handle JSON messages
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        console.log(`[${playerId}] Parsed WebSocket message:`, data);

        if (data.type === "question") {
          console.log(`[${playerId}] Received question, starting quiz!`);
          setIsWaiting(false);
          setCurrentQuestion(data.data);
          setError(null);
          // Update opponent progress when new question arrives
          setOpponentProgress((prev) => Math.min(prev + 1, totalQuestions) - 1);
        } else if (data.type === "opponent_progress") {
          console.log("Opponent progress update:", data.progress);
          setOpponentProgress(data.progress);
          // If opponent has finished all questions, show waiting message
          if (data.progress >= totalQuestions) {
            setError("Tu oponente ha terminado. Esperando tus respuestas...");
          }
        } else if (data.type === "duel_end") {
          console.log("Duel end message received:", data);
          setDuelResults(data.data);
          console.log("Duel results state set to:", data.data);
        } else if (data.type === "error") {
          setError(data.message);
        } else {
          console.log("Unknown message type:", data.type);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
        console.error("Raw message that caused error:", event.data);
        setError("Error al procesar el mensaje del servidor");
      }
    };

    // Add more event listeners for debugging
    const handleOpen = () => {
      console.log(`[${playerId}] WebSocket connection opened`);
    };

    const handleClose = (event: CloseEvent) => {
      console.log(
        `[${playerId}] WebSocket connection closed:`,
        event.code,
        event.reason
      );
      setError("Conexión perdida con el servidor");
    };

    const handleError = (error: Event) => {
      console.error(`[${playerId}] WebSocket error:`, error);
      setError("Error en la conexión WebSocket");
    };

    wsConnection.addEventListener("message", handleMessage);
    wsConnection.addEventListener("open", handleOpen);
    wsConnection.addEventListener("close", handleClose);
    wsConnection.addEventListener("error", handleError);

    // // Send a ping message to test the connection
    // if (wsConnection.readyState === WebSocket.OPEN) {
    //   console.log(`[${playerId}] Sending ping message to test connection`);
    //   wsConnection.send(JSON.stringify({ type: 'ping', playerId }));
    // }

    return () => {
      console.log(`[${playerId}] Cleaning up WebSocket connection`);
      wsConnection.removeEventListener("message", handleMessage);
      wsConnection.removeEventListener("open", handleOpen);
      wsConnection.removeEventListener("close", handleClose);
      wsConnection.removeEventListener("error", handleError);
    };
  }, [wsConnection, playerId]);

  const handleAnswerSelect = (selectedOption: string) => {
    if (!wsConnection || !currentQuestion) return;

    try {
      wsConnection.send(
        JSON.stringify({
          type: "answer",
          questionId: currentQuestion.id,
          answer: selectedOption,
        })
      );

      setPlayerProgress((prev) => prev + 1);
      setError(null);
    } catch (err) {
      console.error("Error sending answer:", err);
      setError("Error al enviar la respuesta");
    }
  };

  if (duelResults) {
    console.log("Rendering duel results:", duelResults);
    return (
      <div className="min-h-screen">
        <DuelResults
          results={duelResults}
          playerId={playerId}
          opponentId={opponentId}
          onExit={onExit}
        />
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Inicializando duelo...
          </h2>
          <p className="text-gray-500 mt-2">
            Estableciendo conexión con el servidor
          </p>
        </div>
      </div>
    );
  }

  if (isWaiting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Esperando al oponente...
          </h2>
          <p className="text-gray-500 mt-2">
            El duelo comenzará cuando ambos jugadores estén listos
          </p>
          {error && <p className="text-orange-500 mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Esperando la siguiente pregunta...
          </h2>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="mx-auto px-4 py-6 flex-grow container">
        <div className="mx-auto max-w-3xl">
          {error && (
            <div className="mb-4 p-4 bg-red-100 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <DuelHeader
            title="Duelo de Preguntas"
            opponent={opponentId}
            playerProgress={playerProgress}
            opponentProgress={opponentProgress}
            totalQuestions={totalQuestions}
          />

          <Question
            key={currentQuestion.id}
            questionNumber={playerProgress + 1}
            totalQuestions={totalQuestions}
            question={currentQuestion.text}
            options={currentQuestion.options.map((option, index) => ({
              letter: String.fromCharCode(65 + index),
              text: option,
            }))}
            onAnswerSelect={handleAnswerSelect}
          />

          {/* <PowerUps />

          <StreakAlert
            streak={3}
            message='¡Racha de 3 respuestas correctas! Próxima respuesta con puntos dobles.'
          /> */}
        </div>
      </main>
    </div>
  );
}
