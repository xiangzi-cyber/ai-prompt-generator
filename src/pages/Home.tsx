import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, Database, Users, ArrowRight, Sparkles, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ModelCard } from '@/components/ModelCard';
import { useAppStore } from '@/store';
import { aiModels } from '@/data/aiModels';

export default function Home() {
  const { setSelectedModel } = useAppStore();
  
  // 获取推荐的模型（基础和常用的）
  const featuredModels = aiModels.filter(model => 
    ['three-part', 'star', '5w1h', 'smart'].includes(model.id)
  );
  
  const features = [
    {
      icon: Brain,
      title: '14种AI沟通模型',
      description: '基于实践验证的专业框架，覆盖各种应用场景',
      color: 'text-blue-600'
    },
    {
      icon: Zap,
      title: '智能生成引擎',
      description: '输入需求设想，自动生成结构化提示词',
      color: 'text-green-600'
    },
    {
      icon: Database,
      title: '提示词管理',
      description: '分类管理、搜索筛选、批量操作一应俱全',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: '团队协作',
      description: '模板分享、团队库、权限管理支持',
      color: 'text-orange-600'
    }
  ];
  
  const stats = [
    { label: 'AI沟通模型', value: '14+' },
    { label: '预设模板', value: '100+' },
    { label: '用户使用', value: '10K+' },
    { label: '生成次数', value: '50K+' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>基于14种AI沟通模型的专业平台</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              AI提示词工程
              <span className="text-blue-600">助理平台</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              只需输入需求设想，AI会为你自动构建逻辑清晰、要素完整的结构化提示词，
              完成AI角色设定并提供相关解决方案
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/generate">
              <Button size="lg" icon={Zap} className="w-full sm:w-auto">
                立即开始生成
              </Button>
            </Link>
            <Link to="/models">
              <Button size="lg" variant="outline" icon={Database} className="w-full sm:w-auto">
                浏览AI模型库
              </Button>
            </Link>
          </div>
          
          {/* 统计数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 快速生成入口 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">快速生成提示词</h2>
                <p className="text-blue-100">描述你的需求，让AI为你生成专业的结构化提示词</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="例如：设计一位资深高考志愿规划师，要求考生输入预评估分数后，推荐报考院校..."
                    className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <Link to="/generate">
                  <Button variant="secondary" size="lg" icon={ArrowRight}>
                    开始生成
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* 核心功能 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">核心功能特性</h2>
            <p className="text-lg text-gray-600">基于AI沟通模型理论，提供专业的提示词工程解决方案</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg bg-gray-100 ${feature.color} mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* AI沟通模型展示 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">精选AI沟通模型</h2>
            <p className="text-lg text-gray-600">基于实践验证的专业框架，让你的提示词更加结构化和高效</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                compact
                onSelect={(model) => {
                  setSelectedModel(model);
                  // 可以跳转到生成页面
                }}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/models">
              <Button variant="outline" icon={Database}>
                查看全部14种模型
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* 使用流程 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">简单三步，生成专业提示词</h2>
            <p className="text-lg text-gray-600">从需求设想到结构化提示词，再到解决方案的完整流程</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">输入需求设想</h3>
              <p className="text-gray-600">用自然语言描述你的需求和想法，无需专业知识</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">智能匹配模型</h3>
              <p className="text-gray-600">AI自动推荐最适合的沟通模型，或手动选择框架</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">生成结构化提示词</h3>
              <p className="text-gray-600">获得逻辑清晰、要素完整的专业提示词和解决方案</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            开始你的AI提示词工程之旅
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            加入数万用户，体验专业的提示词生成和管理平台
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/generate">
              <Button size="lg" variant="secondary" icon={Zap} className="w-full sm:w-auto">
                免费开始使用
              </Button>
            </Link>
            <Link to="/models">
              <Button size="lg" variant="outline" icon={Database} className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600">
                了解AI模型
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}