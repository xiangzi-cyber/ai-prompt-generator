import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Copy, Download, Star, Calendar, Tag, Grid, List, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store';
import type { Prompt } from '@/types';

// 模拟数据
const mockPrompts: Prompt[] = [
  {
    id: '1',
    title: '高考志愿规划师',
    content: '你是一位资深的高考志愿规划师，拥有10年以上的志愿填报指导经验...',
    modelId: 'star',
    tags: ['教育', '规划', '咨询'],
    category: '教育咨询',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    isFavorite: true,
    isPublic: false,
    usageCount: 15
  },
  {
    id: '2',
    title: '产品需求分析师',
    content: '你是一位专业的产品需求分析师，擅长将用户需求转化为具体的产品功能...',
    modelId: '5w1h',
    tags: ['产品', '分析', '需求'],
    category: '产品管理',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-16',
    isFavorite: false,
    isPublic: true,
    usageCount: 8
  },
  {
    id: '3',
    title: '创意文案策划',
    content: '你是一位富有创意的文案策划师，能够为不同品牌和产品创作吸引人的文案...',
    modelId: 'scamper',
    tags: ['文案', '创意', '营销'],
    category: '营销推广',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13',
    isFavorite: true,
    isPublic: false,
    usageCount: 22
  }
];

export default function Prompts() {
  const [prompts] = useState<Prompt[]>(mockPrompts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'usageCount'>('updatedAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  
  // 获取所有分类和标签
  const categories = ['all', ...Array.from(new Set(prompts.map(p => p.category)))];
  const allTags = Array.from(new Set(prompts.flatMap(p => p.tags)));
  const tags = ['all', ...allTags];
  
  // 过滤和排序提示词
  const filteredPrompts = prompts
    .filter(prompt => {
      const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
      const matchesTag = selectedTag === 'all' || prompt.tags.includes(selectedTag);
      const matchesFavorite = !showFavoritesOnly || prompt.isFavorite;
      
      return matchesSearch && matchesCategory && matchesTag && matchesFavorite;
    })
    .sort((a, b) => {
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        return new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime();
      }
      return b[sortBy] - a[sortBy];
    });
  
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    // 可以添加toast提示
  };
  
  const handleEdit = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
  };
  
  const handleDelete = (promptId: string) => {
    // 删除提示词逻辑
    console.log('删除提示词:', promptId);
  };
  
  const handleToggleFavorite = (promptId: string) => {
    // 切换收藏状态
    console.log('切换收藏:', promptId);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setShowFavoritesOnly(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">提示词管理</h1>
            <p className="text-lg text-gray-600">管理和组织你的提示词库</p>
          </div>
          <Button icon={Plus} className="">
            新建提示词
          </Button>
        </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">{prompts.length}</div>
              <div className="text-sm text-gray-600">总提示词</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">{prompts.filter(p => p.isFavorite).length}</div>
              <div className="text-sm text-gray-600">收藏数量</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">{prompts.filter(p => p.isPublic).length}</div>
              <div className="text-sm text-gray-600">公开分享</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">{prompts.reduce((sum, p) => sum + p.usageCount, 0)}</div>
              <div className="text-sm text-gray-600">总使用次数</div>
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
                    搜索提示词
                  </label>
                  <Input
                    type="text"
                    placeholder="搜索标题、内容或标签..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={Search}
                  />
                </div>
                
                {/* 收藏筛选 */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showFavoritesOnly}
                      onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">只显示收藏</span>
                  </label>
                </div>
                
                {/* 分类筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    分类
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedCategory === category
                            ? 'bg-blue-100 text-blue-800'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        <span className="text-sm">
                          {category === 'all' ? '全部分类' : category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 标签筛选 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    标签
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <div
                         key={tag}
                         className="cursor-pointer"
                         onClick={() => setSelectedTag(tag)}
                        >
                         <Badge
                            variant={selectedTag === tag ? 'default' : 'info'}
                          >
                           {tag === 'all' ? '全部' : tag}
                          </Badge>
                         </div>
                    ))}
                  </div>
                </div>
                
                {/* 排序 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    排序方式
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="updatedAt">最近更新</option>
                    <option value="createdAt">创建时间</option>
                    <option value="usageCount">使用次数</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 右侧：提示词列表 */}
          <div className="lg:col-span-3">
            {/* 工具栏 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  找到 {filteredPrompts.length} 个提示词
                </span>
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
            
            {/* 提示词展示 */}
            {filteredPrompts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredPrompts.map((prompt) => (
                  <Card key={prompt.id} hover className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{prompt.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {prompt.content}
                          </CardDescription>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(prompt.id)}
                            className={prompt.isFavorite ? 'text-yellow-500' : 'text-gray-400'}
                          >
                            <Star className={`w-4 h-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
                          </Button>
                          
                          <div className="relative group">
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                            
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              <button
                                onClick={() => handleEdit(prompt)}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="w-4 h-4" />
                                <span>编辑</span>
                              </button>
                              <button
                                onClick={() => handleCopy(prompt.content)}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Copy className="w-4 h-4" />
                                <span>复制</span>
                              </button>
                              <button
                                onClick={() => handleDelete(prompt.id)}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>删除</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* 标签 */}
                        <div className="flex flex-wrap gap-2">
                          {prompt.tags.map((tag) => (
                            <Badge key={tag} variant="info" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* 元数据 */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Tag className="w-4 h-4" />
                            <span>{prompt.modelId}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(prompt.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {/* 使用统计 */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">使用次数: {prompt.usageCount}</span>
                          <div className="flex items-center space-x-2">
                            {prompt.isPublic && (
                              <Badge variant="info" size="sm">公开</Badge>
                            )}
                            {prompt.isFavorite && (
                              <Badge variant="warning" size="sm">收藏</Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* 操作按钮 */}
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(prompt.content)}
                            icon={Copy}
                            className="flex-1"
                          >
                            复制
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(prompt)}
                            icon={Edit}
                            className="flex-1"
                          >
                            编辑
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的提示词</h3>
                  <p className="text-gray-600 mb-4">尝试调整搜索条件或筛选器</p>
                  <Button variant="outline" onClick={clearFilters}>
                    清除所有筛选器
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* 编辑弹窗 */}
        {selectedPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">编辑提示词</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedPrompt(null)}
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      标题
                    </label>
                    <Input
                      type="text"
                      value={selectedPrompt.title}
                      onChange={() => {}}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      内容
                    </label>
                    <textarea
                      value={selectedPrompt.content}
                      onChange={() => {}}
                      rows={10}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        分类
                      </label>
                      <Input
                        type="text"
                        value={selectedPrompt.category}
                        onChange={() => {}}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        标签 (用逗号分隔)
                      </label>
                      <Input
                        type="text"
                        value={selectedPrompt.tags.join(', ')}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPrompt.isFavorite}
                        onChange={() => {}}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">添加到收藏</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPrompt.isPublic}
                        onChange={() => {}}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">公开分享</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                  <Button variant="outline" onClick={() => setSelectedPrompt(null)}>
                    取消
                  </Button>
                  <Button onClick={() => setSelectedPrompt(null)}>
                    保存更改
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