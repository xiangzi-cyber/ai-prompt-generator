import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X, Home, Zap, Library, Database, User, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store';
import { clsx } from 'clsx';

const navigation = [
  { name: '首页', href: '/', icon: Home },
  { name: '智能生成', href: '/generate', icon: Zap },
  { name: '提示词管理', href: '/prompts', icon: Library },
  { name: 'AI模型库', href: '/models', icon: Database },
  { name: 'API测试', href: '/api-test', icon: TestTube },
  { name: '个人工作台', href: '/dashboard', icon: User },
];

export function Navbar() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo和品牌 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">AI提示词助手</h1>
                <p className="text-xs text-gray-500">智能生成 · 高效管理</p>
              </div>
            </Link>
          </div>
          
          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
          
          {/* 右侧操作 */}
          <div className="flex items-center space-x-4">
            {/* 快速生成按钮 */}
            <Link to="/generate">
              <Button size="sm" icon={Zap}>
                快速生成
              </Button>
            </Link>
            
            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* 移动端侧边栏 */}
      {sidebarOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}