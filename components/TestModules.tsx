import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Target, Eye, Brain, MousePointer, Cpu, Crosshair } from 'lucide-react';
import { ScoreRecord } from '../types';

interface TestModuleProps {
  testId: string;
  onComplete: (score: number, displayScore: string, unit: string) => void;
}

// --- Level 1: Basic ---
export const PsychologyTest: React.FC<TestModuleProps> = ({ onComplete }) => {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  
  const questions = [
    { q: "在逆风局中，队友开始争吵，你会？", options: [{ t: "加入争吵", s: 0 }, { t: "屏蔽并专注操作", s: 10 }, { t: "尝试调解", s: 8 }] },
    { q: "关键团战失误导致被团灭，下一局你会？", options: [{ t: "非常懊恼，影响操作", s: 0 }, { t: "深呼吸，复盘失误", s: 10 }, { t: "把锅甩给辅助", s: 0 }] },
    { q: "为了练习一个连招，你愿意枯燥重复多少次？", options: [{ t: "几十次", s: 2 }, { t: "几百次", s: 5 }, { t: "直到肌肉记忆", s: 10 }] }
  ];

  const handleAnswer = (points: number) => {
    const newScore = score + points;
    if (qIdx < questions.length - 1) {
      setScore(newScore);
      setQIdx(qIdx + 1);
    } else {
      onComplete(newScore, `${newScore}/30`, '分');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <h3 className="text-xl text-cyan-400">问题 {qIdx + 1} / {questions.length}</h3>
      <p className="text-2xl font-bold text-center mb-8">{questions[qIdx].q}</p>
      <div className="grid gap-4 w-full max-w-md">
        {questions[qIdx].options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt.s)} className="p-4 border border-slate-600 rounded hover:bg-cyan-900/50 transition-colors text-left">
            {opt.t}
          </button>
        ))}
      </div>
    </div>
  );
};

