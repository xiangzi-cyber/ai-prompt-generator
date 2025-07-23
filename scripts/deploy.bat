@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM AI提示词生成器 - Windows部署脚本
REM 这个脚本帮助你快速部署项目到Vercel

echo 🚀 开始部署 AI提示词生成器...
echo.

REM 检查是否安装了必要的工具
:check_dependencies
echo 📋 检查依赖...

node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm 未安装，请先安装 npm
    pause
    exit /b 1
)

echo ✅ 依赖检查完成
echo.

REM 安装项目依赖
:install_dependencies
echo 📦 安装项目依赖...
npm ci
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✅ 依赖安装完成
echo.

REM 运行代码检查
:run_checks
echo 🔍 运行代码检查...

echo   - ESLint 检查...
npm run lint
if errorlevel 1 (
    echo ❌ ESLint 检查失败
    pause
    exit /b 1
)

echo   - TypeScript 类型检查...
npm run check
if errorlevel 1 (
    echo ❌ TypeScript 检查失败
    pause
    exit /b 1
)

echo ✅ 代码检查通过
echo.

REM 构建项目
:build_project
echo 🏗️ 构建项目...
npm run build
if errorlevel 1 (
    echo ❌ 项目构建失败
    pause
    exit /b 1
)
echo ✅ 项目构建完成
echo.

REM 检查环境变量
:check_env
echo 🔧 检查环境变量...

if not exist ".env.local" if not exist ".env" (
    echo ⚠️ 警告：未找到环境变量文件
    echo    请确保在部署平台上配置了以下环境变量：
    echo    - MOONSHOT_API_KEY
    echo    - VITE_MOONSHOT_API_KEY ^(可选，用于客户端^)
) else (
    echo ✅ 环境变量文件存在
)
echo.

REM 部署选项
:deploy_options
echo ==================================
echo 📋 部署选项：
echo 1. 部署到 Vercel ^(推荐^)
echo 2. 仅构建，手动部署
echo 3. 退出
echo ==================================
echo.

set /p choice=请选择部署方式 ^(1-3^): 

if "%choice%"=="1" goto deploy_vercel
if "%choice%"=="2" goto manual_deploy
if "%choice%"=="3" goto exit_script

echo ❌ 无效选择
pause
exit /b 1

REM Vercel 部署
:deploy_vercel
echo 🌐 部署到 Vercel...

vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 安装 Vercel CLI...
    npm install -g vercel
    if errorlevel 1 (
        echo ❌ Vercel CLI 安装失败
        pause
        exit /b 1
    )
)

echo 🚀 开始部署...
vercel --prod
if errorlevel 1 (
    echo ❌ 部署失败
    pause
    exit /b 1
)

echo ✅ 部署完成！
goto success

REM 手动部署
:manual_deploy
echo ✅ 构建完成，dist\ 目录包含构建产物
echo 📁 你可以将 dist\ 目录的内容上传到任何静态托管服务
goto success

REM 退出脚本
:exit_script
echo 👋 退出部署
exit /b 0

REM 成功完成
:success
echo.
echo 🎉 部署流程完成！
echo.
echo 📚 后续步骤：
echo 1. 确保在部署平台配置了 MOONSHOT_API_KEY 环境变量
echo 2. 测试所有功能是否正常工作
echo 3. 查看部署文档：DEPLOYMENT.md
echo.
pause
exit /b 0