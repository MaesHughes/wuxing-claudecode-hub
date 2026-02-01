// MCP Marketplace Data
const mcpMarketplace = [
  {
    id: 'github',
    name: 'GitHub',
    description: '与 GitHub 仓库、PR、Issues 集成。支持代码审查、问题追踪和版本控制操作。',
    category: '开发工具',
    author: 'GitHub',
    type: 'http',
    transport: 'http',
    config: {
      url: 'https://api.githubcopilot.com/mcp/'
    },
    requiresAuth: true,
    popularity: 95,
    tags: ['git', 'github', '代码审查', 'issues']
  },
  {
    id: 'filesystem',
    name: 'Filesystem',
    description: '安全的文件系统访问，允许 Claude 读取和写入指定目录的文件。',
    category: '文件操作',
    author: 'ModelContextProtocol',
    type: 'stdio',
    transport: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem'],
      userConfigRequired: true // 用户需要指定路径
    },
    requiresAuth: false,
    popularity: 90,
    tags: ['文件', 'filesystem', 'io']
  },
  {
    id: 'git',
    name: 'Git',
    description: 'Git 版本控制操作，包括提交历史、分支管理、差异分析等。',
    category: '开发工具',
    author: 'ModelContextProtocol',
    type: 'stdio',
    transport: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-git'],
      userConfigRequired: true
    },
    requiresAuth: false,
    popularity: 88,
    tags: ['git', '版本控制', 'vcs']
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'PostgreSQL 数据库查询和分析工具，支持 SQL 执行和架构分析。',
    category: '数据库',
    author: 'Bytebase',
    type: 'stdio',
    transport: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@bytebase/dbhub'],
      userConfigRequired: true,
      envExample: 'DSN="postgresql://user:password@localhost:5432/dbname"'
    },
    requiresAuth: true,
    popularity: 75,
    tags: ['数据库', 'postgresql', 'sql']
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    description: 'SQLite 数据库查询工具，支持本地数据库文件的分析和查询。',
    category: '数据库',
    author: 'ModelContextProtocol',
    type: 'stdio',
    transport: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sqlite'],
      userConfigRequired: true
    },
    requiresAuth: false,
    popularity: 70,
    tags: ['数据库', 'sqlite', 'sql']
  },
  {
    id: 'memory',
    name: 'Memory',
    description: '持久化知识图谱，让 Claude 能够跨会话记忆信息和实体关系。',
    category: '工具',
    author: 'ModelContextProtocol',
    type: 'stdio',
    transport: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-memory']
    },
    requiresAuth: false,
    popularity: 85,
    tags: ['记忆', '知识图谱', 'ai']
  },
  {
    id: 'brave-search',
    name: 'Brave Search',
    description: '通过 Brave Search API 进行网络搜索，获取实时信息和搜索结果。',
    category: '搜索',
    author: 'ModelContextProtocol',
    type: 'stdio',
    transport: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-brave-search'],
      userConfigRequired: true,
      envExample: 'BRAVE_API_KEY="your-api-key"'
    },
    requiresAuth: true,
    popularity: 65,
    tags: ['搜索', 'web', 'api']
  },
  {
    id: 'puppeteer',
    name: 'Puppeteer',
    description: '浏览器自动化工具，支持网页截图、表单填充、点击操作等。',
    category: '浏览器',
    author: 'ModelContextProtocol',
    type: 'stdio',
    transport: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-puppeteer']
    },
    requiresAuth: false,
    popularity: 72,
    tags: ['浏览器', '自动化', 'web']
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Slack 集成，支持发送消息、读取频道、管理通知等。',
    category: '通讯',
    author: 'ModelContextProtocol',
    type: 'stdio',
    transport: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-slack'],
      userConfigRequired: true,
      envExample: 'SLACK_TOKEN="xoxb-your-token", SLACK_CHANNELS="general,random"'
    },
    requiresAuth: true,
    popularity: 60,
    tags: ['slack', '通讯', '团队']
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    description: 'Google Drive 文件管理，支持搜索、上传、下载和文件操作。',
    category: '云存储',
    author: 'ModelContextProtocol',
    type: 'stdio',
    transport: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-gdrive'],
      userConfigRequired: true,
      envExample: 'GDRIVE_OAUTH_TOKEN="your-oauth-token"'
    },
    requiresAuth: true,
    popularity: 55,
    tags: ['google', 'drive', '云存储']
  },
  {
    id: 'sequential-thinking',
    name: 'Sequential Thinking',
    description: '增强 Claude 的推理能力，通过结构化思考过程提高复杂问题的解决质量。',
    category: 'AI 增强',
    author: 'ModelContextProtocol',
    type: 'stdio',
    transport: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sequential-thinking']
    },
    requiresAuth: false,
    popularity: 80,
    tags: ['ai', '推理', '思考']
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Docker 容器管理，支持容器列表、日志查看、命令执行等。',
    category: '开发工具',
    author: 'ModelContextProtocol',
    type: 'stdio',
    transport: 'stdio',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-docker'],
      userConfigRequired: false
    },
    requiresAuth: false,
    popularity: 78,
    tags: ['docker', '容器', 'devops']
  },
  {
    id: 'wuxing-search',
    name: 'Wuxing Search',
    description: '基于 SearXNG 的无限制搜索 MCP，聚合 100+ 搜索引擎。完全免费、无 API 限额、隐私友好，专为课程开发场景优化。',
    category: '搜索',
    author: 'Wuxing Codes',
    homepage: 'https://github.com/MaesHughes/wuxing-search-mcp',
    type: 'stdio',
    transport: 'stdio',
    verified: true,
    official: true,
    isOfficial: true,  // 官方开发专属标记
    config: {
      command: 'node',
      args: ['D:\\\\path\\\\to\\\\wuxing-search-mcp\\\\src\\\\index.js'],
      userConfigRequired: true,
      envExample: 'SEARXNG_URL="http://localhost:8888"',
      docsUrl: 'https://github.com/MaesHughes/wuxing-search-mcp#readme',
      preInstallSteps: [
        '需要先安装 Docker',
        '运行: docker run -d -p 8888:8080 --name wuxing-searxng searxng/searxng:latest'
      ],
      postInstallNotice: 'Wuxing Search 需要本地 SearXNG 服务运行，请确保 Docker 容器已启动。'
    },
    requiresAuth: false,
    popularity: 75,
    tags: ['搜索', 'web', 'free', 'searxng', '课程开发'],
    features: [
      '完全免费，无 API 费用',
      '无使用限制，支持高频搜索',
      '多搜索引擎聚合（100+）',
      '隐私保护，数据本地化',
      '课程开发场景优化'
    ],
    badge: 'FREE'
  }
];

module.exports = mcpMarketplace;
