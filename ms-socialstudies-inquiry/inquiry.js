// MS Social Studies Inquiry & Evidence Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-socialstudies-inquiry');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  "grade-6": {
    "asking-questions": [
      "compelling-questions",
      "supporting-questions",
      "question-types"
    ],
    "basic-sourcing": [
      "identifying-sources",
      "author-perspective",
      "main-idea-details"
    ],
    "simple-claims": [
      "making-claims",
      "supporting-with-evidence",
      "simple-explanations"
    ]
  },
  "grade-7": {
    "contextualization": [
      "historical-context",
      "time-and-place",
      "point-of-view"
    ],
    "corroboration": [
      "comparing-sources",
      "finding-agreement",
      "resolving-contradictions"
    ],
    "thesis-writing": [
      "thesis-statements",
      "dbq-paragraphs",
      "evidence-integration"
    ]
  },
  "grade-8": {
    "full-dbq": [
      "document-analysis",
      "essay-structure",
      "using-outside-knowledge"
    ],
    "research-skills": [
      "research-questions",
      "source-evaluation",
      "lateral-reading"
    ],
    "argumentation": [
      "counterarguments",
      "taking-informed-action",
      "academic-discussion"
    ]
  }
};

const CONTENT_BANKS = {
  "grade-6": {
    "compelling-questions": {
      "questions": [
        {
          "q": "What is a compelling question?",
          "a": "a thought-provoking question that drives inquiry and has no single right answer",
          "alts": [
            "thought-provoking question"
          ]
        },
        {
          "q": "Is \"When was the Declaration of Independence signed?\" a compelling question?",
          "a": "no — it has one factual answer and does not invite investigation",
          "alts": [
            "no"
          ]
        },
        {
          "q": "Is \"Was the American Revolution justified?\" a compelling question?",
          "a": "yes — it requires evidence, analysis, and can be debated",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "What makes a question compelling?",
          "a": "it is interesting, requires investigation, and can be debated with evidence",
          "alts": [
            "interesting requires investigation debatable"
          ]
        },
        {
          "q": "Write a compelling question about ancient civilizations.",
          "a": "What made some ancient civilizations succeed while others declined?",
          "alts": [
            "various valid compelling questions"
          ]
        },
        {
          "q": "How are compelling questions different from simple factual questions?",
          "a": "compelling questions require analysis and evidence; factual questions have straightforward answers",
          "alts": [
            "analysis vs simple answers"
          ]
        }
      ]
    },
    "supporting-questions": {
      "questions": [
        {
          "q": "What is a supporting question?",
          "a": "a smaller question that helps answer the larger compelling question",
          "alts": [
            "smaller question supporting the big one"
          ]
        },
        {
          "q": "For the compelling question \"Was democracy always fair?\", write a supporting question.",
          "a": "Who was allowed to vote in ancient Athens?",
          "alts": [
            "various valid supporting questions"
          ]
        },
        {
          "q": "How many supporting questions should an inquiry have?",
          "a": "at least 2-3, each addressing a different aspect of the compelling question",
          "alts": [
            "2 to 3"
          ]
        },
        {
          "q": "Should supporting questions be answerable with evidence?",
          "a": "yes — they should be researchable and lead to specific evidence",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "What is the relationship between compelling and supporting questions?",
          "a": "supporting questions break down the compelling question into manageable, researchable parts",
          "alts": [
            "break down into parts"
          ]
        },
        {
          "q": "Can you answer a compelling question without first answering supporting questions?",
          "a": "not well — supporting questions build the foundation of evidence",
          "alts": [
            "no need supporting questions first"
          ]
        }
      ]
    },
    "question-types": {
      "questions": [
        {
          "q": "What is a factual question?",
          "a": "a question with a single correct answer based on facts",
          "alts": [
            "one right answer"
          ]
        },
        {
          "q": "What is an analytical question?",
          "a": "a question that requires examining evidence and explaining relationships",
          "alts": [
            "examining evidence"
          ]
        },
        {
          "q": "What is an evaluative question?",
          "a": "a question that requires making a judgment based on criteria and evidence",
          "alts": [
            "making a judgment"
          ]
        },
        {
          "q": "\"What caused the Civil War?\" is what type of question?",
          "a": "analytical",
          "alts": [
            "analytical"
          ]
        },
        {
          "q": "\"Was dropping the atomic bomb justified?\" is what type of question?",
          "a": "evaluative",
          "alts": [
            "evaluative"
          ]
        },
        {
          "q": "Which question type is most useful for social studies inquiry?",
          "a": "analytical and evaluative — they require deeper thinking than factual questions",
          "alts": [
            "analytical and evaluative"
          ]
        }
      ]
    },
    "identifying-sources": {
      "questions": [
        {
          "q": "What is a primary source?",
          "a": "an original document or artifact from the time period being studied",
          "alts": [
            "original document from the time"
          ]
        },
        {
          "q": "What is a secondary source?",
          "a": "a source that analyzes or interprets primary sources",
          "alts": [
            "analyzes primary sources"
          ]
        },
        {
          "q": "Is a diary from the Civil War a primary or secondary source?",
          "a": "primary",
          "alts": [
            "primary"
          ]
        },
        {
          "q": "Is a textbook chapter about the Civil War primary or secondary?",
          "a": "secondary",
          "alts": [
            "secondary"
          ]
        },
        {
          "q": "Name three types of primary sources.",
          "a": "letters, photographs, government documents, speeches, diaries, artifacts",
          "alts": [
            "letters photos speeches"
          ]
        },
        {
          "q": "Why are primary sources important for inquiry?",
          "a": "they provide direct evidence from the past without someone else's interpretation",
          "alts": [
            "direct evidence"
          ]
        }
      ]
    },
    "author-perspective": {
      "questions": [
        {
          "q": "Why does the author's perspective matter when reading a source?",
          "a": "it affects what information they include, exclude, and how they present it",
          "alts": [
            "affects what they include"
          ]
        },
        {
          "q": "A soldier and a general describe the same battle. Why might their accounts differ?",
          "a": "they had different experiences, roles, and viewpoints of the same event",
          "alts": [
            "different experiences"
          ]
        },
        {
          "q": "What questions should you ask about a source's author?",
          "a": "Who are they? When did they write? What was their purpose? What is their bias?",
          "alts": [
            "who when purpose bias"
          ]
        },
        {
          "q": "Does having a perspective make a source unreliable?",
          "a": "no — all sources have perspectives; awareness of bias helps you evaluate them",
          "alts": [
            "no all sources have perspective"
          ]
        },
        {
          "q": "How does audience affect what an author writes?",
          "a": "authors shape their message based on who they are trying to reach or convince",
          "alts": [
            "shapes message for audience"
          ]
        },
        {
          "q": "What is the difference between perspective and bias?",
          "a": "perspective is a viewpoint shaped by experience; bias is when perspective distorts the presentation of facts",
          "alts": [
            "viewpoint vs distortion"
          ]
        }
      ]
    },
    "main-idea-details": {
      "questions": [
        {
          "q": "What is the main idea of a source?",
          "a": "the central point or argument the author is making",
          "alts": [
            "central point"
          ]
        },
        {
          "q": "How do you identify the main idea?",
          "a": "look at the title, first and last sentences, and repeated themes",
          "alts": [
            "title first last sentences"
          ]
        },
        {
          "q": "What are supporting details?",
          "a": "specific facts, examples, or evidence that support the main idea",
          "alts": [
            "facts that support main idea"
          ]
        },
        {
          "q": "Can a source have more than one main idea?",
          "a": "longer sources can, but each section usually has one central point",
          "alts": [
            "longer sources can"
          ]
        },
        {
          "q": "Why is identifying the main idea important for inquiry?",
          "a": "it helps you understand what evidence a source provides for your question",
          "alts": [
            "understand what evidence it provides"
          ]
        },
        {
          "q": "How do you tell the difference between a main idea and a detail?",
          "a": "the main idea is the big point; details are specific facts that support it",
          "alts": [
            "big point vs specific facts"
          ]
        }
      ]
    },
    "making-claims": {
      "questions": [
        {
          "q": "What is a claim in social studies?",
          "a": "a statement that answers a question and can be supported with evidence",
          "alts": [
            "statement supported by evidence"
          ]
        },
        {
          "q": "Is \"The Roman Empire was the best empire\" a good claim?",
          "a": "no — \"best\" is vague and subjective; a good claim is more specific",
          "alts": [
            "no too vague"
          ]
        },
        {
          "q": "Write a claim about ancient Egypt.",
          "a": "The Nile River was the most important factor in ancient Egypt's success.",
          "alts": [
            "various valid claims"
          ]
        },
        {
          "q": "Should a claim be a fact or an argument?",
          "a": "an argument — it should take a position that can be debated",
          "alts": [
            "an argument"
          ]
        },
        {
          "q": "What makes a claim strong?",
          "a": "it is specific, debatable, and can be supported with evidence",
          "alts": [
            "specific debatable supported"
          ]
        },
        {
          "q": "Can your claim change as you find more evidence?",
          "a": "yes — good inquiry revises claims based on evidence",
          "alts": [
            "yes"
          ]
        }
      ]
    },
    "supporting-with-evidence": {
      "questions": [
        {
          "q": "What counts as evidence in social studies?",
          "a": "facts, data, quotes, documents, and examples from credible sources",
          "alts": [
            "facts data quotes documents"
          ]
        },
        {
          "q": "How many pieces of evidence should support a claim?",
          "a": "at least 2-3 from different sources",
          "alts": [
            "2 to 3"
          ]
        },
        {
          "q": "Is personal opinion evidence?",
          "a": "no — evidence must come from sources that can be verified",
          "alts": [
            "no"
          ]
        },
        {
          "q": "Why should evidence come from multiple sources?",
          "a": "to ensure it is reliable and to show the claim is well-supported",
          "alts": [
            "reliability and support"
          ]
        },
        {
          "q": "What should you do if evidence contradicts your claim?",
          "a": "consider revising your claim or addressing the contradicting evidence",
          "alts": [
            "revise claim or address it"
          ]
        },
        {
          "q": "How do you connect evidence to your claim?",
          "a": "explain why the evidence supports your claim — do not just list facts",
          "alts": [
            "explain why it supports"
          ]
        }
      ]
    },
    "simple-explanations": {
      "questions": [
        {
          "q": "What is an explanation in social studies?",
          "a": "telling why or how something happened using evidence and reasoning",
          "alts": [
            "why or how with evidence"
          ]
        },
        {
          "q": "How is an explanation different from a description?",
          "a": "a description tells what happened; an explanation tells why or how",
          "alts": [
            "what vs why"
          ]
        },
        {
          "q": "What makes a good explanation?",
          "a": "it uses evidence, shows cause and effect, and connects to the original question",
          "alts": [
            "evidence cause effect"
          ]
        },
        {
          "q": "Should an explanation include your opinion?",
          "a": "it should include your reasoned judgment supported by evidence, not just feelings",
          "alts": [
            "reasoned judgment not feelings"
          ]
        },
        {
          "q": "What is the difference between a claim and an explanation?",
          "a": "a claim states what you believe; an explanation shows why you believe it",
          "alts": [
            "what vs why"
          ]
        },
        {
          "q": "Why is \"because\" an important word in explanations?",
          "a": "it signals that you are providing a reason or cause",
          "alts": [
            "signals a reason"
          ]
        }
      ]
    }
  },
  "grade-7": {
    "historical-context": {
      "questions": [
        {
          "q": "What is historical context?",
          "a": "the conditions, events, and ideas of the time period that help explain a source or event",
          "alts": [
            "conditions of the time"
          ]
        },
        {
          "q": "Why is context important when reading a primary source?",
          "a": "it helps you understand what the author meant and why they wrote it",
          "alts": [
            "understand author meaning"
          ]
        },
        {
          "q": "A letter from 1860 mentions \"the peculiar institution.\" What context do you need?",
          "a": "that \"peculiar institution\" was a euphemism for slavery in the antebellum South",
          "alts": [
            "slavery"
          ]
        },
        {
          "q": "How do you find historical context?",
          "a": "research the time period, place, and events surrounding the source",
          "alts": [
            "research time place events"
          ]
        },
        {
          "q": "Can you fully understand a document without its context?",
          "a": "no — context is essential for accurate interpretation",
          "alts": [
            "no"
          ]
        },
        {
          "q": "What is presentism?",
          "a": "the error of judging the past by today's standards",
          "alts": [
            "judging past by today"
          ]
        }
      ]
    },
    "time-and-place": {
      "questions": [
        {
          "q": "Why does when a source was created matter?",
          "a": "the time period affects the author's knowledge, attitudes, and available information",
          "alts": [
            "affects knowledge and attitudes"
          ]
        },
        {
          "q": "Why does where a source was created matter?",
          "a": "location affects the author's experiences, culture, and perspective on events",
          "alts": [
            "location affects perspective"
          ]
        },
        {
          "q": "A newspaper from New York and one from Charleston cover the same 1860 event. Why might they differ?",
          "a": "different regional perspectives on slavery and states' rights",
          "alts": [
            "different regional views"
          ]
        },
        {
          "q": "How does proximity to an event affect a source?",
          "a": "sources created closer to the event may have more detail but also more emotional bias",
          "alts": [
            "more detail but more bias"
          ]
        },
        {
          "q": "What is an anachronism?",
          "a": "something placed in the wrong time period",
          "alts": [
            "wrong time period"
          ]
        },
        {
          "q": "If a source was created 50 years after an event, how might that affect it?",
          "a": "the author may have broader perspective but less accuracy on specific details",
          "alts": [
            "broader view less detail"
          ]
        }
      ]
    },
    "point-of-view": {
      "questions": [
        {
          "q": "What is point of view in source analysis?",
          "a": "the position from which the author observes and writes about events",
          "alts": [
            "author position"
          ]
        },
        {
          "q": "How does point of view affect what gets included in a source?",
          "a": "authors include what they notice and value, and may not include other perspectives",
          "alts": [
            "includes what they value"
          ]
        },
        {
          "q": "A king and a peasant describe the same kingdom. How might their descriptions differ?",
          "a": "the king may emphasize achievements and order; the peasant may focus on hardship and inequality",
          "alts": [
            "different emphasis"
          ]
        },
        {
          "q": "How many points of view should you consider on a historical event?",
          "a": "as many as possible to get a complete picture",
          "alts": [
            "as many as possible"
          ]
        },
        {
          "q": "What is the difference between bias and point of view?",
          "a": "point of view is natural perspective; bias is when that perspective distorts accuracy",
          "alts": [
            "perspective vs distortion"
          ]
        },
        {
          "q": "How do you identify an author's point of view?",
          "a": "look at who they are, what they emphasize, what they omit, and what language they use",
          "alts": [
            "who they are what they emphasize"
          ]
        }
      ]
    },
    "comparing-sources": {
      "questions": [
        {
          "q": "Why should you compare multiple sources on the same topic?",
          "a": "to get a more complete and accurate understanding of events",
          "alts": [
            "more complete understanding"
          ]
        },
        {
          "q": "What should you look for when comparing sources?",
          "a": "agreements, disagreements, gaps, and different perspectives",
          "alts": [
            "agreements disagreements gaps"
          ]
        },
        {
          "q": "Two sources agree on basic facts but disagree on interpretation. What does this suggest?",
          "a": "the facts are likely accurate, but the meaning is debatable",
          "alts": [
            "facts accurate meaning debatable"
          ]
        },
        {
          "q": "What is corroboration?",
          "a": "verifying information by finding it confirmed in multiple independent sources",
          "alts": [
            "confirming with multiple sources"
          ]
        },
        {
          "q": "If only one source reports something, should you be cautious?",
          "a": "yes — uncorroborated claims need additional verification",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "What if two credible sources directly contradict each other?",
          "a": "investigate further — look for additional sources and consider each source's perspective and bias",
          "alts": [
            "investigate further"
          ]
        }
      ]
    },
    "finding-agreement": {
      "questions": [
        {
          "q": "What does it mean when multiple sources agree?",
          "a": "the information is more likely to be accurate and reliable",
          "alts": [
            "more likely accurate"
          ]
        },
        {
          "q": "Do sources have to use the same words to agree?",
          "a": "no — they can express the same idea differently",
          "alts": [
            "no"
          ]
        },
        {
          "q": "Three letters from different soldiers all mention the same battle conditions. What does this tell you?",
          "a": "the conditions were likely as described since independent sources corroborate each other",
          "alts": [
            "conditions were likely real"
          ]
        },
        {
          "q": "What if sources agree but are all from the same side?",
          "a": "the agreement may reflect a shared bias rather than objective truth",
          "alts": [
            "shared bias possible"
          ]
        },
        {
          "q": "How does finding agreement strengthen your argument?",
          "a": "it shows your evidence is corroborated by multiple independent sources",
          "alts": [
            "evidence is corroborated"
          ]
        },
        {
          "q": "When looking for agreement, should you use sources from different types?",
          "a": "yes — a letter, a newspaper, and a government record agreeing is stronger than three letters",
          "alts": [
            "yes different types"
          ]
        }
      ]
    },
    "resolving-contradictions": {
      "questions": [
        {
          "q": "What should you do when sources contradict each other?",
          "a": "consider each source's perspective, bias, and reliability to determine which is more trustworthy",
          "alts": [
            "consider perspective bias reliability"
          ]
        },
        {
          "q": "Can contradictions in sources be valuable?",
          "a": "yes — they reveal complexity and different perspectives on events",
          "alts": [
            "yes reveal complexity"
          ]
        },
        {
          "q": "Source A says 100 people attended an event; Source B says 500. How do you resolve this?",
          "a": "consider who created each source, their motivation, and look for a third source",
          "alts": [
            "check motivation and third source"
          ]
        },
        {
          "q": "What is a useful strategy when sources conflict?",
          "a": "find additional sources, consider the context of each, and look for reasons for the disagreement",
          "alts": [
            "find more sources consider context"
          ]
        },
        {
          "q": "Should you always choose one source over another when they conflict?",
          "a": "not necessarily — sometimes acknowledging the disagreement is more honest than choosing a side",
          "alts": [
            "not always"
          ]
        },
        {
          "q": "How might both contradicting sources be partially correct?",
          "a": "each may capture a different aspect of a complex event",
          "alts": [
            "different aspects of same event"
          ]
        }
      ]
    },
    "thesis-statements": {
      "questions": [
        {
          "q": "What is a thesis statement?",
          "a": "a clear, arguable claim that states your main argument for an essay",
          "alts": [
            "main argument statement"
          ]
        },
        {
          "q": "What makes a strong thesis?",
          "a": "it is specific, arguable, and can be supported with evidence from documents",
          "alts": [
            "specific arguable supported"
          ]
        },
        {
          "q": "Is \"The Civil War was important\" a good thesis?",
          "a": "no — it is too vague and not debatable",
          "alts": [
            "no"
          ]
        },
        {
          "q": "Rewrite \"The Industrial Revolution changed things\" as a strong thesis.",
          "a": "The Industrial Revolution transformed society by creating a new urban working class and widening the gap between rich and poor.",
          "alts": [
            "various strong theses"
          ]
        },
        {
          "q": "Where should a thesis appear in an essay?",
          "a": "at the end of the introduction paragraph",
          "alts": [
            "end of introduction"
          ]
        },
        {
          "q": "Can a thesis be revised during the writing process?",
          "a": "yes — as you analyze evidence, you may refine your argument",
          "alts": [
            "yes"
          ]
        }
      ]
    },
    "dbq-paragraphs": {
      "questions": [
        {
          "q": "What is a DBQ?",
          "a": "a Document-Based Question — an essay that requires analyzing provided documents as evidence",
          "alts": [
            "document-based question essay"
          ]
        },
        {
          "q": "What should a DBQ body paragraph include?",
          "a": "a topic sentence, evidence from documents, analysis, and connection to the thesis",
          "alts": [
            "topic sentence evidence analysis thesis connection"
          ]
        },
        {
          "q": "How should you reference a document in a DBQ?",
          "a": "cite it by name or number and explain how it supports your argument",
          "alts": [
            "cite and explain"
          ]
        },
        {
          "q": "Should you just summarize documents in a DBQ?",
          "a": "no — you must analyze them and use them as evidence for your argument",
          "alts": [
            "no analyze"
          ]
        },
        {
          "q": "How many documents should a paragraph typically use?",
          "a": "at least 1-2, with analysis of each",
          "alts": [
            "1 to 2"
          ]
        },
        {
          "q": "What is the difference between quoting and paraphrasing a document?",
          "a": "quoting uses exact words; paraphrasing restates the idea in your own words",
          "alts": [
            "exact words vs own words"
          ]
        }
      ]
    },
    "evidence-integration": {
      "questions": [
        {
          "q": "What does it mean to integrate evidence?",
          "a": "smoothly weaving evidence into your argument rather than just dropping in quotes",
          "alts": [
            "smoothly weaving in evidence"
          ]
        },
        {
          "q": "What is a \"hit and run\" quote?",
          "a": "dropping a quote without explanation or connection to your argument",
          "alts": [
            "quote without explanation"
          ]
        },
        {
          "q": "How should you introduce a piece of evidence?",
          "a": "with context: who said it, when, and why it matters for your argument",
          "alts": [
            "with context"
          ]
        },
        {
          "q": "What should come after you present evidence?",
          "a": "analysis — explain what the evidence means and how it supports your claim",
          "alts": [
            "analysis and explanation"
          ]
        },
        {
          "q": "What is the \"sandwich\" method?",
          "a": "introduce the evidence, present it, then analyze it — like bread, filling, bread",
          "alts": [
            "introduce present analyze"
          ]
        },
        {
          "q": "Should you use long block quotes in a DBQ?",
          "a": "generally no — select the most relevant part and paraphrase the rest",
          "alts": [
            "no use relevant parts"
          ]
        }
      ]
    }
  },
  "grade-8": {
    "document-analysis": {
      "questions": [
        {
          "q": "What steps should you follow to analyze a document?",
          "a": "identify the source, determine context, find the main idea, evaluate perspective, and connect to your question",
          "alts": [
            "source context main idea perspective connection"
          ]
        },
        {
          "q": "What is sourcing?",
          "a": "examining who created a document, when, where, and why before reading it",
          "alts": [
            "examining author and context"
          ]
        },
        {
          "q": "What is close reading?",
          "a": "carefully reading a text to understand not just what it says but what it means",
          "alts": [
            "careful reading for meaning"
          ]
        },
        {
          "q": "What should you annotate when reading a document?",
          "a": "main ideas, key evidence, author perspective, unfamiliar terms, and connections to other sources",
          "alts": [
            "main ideas evidence perspective"
          ]
        },
        {
          "q": "How do you determine the reliability of a document?",
          "a": "consider the author's credentials, purpose, potential bias, and how it compares to other sources",
          "alts": [
            "credentials purpose bias comparison"
          ]
        },
        {
          "q": "What is the difference between explicit and implicit information?",
          "a": "explicit is directly stated; implicit is suggested or inferred",
          "alts": [
            "stated vs implied"
          ]
        }
      ]
    },
    "essay-structure": {
      "questions": [
        {
          "q": "What are the parts of a DBQ essay?",
          "a": "introduction with thesis, body paragraphs with evidence, and conclusion",
          "alts": [
            "introduction body conclusion"
          ]
        },
        {
          "q": "How should a DBQ introduction start?",
          "a": "with historical context that sets the scene for the question",
          "alts": [
            "with historical context"
          ]
        },
        {
          "q": "How many body paragraphs should a DBQ have?",
          "a": "typically 2-3, each addressing a different aspect of the thesis",
          "alts": [
            "2 to 3"
          ]
        },
        {
          "q": "What should a DBQ conclusion do?",
          "a": "restate the thesis in new words, summarize key evidence, and provide broader significance",
          "alts": [
            "restate thesis summarize significance"
          ]
        },
        {
          "q": "How should body paragraphs be organized?",
          "a": "by theme or argument, not by document number",
          "alts": [
            "by theme not document"
          ]
        },
        {
          "q": "What transition words connect paragraphs effectively?",
          "a": "furthermore, however, in contrast, similarly, as a result, additionally",
          "alts": [
            "furthermore however similarly"
          ]
        }
      ]
    },
    "using-outside-knowledge": {
      "questions": [
        {
          "q": "What is outside knowledge in a DBQ?",
          "a": "relevant historical information that you know but is not in the provided documents",
          "alts": [
            "knowledge not in documents"
          ]
        },
        {
          "q": "Why is outside knowledge important in a DBQ?",
          "a": "it shows deeper understanding and strengthens your argument beyond the documents",
          "alts": [
            "shows deeper understanding"
          ]
        },
        {
          "q": "Should outside knowledge replace document evidence?",
          "a": "no — it should supplement and strengthen document-based evidence",
          "alts": [
            "no supplement"
          ]
        },
        {
          "q": "How do you integrate outside knowledge?",
          "a": "use it to provide context, explain significance, or fill gaps in the documents",
          "alts": [
            "context significance gaps"
          ]
        },
        {
          "q": "Where does outside knowledge typically appear in a DBQ?",
          "a": "in the introduction for context and in body paragraphs to deepen analysis",
          "alts": [
            "introduction and body"
          ]
        },
        {
          "q": "What if your outside knowledge contradicts a document?",
          "a": "note the contradiction and use it to evaluate the document's reliability",
          "alts": [
            "note contradiction evaluate reliability"
          ]
        }
      ]
    },
    "research-questions": {
      "questions": [
        {
          "q": "What makes a good research question?",
          "a": "it is specific enough to research but broad enough for meaningful investigation",
          "alts": [
            "specific but broad enough"
          ]
        },
        {
          "q": "How do you narrow a broad topic into a research question?",
          "a": "focus on a specific time, place, group of people, or aspect of the topic",
          "alts": [
            "focus on specific aspect"
          ]
        },
        {
          "q": "\"What happened in World War II?\" — is this a good research question?",
          "a": "no — it is too broad; focus on a specific aspect",
          "alts": [
            "no too broad"
          ]
        },
        {
          "q": "What are the characteristics of a researchable question?",
          "a": "it can be answered with available evidence and is neither too broad nor too narrow",
          "alts": [
            "answerable not too broad not too narrow"
          ]
        },
        {
          "q": "How do supporting questions help with research?",
          "a": "they break the main question into smaller, manageable parts",
          "alts": [
            "break into smaller parts"
          ]
        },
        {
          "q": "Should your research question change as you learn more?",
          "a": "yes — refining your question as you research is normal and productive",
          "alts": [
            "yes refining is normal"
          ]
        }
      ]
    },
    "source-evaluation": {
      "questions": [
        {
          "q": "What criteria should you use to evaluate a source?",
          "a": "authority, accuracy, purpose, currency, and relevance",
          "alts": [
            "authority accuracy purpose currency relevance"
          ]
        },
        {
          "q": "How do you evaluate an online source?",
          "a": "check the author, domain, date, evidence, and what other sources say about it",
          "alts": [
            "author domain date evidence"
          ]
        },
        {
          "q": "Why is a .edu or .gov domain generally more reliable?",
          "a": "they are associated with educational institutions or government agencies that have credibility standards",
          "alts": [
            "credibility standards"
          ]
        },
        {
          "q": "What is the CRAAP test?",
          "a": "Currency, Relevance, Authority, Accuracy, Purpose — criteria for evaluating sources",
          "alts": [
            "currency relevance authority accuracy purpose"
          ]
        },
        {
          "q": "Can a primary source be unreliable?",
          "a": "yes — primary sources can contain errors, bias, or limited perspective",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "How does the purpose of a source affect its reliability?",
          "a": "sources created to persuade may be less objective than those created to inform",
          "alts": [
            "persuasion less objective"
          ]
        }
      ]
    },
    "lateral-reading": {
      "questions": [
        {
          "q": "What is lateral reading?",
          "a": "checking what other sources say about a website or claim rather than just reading the site itself",
          "alts": [
            "checking outside sources"
          ]
        },
        {
          "q": "Why do historians use lateral reading?",
          "a": "to verify claims and evaluate source credibility through independent confirmation",
          "alts": [
            "verify and evaluate"
          ]
        },
        {
          "q": "How is lateral reading applied to historical sources?",
          "a": "compare what multiple sources say about the same event or person",
          "alts": [
            "compare multiple sources"
          ]
        },
        {
          "q": "What should you search for when reading laterally about a website?",
          "a": "the organization, author, funding, and what experts say about its reliability",
          "alts": [
            "organization author funding experts"
          ]
        },
        {
          "q": "Can lateral reading help with historical research?",
          "a": "yes — comparing what different scholars say about a source or event",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "What is the first step in lateral reading?",
          "a": "leave the website and search for independent information about it",
          "alts": [
            "leave and search independently"
          ]
        }
      ]
    },
    "counterarguments": {
      "questions": [
        {
          "q": "What is a counterargument?",
          "a": "an argument that opposes your thesis or claim",
          "alts": [
            "opposing argument"
          ]
        },
        {
          "q": "Why should you address counterarguments in your essay?",
          "a": "it strengthens your argument by showing you have considered other perspectives",
          "alts": [
            "strengthens argument"
          ]
        },
        {
          "q": "How do you address a counterargument?",
          "a": "acknowledge it, then explain why your evidence and reasoning are stronger",
          "alts": [
            "acknowledge then refute"
          ]
        },
        {
          "q": "Where should counterarguments appear in a DBQ?",
          "a": "in a body paragraph or in the conclusion, before your final restatement",
          "alts": [
            "body or conclusion"
          ]
        },
        {
          "q": "Is ignoring counterarguments a good strategy?",
          "a": "no — it makes your argument appear weaker and less informed",
          "alts": [
            "no"
          ]
        },
        {
          "q": "What transition words introduce counterarguments?",
          "a": "however, on the other hand, some argue that, opponents claim",
          "alts": [
            "however on the other hand"
          ]
        }
      ]
    },
    "taking-informed-action": {
      "questions": [
        {
          "q": "What does \"taking informed action\" mean in the C3 Framework?",
          "a": "using what you learned from inquiry to participate in civic life",
          "alts": [
            "using inquiry for civic action"
          ]
        },
        {
          "q": "How can historical inquiry lead to action?",
          "a": "understanding past issues helps you address similar current issues",
          "alts": [
            "past helps address present"
          ]
        },
        {
          "q": "Name three forms of informed action.",
          "a": "writing to officials, community service, creating awareness campaigns, voting, and peaceful protest",
          "alts": [
            "writing service campaigns"
          ]
        },
        {
          "q": "What is the connection between inquiry and democracy?",
          "a": "informed citizens who can analyze evidence make better democratic decisions",
          "alts": [
            "informed citizens better decisions"
          ]
        },
        {
          "q": "Should taking action always mean protest?",
          "a": "no — it can include dialogue, community building, volunteering, or creating art",
          "alts": [
            "no many forms"
          ]
        },
        {
          "q": "How is informed action different from uninformed action?",
          "a": "informed action is based on evidence and multiple perspectives; uninformed is based on assumptions",
          "alts": [
            "evidence vs assumptions"
          ]
        }
      ]
    },
    "academic-discussion": {
      "questions": [
        {
          "q": "What is a Socratic seminar?",
          "a": "a structured academic discussion where participants ask and answer questions about a text",
          "alts": [
            "structured discussion about text"
          ]
        },
        {
          "q": "How is academic discussion different from debate?",
          "a": "discussion aims for understanding; debate aims for winning",
          "alts": [
            "understanding vs winning"
          ]
        },
        {
          "q": "What should you do when you disagree with someone in a discussion?",
          "a": "respectfully challenge their reasoning using evidence, not personal attacks",
          "alts": [
            "challenge with evidence respectfully"
          ]
        },
        {
          "q": "Why is listening important in academic discussion?",
          "a": "to understand others' perspectives and build on their ideas",
          "alts": [
            "understand and build on ideas"
          ]
        },
        {
          "q": "What are good discussion sentence starters?",
          "a": "\"I agree because...\", \"I see it differently because...\", \"Building on what you said...\"",
          "alts": [
            "i agree i disagree building on"
          ]
        },
        {
          "q": "How does discussion help you learn?",
          "a": "hearing different perspectives challenges your thinking and deepens understanding",
          "alts": [
            "different perspectives deepen understanding"
          ]
        }
      ]
    }
  }
};

