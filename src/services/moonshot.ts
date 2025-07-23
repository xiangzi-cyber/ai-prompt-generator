import OpenAI from 'openai';
import { AIModel } from '@/types';

// Moonshot API配置
const MOONSHOT_API_KEY = import.meta.env.VITE_MOONSHOT_API_KEY || 'sk-8yDK62Qpe8CKibB4lOTiVBM0brB3wDTmdZtnjDNR6LUN0oV1';
const MOONSHOT_BASE_URL = import.meta.env.VITE_MOONSHOT_BASE_URL || 'https://api.moonshot.cn/v1';
const MOONSHOT_MODEL = import.meta.env.VITE_MOONSHOT_MODEL || 'kimi-k2-0711-preview';

// 创建OpenAI客户端实例（通过代理）
const client = new OpenAI({
  apiKey: MOONSHOT_API_KEY,
  baseURL: '/api/moonshot', // 修正代理路径，移除/v1
  dangerouslyAllowBrowser: true, // 允许在浏览器环境中使用
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30秒超时
});

// API代理配置（开发环境使用Vite代理，生产环境使用Vercel函数）
const PROXY_URL = '/api/moonshot'; // 统一代理路径
const USE_PROXY = true; // 是否使用代理

// 生成参数接口
interface GenerationParams {
  creativity: number;
  professionalism: number;
  detail: number;
  modelWeight: number;
}

// API响应接口
interface MoonshotResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 调用Moonshot API生成结构化提示词
 * @param userInput 用户输入的需求描述
 * @param model 选择的AI沟通模型
 * @param params 生成参数
 * @returns 生成的结构化提示词
 */
