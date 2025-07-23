import { AIModel } from '@/types';

export const aiModels: AIModel[] = [
  {
    id: 'three-part',
    name: '三段式模型',
    description: '最基础实用的提示词框架，适合快速构建清晰的AI指令',
    structure: ['我是谁（角色定位）', '我要干什么（任务目标）', '我有什么要求（具体约束）'],
    category: 'basic',
    complexity: 1,
    useCases: ['日常对话', '简单任务', '快速原型'],
    example: '我是一名经验丰富的旅行博主，设计一份5天去川西旅行行程攻略。攻略内容要求：风趣幽默，擅长用生动的文字描绘旅途见闻，并给出实用的旅行建议。',
    icon: 'MessageSquare'
  },
  {
    id: 'star',
    name: 'STAR模型',
    description: '结构化描述情境和行动的经典框架，适合复杂场景分析',
    structure: ['情境（Situation）', '任务（Task）', '行动（Action）', '结果（Result）'],
    category: 'advanced',
    complexity: 3,
    useCases: ['项目管理', '问题解决', '案例分析'],
    example: '情境：公司需要提升客户满意度；任务：制定客户服务改进方案；行动：分析现状、设计流程、培训团队；结果：客户满意度提升20%',
    icon: 'Target'
  },
  {
    id: '5w1h',
    name: '5W1H模型',
    description: '全面分析问题的六要素框架，确保信息完整性',
    structure: ['Who（谁）', 'What（什么）', 'When（何时）', 'Where（何地）', 'Why（为什么）', 'How（如何）'],
    category: 'basic',
    complexity: 2,
    useCases: ['新闻写作', '需求分析', '计划制定'],
    example: 'Who: 产品经理；What: 设计新功能；When: 下个季度；Where: 移动端应用；Why: 提升用户体验；How: 用户调研+原型设计',
    icon: 'HelpCircle'
  },
  {
    id: 'smart',
    name: 'SMART模型',
    description: '目标设定的黄金法则，确保目标可执行可衡量',
    structure: ['具体（Specific）', '可衡量（Measurable）', '可达成（Achievable）', '相关性（Relevant）', '时限性（Time-bound）'],
    category: 'advanced',
    complexity: 3,
    useCases: ['目标管理', '项目规划', 'KPI设定'],
    example: '具体：提升网站转化率；可衡量：从2%提升到3%；可达成：基于历史数据可行；相关性：直接影响业务收入；时限性：3个月内完成',
    icon: 'CheckCircle'
  },
  {
    id: 'prep',
    name: 'PREP模型',
    description: '说服性表达的经典结构，适合论证和演讲',
    structure: ['观点（Point）', '理由（Reason）', '例证（Example）', '观点（Point）'],
    category: 'basic',
    complexity: 2,
    useCases: ['演讲稿', '说服文案', '观点论证'],
    example: '观点：AI将改变教育；理由：个性化学习成为可能；例证：Khan Academy的成功案例；观点：因此我们应该拥抱AI教育',
    icon: 'MessageCircle'
  },
  {
    id: 'scamper',
    name: 'SCAMPER模型',
    description: '创新思维的七种方法，激发创意和改进思路',
    structure: ['替代（Substitute）', '组合（Combine）', '适应（Adapt）', '修改（Modify）', '其他用途（Put to other uses）', '消除（Eliminate）', '重新安排（Rearrange）'],
    category: 'specialized',
    complexity: 4,
    useCases: ['产品创新', '流程优化', '创意设计'],
    example: '替代：用AI替代人工客服；组合：结合语音和文字；适应：适应不同行业需求；修改：调整响应速度；其他用途：用于销售支持；消除：去除重复问题；重新安排：优化对话流程',
    icon: 'Lightbulb'
  },
  {
    id: 'grow',
    name: 'GROW模型',
    description: '教练式对话框架，引导思考和行动',
    structure: ['目标（Goal）', '现实（Reality）', '选择（Options）', '意愿（Will）'],
    category: 'advanced',
    complexity: 3,
    useCases: ['教练对话', '问题解决', '决策支持'],
    example: '目标：提升团队效率；现实：当前存在沟通不畅；选择：改进工具、培训、流程优化；意愿：团队愿意配合改进',
    icon: 'TrendingUp'
  },
  {
    id: 'aida',
    name: 'AIDA模型',
    description: '营销传播的经典漏斗模型，引导用户行动',
    structure: ['注意（Attention）', '兴趣（Interest）', '欲望（Desire）', '行动（Action）'],
    category: 'specialized',
    complexity: 3,
    useCases: ['营销文案', '广告策划', '销售话术'],
    example: '注意：你还在为写提示词发愁吗？兴趣：AI助手让提示词生成变得简单；欲望：专业模板+智能生成，效率提升10倍；行动：立即免费试用',
    icon: 'Megaphone'
  },
  {
    id: 'pdca',
    name: 'PDCA模型',
    description: '持续改进的循环模型，适合流程优化',
    structure: ['计划（Plan）', '执行（Do）', '检查（Check）', '行动（Act）'],
    category: 'advanced',
    complexity: 3,
    useCases: ['质量管理', '流程改进', '项目迭代'],
    example: '计划：制定用户体验改进方案；执行：实施新的界面设计；检查：收集用户反馈数据；行动：根据反馈调整优化',
    icon: 'RotateCcw'
  },
  {
    id: 'swot',
    name: 'SWOT模型',
    description: '战略分析的四维框架，全面评估内外部环境',
    structure: ['优势（Strengths）', '劣势（Weaknesses）', '机会（Opportunities）', '威胁（Threats）'],
    category: 'specialized',
    complexity: 4,
    useCases: ['战略规划', '竞品分析', '决策评估'],
    example: '优势：技术团队强；劣势：市场推广弱；机会：AI市场爆发；威胁：大厂竞争激烈',
    icon: 'Grid3X3'
  },
  {
    id: 'mece',
    name: 'MECE模型',
    description: '逻辑分析的黄金原则，确保思考的完整性和独立性',
    structure: ['相互独立（Mutually Exclusive）', '完全穷尽（Collectively Exhaustive）'],
    category: 'advanced',
    complexity: 4,
    useCases: ['问题分析', '分类整理', '逻辑思考'],
    example: '用户分类：新用户（独立）、老用户（独立）；覆盖所有用户（穷尽）；按使用频率：高频、中频、低频用户',
    icon: 'Layers'
  },
  {
    id: 'pyramid',
    name: '金字塔原理',
    description: '结构化表达的核心方法，让思路更清晰',
    structure: ['结论先行', '以上统下', '归类分组', '逻辑递进'],
    category: 'advanced',
    complexity: 4,
    useCases: ['报告写作', '演讲结构', '思维整理'],
    example: '结论：应该投资AI项目；理由1：市场前景好；理由2：技术可行；理由3：团队有经验；每个理由下有具体支撑',
    icon: 'Triangle'
  },
  {
    id: 'ogsm',
    name: 'OGSM模型',
    description: '战略执行的四层框架，从目标到措施的完整链条',
    structure: ['目标（Objective）', '目的（Goal）', '策略（Strategy）', '措施（Measure）'],
    category: 'specialized',
    complexity: 4,
    useCases: ['战略规划', '目标分解', '执行管理'],
    example: '目标：成为行业领导者；目的：市场份额达到30%；策略：产品差异化+渠道扩张；措施：研发投入+销售团队扩充',
    icon: 'Flag'
  },
  {
    id: 'raci',
    name: 'RACI模型',
    description: '责任分工的清晰框架，避免职责混乱',
    structure: ['负责（Responsible）', '批准（Accountable）', '咨询（Consulted）', '知情（Informed）'],
    category: 'specialized',
    complexity: 3,
    useCases: ['项目管理', '团队协作', '流程设计'],
    example: '负责：开发团队执行；批准：产品经理决策；咨询：设计师提供建议；知情：运营团队了解进展',
    icon: 'Users'
  }
];

// 按分类获取模型
export const getModelsByCategory = (category: string) => {
  return aiModels.filter(model => model.category === category);
};

// 按复杂度获取模型
export const getModelsByComplexity = (complexity: number) => {
  return aiModels.filter(model => model.complexity === complexity);
};

// 获取推荐模型（基于使用场景）
export const getRecommendedModels = (useCase: string) => {
  return aiModels.filter(model => 
    model.useCases.some(uc => uc.toLowerCase().includes(useCase.toLowerCase()))
  );
};