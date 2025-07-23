import React from 'react';
import { AIModel } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  MessageSquare, Target, HelpCircle, CheckCircle, MessageCircle, 
  Lightbulb, TrendingUp, Megaphone, RotateCcw, Grid3X3, 
  Layers, Triangle, Flag, Users, Star
} from 'lucide-react';
import { clsx } from 'clsx';

const iconMap = {
  MessageSquare,
  Target,
  HelpCircle,
  CheckCircle,
  MessageCircle,
  Lightbulb,
  TrendingUp,
  Megaphone,
  RotateCcw,
  Grid3X3,
  Layers,
  Triangle,
  Flag,
  Users
};

interface ModelCardProps {
  model: AIModel;
  onSelect?: (model: AIModel) => void;
  onViewDetails?: (model: AIModel) => void;
  selected?: boolean;
  compact?: boolean;
}

export function ModelCard({ 
  model, 
  onSelect, 
  onViewDetails, 
  selected = false, 
  compact = false 
}: ModelCardProps) {
  const IconComponent = iconMap[model.icon as keyof typeof iconMap] || MessageSquare;
  
  const categoryColors = {
    basic: 'bg-green-100 text-green-800',
    advanced: 'bg-blue-100 text-blue-800',
    specialized: 'bg-purple-100 text-purple-800'
  };
  
  const categoryLabels = {
    basic: '基础',
    advanced: '进阶',
    specialized: '专业'
  };
  
  const complexityStars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={clsx(
        'w-3 h-3',
        i < model.complexity ? 'text-yellow-400 fill-current' : 'text-gray-300'
      )}
    />
  ));
  
  if (compact) {
    return (
      <Card 
        hover={true} 
        className={clsx(
          'transition-all duration-200 cursor-pointer',
          selected && 'ring-2 ring-blue-500 bg-blue-50'
        )}
      >
        <div onClick={() => onSelect?.(model)}>
         <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className={clsx(
              'p-2 rounded-lg',
              selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            )}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{model.name}</h3>
              <p className="text-sm text-gray-500 truncate">{model.description}</p>
            </div>
            <div className="flex items-center space-x-1">
              {complexityStars}
            </div>
          </div>
          </CardContent>
       </div>
      </Card>
    );
  }
  
  return (
    <Card 
      hover 
      className={clsx(
        'h-full transition-all duration-200 cursor-pointer',
        selected && 'ring-2 ring-blue-500 bg-blue-50'
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={clsx(
              'p-3 rounded-lg',
              selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            )}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-lg">{model.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={categoryColors[model.category]}>
                  {categoryLabels[model.category]}
                </Badge>
                <div className="flex items-center space-x-1">
                  {complexityStars}
                </div>
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="mt-2">
          {model.description}
        </CardDescription>
      </CardHeader>
      
      <div onClick={() => onSelect?.(model)}>
        <CardContent>
        {/* 模型结构 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">框架结构</h4>
          <div className="space-y-1">
            {model.structure.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* 使用场景 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">适用场景</h4>
          <div className="flex flex-wrap gap-1">
            {model.useCases.map((useCase, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex space-x-2">
          {onSelect && (
            <Button
              variant={selected ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onSelect(model)}
              className="flex-1"
            >
              {selected ? '已选择' : '选择模型'}
            </Button>
          )}
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(model)}
            >
              查看详情
            </Button>
          )}
        </div>
        </CardContent>
      </div>
    </Card>
  );
}