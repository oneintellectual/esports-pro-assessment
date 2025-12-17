export interface User {
  username: string;
  startedAt: number;
}

export interface ScoreRecord {
  levelId: number;
  levelName: string;
  testId: string;
  testName: string;
  score: number;
  unit: string; // e.g., 'ms', '分', '命中数'
  displayScore: string; // Formatted string for UI
}

export interface TestConfig {
  id: string;
  name: string;
  description: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  tests: TestConfig[];
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "基础素质",
    tests: [
      { id: "psych", name: "电竞心理", description: "抗压能力与心态评估" },
      { id: "personality", name: "四色性格", description: "团队定位风格分析" }
    ]
  },
  {
    id: 2,
    name: "反应能力",
    tests: [
      { id: "simple_reaction", name: "极致反应", description: "看到绿色立即点击" },
      { id: "choice_reaction", name: "思维反应", description: "斯特鲁普颜色干扰测试" },
      { id: "grid_reaction", name: "连点测试", description: "快速消除出现的目标" }
    ]
  },
  {
    id: 3,
    name: "动态视力",
    tests: [
      { id: "static_vision", name: "静态捕捉", description: "找出不同颜色的方块" },
      { id: "dynamic_vision", name: "动态预判", description: "移动物体停止时机" },
      { id: "flash_memory", name: "瞬时捕捉", description: "闪现图像细节回忆" }
    ]
  },
  {
    id: 4,
    name: "专注耐久",
    tests: [
      { id: "focus_track", name: "抗干扰专注", description: "追踪目标物体" }
    ]
  },
  {
    id: 5,
    name: "手眼协同",
    tests: [
      { id: "tracking", name: "动态追踪", description: "鼠标跟随移动目标" },
      { id: "reflex", name: "光点响应", description: "熄灭亮起的灯" }
    ]
  },
  {
    id: 6,
    name: "记忆能力",
    tests: [
      { id: "seq_memory", name: "数字记忆", description: "回忆随机数字序列" },
      { id: "pattern_memory", name: "短期记忆", description: "判断图案是否出现过" }
    ]
  },
  {
    id: 7,
    name: "FPS专项",
    tests: [
      { id: "fps_aim", name: "射击精度", description: "模拟FPS射击测试" }
    ]
  }
];