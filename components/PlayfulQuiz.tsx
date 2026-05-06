import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Skull, Trophy, Watch, Anchor } from "lucide-react";

const QUIZ_QUESTIONS = [
  {
    text: "If you drop a heavy bowling ball and a light inflatable beach ball of the exact same size into water, which one experiences more upthrust?",
    options: [
      "The bowling ball",
      "The beach ball",
      "They experience the SAME upthrust!",
      "The water explodes",
    ],
    correctIndex: 2,
    explanation:
      "Upthrust depends ONLY on the volume (size) of the object pushing the water out of the way, not its weight! The bowling ball just sinks because its weight is greater than that upthrust.",
  },
  {
    text: "You have a lump of heavy clay that instantly sinks. How can you trick gravity and make the exact same clay float?",
    options: [
      "Yell at it to be lighter",
      "Paint it blue to trick the water",
      "Shape it like a bowl to displace more water",
      "Put it on a diet",
    ],
    correctIndex: 2,
    explanation:
      "Shaping it like a bowl or ship makes it hollow, so it displaces (pushes away) a lot more water! More displaced water = more UPTHRUST to balance the weight!",
  },
  {
    text: "Why will a giant, super-heavy steel cargo ship eventually sink?",
    options: [
      "When it gets afraid of sharks",
      "If the total weight of the ship and cargo becomes GREATER than the maximum upthrust",
      "When the captain sneezes too hard",
      "If the water gets too cold",
    ],
    correctIndex: 1,
    explanation: "It's a simple, brutal law of physics: If your Weight > Upthrust, you SINK to the bottom!",
  },
  {
    text: "What exactly is UPTHRUST?",
    options: [
      "A complicated underwater dance move",
      "The upward pushing force of water fighting back against an object",
      "The sound a submarine makes",
      "When you throw a bucket of water in the air",
    ],
    correctIndex: 1,
    explanation:
      "When you push water down, water pushes back UP! That upward fighting force is called upthrust.",
  },
  {
    text: "You push a fully inflated balloon underwater. It's difficult! Why?",
    options: [
      "The balloon is scared of the dark",
      "Because the balloon is very heavy",
      "Because it displaces a LOT of water but weighs almost nothing, creating MASSIVE upthrust",
      "The water is trying to steal the air inside"
    ],
    correctIndex: 2,
    explanation:
      "A big balloon displaces a lot of water. The water wants that space back, so it pushes UP with a giant force (upthrust) compared to the balloon's tiny weight!"
  }
];

