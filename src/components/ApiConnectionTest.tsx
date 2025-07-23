import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { testMoonshotConnection } from '@/services/moonshot';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ApiConnectionTestProps {
  className?: string;
}

export const ApiConnectionTest: React.FC<ApiConnectionTestProps> = ({ className }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await testMoonshotConnection();
      setIsConnected(result);
      setLastTestTime(new Date());
      console.log('API连接测试结果:', result ? '成功' : '失败');
    } catch (error) {
      console.error('API连接测试错误:', error);
      setIsConnected(false);
      setLastTestTime(new Date());
    } finally {
      setIsTesting(false);
    }
  };

  // 检测是否为生产环境
  const isProductionEnvironment = () => {
    return import.meta.env.PROD || window.location.protocol === 'https:' || !window.location.hostname.includes('localhost');
  };

  const getStatusBadge = () => {
    if (isTesting) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          测试中...
        </Badge>
      );
    }

    if (isConnected === null) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Wifi className="w-3 h-3" />
          未测试
        </Badge>
      );
    }

    if (isConnected) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <Wifi className="w-3 h-3" />
          连接正常
        </Badge>
      );
    }

    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <WifiOff className="w-3 h-3" />
        连接失败
      </Badge>
    );
  };

  const isProd = isProductionEnvironment();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Moonshot API:</span>
        {getStatusBadge()}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleTestConnection}
        disabled={isTesting}
        className="text-xs"
      >
        {isTesting ? (
          <>
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            测试中
          </>
        ) : (
          '手动测试连接'
        )}
      </Button>
      
      {lastTestTime && (
        <span className="text-xs text-gray-500">
          上次测试: {lastTestTime.toLocaleTimeString()}
        </span>
      )}
    </div>
  );

};

export default ApiConnectionTest;