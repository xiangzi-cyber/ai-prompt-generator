import { create } from 'zustand';
import { AIModel, Prompt, Template, GenerationParams, User, UserStats } from '@/types';
import { aiModels } from '@/data/aiModels';

interface AppState {
  // AI模型相关
  models: AIModel[];
  selectedModel: AIModel | null;
  
  // 提示词相关
  prompts: Prompt[];
  currentPrompt: string;
  generatedPrompt: string;
  generationParams: GenerationParams;
  
  // 模板相关
  templates: Template[];
  
  // 用户相关
  user: User | null;
  userStats: UserStats | null;
  
  // UI状态
  isGenerating: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  setSelectedModel: (model: AIModel | null) => void;
  setCurrentPrompt: (prompt: string) => void;
  setGeneratedPrompt: (prompt: string) => void;
  setGenerationParams: (params: Partial<GenerationParams>) => void;
  addPrompt: (prompt: Prompt) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  generatePrompt: (input: string, modelId: string, options?: any) => Promise<string>;
  autoMatchModel: (input: string) => AIModel | null;
}

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  models: aiModels,
  selectedModel: null,
  prompts: [],
  currentPrompt: '',
  generatedPrompt: '',
  generationParams: {
    creativity: 7,
    professionalism: 8,
    detail: 6,
    modelWeight: 0.8
  },
  templates: [],
  user: null,
  userStats: null,
  isGenerating: false,
  sidebarOpen: false,
  theme: 'light',
  
  // Actions
  setSelectedModel: (model) => set({ selectedModel: model }),
  
  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
  
  setGeneratedPrompt: (prompt) => set({ generatedPrompt: prompt }),
  
  setGenerationParams: (params) => set((state) => ({
    generationParams: { ...state.generationParams, ...params }
  })),
  
  addPrompt: (prompt) => set((state) => ({
    prompts: [prompt, ...state.prompts]
  })),
  
  updatePrompt: (id, updates) => set((state) => ({
    prompts: state.prompts.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  
  deletePrompt: (id) => set((state) => ({
    prompts: state.prompts.filter(p => p.id !== id)
  })),
  
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setTheme: (theme) => set({ theme }),
  
  // 智能匹配模型
  autoMatchModel: (input: string) => {
    const { models } = get();
    const inputLower = input.toLowerCase();
    
    // 关键词匹配规则
    const keywordRules = [
      { keywords: ['目标', '计划', '规划', 'kpi', '指标'], modelId: 'smart' },
      { keywords: ['分析', '问题', '原因', '解决', '情况'], modelId: 'star' },
      { keywords: ['创新', '创意', '改进', '优化', '设计'], modelId: 'scamper' },
      { keywords: ['营销', '推广', '广告', '文案', '销售'], modelId: 'aida' },
      { keywords: ['战略', '竞争', '优势', '劣势', '机会'], modelId: 'swot' },
      { keywords: ['流程', '改进', '质量', '循环', '迭代'], modelId: 'pdca' },
      { keywords: ['责任', '分工', '团队', '协作', '项目'], modelId: 'raci' },
      { keywords: ['教练', '引导', '对话', '成长', '发展'], modelId: 'grow' },
      { keywords: ['逻辑', '分类', '结构', '思维', '分析'], modelId: 'mece' },
      { keywords: ['报告', '演讲', '表达', '结构', '论证'], modelId: 'pyramid' },
      { keywords: ['什么', '谁', '何时', '何地', '为什么', '如何'], modelId: '5w1h' },
      { keywords: ['说服', '观点', '理由', '例证'], modelId: 'prep' },
      { keywords: ['执行', '战略', '目的', '措施'], modelId: 'ogsm' }
    ];
    
    // 计算每个模型的匹配分数
    const modelScores = models.map(model => {
      let score = 0;
      
      // 关键词匹配
      const matchingRule = keywordRules.find(rule => rule.modelId === model.id);
      if (matchingRule) {
        const matchCount = matchingRule.keywords.filter(keyword => 
          inputLower.includes(keyword)
        ).length;
        score += matchCount * 10;
      }
      
      // 使用场景匹配
      const useCaseMatches = model.useCases.filter(useCase => 
        inputLower.includes(useCase.toLowerCase())
      ).length;
      score += useCaseMatches * 5;
      
      // 复杂度权重（简单的模型优先推荐）
      score += (5 - model.complexity) * 2;
      
      return { model, score };
    });
    
    // 排序并返回最高分的模型
    modelScores.sort((a, b) => b.score - a.score);
    
    // 如果最高分大于0，返回该模型，否则返回默认的三段式模型
    if (modelScores[0].score > 0) {
      return modelScores[0].model;
    }
    
    return models.find(m => m.id === 'three-part') || null;
  },
  
  // 生成提示词的核心逻辑
  generatePrompt: async (input: string, modelId: string, options?: any) => {
    const { models, generationParams } = get();
    const model = models.find(m => m.id === modelId);
    
    if (!model) {
      throw new Error('模型未找到');
    }
    
    set({ isGenerating: true });
    const startTime = Date.now();
    
    try {
      console.log('🚀 开始调用Moonshot AI生成提示词...');
      console.log('📝 用户输入:', input.substring(0, 100) + (input.length > 100 ? '...' : ''));
      console.log('🎯 选择模型:', model.name, `(${model.id})`);
      console.log('⚙️ 生成参数:', generationParams);
      
      // 使用Moonshot API生成提示词（优化超时和重试设置）
      const { generatePromptWithMoonshot } = await import('@/services/moonshot');
      const apiOptions = {
        timeout: options?.timeout || 20000, // 使用传入的超时时间或默认20秒
        retries: 1,
        mode: options?.mode || 'standard',
        signal: options?.signal
      };
      const response = await generatePromptWithMoonshot(input, model, generationParams, apiOptions);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log('✅ Moonshot AI生成成功!');
      console.log('⏱️ 生成耗时:', `${duration}ms`);
      if (response.usage) {
        console.log('📊 Token使用情况:', {
          输入Token: response.usage.prompt_tokens,
          输出Token: response.usage.completion_tokens,
          总计Token: response.usage.total_tokens
        });
      }
      console.log('📄 生成内容长度:', response.content.length, '字符');
      
      const generatedPrompt = response.content;
      set({ generatedPrompt, isGenerating: false });
      
      return generatedPrompt;
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.warn('⚠️ Moonshot API调用失败，自动切换到本地模板生成');
      console.warn('❌ 错误信息:', error instanceof Error ? error.message : '未知错误');
      console.log('⏱️ 失败耗时:', `${duration}ms`);
      console.log('🔄 正在使用本地模板生成...');
      
      const localStartTime = Date.now();
      const structuredPrompt = generateStructuredPrompt(input, model, generationParams);
      const localEndTime = Date.now();
      const localDuration = localEndTime - localStartTime;
      
      console.log('✅ 本地模板生成完成');
      console.log('⏱️ 本地生成耗时:', `${localDuration}ms`);
      console.log('📄 生成内容长度:', structuredPrompt.length, '字符');
      
      set({ generatedPrompt: structuredPrompt, isGenerating: false });
      return structuredPrompt;
    }
  }
}));

