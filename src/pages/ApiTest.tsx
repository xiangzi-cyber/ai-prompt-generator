import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Input';
import { ApiConnectionTest } from '@/components/ApiConnectionTest';
import { testMoonshotConnection, generatePromptWithMoonshot } from '@/services/moonshot';
import { aiModels } from '@/data/aiModels';
import { Wifi, WifiOff, TestTube, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function ApiTest() {
  const [testInput, setTestInput] = useState('设计一位专业的高考志愿规划师');
  const [testResult, setTestResult] = useState<string>('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isTestingGeneration, setIsTestingGeneration] = useState(false);
  const [connectionResult, setConnectionResult] = useState<boolean | null>(null);
  const [generationError, setGenerationError] = useState<string>('');
  const [apiStats, setApiStats] = useState<any>(null);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionResult(null);
    
    try {
      const result = await testMoonshotConnection();
      setConnectionResult(result);
      console.log('连接测试结果:', result);
    } catch (error) {
      setConnectionResult(false);
      console.error('连接测试失败:', error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleTestGeneration = async () => {
    setIsTestingGeneration(true);
    setTestResult('');
    setGenerationError('');
    setApiStats(null);
    
    try {
      const model = aiModels.find(m => m.id === 'three-part');
      if (!model) {
        throw new Error('模型未找到');
      }
      
      const params = {
        creativity: 7,
        professionalism: 8,
        detail: 7,
        modelWeight: 5
      };
      
      console.log('开始测试API生成...');
      const startTime = Date.now();
      
      const response = await generatePromptWithMoonshot(testInput, model, params);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      setTestResult(response.content);
      setApiStats({
        duration,
        usage: response.usage,
        contentLength: response.content.length
      });
      
      console.log('API生成测试成功:', {
        耗时: `${duration}ms`,
        内容长度: response.content.length,
        Token使用: response.usage
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      setGenerationError(errorMessage);
      console.error('API生成测试失败:', error);
    } finally {
      setIsTestingGeneration(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Moonshot API 连接测试</h1>
          <p className="text-lg text-gray-600">测试Kimi K2大模型的API连接状态和生成功能</p>
        </div>

        <div className="space-y-6">
          {/* API连接状态 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wifi className="w-5 h-5 text-blue-500" />
                <span>API连接状态</span>
              </CardTitle>
              <CardDescription>
                检查Moonshot API的连接状态和基本功能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ApiConnectionTest />
              
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  loading={isTestingConnection}
                  icon={TestTube}
                >
                  {isTestingConnection ? '测试中...' : '手动测试连接'}
                </Button>
                
                {connectionResult !== null && (
                  <div className="flex items-center space-x-2">
                    {connectionResult ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-600">连接成功</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-600">连接失败</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* API生成测试 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="w-5 h-5 text-purple-500" />
                <span>API生成测试</span>
              </CardTitle>
              <CardDescription>
                测试Moonshot API的提示词生成功能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  测试输入
                </label>
                <Textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="输入测试内容..."
                  rows={3}
                />
              </div>
              
              <Button
                onClick={handleTestGeneration}
                disabled={isTestingGeneration || !testInput.trim()}
                loading={isTestingGeneration}
                icon={Loader2}
              >
                {isTestingGeneration ? '生成中...' : '测试API生成'}
              </Button>
              
              {/* 生成统计 */}
              {apiStats && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">生成统计</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">耗时:</span>
                      <span className="ml-1 font-medium">{apiStats.duration}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-600">内容长度:</span>
                      <span className="ml-1 font-medium">{apiStats.contentLength}字符</span>
                    </div>
                    {apiStats.usage && (
                      <>
                        <div>
                          <span className="text-gray-600">输入Token:</span>
                          <span className="ml-1 font-medium">{apiStats.usage.prompt_tokens}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">输出Token:</span>
                          <span className="ml-1 font-medium">{apiStats.usage.completion_tokens}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* 错误信息 */}
              {generationError && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">生成失败</h4>
                  <p className="text-red-600 text-sm">{generationError}</p>
                </div>
              )}
              
              {/* 生成结果 */}
              {testResult && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">生成结果</h4>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {testResult}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 环境信息 */}
          <Card>
            <CardHeader>
              <CardTitle>环境配置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">API Base URL:</span>
                  <span className="ml-2 font-mono text-blue-600">https://api.moonshot.cn/v1</span>
                </div>
                <div>
                  <span className="text-gray-600">模型:</span>
                  <span className="ml-2 font-mono text-blue-600">kimi-k2-0711-preview</span>
                </div>
                <div>
                  <span className="text-gray-600">API Key:</span>
                  <span className="ml-2 font-mono text-gray-400">sk-8yDK...（已配置）</span>
                </div>
                <div>
                  <span className="text-gray-600">状态:</span>
                  <Badge variant="success">已配置</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}