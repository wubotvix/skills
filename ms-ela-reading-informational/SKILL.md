---
name: ms-ela-reading-informational
description: >
  Middle school reading informational text tutor (grades 6-8) teaching close reading
  of nonfiction, analyzing arguments, evaluating evidence and reasoning, comparing texts,
  text structure analysis, and determining author's purpose and point of view. Aligned
  with Common Core RI.6-8. Use when the learner wants to "analyze nonfiction", "evaluate
  an argument", "identify text structure", "determine author's purpose", "compare sources",
  or improve informational reading skills.
---

# MS ELA: Reading Informational Text (Grades 6-8)

Structured tutor for close reading of nonfiction aligned with Common Core RI.6-8.

## CLI Usage

```
node reading-informational.js <command> [args]
```

| Command | Description |
|---------|-------------|
| `start <id> [grade]` | Initialize or load student profile |
| `lesson <id>` | Generate a full lesson for next skill |
| `exercise <id> [skill]` | Generate passage-based exercises |
| `check <expected> <answer>` | Check an answer |
| `record <id> <grade> <cat> <skill> <score> <total>` | Record assessment |
| `progress <id>` | View mastery progress |
| `report <id>` | Full student report |
| `next <id> [count]` | Get next skills to work on |
| `catalog [grade]` | List skills for a grade |
| `students` | List all students |
| `set-grade <id> <grade>` | Set student grade level |
| `passage <grade> <skill>` | Get a single passage + question |

## Skill Map

### Grade 6 (RI.6.1-6.9)
- **cite-evidence**: cite-textual-evidence
- **central-idea-summary**: determine-central-idea, objective-summary
- **analyze-development**: individuals-events-ideas
- **technical-connotative-words**: technical-meaning, connotative-figurative
- **section-structure**: section-fits-whole
- **author-purpose-pov**: determine-pov, determine-purpose
- **multimedia-integration**: integrate-formats
- **evaluate-argument**: trace-argument, claims-vs-reasoning
- **compare-authors**: compare-same-topic

### Grade 7 (RI.7.1-7.9)
- **cite-multiple-evidence**: cite-several-pieces
- **two-central-ideas**: two-plus-central-ideas, analyze-development
- **analyze-interactions**: individuals-events-ideas-interact
- **word-choice-tone**: word-impact-meaning, word-impact-tone
- **text-organization**: organizational-structure
- **author-distinguish-position**: distinguish-pov-from-others
- **compare-media-formats**: text-vs-multimedia
- **evaluate-reasoning**: soundness-of-reasoning, relevance-of-evidence
- **compare-texts-same-topic**: different-emphasis

### Grade 8 (RI.8.1-8.9)
- **cite-strongest-evidence**: strongest-textual-evidence
- **central-idea-relationship**: central-idea-development, supporting-ideas-relationship
- **analyze-connections**: connections-distinctions
- **analogy-allusion**: analogy-meaning, allusion-meaning
- **structure-role**: sentence-role, paragraph-role
- **author-conflicting-evidence**: acknowledge-conflicting, respond-to-conflicting
- **evaluate-media-advantages**: media-advantages-disadvantages
- **evaluate-argument-claims**: delineate-argument, sound-reasoning-sufficient-evidence
- **analyze-conflicting-info**: conflicting-facts, conflicting-interpretation

## Key Details
- **Mastery threshold**: 0.8 (80%)
- **Data directory**: `../../data/ms-ela-reading-informational/`
- **Profile format**: JSON with assessments and per-skill mastery tracking
- **Exercises**: Short nonfiction passages (3-5 sentences) with analytical questions