const SCENARIOS = {
  "grade-6": [
    {
      "title": "The Mystery Artifact",
      "focus": "sourcing and observation",
      "text": "You find an old letter, a photograph, and a newspaper clipping about the same event from 1920. Each tells a slightly different story. How do you determine what really happened? What questions do you ask about each source? How do you use all three together to build an understanding?"
    },
    {
      "title": "The Compelling Question",
      "focus": "asking questions",
      "text": "Your class is studying ancient civilizations. Create a compelling question that could drive a week-long investigation. Then write 3 supporting questions. Explain what types of sources would help answer each supporting question."
    }
  ],
  "grade-7": [
    {
      "title": "The DBQ Challenge",
      "focus": "contextualization and evidence",
      "text": "You are given three documents about life during the Industrial Revolution: a factory owner's letter boasting about profits, a worker's diary describing 14-hour days, and a government inspector's report on child labor. Write a thesis answering: \"Did the Industrial Revolution improve life for most people?\" Use evidence from all three documents."
    },
    {
      "title": "The Source Showdown",
      "focus": "corroboration and contradiction",
      "text": "Two textbooks describe the same historical event differently. Textbook A says it was a popular revolution. Textbook B says it was led by elites. How do you determine which is more accurate? What additional sources would you seek? How do you handle the contradiction in your writing?"
    }
  ],
  "grade-8": [
    {
      "title": "The Full DBQ",
      "focus": "essay writing with documents",
      "text": "Compelling Question: \"Should nations intervene in other countries' affairs to protect human rights?\" You have 5 documents: a UN charter excerpt, a refugee's testimony, a sovereignty argument from a political scientist, economic data on intervention costs, and a news article about a humanitarian crisis. Write a complete DBQ essay with thesis, document analysis, outside knowledge, and a counterargument."
    },
    {
      "title": "The Research Project",
      "focus": "research and informed action",
      "text": "Choose a current issue in your community that connects to something you studied in history. Develop a research question. Find at least 3 credible sources (evaluate each). Write a brief argument using evidence. Then propose an informed action you could take. Connect your action to the historical lesson."
    }
  ]
};