export const PersonalityTest: React.FC<TestModuleProps> = ({ onComplete }) => {
  // Simplified Logic
  useEffect(() => {
    // In a real app this would be a full questionnaire
    const timer = setTimeout(() => {
       onComplete(85, "指挥型 (红)", "类型");
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return <div className="text-center animate-pulse">正在分析您的决策风格模型... (模拟耗时)</div>;
};


// --- Level 2: Reaction ---
export const ReactionSpeedTest: React.FC<TestModuleProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<'waiting' | 'ready' | 'go' | 'clicked'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const timeoutRef = useRef<number | undefined>(undefined);

  const maxRounds = 3;
  const currentRound = results.length + 1;

  const startTest = () => {
    setStatus('ready');
    const delay = 2000 + Math.random() * 3000;
    timeoutRef.current = window.setTimeout(() => {
      setStatus('go');
      setStartTime(performance.now());
    }, delay);
  };

  const handleClick = () => {
    if (status === 'ready') {
      clearTimeout(timeoutRef.current);
      setStatus('waiting');
      alert("太早了！请看到绿色后再点击。");
    } else if (status === 'go') {
      const endTime = performance.now();
      const ms = Math.floor(endTime - startTime);
      const newResults = [...results, ms];
      setResults(newResults);
      setStatus('clicked');

      if (newResults.length >= maxRounds) {
          const avg = Math.floor(newResults.reduce((a, b) => a + b, 0) / maxRounds);
          setTimeout(() => {
              onComplete(avg, `${avg}`, 'ms (Avg)');
          }, 1500);
      }
    }
  };

  const nextRound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus('waiting');
  };

  return (
    <div 
      onMouseDown={handleClick}
      className={`w-full h-96 flex flex-col items-center justify-center cursor-pointer rounded-xl select-none transition-colors duration-200
        ${(status === 'waiting' || status === 'clicked') ? 'bg-slate-800' : ''}
        ${status === 'ready' ? 'bg-red-600' : ''}
        ${status === 'go' ? 'bg-green-500' : ''}
      `}
    >
      {status === 'waiting' && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-xl text-cyan-400">Round {Math.min(currentRound, maxRounds)} / {maxRounds}</h3>
            <button onClick={(e) => { e.stopPropagation(); startTest(); }} className="px-8 py-4 bg-cyan-600 rounded-full text-xl font-bold hover:bg-cyan-500 shadow-lg shadow-cyan-500/50">
                {currentRound === 1 ? "点击开始测试" : "开始下一轮"}
            </button>
          </div>
      )}
      
      {status === 'ready' && <h2 className="text-4xl font-bold text-white animate-pulse">等待变绿...</h2>}
      
      {status === 'go' && <h2 className="text-6xl font-bold text-white scale-110 transition-transform">点击!!!</h2>}
      
      {status === 'clicked' && (
          <div className="flex flex-col items-center gap-4">
              <h2 className="text-5xl font-bold text-white mb-2">{results[results.length-1]} ms</h2>
              {results.length < maxRounds ? (
                  <button onClick={nextRound} className="px-8 py-3 bg-slate-600 rounded-full text-lg hover:bg-slate-500">
                      下一轮 &rarr;
                  </button>
              ) : (
                  <div className="text-xl text-green-400">测试完成! 计算平均成绩...</div>
              )}
          </div>
      )}
    </div>
  );
};

export const StroopTest: React.FC<TestModuleProps> = ({ onComplete }) => {
  // Simplified Stroop
  const [count, setCount] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [current, setCurrent] = useState({ text: '红', color: 'text-red-500', isMatch: true });
  
  const colors = [
    { name: '红', class: 'text-red-500' },
    { name: '蓝', class: 'text-blue-500' },
    { name: '绿', class: 'text-green-500' },
  ];

  const nextRound = useCallback(() => {
    if (count >= 5) {
      onComplete(correct * 20, `${correct * 20}`, '分');
      return;
    }
    const textIdx = Math.floor(Math.random() * 3);
    const colorIdx = Math.floor(Math.random() * 3);
    
    setCurrent({
      text: colors[textIdx].name,
      color: colors[colorIdx].class,
      isMatch: textIdx === colorIdx
    });
    setCount(c => c + 1);
  }, [count, correct, onComplete]);

  const handleResponse = (response: boolean) => {
    if (response === current.isMatch) setCorrect(c => c + 1);
    nextRound();
  };

  useEffect(() => { nextRound(); }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-lg">文字含义与字体颜色是否一致？</div>
      <div className={`text-8xl font-black ${current.color}`}>{current.text}</div>
      <div className="flex gap-8">
        <button onClick={() => handleResponse(true)} className="w-32 py-4 bg-green-600 rounded hover:bg-green-500">一致 (Yes)</button>
        <button onClick={() => handleResponse(false)} className="w-32 py-4 bg-red-600 rounded hover:bg-red-500">不一致 (No)</button>
      </div>
      <div className="text-slate-500">进度: {count}/5</div>
    </div>
  );
};

export const GridReaction: React.FC<TestModuleProps> = ({ onComplete }) => {
  const [targets, setTargets] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          onComplete(score, `${score}`, '个');
          return 0;
        }
        return t - 1;
      });
      // Add target periodically - UPDATED: Speed increased (350ms instead of 800ms)
      if (Math.random() > 0.4) {
         const newTarget = Math.floor(Math.random() * 16);
         setTargets(prev => prev.includes(newTarget) ? prev : [...prev, newTarget]);
      }
    }, 350); 
    return () => clearInterval(timer);
  }, [score, onComplete]);

  const hit = (i: number) => {
    if (targets.includes(i)) {
      setScore(s => s + 1);
      setTargets(prev => prev.filter(t => t !== i));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-xl font-bold">倒计时: {timeLeft}s | 得分: {score}</div>
      <div className="grid grid-cols-4 gap-2 bg-slate-800 p-2 rounded">
        {Array.from({ length: 16 }).map((_, i) => (
          <div 
            key={i} 
            onMouseDown={() => hit(i)}
            className={`w-20 h-20 rounded cursor-pointer transition-all duration-75 ${targets.includes(i) ? 'bg-cyan-400 scale-90 shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 'bg-slate-700'}`}
          />
        ))}
      </div>
    </div>
  );
};

