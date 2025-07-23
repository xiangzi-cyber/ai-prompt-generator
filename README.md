# AI提示词生成器

一个基于React + TypeScript + Vite构建的智能提示词生成工具，支持多种场景的AI提示词创建和优化。

## ✨ 功能特性

- 🎯 **智能提示词生成** - 基于Moonshot AI的智能提示词创建
- 📝 **多种生成模式** - 支持标准模式和快速模式
- 🎨 **现代化UI设计** - 使用Tailwind CSS构建的响应式界面
- 🔄 **实时预览** - 即时查看生成的提示词效果
- 💾 **本地存储** - 自动保存用户的提示词历史
- 🌐 **跨平台部署** - 支持本地开发和Vercel生产环境
- 🔒 **安全可靠** - 环境变量管理，保护API密钥安全

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **样式框架**: Tailwind CSS
- **状态管理**: Zustand
- **路由管理**: React Router DOM
- **AI服务**: Moonshot AI API
- **图标库**: Lucide React
- **通知组件**: Sonner
- **部署平台**: Vercel

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm 或 pnpm

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/xiangzi-cyber/ai-prompt-generator.git
cd ai-prompt-generator
```

2. **安装依赖**
```bash
npm install
# 或
pnpm install
```

3. **配置环境变量**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入你的Moonshot API密钥：
```env
VITE_MOONSHOT_API_KEY=your_moonshot_api_key_here
VITE_MOONSHOT_BASE_URL=https://api.moonshot.cn/v1
VITE_MOONSHOT_MODEL=kimi-k2-0711-preview
```

4. **启动开发服务器**
```bash
npm run dev
# 或
pnpm dev
```

5. **打开浏览器**
访问 `http://localhost:5173` 开始使用

### 构建生产版本

```bash
npm run build
# 或
pnpm build
```

### 预览生产版本

```bash
npm run preview
# 或
pnpm preview
```

## 🌐 部署到Vercel

### 方法一：通过Vercel CLI

1. **安装Vercel CLI**
```bash
npm i -g vercel
```

2. **登录Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
vercel
```

### 方法二：通过GitHub集成

1. **推送代码到GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **在Vercel中导入项目**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择你的GitHub仓库
   - 点击 "Deploy"

3. **配置环境变量**
   在Vercel项目设置中添加以下环境变量：
   ```
   MOONSHOT_API_KEY=your_moonshot_api_key_here
   ```

## 🔧 环境变量说明

### 开发环境变量（.env.local）

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `VITE_MOONSHOT_API_KEY` | Moonshot AI API密钥 | `sk-xxx...` |
| `VITE_MOONSHOT_BASE_URL` | API基础URL | `https://api.moonshot.cn/v1` |
| `VITE_MOONSHOT_MODEL` | 使用的AI模型 | `kimi-k2-0711-preview` |

### 生产环境变量（Vercel）

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `MOONSHOT_API_KEY` | Moonshot AI API密钥 | `sk-xxx...` |

## 📁 项目结构

```
提示词网站/
├── api/                    # Vercel Serverless函数
│   └── moonshot.js        # Moonshot API代理
├── public/                # 静态资源
├── src/
│   ├── components/        # React组件
│   ├── hooks/            # 自定义Hooks
│   ├── pages/            # 页面组件
│   ├── services/         # API服务
│   ├── store/            # 状态管理
│   ├── utils/            # 工具函数
│   ├── App.tsx           # 主应用组件
│   └── main.tsx          # 应用入口
├── .env.example          # 环境变量示例
├── .gitignore           # Git忽略文件
├── package.json         # 项目配置
├── tailwind.config.js   # Tailwind配置
├── tsconfig.json        # TypeScript配置
├── vercel.json          # Vercel配置
└── vite.config.ts       # Vite配置
```

## 🔍 API说明

### Moonshot AI集成

项目集成了Moonshot AI API，用于生成智能提示词。在不同环境下的调用方式：

- **开发环境**: 通过Vite代理调用API
- **生产环境**: 通过Vercel Serverless函数代理调用API

### API端点

- `POST /api/moonshot` - 生成提示词
- `GET /api/moonshot/test` - 测试API连接

## 🛡️ 安全说明

- ✅ API密钥通过环境变量管理，不会暴露在前端代码中
- ✅ 生产环境通过Serverless函数代理API调用
- ✅ 开发环境通过Vite代理避免CORS问题
- ✅ 敏感文件已添加到.gitignore中

## 🤝 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🆘 常见问题

### Q: API调用失败怎么办？
A: 请检查：
1. API密钥是否正确配置
2. 网络连接是否正常
3. API配额是否充足

### Q: 本地开发时出现CORS错误？
A: 确保使用 `npm run dev` 启动开发服务器，Vite代理会自动处理CORS问题。

### Q: Vercel部署失败？
A: 请检查：
1. 环境变量是否正确配置
2. 构建是否成功
3. vercel.json配置是否正确

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](../../issues)
- 发起 [Discussion](../../discussions)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
