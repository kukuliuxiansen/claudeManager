const fs = require('fs');
const path = require('path');

// Read skills-data.js
const content = fs.readFileSync('/Users/weidian/claudeProject/everthingClaudeCode/claudeManager/pages/skills-data.js', 'utf8');

// Simple approach: find all "type": "xxx" and look backwards for the key
const entries = {};
const typePattern = /"type":\s*"([^"]+)"/g;
let typeMatch;

while ((typeMatch = typePattern.exec(content)) !== null) {
  const type = typeMatch[1];
  const pos = typeMatch.index;
  const before = content.substring(0, pos);
  const keyMatches = before.matchAll(/"([^"]+)":\s*\{/g);
  let lastKey = null;
  for (const km of keyMatches) {
    lastKey = km[1];
  }
  if (lastKey) {
    entries[lastKey] = type;
  }
}

// Count by type
const skills = Object.entries(entries).filter(([k, v]) => v === 'skill').map(([k]) => k);
const agents = Object.entries(entries).filter(([k, v]) => v === 'agent').map(([k]) => k);
const commands = Object.entries(entries).filter(([k, v]) => v === 'command').map(([k]) => k);

console.log('Total parsed:', Object.keys(entries).length);
console.log('Skills:', skills.length);
console.log('Agents:', agents.length);
console.log('Commands:', commands.length);

// Move files
const skillsDir = '/Users/weidian/claudeProject/everthingClaudeCode/claudeManager/pages/skills';
const agentsDir = '/Users/weidian/claudeProject/everthingClaudeCode/claudeManager/pages/agents';
const commandsDir = '/Users/weidian/claudeProject/everthingClaudeCode/claudeManager/pages/commands';

let movedAgents = 0;
let movedCommands = 0;

for (const name of agents) {
  const src = path.join(skillsDir, name + '.html');
  if (fs.existsSync(src)) {
    fs.renameSync(src, path.join(agentsDir, name + '.html'));
    movedAgents++;
  }
}

for (const name of commands) {
  const src = path.join(skillsDir, name + '.html');
  if (fs.existsSync(src)) {
    fs.renameSync(src, path.join(commandsDir, name + '.html'));
    movedCommands++;
  }
}

console.log('\nMoved agents:', movedAgents);
console.log('Moved commands:', movedCommands);

console.log('\nFinal counts:');
console.log('Skills:', fs.readdirSync(skillsDir).filter(f => f.endsWith('.html')).length);
console.log('Agents:', fs.readdirSync(agentsDir).filter(f => f.endsWith('.html')).length);
console.log('Commands:', fs.readdirSync(commandsDir).filter(f => f.endsWith('.html')).length);
