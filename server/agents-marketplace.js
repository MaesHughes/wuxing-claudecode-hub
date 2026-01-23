// Agents Marketplace Data
const agentsMarketplace = [
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    description: '专业的代码审查助手，检查代码质量、安全漏洞、性能问题，并提供改进建议。',
    category: '代码质量',
    author: 'Claude',
    type: 'review',
    popularity: 92,
    tags: ['review', '代码审查', '质量', '安全']
  },
  {
    id: 'test-writer',
    name: 'Test Writer',
    description: '自动化测试生成器，根据代码和需求自动编写单元测试、集成测试和端到端测试。',
    category: '测试',
    author: 'Claude',
    type: 'testing',
    popularity: 88,
    tags: ['testing', 'tests', 'tdd', 'coverage']
  },
  {
    id: 'debugger',
    name: 'Debugger',
    description: '调试专家代理，分析错误日志、堆栈跟踪和异常，快速定位问题根源并提供解决方案。',
    category: '调试',
    author: 'Claude',
    type: 'debugging',
    popularity: 90,
    tags: ['debug', 'errors', 'troubleshooting', 'logs']
  },
  {
    id: 'documenter',
    name: 'Documenter',
    description: '文档生成专家，自动从代码生成 API 文档、README 文件和使用指南。',
    category: '文档',
    author: 'Claude',
    type: 'documentation',
    popularity: 85,
    tags: ['docs', 'documentation', 'api', 'readme']
  },
  {
    id: 'refactoring',
    name: 'Refactoring Expert',
    description: '代码重构专家，识别代码异味、设计模式违规，并提供重构建议和实施。',
    category: '重构',
    author: 'Claude',
    type: 'refactoring',
    popularity: 82,
    tags: ['refactor', 'cleanup', 'patterns', 'architecture']
  },
  {
    id: 'security-scanner',
    name: 'Security Scanner',
    description: '安全扫描器，检测代码中的安全漏洞、SQL 注入、XSS 等常见安全问题。',
    category: '安全',
    author: 'Claude',
    type: 'security',
    popularity: 87,
    tags: ['security', 'vulnerabilities', 'sast', 'scan']
  },
  {
    id: 'performance-optimizer',
    name: 'Performance Optimizer',
    description: '性能优化专家，分析代码性能瓶颈、内存泄漏，并提供优化建议。',
    category: '性能',
    author: 'Claude',
    type: 'performance',
    popularity: 78,
    tags: ['performance', 'optimization', 'profiling', 'memory']
  },
  {
    id: 'migrator',
    name: 'Code Migrator',
    description: '代码迁移助手，帮助将代码从旧框架迁移到新框架，或进行语言版本升级。',
    category: '迁移',
    author: 'Claude',
    type: 'migration',
    popularity: 70,
    tags: ['migration', 'upgrade', 'framework', 'translation']
  },
  {
    id: 'explainer',
    name: 'Code Explainer',
    description: '代码解释器，深入解析复杂代码逻辑，帮助理解代码架构和实现细节。',
    category: '学习',
    author: 'Claude',
    type: 'learning',
    popularity: 88,
    tags: ['explain', 'learning', 'documentation', 'understanding']
  },
  {
    id: 'api-designer',
    name: 'API Designer',
    description: 'API 设计专家，帮助设计 RESTful API、GraphQL 接口，定义数据模型和错误处理。',
    category: '架构',
    author: 'Claude',
    type: 'architecture',
    popularity: 75,
    tags: ['api', 'rest', 'graphql', 'design']
  },
  {
    id: 'database-expert',
    name: 'Database Expert',
    description: '数据库专家，优化 SQL 查询、设计数据库架构、处理数据库迁移和性能调优。',
    category: '数据库',
    author: 'Claude',
    type: 'database',
    popularity: 80,
    tags: ['database', 'sql', 'optimization', 'schema']
  },
  {
    id: 'frontend-specialist',
    name: 'Frontend Specialist',
    description: '前端专家，精通 React、Vue、Angular 等框架，提供 UI/UX 设计建议和实现。',
    category: '前端',
    author: 'Claude',
    type: 'frontend',
    popularity: 83,
    tags: ['frontend', 'ui', 'ux', 'react', 'vue']
  }
];

module.exports = agentsMarketplace;
