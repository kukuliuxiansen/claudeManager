const fs = require('fs');

// Read the file
const content = fs.readFileSync('/Users/weidian/claudeProject/everthingClaudeCode/claudeManager/pages/skills-data.js', 'utf8');

// Use a more robust regex to find all entries with their types
// Pattern: "key": { ... "type": "xxx" ... }
const entries = {};

// Split by object boundaries and process each
const objectRegex = /"([^"]+)":\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g;

// Simpler approach: find all type definitions
const typeRegex = /"([^"]+)":\s*\{[^}]*?"type":\s*"([^"]+)"[^}]*\}/g;

// Use line-by-line with context tracking
const lines = content.split('\n');
let currentKey = null;
let bracketDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Check for new entry start: "key": {
  const keyMatch = line.match(/^  "([^"]+)": \{$/);
  if (keyMatch) {
    currentKey = keyMatch[1];
    bracketDepth = 1;
    continue;
  }

  // If we're inside an entry, look for type
  if (currentKey && bracketDepth > 0) {
    // Track brackets
    bracketDepth += (line.match(/\{/g) || []).length;
    bracketDepth -= (line.match(/\}/g) || []).length;

    // Look for type
    const typeMatch = line.match(/"type": "([^"]+)"/);
    if (typeMatch) {
      entries[currentKey] = typeMatch[1];
    }

    // Entry ended
    if (bracketDepth === 0) {
      currentKey = null;
    }
  }
}

// Count by type
const skills = Object.entries(entries).filter(([k, v]) => v === 'skill').map(([k]) => k);
const agents = Object.entries(entries).filter(([k, v]) => v === 'agent').map(([k]) => k);
const commands = Object.entries(entries).filter(([k, v]) => v === 'command').map(([k]) => k);

console.log('Parsed entries:', Object.keys(entries).length);
console.log('Skills:', skills.length);
console.log('Agents:', agents.length);
console.log('Commands:', commands.length);

// Write lists
fs.writeFileSync('/tmp/skills_list.txt', skills.join('\n'));
fs.writeFileSync('/tmp/agents_list.txt', agents.join('\n'));
fs.writeFileSync('/tmp/commands_list.txt', commands.join('\n'));

// Also check what's missing
const allParsed = Object.keys(entries);
const existingFiles = fs.readFileSync('/tmp/current_skills.txt', 'utf8').split('\n').filter(f => f);

const missing = existingFiles.filter(f => !allParsed.includes(f));
console.log('\nFiles not parsed:', missing.length);
if (missing.length > 0) {
  console.log('Missing files:', missing.slice(0, 10));
}

// Check for parsed items not having files
const noFile = allParsed.filter(k => !existingFiles.includes(k) && !fs.existsSync(`/Users/weidian/claudeProject/everthingClaudeCode/claudeManager/pages/skills/${k}.html`));
console.log('\nParsed but no file in skills folder:', noFile.length);
if (noFile.length > 0) {
  console.log('Examples:', noFile.slice(0, 10));
}