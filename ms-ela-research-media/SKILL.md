---
name: ms-ela-research-media
description: >
  Middle school research and media literacy tutor (grades 6-8) teaching the research
  process, evaluating sources, synthesizing information, MLA citation basics, avoiding
  plagiarism, digital literacy, and media analysis. Aligned with Common Core W.6-8.7-9
  and SL.6-8.2. Use when the learner wants to "do a research project", "find reliable
  sources", "cite sources", "avoid plagiarism", "analyze media", or develop research skills.
---

# MS ELA: Research & Media Literacy (Grades 6-8)

Structured tutor for research skills and media literacy. Common Core W.6-8.7-9, SL.6-8.2.

## Tool

`node research-media.js <command> [args]` -- all output is JSON.

| Command | Description |
|---------|-------------|
| `start <id> [grade]` | Init/load student, optionally set grade |
| `lesson <id>` | Generate a full lesson targeting the next skill |
| `exercise <id> [skill]` | Generate exercises (or `citation`, `paraphrase`, `media-analysis`) |
| `check <id> <type> <expected> <answer>` | Check an answer |
| `record <id> <grade> <cat> <skill> <score> <total>` | Record assessment |
| `progress <id>` | Show mastery per skill |
| `report <id>` | Full report with recent assessments |
| `next <id> [count]` | Recommend next skills to practice |
| `catalog [grade]` | List skills for a grade |
| `students` | List all students |
| `set-grade <id> <grade>` | Change student grade |

Grades: `grade-6`, `grade-7`, `grade-8`. Mastery threshold: 0.8.

## Skill Map

### Grade 6 (W.6.7-9, SL.6.2)
- **research-projects**: short-research-project
- **gathering-info**: gather-information
- **evidence**: draw-evidence-literary, draw-evidence-informational
- **media-literacy**: interpret-diverse-media

### Grade 7 (W.7.7-9, SL.7.2)
- **research-projects**: focused-research
- **gathering-info**: assess-sources, search-terms
- **evidence**: evidence-literary-7, evidence-informational-7
- **media-literacy**: analyze-media-main-ideas

### Grade 8 (W.8.7-9, SL.8.2)
- **research-projects**: sustained-research
- **gathering-info**: synthesize-sources, avoid-plagiarism
- **evidence**: evidence-literary-8, evidence-informational-8
- **media-literacy**: evaluate-media-advantages

## Content Banks

- **Skill exercises**: research questions, source evaluation (CRAAP/SIFT), evidence integration, media analysis per grade
- **Citation exercises**: MLA format for books, websites, articles, videos
- **Paraphrase exercises**: good vs. bad paraphrase identification
- **Media analysis exercises**: ads, headlines, infographics, social media, documentaries

## Approach

1. **Inquiry-driven** -- research starts with strong questions
2. **Source evaluation** -- CRAAP test and SIFT method
3. **Ethical use** -- citation and plagiarism prevention
4. **Synthesis over summary** -- combine sources into original analysis
5. **Media awareness** -- evaluate purpose, motive, and technique
6. **Process focus** -- value the research process, not just the product

## Session Flow

Warm-up (review) -> Teach (mini-lesson) -> Practice (exercises) -> Apply (use in own research) -> Reflect

Data stored in `../../data/ms-ela-research-media/<studentId>.json`.
