const fs=require('fs');
const base='D:/Projects/builds/learning-goal-tracker/';
const p=base+'index.html';
const gistCode=fs.readFileSync(base+'_gist.txt','utf8');
let s=fs.readFileSync(p,'utf8');

const startMarker='/* ===================== GitHub 云端同步（Bills 风格） ===================== */';
const dockMarker='/* 兜底：确保手机/平板端底部 dock 始终可见（防媒体查询在部分浏览器失效） */';
const i=s.indexOf(startMarker);
const j=s.indexOf(dockMarker);
if(i<0){console.error('startMarker not found');process.exit(1);}
if(j<0){console.error('dockMarker not found');process.exit(1);}

s=s.slice(0,i)+gistCode+'\n\n'+s.slice(j);

// 删除已废弃的 ghAutoSync 块
const aStart=s.indexOf('/* 自动同步：每次 persist 后静默推送（防抖 5 秒） */');
const aEnd=s.indexOf('/* 同步诊断：一键检查当前同步链路状态 */');
if(aStart>=0&&aEnd>=0){s=s.slice(0,aStart)+'/* 自动同步已由 schedulePush 接管（Gist 方案） */\n\n'+s.slice(aEnd);}

// 删除已废弃的 ghDiag 块
const dStart=s.indexOf('/* 同步诊断：一键检查当前同步链路状态 */');
const dEnd=s.indexOf('function renderAll(){');
if(dStart>=0&&dEnd>=0){s=s.slice(0,dStart)+'/* syncDiag 已在上方 Gist 区定义 */\n\n'+s.slice(dEnd);}

fs.writeFileSync(p,s);
console.log('migrated ok');

const allowed=['gh-sync-card','gh-shield','gh-desc','gh-label','gh-hint','gh-input','gh-btn','gh-stats','gh-diag','gh-expiry-warn','gh-sync-header','gh-status-row','gh-progress','gh-progText','gh-form','gh-connected'];
const left=(s.match(/gh[A-Z][a-zA-Z]*/g)||[]).filter(function(x){return allowed.indexOf(x)<0;});
console.log('remaining gh* symbols (should be empty):', JSON.stringify(left));
