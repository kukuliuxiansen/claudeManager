// 生成所有 capabilities 详情页面的脚本
const fs = require('fs');
const path = require('path');

// 读取 skills-data.js 文件并提取 JSON 数据
function loadCapabilitiesData() {
    const dataPath = path.join(__dirname, 'pages', 'skills-data.js');
    const content = fs.readFileSync(dataPath, 'utf8');

    // 使用正则表达式提取 JSON 对象部分（避免使用 eval）
    // 匹配 const CAPABILITIES_DATA = { ... };
    const match = content.match(/const CAPABILITIES_DATA = (\{[\s\S]*?\});\s*$/);
    if (!match) {
        throw new Error('无法从 skills-data.js 中提取 CAPABILITIES_DATA');
    }

    // 解析 JSON
    return JSON.parse(match[1]);
}

// 根据类型获取颜色
function getTypeColors(type) {
    switch (type) {
        case 'skill':
            return ['#00d4aa', '#00a888']; // cyan
        case 'agent':
            return ['#f59e0b', '#d97706']; // orange/amber
        case 'command':
            return ['#8b5cf6', '#7c3aed']; // purple
        default:
            return ['#6366f1', '#4f46e5']; // 默认 indigo
    }
}

// 根据类型获取图标 SVG
function getTypeIcon(type) {
    switch (type) {
        case 'skill':
            return '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'; // 星形
        case 'agent':
            return '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>'; // 地球/网络
        case 'command':
            return '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-2-6V3.5L18.5 9H14z"/>'; // 文件/命令
        default:
            return '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
    }
}

// 根据类型获取中文描述
function getTypeDescription(type) {
    switch (type) {
        case 'skill':
            return '技能模块，提供专业领域的自动化处理能力';
        case 'agent':
            return '智能代理，自主执行复杂任务的AI系统';
        case 'command':
            return '命令脚本，快速执行特定操作的快捷方式';
        default:
            return 'Claude Code 能力模块';
    }
}

// 获取类型的中文标签
function getTypeLabel(type) {
    switch (type) {
        case 'skill':
            return 'Skill';
        case 'agent':
            return 'Agent';
        case 'command':
            return 'Command';
        default:
            return 'Capability';
    }
}

