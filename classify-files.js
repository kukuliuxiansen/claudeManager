const fs = require('fs');
const path = require('path');

// Read skills-data.js
const content = fs.readFileSync('/Users/weidian/claudeProject/everthingClaudeCode/claudeManager/pages/skills-data.js', 'utf8');

// Extract type info using regex
const regex = /"([^"]+)":\s*\{[^}]*"type":\s*"([^"]+)"[^}]*\}/g;
const types = {};
let match;

// Need to match across multiple lines, use a different approach
const lines = content.split('\n');
let currentKey = null;
let currentType = null;

for (const line of lines) {
  // Match key start: "some-key": {
  const keyMatch = line.match(/^  "([^"]+)": \{/);
  if (keyMatch) {
    currentKey = keyMatch[1];
  }
  // Match type: "type": "skill"
  const typeMatch = line.match(/"type": "([^"]+)"/);
  if (typeMatch && currentKey) {
    types[currentKey] = typeMatch[1];
    currentKey = null;
  }
}

// Count by type
const skills = Object.entries(types).filter(([k, v]) => v === 'skill').map(([k]) => k);
const agents = Object.entries(types).filter(([k, v]) => v === 'agent').map(([k]) => k);
const commands = Object.entries(types).filter(([k, v]) => v === 'command').map(([k]) => k);

console.log('Skills:', skills.length);
console.log('Agents:', agents.length);
console.log('Commands:', commands.length);

// Write to files for moving
fs.writeFileSync('/tmp/skills_list.txt', skills.join('\n'));
fs.writeFileSync('/tmp/agents_list.txt', agents.join('\n'));
fs.writeFileSync('/tmp/commands_list.txt', commands.join('\n'));

console.log('\nLists saved to /tmp/');
console.log('\nFirst 5 skills:', skills.slice(0, 5));
console.log('First 5 agents:', agents.slice(0, 5));
console.log('First 5 commands:', commands.slice(0, 5));