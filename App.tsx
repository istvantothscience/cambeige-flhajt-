import React, { useState } from "react";
import { ViewState } from "./types";
import { LessonExperiment } from "./components/LessonExperiment";
import { PlayfulQuiz } from "./components/PlayfulQuiz";
import { Button } from "./components/Button";
import { Activity, BookOpen, Gamepad2 } from "lucide-react";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>("lesson");

  return (
    <div className="min-h-screen pb-4 flex flex-col">
      {/* Navigation & Header */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-white/20 mb-8">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <BookOpen className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-wide hidden sm:block">
              Cambridge Science: Forces
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2 bg-black/20 p-1 rounded-xl glass-panel">
              <Button
                onClick={() => setCurrentView("lesson")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === "lesson" ? "bg-cyan-500/50 shadow-md shadow-cyan-500/20" : "bg-transparent shadow-none hover:bg-white/10"}`}
              >
                <Activity size={18} />
                <span className="hidden sm:inline font-bold">
                  Lab Experiments
                </span>
              </Button>
              <Button
                onClick={() => setCurrentView("game")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentView === "game" ? "bg-yellow-500/50 shadow-md shadow-yellow-500/20" : "bg-transparent shadow-none hover:bg-white/10"}`}
              >
                <Gamepad2 size={18} />
                <span className="hidden sm:inline font-bold">
                  Sink or Float Quiz
                </span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 animate-in fade-in duration-500 flex-grow flex flex-col">
        {currentView === "lesson" && <LessonExperiment />}
        {currentView === "game" && (
          <div className="w-full max-w-5xl mx-auto flex-grow flex items-center justify-center">
            <PlayfulQuiz />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