// 生成HTML模板
function generateDetailPage(item, prevItem, nextItem) {
    const { name, type, title, description, sections, fullContent, origin } = item;
    const [color1, color2] = getTypeColors(type);
    const typeIcon = getTypeIcon(type);
    const typeDesc = getTypeDescription(type);
    const typeLabel = getTypeLabel(type);

    // 处理 sections 内容
    const sectionHtml = sections ? Object.entries(sections).map(([sectionName, sectionContent]) => {
        const sectionTitle = sectionName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `
        <section class="section-card">
            <h2 class="section-title">
                <svg viewBox="0 0 24 24">${getTypeIcon(type)}</svg>
                ${sectionTitle}
            </h2>
            <div class="section-content">
                <pre class="section-text">${escapeHtml(sectionContent)}</pre>
            </div>
        </section>`;
    }).join('\n') : '';

    // 处理完整内容（如果没有 sections）
    const fullContentHtml = !sections && fullContent ? `
        <section class="section-card">
            <h2 class="section-title">
                <svg viewBox="0 0 24 24">${getTypeIcon(type)}</svg>
                完整内容
            </h2>
            <div class="section-content">
                <pre class="section-text full-content-text">${escapeHtml(fullContent)}</pre>
            </div>
        </section>` : '';

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || name} - Everything Claude Code</title>
    <link rel="stylesheet" href="../../styles/shared.css">
    <style>
        .detail-container { max-width: 1000px; margin: 0 auto; padding: 40px; }
        .detail-header {
            background: linear-gradient(135deg, ${color1} 0%, ${color2} 100%);
            border-radius: 20px; padding: 50px; margin-bottom: 40px;
            position: relative; overflow: hidden;
        }
        .detail-header::before {
            content: ''; position: absolute; top: -50%; right: -50%;
            width: 200%; height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
            pointer-events: none;
        }
        .detail-icon {
            width: 80px; height: 80px; background: rgba(255,255,255,0.2);
            border-radius: 20px; display: flex; align-items: center; justify-content: center;
            margin-bottom: 20px; backdrop-filter: blur(10px);
        }
        .detail-icon svg { width: 40px; height: 40px; fill: white; }
        .detail-title { font-size: 36px; font-weight: 700; color: white; margin-bottom: 10px; letter-spacing: -1px; }
        .detail-subtitle { font-size: 18px; color: rgba(255,255,255,0.8); font-weight: 400; }
        .detail-badges { display: flex; gap: 10px; margin-top: 20px; }
        .detail-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(0,0,0,0.2); border-radius: 8px; font-size: 14px; color: rgba(255,255,255,0.9); }
        .section-card { background: rgba(26, 26, 46, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 30px; margin-bottom: 30px; }
        .section-title { font-size: 24px; font-weight: 600; color: ${color1}; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .section-title svg { width: 24px; height: 24px; fill: ${color1}; }
        .section-content { font-size: 16px; color: rgba(255, 255, 255, 0.8); line-height: 1.8; }
        .section-text {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-size: 14px;
            color: rgba(255,255,255,0.85);
            background: rgba(0,0,0,0.3);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .full-content-text { max-height: 600px; overflow-y: auto; }
        .origin-info {
            background: rgba(0,0,0,0.3);
            padding: 15px 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .origin-label { color: rgba(255,255,255,0.6); font-size: 14px; }
        .origin-value { color: ${color1}; font-weight: 600; }
        .detail-nav { display: flex; justify-content: space-between; gap: 20px; margin-top: 40px; padding-top: 40px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .nav-card { flex: 1; background: rgba(26, 26, 46, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.3s ease; text-decoration: none; }
        .nav-card:hover { border-color: ${color1}40; background: rgba(26, 26, 46, 0.8); }
        .nav-label { font-size: 12px; color: rgba(255, 255, 255, 0.5); margin-bottom: 5px; }
        .nav-title { font-size: 16px; color: rgba(255, 255, 255, 0.8); font-weight: 500; }
        .nav-type { font-size: 12px; color: ${color1}; margin-top: 5px; }
        @media (max-width: 768px) {
            .detail-container { padding: 20px; }
            .detail-header { padding: 30px; }
            .detail-title { font-size: 28px; }
            .section-card { padding: 20px; }
            .detail-nav { flex-direction: column; }
            .detail-badges { flex-direction: column; }
        }
    </style>
</head>
<body>
    <nav class="breadcrumb">
        <a href="../../index.html" class="breadcrumb-link">首页</a>
        <span class="breadcrumb-separator">/</span>
        <a href="../skills.html" class="breadcrumb-link">Capabilities</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">${title || name}</span>
    </nav>

    <div class="detail-container">
        <header class="detail-header">
            <div class="detail-icon">
                <svg viewBox="0 0 24 24">${typeIcon}</svg>
            </div>
            <h1 class="detail-title">${title || name}</h1>
            <p class="detail-subtitle">${typeDesc}</p>
            <div class="detail-badges">
                <div class="detail-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
                    ${typeLabel}
                </div>
                <div class="detail-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    ${origin || 'local'}
                </div>
            </div>
        </header>

        <div class="origin-info">
            <span class="origin-label">来源:</span>
            <span class="origin-value">${origin || 'local'}</span>
        </div>

        ${sectionHtml}
        ${fullContentHtml}

        <div class="detail-nav">
            <a class="nav-card" href="${prevItem.name}.html">
                <div class="nav-label">上一个</div>
                <div class="nav-title">${prevItem.title || prevItem.name}</div>
                <div class="nav-type">${getTypeLabel(prevItem.type)}</div>
            </a>
            <a class="nav-card" href="${nextItem.name}.html">
                <div class="nav-label">下一个</div>
                <div class="nav-title">${nextItem.title || nextItem.name}</div>
                <div class="nav-type">${getTypeLabel(nextItem.type)}</div>
            </a>
        </div>
    </div>
</body>
</html>`;
}

// HTML转义函数
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// 主函数
function main() {
    // 加载数据
    const capabilitiesData = loadCapabilitiesData();
    const items = Object.values(capabilitiesData);

    console.log(`加载了 ${items.length} 个 capabilities`);

    // 按类型分组统计
    const typeCounts = {};
    items.forEach(item => {
        typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });
    console.log('类型分布:', typeCounts);

    // 确保目录存在
    const skillsDir = path.join(__dirname, 'pages', 'skills');
    if (!fs.existsSync(skillsDir)) {
        fs.mkdirSync(skillsDir, { recursive: true });
    }

    // 检查已存在的页面
    const existingFiles = fs.readdirSync(skillsDir).filter(f => f.endsWith('.html'));
    console.log(`已存在 ${existingFiles.length} 个页面文件`);

    // 生成所有页面
    let generated = 0;
    let skipped = 0;

    items.forEach((item, index) => {
        const prevItem = items[index - 1] || items[items.length - 1];
        const nextItem = items[index + 1] || items[0];

        const fileName = `${item.name}.html`;
        const filePath = path.join(skillsDir, fileName);

        // 生成页面
        const html = generateDetailPage(item, prevItem, nextItem);
        fs.writeFileSync(filePath, html, 'utf8');
        generated++;
        console.log(`[${item.type}] 生成: ${fileName}`);
    });

    console.log(`\n完成! 生成 ${generated} 个页面, 跳过 ${skipped} 个已存在页面`);
}

// 执行
main();