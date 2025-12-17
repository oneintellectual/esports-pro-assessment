import React, { useState, useEffect } from 'react';
import { User, ScoreRecord, LEVELS, LevelConfig, TestConfig } from './types';
import { WelcomeScreen, AnalysisScreen, ResultsScreen } from './components/Screens';
import { api } from './services/api';
import { 
  PsychologyTest, PersonalityTest, 
  ReactionSpeedTest, StroopTest, GridReaction,
  StaticVision, DynamicVision, FlashMemory,
  FocusTrack, TrackingTest, ReflexLight,
  SequenceMemory, PatternMemory, FPSAimTest 
} from './components/TestModules';
import { Play } from 'lucide-react';

type AppState = 'welcome' | 'test' | 'analysis' | 'results';
type TestPhase = 'intro' | 'active';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [testPhase, setTestPhase] = useState<TestPhase>('intro');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [currentTestIdx, setCurrentTestIdx] = useState(0);
  const [scores, setScores] = useState<ScoreRecord[]>([]);

  const handleStart = async (username: string) => {
    const user = await api.createUser(username);
    setCurrentUser(user);
    setAppState('test');
    setTestPhase('intro');
    setCurrentLevelIdx(0);
    setCurrentTestIdx(0);
    setScores([]);
  };

  const handleTestComplete = async (scoreVal: number, display: string, unit: string) => {
    const currentLevel = LEVELS[currentLevelIdx];
    const currentTest = currentLevel.tests[currentTestIdx];

    const record: ScoreRecord = {
      levelId: currentLevel.id,
      levelName: currentLevel.name,
      testId: currentTest.id,
      testName: currentTest.name,
      score: scoreVal,
      displayScore: display,
      unit: unit
    };

    const newScores = [...scores, record];
    setScores(newScores);
    await api.submitScore(record);

    // Determine next step
    if (currentTestIdx < currentLevel.tests.length - 1) {
      // Next test in same level
      setCurrentTestIdx(prev => prev + 1);
      setTestPhase('intro'); // Reset to intro for next test
    } else if (currentLevelIdx < LEVELS.length - 1) {
      // Next level
      setCurrentLevelIdx(prev => prev + 1);
      setCurrentTestIdx(0);
      setTestPhase('intro'); // Reset to intro for next test
    } else {
      // All done
      setAppState('analysis');
    }
  };

  const handleRestart = () => {
    setAppState('welcome');
    setCurrentUser(null);
  };

  // --- Render Logic for the active test component ---
  const renderCurrentTestModule = () => {
    const currentLevel = LEVELS[currentLevelIdx];
    const currentTest = currentLevel.tests[currentTestIdx];
    const props = { testId: currentTest.id, onComplete: handleTestComplete };

    switch (currentTest.id) {
      case 'psych': return <PsychologyTest {...props} />;
      case 'personality': return <PersonalityTest {...props} />;
      case 'simple_reaction': return <ReactionSpeedTest {...props} />;
      case 'choice_reaction': return <StroopTest {...props} />;
      case 'grid_reaction': return <GridReaction {...props} />;
      case 'static_vision': return <StaticVision {...props} />;
      case 'dynamic_vision': return <DynamicVision {...props} />;
      case 'flash_memory': return <FlashMemory {...props} />;
      case 'focus_track': return <FocusTrack {...props} />;
      case 'tracking': return <TrackingTest {...props} />;
      case 'reflex': return <ReflexLight {...props} />;
      case 'seq_memory': return <SequenceMemory {...props} />;
      case 'pattern_memory': return <PatternMemory {...props} />;
      case 'fps_aim': return <FPSAimTest {...props} />;
      default: return <div>Unknown Test ID: {currentTest.id}</div>;
    }
  };

  return (
    <>
      {appState === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      
      {appState === 'analysis' && (
        <AnalysisScreen onFinish={() => setAppState('results')} />
      )}

      {appState === 'results' && currentUser && (
        <ResultsScreen 
          scores={scores} 
          username={currentUser.username} 
          onRestart={handleRestart} 
        />
      )}

      {appState === 'test' && currentUser && (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
          {/* Top Bar */}
          <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <span className="font-bold text-cyan-400">{currentUser.username}</span>
              <span className="text-slate-500">|</span>
              <span className="text-sm text-slate-300">
                Level {currentLevelIdx + 1}: {LEVELS[currentLevelIdx].name} 
                <span className="ml-2 text-slate-500">({currentTestIdx + 1}/{LEVELS[currentLevelIdx].tests.length})</span>
              </span>
            </div>
            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
               {/* Global Progress Bar (Rough estimation) */}
               <div 
                 className="h-full bg-cyan-500 transition-all duration-500"
                 style={{ width: `${((currentLevelIdx * 2 + currentTestIdx) / 14) * 100}%` }} 
               />
            </div>
          </div>

          {/* Test Container */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            
            <div className="z-10 w-full max-w-4xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl min-h-[500px] flex flex-col items-center justify-center">
               <h2 className="text-3xl font-display font-bold mb-2 text-white">{LEVELS[currentLevelIdx].tests[currentTestIdx].name}</h2>
               <p className="text-slate-400 mb-8">{LEVELS[currentLevelIdx].tests[currentTestIdx].description}</p>
               
               <div className="w-full flex justify-center">
                 {testPhase === 'intro' ? (
                   <div className="text-center animate-in fade-in zoom-in-95 duration-300">
                      <div className="mb-8 p-6 bg-slate-900/50 rounded-xl border border-slate-600 max-w-lg mx-auto">
                        <p className="text-lg text-slate-300">准备好开始了吗？</p>
                        <p className="text-sm text-slate-500 mt-2">请确保您已集中注意力。</p>
                      </div>
                      <button 
                        onClick={() => setTestPhase('active')}
                        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-cyan-600 font-display rounded-full focus:outline-none hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                      >
                        <Play className="mr-2 fill-current" size={20} />
                        开始测试 / START
                      </button>
                   </div>
                 ) : (
                   renderCurrentTestModule()
                 )}
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;