# Claude Manager 项目配置

## 定时任务

### 每日同步扫描 (21:00)

每天晚上 21 点自动扫描 Claude 组件并同步页面。

**任务 ID:** 需要每 7 天重新创建

**创建命令:**
```
使用 CronCreate 工具，参数如下：
- cron: "0 21 * * *"
- recurring: true
- durable: true
- prompt: 扫描 ~/.claude/ 目录下的 skills/、agents/、commands/、rules/ 目录，以及 ~/.claude/plugins/ 目录（如果存在），与 /Users/weidian/claudeProject/claudeManager/pages/ 下的现有页面进行对比：

1. 如果有新增的 skill/agent/command/rule/plugin：
   - 读取其源文件内容
   - 在 pages/skills/ 或 pages/agents/ 或 pages/commands/ 或 pages/rules/ 目录下创建对应的 HTML 详情页
   - 更新对应的列表页（skills.html/agents.html/commands.html/rules.html）

2. 如果有文件被删除（源文件不存在但页面还在）：
   - 在对应的页面标题添加标签：[已删除]
   - 或在卡片上添加 "已删除" 标记

3. 汇总本次扫描结果：新增多少、删除多少、更新多少

完成后提交代码。
```

## 项目结构

```
claudeManager/
├── index.html              # 首页
├── pages/
│   ├── skills.html         # Skills 列表页
│   ├── agents.html         # Agents 列表页
│   ├── commands.html       # Commands 列表页
│   ├── rules.html          # Rules 列表页
│   ├── skills/             # Skills 详情页
│   ├── agents/             # Agents 详情页
│   ├── commands/           # Commands 详情页
│   └── rules/              # Rules 详情页
└── styles/
    └── main.css            # 共享样式
```

## 颜色主题

- Skills: 青色 (#00d4aa)
- Agents: 橙色 (#f59e0b)
- Commands: 紫色 (#8b5cf6)
- Rules: 绿色 (#10b981)
- Plugins: 橙色 (#f59e0b)