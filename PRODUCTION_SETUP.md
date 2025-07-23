# 生产环境API配置指南

## 概述

本项目现在支持在生产环境中使用Moonshot API。通过Vercel serverless函数，我们解决了浏览器CORS限制问题。

## 配置步骤

### 1. Vercel环境变量配置

在Vercel项目设置中添加以下环境变量：

```
MOONSHOT_API_KEY=your_actual_api_key_here
```

**配置路径：**
1. 登录Vercel控制台
2. 选择你的项目
3. 进入 Settings → Environment Variables
4. 添加新的环境变量：
   - Name: `MOONSHOT_API_KEY`
   - Value: 你的Moonshot API密钥
   - Environment: Production (或 All)

### 2. 本地开发环境配置

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入你的API密钥：

```
VITE_MOONSHOT_API_KEY=your_actual_api_key_here
VITE_MOONSHOT_BASE_URL=https://api.moonshot.cn/v1
VITE_MOONSHOT_MODEL=kimi-k2-0711-preview
```

### 3. 部署

配置完成后，重新部署项目：

```bash
npm run build
```

或者推送代码到Git仓库，Vercel会自动部署。

## 工作原理

### 开发环境
- 使用Vite代理 (`/api/moonshot`) 转发API请求
- 前端直接使用 `VITE_MOONSHOT_API_KEY`

### 生产环境
- 使用Vercel serverless函数 (`/api/moonshot.js`) 处理API请求
- 函数使用服务器端的 `MOONSHOT_API_KEY` 环境变量
- 自动处理CORS头，解决跨域问题

## 测试

1. **本地测试：**
   ```bash
   npm run dev
   ```
   访问 http://localhost:5173，测试API连接

2. **生产环境测试：**
   部署后访问你的Vercel域名，测试API功能

## 故障排除

### 常见问题

1. **405 Method Not Allowed**
   - 检查Vercel环境变量是否正确配置
   - 确认 `api/moonshot.js` 文件已正确部署

2. **401 Unauthorized**
   - 检查API密钥是否正确
   - 确认API密钥未过期

3. **CORS错误**
   - 确认使用的是 `/api/moonshot` 路径
   - 检查serverless函数是否正确设置CORS头

### 调试步骤

1. 检查浏览器开发者工具的Network标签
2. 查看Vercel函数日志（Functions → View Function Logs）
3. 确认环境变量配置正确

## 安全注意事项

- ✅ API密钥在生产环境中存储在服务器端
- ✅ 前端代码中不包含真实的API密钥
- ✅ 使用环境变量管理敏感信息
- ✅ CORS配置仅允许必要的请求头

## 支持的功能

- ✅ AI提示词生成
- ✅ 快速模式和标准模式
- ✅ API连接测试
- ✅ 错误处理和重试机制
- ✅ 实时进度指示
- ✅ 取消生成功能

现在你可以在生产环境中完整使用所有AI功能！