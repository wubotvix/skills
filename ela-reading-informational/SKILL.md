---
name: ela-reading-informational
description: >
  Elementary informational text reading tutor (K-6) teaching comprehension of
  nonfiction including main idea, text features, text structure, evidence
  evaluation, and critical reading. Aligned with Common Core RI standards.
  Use when the learner wants to "read nonfiction", "find the main idea",
  "use text features", "read an article", or improve informational comprehension.
---

# Reading: Informational Text (K-6)

**Reading comprehension coach** for nonfiction — articles, science texts,
history texts, biographies. Teaches extracting, evaluating, and synthesizing
information from informational text.

## Core Principles

- **Text features first**: headings, captions, bold words, diagrams before reading
- **Main idea + details**: "What is this MOSTLY about? How do you know?"
- **Text structure**: cause/effect, compare/contrast, problem/solution, sequence
- **Text evidence always**: "What does the text SAY? Show me where."
- **Critical reading**: evaluate sources, identify bias, trace arguments

## Skills by Grade

| Grade | Skills |
|-------|--------|
| **K** | topic-identification, key-details-basic, picture-information, ask-answer-questions |
| **1** | main-topic, retell-key-details, text-features-basic, who-what-where-when |
| **2** | main-topic-multiparagraph, text-features-captions-bold, author-purpose-basic, compare-two-texts |
| **3** | main-idea-details, text-features-locate, text-structure-basic, author-purpose-pov, context-vocabulary-nf |
| **4** | main-idea-summarize, text-structure-identify, evidence-explain, author-reasoning, interpret-visuals, integrate-two-texts |
| **5** | multiple-main-ideas, compare-text-structures, quote-accurately, analyze-author-evidence, multiple-sources |
| **6** | central-idea-summary, cite-evidence, analyze-development, author-craft-purpose, evaluate-argument, multimedia-integration |

## CLI Usage

```
node reading-informational.js <command> [args]
```

| Command | Description |
|---------|-------------|
| `start <id> [grade]` | Initialize student, optionally set grade |
| `lesson <id>` | Generate a full lesson for next skill |
| `exercise <id> [skill]` | Generate comprehension exercises |
| `check <id> <expected> <answer>` | Check an answer |
| `record <id> <grade> <cat> <skill> <score> <total>` | Record assessment |
| `progress <id>` | Show mastery progress |
| `report <id>` | Full student report |
| `next <id> [count]` | Recommend next skills to practice |
| `catalog [grade]` | List skills for a grade |
| `students` | List all students |
| `set-grade <id> <grade>` | Change student grade |
| `passage <grade> <skill>` | Generate a single passage with question |

## Data

Student profiles stored as JSON in `../../data/ela-reading-informational/`.
Mastery threshold: 0.8 (80%). Mastery calculated from last 5 attempts.

## Session Flow

1. **Preview** — survey text features, predict topic
2. **Read** — read passage, identify main ideas and details
3. **Practice** — answer comprehension questions (5 per exercise)
4. **Apply** — use strategy with a new nonfiction text

## Quick Commands

| Command | Action |
|---------|--------|
| `nonfiction` | Start informational reading session |
| `main idea` | Practice finding main idea and details |
| `text features` | Practice using nonfiction text features |
| `text structure` | Identify text structures |
| `evidence` | Practice citing text evidence |
| `my reading info` | Show reading progress |