export const PlayfulQuiz: React.FC = () => {
  const [gameState, setGameState] = useState<
    "start" | "playing" | "won" | "lost"
  >("start");
  const [depth, setDepth] = useState(50); // 0 is win (surface), 100 is lose (bottom)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    text: string;
  } | null>(null);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIdx];

  const startGame = () => {
    setGameState("playing");
    setDepth(50);
    setCurrentQuestionIdx(0);
    setTimeLeft(15);
    setFeedback(null);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && !feedback) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, feedback]);

  const handleLevelProgression = (newDepth: number) => {
    setTimeout(() => {
      if (newDepth <= 0) {
        setGameState("won");
      } else if (newDepth >= 100) {
        setGameState("lost");
      } else {
        setCurrentQuestionIdx((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
        setTimeLeft(15);
        setFeedback(null);
      }
    }, 4000); // 4 seconds to read feedback
  };

  const handleTimeOut = () => {
    setFeedback({
      isCorrect: false,
      text:
        "TIME'S UP! You swallowed a lot of water and sank like a rock! " +
        currentQuestion.explanation,
    });
    setDepth((prev) => {
      const next = Math.min(100, prev + 20);
      handleLevelProgression(next);
      return next;
    });
  };

  const handleAnswerClick = (index: number) => {
    if (feedback) return;

    if (index === currentQuestion.correctIndex) {
      setFeedback({
        isCorrect: true,
        text:
          "CORRECT! You catch an updraft of bubbles! " +
          currentQuestion.explanation,
      });
      setDepth((prev) => {
        const next = Math.max(0, prev - 20);
        handleLevelProgression(next);
        return next;
      });
    } else {
      setFeedback({
        isCorrect: false,
        text:
          "WRONG! An anvil lands on your head! " + currentQuestion.explanation,
      });
      setDepth((prev) => {
        const next = Math.min(100, prev + 20);
        handleLevelProgression(next);
        return next;
      });
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden glass-panel border border-blue-400/30 flex shadow-2xl">
      {/* Visual Depth Representation (Left 30%) */}
      <div className="relative w-1/3 h-full border-r border-blue-500/50 bg-gradient-to-b from-cyan-300 via-blue-600 to-slate-900 flex justify-center">
        {/* Surface */}
        <div className="absolute top-0 w-full h-8 bg-sky-200/50 border-b-2 border-white/80 animate-pulse"></div>
        <span className="absolute top-2 text-xs font-bold text-sky-800 tracking-widest z-10">
          SURFACE (WIN)
        </span>

        {/* Seabed */}
        <div className="absolute bottom-0 w-full h-12 bg-slate-800 border-t-4 border-slate-700"></div>
        <span className="absolute bottom-2 text-xs font-bold text-slate-400 tracking-widest z-10">
          <Skull size={14} className="inline mr-1" /> DROWNING ZONE
        </span>

        {/* Character */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-1000 ease-in-out flex flex-col items-center z-20"
          style={{
            top: `${Math.max(5, Math.min(95, depth))}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Visual indicator of what's happening */}
          {feedback && feedback.isCorrect && (
            <div className="absolute -bottom-8 text-cyan-200 animate-bounce text-xl">
              🫧🫧
            </div>
          )}
          {feedback && !feedback.isCorrect && (
            <div className="absolute -top-10 text-slate-400 animate-bounce">
              <Anchor size={32} />
            </div>
          )}

          <div
            className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center text-3xl shadow-xl transition-colors duration-500
                ${
                  feedback?.isCorrect
                    ? "bg-cyan-400 shadow-cyan-400/50"
                    : feedback && !feedback.isCorrect
                      ? "bg-red-500 shadow-red-500/50"
                      : "bg-yellow-400"
                }`}
          >
            {gameState === "lost"
              ? "💀"
              : gameState === "won"
                ? "😎"
                : feedback?.isCorrect
                  ? "😁"
                  : feedback && !feedback.isCorrect
                    ? "😵"
                    : "🤿"}
          </div>

          {/* Depth marker */}
          <div className="mt-2 bg-black/50 px-2 py-1 rounded text-xs text-white font-mono font-bold tracking-wider">
            DEPTH: {depth}m
          </div>
        </div>
      </div>

      {/* Quiz Area (Right 70%) */}
      <div className="w-2/3 h-full flex flex-col items-center justify-center p-8 bg-black/20 backdrop-blur-sm relative">
        {gameState === "start" && (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 mb-6 drop-shadow-lg">
              Sink or Float Quiz!
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-md mx-auto leading-relaxed">
              Answer Cambridge Science questions correctly to catch an upward
              current! Answer wrong, and you'll sink like a stone! Don't let
              time run out!
            </p>
            <Button
              onClick={startGame}
              className="text-xl px-12 py-4 shadow-xl transform hover:scale-105 hover:shadow-cyan-500/50"
            >
              JUMP IN! 💦
            </Button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="w-full max-w-xl animate-in fade-in duration-300 flex flex-col h-full justify-center">
            <div className="flex justify-between items-center mb-6">
              <span className="text-yellow-300 font-bold uppercase tracking-widest text-sm">
                Question {currentQuestionIdx + 1}/{QUIZ_QUESTIONS.length}
              </span>
              <div
                className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded-lg 
                    ${timeLeft <= 5 ? "bg-red-500/40 text-red-100 animate-pulse" : "bg-blue-900/50 text-blue-100"}`}
              >
                <Watch size={20} /> {timeLeft}s
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-8 min-h-[80px]">
              {currentQuestion.text}
            </h2>

            {!feedback ? (
              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((opt, i) => (
                  <Button
                    key={i}
                    onClick={() => handleAnswerClick(i)}
                    className="text-left py-4 px-6 bg-slate-800 hover:bg-cyan-700 hover:scale-[1.02] transform transition-all border border-slate-600 shadow-md h-auto whitespace-normal"
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            ) : (
              <div
                className={`p-6 rounded-xl animate-in zoom-in duration-300 border-2 ${feedback.isCorrect ? "bg-green-900/80 border-green-400" : "bg-red-900/80 border-red-500"}`}
              >
                <h3
                  className={`text-3xl font-bold mb-4 ${feedback.isCorrect ? "text-green-300" : "text-red-300"}`}
                >
                  {feedback.isCorrect ? "BOOM! CORRECT!" : "OUCH! WRONG!"}
                </h3>
                <p className="text-lg text-white leading-relaxed">
                  {feedback.text}
                </p>
                <p className="text-sm text-gray-300 mt-6 italic">
                  Next question loading in a few seconds...
                </p>
              </div>
            )}
          </div>
        )}

        {gameState === "won" && (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <Trophy
              size={80}
              className="mx-auto text-yellow-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
            />
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-400 mb-4 drop-shadow-lg">
              YOU SURVIVED!
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-md mx-auto">
              You mastered floating, sinking, and upthrust! You're
              officially a Cambridge Science expert!
            </p>
            <Button
              onClick={startGame}
              variant="success"
              className="text-xl px-12 py-4"
            >
              PLAY AGAIN
            </Button>
          </div>
        )}

        {gameState === "lost" && (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <Skull
              size={80}
              className="mx-auto text-slate-500 mb-6 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
            />
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 mb-4 drop-shadow-lg">
              YOU SANK!
            </h1>
            <p className="text-xl text-red-200 mb-8 max-w-md mx-auto leading-relaxed">
              Gravity and your heavy mistakes pulled you to the bottom of the
              ocean. Time to review upthrust!
            </p>
            <Button
              onClick={startGame}
              variant="danger"
              className="text-xl px-12 py-4 shadow-xl"
            >
              RETRY DIVE
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
