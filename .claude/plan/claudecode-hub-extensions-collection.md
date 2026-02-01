# ClaudeCode Hub 扩展工具收集计划

## 任务概述

为 ClaudeCode Hub 收集高质量的扩展工具，包括 MCP、Agent、Skill、Command 四种类型。

## 质量筛选标准

| 标准 | 阈值 |
|------|------|
| GitHub Star | ≥ 100，或 50-99 且有优质文档 |
| 最近更新 | 6个月内活跃 |
| 每种类型目标 | 20-50 个高质量项目 |

## 执行方案

### 核心原则

1. **AI 主导搜索**：使用 MCP 工具进行搜索和内容提取
   - `web-search-prime`：全网搜索扩展项目
   - `web-reader`：爬取精选列表页面内容
   - `context7`：GitHub 仓库文档查询（resolve-library-id, query-docs）
   - `zread`：GitHub 仓库结构和文件读取（get_repo_structure, read_file）
2. **分两阶段**：
   - 阶段1：收集基础信息（名称、链接、简介、类型）
   - 阶段2：质量评估（star数、更新频率、文档完整性）
3. **区别处理**：
   - GitHub 项目：使用 `zread` MCP 获取仓库信息和文档
   - 导航站/精选列表：使用 `web-reader` AI 爬取解析

---

## 详细执行步骤

### 第一步：数据源识别

#### 已知高价值数据源

| 类型 | 数据源 | 说明 |
|------|--------|------|
| MCP | github.com/modelcontextprotocol/servers | 官方维护的服务器列表 |
| MCP | awesome-claude MCP 相关 | 社区精选列表 |
| Skills | GitHub 搜索 "claude-code skill" | 用户提交的技能 |
| Commands | GitHub 搜索 "claude-command" | 斜杠命令 |
| Agents | GitHub 搜索 "claude-agent" | AI Agent 配置 |
| 通用 | github.com/anthropics/awesome-claude | Anthropic 官方精选 |

#### 需要搜索的关键词

```
MCP Servers:
- "modelcontextprotocol" OR "mcp server"
- "mcp server claude"
- "claude mcp"

Skills:
- "claude-code skill"
- "claude code extension"
- ".claude/skills"

Commands:
- "claude-command"
- ".claude/commands"
- "claude slash command"

Agents:
- "claude-agent"
- "claude agent config"
- "claude code agent"
```

---

### 第二步：分类型搜索收集

#### MCP Servers 收集

1. 使用 `web-search-prime` 搜索：
   - "modelcontextprotocol servers github"
   - "awesome mcp servers"
   - "claude mcp server list"

2. 使用 `web-reader` 爬取：
   - https://github.com/modelcontextprotocol/servers
   - 搜索结果中的精选列表页面

3. 记录字段：
   ```json
   {
     "name": "项目名称",
     "url": "GitHub URL 或官网",
     "type": "mcp",
     "description": "简要描述",
     "source": "数据来源"
   }
   ```

#### Skills 收集

1. 使用 `web-search-prime` 搜索：
   - "claude-code skills github"
   - "awesome claude code skills"

2. 使用 `web-reader` 爬取精选列表

3. 记录字段（同上，type: "skill"）

#### Commands 收集

1. 使用 `web-search-prime` 搜索：
   - "claude commands github"
   - "awesome claude commands"

2. 使用 `web-reader` 爬取精选列表

3. 记录字段（同上，type: "command"）

#### Agents 收集

1. 使用 `web-search-prime` 搜索：
   - "claude agents github"
   - "claude agent configurations"

2. 使用 `web-reader` 爬取精选列表

3. 记录字段（同上，type: "agent"）

---

### 第三步：数据去重和初步整理

1. **去重规则**：
   - 同一 URL 只保留一条
   - 同一项目名称只保留一条（保留描述更完整的）
   - GitHub URL 规范化（去掉 .git 后缀）

2. **分类校验**：
   - 确认每个项目的类型是否正确
   - 检查是否有重复收录（某项目既是 MCP 又是 Skill）

3. **输出初步清单**：
   - 保存到 `data/raw/collected-extensions.json`

---

### 第四步：质量评估

对每个 GitHub 项目进行质量评估：

#### 评估指标

| 指标 | 权重 | 说明 |
|------|------|------|
| Star 数 | 40% | ≥100 优秀，50-99 良好，<50 一般 |
| Fork 数 | 20% | 反映社区参与度 |
| 最近更新 | 25% | 6个月内活跃加分 |
| 文档完整性 | 15% | README 质量、使用说明 |

#### 评估方法

1. **GitHub 项目**：使用 MCP 工具获取：
   - `context7`（`mcp__context7__resolve-library-id` + `mcp__context7__query-docs`）：查询仓库文档和代码示例
   - `zread`（`mcp__zread__get_repo_structure` + `mcp__zread__read_file`）：获取仓库结构和读取文件
   - `web-search-prime`：获取 star 数、fork 数、更新时间

2. **非 GitHub 项目**：人工评估：
   - 官网质量
   - 文档完整性
   - 社区活跃度

3. **评分计算**：
   ```
   总分 = star评分×0.4 + fork评分×0.2 + 更新评分×0.25 + 文档评分×0.15
   ```

4. **筛选规则**：
   - 总分 ≥ 70 分：直接收录
   - 50-69 分：人工审核后决定
   - < 50 分：暂不收录

---

### 第五步：生成最终清单

1. **数据结构**：
   ```json
   {
     "extensions": [
       {
         "id": "唯一标识",
         "name": "项目名称",
         "url": "项目链接",
         "type": "mcp|skill|command|agent",
         "description": "项目描述",
         "author": "作者/组织",
         "stars": 1234,
         "lastUpdated": "2025-01-15",
         "qualityScore": 85,
         "tags": ["标签1", "标签2"]
       }
     ],
     "summary": {
       "mcp": 25,
       "skill": 30,
       "command": 20,
       "agent": 15,
       "total": 90
     }
   }
   ```

2. **保存路径**：
   - `data/final/extensions.json`

---

### 第六步：集成到 ClaudeCode Hub

将收集的数据集成到现有项目中：

1. **初始化数据文件**：在 `server/data/` 下创建扩展清单

2. **API 接口**（如需要）：
   - `GET /api/extensions` - 获取所有扩展
   - `GET /api/extensions/:type` - 按类型获取
   - `GET /api/extensions/search?q=` - 搜索扩展

3. **前端展示**（可选）：
   - 在现有界面添加"发现"或"市场"页面
   - 展示收集的优质扩展

---

## 输出文件结构

```
server/
└── data/
    ├── raw/
    │   └── collected-extensions.json      # 原始收集数据
    ├── processed/
    │   ├── deduplicated-extensions.json   # 去重后数据
    │   └── quality-scored-extensions.json # 质量评分后
    └── final/
        └── extensions.json                # 最终清单
```

---

## 执行顺序

1. ✅ 第一步：数据源识别
2. ⏳ 第二步：分类型搜索收集（MCP → Skills → Commands → Agents）
3. ⏳ 第三步：数据去重和初步整理
4. ⏳ 第四步：质量评估
5. ⏳ 第五步：生成最终清单
6. ⏳ 第六步：集成到 ClaudeCode Hub

---

## 创建时间

2025-01-23

## 状态

计划已确认，待执行
