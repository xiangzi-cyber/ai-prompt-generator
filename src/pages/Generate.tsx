import React, { useState } from 'react';
import { Wand2, Brain, Lightbulb, Copy, Download, Save, RefreshCw, Settings, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ModelCard } from '@/components/ModelCard';
import { ApiConnectionTest } from '@/components/ApiConnectionTest';
import { useAppStore } from '@/store';
import { aiModels, getModelsByCategory } from '@/data/aiModels';
import type { AIModel } from '@/types';

export default function Generate() {
  const { selectedModel, setSelectedModel, generatePrompt, generatedPrompt, isGenerating, setIsGenerating, autoMatchModel } = useAppStore();
  const [userInput, setUserInput] = useState('');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [matchedModel, setMatchedModel] = useState<AIModel | null>(null);
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [generationMode, setGenerationMode] = useState<'standard' | 'fast'>('standard');
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  
  // 生成参数
  const [params, setParams] = useState({
    creativity: 0.7,
    detail: 0.8,
    structure: 0.9,
    examples: true,
    constraints: true
  });
  
  const categories = [
    { id: 'all', name: '全部模型' },
    { id: 'basic', name: '基础框架' },
    { id: 'analysis', name: '分析思考' },
    { id: 'creative', name: '创意设计' },
    { id: 'management', name: '管理决策' }
  ];
  
  const filteredModels = selectedCategory === 'all' 
    ? aiModels 
    : getModelsByCategory(selectedCategory);
  
  const handleGenerate = async () => {
    if (!userInput.trim()) return;
    
    setIsGenerating(true);
    
    // 创建新的AbortController
    const controller = new AbortController();
    setAbortController(controller);
    
    // 添加生成开始时间记录
    const startTime = Date.now();
    
    try {
      console.log('🚀 开始生成，AbortController状态:', {
        signal: controller.signal,
        aborted: controller.signal.aborted
      });
      
      if (!selectedModel) {
        // 如果没有选择模型，使用默认的三段式模型
        const defaultModel = aiModels.find(m => m.id === 'three-part');
        if (defaultModel) {
          setSelectedModel(defaultModel);
          await generatePrompt(userInput, defaultModel.id, {
            timeout: generationMode === 'fast' ? 15000 : 30000, // 快速模式15秒，标准模式30秒
            mode: generationMode,
            signal: controller.signal // 传递取消信号
          });
        }
      } else {
        await generatePrompt(userInput, selectedModel.id, {
          timeout: generationMode === 'fast' ? 15000 : 30000,
          mode: generationMode,
          signal: controller.signal // 传递取消信号
        });
      }
      
      // 记录生成时间
      const endTime = Date.now();
      console.log(`✅ 生成完成，耗时: ${(endTime - startTime) / 1000}秒`);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('🛑 用户取消了生成');
      } else {
        console.error('❌ 生成失败:', error);
        // 可以添加错误提示
      }
    } finally {
      setIsGenerating(false);
      setAbortController(null);
    }
  };
  
  const handleCancelGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };
  
  const handleCopy = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      // 可以添加toast提示
    }
  };
  
  const handleSave = () => {
    // 保存到用户的提示词库
    console.log('保存提示词');
  };
  
  const handleAutoMatch = () => {
    if (!userInput.trim()) return;
    
    const matched = autoMatchModel(userInput);
    if (matched) {
      setMatchedModel(matched);
      setShowMatchResult(true);
    }
  };
  
  const handleAcceptMatch = () => {
    if (matchedModel) {
      setSelectedModel(matchedModel);
      setShowMatchResult(false);
      setMatchedModel(null);
    }
  };
  
  const handleRejectMatch = () => {
    setShowMatchResult(false);
    setMatchedModel(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">智能提示词生成器</h1>
          <p className="text-lg text-gray-600 mb-4">输入你的需求设想，AI会为你生成专业的结构化提示词</p>
          
          {/* API连接状态 */}
          <div className="flex justify-center">
            <ApiConnectionTest className="bg-white rounded-lg px-4 py-2 shadow-sm border" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：输入区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 需求输入 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <span>需求设想</span>
                </CardTitle>
                <CardDescription>
                  用自然语言描述你的需求，例如：设计一位资深高考志愿规划师...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="请详细描述你的需求设想，包括角色定位、主要功能、预期效果等..."
                  rows={6}
                  className="resize-none"
                />
                
                {/* 智能匹配按钮 */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAutoMatch}
                    disabled={!userInput.trim()}
                    icon={Brain}
                  >
                    智能匹配模型
                  </Button>
                  
                  {userInput.trim() && (
                    <span className="text-sm text-gray-500">
                      输入内容后点击智能匹配，系统将自动推荐最适合的AI模型
                    </span>
                  )}
                </div>
                
                {/* 快速示例 */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">快速示例：</span>
                  {[
                    '高考志愿规划师',
                    '产品需求分析师',
                    '创意文案策划',
                    '项目管理顾问'
                  ].map((example) => (
                    <div
                      key={example}
                      className="cursor-pointer hover:bg-blue-100"
                      onClick={() => setUserInput(`设计一位专业的${example}，要求...`)}
                    >
                      <Badge variant="info">
                        {example}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* 智能匹配结果 */}
            {showMatchResult && matchedModel && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-900">智能匹配推荐</span>
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    基于您的需求描述，系统推荐使用以下模型：
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <ModelCard
                      model={matchedModel}
                      compact
                      selected={false}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      size="sm"
                      onClick={handleAcceptMatch}
                      icon={CheckCircle}
                    >
                      采用推荐
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRejectMatch}
                    >
                      手动选择
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* AI模型选择 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-blue-500" />
                    <span>AI沟通模型</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowModelSelector(!showModelSelector)}
                    icon={showModelSelector ? ChevronUp : ChevronDown}
                  >
                    {selectedModel ? selectedModel.name : '选择模型'}
                  </Button>
                </CardTitle>
                {selectedModel && (
                  <CardDescription>
                    当前选择：{selectedModel.name} - {selectedModel.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              {showModelSelector && (
                <CardContent>
                  {/* 分类筛选 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((category) => (
                      <div
                         key={category.id}
                         className="cursor-pointer"
                         onClick={() => setSelectedCategory(category.id)}
                        >
                         <Badge
                            variant={selectedCategory === category.id ? 'default' : 'info'}
                          >
                           {category.name}
                          </Badge>
                         </div>
                    ))}
                  </div>
                  
                  {/* 模型列表 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {filteredModels.map((model) => (
                      <ModelCard
                        key={model.id}
                        model={model}
                        compact
                        selected={selectedModel?.id === model.id}
                        onSelect={(model) => {
                          setSelectedModel(model);
                          setShowModelSelector(false);
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
            
            {/* 高级设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span>生成参数</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    icon={showAdvanced ? ChevronUp : ChevronDown}
                  >
                    高级设置
                  </Button>
                </CardTitle>
              </CardHeader>
              
              {showAdvanced && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        生成模式
                      </label>
                      <select
                        value={generationMode}
                        onChange={(e) => setGenerationMode(e.target.value as 'standard' | 'fast')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="standard">标准模式 (详细)</option>
                        <option value="fast">快速模式 (简洁)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        创意度: {params.creativity}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={params.creativity}
                        onChange={(e) => setParams({...params, creativity: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        详细度: {params.detail}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={params.detail}
                        onChange={(e) => setParams({...params, detail: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        结构化: {params.structure}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={params.structure}
                        onChange={(e) => setParams({...params, structure: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={params.examples}
                        onChange={(e) => setParams({...params, examples: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">包含示例</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={params.constraints}
                        onChange={(e) => setParams({...params, constraints: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">添加约束条件</span>
                    </label>
                  </div>
                </CardContent>
              )}
            </Card>
            
            {/* 生成按钮 */}
            <div className="flex flex-col items-center space-y-2">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={!userInput.trim() || isGenerating}
                loading={isGenerating}
                icon={Wand2}
                className="px-8"
              >
                {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <span>正在调用AI生成...</span>
                      <span className="text-xs opacity-75">
                        ({generationMode === 'fast' ? '快速模式 5-10秒' : '标准模式 10-20秒'})
                      </span>
                    </div>
                  ) : (
                    '生成结构化提示词'
                  )}
              </Button>
              
              {isGenerating && (
                 <div className="text-center space-y-3">
                   <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                     <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                   </div>
                   <p className="text-sm text-gray-600">
                     AI正在分析您的需求并生成专业提示词...
                     <br />
                     <span className="text-xs text-gray-500">
                       {generationMode === 'fast' ? '快速模式预计5-10秒' : '标准模式预计10-20秒'}
                     </span>
                   </p>
                   <Button
                     onClick={handleCancelGeneration}
                     variant="outline"
                     size="sm"
                     className="text-red-600 border-red-300 hover:bg-red-50"
                   >
                     取消生成
                   </Button>
                 </div>
               )}
            </div>
          </div>
          
          {/* 右侧：生成结果 */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>生成结果</span>
                  {generatedPrompt && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" onClick={handleCopy} icon={Copy}>
                        复制
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleSave} icon={Save}>
                        保存
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {generatedPrompt ? (
                  <div className="space-y-4">
                    {/* 提示词内容 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">结构化提示词</h4>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {generatedPrompt}
                      </div>
                    </div>
                    
                    {/* 元数据 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">使用模型：</span>
                        <Badge variant="info">{selectedModel?.name || '未知模型'}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">字符数：</span>
                        <span className="text-gray-700">{generatedPrompt.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">生成时间：</span>
                        <span className="text-gray-700">
                          {new Date().toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* 重新生成 */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      icon={RefreshCw}
                      className="w-full"
                    >
                      重新生成
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wand2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">输入需求并选择AI模型后，点击生成按钮</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}