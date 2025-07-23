# 贡献指南

感谢你对AI提示词生成器项目的关注！我们欢迎所有形式的贡献。

## 🤝 如何贡献

### 报告问题

如果你发现了bug或有功能建议：

1. 首先搜索 [Issues](../../issues) 确保问题尚未被报告
2. 创建新的Issue，使用合适的模板
3. 提供详细的描述和复现步骤
4. 如果是bug，请包含：
   - 操作系统和浏览器版本
   - 错误截图或日志
   - 复现步骤

### 提交代码

1. **Fork项目**
   ```bash
   git clone https://github.com/your-username/ai-prompt-generator.git
   cd ai-prompt-generator
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **进行开发**
   - 遵循现有的代码风格
   - 添加必要的测试
   - 确保代码通过lint检查

5. **测试你的更改**
   ```bash
   npm run dev      # 启动开发服务器
   npm run build    # 构建项目
   npm run lint     # 代码检查
   ```

6. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

7. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **创建Pull Request**
   - 在GitHub上创建PR
   - 填写PR模板
   - 等待代码审查

## 📝 代码规范

### 提交信息格式

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
type(scope): description

[optional body]

[optional footer]
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 添加测试
- `chore`: 构建过程或辅助工具的变动

**示例**:
```
feat(ui): add dark mode toggle
fix(api): resolve CORS issue in production
docs(readme): update installation instructions
```

### 代码风格

- 使用TypeScript进行类型安全
- 遵循ESLint配置
- 使用Prettier进行代码格式化
- 组件名使用PascalCase
- 文件名使用kebab-case或PascalCase
- 变量和函数名使用camelCase

### 组件开发规范

1. **组件结构**
   ```tsx
   // 导入
   import React from 'react'
   import { ComponentProps } from './types'
   
   // 接口定义
   interface Props {
     // props定义
   }
   
   // 组件实现
   export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
     // 组件逻辑
     return (
       <div>
         {/* JSX */}
       </div>
     )
   }
   ```

2. **Hooks使用**
   - 优先使用函数组件和Hooks
   - 自定义Hooks以`use`开头
   - 合理使用`useCallback`和`useMemo`优化性能

3. **样式规范**
   - 使用Tailwind CSS类名
   - 避免内联样式
   - 响应式设计优先

## 🧪 测试

虽然当前项目还没有完整的测试套件，但我们鼓励：

1. 手动测试所有功能
2. 在不同浏览器中测试
3. 测试响应式设计
4. 验证API集成

## 📚 开发环境设置

### 必需工具

- Node.js >= 18.0.0
- npm 或 pnpm
- Git
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 推荐工具

- VS Code + 推荐扩展：
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - Auto Rename Tag

### 环境配置

1. 复制环境变量文件：
   ```bash
   cp .env.example .env.local
   ```

2. 配置Moonshot API密钥（可选，用于测试AI功能）

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 🎯 贡献领域

我们特别欢迎以下方面的贡献：

### 功能增强
- 新的提示词模板
- UI/UX改进
- 性能优化
- 无障碍性改进
- 国际化支持

### 技术改进
- 代码重构
- 测试覆盖
- 文档完善
- 构建优化
- 安全性增强

### 内容贡献
- 文档翻译
- 使用示例
- 最佳实践指南
- 视频教程

## 🔍 代码审查

所有的Pull Request都会经过代码审查：

1. **自动检查**
   - 代码格式检查
   - TypeScript类型检查
   - 构建测试

2. **人工审查**
   - 代码质量
   - 功能正确性
   - 性能影响
   - 安全性考虑

3. **审查标准**
   - 代码可读性
   - 遵循项目规范
   - 适当的注释
   - 向后兼容性

## 📞 获取帮助

如果你在贡献过程中遇到问题：

1. 查看现有的 [Issues](../../issues) 和 [Discussions](../../discussions)
2. 在 [Discussions](../../discussions) 中提问
3. 查看项目文档
4. 联系维护者

## 🏆 贡献者认可

我们重视每一个贡献，所有贡献者都会在项目中得到认可：

- 贡献者列表
- Release notes中的感谢
- 特殊贡献的特别认可

## 📄 许可证

通过贡献代码，你同意你的贡献将在 [MIT License](LICENSE) 下发布。

---

再次感谢你的贡献！🎉