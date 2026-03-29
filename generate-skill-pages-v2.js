#!/usr/bin/env node
/**
 * 批量生成中文Skill详情页面
 * 按照 everything 项目的标准格式生成
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DATA_FILE = path.join(__dirname, 'pages', 'skills-data.js');
const OUTPUT_DIR = path.join(__dirname, 'pages', 'skills');

// 颜色映射
const TYPE_COLORS = {
    'skill': { primary: '#00d4aa', secondary: '#00a888' },
    'agent': { primary: '#8b5cf6', secondary: '#7c3aed' },
    'command': { primary: '#f59e0b', secondary: '#d97706' }
};

// 类型中文名
const TYPE_NAMES = {
    'skill': '技能',
    'agent': 'Agent',
    'command': '命令'
};

// 中文名称映射（常用技能）
const CHINESE_NAMES = {
    'tdd-workflow': '测试驱动开发工作流',
    'api-design': 'API设计模式',
    'backend-patterns': '后端开发模式',
    'frontend-patterns': '前端开发模式',
    'e2e-testing': '端到端测试',
    'deep-research': '深度研究',
    'exa-search': 'Exa搜索',
    'continuous-learning': '持续学习',
    'continuous-learning-v2': '持续学习 V2',
    'search-first': '搜索优先',
    'iterative-retrieval': '迭代检索',
    'verification-loop': '验证循环',
    'eval-harness': '评估框架',
    'prompt-optimizer': '提示词优化',
    'skill-stocktake': '技能盘点',
    'autonomous-loops': '自主循环',
    'ai-first-engineering': 'AI优先工程',
    'coding-standards': '编码规范',
    'planner': '规划专家',
    'architect': '架构专家',
    'code-reviewer': '代码审查',
    'security-reviewer': '安全审查',
    'tdd-guide': 'TDD指南',
    'e2e-runner': 'E2E测试运行器',
    'doc-updater': '文档更新',
    'refactor-cleaner': '重构清理',
    'build-error-resolver': '构建错误解决',
    'database-reviewer': '数据库审查',
    'go-reviewer': 'Go代码审查',
    'python-reviewer': 'Python代码审查',
    'kotlin-reviewer': 'Kotlin代码审查',
    'loop-operator': '循环操作员',
    'harness-optimizer': 'Harness优化',
    'chief-of-staff': '首席助理',
    'frontend-design': '前端设计',
    'skill-creator': '技能创建器',
    'claude-md-improver': 'CLAUDE.md改进器',
    'agent-development': 'Agent开发',
    'command-development': '命令开发',
    'hook-development': 'Hook开发',
    'mcp-integration': 'MCP集成',
    'plugin-settings': '插件设置',
    'plugin-structure': '插件结构',
    'skill-development': '技能开发',
    'build-mcp-app': '构建MCP应用',
    'build-mcp-server': '构建MCP服务器',
    'build-mcpb': '构建MCPB',
    'playground': 'Playground',
    'writing-rules': '编写规则',
    'troubleshooting': '故障排查',
    'debug-optimize-lcp': '调试优化LCP',
    'a11y-debugging': '无障碍调试',
    'chrome-devtools': 'Chrome DevTools',
    'browser-automation': '浏览器自动化',
    'springboot-patterns': 'SpringBoot模式',
    'springboot-tdd': 'SpringBoot TDD',
    'springboot-verification': 'SpringBoot验证',
    'jpa-patterns': 'JPA模式',
    'django-patterns': 'Django模式',
    'django-tdd': 'Django TDD',
    'django-security': 'Django安全',
    'postgres-patterns': 'PostgreSQL模式',
    'cpp-testing': 'C++测试',
    'python-testing': 'Python测试',
    'golang-testing': 'Golang测试',
    'kotlin-testing': 'Kotlin测试',
    'perl-testing': 'Perl测试',
    'blueprint': '蓝图',
    'agentic-engineering': 'Agent工程',
    'ai-regression-testing': 'AI回归测试',
    'android-clean-architecture': 'Android清洁架构',
    'architecture-decision-records': '架构决策记录',
    'article-writing': '文章写作',
    'benchmark': '基准测试',
    'browser-qa': '浏览器QA',
    'bun-runtime': 'Bun运行时',
    'canary-watch': '金丝雀监控',
    'carrier-relationship-management': '运营商关系管理',
    'claude-devfleet': 'Claude DevFleet',
    'click-path-audit': '点击路径审计',
    'clickhouse-io': 'ClickHouse IO',
    'codebase-onboarding': '代码库入门',
    'compose-multiplatform-patterns': 'Compose多平台模式',
    'configure-ecc': '配置ECC',
    'content-hash-cache-pattern': '内容哈希缓存模式',
    'context-budget': '上下文预算',
    'cost-aware-llm-pipeline': '成本感知LLM管道',
    'cpp-coding-standards': 'C++编码规范',
    'crosspost': '跨平台发布',
    'customs-trade-compliance': '海关贸易合规',
    'data-scraper-agent': '数据抓取Agent',
    'database-migrations': '数据库迁移',
    'deployment-patterns': '部署模式',
    'design-system': '设计系统',
    'learned': '已学习',
    'agent-harness-construction': 'Agent Harness构建',
    'claude-api': 'Claude API',
    'content-engine': '内容引擎',
    'continuous-agent-loop': '持续Agent循环',
    'frontend-slides': '前端幻灯片',
    'java-coding-standards': 'Java编码规范',
    'nutrient-document-processing': '营养文档处理',
    'plankton-code-quality': 'Plankton代码质量',
    'agent-eval': 'Agent评估'
};

// 中文描述映射
const CHINESE_DESCRIPTIONS = {
    'tdd-workflow': '测试驱动开发工作流，强制执行先写测试的方法论，确保代码覆盖率80%以上',
    'api-design': 'API设计模式和最佳实践，确保API的一致性、可维护性和可扩展性',
    'backend-patterns': '后端开发模式和架构模式，包括服务层、数据访问层、业务逻辑层的设计',
    'frontend-patterns': '前端开发模式和组件设计模式，包括状态管理、组件通信、样式管理等',
    'e2e-testing': '端到端测试专家，使用Playwright进行关键用户流程的自动化测试',
    'deep-research': '深度研究技能，进行多轮搜索和分析，提供全面的调研报告',
    'exa-search': 'Exa搜索集成，使用Exa AI搜索引擎进行高质量的网页搜索',
    'continuous-learning': '持续学习技能，自动从对话中提取经验并保存到记忆系统',
    'continuous-learning-v2': '持续学习V2版本，增强的置信度评分和自动提取功能',
    'search-first': '搜索优先原则，在进行实现前先搜索现有代码和最佳实践',
    'iterative-retrieval': '迭代检索策略，通过多轮检索逐步完善信息收集',
    'verification-loop': '验证循环，确保代码修改的正确性和一致性',
    'eval-harness': '评估框架，用于评估Agent和技能的性能和质量',
    'prompt-optimizer': '提示词优化器，自动改进和优化提示词的清晰度和效果',
    'skill-stocktake': '技能盘点工具，审计所有技能的质量并提供改进建议',
    'autonomous-loops': '自主循环控制，管理和监控Agent的自主执行循环',
    'ai-first-engineering': 'AI优先工程原则，在AI辅助开发环境下的最佳实践',
    'coding-standards': '编码规范和质量标准，确保代码的一致性和可维护性',
    'planner': '规划专家Agent，为复杂功能实现提供详细的实施计划',
    'architect': '架构专家Agent，进行系统设计和技术决策分析',
    'code-reviewer': '代码审查Agent，检查代码质量、安全性和最佳实践',
    'security-reviewer': '安全审查Agent，检测安全漏洞并提供修复建议',
    'tdd-guide': 'TDD指南Agent，强制执行测试驱动开发方法论',
    'e2e-runner': 'E2E测试运行器，使用Playwright进行端到端测试',
    'doc-updater': '文档更新Agent，自动更新项目文档和代码地图',
    'refactor-cleaner': '重构清理Agent，识别和删除死代码',
    'build-error-resolver': '构建错误解决Agent，分析和修复构建和类型错误',
    'database-reviewer': '数据库审查Agent，优化SQL查询和数据库设计',
    'go-reviewer': 'Go代码审查Agent，检查Go代码的惯用模式和最佳实践',
    'python-reviewer': 'Python代码审查Agent，检查PEP 8合规性和Python惯用模式',
    'kotlin-reviewer': 'Kotlin代码审查Agent，检查Kotlin惯用模式和协程安全',
    'loop-operator': '循环操作员，监控和管理自主Agent循环',
    'harness-optimizer': 'Harness优化器，优化Agent Harness配置',
    'chief-of-staff': '首席助理Agent，管理多渠道通信和消息分类',
    'frontend-design': '前端设计技能，提供前端UI/UX设计指导',
    'skill-creator': '技能创建器，帮助用户创建新的技能',
    'claude-md-improver': 'CLAUDE.md改进器，优化项目CLAUDE.md文件',
    'agent-development': 'Agent开发指南，帮助开发新的Agent',
    'command-development': '命令开发指南，帮助开发新的命令',
    'hook-development': 'Hook开发指南，帮助开发新的Hook',
    'mcp-integration': 'MCP集成指南，集成Model Context Protocol',
    'plugin-settings': '插件设置指南，配置Claude Code插件',
    'plugin-structure': '插件结构指南，了解插件的组织结构',
    'skill-development': '技能开发指南，创建和维护技能',
    'build-mcp-app': '构建MCP应用，创建MCP应用程序',
    'build-mcp-server': '构建MCP服务器，创建MCP服务器',
    'build-mcpb': '构建MCPB，创建MCPB包',
    'playground': 'Playground，测试和实验技能的环境',
    'writing-rules': '编写规则指南，创建项目规则文件',
    'troubleshooting': '故障排查技能，诊断和解决常见问题',
    'debug-optimize-lcp': '调试优化LCP，优化页面加载性能',
    'a11y-debugging': '无障碍调试，检查和修复无障碍问题',
    'chrome-devtools': 'Chrome DevTools技能，使用浏览器开发工具',
    'browser-automation': '浏览器自动化，使用Playwright进行自动化',
    'springboot-patterns': 'SpringBoot模式，Spring Boot开发的最佳实践',
    'springboot-tdd': 'SpringBoot TDD，Spring Boot的测试驱动开发',
    'springboot-verification': 'SpringBoot验证，验证Spring Boot应用',
    'jpa-patterns': 'JPA模式，JPA数据访问的最佳实践',
    'django-patterns': 'Django模式，Django开发的最佳实践',
    'django-tdd': 'Django TDD，Django的测试驱动开发',
    'django-security': 'Django安全，Django应用的安全最佳实践',
    'postgres-patterns': 'PostgreSQL模式，PostgreSQL数据库的最佳实践',
    'cpp-testing': 'C++测试，C++代码的测试策略',
    'python-testing': 'Python测试，Python代码的测试策略',
    'golang-testing': 'Golang测试，Go代码的测试策略',
    'kotlin-testing': 'Kotlin测试，Kotlin代码的测试策略',
    'perl-testing': 'Perl测试，Perl代码的测试策略',
    'blueprint': '蓝图技能，快速生成项目架构蓝图',
    'agentic-engineering': 'Agent工程，Agent系统开发的最佳实践',
    'ai-regression-testing': 'AI回归测试，AI模型的回归测试策略',
    'android-clean-architecture': 'Android清洁架构，Android应用的架构设计',
    'architecture-decision-records': '架构决策记录，记录架构决策',
    'article-writing': '文章写作，技术文章的写作指南',
    'benchmark': '基准测试，性能基准测试策略',
    'browser-qa': '浏览器QA，浏览器自动化测试',
    'bun-runtime': 'Bun运行时，使用Bun运行JavaScript',
    'canary-watch': '金丝雀监控，监控金丝雀部署',
    'carrier-relationship-management': '运营商关系管理，管理运营商关系',
    'claude-devfleet': 'Claude DevFleet，管理开发舰队',
    'click-path-audit': '点击路径审计，审计用户点击路径',
    'clickhouse-io': 'ClickHouse IO，ClickHouse数据库集成',
    'codebase-onboarding': '代码库入门，新项目入门指南',
    'compose-multiplatform-patterns': 'Compose多平台模式，Jetpack Compose最佳实践',
    'configure-ecc': '配置ECC，配置Everything Claude Code',
    'content-hash-cache-pattern': '内容哈希缓存模式，缓存策略',
    'context-budget': '上下文预算，管理上下文窗口使用',
    'cost-aware-llm-pipeline': '成本感知LLM管道，优化LLM成本',
    'cpp-coding-standards': 'C++编码规范，C++代码质量标准',
    'crosspost': '跨平台发布，多平台内容发布',
    'customs-trade-compliance': '海关贸易合规，合规管理',
    'data-scraper-agent': '数据抓取Agent，自动化数据抓取',
    'database-migrations': '数据库迁移，数据库版本管理',
    'deployment-patterns': '部署模式，应用部署最佳实践',
    'design-system': '设计系统，UI设计系统管理',
    'learned': '已学习，记录的学习经验',
    'agent-harness-construction': 'Agent Harness构建，构建Agent Harness',
    'claude-api': 'Claude API，使用Claude API',
    'content-engine': '内容引擎，内容生成和处理',
    'continuous-agent-loop': '持续Agent循环，Agent循环管理',
    'frontend-slides': '前端幻灯片，前端演示文稿',
    'java-coding-standards': 'Java编码规范，Java代码质量标准',
    'nutrient-document-processing': '营养文档处理，文档处理流程',
    'plankton-code-quality': 'Plankton代码质量，代码质量分析',
    'agent-eval': 'Agent评估，评估Agent性能'
};

// 生成HTML页面
function generateSkillPage(skill) {
    const colors = TYPE_COLORS[skill.type] || TYPE_COLORS['skill'];
    const typeName = TYPE_NAMES[skill.type] || '技能';
    const chineseName = CHINESE_NAMES[skill.name] || skill.title || skill.name;
    const chineseDesc = CHINESE_DESCRIPTIONS[skill.name] || '技能模块，提供专业领域的自动化处理能力';

    // 解析内容为章节
    const sections = parseSections(skill.fullContent);

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chineseName} - Everything Claude Code</title>
    <link rel="stylesheet" href="../../styles/shared.css">
    <style>
        .detail-container { max-width: 1000px; margin: 0 auto; padding: 40px; }
        .detail-header {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
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
        .section-title { font-size: 24px; font-weight: 600; color: ${colors.primary}; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .section-title svg { width: 24px; height: 24px; fill: ${colors.primary}; }
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
        .origin-value { color: ${colors.primary}; font-weight: 600; }
        .detail-nav { display: flex; justify-content: space-between; gap: 20px; margin-top: 40px; padding-top: 40px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .nav-card { flex: 1; background: rgba(26, 26, 46, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.3s ease; text-decoration: none; }
        .nav-card:hover { border-color: ${colors.primary}40; background: rgba(26, 26, 46, 0.8); }
        .nav-label { font-size: 12px; color: rgba(255, 255, 255, 0.5); margin-bottom: 5px; }
        .nav-title { font-size: 16px; color: rgba(255, 255, 255, 0.8); font-weight: 500; }
        .nav-type { font-size: 12px; color: ${colors.primary}; margin-top: 5px; }
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
        <span class="breadcrumb-current">${chineseName}</span>
    </nav>

    <div class="detail-container">
        <header class="detail-header">
            <div class="detail-icon">
                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <h1 class="detail-title">${chineseName}</h1>
            <p class="detail-subtitle">${chineseDesc}</p>
            <div class="detail-badges">
                <div class="detail-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
                    ${typeName}
                </div>
                <div class="detail-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    ${skill.origin || 'local'}
                </div>
            </div>
        </header>

        <div class="origin-info">
            <span class="origin-label">来源:</span>
            <span class="origin-value">${skill.origin || 'local'}</span>
        </div>

        ${generateSectionsHtml(sections, colors)}

        <section class="section-card">
            <h2 class="section-title">
                <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 18c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                完整内容
            </h2>
            <div class="section-content">
                <pre class="section-text full-content-text">${escapeHtml(skill.fullContent || '暂无内容')}</pre>
            </div>
        </section>

        <div class="detail-nav">
            <a class="nav-card" href="../skills.html">
                <div class="nav-label">返回列表</div>
                <div class="nav-title">Capabilities 列表</div>
                <div class="nav-type">${typeName}</div>
            </a>
        </div>
    </div>
</body>
</html>`;
}

// 解析内容为章节
function parseSections(content) {
    if (!content) return [];

    const sections = [];
    const lines = content.split('\n');
    let currentSection = null;
    let currentContent = [];
    let inCodeBlock = false;
    let inFrontmatter = false;
    let frontmatterEnded = false;

    for (const line of lines) {
        const trimmed = line.trim();

        // 检测 frontmatter
        if (trimmed === '---') {
            if (!inFrontmatter && !frontmatterEnded) {
                inFrontmatter = true;
                continue;
            } else if (inFrontmatter) {
                inFrontmatter = false;
                frontmatterEnded = true;
                continue;
            }
        }

        if (inFrontmatter) continue;

        // 检测代码块
        if (trimmed.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            currentContent.push(line);
            continue;
        }

        // 检测二级标题
        if (trimmed.startsWith('## ') && !inCodeBlock) {
            if (currentSection) {
                sections.push({
                    title: currentSection,
                    content: currentContent.join('\n').trim()
                });
            }
            currentSection = trimmed.substring(3).trim();
            currentContent = [];
            continue;
        }

        // 跳过一级标题
        if (trimmed.startsWith('# ') && !inCodeBlock) {
            continue;
        }

        currentContent.push(line);
    }

    // 保存最后一个章节
    if (currentSection && currentContent.length > 0) {
        sections.push({
            title: currentSection,
            content: currentContent.join('\n').trim()
        });
    }

    return sections;
}

// 章节名称中文映射
const SECTION_CHINESE = {
    'When To Activate': '何时激活',
    'When to Use': '何时使用',
    'Activation': '激活条件',
    'Core Principles': '核心原理',
    'Principles': '原理',
    'Tdd Workflow Steps': 'TDD工作流步骤',
    'Workflow Steps': '工作流步骤',
    'Steps': '步骤',
    'Testing Patterns': '测试模式',
    'Patterns': '模式',
    'Test File Organization': '测试文件组织',
    'File Organization': '文件组织',
    'Mocking External Services': 'Mock外部服务',
    'Mocking': 'Mock策略',
    'Test Coverage Verification': '测试覆盖率验证',
    'Coverage': '覆盖率',
    'Common Testing Mistakes To Avoid': '常见测试错误',
    'Mistakes To Avoid': '避免的错误',
    'Continuous Testing': '持续测试',
    'Best Practices': '最佳实践',
    'Practices': '实践',
    'Success Metrics': '成功指标',
    'Metrics': '指标',
    'Usage': '使用方法',
    'How to Use': '使用方法',
    'Example': '示例',
    'Examples': '示例',
    'Configuration': '配置',
    'Setup': '设置',
    'Installation': '安装',
    'Integration': '集成',
    'Features': '功能特性',
    'Feature': '功能特性',
    'Scope': '范围',
    'Description': '描述',
    'Overview': '概述',
    'Introduction': '简介',
    'Requirements': '要求',
    'Dependencies': '依赖',
    'Parameters': '参数',
    'Arguments': '参数',
    'Options': '选项',
    'Returns': '返回值',
    'Output': '输出',
    'Input': '输入',
    'Error Handling': '错误处理',
    'Errors': '错误',
    'Security': '安全',
    'Performance': '性能',
    'Limitations': '限制',
    'Notes': '注意事项',
    'Tips': '使用技巧',
    'Troubleshooting': '故障排查',
    'FAQ': '常见问题',
    'References': '参考资料',
    'See Also': '相关链接',
    'Related': '相关',
    'Changelog': '更新日志',
    'Version History': '版本历史',
    'License': '许可证',
    'Author': '作者',
    'Contributors': '贡献者'
};

// 生成章节HTML
function generateSectionsHtml(sections, colors) {
    if (!sections || sections.length === 0) return '';

    return sections.map(section => {
        const chineseTitle = SECTION_CHINESE[section.title] || section.title;
        return `
        <section class="section-card">
            <h2 class="section-title">
                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ${chineseTitle}
            </h2>
            <div class="section-content">
                <pre class="section-text">${escapeHtml(section.content)}</pre>
            </div>
        </section>`;
    }).join('\n');
}

// HTML转义
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// 主函数
function generateAllPages() {
    // 读取skills-data.js
    if (!fs.existsSync(SKILLS_DATA_FILE)) {
        console.error('skills-data.js 不存在，请先运行 generate-skills-data.js');
        process.exit(1);
    }

    const dataContent = fs.readFileSync(SKILLS_DATA_FILE, 'utf8');
    const dataMatch = dataContent.match(/const CAPABILITIES_DATA = (\{[\s\S]*\});/);
    if (!dataMatch) {
        console.error('无法解析 skills-data.js');
        process.exit(1);
    }

    const skillsData = JSON.parse(dataMatch[1]);

    // 确保输出目录存在
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 只处理skills类型
    const skills = Object.values(skillsData).filter(item => item.type === 'skill');
    console.log(`找到 ${skills.length} 个 Skill`);

    // 生成每个skill的页面
    let generated = 0;
    let skipped = 0;

    for (const skill of skills) {
        const outputPath = path.join(OUTPUT_DIR, `${skill.name}.html`);

        try {
            const html = generateSkillPage(skill);
            fs.writeFileSync(outputPath, html);
            generated++;
            console.log(`✓ ${skill.name} -> ${CHINESE_NAMES[skill.name] || skill.title || skill.name}`);
        } catch (e) {
            skipped++;
            console.log(`✗ ${skill.name}: ${e.message}`);
        }
    }

    console.log(`\n生成完成: ${generated} 个页面`);
    if (skipped > 0) {
        console.log(`跳过: ${skipped} 个`);
    }
}

generateAllPages();