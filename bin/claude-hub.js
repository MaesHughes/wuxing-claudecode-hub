#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Show help
function showHelp() {
  console.log(`
🚀 ClaudeCode Hub - Claude Code Extension Manager

Manage Skills, Commands, and MCP Servers for Claude Code

Usage:
  claude-hub               Start the web interface
  claude-hub --help        Show this help message
  claude-hub --version     Show version info

Commands:
  (none)                  Start the ClaudeCode Hub web interface
  --help, -h              Display help information
  --version, -v           Display version number

For more information, visit: https://github.com/wuxing/claudecode-hub
  `);
}

// Show version
function showVersion() {
  const pkgPath = path.join(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  console.log(`@wuxing/wuxing-claudecode-hub v${pkg.version}`);
}

// Start the server
function startServer() {
  const serverPath = path.join(__dirname, '../server/index.js');

  if (!fs.existsSync(serverPath)) {
    console.error('Error: server/index.js not found');
    console.error('Make sure you are in a valid ClaudeCode Hub installation');
    process.exit(1);
  }

  console.log('\n🚀 Starting ClaudeCode Hub...\n');

  const server = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: { ...process.env }
  });

  server.on('close', (code) => {
    process.exit(code);
  });

  server.on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

// Handle commands
switch (command) {
  case '--help':
  case '-h':
  case 'help':
    showHelp();
    break;

  case '--version':
  case '-v':
  case 'version':
    showVersion();
    break;

  default:
    if (command && command.startsWith('-')) {
      console.log(`Unknown option: ${command}`);
      console.log('Run "claude-hub --help" for usage information');
      process.exit(1);
    }
    startServer();
}