// --- Level 3: Vision ---
export const StaticVision: React.FC<TestModuleProps> = ({ onComplete }) => {
  const [level, setLevel] = useState(1);
  const maxLevels = 5;
  const [targetIndex, setTargetIndex] = useState(() => Math.floor(Math.random() * 25));
  const [baseHue, setBaseHue] = useState(() => Math.floor(Math.random() * 360));

  const handleChoice = (index: number) => {
    if (index === targetIndex) {
      if (level < maxLevels) {
        setLevel(l => l + 1);
        setTargetIndex(Math.floor(Math.random() * 25));
        setBaseHue(Math.floor(Math.random() * 360));
      } else {
        onComplete(100, "S级", "评级");
      }
    }
  };

  const opacity = 0.5 + (level * 0.08);

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-4 text-cyan-400 font-bold">找出颜色不同的方块 (Level {level})</h3>
      <div className="grid grid-cols-5 gap-3 p-4 bg-slate-800 rounded-xl">
        {Array.from({ length: 25 }).map((_, i) => {
            const isTarget = i === targetIndex;
            return (
                <div 
                    key={i} 
                    onClick={() => handleChoice(i)}
                    className="w-16 h-16 rounded-lg cursor-pointer transition-transform duration-100 active:scale-95 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] border border-white/5"
                    style={{ 
                        backgroundColor: `hsl(${baseHue}, 70%, 60%)`,
                        opacity: isTarget ? opacity : 1 
                    }}
                />
            )
        })}
      </div>
    </div>
  );
};

export const DynamicVision: React.FC<TestModuleProps> = ({ onComplete }) => {
  const [pos, setPos] = useState(0);
  const [moving, setMoving] = useState(true);
  const reqRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!moving) return;
    const animate = () => {
      setPos(p => {
        if (p > 100) return 0;
        return p + 1.5; // speed
      });
      reqRef.current = requestAnimationFrame(animate);
    };
    reqRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqRef.current!);
  }, [moving]);

  const handleStop = () => {
    setMoving(false);
    cancelAnimationFrame(reqRef.current!);
    const diff = Math.abs(pos - 80); // Target is 80%
    let score = 0;
    if (diff < 5) score = 100;
    else if (diff < 10) score = 80;
    else if (diff < 20) score = 50;
    
    setTimeout(() => onComplete(score, `${score}`, '分'), 1000);
  };

  return (
    <div className="w-full max-w-lg">
      <div className="relative h-12 bg-slate-700 rounded-full overflow-hidden mb-8">
        <div className="absolute top-0 bottom-0 bg-green-500/30 w-[10%] left-[75%]" />
        <div className="absolute top-0 bottom-0 w-2 bg-white" style={{ left: `${pos}%` }} />
      </div>
      <button onClick={handleStop} disabled={!moving} className="w-full py-4 bg-cyan-600 rounded font-bold">
        在绿色区域停止
      </button>
    </div>
  );
};

