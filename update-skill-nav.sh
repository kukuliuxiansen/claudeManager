#!/bin/bash

# 所有技能列表（按顺序）
SKILLS=(
    "agent-harness-construction"
    "ai-first-engineering"
    "api-design"
    "autonomous-loops"
    "backend-patterns"
    "claude-api"
    "coding-standards"
    "content-engine"
    "continuous-agent-loop"
    "continuous-learning"
    "continuous-learning-v2"
    "deep-research"
    "e2e-testing"
    "eval-harness"
    "exa-search"
    "frontend-patterns"
    "frontend-slides"
    "iterative-retrieval"
    "java-coding-standards"
    "jpa-patterns"
    "learned"
    "nutrient-document-processing"
    "plankton-code-quality"
    "prompt-optimizer"
    "search-first"
    "skill-stocktake"
    "springboot-patterns"
    "springboot-tdd"
    "springboot-verification"
    "tdd-workflow"
    "verification-loop"
    "agentic-engineering"
    "android-clean-architecture"
    "article-writing"
    "blueprint"
    "carrier-relationship-management"
    "clickhouse-io"
    "compose-multiplatform-patterns"
    "configure-ecc"
    "content-hash-cache-pattern"
    "cost-aware-llm-pipeline"
    "cpp-coding-standards"
    "cpp-testing"
    "crosspost"
    "customs-trade-compliance"
    "database-migrations"
    "deployment-patterns"
    "django-patterns"
    "django-security"
    "django-tdd"
    "django-verification"
    "dmux-workflows"
    "docker-patterns"
    "energy-procurement"
    "enterprise-agent-ops"
    "fal-ai-media"
    "foundation-models-on-device"
    "golang-patterns"
    "golang-testing"
    "inventory-demand-planning"
    "investor-materials"
    "investor-outreach"
    "kotlin-coroutines-flows"
    "kotlin-exposed-patterns"
    "kotlin-ktor-patterns"
    "kotlin-patterns"
    "kotlin-testing"
    "liquid-glass-design"
    "logistics-exception-management"
    "market-research"
    "nanoclaw-repl"
    "perl-patterns"
    "perl-security"
    "perl-testing"
    "postgres-patterns"
    "production-scheduling"
    "project-guidelines-example"
    "python-patterns"
    "python-testing"
    "quality-nonconformance"
    "ralphinho-rfc-pipeline"
    "regex-vs-llm-structured-text"
    "returns-reverse-logistics"
    "security-review"
    "security-scan"
    "springboot-security"
    "strategic-compact"
    "swift-actor-persistence"
    "swift-concurrency-6-2"
    "swift-protocol-di-testing"
    "swiftui-patterns"
    "video-editing"
    "videodb"
    "visa-doc-translate"
    "x-api"
)

TOTAL=${#SKILLS[@]}
SKILLS_DIR="/Users/weidian/claudeProject/everthingClaudeCode/claudeManager/pages/skills"

for i in "${!SKILLS[@]}"; do
    SKILL="${SKILLS[$i]}"
    FILE="$SKILLS_DIR/${SKILL}.html"

    if [ -f "$FILE" ]; then
        # Calculate previous and next
        PREV_IDX=$((i - 1))
        NEXT_IDX=$((i + 1))

        if [ $PREV_IDX -lt 0 ]; then
            PREV_IDX=$((TOTAL - 1))
        fi
        if [ $NEXT_IDX -ge $TOTAL ]; then
            NEXT_IDX=0
        fi

        PREV_SKILL="${SKILLS[$PREV_IDX]}"
        NEXT_SKILL="${SKILLS[$NEXT_IDX]}"

        # Update navigation links using sed
        # Find and replace onclick="location.href='xxx.html'" patterns
        sed -i '' "s|onclick=\"location.href='[^']*\.html'\".*上一个|onclick=\"location.href='${PREV_SKILL}.html'\">\\n                <div class=\"nav-label\">上一个|g" "$FILE"
        sed -i '' "s|onclick=\"location.href='[^']*\.html'\".*下一个|onclick=\"location.href='${NEXT_SKILL}.html'\">\\n                <div class=\"nav-label\">下一个|g" "$FILE"

        # Also update the nav-title content
        # This is trickier with sed, so we'll use a more specific pattern

        echo "Updated: $SKILL.html (prev: $PREV_SKILL, next: $NEXT_SKILL)"
    else
        echo "Missing: $SKILL.html"
    fi
done

echo "Navigation update complete!"