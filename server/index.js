const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const fsp = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3807;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Paths
const skillsPath = path.join(__dirname, '../skills');
const commandsPath = path.join(__dirname, '../commands');

// Caches
let skillsCache = [];
let commandsCache = [];

// MCP Marketplace
const mcpMarketplace = require('./mcp-marketplace');

// Agents Marketplace
const agentsMarketplace = require('./agents-marketplace');

// Load skills metadata
async function loadSkills() {
  try {
    const categories = await fsp.readdir(skillsPath);
    skillsCache = [];

    for (const category of categories) {
      const categoryPath = path.join(skillsPath, category);
      const stat = await fsp.stat(categoryPath);

      if (stat.isDirectory()) {
        const skillMdPath = path.join(categoryPath, 'SKILL.md');
        const metaPath = path.join(categoryPath, 'skill.json');

        try {
          const [skillContent, metaContent] = await Promise.all([
            fsp.readFile(skillMdPath, 'utf-8').catch(() => ''),
            fsp.readFile(metaPath, 'utf-8').catch(() => '{}')
          ]);

          const meta = JSON.parse(metaContent);

          skillsCache.push({
            id: category,
            name: meta.name || category,
            description: meta.description || skillContent.split('\n')[0] || '',
            category: meta.category || 'general',
            author: meta.author || 'Unknown',
            originalRepo: meta.original_repo || '',
            stars: meta.stars || 0,
            installed: false
          });
        } catch (e) {
          console.error(`Error loading skill ${category}:`, e.message);
        }
      }
    }
  } catch (e) {
    console.error('Error loading skills:', e.message);
  }
}

// Load commands metadata
async function loadCommands() {
  try {
    const categories = await fsp.readdir(commandsPath);
    commandsCache = [];

    for (const category of categories) {
      const categoryPath = path.join(commandsPath, category);
      const stat = await fsp.stat(categoryPath);

      if (stat.isDirectory()) {
        const commandMdPath = path.join(categoryPath, 'COMMAND.md');
        const metaPath = path.join(categoryPath, 'command.json');

        try {
          const [commandContent, metaContent] = await Promise.all([
            fsp.readFile(commandMdPath, 'utf-8').catch(() => ''),
            fsp.readFile(metaPath, 'utf-8').catch(() => '{}')
          ]);

          const meta = JSON.parse(metaContent);

          commandsCache.push({
            id: category,
            name: meta.name || category,
            description: meta.description || commandContent.split('\n')[0] || '',
            category: meta.category || 'general',
            author: meta.author || 'Unknown',
            trigger: meta.trigger || `/${category}`,
            installed: false
          });
        } catch (e) {
          console.error(`Error loading command ${category}:`, e.message);
        }
      }
    }
  } catch (e) {
    console.error('Error loading commands:', e.message);
  }
}

// ==================== Skills API ====================

app.get('/api/skills', (req, res) => {
  const { search, category } = req.query;

  let filtered = skillsCache;

  if (search) {
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(s => s.category === category);
  }

  res.json(filtered);
});

app.get('/api/skills/categories', (req, res) => {
  const categories = [...new Set(skillsCache.map(s => s.category))];
  res.json(categories);
});

app.post('/api/skills/:skillId/install', async (req, res) => {
  const { skillId } = req.params;
  const { scope = 'global' } = req.body;

  console.log(`\n📦 Installing skill: ${skillId}`);
  console.log(`   Scope: ${scope}`);

  try {
    const homeDir = os.homedir();
    const targetDir = scope === 'global'
      ? path.join(homeDir, '.claude', 'skills', skillId)
      : path.join(process.cwd(), '.claude', 'skills', skillId);

    console.log(`   Target: ${targetDir}`);

    const sourceDir = path.join(skillsPath, skillId);
    console.log(`   Source: ${sourceDir}`);

    const sourceExists = await fsp.access(sourceDir).then(() => true).catch(() => false);
    if (!sourceExists) {
      throw new Error(`Source directory not found: ${sourceDir}`);
    }

    console.log(`   Creating directory...`);
    await fsp.mkdir(targetDir, { recursive: true });

    console.log(`   Copying files...`);
    await fsp.cp(sourceDir, targetDir, { recursive: true });

    console.log(`   ✓ Success!`);
    res.json({ success: true, path: targetDir });
  } catch (error) {
    console.error(`   ✗ Error:`, error);
    res.status(500).json({ success: false, error: error.message, stack: error.stack });
  }
});

