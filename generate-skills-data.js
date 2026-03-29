#!/usr/bin/env node
/**
 * 生成技能、Agent和Command数据文件
 * 扫描本地和插件目录，生成skills-data.js
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || require('os').homedir();
const CLAUDE_DIR = path.join(HOME, '.claude');
const LOCAL_SKILLS_DIR = path.join(CLAUDE_DIR, 'skills');
const LOCAL_AGENTS_DIR = path.join(CLAUDE_DIR, 'agents');
const LOCAL_COMMANDS_DIR = path.join(CLAUDE_DIR, 'commands');
const INSTALLED_PLUGINS_FILE = path.join(CLAUDE_DIR, 'plugins', 'installed_plugins.json');
const OUTPUT_FILE = path.join(__dirname, 'pages', 'skills-data.js');

// 读取文件完整内容
function getFileContent(filePath) {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
    }
    return null;
}

// 解析 MD 内容提取结构化信息
function parseContent(content, itemName, itemType) {
    if (!content) {
        return {
            name: itemName,
            type: itemType,
            description: '无描述',
            fullContent: ''
        };
    }

    const lines = content.split('\n');
    let title = itemName;
    let description = '';
    let sections = {};
    let currentSection = 'intro';
    let sectionContent = [];
    let foundFirstPara = false;
    let inFrontmatter = false;
    let inCodeBlock = false;
    let frontmatterEnded = false;

    for (const line of lines) {
        const trimmed = line.trim();

        // 检测 frontmatter 开始/结束
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

        // 跳过 frontmatter 内容
        if (inFrontmatter) continue;

        // 检测代码块
        if (trimmed.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }

        // 跳过代码块内的所有内容
        if (inCodeBlock) continue;

        // 跳过空行
        if (!trimmed) continue;

        // 提取标题 - 只在 frontmatter 结束后，第一个非代码块的 # 行
        if (trimmed.startsWith('# ') && frontmatterEnded && title === itemName) {
            title = trimmed.substring(2).trim();
            continue;
        }

        // 提取二级标题作为章节
        if (trimmed.startsWith('## ')) {
            if (sectionContent.length > 0 && currentSection !== 'intro') {
                sections[currentSection] = sectionContent.join('\n');
            }
            currentSection = trimmed.substring(3).trim().toLowerCase().replace(/\s+/g, '-');
            sectionContent = [];
            continue;
        }

        // 第一个非标题段落作为描述
        if (!trimmed.startsWith('#') && !trimmed.startsWith('```') && !foundFirstPara && currentSection === 'intro') {
            description = trimmed.substring(0, 200); // 限制描述长度
            foundFirstPara = true;
            continue;
        }

        // 收集章节内容
        if (currentSection !== 'intro') {
            sectionContent.push(line);
        }
    }

    // 保存最后一个章节
    if (sectionContent.length > 0 && currentSection !== 'intro') {
        sections[currentSection] = sectionContent.join('\n');
    }

    return {
        name: itemName,
        type: itemType,
        title: title,
        description: description,
        sections: sections,
        fullContent: content
    };
}

// 从 installed_plugins.json 获取已安装插件的目录
function getInstalledPluginDirs() {
    const dirs = [];
    if (!fs.existsSync(INSTALLED_PLUGINS_FILE)) return dirs;

    try {
        const installed = JSON.parse(fs.readFileSync(INSTALLED_PLUGINS_FILE, 'utf8'));
        if (installed.plugins) {
            for (const [pluginName, installs] of Object.entries(installed.plugins)) {
                for (const install of installs) {
                    const basePath = install.installPath;

                    // Skills目录
                    const skillsDir = path.join(basePath, 'skills');
                    if (fs.existsSync(skillsDir)) {
                        dirs.push({ name: pluginName.split('@')[0], path: skillsDir, type: 'skills' });
                    }

                    // Agents目录
                    const agentsDir = path.join(basePath, 'agents');
                    if (fs.existsSync(agentsDir)) {
                        dirs.push({ name: pluginName.split('@')[0], path: agentsDir, type: 'agents' });
                    }

                    // Commands目录
                    const commandsDir = path.join(basePath, 'commands');
                    if (fs.existsSync(commandsDir)) {
                        dirs.push({ name: pluginName.split('@')[0], path: commandsDir, type: 'commands' });
                    }
                }
            }
        }
    } catch (e) {
        console.log('解析 installed_plugins.json 失败:', e.message);
    }
    return dirs;
}

// 扫描目录中的项目
function scanDir(dir, origin, itemType) {
    const items = {};
    if (!fs.existsSync(dir)) return items;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            // 对于skills，检查SKILL.md
            const itemDir = path.join(dir, entry.name);
            if (itemType === 'skills') {
                const content = getFileContent(path.join(itemDir, 'SKILL.md'));
                if (content) {
                    const parsed = parseContent(content, entry.name, 'skill');
                    items[entry.name] = {
                        name: entry.name,
                        type: 'skill',
                        title: parsed.title,
                        description: parsed.description,
                        sections: parsed.sections,
                        fullContent: parsed.fullContent,
                        origin: origin
                    };
                }
            }
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            // 对于agents和commands，直接读取md文件
            const itemName = entry.name.replace('.md', '');
            const filePath = path.join(dir, entry.name);

            // 跳过README文件
            if (itemName.toLowerCase() === 'readme') continue;

            const content = getFileContent(filePath);
            const parsed = parseContent(content, itemName, itemType === 'agents' ? 'agent' : 'command');
            items[itemName] = {
                name: itemName,
                type: itemType === 'agents' ? 'agent' : 'command',
                title: parsed.title,
                description: parsed.description,
                sections: parsed.sections,
                fullContent: parsed.fullContent,
                origin: origin
            };
        }
    }
    return items;
}

// 主函数
function generateSkillsData() {
    const allItems = {};

    // 1. 先扫描本地skills
    console.log('扫描本地技能目录:', LOCAL_SKILLS_DIR);
    const localSkills = scanDir(LOCAL_SKILLS_DIR, 'local', 'skills');
    console.log(`找到 ${Object.keys(localSkills).length} 个本地技能`);
    Object.assign(allItems, localSkills);

    // 2. 扫描本地agents
    console.log('\n扫描本地Agent目录:', LOCAL_AGENTS_DIR);
    const localAgents = scanDir(LOCAL_AGENTS_DIR, 'local', 'agents');
    console.log(`找到 ${Object.keys(localAgents).length} 个本地Agent`);
    Object.assign(allItems, localAgents);

    // 3. 扫描本地commands
    console.log('\n扫描本地Command目录:', LOCAL_COMMANDS_DIR);
    const localCommands = scanDir(LOCAL_COMMANDS_DIR, 'local', 'commands');
    console.log(`找到 ${Object.keys(localCommands).length} 个本地Command`);
    Object.assign(allItems, localCommands);

    // 4. 从 installed_plugins.json 获取已安装插件的目录
    console.log('\n扫描已安装插件...');
    const pluginDirs = getInstalledPluginDirs();

    const skillsDirs = pluginDirs.filter(d => d.type === 'skills');
    const agentsDirs = pluginDirs.filter(d => d.type === 'agents');
    const commandsDirs = pluginDirs.filter(d => d.type === 'commands');

    // 扫描插件skills
    for (const { name, path: dirPath } of skillsDirs) {
        console.log(`扫描插件技能目录: ${name} (${dirPath})`);
        const pluginSkills = scanDir(dirPath, name, 'skills');
        const count = Object.keys(pluginSkills).length;
        if (count > 0) {
            console.log(`找到 ${count} 个 ${name} 技能`);
            for (const [itemName, item] of Object.entries(pluginSkills)) {
                if (!allItems[itemName]) {
                    allItems[itemName] = item;
                }
            }
        }
    }

    // 扫描插件agents
    for (const { name, path: dirPath } of agentsDirs) {
        console.log(`扫描插件Agent目录: ${name} (${dirPath})`);
        const pluginAgents = scanDir(dirPath, name, 'agents');
        const count = Object.keys(pluginAgents).length;
        if (count > 0) {
            console.log(`找到 ${count} 个 ${name} Agent`);
            for (const [itemName, item] of Object.entries(pluginAgents)) {
                if (!allItems[itemName]) {
                    allItems[itemName] = item;
                }
            }
        }
    }

    // 扫描插件commands
    for (const { name, path: dirPath } of commandsDirs) {
        console.log(`扫描插件Command目录: ${name} (${dirPath})`);
        const pluginCommands = scanDir(dirPath, name, 'commands');
        const count = Object.keys(pluginCommands).length;
        if (count > 0) {
            console.log(`找到 ${count} 个 ${name} Command`);
            for (const [itemName, item] of Object.entries(pluginCommands)) {
                if (!allItems[itemName]) {
                    allItems[itemName] = item;
                }
            }
        }
    }

    // 5. 统计并生成JS文件
    const total = Object.keys(allItems).length;
    const skills = Object.values(allItems).filter(i => i.type === 'skill');
    const agents = Object.values(allItems).filter(i => i.type === 'agent');
    const commands = Object.values(allItems).filter(i => i.type === 'command');

    console.log(`\n总计: ${total} 个项目`);
    console.log(`  - Skills: ${skills.length}`);
    console.log(`  - Agents: ${agents.length}`);
    console.log(`  - Commands: ${commands.length}`);

    const jsContent = `// Auto-generated skills, agents and commands data
// Generated at: ${new Date().toISOString()}
// Total items: ${total}
// Skills: ${skills.length}, Agents: ${agents.length}, Commands: ${commands.length}

const CAPABILITIES_DATA = ${JSON.stringify(allItems, null, 2)};
`;

    fs.writeFileSync(OUTPUT_FILE, jsContent);
    console.log(`\n已生成: ${OUTPUT_FILE}`);
}

generateSkillsData();