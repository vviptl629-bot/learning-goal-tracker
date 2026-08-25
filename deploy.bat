@echo off
REM ===== 学习目标管理台 - 一键部署到 GitHub Pages =====
REM 用法：把本文件和新 token 一起用；或直接在下面填 TOKEN 后双击运行。
REM 注意：TOKEN 只存在本机，不会发给任何人。用完可在 GitHub 吊销。

set REPO=vviptl629-bot/learning-goal-tracker
set /p TOKEN=请输入新的 GitHub Token（classic, 需 repo 权限）: 

cd /d "%~dp0"
if not exist .git (
  git init -q
  git remote add origin https://%TOKEN%@github.com/%REPO%.git
) else (
  git remote set-url origin https://%TOKEN%@github.com/%REPO%.git
)
git add -A
git commit -qm "deploy learning-goal-tracker" || echo (无新改动可提交)
git branch -M main
git push -u origin main
echo.
echo ===== 推送完成 =====
echo 然后到 GitHub 仓库 Settings - Pages - Source 选 main / root - Save
echo 几分钟后访问： https://vviptl629-bot.github.io/learning-goal-tracker/
pause