// 生成结构化提示词的辅助函数
function generateStructuredPrompt(input: string, model: AIModel, params: GenerationParams): string {
  const { creativity, professionalism, detail, modelWeight } = params;
  
  // 根据不同模型生成不同结构的提示词
  switch (model.id) {
    case 'three-part':
      return generateThreePartPrompt(input, creativity, professionalism, detail);
    case 'star':
      return generateStarPrompt(input, creativity, professionalism, detail);
    case '5w1h':
      return generate5W1HPrompt(input, creativity, professionalism, detail);
    case 'smart':
      return generateSmartPrompt(input, creativity, professionalism, detail);
    default:
      return generateGenericPrompt(input, model, creativity, professionalism, detail);
  }
}

// 三段式提示词生成
function generateThreePartPrompt(input: string, creativity: number, professionalism: number, detail: number): string {
  const roleIntensity = professionalism > 7 ? '资深专业的' : professionalism > 4 ? '经验丰富的' : '有一定经验的';
  const detailLevel = detail > 7 ? '详细具体' : detail > 4 ? '清晰明确' : '简洁明了';
  
  return `# AI角色设定

## 角色定义
你是一位${roleIntensity}专业助手，具备深厚的专业知识和丰富的实践经验。

## 任务目标
${input}

## 执行要求
- 回答要${detailLevel}，逻辑清晰
- 提供实用可行的建议和方案
- 保持专业性和准确性
- 根据具体情况灵活调整策略

请基于以上设定，为用户提供高质量的专业服务。`;
}

// STAR模型提示词生成
function generateStarPrompt(input: string, creativity: number, professionalism: number, detail: number): string {
  return `# STAR框架分析

## 情境分析 (Situation)
请分析当前面临的具体情境和背景：
${input}

## 任务定义 (Task)
明确需要完成的核心任务和目标。

## 行动方案 (Action)
制定具体的执行步骤和行动计划。

## 预期结果 (Result)
描述期望达到的效果和成果。

请按照STAR框架，系统性地分析和解决问题。`;
}

// 5W1H模型提示词生成
function generate5W1HPrompt(input: string, creativity: number, professionalism: number, detail: number): string {
  return `# 5W1H全面分析

基于用户需求：${input}

请从以下六个维度进行全面分析：

## Who - 谁来执行
- 涉及的关键人员和角色
- 各方的职责和能力要求

## What - 做什么
- 具体的任务内容和范围
- 核心目标和关键成果

## When - 什么时候
- 时间安排和里程碑
- 优先级和紧急程度

## Where - 在哪里
- 执行地点和环境要求
- 相关的平台和工具

## Why - 为什么
- 背景原因和动机
- 价值和意义分析

## How - 如何执行
- 具体的方法和步骤
- 资源配置和风险控制

请确保分析全面、逻辑清晰。`;
}

// SMART模型提示词生成
function generateSmartPrompt(input: string, creativity: number, professionalism: number, detail: number): string {
  return `# SMART目标设定

基于需求：${input}

请按照SMART原则制定目标：

## Specific - 具体明确
- 明确定义要达成的具体目标
- 避免模糊和抽象的表述

## Measurable - 可衡量
- 设定量化的成功指标
- 建立可追踪的评估标准

## Achievable - 可实现
- 评估目标的可行性
- 考虑现有资源和能力

## Relevant - 相关性
- 确保目标与整体战略一致
- 分析目标的重要性和价值

## Time-bound - 有时限
- 设定明确的完成时间
- 制定阶段性的时间节点

请确保目标设定科学合理，具有可操作性。`;
}

// 通用模型提示词生成
function generateGenericPrompt(input: string, model: AIModel, creativity: number, professionalism: number, detail: number): string {
  const sections = model.structure.map((section, index) => {
    return `## ${index + 1}. ${section}
[请在此处详细阐述${section}相关内容]`;
  }).join('\n\n');
  
  return `# ${model.name}框架应用

基于用户需求：${input}

请按照${model.name}的结构进行分析：

${sections}

---

**框架说明**：${model.description}

**适用场景**：${model.useCases.join('、')}

请确保分析全面，逻辑清晰，具有实用价值。`;
}