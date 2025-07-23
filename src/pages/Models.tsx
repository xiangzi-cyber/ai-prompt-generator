import React, { useState } from 'react';
import { Search, Filter, Grid, List, BookOpen, Star, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ModelCard } from '@/components/ModelCard';
import { useAppStore } from '@/store';
import { aiModels, getModelsByCategory, getModelsByComplexity } from '@/data/aiModels';
import type { AIModel } from '@/types';

export default function Models() {
  const { setSelectedModel } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComplexity, setSelectedComplexity] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedModel, setSelectedModelLocal] = useState<AIModel | null>(null);
  
  const categories = [
    { id: 'all', name: '全部模型', count: aiModels.length },
    { id: 'basic', name: '基础框架', count: getModelsByCategory('basic').length },
    { id: 'analysis', name: '分析思考', count: getModelsByCategory('analysis').length },
    { id: 'creative', name: '创意设计', count: getModelsByCategory('creative').length },
    { id: 'management', name: '管理决策', count: getModelsByCategory('management').length }
  ];
  
  const complexityLevels = [
    { level: 1, name: '简单', description: '易于理解和应用' },
    { level: 2, name: '中等', description: '需要一定经验' },
    { level: 3, name: '复杂', description: '适合专业用户' }
  ];
  
  // 过滤模型
  const filteredModels = aiModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.useCases.some(useCase => useCase.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    const matchesComplexity = selectedComplexity === null || model.complexity === selectedComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });
  
  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
    setSelectedModelLocal(model);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedComplexity(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI沟通模型库</h1>
          <p className="text-lg text-gray-600">14种经过实践验证的专业框架，助你构建高质量提示词</p>
        </div>
        
        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{aiModels.length}</div>
              <div className="text-sm text-gray-600">AI沟通模型</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{getModelsByCategory('basic').length}</div>
              <div className="text-sm text-gray-600">基础框架</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{getModelsByCategory('analysis').length}</div>
              <div className="text-sm text-gray-600">分析思考</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{getModelsByCategory('management').length}</div>
              <div className="text-sm text-gray-600">管理决策</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：筛选器 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>筛选器</span>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    清除
                  </Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* 搜索 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    搜索模型
                  </label>
                  <Input
                    type="text"
                    placeholder="搜索模型名称或描述..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={Search}
                  />
                </div>
                
                {/* 分类筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    模型分类
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-100 text-blue-800'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <span className="text-sm">{category.name}</span>
                        <Badge variant="info" size="sm">{category.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 复杂度筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    复杂度等级
                  </label>
                  <div className="space-y-2">
                    {complexityLevels.map((level) => (
                      <div
                        key={level.level}
                        className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                          selectedComplexity === level.level
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => 
                          setSelectedComplexity(
                            selectedComplexity === level.level ? null : level.level
                          )
                        }
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{level.name}</span>
                          <div className="flex space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < level.level ? 'bg-yellow-400' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{level.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 右侧：模型列表 */}
          <div className="lg:col-span-3">
            {/* 工具栏 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  找到 {filteredModels.length} 个模型
                </span>
                {(searchTerm || selectedCategory !== 'all' || selectedComplexity !== null) && (
                  <div className="flex items-center space-x-2">
                    {searchTerm && (
                      <Badge variant="info">搜索: {searchTerm}</Badge>
                    )}
                    {selectedCategory !== 'all' && (
                      <Badge variant="info">
                        分类: {categories.find(c => c.id === selectedCategory)?.name}
                      </Badge>
                    )}
                    {selectedComplexity !== null && (
                      <Badge variant="info">
                        复杂度: {complexityLevels.find(l => l.level === selectedComplexity)?.name}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  icon={Grid}
                >
                  网格
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  icon={List}
                >
                  列表
                </Button>
              </div>
            </div>
            
            {/* 模型展示 */}
            {filteredModels.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredModels.map((model) => (
                  <ModelCard
                      key={model.id}
                      model={model}
                      compact={viewMode === 'list'}
                      selected={selectedModel?.id === model.id}
                      onSelect={handleModelSelect}
                      onViewDetails={() => setSelectedModelLocal(model)}
                    />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的模型</h3>
                  <p className="text-gray-600 mb-4">尝试调整搜索条件或筛选器</p>
                  <Button variant="outline" onClick={clearFilters}>
                    清除所有筛选器
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* 模型详情弹窗 */}
        {selectedModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedModel.name}</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedModelLocal(null)}
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">模型描述</h3>
                    <p className="text-gray-600 mb-4">{selectedModel.description}</p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">框架结构</h3>
                    <div className="space-y-2 mb-4">
                      {selectedModel.structure.map((item, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{item}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">适用场景</h3>
                    <div className="space-y-2 mb-4">
                      {selectedModel.useCases.map((useCase, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          <span className="text-gray-700">{useCase}</span>
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">示例应用</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedModel.example}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                  <Button variant="outline" onClick={() => setSelectedModelLocal(null)}>
                    关闭
                  </Button>
                  <Button onClick={() => {
                    setSelectedModel(selectedModel);
                    setSelectedModelLocal(null);
                    // 可以跳转到生成页面
                  }}>
                    使用此模型
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}