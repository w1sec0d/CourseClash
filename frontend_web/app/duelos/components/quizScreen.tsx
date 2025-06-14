import { useState, useEffect, useRef } from "react";
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
  duration: number;
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
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [totalQuestions] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [duelResults, setDuelResults] = useState<DuelResultsData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  // Refs to prevent duplicate submissions
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasSubmittedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!wsConnection) return;

    console.log(`[${playerId}] Setting up WebSocket message handler`);
    console.log(
      `[${playerId}] WebSocket readyState: ${wsConnection.readyState}`
    );
    console.log(`[${playerId}] WebSocket URL: ${wsConnection.url}`);
    console.log(`[${playerId}] useEffect execution time: ${Date.now()}`);
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
          setTimeRemaining(data.data.duration || 30); // Set timer with duration from question
          setHasAnswered(false); // Reset answer state for new question
          hasSubmittedRef.current = false; // Reset submission flag for new question
          setError(null);
          // Increment current question number when a new question arrives
          setCurrentQuestionNumber((prev) => prev + 1);
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

    // Delay crítico para sincronización - NO REMOVER
    // Aparentemente este timing es necesario para la estabilidad
    const stabilizationTimer = setTimeout(() => {
      console.log(
        `[${playerId}] Sincronización completada - conexión estabilizada`
      );

      // Ping original (comentado por ahora)
      // if (wsConnection.readyState === WebSocket.OPEN) {
      //   wsConnection.send(JSON.stringify({ type: 'ping', playerId }));
      // }
    }, 500);

    // Limpiar timer en cleanup
    return () => {
      console.log(`[${playerId}] Cleaning up WebSocket connection`);
      clearTimeout(stabilizationTimer);

      // Clean up timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (wsConnection) {
        wsConnection.removeEventListener("message", handleMessage);
        wsConnection.removeEventListener("open", handleOpen);
        wsConnection.removeEventListener("close", handleClose);
        wsConnection.removeEventListener("error", handleError);
      }
    };
  }, [wsConnection, playerId]);

  // Timer effect - improved to prevent duplicate submissions
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Don't start timer if no question, already answered, or time is up
    if (!currentQuestion || hasAnswered || timeRemaining <= 0) return;

    console.log(
      `[${playerId}] Starting timer for question ${currentQuestion.id}, time: ${timeRemaining}s`
    );

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        console.log(`[${playerId}] Timer tick: ${newTime}s remaining`);

        // Time's up! Send incorrect answer automatically (only once)
        if (newTime <= 0 && !hasSubmittedRef.current) {
          console.log(`[${playerId}] Time's up! Sending auto-incorrect answer`);
          hasSubmittedRef.current = true; // Set flag to prevent duplicate submissions

          if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
            try {
              wsConnection.send(
                JSON.stringify({
                  type: "answer",
                  questionId: currentQuestion.id,
                  answer: "incorrecto",
                })
              );
              setPlayerProgress((prev) => prev + 1);
              setHasAnswered(true);
              console.log(
                `[${playerId}] Auto-incorrect answer sent successfully`
              );
            } catch (err) {
              console.error(
                `[${playerId}] Error sending auto-incorrect answer:`,
                err
              );
              hasSubmittedRef.current = false; // Reset flag on error to allow retry
            }
          }
        }

        return Math.max(newTime, 0);
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentQuestion?.id, hasAnswered]); // Removed timeRemaining from dependencies to prevent re-creation

  const handleAnswerSelect = (selectedOption: string) => {
    if (
      !wsConnection ||
      !currentQuestion ||
      hasAnswered ||
      hasSubmittedRef.current
    )
      return;

    console.log(`[${playerId}] User selected answer: ${selectedOption}`);
    hasSubmittedRef.current = true; // Prevent duplicate submissions

    try {
      wsConnection.send(
        JSON.stringify({
          type: "answer",
          questionId: currentQuestion.id,
          answer: selectedOption,
        })
      );

      setPlayerProgress((prev) => prev + 1);
      setHasAnswered(true); // Mark as answered to stop timer
      setError(null);
      console.log(`[${playerId}] User answer sent successfully`);
    } catch (err) {
      console.error(`[${playerId}] Error sending answer:`, err);
      setError("Error al enviar la respuesta");
      hasSubmittedRef.current = false; // Reset flag on error to allow retry
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
            questionNumber={currentQuestionNumber}
            totalQuestions={totalQuestions}
            question={currentQuestion.text}
            options={currentQuestion.options.map((option, index) => ({
              letter: String.fromCharCode(65 + index),
              text: option,
            }))}
            onAnswerSelect={handleAnswerSelect}
            timeRemaining={timeRemaining}
            hasAnswered={hasAnswered}
            totalTime={currentQuestion.duration || 30}
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
