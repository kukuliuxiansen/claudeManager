const fs = require('fs');
const path = require('path');

// 所有技能列表（按顺序）
const allSkills = [
    'agent-harness-construction', 'ai-first-engineering', 'api-design', 'autonomous-loops',
    'backend-patterns', 'claude-api', 'coding-standards', 'content-engine',
    'continuous-agent-loop', 'continuous-learning', 'continuous-learning-v2',
    'deep-research', 'e2e-testing', 'eval-harness', 'exa-search',
    'frontend-patterns', 'frontend-slides', 'iterative-retrieval',
    'java-coding-standards', 'jpa-patterns', 'learned', 'nutrient-document-processing',
    'plankton-code-quality', 'prompt-optimizer', 'search-first', 'skill-stocktake',
    'springboot-patterns', 'springboot-tdd', 'springboot-verification', 'tdd-workflow',
    'verification-loop', 'agentic-engineering', 'android-clean-architecture',
    'article-writing', 'blueprint', 'carrier-relationship-management',
    'clickhouse-io', 'compose-multiplatform-patterns', 'configure-ecc',
    'content-hash-cache-pattern', 'cost-aware-llm-pipeline', 'cpp-coding-standards',
    'cpp-testing', 'crosspost', 'customs-trade-compliance', 'database-migrations',
    'deployment-patterns', 'django-patterns', 'django-security', 'django-tdd',
    'django-verification', 'dmux-workflows', 'docker-patterns', 'energy-procurement',
    'enterprise-agent-ops', 'fal-ai-media', 'foundation-models-on-device',
    'golang-patterns', 'golang-testing', 'inventory-demand-planning',
    'investor-materials', 'investor-outreach', 'kotlin-coroutines-flows',
    'kotlin-exposed-patterns', 'kotlin-ktor-patterns', 'kotlin-patterns', 'kotlin-testing',
    'liquid-glass-design', 'logistics-exception-management', 'market-research',
    'nanoclaw-repl', 'perl-patterns', 'perl-security', 'perl-testing',
    'postgres-patterns', 'production-scheduling', 'project-guidelines-example',
    'python-patterns', 'python-testing', 'quality-nonconformance',
    'ralphinho-rfc-pipeline', 'regex-vs-llm-structured-text', 'returns-reverse-logistics',
    'security-review', 'security-scan', 'springboot-security', 'strategic-compact',
    'swift-actor-persistence', 'swift-concurrency-6-2', 'swift-protocol-di-testing',
    'swiftui-patterns', 'video-editing', 'videodb', 'visa-doc-translate', 'x-api'
];

const skillsDir = path.join(__dirname, 'pages', 'skills');

allSkills.forEach((skill, index) => {
    const prevSkill = index === 0 ? allSkills[allSkills.length - 1] : allSkills[index - 1];
    const nextSkill = index === allSkills.length - 1 ? allSkills[0] : allSkills[index + 1];

    const filePath = path.join(skillsDir, `${skill}.html`);

    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // 更新导航链接 - 匹配不同的模式
        // 模式1: onclick="location.href='xxx.html'"
        content = content.replace(
            /onclick="location\.href='[^']*\.html'">\s*<div class="nav-label">上一个/g,
            `onclick="location.href='${prevSkill}.html'">\n                <div class="nav-label">上一个`
        );
        content = content.replace(
            /onclick="location\.href='[^']*\.html'">\s*<div class="nav-label">下一个/g,
            `onclick="location.href='${nextSkill}.html'">\n                <div class="nav-label">下一个`
        );

        // 模式2: nav-title内容
        content = content.replace(
            /<div class="nav-title">[^<]*<\/div>\s*<\/div>\s*<div class="nav-card" onclick/g,
            `<div class="nav-title">${prevSkill}</div>\n            </div>\n            <div class="nav-card" onclick`
        );
        content = content.replace(
            /<div class="nav-title">[^<]*<\/div>\s*<\/div>\s*<\/div>/g,
            `<div class="nav-title">${nextSkill}</div>\n            </div>\n        </div>`
        );

        // 更精确的模式匹配
        // 找到第一个nav-card（上一个）
        content = content.replace(
            /<div class="nav-card" onclick="location\.href='[^']*\.html'">\s*<div class="nav-label">上一个<\/div>\s*<div class="nav-title">[^<]*<\/div>/g,
            `<div class="nav-card" onclick="location.href='${prevSkill}.html'">\n                <div class="nav-label">上一个</div>\n                <div class="nav-title">${prevSkill}</div>`
        );

        // 找到第二个nav-card（下一个）
        content = content.replace(
            /<div class="nav-card" onclick="location\.href='[^']*\.html'">\s*<div class="nav-label">下一个<\/div>\s*<div class="nav-title">[^<]*<\/div>/g,
            `<div class="nav-card" onclick="location.href='${nextSkill}.html'">\n                <div class="nav-label">下一个</div>\n                <div class="nav-title">${nextSkill}</div>`
        );

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${skill}.html (prev: ${prevSkill}, next: ${nextSkill})`);
    } else {
        console.log(`Missing: ${skill}.html`);
    }
});

console.log('\nNavigation update complete!');