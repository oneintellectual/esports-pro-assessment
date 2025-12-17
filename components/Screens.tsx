import React, { useEffect, useState } from 'react';
import { User, ScoreRecord } from '../types';
import { Brain, Trophy, Activity, Target, Printer } from 'lucide-react';

// --- Welcome Screen ---
export const WelcomeScreen: React.FC<{ onStart: (username: string) => void }> = ({ onStart }) => {
  const [username, setUsername] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0f172a]">
      <div className="cyber-grid absolute inset-0 z-0 opacity-20" />
      
      <div className="z-10 bg-slate-800/80 p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-sm shadow-[0_0_50px_rgba(6,182,212,0.15)] max-w-md w-full text-center">
        <img src="https://raw.githubusercontent.com/oneintellectual/web/refs/heads/master/logo.png" alt="Logo" className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-cyan-400" />
        <h1 className="text-4xl font-display font-bold text-white mb-2">ESPORTS PRO EVAL</h1>
        <p className="text-cyan-400 mb-8 font-mono tracking-wide">职业电竞天赋综合评测系统</p>
        
        <input
          type="text"
          placeholder="输入您的ID / 代号"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-slate-900 border border-slate-600 text-white px-4 py-3 rounded mb-6 focus:outline-none focus:border-cyan-400 text-center font-bold text-lg"
        />
        
        <button
          onClick={() => username && onStart(username)}
          disabled={!username}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(8,145,178,0.4)]"
        >
          开始评测 / START
        </button>
      </div>
    </div>
  );
};

// --- Analysis Animation ---
export const AnalysisScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("初始化数据...");

  const texts = [
    "分析APM峰值...",
    "计算神经反应延迟...",
    "校准动态视觉模型...",
    "生成多维雷达图...",
    "上传至云端数据库...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 500);
          return 100;
        }
        return p + 1;
      });
    }, 40);

    const textInterval = setInterval(() => {
      setText(texts[Math.floor(Math.random() * texts.length)]);
    }, 800);

    return () => { clearInterval(interval); clearInterval(textInterval); };
  }, [onFinish]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-cyan-400 font-mono">
      <Activity size={64} className="animate-spin mb-8 text-cyan-500" />
      <h2 className="text-2xl mb-4 font-bold animate-pulse">{text}</h2>
      
      <div className="w-96 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <div 
          className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <div className="mt-2 text-sm text-slate-500">{progress}% COMPLETED</div>
    </div>
  );
};

// --- Results Overview ---
export const ResultsScreen: React.FC<{ scores: ScoreRecord[], username: string, onRestart: () => void }> = ({ scores, username, onRestart }) => {
  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 p-8 pb-20 print:bg-white print:text-black">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-12 border-b border-slate-700 print:border-black pb-6">
          <div className="flex items-center gap-4">
             <img src="https://raw.githubusercontent.com/oneintellectual/web/refs/heads/master/logo.png" alt="Logo" className="w-12 h-12 rounded-full print:hidden" />
             <div>
                <h1 className="text-3xl font-display font-bold text-white print:text-black">评测结果总览</h1>
                <p className="text-slate-400 text-sm print:text-gray-600">选手: <span className="text-cyan-400 print:text-black font-bold text-lg">{username}</span> | 综合能力详细数据单</p>
             </div>
          </div>
          <div className="flex gap-4 print:hidden">
            <button onClick={() => window.print()} className="px-4 py-2 border border-cyan-600 text-cyan-400 rounded hover:bg-cyan-900/30 text-sm flex items-center gap-2">
              <Printer size={16} /> 打印报告
            </button>
            <button onClick={onRestart} className="px-4 py-2 border border-slate-600 rounded hover:bg-slate-800 text-sm">
              重新测试
            </button>
          </div>
        </header>

        {/* Warning Badge */}
        <div className="mb-8 bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded text-yellow-200 text-sm print:border-black print:text-black print:bg-gray-100">
          注意：本报告仅展示各单项独立测试数据，不进行综合评分计算。请关注具体维度的表现。
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4 print:grid-cols-2">
          {scores.map((record, index) => (
            <div 
              key={index}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 flex items-center justify-between hover:border-cyan-500/50 transition-colors print:bg-white print:border-gray-300 print:break-inside-avoid"
            >
              <div>
                <div className="text-xs text-cyan-400 font-bold tracking-wider uppercase mb-1 print:text-black">{record.levelName}</div>
                <h3 className="text-lg font-bold text-white print:text-black">{record.testName}</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-display font-bold text-white print:text-black">
                  {record.displayScore} 
                  <span className="text-sm font-normal text-slate-500 ml-1 print:text-gray-600">{record.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center print:mt-8">
            <p className="text-slate-600 text-xs print:text-gray-400">Generated by EsportsPro Eval System v1.0</p>
        </div>
      </div>
    </div>
  );
};