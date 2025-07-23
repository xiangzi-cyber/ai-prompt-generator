#!/bin/bash

# AI提示词生成器 - 部署脚本
# 这个脚本帮助你快速部署项目到Vercel

set -e

echo "🚀 开始部署 AI提示词生成器..."

# 检查是否安装了必要的工具
check_dependencies() {
    echo "📋 检查依赖..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装，请先安装 Node.js"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm 未安装，请先安装 npm"
        exit 1
    fi
    
    echo "✅ 依赖检查完成"
}

# 安装项目依赖
install_dependencies() {
    echo "📦 安装项目依赖..."
    npm ci
    echo "✅ 依赖安装完成"
}

# 运行代码检查
run_checks() {
    echo "🔍 运行代码检查..."
    
    echo "  - ESLint 检查..."
    npm run lint
    
    echo "  - TypeScript 类型检查..."
    npm run check
    
    echo "✅ 代码检查通过"
}

# 构建项目
build_project() {
    echo "🏗️ 构建项目..."
    npm run build
    echo "✅ 项目构建完成"
}

# 检查环境变量
check_env() {
    echo "🔧 检查环境变量..."
    
    if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
        echo "⚠️ 警告：未找到环境变量文件"
        echo "   请确保在部署平台上配置了以下环境变量："
        echo "   - MOONSHOT_API_KEY"
        echo "   - VITE_MOONSHOT_API_KEY (可选，用于客户端)"
    else
        echo "✅ 环境变量文件存在"
    fi
}

# Vercel 部署
deploy_vercel() {
    echo "🌐 部署到 Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        echo "📦 安装 Vercel CLI..."
        npm install -g vercel
    fi
    
    echo "🚀 开始部署..."
    vercel --prod
    
    echo "✅ 部署完成！"
}

# 主函数
main() {
    echo "=================================="
    echo "🎯 AI提示词生成器部署脚本"
    echo "=================================="
    
    check_dependencies
    install_dependencies
    run_checks
    build_project
    check_env
    
    echo ""
    echo "📋 部署选项："
    echo "1. 部署到 Vercel (推荐)"
    echo "2. 仅构建，手动部署"
    echo "3. 退出"
    echo ""
    
    read -p "请选择部署方式 (1-3): " choice
    
    case $choice in
        1)
            deploy_vercel
            ;;
        2)
            echo "✅ 构建完成，dist/ 目录包含构建产物"
            echo "📁 你可以将 dist/ 目录的内容上传到任何静态托管服务"
            ;;
        3)
            echo "👋 退出部署"
            exit 0
            ;;
        *)
            echo "❌ 无效选择"
            exit 1
            ;;
    esac
    
    echo ""
    echo "🎉 部署流程完成！"
    echo ""
    echo "📚 后续步骤："
    echo "1. 确保在部署平台配置了 MOONSHOT_API_KEY 环境变量"
    echo "2. 测试所有功能是否正常工作"
    echo "3. 查看部署文档：DEPLOYMENT.md"
    echo ""
}

# 错误处理
trap 'echo "❌ 部署过程中发生错误，请检查上面的错误信息"' ERR

# 运行主函数
main "$@"