export const FlashMemory: React.FC<TestModuleProps> = ({ onComplete }) => {
  const [round, setRound] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<'show' | 'hide' | 'ask'>('show');
  
  // State for current round data
  const [sequence, setSequence] = useState<string[]>([]); // e.g. ["A", "7", "K"]
  const [options, setOptions] = useState<string[]>([]); // Options for the user to click

  // Helper to generate a random character (A-Z, 0-9)
  const getRandomChar = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  // Helper to start a round
  const startRound = useCallback(() => {
    // Generate 3 unique random chars
    const newSeq = [];
    while(newSeq.length < 3) {
       const c = getRandomChar();
       // avoid duplicates in the same sequence for clarity
       if (!newSeq.includes(c)) newSeq.push(c);
    }
    setSequence(newSeq);
    setPhase('show');

    // 0.8s flash time
    setTimeout(() => {
      setPhase('hide');
      
      // Prepare options (The correct middle char + 2 distractors)
      const target = newSeq[1]; // Middle char
      const dist1 = getRandomChar();
      const dist2 = getRandomChar();
      
      // Shuffle options
      const opts = [target, dist1, dist2].sort(() => Math.random() - 0.5);
      setOptions(opts);

      setTimeout(() => setPhase('ask'), 500); // Short delay before asking
    }, 800);
  }, []);

  // Init first round
  useEffect(() => {
    startRound();
  }, [startRound]);

  const handleAnswer = (val: string) => {
    const isCorrect = val === sequence[1];
    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;
    setCorrectCount(newCorrectCount);

    if (round < 3) {
      setRound(r => r + 1);
      // Small delay before next round
      setTimeout(startRound, 500);
    } else {
      // Finished
      const finalScore = Math.round((newCorrectCount / 3) * 100);
      onComplete(finalScore, `${newCorrectCount}/3`, "正确");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[300px] justify-center">
      <h3 className="text-cyan-400 mb-6 font-bold">Round {round} / 3</h3>

      {phase === 'show' && (
        <div className="flex gap-4">
          {sequence.map((char, i) => (
            <div key={i} className="w-20 h-24 bg-slate-800 flex items-center justify-center text-5xl font-bold text-yellow-400 rounded border border-slate-600">
              {char}
            </div>
          ))}
        </div>
      )}

      {phase === 'hide' && (
        <div className="text-xl text-slate-400 animate-pulse">...回忆中...</div>
      )}

      {phase === 'ask' && (
        <div className="flex flex-col gap-6 items-center animate-in fade-in zoom-in-95">
          <h3 className="text-2xl font-bold">中间的字符是什么？</h3>
          <div className="flex gap-6">
             {options.map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => handleAnswer(opt)} 
                  className="w-20 h-20 bg-slate-700 hover:bg-cyan-600 text-3xl font-bold rounded transition-colors flex items-center justify-center border border-slate-500"
                >
                  {opt}
                </button>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Level 4: Focus ---
export const FocusTrack: React.FC<TestModuleProps> = ({ onComplete }) => {
  const [clicks, setClicks] = useState(0);
  
  const handleClick = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 5) onComplete(100, "优秀", "评级");
  };

  return (
    <div className="h-64 w-full relative bg-slate-900 rounded overflow-hidden">
       <button 
         onClick={handleClick}
         className="absolute w-12 h-12 bg-orange-500 rounded-full transition-all duration-300"
         style={{ top: `${Math.random() * 80}%`, left: `${Math.random() * 90}%` }}
       />
       <div className="absolute top-2 left-2 text-slate-500">点击橙色圆球 (模拟抗干扰)</div>
    </div>
  );
};

// --- Level 5: Hand Eye ---
export const TrackingTest: React.FC<TestModuleProps> = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isHovering, setIsHovering] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Game Loop for Movement
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    // Movement state
    let tx = 50; // Target X %
    let ty = 50; // Target Y %
    let cx = 50; // Current X %
    let cy = 50; // Current Y %
    let speed = 0.04; // Speed per ms roughly
    
    const pickNewTarget = () => {
        tx = 10 + Math.random() * 80;
        ty = 10 + Math.random() * 80;
    };
    pickNewTarget();

    const renderLoop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      // Calculate distance to target
      const dx = tx - cx;
      const dy = ty - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // Move
      const moveStep = speed * delta;
      
      if (dist < moveStep) {
         cx = tx;
         cy = ty;
         pickNewTarget();
      } else {
         cx += (dx / dist) * moveStep;
         cy += (dy / dist) * moveStep;
      }
      
      // Update DOM directly
      if (targetRef.current) {
         targetRef.current.style.left = `${cx}%`;
         targetRef.current.style.top = `${cy}%`;
      }
      
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    
    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Timer and Scoring
  const stateRef = useRef({ score: 0, total: 0, isHovering: false });
  useEffect(() => {
     stateRef.current.isHovering = isHovering;
  }, [isHovering]);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 10000;
    
    const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
        setTimeLeft(remaining);

        stateRef.current.total++;
        if (stateRef.current.isHovering) {
            stateRef.current.score++;
        }
        
        // Update UI score every tick
        setScore(stateRef.current.score);

        if (elapsed >= duration) {
            clearInterval(timer);
            const finalPercent = Math.round((stateRef.current.score / stateRef.current.total) * 100);
            onComplete(finalPercent, `${finalPercent}%`, '覆盖率');
        }
    }, 50); // 20 checks per second

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div 
        ref={containerRef}
        className="relative w-full h-96 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 cursor-crosshair select-none"
    >
      {/* Target Ball */}
      <div 
        ref={targetRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`absolute w-16 h-16 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-colors duration-75
           ${isHovering ? 'bg-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.6)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'}
        `}
        style={{ left: '50%', top: '50%' }} // Initial pos, updated by JS
      >
        <Target className={`w-8 h-8 ${isHovering ? 'text-white' : 'text-white/50'}`} />
      </div>

      {/* HUD */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
         <div className="text-sm text-slate-400">时间: <span className="text-white font-mono text-xl">{timeLeft}s</span></div>
         <div className="text-sm text-slate-400">追踪: <span className={`${isHovering ? 'text-cyan-400' : 'text-red-400'} font-bold`}>{isHovering ? 'LOCKED' : 'LOST'}</span></div>
      </div>
    </div>
  );
};

