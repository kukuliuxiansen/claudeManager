#!/usr/bin/env python3
"""
Extract skill metadata from all SKILL.md files and generate JavaScript SKILLS_DATA object.
"""

import os
import re
import glob

SKILLS_DIR = "/Users/weidian/.claude/plugins/cache/everything-claude-code/everything-claude-code/1.9.0/docs/zh-CN/skills"
OUTPUT_FILE = "/Users/weidian/claudeProject/everthingClaudeCode/claudeManager/pages/skills-data.js"

def parse_yaml_frontmatter(content):
    """Parse YAML frontmatter from SKILL.md content."""
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if not match:
        return None

    yaml_content = match.group(1)
    metadata = {}

    for line in yaml_content.split('\n'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue

        # Handle key: value format
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()

            # Remove quotes if present
            if value.startswith('"') and value.endswith('"'):
                value = value[1:-1]
            elif value.startswith("'") and value.endswith("'"):
                value = value[1:-1]

            metadata[key] = value

    return metadata

def extract_all_skills():
    """Extract metadata from all SKILL.md files."""
    skills = {}

    # Find all SKILL.md files
    skill_files = glob.glob(os.path.join(SKILLS_DIR, "**/SKILL.md"), recursive=True)

    for filepath in skill_files:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            metadata = parse_yaml_frontmatter(content)
            if metadata and 'name' in metadata:
                skill_name = metadata['name']
                skills[skill_name] = {
                    'name': skill_name,
                    'description': metadata.get('description', ''),
                    'origin': metadata.get('origin', 'ECC')
                }
                print(f"✓ Extracted: {skill_name}")
            else:
                # Use directory name as fallback
                dir_name = os.path.basename(os.path.dirname(filepath))
                print(f"⚠ No frontmatter in: {dir_name}")
        except Exception as e:
            print(f"✗ Error reading {filepath}: {e}")

    return skills

def generate_js_data(skills):
    """Generate JavaScript SKILLS_DATA object."""
    js_lines = [
        "// Auto-generated SKILLS_DATA from ECC plugin cache",
        "// Total skills: " + str(len(skills)),
        "",
        "const SKILLS_DATA = {"
    ]

    # Sort skills alphabetically
    sorted_skills = sorted(skills.items(), key=lambda x: x[0])

    for skill_name, data in sorted_skills:
        # Escape quotes in description
        desc = data['description'].replace('\\', '\\\\').replace('"', '\\"')
        origin = data['origin']

        js_lines.append(f"  '{skill_name}': {{")
        js_lines.append(f"    name: '{skill_name}',")
        js_lines.append(f"    description: \"{desc}\",")
        js_lines.append(f"    origin: '{origin}'")
        js_lines.append(f"  }},")

    js_lines.append("};")
    js_lines.append("")
    js_lines.append("// Export for use in other modules")
    js_lines.append("if (typeof module !== 'undefined' && module.exports) {")
    js_lines.append("  module.exports = SKILLS_DATA;")
    js_lines.append("}")

    return '\n'.join(js_lines)

def main():
    print(f"Extracting skills from: {SKILLS_DIR}")
    print("=" * 50)

    skills = extract_all_skills()

    print("=" * 50)
    print(f"Total skills extracted: {len(skills)}")

    # Generate JavaScript
    js_content = generate_js_data(skills)

    # Write output file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"\n✓ Generated: {OUTPUT_FILE}")
    print(f"  Total lines: {len(js_content.split('\\n'))}")

if __name__ == "__main__":
    main()