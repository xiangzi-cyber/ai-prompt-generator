import React, { useState } from 'react';
import { User, Settings, BarChart3, TrendingUp, Calendar, Clock, Star, Zap, Brain, Target, Award, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store';
import { aiModels } from '@/data/aiModels';

// 模拟用户数据
const mockUserData = {
  profile: {
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar%20portrait%20of%20a%20person%20working%20with%20AI&image_size=square',
    joinDate: new Date('2024-01-01'),
    level: 'Pro用户',
    points: 1250
  },
  stats: {
    totalPrompts: 28,
    favoritePrompts: 12,
    publicPrompts: 8,
    totalGenerations: 156,
    modelsUsed: 10,
    avgRating: 4.8,
    streakDays: 15,
    thisMonthGenerations: 42
  },
  recentActivity: [
    {
      id: '1',
      type: 'generate',
      title: '生成了新的提示词',
      description: '高考志愿规划师 - 使用STAR模型',
      timestamp: new Date('2024-01-20T10:30:00'),
      model: 'STAR模型'
    },
    {
      id: '2',
      type: 'favorite',
      title: '收藏了提示词',
      description: '产品需求分析师',
      timestamp: new Date('2024-01-20T09:15:00'),
      model: '5W1H模型'
    },
    {
      id: '3',
      type: 'share',
      title: '分享了提示词',
      description: '创意文案策划',
      timestamp: new Date('2024-01-19T16:45:00'),
      model: 'SCAMPER模型'
    }
  ],
  achievements: [
    {
      id: '1',
      title: '初学者',
      description: '生成第一个提示词',
      icon: Star,
      unlocked: true,
      unlockedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      title: '探索者',
      description: '使用5种不同的AI模型',
      icon: Brain,
      unlocked: true,
      unlockedAt: new Date('2024-01-10')
    },
    {
      id: '3',
      title: '创作达人',
      description: '生成50个提示词',
      icon: Zap,
      unlocked: false,
      progress: 28,
      target: 50
    },
    {
      id: '4',
      title: '分享专家',
      description: '公开分享10个提示词',
      icon: Target,
      unlocked: false,
      progress: 8,
      target: 10
    }
  ]
};

export default function Workspace() {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'achievements'>('overview');
  const [userData] = useState(mockUserData);
  
  const tabs = [
    { id: 'overview', name: '概览', icon: BarChart3 },
    { id: 'achievements', name: '成就', icon: Award },
    { id: 'settings', name: '设置', icon: Settings }
  ];
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'generate': return Zap;
      case 'favorite': return Star;
      case 'share': return Target;
      default: return BookOpen;
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'generate': return 'text-blue-600';
      case 'favorite': return 'text-yellow-600';
      case 'share': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">个人工作台</h1>
          <p className="text-lg text-gray-600">管理你的AI提示词工程之旅</p>
        </div>
        
        {/* 用户信息卡片 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {userData.profile.name.charAt(0)}
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{userData.profile.name}</h2>
                <p className="text-gray-600 mb-2">{userData.profile.email}</p>
                <div className="flex items-center space-x-4">
                  <Badge variant="info">{userData.profile.level}</Badge>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>加入于 {userData.profile.joinDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{userData.profile.points} 积分</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{userData.stats.streakDays}</div>
                <div className="text-sm text-gray-600">连续使用天数</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 标签页导航 */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
        
        {/* 标签页内容 */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：统计数据 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 核心统计 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{userData.stats.totalPrompts}</div>
                    <div className="text-sm text-gray-600">总提示词</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{userData.stats.totalGenerations}</div>
                    <div className="text-sm text-gray-600">生成次数</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{userData.stats.modelsUsed}</div>
                    <div className="text-sm text-gray-600">使用模型</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{userData.stats.avgRating}</div>
                    <div className="text-sm text-gray-600">平均评分</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* 本月统计 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span>本月表现</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{userData.stats.thisMonthGenerations}</div>
                      <div className="text-sm text-gray-600">生成次数</div>
                      <div className="text-xs text-green-600 mt-1">↑ 比上月增长 25%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">{userData.stats.favoritePrompts}</div>
                      <div className="text-sm text-gray-600">收藏提示词</div>
                      <div className="text-xs text-green-600 mt-1">↑ 比上月增长 15%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-1">{userData.stats.publicPrompts}</div>
                      <div className="text-sm text-gray-600">公开分享</div>
                      <div className="text-xs text-green-600 mt-1">↑ 比上月增长 33%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* 最常用模型 */}
              <Card>
                <CardHeader>
                  <CardTitle>最常用的AI模型</CardTitle>
                  <CardDescription>根据你的使用频率排序</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiModels.slice(0, 5).map((model, index) => (
                      <div key={model.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{model.name}</div>
                            <div className="text-sm text-gray-600">{model.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{Math.floor(Math.random() * 20) + 5} 次</div>
                          <div className="text-xs text-gray-500">使用次数</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* 右侧：最近活动 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span>最近活动</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.recentActivity.map((activity) => {
                      const Icon = getActivityIcon(activity.type);
                      const colorClass = getActivityColor(activity.type);
                      
                      return (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-gray-100 ${colorClass}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">{activity.title}</div>
                            <div className="text-sm text-gray-600">{activity.description}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="info" size="sm">{activity.model}</Badge>
                              <span className="text-xs text-gray-500">
                                {activity.timestamp.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.achievements.map((achievement) => {
              const Icon = achievement.icon;
              
              return (
                <Card key={achievement.id} className={`relative ${
                  achievement.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 rounded-lg ${
                        achievement.unlocked 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          achievement.unlocked ? 'text-green-900' : 'text-gray-900'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${
                          achievement.unlocked ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    
                    {achievement.unlocked ? (
                      <div className="flex items-center space-x-2">
                        <Badge variant="success" size="sm">已解锁</Badge>
                        <span className="text-xs text-green-600">
                          {achievement.unlockedAt?.toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>进度</span>
                          <span>{achievement.progress}/{achievement.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(achievement.progress! / achievement.target!) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>个人信息</CardTitle>
                <CardDescription>更新你的个人资料信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    姓名
                  </label>
                  <Input type="text" value={userData.profile.name} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱
                  </label>
                  <Input type="email" value={userData.profile.email} />
                </div>
                
                <Button>保存更改</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>偏好设置</CardTitle>
                <CardDescription>自定义你的使用体验</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">邮件通知</div>
                    <div className="text-sm text-gray-600">接收新功能和更新通知</div>
                  </div>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">自动保存</div>
                    <div className="text-sm text-gray-600">自动保存生成的提示词</div>
                  </div>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">公开分享</div>
                    <div className="text-sm text-gray-600">默认将提示词设为公开</div>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>账户管理</CardTitle>
                <CardDescription>管理你的账户设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline">更改密码</Button>
                <Button variant="outline">导出数据</Button>
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                  删除账户
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}