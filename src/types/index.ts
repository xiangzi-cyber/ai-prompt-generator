// AI沟通模型类型定义
export interface AIModel {
  id: string;
  name: string;
  description: string;
  structure: string[];
  category: 'basic' | 'advanced' | 'specialized';
  complexity: 1 | 2 | 3 | 4 | 5;
  useCases: string[];
  example: string;
  icon: string;
}

// 提示词类型定义
export interface Prompt {
  id: string;
  title: string;
  content: string;
  modelId: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  rating?: number;
  isPublic: boolean;
  usageCount: number;
  isFavorite: boolean;
}

// 模板类型定义
export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  modelId: string;
  category: string;
  tags: string[];
  usageCount: number;
  rating: number;
  author: string;
  isOfficial: boolean;
}

// 生成参数类型定义
export interface GenerationParams {
  creativity: number; // 1-10
  professionalism: number; // 1-10
  detail: number; // 1-10
  modelWeight: number; // 0-1
}

// 用户类型定义
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'premium';
  createdAt: string;
}

// 统计数据类型定义
export interface UserStats {
  totalPrompts: number;
  totalGenerations: number;
  favoriteModels: string[];
  recentActivity: {
    date: string;
    action: string;
    target: string;
  }[];
}