export async function generatePromptWithMoonshot(
  userInput: string,
  model: AIModel,
  params: GenerationParams,
  options: { timeout?: number; retries?: number; mode?: 'standard' | 'fast'; signal?: AbortSignal } = {}
): Promise<MoonshotResponse> {
  const { timeout = 25000, retries = 2, mode = 'standard', signal } = options; // 默认25秒超时，2次重试
  
  // 生产环境现在支持通过Vercel代理使用API
  const isProd = isProductionEnvironment();
  console.log('🌍 环境检测:', isProd ? '生产环境' : '开发环境');
  console.log('🔧 API支持状态:', isProductionApiSupported() ? '支持' : '不支持');
  
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      console.log(`🚀 第${attempt}次尝试调用Moonshot API...`);
      console.log('🔑 API Key:', MOONSHOT_API_KEY ? `${MOONSHOT_API_KEY.substring(0, 10)}...` : '未设置');
      console.log('🌐 Base URL:', MOONSHOT_BASE_URL);
      console.log('🤖 Model:', MOONSHOT_MODEL);
      
      // 构建提示词
       const systemPrompt = buildSystemPrompt(model, { ...params, mode });
       const userPrompt = buildUserPrompt(userInput, model, { ...params, mode });
       
       // 根据模式调整API参数
       const isQuickMode = mode === 'fast';
   
       const requestData = {
         model: MOONSHOT_MODEL,
         messages: [
           {
             role: 'system' as const,
             content: systemPrompt
           },
           {
             role: 'user' as const,
             content: userPrompt
           }
         ],
         temperature: isQuickMode ? 0.3 : Math.min(params.creativity / 10, 0.8),
         max_tokens: isQuickMode ? 800 : 1500, // 快速模式减少token数
         top_p: isQuickMode ? 0.7 : 0.85,
         frequency_penalty: isQuickMode ? 0.2 : 0.1,
         presence_penalty: isQuickMode ? 0.1 : 0.1,
       };
       
       console.log(`🎯 使用${isQuickMode ? '快速' : '标准'}模式生成，预计耗时${isQuickMode ? '5-10' : '10-20'}秒`);
  
      // 使用代理调用（带超时控制）
      try {
        console.log('📡 通过代理调用Moonshot API...');
        
        // 创建带超时和信号的Promise
        const completionPromise = client.chat.completions.create(
          requestData,
          {
            signal: signal, // 传递AbortSignal给OpenAI客户端
            timeout: timeout // 超时设置在options中
          }
        );
        
        const completion = await completionPromise as any;
        
        const content = completion.choices[0]?.message?.content || '';
        console.log('✅ 代理调用成功');
        
        return {
          content,
          usage: completion.usage ? {
            prompt_tokens: completion.usage.prompt_tokens,
            completion_tokens: completion.usage.completion_tokens,
            total_tokens: completion.usage.total_tokens
          } : undefined
        };
      } catch (clientError) {
        console.warn(`⚠️ 第${attempt}次代理调用失败:`, clientError);
    
        // 备用方案：直接fetch调用
        try {
          const apiUrl = PROXY_URL; // 直接调用serverless函数
          console.log('🔄 尝试备用fetch调用:', apiUrl);
          
          // 使用外部signal或创建新的AbortController
          let fetchSignal = signal;
          let timeoutId: NodeJS.Timeout | null = null;
          
          if (!signal) {
            const controller = new AbortController();
            fetchSignal = controller.signal;
            timeoutId = setTimeout(() => controller.abort(), timeout);
          }
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${MOONSHOT_API_KEY}`,
            },
            body: JSON.stringify(requestData),
            signal: fetchSignal
          });
          
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
      
      console.log('📊 Fetch响应状态:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API响应错误:', response.status, errorText);
        
        // 分析具体错误
        if (response.status === 401) {
          throw new Error('API密钥无效或已过期，请检查MOONSHOT_API_KEY配置');
        } else if (response.status === 429) {
          throw new Error('API调用频率超限，请稍后重试');
        } else if (response.status === 403) {
          throw new Error('API访问被拒绝，请检查账户权限和余额');
        } else {
          throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      console.log('✅ 直接fetch调用成功');
      
          return {
            content,
            usage: data.usage
          };
        } catch (fetchError) {
          console.error(`❌ 第${attempt}次fetch调用失败:`, fetchError);
          
          // 如果是最后一次尝试，抛出错误
          if (attempt === retries + 1) {
            const errorMessage = analyzeError(fetchError, fetchError);
            throw new Error(errorMessage);
          }
          
          // 否则等待一段时间后重试
          const waitTime = attempt * 1000; // 递增等待时间
          console.log(`⏳ 等待${waitTime}ms后进行第${attempt + 1}次重试...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    } catch (outerError) {
      console.error(`❌ 第${attempt}次尝试完全失败:`, outerError);
      
      // 如果是最后一次尝试，抛出错误
      if (attempt === retries + 1) {
        const errorMessage = analyzeError(outerError, outerError);
        throw new Error(errorMessage);
      }
      
      // 否则等待一段时间后重试
      const waitTime = attempt * 1000;
      console.log(`⏳ 等待${waitTime}ms后进行第${attempt + 1}次重试...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  // 如果所有重试都失败，抛出最终错误
  throw new Error('所有重试尝试都失败了');
}

/**
 * 分析错误类型并返回用户友好的错误信息
 */
function analyzeError(clientError: any, fetchError: any): string {
  console.log('🔍 错误分析:');
  console.log('客户端错误:', clientError);
  console.log('Fetch错误:', fetchError);
  
  // 检查是否是CORS错误
  if (fetchError instanceof TypeError && fetchError.message.includes('Failed to fetch')) {
    return '❌ 跨域访问被阻止\n\n🔧 解决方案：\n1. Moonshot API不支持浏览器直接调用\n2. 需要通过后端服务器代理请求\n3. 或者使用CORS代理服务\n\n💡 当前将自动切换到本地模板生成';
  }
  
  // 检查网络连接问题
  if (fetchError instanceof TypeError && fetchError.message.includes('network')) {
    return '❌ 网络连接失败\n\n🔧 解决方案：\n1. 检查网络连接\n2. 确认防火墙设置\n3. 尝试使用VPN';
  }
  
  // 检查API密钥问题
  if (clientError?.message?.includes('401') || fetchError?.message?.includes('401')) {
    return '❌ API密钥无效\n\n🔧 解决方案：\n1. 检查.env.local文件中的MOONSHOT_API_KEY\n2. 确认API密钥格式正确\n3. 验证API密钥是否已过期';
  }
  
  // 检查频率限制
  if (clientError?.message?.includes('429') || fetchError?.message?.includes('429')) {
    return '❌ API调用频率超限\n\n🔧 解决方案：\n1. 等待一段时间后重试\n2. 检查API配额使用情况\n3. 考虑升级API套餐';
  }
  
  // 默认错误信息
  const errorDetails = clientError?.message || fetchError?.message || '未知错误';
  return `❌ API调用失败: ${errorDetails}\n\n💡 将自动切换到本地模板生成`;
}

/**
 * 构建系统提示词
 */
function buildSystemPrompt(model: AIModel, params: GenerationParams & { mode?: 'standard' | 'fast' }): string {
  const isQuickMode = params.mode === 'fast';
  
  if (isQuickMode) {
    // 快速模式：简化的系统提示词
    return `你是AI提示词专家。根据用户需求生成简洁有效的${model.name}提示词。

输出格式：
1. 角色：[角色定义]
2. 任务：[任务描述]
3. 要求：[关键要求]
4. 格式：[输出格式]

要求：简洁明确，直接可用，创意${params.creativity}/10。`;
  }
  
  // 标准模式：详细的系统提示词
  const professionalLevel = params.professionalism > 7 ? '资深专家级' : 
                           params.professionalism > 4 ? '专业级' : '入门级';
  
  const detailLevel = params.detail > 7 ? '极其详细和具体' : 
                     params.detail > 4 ? '详细清晰' : '简洁明了';
  
  return `你是一位${professionalLevel}的AI提示词工程师，专门负责将用户的需求设想转换为高质量的结构化提示词。

## 你的专业能力
- 深度理解各种AI沟通模型的特点和应用场景
- 精通提示词工程的最佳实践
- 能够根据不同需求选择最适合的框架结构
- 擅长将抽象需求转化为具体可执行的指令

## 当前任务要求
- 使用「${model.name}」框架进行结构化设计
- 回答要${detailLevel}，逻辑清晰
- 确保生成的提示词具有高度的可操作性和实用性
- 保持专业性和准确性

## ${model.name}框架说明
**描述**: ${model.description}
**结构要素**: ${model.structure.join('、')}
**适用场景**: ${model.useCases.join('、')}
**复杂度级别**: ${model.complexity}/5

请严格按照${model.name}的框架结构，为用户生成专业的结构化提示词。`;
}

/**
 * 构建用户提示词
 */
function buildUserPrompt(userInput: string, model: AIModel, params: GenerationParams & { mode?: 'standard' | 'fast' }): string {
  const isQuickMode = params.mode === 'fast';
  
  if (isQuickMode) {
    // 快速模式：简化的用户提示词
    return `需求：${userInput}
模型：${model.name}
创意：${params.creativity}/10

生成提示词：`;
  }
  
  // 标准模式：详细的用户提示词
  const includeExamples = params.detail > 6;
  const includeConstraints = params.professionalism > 5;
  
  let prompt = `请基于以下用户需求，使用「${model.name}」框架生成一个完整的结构化提示词：

**用户需求描述**：
${userInput}

**生成要求**：
1. 严格按照${model.name}的框架结构组织内容
2. 每个结构要素都要有具体的内容填充
3. 确保逻辑清晰，层次分明
4. 语言要专业且易于理解
5. 生成的提示词要能直接用于AI对话`;
  
  if (includeExamples) {
    prompt += `\n6. 在适当位置提供具体的示例说明`;
  }
  
  if (includeConstraints) {
    prompt += `\n7. 明确指出执行约束和注意事项`;
  }
  
  prompt += `\n\n**输出格式**：
请以Markdown格式输出，使用清晰的标题层级和结构化布局。确保生成的内容可以直接复制使用。`;
  
  return prompt;
}

// 检测是否为生产环境
function isProductionEnvironment(): boolean {
  return import.meta.env.PROD || window.location.protocol === 'https:' || !window.location.hostname.includes('localhost');
}

// 检查生产环境是否支持API
function isProductionApiSupported(): boolean {
  // 生产环境现在支持通过Vercel serverless函数调用API
  return true;
}

/**
 * 测试API连接
 */
export async function testMoonshotConnection(): Promise<boolean> {
  try {
    console.log('🔄 开始测试Moonshot API连接...');
    console.log('🔑 API Key:', MOONSHOT_API_KEY ? `${MOONSHOT_API_KEY.substring(0, 10)}...` : '未设置');
    console.log('🌐 Base URL:', MOONSHOT_BASE_URL);
    console.log('🤖 模型:', MOONSHOT_MODEL);
    
    // 环境检测（生产环境现在支持通过Vercel代理使用API）
    console.log('🌍 当前环境:', isProductionEnvironment() ? '生产环境' : '开发环境');
    
    // 使用代理路径进行连接测试
    const apiUrl = PROXY_URL; // 直接调用serverless函数
    console.log('🔗 测试URL:', apiUrl);
    
    const requestData = {
      model: MOONSHOT_MODEL,
      messages: [
        {
          role: 'user' as const,
          content: '你好，请回复"连接成功"'
        }
      ],
      max_tokens: 10
    };
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MOONSHOT_API_KEY}`,
      },
      body: JSON.stringify(requestData)
    });
    
    console.log('📊 连接测试响应状态:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 连接测试失败:', response.status, errorText);
      
      // 分析具体错误
      if (response.status === 401) {
        console.error('🔑 API密钥无效或已过期');
      } else if (response.status === 429) {
        console.error('⏱️ API调用频率超限');
      } else if (response.status === 403) {
        console.error('🚫 API访问被拒绝，请检查账户权限和余额');
      } else if (response.status === 405) {
        console.error('🚫 HTTP方法不被允许，可能是生产环境限制');
      }
      
      return false;
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    const isSuccess = content.includes('连接成功');
    
    if (isSuccess) {
      console.log('✅ Moonshot API连接测试成功!');
      console.log('📝 响应内容:', content);
      if (data.usage) {
        console.log('📊 Token使用:', data.usage);
      }
    } else {
      console.warn('⚠️ API响应异常:', content);
    }
    
    return isSuccess;
  } catch (error) {
    console.error('❌ Moonshot API连接测试失败:');
    console.error('错误类型:', error?.constructor?.name || 'Unknown');
    console.error('错误信息:', error instanceof Error ? error.message : String(error));
    
    // 检查是否是网络错误
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('🌐 网络连接失败，可能是CORS问题或网络不可达');
    }
    
    return false;
  }
}

// 导出配置信息用于调试
export const moonshotConfig = {
  apiKey: MOONSHOT_API_KEY ? `${MOONSHOT_API_KEY.substring(0, 10)}...` : '未设置',
  baseUrl: MOONSHOT_BASE_URL,
  model: MOONSHOT_MODEL,
  useProxy: USE_PROXY,
  proxyUrl: PROXY_URL
};