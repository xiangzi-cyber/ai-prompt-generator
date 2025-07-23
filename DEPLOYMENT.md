# 部署指南

本文档详细说明如何将AI提示词生成器部署到不同的平台。

## 📋 部署前准备

### 1. 获取Moonshot API密钥

1. 访问 [Moonshot AI官网](https://platform.moonshot.cn/)
2. 注册账号并登录
3. 在控制台中创建API密钥
4. 保存API密钥，格式通常为 `sk-xxx...`

### 2. 准备代码

确保你的代码已经推送到Git仓库（GitHub、GitLab等）。

## 🚀 Vercel部署（推荐）

Vercel是最推荐的部署平台，支持自动构建和部署。

### 方法一：GitHub集成（推荐）

1. **准备GitHub仓库**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **在Vercel中导入项目**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 选择你的GitHub仓库
   - 点击 "Import"

3. **配置项目设置**
   - **Framework Preset**: Vite
   - **Root Directory**: `./`（默认）
   - **Build Command**: `npm run build`（默认）
   - **Output Directory**: `dist`（默认）
   - **Install Command**: `npm install`（默认）

4. **配置环境变量**
   在项目设置页面，添加以下环境变量：
   ```
   MOONSHOT_API_KEY=your_moonshot_api_key_here
   ```

5. **部署**
   点击 "Deploy" 按钮开始部署。

### 方法二：Vercel CLI

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **初始化项目**
   ```bash
   vercel
   ```
   按照提示配置项目设置。

4. **设置环境变量**
   ```bash
   vercel env add MOONSHOT_API_KEY
   ```
   输入你的API密钥。

5. **部署**
   ```bash
   vercel --prod
   ```

### Vercel部署注意事项

- ✅ 确保 `vercel.json` 文件配置正确
- ✅ API路由会自动映射到 `/api/moonshot`
- ✅ 环境变量 `MOONSHOT_API_KEY` 必须在Vercel项目设置中配置
- ✅ 每次推送到主分支会自动触发重新部署

## 🌐 Netlify部署

Netlify也是一个优秀的静态网站托管平台。

### 部署步骤

1. **准备构建**
   ```bash
   npm run build
   ```

2. **在Netlify中创建新站点**
   - 访问 [Netlify Dashboard](https://app.netlify.com/)
   - 点击 "New site from Git"
   - 选择你的Git提供商和仓库

3. **配置构建设置**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18` 或更高

4. **配置环境变量**
   在站点设置中添加：
   ```
   VITE_MOONSHOT_API_KEY=your_moonshot_api_key_here
   VITE_MOONSHOT_BASE_URL=https://api.moonshot.cn/v1
   VITE_MOONSHOT_MODEL=kimi-k2-0711-preview
   ```

5. **配置重定向**
   创建 `public/_redirects` 文件：
   ```
   /api/moonshot/* https://api.moonshot.cn/v1/:splat 200
   /* /index.html 200
   ```

### Netlify注意事项

- ⚠️ Netlify不支持Serverless函数的免费版本可能有限制
- ⚠️ 需要配置代理重定向来处理API调用
- ⚠️ 可能需要处理CORS问题

## ☁️ 其他云平台部署

### GitHub Pages

1. **配置GitHub Actions**
   创建 `.github/workflows/deploy.yml`：
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: npm run build
           env:
             VITE_MOONSHOT_API_KEY: ${{ secrets.VITE_MOONSHOT_API_KEY }}
             VITE_MOONSHOT_BASE_URL: https://api.moonshot.cn/v1
             VITE_MOONSHOT_MODEL: kimi-k2-0711-preview
         
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **配置Secrets**
   在GitHub仓库设置中添加：
   ```
   VITE_MOONSHOT_API_KEY=your_moonshot_api_key_here
   ```

### 注意事项

- ⚠️ GitHub Pages是静态托管，不支持Serverless函数
- ⚠️ API调用可能遇到CORS问题
- ⚠️ 建议仅用于演示目的

## 🐳 Docker部署

### Dockerfile

创建 `Dockerfile`：
```dockerfile
# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        
        location / {
            root /usr/share/nginx/html;
            index index.html index.htm;
            try_files $uri $uri/ /index.html;
        }
        
        # API代理
        location /api/moonshot {
            proxy_pass https://api.moonshot.cn/v1;
            proxy_set_header Host api.moonshot.cn;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 构建和运行

```bash
# 构建镜像
docker build -t ai-prompt-generator .

# 运行容器
docker run -p 8080:80 ai-prompt-generator
```

## 🔧 环境变量配置

### 开发环境

创建 `.env.local` 文件：
```env
VITE_MOONSHOT_API_KEY=your_api_key_here
VITE_MOONSHOT_BASE_URL=https://api.moonshot.cn/v1
VITE_MOONSHOT_MODEL=kimi-k2-0711-preview
```

### 生产环境

根据部署平台配置相应的环境变量：

| 平台 | 变量名 | 说明 |
|------|--------|------|
| Vercel | `MOONSHOT_API_KEY` | 用于Serverless函数 |
| Netlify | `VITE_MOONSHOT_API_KEY` | 用于前端构建 |
| GitHub Pages | `VITE_MOONSHOT_API_KEY` | 用于GitHub Actions |

## 🚨 常见问题

### 1. 部署失败

**问题**: 构建或部署过程中出现错误

**解决方案**:
- 检查Node.js版本是否 >= 18
- 确保所有依赖都已正确安装
- 检查构建命令是否正确
- 查看构建日志中的具体错误信息

### 2. API调用失败

**问题**: 部署成功但API调用不工作

**解决方案**:
- 确保环境变量正确配置
- 检查API密钥是否有效
- 验证API端点是否可访问
- 检查CORS配置

### 3. 路由问题

**问题**: 刷新页面时出现404错误

**解决方案**:
- 确保配置了正确的重定向规则
- 对于SPA应用，所有路由都应重定向到 `index.html`

### 4. 环境变量不生效

**问题**: 环境变量配置后仍然无法使用

**解决方案**:
- 确保变量名前缀正确（开发环境需要 `VITE_` 前缀）
- 重新构建和部署项目
- 检查平台的环境变量配置界面

## 📞 获取帮助

如果在部署过程中遇到问题：

1. 查看项目的 [Issues](../../issues) 页面
2. 查看相关平台的官方文档
3. 提交新的Issue描述你的问题

---

祝你部署顺利！🎉