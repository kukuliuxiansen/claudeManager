// 技能中文描述映射表
// 每个技能都有单独的中文描述

const SKILL_CHINESE_DESCRIPTIONS = {
    // AI/代理相关
    'agent-harness-construction': '构建高质量代理测试框架，包含评估基准和行为验证',
    'ai-first-engineering': 'AI优先工程方法论，将AI能力融入软件开发全流程',
    'claude-api': 'Claude API集成技能，包含认证、调用和错误处理最佳实践',
    'prompt-optimizer': '提示词优化技能，提升LLM响应质量和效率',
    'agentic-engineering': '代理工程技能，设计自主执行任务的AI系统',
    'autonomous-loops': '自主循环执行技能，实现无需人工干预的持续任务处理',
    'continuous-agent-loop': '持续代理循环，长时间运行的自动化任务处理',
    'continuous-learning': '持续学习技能，从反馈中不断改进系统表现',
    'continuous-learning-v2': '持续学习v2版本，增强版自我改进机制',
    'enterprise-agent-ops': '企业级代理运维，大规模代理系统的部署和管理',
    'configure-ecc': 'Everything Claude Code 配置技能，定制ECC环境',
    'learned': '学习记录技能，存储和应用过往经验',
    'skill-stocktake': '技能盘点，审计和整理现有技能库',

    // 测试相关
    'tdd-workflow': '测试驱动开发工作流，先写测试再实现代码',
    'verification-loop': '验证循环，持续检查代码质量直到达标',
    'e2e-testing': '端到端测试技能，验证完整用户流程',
    'eval-harness': '评估框架技能，构建AI模型性能基准测试',
    'springboot-tdd': 'Spring Boot TDD，Java后端测试驱动开发',
    'springboot-verification': 'Spring Boot验证，后端应用质量检查',
    'django-tdd': 'Django TDD，Python Web框架测试驱动开发',
    'django-verification': 'Django验证，Python Web应用质量检查',
    'python-testing': 'Python测试技能，单元测试和集成测试最佳实践',
    'golang-testing': 'Go测试技能，Go语言测试模式和工具',
    'kotlin-testing': 'Kotlin测试技能，Kotlin代码验证方法',
    'cpp-testing': 'C++测试技能，C++代码单元测试框架',
    'perl-testing': 'Perl测试技能，Perl代码验证方法',

    // 安全相关
    'security-review': '安全审计技能，代码安全漏洞全面检查',
    'security-scan': '安全扫描技能，快速检测常见安全风险',
    'django-security': 'Django安全，Python Web应用安全加固',
    'springboot-security': 'Spring Boot安全，Java后端安全配置',
    'perl-security': 'Perl安全，Perl代码安全最佳实践',

    // 前端相关
    'frontend-patterns': '前端开发模式，React/Vue等框架最佳实践',
    'frontend-slides': '前端演示文稿，创建技术分享幻灯片',
    'swiftui-patterns': 'SwiftUI模式，iOS原生UI开发最佳实践',
    'liquid-glass-design': '液态玻璃设计，现代UI视觉效果实现',

    // 后端/API相关
    'backend-patterns': '后端开发模式，API设计和数据处理最佳实践',
    'api-design': 'API设计技能，RESTful和GraphQL接口规范',
    'database-migrations': '数据库迁移技能，安全执行数据库变更',
    'postgres-patterns': 'PostgreSQL模式，关系型数据库最佳实践',
    'clickhouse-io': 'ClickHouse IO，列式数据库高性能查询',
    'content-hash-cache-pattern': '内容哈希缓存模式，高效数据缓存策略',
    'x-api': 'X平台API集成，社交媒体数据交互',

    // Python相关
    'python-patterns': 'Python开发模式，Pythonic代码风格和最佳实践',
    'django-patterns': 'Django模式，Python Web框架开发规范',

    // Java相关
    'java-coding-standards': 'Java编码规范，Java代码风格标准',
    'springboot-patterns': 'Spring Boot模式，Java后端框架最佳实践',
    'jpa-patterns': 'JPA模式，Java持久化API数据访问规范',

    // Kotlin相关
    'kotlin-patterns': 'Kotlin模式，Kotlin语言最佳实践',
    'kotlin-coroutines-flows': 'Kotlin协程流，异步编程和响应式数据流',
    'kotlin-exposed-patterns': 'Kotlin Exposed模式，Kotlin SQL框架最佳实践',
    'kotlin-ktor-patterns': 'Kotlin Ktor模式，Kotlin Web服务开发',
    'compose-multiplatform-patterns': 'Compose多平台模式，Kotlin跨平台UI开发',

    // Go相关
    'golang-patterns': 'Go语言模式，Go并发编程和代码规范',

    // Swift相关
    'swift-concurrency-6-2': 'Swift并发6.2，Swift最新并发特性使用',
    'swift-actor-persistence': 'Swift Actor持久化，Swift并发模型数据存储',
    'swift-protocol-di-testing': 'Swift协议依赖注入测试，Swift依赖管理',

    // C++相关
    'cpp-coding-standards': 'C++编码规范，现代C++代码风格标准',

    // Perl相关
    'perl-patterns': 'Perl模式，Perl语言开发规范',

    // DevOps相关
    'docker-patterns': 'Docker模式，容器化部署最佳实践',
    'deployment-patterns': '部署模式，应用发布和环境管理',
    'nanoclaw-repl': 'Nanoclaw REPL，交互式开发环境',

    // 移动端相关
    'android-clean-architecture': 'Android清洁架构，移动端分层设计模式',

    // 内容创作相关
    'content-engine': '内容引擎，自动化内容生成和管理',
    'article-writing': '文章写作技能，创建技术博客和文档',
    'investor-materials': '投资者材料，融资文档和演示准备',
    'investor-outreach': '投资者外联，融资沟通和关系建立',
    'video-editing': '视频编辑技能，视频内容创作和处理',
    'videodb': 'VideoDB，视频数据库管理和检索',
    'crosspost': '跨平台发布，内容多渠道同步分发',
    'strategic-compact': '战略摘要，商业计划核心要点提炼',

    // 研究相关
    'deep-research': '深度研究技能，全面收集和分析信息',
    'market-research': '市场研究，行业分析和竞争情报',
    'exa-search': 'Exa搜索，AI驱动的智能信息检索',
    'search-first': '搜索优先，先查询再行动的工作模式',
    'iterative-retrieval': '迭代检索，多轮信息获取优化',
    'regex-vs-llm-structured-text': '正则vs LLM结构化文本，文本解析策略选择',

    // 工作流相关
    'dmux-workflows': 'DMux工作流，分布式多任务处理流程',

    // 代码质量相关
    'coding-standards': '编码规范，通用代码风格和质量标准',
    'plankton-code-quality': 'Plankton代码质量，代码健康度检查',

    // AI/LLM相关
    'cost-aware-llm-pipeline': '成本感知LLM管道，优化AI调用成本',
    'fal-ai-media': 'Fal AI媒体，AI媒体生成和处理',
    'foundation-models-on-device': '设备端基础模型，本地AI模型部署',

    // 其他
    'blueprint': '蓝图技能，项目架构规划和设计',
    'carrier-relationship-management': '承运商关系管理，物流合作伙伴管理',
    'customs-trade-compliance': '海关贸易合规，进出口法规遵循',
    'energy-procurement': '能源采购，电力和能源供应链管理',
    'inventory-demand-planning': '库存需求规划，供应链预测和优化',
    'logistics-exception-management': '物流异常管理，运输问题处理',
    'production-scheduling': '生产排程，制造计划优化',
    'quality-nonconformance': '质量不合格处理，产品缺陷管理',
    'returns-reverse-logistics': '退货逆向物流，售后退货处理',
    'visa-doc-translate': '签证文档翻译，出入境文件处理',
    'ralphinho-rfc-pipeline': 'Ralphinho RFC管道，需求文档自动化',
    'project-guidelines-example': '项目指南示例，项目规范模板'
};

// 获取技能的中文描述
function getSkillChineseDescription(skillName) {
    return SKILL_CHINESE_DESCRIPTIONS[skillName] || '专业领域技能模块';
}