// File I/O

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }

function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) {
    try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
    catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); }
  }
  return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}

function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0;
}

function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

function generateExercise(grade, skill, count = 5) {
  const bank = CONTENT_BANKS[grade]?.[skill];
  if (!bank || !bank.questions) return { error: `No content bank for ${grade}/${skill}` };
  const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: q.a, acceptedAnswers: q.alts || [] }));
  return { type: 'short-answer', skill, grade, count: items.length, instruction: 'Answer each inquiry and evidence question.', items };
}

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

class MSSocialStudiesInquiry {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  setGrade(id, grade) {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id); p.grade = grade; saveProfile(p);
    return { studentId: id, grade };
  }

  recordAssessment(id, grade, category, skill, score, total, notes = '') {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}`);
    if (!SKILLS[grade][category]) throw new Error(`Unknown category '${category}' for ${grade}`);
    if (!SKILLS[grade][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${grade}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id);
    if (!p.grade) p.grade = grade;
    const entry = { date: new Date().toISOString(), grade, category, skill, score, total, notes };
    p.assessments.push(entry);
    const key = `${grade}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const gs = SKILLS[grade] || {};
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) {
      results[cat] = {};
      for (const sk of skills) {
        total++;
        const d = p.skills[`${grade}/${cat}/${sk}`];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    return { studentId: id, grade, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[grade] || {})) {
      for (const sk of skills) {
        const d = p.skills[`${grade}/${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ grade, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, grade, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog(grade) {
    const gs = SKILLS[grade];
    if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; }
    return { grade, skills: catalog, totalSkills: total };
  }

  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }

  checkAnswer(type, expected, answer) {
    let exp = expected;
    if (typeof exp === 'string') {
      const bank = Object.values(CONTENT_BANKS).flatMap(g => Object.values(g)).find(b => b.questions?.some(q => q.a === exp));
      if (bank) { const q = bank.questions.find(q => q.a === exp); if (q && q.alts) exp = [exp, ...q.alts]; }
    }
    return { correct: checkAnswer(type, exp, answer), expected, studentAnswer: answer };
  }

  getScenario(grade) {
    const scenarios = SCENARIOS[grade];
    if (!scenarios) return { error: `No scenarios for ${grade}. Available: ${Object.keys(SCENARIOS).join(', ')}` };
    return pick(scenarios, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const scenario = SCENARIOS[grade] ? pick(SCENARIOS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, scenario,
      lessonPlan: {
        hook: `Document-based scenario related to: ${target.category} - ${target.skill}`,
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: scenario ? `Analyze scenario: "${scenario.title}"` : 'Practice with a primary source document',
        connect: 'Link to history, geography, civics, and economics',
      },
    };
  }
}

module.exports = MSSocialStudiesInquiry;

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new MSSocialStudiesInquiry();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id, grade] = args; if (!id) throw new Error('Usage: start <id> [grade]'); if (grade) api.setGrade(id, grade); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const grade = loadProfile(id).grade || 'grade-6'; if (skill) { out(api.generateExercise(grade, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(api.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, grade, cat, skill, sc, tot, ...notes] = args; if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]'); out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      case 'scenario': { const [, g] = args; if (!g) throw new Error('Usage: scenario <grade>'); out(api.getScenario(g)); break; }
      default: out({ usage: 'node inquiry.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','scenario'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