app.get('/api/skills/:skillId/uninstall-path', (req, res) => {
  const { skillId } = req.params;
  const { scope = 'global' } = req.query;

  try {
    const homeDir = os.homedir();
    const targetDir = scope === 'global'
      ? path.join(homeDir, '.claude', 'skills', skillId)
      : path.join(process.cwd(), '.claude', 'skills', skillId);

    let exists = false;
    try {
      const stat = fs.statSync(targetDir);
      exists = stat.isDirectory();
    } catch {
      exists = false;
    }

    res.json({
      success: true,
      skillId: skillId,
      path: targetDir,
      exists: exists
    });
  } catch (error) {
    console.error('Error getting uninstall path:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/skills/:skillId/status', async (req, res) => {
  const { skillId } = req.params;
  const { scope = 'global' } = req.query;

  try {
    const homeDir = os.homedir();
    const targetDir = scope === 'global'
      ? path.join(homeDir, '.claude', 'skills', skillId)
      : path.join(process.cwd(), '.claude', 'skills', skillId);

    const exists = await fsp.access(targetDir).then(() => true).catch(() => false);
    res.json({ installed: exists });
  } catch (error) {
    res.json({ installed: false });
  }
});

app.post('/api/skills/:skillId/open-folder', (req, res) => {
  const { skillId } = req.params;
  const { scope = 'global' } = req.body;

  console.log(`\n📂 Opening folder for uninstall: ${skillId}`);

  try {
    const homeDir = os.homedir();
    const skillDir = scope === 'global'
      ? path.join(homeDir, '.claude', 'skills', skillId)
      : path.join(process.cwd(), '.claude', 'skills', skillId);

    const parentDir = path.dirname(skillDir);

    try {
      const stat = fs.statSync(skillDir);
      if (!stat.isDirectory()) {
        return res.status(400).json({
          success: false,
          error: `Path exists but is not a directory: ${skillDir}`
        });
      }
    } catch {
      return res.status(404).json({
        success: false,
        error: `Directory not found: ${skillDir}`
      });
    }

    const allowedPath = path.join(homeDir, '.claude', 'skills');
    if (!skillDir.startsWith(allowedPath)) {
      return res.status(403).json({
        success: false,
        error: 'Security check failed: Path is outside allowed directory'
      });
    }

    console.log(`   Parent path: ${parentDir}`);
    console.log(`   Skill to delete: ${skillId}`);

    let openCmd;
    if (process.platform === 'win32') {
      openCmd = `cmd /c start "" "${parentDir}"`;
      console.log(`   Command: ${openCmd}`);
    } else if (process.platform === 'darwin') {
      openCmd = `open "${parentDir}"`;
    } else {
      openCmd = `xdg-open "${parentDir}"`;
    }

    exec(openCmd, (error) => {
      if (error) {
        console.error(`   ✗ Failed to open folder:`, error);
        return res.status(500).json({
          success: false,
          error: `Failed to open folder: ${error.message}`
        });
      }

      console.log(`   ✓ Parent folder opened`);
      res.json({
        success: true,
        skillId: skillId,
        parentPath: parentDir,
        skillPath: skillDir,
        message: `Opened skills folder. Find "${skillId}" and delete it to uninstall.`
      });
    });

  } catch (error) {
    console.error('Error opening folder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== Commands API ====================

// Get all installed commands from ~/.claude/commands/
app.get('/api/commands/installed', async (req, res) => {
  const { scope = 'global' } = req.query;

  try {
    const homeDir = os.homedir();
    const commandsDir = scope === 'global'
      ? path.join(homeDir, '.claude', 'commands')
      : path.join(process.cwd(), '.claude', 'commands');

    // Check if directory exists
    const exists = await fsp.access(commandsDir).then(() => true).catch(() => false);
    if (!exists) {
      return res.json([]);
    }

    const installedCommands = [];

    // 递归扫描函数
    async function scanDirectory(dirPath, relativePath = '') {
      const entries = await fsp.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // 递归扫描子目录
          await scanDirectory(fullPath, path.join(relativePath, entry.name));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          try {
            const content = await fsp.readFile(fullPath, 'utf-8');

            // command ID: 对于子目录中的文件，使用相对路径（如 zcf/workflow）
            // 对于根目录的文件，使用文件名（如 commit）
            const relativeFilePath = relativePath
              ? path.join(relativePath, entry.name.replace('.md', ''))
              : entry.name.replace('.md', '');

            // 触发命令：对于子目录中的文件，可能是 /zcf:workflow
            // 对于根目录的文件，是 /commit
            // 用冒号连接：如果有多级目录，用 : 分隔
            const trigger = relativePath
              ? `/${relativeFilePath.replace(/[\\/]/g, ':')}`
              : `/${entry.name.replace('.md', '')}`;

            // 提取标题
            let name = relativeFilePath;
            const lines = content.split('\n');
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('#')) {
                name = trimmed.replace(/^#+\s*/, '');
                break;
              }
            }

            // 提取描述 - 支持 YAML frontmatter 格式
            let description = '';

            // 检查是否有 YAML frontmatter
            if (lines.length > 0 && lines[0].trim() === '---') {
              // 解析 YAML frontmatter
              for (let i = 1; i < lines.length; i++) {
                const trimmed = lines[i].trim();
                // 找到描述字段
                if (trimmed.toLowerCase().startsWith('description:')) {
                  // 提取引号或单引号内的值
                  const quotedMatch = trimmed.match(/description:\s*['"](.+?)['"]\s*$/i);
                  if (quotedMatch) {
                    description = quotedMatch[1];
                  } else {
                    // 没有引号，直接取冒号后的内容
                    description = trimmed.replace(/description:\s*/i, '').trim();
                  }
                  break;
                }
                // 遇到结束标记，退出
                if (trimmed === '---') {
                  break;
                }
              }
            }

            // 如果没有从 YAML frontmatter 提取到描述，使用原来的逻辑
            if (!description) {
              for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#') && trimmed !== '---') {
                  description = trimmed;
                  break;
                }
              }
            }

            installedCommands.push({
              id: relativeFilePath,
              name: name,
              description: description || `Command: ${trigger}`,
              trigger: trigger,
              filePath: fullPath,
              isFromMarketplace: commandsCache.some(c => c.id === relativeFilePath)
            });
          } catch (e) {
            console.error(`Error reading command ${entry.name}:`, e.message);
          }
        }
      }
    }

    await scanDirectory(commandsDir);

    res.json(installedCommands);
  } catch (error) {
    console.error('Error scanning installed commands:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/commands', (req, res) => {
  const { search, category } = req.query;

  let filtered = commandsCache;

  if (search) {
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(c => c.category === category);
  }

  res.json(filtered);
});

app.get('/api/commands/categories', (req, res) => {
  const categories = [...new Set(commandsCache.map(c => c.category))];
  res.json(categories);
});

app.post('/api/commands/:commandId/install', async (req, res) => {
  const { commandId } = req.params;
  const { scope = 'global' } = req.body;

  console.log(`\n📝 Installing command: ${commandId}`);
  console.log(`   Scope: ${scope}`);

  try {
    const homeDir = os.homedir();
    const commandsDir = scope === 'global'
      ? path.join(homeDir, '.claude', 'commands')
      : path.join(process.cwd(), '.claude', 'commands');

    // Source files
    const sourceMdPath = path.join(commandsPath, commandId, 'COMMAND.md');
    const targetMdPath = path.join(commandsDir, `${commandId}.md`);

    console.log(`   Source: ${sourceMdPath}`);
    console.log(`   Target: ${targetMdPath}`);

    // Check source exists
    const sourceExists = await fsp.access(sourceMdPath).then(() => true).catch(() => false);
    if (!sourceExists) {
      throw new Error(`Source file not found: ${sourceMdPath}`);
    }

    // Create commands directory if needed
    console.log(`   Creating directory...`);
    await fsp.mkdir(commandsDir, { recursive: true });

    // Copy command file
    console.log(`   Copying file...`);
    await fsp.copyFile(sourceMdPath, targetMdPath);

    console.log(`   ✓ Success!`);
    res.json({ success: true, path: targetMdPath });
  } catch (error) {
    console.error(`   ✗ Error:`, error);
    res.status(500).json({ success: false, error: error.message, stack: error.stack });
  }
});

app.get('/api/commands/:commandId/status', async (req, res) => {
  const { commandId } = req.params;
  const { scope = 'global' } = req.query;

  try {
    const homeDir = os.homedir();
    const commandsDir = scope === 'global'
      ? path.join(homeDir, '.claude', 'commands')
      : path.join(process.cwd(), '.claude', 'commands');

    const targetPath = path.join(commandsDir, `${commandId}.md`);
    const exists = await fsp.access(targetPath).then(() => true).catch(() => false);
    res.json({ installed: exists });
  } catch (error) {
    res.json({ installed: false });
  }
});

// Open folder to manually uninstall command
app.post('/api/commands/open-folder', (req, res) => {
  const { commandId } = req.body;  // 从 body 获取，避免路由解析问题
  const { scope = 'global' } = req.body;

  console.log(`\n📂 Opening folder for uninstall: ${commandId}`);

  try {
    const homeDir = os.homedir();
    const commandsDir = scope === 'global'
      ? path.join(homeDir, '.claude', 'commands')
      : path.join(process.cwd(), '.claude', 'commands');

    // commandId 可能包含路径分隔符（如 "zcf/feat"），需要转换为系统路径
    const commandRelativePath = commandId.replace(/\//g, path.sep);
    const commandPath = path.join(commandsDir, `${commandRelativePath}.md`);

    console.log(`   Commands folder: ${commandsDir}`);
    console.log(`   Command file: ${commandPath}`);
    console.log(`   Command to delete: ${commandId}.md`);

    // Check if commands directory exists
    try {
      const commandsDirStat = fs.statSync(commandsDir);
      if (!commandsDirStat.isDirectory()) {
        return res.status(404).json({
          success: false,
          error: `Commands directory not found or is not a directory: ${commandsDir}`
        });
      }
    } catch {
      return res.status(404).json({
        success: false,
        error: `Commands directory not found: ${commandsDir}`
      });
    }

    // Check file exists（但不阻止打开文件夹）
    let fileExists = false;
    try {
      const stat = fs.statSync(commandPath);
      fileExists = stat.isFile();
    } catch {
      fileExists = false;
    }

    // 如果文件不存在，仍然打开文件夹让用户查看
    if (!fileExists) {
      console.log(`   ⚠ Warning: Command file not found, but opening folder anyway`);
    }

    // 安全检查 - 确保 commandsDir 在允许的路径内
    const allowedPath = path.join(homeDir, '.claude', 'commands');
    if (!commandsDir.startsWith(allowedPath)) {
      return res.status(403).json({
        success: false,
        error: 'Security check failed: Path is outside allowed directory'
      });
    }

    // 根据平台选择打开文件夹的命令
    let openCmd;
    if (process.platform === 'win32') {
      openCmd = `cmd /c start "" "${commandsDir}"`;
      console.log(`   Command: ${openCmd}`);
    } else if (process.platform === 'darwin') {
      openCmd = `open "${commandsDir}"`;
    } else {
      openCmd = `xdg-open "${commandsDir}"`;
    }

    exec(openCmd, (error) => {
      if (error) {
        console.error(`   ✗ Failed to open folder:`, error);
        return res.status(500).json({
          success: false,
          error: `Failed to open folder: ${error.message}`
        });
      }

      console.log(`   ✓ Folder opened`);
      res.json({
        success: true,
        commandId: commandId,
        folderPath: commandsDir,
        commandPath: commandPath,
        fileExists: fileExists,
        message: fileExists
          ? `Opened commands folder. Navigate to "${commandId}.md" and delete it to uninstall.`
          : `Opened commands folder. File "${commandId}.md" was not found, but you can check the folder.`
      });
    });

  } catch (error) {
    console.error('Error opening folder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/commands/:commandId/uninstall-path', (req, res) => {
  const { commandId } = req.params;
  const { scope = 'global' } = req.query;

  try {
    const homeDir = os.homedir();
    const commandsDir = scope === 'global'
      ? path.join(homeDir, '.claude', 'commands')
      : path.join(process.cwd(), '.claude', 'commands');

    const targetPath = path.join(commandsDir, `${commandId}.md`);

    let exists = false;
    try {
      const stat = fs.statSync(targetPath);
      exists = stat.isFile();
    } catch {
      exists = false;
    }

    res.json({
      success: true,
      commandId: commandId,
      path: targetPath,
      exists: exists
    });
  } catch (error) {
    console.error('Error getting uninstall path:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== MCP Servers ====================

// Get MCP marketplace
app.get('/api/mcp', (req, res) => {
  res.json(mcpMarketplace);
});

// Get installed MCP servers from ~/.claude.json
app.get('/api/mcp/installed', async (req, res) => {
  const { scope = 'user' } = req.query;

  try {
    const homeDir = os.homedir();
    const configPath = scope === 'user'
      ? path.join(homeDir, '.claude.json')
      : path.join(process.cwd(), '.mcp.json');

    console.log(`\n📖 Reading MCP config from: ${configPath}`);

    let config = {};
    try {
      const configContent = await fsp.readFile(configPath, 'utf-8');
      config = JSON.parse(configContent);
    } catch {
      // File doesn't exist or is invalid
      console.log('   Config file not found or empty');
    }

    const mcpServers = config.mcpServers || {};

    // Convert to array format
    const installed = Object.entries(mcpServers).map(([name, serverConfig]) => {
      const marketplaceItem = mcpMarketplace.find(m => m.id === name);

      return {
        id: name,
        name: marketplaceItem?.name || name,
        description: marketplaceItem?.description || 'Custom MCP server',
        category: marketplaceItem?.category || '其他',
        type: serverConfig.type || (serverConfig.command ? 'stdio' : 'http'),
        transport: serverConfig.type || (serverConfig.command ? 'stdio' : 'http'),
        config: serverConfig,
        fromMarketplace: !!marketplaceItem
      };
    });

    console.log(`   Found ${installed.length} installed MCP servers`);
    res.json(installed);
  } catch (error) {
    console.error('Error reading MCP config:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check if MCP server is installed
app.get('/api/mcp/:mcpId/status', async (req, res) => {
  const { mcpId } = req.params;
  const { scope = 'user' } = req.query;

  try {
    const homeDir = os.homedir();
    const configPath = scope === 'user'
      ? path.join(homeDir, '.claude.json')
      : path.join(process.cwd(), '.mcp.json');

    let config = {};
    try {
      const configContent = await fsp.readFile(configPath, 'utf-8');
      config = JSON.parse(configContent);
    } catch {
      // File doesn't exist
    }

    const mcpServers = config.mcpServers || {};
    const installed = mcpServers.hasOwnProperty(mcpId);

    res.json({ installed, mcpId });
  } catch (error) {
    console.error('Error checking MCP status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Open config file for manual MCP uninstall
app.post('/api/mcp/open-config', (req, res) => {
  const { scope = 'user' } = req.body;

  try {
    const homeDir = os.homedir();
    const configPath = scope === 'user'
      ? path.join(homeDir, '.claude.json')
      : path.join(process.cwd(), '.mcp.json');

    console.log(`\n📂 Opening config file: ${configPath}`);

    // 如果文件不存在，创建一个空的
    if (!fs.existsSync(configPath)) {
      console.log('   Config file not found, creating...');
      const emptyConfig = { mcpServers: {} };
      if (scope === 'user') {
        emptyConfig.permissions = { allow: [], deny: [], ask: [] };
      }
      fs.writeFileSync(configPath, JSON.stringify(emptyConfig, null, 2));
    }

    // 打开包含配置文件的目录
    const configDir = path.dirname(configPath);

    let openCmd;
    if (process.platform === 'win32') {
      openCmd = `cmd /c start "" "${configDir}"`;
    } else if (process.platform === 'darwin') {
      openCmd = `open "${configDir}"`;
    } else {
      openCmd = `xdg-open "${configDir}"`;
    }

    exec(openCmd, (error) => {
      if (error) {
        console.error(`   ✗ Failed to open folder:`, error);
        return res.status(500).json({
          success: false,
          error: `Failed to open folder: ${error.message}`
        });
      }

      console.log(`   ✓ Folder opened`);
      res.json({
        success: true,
        configPath: configPath,
        message: `配置文件所在文件夹已打开。请编辑 ${path.basename(configPath)} 文件来手动移除 MCP 服务器配置。`
      });
    });
  } catch (error) {
    console.error('Error opening config:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== Agents ====================

// Get Agents marketplace
app.get('/api/agents', (req, res) => {
  res.json(agentsMarketplace);
});

// Get installed agents from ~/.claude/agents/
app.get('/api/agents/installed', async (req, res) => {
  const { scope = 'user' } = req.query;

  try {
    const agentsDir = scope === 'user'
      ? path.join(os.homedir(), '.claude', 'agents')
      : path.join(process.cwd(), '.claude', 'agents');

    console.log(`\n📖 Reading agents from: ${agentsDir}`);

    let agents = [];

    try {
      // Recursively read all .md files in the agents directory
      const readAgentsRecursively = async (dir, basePath = '') => {
        const entries = await fsp.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            // Recursively scan subdirectories
            await readAgentsRecursively(fullPath, path.join(basePath, entry.name));
          } else if (entry.isFile() && entry.name.endsWith('.md')) {
            // Found an agent file
            const content = await fsp.readFile(fullPath, 'utf-8');

            // Parse YAML frontmatter
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
            let metadata = {};
            let promptContent = content;

            if (frontmatterMatch) {
              try {
                metadata = require('js-yaml').load(frontmatterMatch[1]);
                promptContent = frontmatter[2];
              } catch {
                // If YAML parsing fails, treat as plain markdown
              }
            }

            // Get relative path from agents directory
            const relativePath = path.join(basePath, entry.name).replace(/\\/g, '/').replace(/\.md$/, '');

            agents.push({
              id: relativePath,
              name: metadata.name || relativePath,
              description: metadata.description || 'Custom agent',
              category: metadata.category || '其他',
              author: metadata.author || 'Custom',
              type: metadata.type || 'agent',
              filePath: fullPath,
              fromMarketplace: false,
              prompt: promptContent
            });
          }
        }
      };

      await readAgentsRecursively(agentsDir);
    } catch {
      console.log('   Agents directory not found or empty');
    }

    console.log(`   Found ${agents.length} installed agents`);
    res.json(agents);
  } catch (error) {
    console.error('Error reading agents:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check if agent is installed
app.get('/api/agents/:agentId/status', async (req, res) => {
  const { agentId } = req.params;
  const { scope = 'user' } = req.query;

  try {
    const agentsDir = scope === 'user'
      ? path.join(os.homedir(), '.claude', 'agents')
      : path.join(process.cwd(), '.claude', 'agents');

    // agentId might contain slashes, convert to proper path
    const agentPath = path.join(agentsDir, `${agentId.replace(/\//g, path.sep)}.md`);

    let exists = false;
    try {
      const stat = await fsp.stat(agentPath);
      exists = stat.isFile();
    } catch {
      exists = false;
    }

    res.json({ installed: exists, agentId });
  } catch (error) {
    console.error('Error checking agent status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Open agents folder for manual agent uninstall
app.post('/api/agents/open-folder', (req, res) => {
  const { scope = 'user' } = req.body;

  try {
    const agentsDir = scope === 'user'
      ? path.join(os.homedir(), '.claude', 'agents')
      : path.join(process.cwd(), '.claude', 'agents');

    console.log(`\n📂 Opening agents folder: ${agentsDir}`);

    // 如果目录不存在，创建一个空的
    if (!fs.existsSync(agentsDir)) {
      console.log('   Agents directory not found, creating...');
      fs.mkdirSync(agentsDir, { recursive: true });
    }

    // 打开 agents 文件夹
    let openCmd;
    if (process.platform === 'win32') {
      openCmd = `cmd /c start "" "${agentsDir}"`;
    } else if (process.platform === 'darwin') {
      openCmd = `open "${agentsDir}"`;
    } else {
      openCmd = `xdg-open "${agentsDir}"`;
    }

    exec(openCmd, (error) => {
      if (error) {
        console.error(`   ✗ Failed to open folder:`, error);
        return res.status(500).json({
          success: false,
          error: `Failed to open folder: ${error.message}`
        });
      }

      console.log(`   ✓ Folder opened`);
      res.json({
        success: true,
        agentsDir: agentsDir,
        message: `Agents 文件夹已打开。您可以查看、编辑或删除 .md 文件来管理 agents。`
      });
    });
  } catch (error) {
    console.error('Error opening agents folder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== Server Start ====================

app.listen(PORT, async () => {
  console.log(`\n🚀 ClaudeCode Hub running at http://localhost:${PORT}`);

  // Load skills and commands
  await loadSkills();
  console.log(`📦 Loaded ${skillsCache.length} skills`);

  await loadCommands();
  console.log(`📝 Loaded ${commandsCache.length} commands`);

  // Open browser
  const url = `http://localhost:${PORT}`;
  const start = process.platform === 'darwin' ? 'open' :
                process.platform === 'win32' ? 'start' : 'xdg-open';

  exec(`${start} ${url}`, (err) => {
    if (err) console.error('Failed to open browser:', err);
  });
});
