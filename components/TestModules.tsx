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
  const timeoutRef = useRef<number>();

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
      setStatus('clicked');
      onComplete(ms, `${ms}`, 'ms');
    }
  };

  return (
    <div 
      onMouseDown={handleClick}
      className={`w-full h-96 flex flex-col items-center justify-center cursor-pointer rounded-xl select-none transition-colors duration-200
        ${status === 'waiting' || status === 'clicked' ? 'bg-slate-800' : ''}
        ${status === 'ready' ? 'bg-red-600' : ''}
        ${status === 'go' ? 'bg-green-500' : ''}
      `}
    >
      {status === 'waiting' && <button onClick={(e) => { e.stopPropagation(); startTest(); }} className="px-8 py-4 bg-cyan-600 rounded-full text-xl font-bold hover:bg-cyan-500">点击开始测试</button>}
      {status === 'ready' && <h2 className="text-4xl font-bold text-white">等待变绿...</h2>}
      {status === 'go' && <h2 className="text-6xl font-bold text-white">点击!!!</h2>}
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
    // 50% chance of matching logic for "Is the text matching the color name?"
    // Actually standard Stroop: Does the Meaning match the Ink?
    // Let's do: Click MATCH if text matches color, else ignore. Or easier: Just match text meaning.
    // Let's do: "文字描述的颜色与实际字体颜色是否一致？"
    
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
      // Add target periodically
      if (Math.random() > 0.5) {
         const newTarget = Math.floor(Math.random() * 16);
         setTargets(prev => prev.includes(newTarget) ? prev : [...prev, newTarget]);
      }
    }, 800);
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
            className={`w-20 h-20 rounded cursor-pointer transition-all duration-75 ${targets.includes(i) ? 'bg-cyan-400 scale-90' : 'bg-slate-700'}`}
          />
        ))}
      </div>
    </div>
  );
};

// --- Level 3: Vision ---
export const StaticVision: React.FC<TestModuleProps> = ({ onComplete }) => {
  // Find the slightly different color
  const [level, setLevel] = useState(1);
  const maxLevels = 5;

  const handleChoice = (isCorrect: boolean) => {
    if (isCorrect) {
      if (level < maxLevels) setLevel(l => l + 1);
      else onComplete(100, "S级", "评级");
    }
    // No penalty logic for brevity
  };

  const opacity = 1 - (level * 0.1); 

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-4">找出颜色不同的方块 (Level {level})</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 25 }).map((_, i) => {
            const isTarget = i === 12; // Static for simplicity in demo
            return (
                <div 
                    key={i} 
                    onClick={() => handleChoice(isTarget)}
                    className="w-12 h-12 bg-purple-500 rounded cursor-pointer"
                    style={{ opacity: isTarget ? opacity : 1 }}
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
  const reqRef = useRef<number>();

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
  const [phase, setPhase] = useState<'show' | 'hide' | 'ask'>('show');
  
  useEffect(() => {
    setTimeout(() => setPhase('hide'), 500); // Flash for 500ms
    setTimeout(() => setPhase('ask'), 1500);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {phase === 'show' && <div className="text-9xl font-bold text-yellow-400">R 7 B</div>}
      {phase === 'hide' && <div className="text-xl">...回忆中...</div>}
      {phase === 'ask' && (
        <div className="flex flex-col gap-4">
          <h3 className="text-xl">中间的字符是什么？</h3>
          <div className="flex gap-4">
             <button onClick={() => onComplete(100, "正确", "结果")} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded">7</button>
             <button onClick={() => onComplete(0, "错误", "结果")} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded">9</button>
             <button onClick={() => onComplete(0, "错误", "结果")} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded">T</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Level 4: Focus ---
export const FocusTrack: React.FC<TestModuleProps> = ({ onComplete }) => {
  // Simplified: Keep clicking the button that moves slightly
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
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const interval = setInterval(() => {
        setScore(s => s + 1);
    }, 100);
    const end = setTimeout(() => {
        clearInterval(interval);
        onComplete(score, `${Math.min(100, score)}%`, '覆盖率');
    }, 5000);
    return () => { clearInterval(interval); clearTimeout(end); }
  }, [score, onComplete]);

  return (
    <div className="relative w-full h-80 bg-slate-800 rounded cursor-none overflow-hidden group">
      <div className="absolute w-16 h-16 bg-red-500 rounded-full animate-bounce duration-[2000ms]" style={{ left: '50%', top: '20%' }} />
      <div className="absolute top-4 left-4">保持鼠标在红球上 (模拟) - 得分: {score}</div>
    </div>
  );
};

export const ReflexLight: React.FC<TestModuleProps> = ({ onComplete }) => {
    // Click when lit
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
    const seq = "839105";
    const [show, setShow] = useState(true);
    const [val, setVal] = useState("");

    useEffect(() => {
        setTimeout(() => setShow(false), 2000);
    }, []);

    const handleSubmit = () => {
        if (val === seq) onComplete(100, "全对", "精度");
        else onComplete(0, "错误", "精度");
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {show ? <div className="text-6xl tracking-widest font-mono">{seq}</div> : (
                <>
                    <input 
                      type="text" 
                      value={val} 
                      onChange={e => setVal(e.target.value)} 
                      className="bg-transparent border-b-2 border-cyan-500 text-3xl text-center outline-none"
                      placeholder="输入数字"
                    />
                    <button onClick={handleSubmit} className="px-6 py-2 bg-cyan-600 rounded">确认</button>
                </>
            )}
        </div>
    );
};

export const PatternMemory: React.FC<TestModuleProps> = ({ onComplete }) => {
    return <div className="text-center cursor-pointer" onClick={() => onComplete(80, "80", "分")}>点击以此演示完成短期记忆测试</div>
};

// --- Level 7: FPS ---
export const FPSAimTest: React.FC<TestModuleProps> = ({ onComplete }) => {
    const [targets, setTargets] = useState<{id: number, x: number, y: number}[]>([]);
    const [hits, setHits] = useState(0);
    const [total, setTotal] = useState(0);
    const areaRef = useRef<HTMLDivElement>(null);

    const spawn = useCallback(() => {
        if (!areaRef.current) return;
        const x = Math.random() * (areaRef.current.clientWidth - 40);
        const y = Math.random() * (areaRef.current.clientHeight - 40);
        setTargets(t => [...t, { id: Date.now(), x, y }]);
        setTotal(t => t + 1);
    }, []);

    useEffect(() => {
        const interval = setInterval(spawn, 600);
        const end = setTimeout(() => {
            clearInterval(interval);
            onComplete(hits, `${hits}/${total}`, "命中数");
        }, 5000);
        return () => { clearInterval(interval); clearTimeout(end); }
    }, [hits, total, spawn, onComplete]);

    const shoot = (id: number) => {
        setHits(h => h + 1);
        setTargets(t => t.filter(x => x.id !== id));
    };

    return (
        <div ref={areaRef} className="w-full h-96 bg-slate-900 relative overflow-hidden cursor-crosshair border border-slate-700">
            {targets.map(t => (
                <div 
                    key={t.id}
                    onMouseDown={(e) => { e.stopPropagation(); shoot(t.id); }}
                    className="absolute w-10 h-10 bg-cyan-500 rounded-full border-2 border-white flex items-center justify-center hover:bg-cyan-300 active:bg-red-500"
                    style={{ left: t.x, top: t.y }}
                >
                    <Crosshair size={16} className="text-slate-900" />
                </div>
            ))}
            <div className="absolute top-2 left-2 pointer-events-none text-cyan-500">命中: {hits}</div>
        </div>
    );
};