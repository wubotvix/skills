---
name: hs-ela-informational
description: >
  High school informational text and rhetoric tutor (grades 9-12). Teaches
  rhetorical analysis, argument evaluation, seminal US documents, SOAPSTone,
  and source synthesis. Aligned with Common Core RI.9-12 and AP Language.
  Use when the learner wants to analyze rhetoric, evaluate arguments, study
  speeches, identify fallacies, or prepare for AP Language.
---

# HS ELA Informational Text & Rhetoric

Interactive CLI tutor for grades 9-12 covering nonfiction reading, rhetorical
analysis, argument evaluation, and source synthesis.

## Skills by Grade

- **Grade 9**: cite-evidence, central-idea-summary, analyze-development,
  word-meaning-rhetoric, text-structure-purpose, author-pov-rhetoric,
  argument-evaluation, compare-accounts
- **Grade 10**: cite-strong-evidence, central-idea-analysis, analyze-complex-ideas,
  cumulative-word-impact, structural-analysis, rhetorical-purpose,
  evaluate-reasoning-evidence, compare-seminal-documents
- **Grade 11**: cite-thorough-evidence, two-central-ideas, complex-analysis,
  technical-connotative-figurative, author-structure-choices,
  assess-reasoning-rhetoric, evaluate-premises-logic, synthesize-multiple-sources
- **Grade 12**: demonstrate-knowledge, develop-complex-analysis, nuanced-analysis,
  ambiguity-language, innovative-structures, evaluate-effectiveness,
  constitutional-rhetoric, integration-diverse-sources

## Architecture

- Single-file Node.js CLI (`informational.js`), zero dependencies
- Short nonfiction/rhetorical passages with analysis questions per skill
- Student profiles saved as JSON to `../../data/hs-ela-informational/`
- Mastery tracking: 0.8 threshold, labels: mastered/proficient/developing/emerging
- Keyword-overlap answer checking for open-ended rhetorical analysis

## CLI Commands

```
node informational.js start <id> [grade]    # Init student, set grade
node informational.js lesson <id>           # Generate targeted lesson
node informational.js exercise <id> [skill] # Generate passage + questions
node informational.js check <expected> <answer>  # Check an answer
node informational.js record <id> <grade> <cat> <skill> <score> <total>
node informational.js progress <id>         # View mastery by skill
node informational.js report <id>           # Full student report
node informational.js next <id> [count]     # Recommended next skills
node informational.js catalog [grade]       # List skills per grade
node informational.js students              # List all students
node informational.js set-grade <id> <grade>
node informational.js passage <grade> <key> # Display a passage
```

## Frameworks Covered

- **SOAPSTone**: Speaker, Occasion, Audience, Purpose, Subject, Tone
- **Toulmin Model**: Claim, Data, Warrant, Backing, Qualifier, Rebuttal
- **Rhetorical Appeals**: Ethos, Logos, Pathos, Kairos
- **Logical Fallacies**: Ad hominem, straw man, false dilemma, and more
- **AP Language Essays**: Rhetorical analysis, argument, synthesis

## Content

Each grade includes curated nonfiction passages (environmental science, civil
rights, constitutional history, media literacy, political rhetoric) with
multi-part analysis questions targeting specific reading standards.