export const ReflexLight: React.FC<TestModuleProps> = ({ onComplete }) => {
    const [lit, setLit] = useState(false);
    useEffect(() => { setTimeout(() => setLit(true), 1000); }, []);
    return (
        <div className="flex flex-col items-center">
            <button 
              onClick={() => { if(lit) onComplete(250, "250", "ms"); }}
              className={`w-32 h-32 rounded-full border-4 border-slate-600 ${lit ? 'bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]' : 'bg-slate-900'}`}
            />
            <p className="mt-4">亮起时立即点击</p>
        </div>
    )
}

// --- Level 6: Memory ---
export const SequenceMemory: React.FC<TestModuleProps> = ({ onComplete }) => {
    const [round, setRound] = useState(1);
    const [correctCount, setCorrectCount] = useState(0);
    const [seq, setSeq] = useState("");
    const [phase, setPhase] = useState<'memorize' | 'input'>('memorize');
    const [inputVal, setInputVal] = useState("");

    // Generate random 6-digit sequence
    const generateSeq = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Initialize round
    useEffect(() => {
        setSeq(generateSeq());
        setPhase('memorize');
        setInputVal("");
        
        const timer = setTimeout(() => {
            setPhase('input');
        }, 2000); // 2 seconds to memorize

        return () => clearTimeout(timer);
    }, [round]);

    const handleSubmit = () => {
        const isCorrect = inputVal === seq;
        const nextCorrectCount = isCorrect ? correctCount + 1 : correctCount;
        setCorrectCount(nextCorrectCount);

        if (round < 3) {
            setRound(r => r + 1);
        } else {
            // Finished 3 rounds
            const finalScore = Math.round((nextCorrectCount / 3) * 100);
            onComplete(finalScore, `${nextCorrectCount}/3`, "正确轮次");
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
            <h3 className="text-xl text-cyan-400 mb-2">Round {round} / 3</h3>
            
            {phase === 'memorize' ? (
                 <div className="h-32 flex items-center justify-center">
                    <div className="text-6xl tracking-widest font-mono font-bold animate-pulse text-white">{seq}</div>
                 </div>
            ) : (
                <div className="flex flex-col items-center gap-4 w-full animate-in fade-in slide-in-from-bottom-4">
                    <input 
                      type="text" 
                      value={inputVal} 
                      onChange={e => setInputVal(e.target.value)} 
                      maxLength={6}
                      className="w-full bg-slate-800/50 border-b-4 border-cyan-500 text-4xl text-center py-4 outline-none tracking-[0.5em] text-white"
                      placeholder="______"
                      autoFocus
                    />
                    <button onClick={handleSubmit} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded font-bold text-lg w-full transition-colors">
                        确认 (Submit)
                    </button>
                </div>
            )}
        </div>
    );
};

export const PatternMemory: React.FC<TestModuleProps> = ({ onComplete }) => {
    const GRID_SIZE = 16; // 4x4
    const TARGET_COUNT = 5;
    
    const [targets, setTargets] = useState<number[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');

    useEffect(() => {
        // Generate targets
        const newTargets = new Set<number>();
        while(newTargets.size < TARGET_COUNT) {
            newTargets.add(Math.floor(Math.random() * GRID_SIZE));
        }
        setTargets(Array.from(newTargets));
        
        // Timer to switch phase
        const timer = setTimeout(() => {
            setPhase('recall');
        }, 2000);
        
        return () => clearTimeout(timer);
    }, []);

    const handleCellClick = (index: number) => {
        if (phase !== 'recall' || selected.includes(index)) return;
        
        const newSelected = [...selected, index];
        setSelected(newSelected);

        if (newSelected.length === TARGET_COUNT) {
            // Check results immediately after selecting all
            const correct = newSelected.filter(i => targets.includes(i)).length;
            const score = Math.round((correct / TARGET_COUNT) * 100);
            setTimeout(() => {
                 onComplete(score, `${correct}/${TARGET_COUNT}`, "正确方块");
            }, 500);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="mb-4 text-xl">{phase === 'memorize' ? "记忆亮起的方块" : "重复刚才的图案"}</h3>
            <div className="grid grid-cols-4 gap-3 bg-slate-800 p-4 rounded-xl">
                {Array.from({ length: GRID_SIZE }).map((_, i) => {
                    let bgColor = "bg-slate-700";
                    if (phase === 'memorize' && targets.includes(i)) {
                        bgColor = "bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]";
                    } else if (phase === 'recall' && selected.includes(i)) {
                        bgColor = targets.includes(i) ? "bg-green-500" : "bg-red-500";
                    }

                    return (
                        <div 
                            key={i}
                            onClick={() => handleCellClick(i)}
                            className={`w-16 h-16 rounded cursor-pointer transition-all duration-200 ${bgColor} ${phase === 'recall' && !selected.includes(i) ? 'hover:bg-slate-600' : ''}`}
                        />
                    );
                })}
            </div>
            {phase === 'recall' && <div className="mt-4 text-slate-400 text-sm">已选: {selected.length} / {TARGET_COUNT}</div>}
        </div>
    );
};

// --- Level 7: FPS ---
export const FPSAimTest: React.FC<TestModuleProps> = ({ onComplete }) => {
    const [targets, setTargets] = useState<{id: number, x: number, y: number}[]>([]);
    const [hits, setHits] = useState(0);
    const [clicks, setClicks] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'ended'>('start');
    const areaRef = useRef<HTMLDivElement>(null);

    // Timer Logic
    useEffect(() => {
        if (gameState !== 'playing') return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameState('ended');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState]);

    // Spawning Logic
    useEffect(() => {
        if (gameState !== 'playing') return;

        const spawn = setInterval(() => {
            if (!areaRef.current) return;
            setTargets(prev => {
                if (prev.length >= 6) return prev; // Limit targets to avoid clutter
                const w = areaRef.current!.clientWidth - 60; 
                const h = areaRef.current!.clientHeight - 60;
                const x = Math.random() * w + 10;
                const y = Math.random() * h + 10;
                return [...prev, { id: Date.now() + Math.random(), x, y }];
            });
        }, 400); // Faster spawn for higher intensity

        return () => clearInterval(spawn);
    }, [gameState]);

    // End Game Handler
    useEffect(() => {
        if (gameState === 'ended') {
            const accuracy = clicks > 0 ? Math.round((hits / clicks) * 100) : 0;
            // Short delay to show the final "0s" state before leaving
            const timer = setTimeout(() => {
                 onComplete(hits, `${hits}命中 (${accuracy}%)`, "综合评分");
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [gameState, hits, clicks, onComplete]);

    const handleShoot = (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent container click event
        if (gameState !== 'playing') return;
        setHits(h => h + 1);
        setClicks(c => c + 1);
        setTargets(t => t.filter(x => x.id !== id));
    };

    const handleContainerClick = () => {
        if (gameState !== 'playing') return;
        setClicks(c => c + 1); // Count as a miss
    };

    return (
        <div 
            ref={areaRef} 
            onMouseDown={handleContainerClick}
            className="w-full h-96 bg-slate-900 relative overflow-hidden cursor-crosshair border border-slate-700 select-none group"
        >
            {/* Start Overlay */}
            {gameState === 'start' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30">
                     <button 
                        onClick={(e) => { e.stopPropagation(); setGameState('playing'); }}
                        className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded text-xl shadow-[0_0_20px_rgba(8,145,178,0.6)] animate-pulse"
                     >
                        START FPS TEST (30s)
                     </button>
                </div>
            )}

            {/* Targets */}
            {targets.map(t => (
                <div 
                    key={t.id}
                    onMouseDown={(e) => handleShoot(t.id, e)}
                    className="absolute w-12 h-12 bg-cyan-500 rounded-full border-2 border-white flex items-center justify-center hover:bg-cyan-400 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.6)] z-20"
                    style={{ left: t.x, top: t.y }}
                >
                    <Crosshair size={20} className="text-slate-900 opacity-50" />
                </div>
            ))}
            
            {/* HUD */}
            <div className="absolute top-0 left-0 w-full p-2 z-10 pointer-events-none flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex gap-6 text-xl font-mono font-bold px-4 w-full justify-between">
                    <div className={`${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                        TIME: {timeLeft}s
                    </div>
                    <div className="text-white">HITS: {hits}</div>
                    <div className="text-slate-400">ACC: {clicks > 0 ? Math.round((hits/clicks)*100) : 100}%</div>
                </div>
            </div>
        </div>
    );
};