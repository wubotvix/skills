// MS Social Studies Current Events & Media Literacy Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-socialstudies-current-events');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  "grade-6": {
    "news-basics": [
      "fact-vs-opinion",
      "five-ws",
      "source-types",
      "primary-vs-secondary-news"
    ],
    "media-literacy-intro": [
      "five-key-questions",
      "author-purpose",
      "target-audience",
      "basic-bias"
    ]
  },
  "grade-7": {
    "critical-analysis": [
      "sift-method",
      "lateral-reading",
      "propaganda-techniques",
      "emotional-appeals"
    ],
    "bias-analysis": [
      "identifying-bias",
      "media-framing",
      "two-source-comparison",
      "news-vs-opinion"
    ]
  },
  "grade-8": {
    "informed-opinion": [
      "forming-evidence-based-opinions",
      "perspective-taking",
      "historical-parallels",
      "civic-action"
    ],
    "media-production": [
      "media-construction",
      "digital-citizenship",
      "misinformation-detection",
      "fact-checking"
    ]
  }
};

const CONTENT_BANKS = {
  "grade-6": {
    "fact-vs-opinion": {
      "questions": [
        {
          "q": "\"The Earth revolves around the Sun.\" Fact or opinion?",
          "a": "fact",
          "alts": [
            "fact"
          ]
        },
        {
          "q": "\"Pizza is the best food.\" Fact or opinion?",
          "a": "opinion",
          "alts": [
            "opinion"
          ]
        },
        {
          "q": "How can you tell a fact from an opinion?",
          "a": "a fact can be verified with evidence; an opinion is a personal belief or judgment",
          "alts": [
            "facts are provable"
          ]
        },
        {
          "q": "\"The movie made $200 million.\" Fact or opinion?",
          "a": "fact",
          "alts": [
            "fact"
          ]
        },
        {
          "q": "\"The movie was amazing.\" Fact or opinion?",
          "a": "opinion",
          "alts": [
            "opinion"
          ]
        },
        {
          "q": "Can a fact and opinion appear in the same sentence?",
          "a": "yes",
          "alts": [
            "yes"
          ]
        }
      ]
    },
    "five-ws": {
      "questions": [
        {
          "q": "What are the Five Ws of journalism?",
          "a": "who, what, when, where, why",
          "alts": [
            "who what when where why"
          ]
        },
        {
          "q": "Why are the Five Ws important?",
          "a": "they ensure a news story covers the essential information",
          "alts": [
            "they cover key details"
          ]
        },
        {
          "q": "A news story says \"A fire broke out.\" What W is missing?",
          "a": "where, when, and why",
          "alts": [
            "where"
          ]
        },
        {
          "q": "Which W asks about the cause of an event?",
          "a": "why",
          "alts": [
            "why"
          ]
        },
        {
          "q": "Which W identifies the people involved?",
          "a": "who",
          "alts": [
            "who"
          ]
        },
        {
          "q": "Some add a sixth question: How. Why is this useful?",
          "a": "it explains the process or method behind the event",
          "alts": [
            "explains how it happened"
          ]
        }
      ]
    },
    "source-types": {
      "questions": [
        {
          "q": "Name three types of news sources.",
          "a": "newspapers, TV news, and online news sites",
          "alts": [
            "print broadcast digital"
          ]
        },
        {
          "q": "What is the difference between a news article and an editorial?",
          "a": "a news article reports facts; an editorial gives opinions",
          "alts": [
            "news is facts editorial is opinion"
          ]
        },
        {
          "q": "Is social media a reliable news source?",
          "a": "not always — it needs fact-checking because anyone can post",
          "alts": [
            "not always",
            "sometimes"
          ]
        },
        {
          "q": "What is a wire service like AP or Reuters?",
          "a": "an organization that gathers news and distributes it to other media outlets",
          "alts": [
            "news gathering agency"
          ]
        },
        {
          "q": "Why should you check multiple sources?",
          "a": "to get a more complete and accurate picture of events",
          "alts": [
            "for accuracy"
          ]
        },
        {
          "q": "What is the difference between a reporter and a commentator?",
          "a": "a reporter presents facts; a commentator gives analysis and opinions",
          "alts": [
            "reporter does facts commentator does opinion"
          ]
        }
      ]
    },
    "primary-vs-secondary-news": {
      "questions": [
        {
          "q": "A video of an event happening is what type of source?",
          "a": "primary",
          "alts": [
            "primary source"
          ]
        },
        {
          "q": "A news article summarizing a speech is what type of source?",
          "a": "secondary",
          "alts": [
            "secondary source"
          ]
        },
        {
          "q": "Is a government press release primary or secondary?",
          "a": "primary",
          "alts": [
            "primary source"
          ]
        },
        {
          "q": "Is a Wikipedia article primary or secondary?",
          "a": "secondary",
          "alts": [
            "secondary"
          ]
        },
        {
          "q": "Why are primary sources valuable in news?",
          "a": "they provide direct evidence without interpretation",
          "alts": [
            "direct evidence"
          ]
        },
        {
          "q": "Can the same event have both primary and secondary sources?",
          "a": "yes — the event itself produces primary sources, then reporters create secondary accounts",
          "alts": [
            "yes"
          ]
        }
      ]
    },
    "five-key-questions": {
      "questions": [
        {
          "q": "What are the Five Key Questions of media literacy?",
          "a": "Who created this? What techniques grab attention? How might people interpret this differently? What values/lifestyles are represented? Why was this made?",
          "alts": [
            "who created it what techniques different interpretations values why made"
          ]
        },
        {
          "q": "Why ask \"Who created this message?\"",
          "a": "to understand the source and possible biases or motivations",
          "alts": [
            "to find bias"
          ]
        },
        {
          "q": "Why ask \"Why was this message sent?\"",
          "a": "to understand the purpose — inform, persuade, entertain, or sell",
          "alts": [
            "to understand purpose"
          ]
        },
        {
          "q": "What does \"target audience\" mean?",
          "a": "the specific group of people the message is designed to reach",
          "alts": [
            "intended viewers"
          ]
        },
        {
          "q": "How might two people interpret the same news story differently?",
          "a": "based on their background, experiences, values, and prior knowledge",
          "alts": [
            "different perspectives"
          ]
        },
        {
          "q": "What techniques do media use to grab attention?",
          "a": "headlines, images, emotional language, celebrities, music, and color",
          "alts": [
            "headlines images emotional language"
          ]
        }
      ]
    },
    "author-purpose": {
      "questions": [
        {
          "q": "What are the main purposes of media?",
          "a": "to inform, persuade, entertain, or sell",
          "alts": [
            "inform persuade entertain"
          ]
        },
        {
          "q": "A news article about a hurricane aims to ___?",
          "a": "inform",
          "alts": [
            "inform"
          ]
        },
        {
          "q": "A commercial for sneakers aims to ___?",
          "a": "sell or persuade",
          "alts": [
            "sell",
            "persuade"
          ]
        },
        {
          "q": "Can a single piece of media have multiple purposes?",
          "a": "yes — an ad might entertain while also trying to sell",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "How does knowing the purpose help you evaluate media?",
          "a": "it helps you understand why certain information is included or excluded",
          "alts": [
            "understand what is included"
          ]
        },
        {
          "q": "A political speech aims to ___?",
          "a": "persuade",
          "alts": [
            "persuade",
            "convince"
          ]
        }
      ]
    },
    "target-audience": {
      "questions": [
        {
          "q": "How can you figure out who a media message is targeting?",
          "a": "look at the language, images, platform, and topics — they reveal the intended audience",
          "alts": [
            "language images platform"
          ]
        },
        {
          "q": "A colorful ad with cartoon characters targets what audience?",
          "a": "children",
          "alts": [
            "kids",
            "young children"
          ]
        },
        {
          "q": "Why does the target audience matter?",
          "a": "creators shape messages to appeal to specific groups, which can affect what information is presented",
          "alts": [
            "affects how message is shaped"
          ]
        },
        {
          "q": "A financial news show primarily targets what audience?",
          "a": "investors and business professionals",
          "alts": [
            "adults",
            "investors"
          ]
        },
        {
          "q": "Can you be part of a target audience without realizing it?",
          "a": "yes — media targeting is often subtle",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "How does social media target audiences?",
          "a": "through algorithms that show content based on your interests and behavior",
          "alts": [
            "algorithms"
          ]
        }
      ]
    },
    "basic-bias": {
      "questions": [
        {
          "q": "What is media bias?",
          "a": "when a news source presents information in a way that favors one side or perspective",
          "alts": [
            "one-sided reporting",
            "favoring one perspective"
          ]
        },
        {
          "q": "Can all media be completely unbiased?",
          "a": "no — all creators make choices about what to include, which introduces some bias",
          "alts": [
            "no"
          ]
        },
        {
          "q": "What is bias by omission?",
          "a": "leaving out information that would give a different perspective",
          "alts": [
            "leaving out information"
          ]
        },
        {
          "q": "What is bias by selection of sources?",
          "a": "only quoting people who agree with one viewpoint",
          "alts": [
            "only using one side"
          ]
        },
        {
          "q": "How can headlines show bias?",
          "a": "by using loaded language, emphasizing certain details, or being misleading",
          "alts": [
            "loaded language"
          ]
        },
        {
          "q": "What can you do about media bias?",
          "a": "read multiple sources, look for evidence, and think critically about what is included and excluded",
          "alts": [
            "read multiple sources"
          ]
        }
      ]
    }
  },
  "grade-7": {
    "sift-method": {
      "questions": [
        {
          "q": "What does SIFT stand for?",
          "a": "Stop, Investigate the source, Find better coverage, Trace claims",
          "alts": [
            "stop investigate find trace"
          ]
        },
        {
          "q": "Why should you \"Stop\" before sharing a post?",
          "a": "to avoid spreading misinformation before verifying the content",
          "alts": [
            "to check if its true"
          ]
        },
        {
          "q": "What does \"Investigate the source\" mean?",
          "a": "look into who created the content and whether they are credible",
          "alts": [
            "check who made it"
          ]
        },
        {
          "q": "What does \"Find better coverage\" mean?",
          "a": "look for the same story from more reliable or established news sources",
          "alts": [
            "check other sources"
          ]
        },
        {
          "q": "What does \"Trace claims\" mean?",
          "a": "follow the claim back to its original source to verify accuracy",
          "alts": [
            "find the original source"
          ]
        },
        {
          "q": "When should you use SIFT?",
          "a": "whenever you encounter news or information online that you are unsure about",
          "alts": [
            "when unsure about online info"
          ]
        }
      ]
    },
    "lateral-reading": {
      "questions": [
        {
          "q": "What is lateral reading?",
          "a": "checking what other sources say about a website or claim instead of just reading the site itself",
          "alts": [
            "checking other sources about a site"
          ]
        },
        {
          "q": "How is lateral reading different from vertical reading?",
          "a": "vertical reading goes deeper into one site; lateral reading checks outside sources",
          "alts": [
            "checking outside vs inside"
          ]
        },
        {
          "q": "Professional fact-checkers primarily use what reading strategy?",
          "a": "lateral reading",
          "alts": [
            "lateral"
          ]
        },
        {
          "q": "You find a health claim on an unknown website. What should you do first?",
          "a": "open new tabs and search for what others say about that site and claim",
          "alts": [
            "check other sources"
          ]
        },
        {
          "q": "Why is lateral reading more effective than just reading a website carefully?",
          "a": "a biased site may look professional and convincing from the inside",
          "alts": [
            "site may look credible but not be"
          ]
        },
        {
          "q": "What sources should you check when reading laterally?",
          "a": "established news outlets, fact-checking sites, and expert organizations",
          "alts": [
            "fact checkers news experts"
          ]
        }
      ]
    },
    "propaganda-techniques": {
      "questions": [
        {
          "q": "What is propaganda?",
          "a": "information used to promote a particular viewpoint, often using emotional or misleading techniques",
          "alts": [
            "biased information to promote a viewpoint"
          ]
        },
        {
          "q": "What is the bandwagon technique?",
          "a": "suggesting everyone is doing something so you should too",
          "alts": [
            "everyone is doing it"
          ]
        },
        {
          "q": "What is name-calling in propaganda?",
          "a": "using negative labels to create a bad image of something without evidence",
          "alts": [
            "using negative labels"
          ]
        },
        {
          "q": "What is a testimonial?",
          "a": "using a famous or respected person to endorse an idea or product",
          "alts": [
            "celebrity endorsement"
          ]
        },
        {
          "q": "What is card stacking?",
          "a": "only presenting information that supports one side while hiding opposing evidence",
          "alts": [
            "showing only one side"
          ]
        },
        {
          "q": "How can you defend yourself against propaganda?",
          "a": "recognize the technique, seek additional information, and think critically",
          "alts": [
            "recognize techniques think critically"
          ]
        }
      ]
    },
    "emotional-appeals": {
      "questions": [
        {
          "q": "What is an emotional appeal?",
          "a": "using feelings rather than facts to persuade an audience",
          "alts": [
            "using feelings to persuade"
          ]
        },
        {
          "q": "A charity ad shows a sad, hungry child. What emotion does this appeal to?",
          "a": "sympathy or compassion",
          "alts": [
            "sympathy",
            "compassion",
            "pity"
          ]
        },
        {
          "q": "Fear appeals are used in what types of messages?",
          "a": "political ads, health warnings, and security product marketing",
          "alts": [
            "political ads",
            "health warnings"
          ]
        },
        {
          "q": "Is using emotional appeals always wrong?",
          "a": "no — but emotion should complement, not replace, evidence and logic",
          "alts": [
            "no"
          ]
        },
        {
          "q": "How can you identify an emotional appeal?",
          "a": "notice strong feelings, dramatic images or music, and a lack of factual evidence",
          "alts": [
            "strong feelings no facts"
          ]
        },
        {
          "q": "What is the difference between pathos and logos?",
          "a": "pathos appeals to emotions; logos appeals to logic and evidence",
          "alts": [
            "emotion vs logic"
          ]
        }
      ]
    },
    "identifying-bias": {
      "questions": [
        {
          "q": "How can you identify political bias in a news article?",
          "a": "check what stories they cover, what language they use, and what perspectives they include or exclude",
          "alts": [
            "story selection language perspective"
          ]
        },
        {
          "q": "What is confirmation bias?",
          "a": "the tendency to seek out information that confirms what you already believe",
          "alts": [
            "seeking info that confirms beliefs"
          ]
        },
        {
          "q": "A news channel only interviews one political party. What type of bias is this?",
          "a": "selection bias or bias by source selection",
          "alts": [
            "selection bias"
          ]
        },
        {
          "q": "Why is it hard to recognize your own biases?",
          "a": "biases are often unconscious and feel like common sense",
          "alts": [
            "unconscious"
          ]
        },
        {
          "q": "How does social media create \"filter bubbles\"?",
          "a": "algorithms show you content similar to what you already engage with, limiting diverse viewpoints",
          "alts": [
            "algorithms limit viewpoints"
          ]
        },
        {
          "q": "What is the best way to counter your own confirmation bias?",
          "a": "deliberately seek out credible sources that present different viewpoints",
          "alts": [
            "seek different viewpoints"
          ]
        }
      ]
    },
    "media-framing": {
      "questions": [
        {
          "q": "What is media framing?",
          "a": "the way a story is presented — what is emphasized, what angle is used, and what context is provided",
          "alts": [
            "how story is presented"
          ]
        },
        {
          "q": "The same protest can be framed as \"peaceful demonstration\" or \"angry mob.\" How does framing affect perception?",
          "a": "different word choices create very different impressions of the same event",
          "alts": [
            "word choice affects perception"
          ]
        },
        {
          "q": "How does photo selection frame a story?",
          "a": "the chosen photo emphasizes certain aspects and emotions over others",
          "alts": [
            "photos emphasize certain aspects"
          ]
        },
        {
          "q": "What is a \"spin\"?",
          "a": "putting a favorable or unfavorable interpretation on events to influence opinion",
          "alts": [
            "favorable interpretation"
          ]
        },
        {
          "q": "How can headlines frame a story?",
          "a": "by emphasizing certain details, using loaded words, or implying a particular interpretation",
          "alts": [
            "emphasis and word choice"
          ]
        },
        {
          "q": "How do you detect framing?",
          "a": "compare how different outlets cover the same story and notice what each emphasizes",
          "alts": [
            "compare different outlets"
          ]
        }
      ]
    },
    "two-source-comparison": {
      "questions": [
        {
          "q": "Why should you compare at least two sources on the same story?",
          "a": "to get a more complete picture and identify any bias in either source",
          "alts": [
            "more complete picture"
          ]
        },
        {
          "q": "What should you look for when comparing two articles on the same event?",
          "a": "what facts are the same, what is different, what each leaves out, and what tone each uses",
          "alts": [
            "same facts different facts omissions tone"
          ]
        },
        {
          "q": "If two sources disagree on facts, what should you do?",
          "a": "find a third source, check primary sources, and evaluate which has stronger evidence",
          "alts": [
            "find more sources"
          ]
        },
        {
          "q": "Two articles agree on facts but draw different conclusions. Why might this happen?",
          "a": "they may have different perspectives, values, or interpret the significance differently",
          "alts": [
            "different perspectives"
          ]
        },
        {
          "q": "Is it enough to compare sources that are similar?",
          "a": "no — compare sources from different viewpoints for a balanced understanding",
          "alts": [
            "no need different viewpoints"
          ]
        },
        {
          "q": "What is corroboration?",
          "a": "confirming information by finding it in multiple independent sources",
          "alts": [
            "confirming with multiple sources"
          ]
        }
      ]
    },
    "news-vs-opinion": {
      "questions": [
        {
          "q": "How can you tell if an article is news or opinion?",
          "a": "check the section label, look for first-person language, and see if it argues for a position",
          "alts": [
            "section label personal language argues position"
          ]
        },
        {
          "q": "Where are opinion pieces typically labeled in a newspaper?",
          "a": "in the editorial, opinion, or op-ed section",
          "alts": [
            "editorial section"
          ]
        },
        {
          "q": "Can opinion pieces contain facts?",
          "a": "yes — good opinion pieces use facts to support their argument",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "Should opinion pieces be held to the same accuracy standards as news?",
          "a": "the facts within them should be accurate, even though the conclusions are opinions",
          "alts": [
            "facts should be accurate"
          ]
        },
        {
          "q": "What is an op-ed?",
          "a": "an opinion piece written by someone outside the newspaper staff",
          "alts": [
            "outside opinion piece"
          ]
        },
        {
          "q": "Why is it important to distinguish news from opinion?",
          "a": "so you know when you are being informed versus when someone is trying to persuade you",
          "alts": [
            "know inform vs persuade"
          ]
        }
      ]
    }
  },
  "grade-8": {
    "forming-evidence-based-opinions": {
      "questions": [
        {
          "q": "What makes an opinion \"informed\"?",
          "a": "it is based on evidence from credible sources and considers multiple perspectives",
          "alts": [
            "evidence and multiple perspectives"
          ]
        },
        {
          "q": "What is the difference between an uninformed and informed opinion?",
          "a": "an uninformed opinion is based on feelings or limited information; an informed one is based on evidence",
          "alts": [
            "feelings vs evidence"
          ]
        },
        {
          "q": "What steps help form an evidence-based opinion?",
          "a": "research the topic, evaluate sources, consider different viewpoints, then form your position",
          "alts": [
            "research evaluate consider form"
          ]
        },
        {
          "q": "Can your opinion change when you get new evidence?",
          "a": "yes — changing your mind based on evidence is a sign of critical thinking",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "Why should you consider opposing viewpoints?",
          "a": "to test the strength of your position and ensure you have not overlooked important arguments",
          "alts": [
            "test your position"
          ]
        },
        {
          "q": "How is an evidence-based opinion different from a fact?",
          "a": "it is still a judgment call, but it is grounded in and supported by factual evidence",
          "alts": [
            "still judgment but grounded in facts"
          ]
        }
      ]
    },
    "perspective-taking": {
      "questions": [
        {
          "q": "What is perspective-taking?",
          "a": "considering an issue from the viewpoint of someone with different experiences or beliefs",
          "alts": [
            "seeing from different viewpoints"
          ]
        },
        {
          "q": "Why is perspective-taking important for understanding current events?",
          "a": "it helps you understand why people disagree and leads to more complete understanding",
          "alts": [
            "understand disagreements"
          ]
        },
        {
          "q": "How might a factory worker and an environmentalist view a factory closing differently?",
          "a": "the worker loses income; the environmentalist may see reduced pollution — both perspectives are valid",
          "alts": [
            "worker loses job environmentalist sees benefit"
          ]
        },
        {
          "q": "What is empathy?",
          "a": "the ability to understand and share the feelings of another person",
          "alts": [
            "understanding others feelings"
          ]
        },
        {
          "q": "Can you take someone else's perspective without agreeing with them?",
          "a": "yes — understanding does not require agreement",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "How does perspective-taking reduce stereotyping?",
          "a": "it reveals the complexity of people's experiences and prevents oversimplification",
          "alts": [
            "reveals complexity"
          ]
        }
      ]
    },
    "historical-parallels": {
      "questions": [
        {
          "q": "What is a historical parallel?",
          "a": "a comparison between a current event and a similar event from the past",
          "alts": [
            "comparing current and past events"
          ]
        },
        {
          "q": "Why do people use historical parallels?",
          "a": "to learn from the past and better understand current situations",
          "alts": [
            "learn from the past"
          ]
        },
        {
          "q": "What are the dangers of historical parallels?",
          "a": "no two situations are exactly alike, so comparisons can be misleading",
          "alts": [
            "situations are never exactly the same"
          ]
        },
        {
          "q": "How is comparing current immigration debates to Ellis Island helpful?",
          "a": "it shows similar themes of fear, opportunity, and cultural change across eras",
          "alts": [
            "shows similar themes"
          ]
        },
        {
          "q": "What should you check before accepting a historical parallel?",
          "a": "whether the similarities are significant and the differences are not being overlooked",
          "alts": [
            "check similarities and differences"
          ]
        },
        {
          "q": "Can history predict the future?",
          "a": "not exactly, but it can reveal patterns and help us make more informed decisions",
          "alts": [
            "not exactly but reveals patterns"
          ]
        }
      ]
    },
    "civic-action": {
      "questions": [
        {
          "q": "What is civic engagement?",
          "a": "actively participating in improving your community and democracy",
          "alts": [
            "participating in community and democracy"
          ]
        },
        {
          "q": "Name three forms of civic action.",
          "a": "voting, volunteering, contacting elected officials, attending town halls, peaceful protest",
          "alts": [
            "voting volunteering protest"
          ]
        },
        {
          "q": "How can understanding current events lead to civic action?",
          "a": "awareness of issues motivates people to get involved and work for change",
          "alts": [
            "awareness motivates action"
          ]
        },
        {
          "q": "Can young people be civically engaged even before they can vote?",
          "a": "yes — through volunteering, advocacy, contacting officials, and raising awareness",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "What is the relationship between media literacy and civic engagement?",
          "a": "informed citizens need media literacy to understand issues and make good decisions",
          "alts": [
            "media literacy helps informed decisions"
          ]
        },
        {
          "q": "What is a call to action?",
          "a": "a message encouraging the audience to do something specific",
          "alts": [
            "encouraging audience to act"
          ]
        }
      ]
    },
    "media-construction": {
      "questions": [
        {
          "q": "What does it mean that all media is \"constructed\"?",
          "a": "someone made choices about what to include, exclude, and how to present it",
          "alts": [
            "someone made choices"
          ]
        },
        {
          "q": "What choices do media producers make?",
          "a": "what to cover, what angle, what images, what quotes, and what to leave out",
          "alts": [
            "coverage angle images quotes"
          ]
        },
        {
          "q": "How does editing change a story?",
          "a": "it can emphasize certain parts, create pacing, and remove context",
          "alts": [
            "emphasize parts remove context"
          ]
        },
        {
          "q": "Why do media companies choose some stories over others?",
          "a": "based on audience interest, ratings, relevance, and sometimes advertiser influence",
          "alts": [
            "audience interest ratings"
          ]
        },
        {
          "q": "What is the \"attention economy\"?",
          "a": "media companies compete for audience attention as a valuable resource",
          "alts": [
            "competing for attention"
          ]
        },
        {
          "q": "How does understanding media construction help you be a better consumer?",
          "a": "you can analyze why a message was made and what it is trying to accomplish",
          "alts": [
            "analyze purpose"
          ]
        }
      ]
    },
    "digital-citizenship": {
      "questions": [
        {
          "q": "What is digital citizenship?",
          "a": "responsible and ethical use of technology and digital media",
          "alts": [
            "responsible tech use"
          ]
        },
        {
          "q": "Why should you think before sharing something online?",
          "a": "to avoid spreading misinformation and to protect your reputation and others' privacy",
          "alts": [
            "avoid misinformation protect reputation"
          ]
        },
        {
          "q": "What is a digital footprint?",
          "a": "the trail of data you leave behind when using the internet",
          "alts": [
            "online data trail"
          ]
        },
        {
          "q": "How can sharing misinformation cause real-world harm?",
          "a": "it can incite panic, damage reputations, influence elections, and undermine trust",
          "alts": [
            "panic damage influence"
          ]
        },
        {
          "q": "What responsibility do you have when commenting online?",
          "a": "to be respectful, honest, and constructive — the same as in person",
          "alts": [
            "be respectful honest"
          ]
        },
        {
          "q": "What is cyberbullying?",
          "a": "using digital platforms to harass, threaten, or intimidate others",
          "alts": [
            "online harassment"
          ]
        }
      ]
    },
    "misinformation-detection": {
      "questions": [
        {
          "q": "What is the difference between misinformation and disinformation?",
          "a": "misinformation is false info spread unintentionally; disinformation is spread deliberately to deceive",
          "alts": [
            "misinformation accidental disinformation deliberate"
          ]
        },
        {
          "q": "What are signs of a fake news article?",
          "a": "sensational headline, no author, no date, unknown source, no other outlets reporting it",
          "alts": [
            "sensational no author unknown source"
          ]
        },
        {
          "q": "What is a deepfake?",
          "a": "AI-generated video or audio that makes it appear someone said or did something they did not",
          "alts": [
            "AI fake video"
          ]
        },
        {
          "q": "Name a reliable fact-checking website.",
          "a": "Snopes, FactCheck.org, PolitiFact, or AP Fact Check",
          "alts": [
            "snopes",
            "factcheck",
            "politifact"
          ]
        },
        {
          "q": "Why does misinformation spread so fast on social media?",
          "a": "emotional content gets shared quickly, algorithms amplify engagement, and people trust their network",
          "alts": [
            "emotional content algorithms trust"
          ]
        },
        {
          "q": "What should you do if you accidentally shared misinformation?",
          "a": "delete or correct it, and let your followers know the correct information",
          "alts": [
            "delete correct inform"
          ]
        }
      ]
    },
    "fact-checking": {
      "questions": [
        {
          "q": "What are the basic steps of fact-checking?",
          "a": "identify the claim, check the original source, verify with multiple sources, evaluate the evidence",
          "alts": [
            "identify check verify evaluate"
          ]
        },
        {
          "q": "What is a primary source in fact-checking?",
          "a": "the original document, data, or firsthand account",
          "alts": [
            "original source"
          ]
        },
        {
          "q": "If a claim has no verifiable source, what should you do?",
          "a": "be skeptical and do not share it until you can verify it",
          "alts": [
            "be skeptical"
          ]
        },
        {
          "q": "How do fact-checkers rate claims?",
          "a": "on a scale from true to false, with categories like \"mostly true\" or \"misleading\"",
          "alts": [
            "true to false scale"
          ]
        },
        {
          "q": "Can images be used to spread misinformation?",
          "a": "yes — through out-of-context photos, altered images, or AI-generated fakes",
          "alts": [
            "yes"
          ]
        },
        {
          "q": "What is reverse image searching and why is it useful?",
          "a": "searching for the origin of an image to see if it has been used in a different context",
          "alts": [
            "finding original context of an image"
          ]
        }
      ]
    }
  }
};

const SCENARIOS = {
  "grade-6": [
    {
      "title": "The Viral Post",
      "focus": "fact vs opinion and source evaluation",
      "text": "A social media post with 50,000 shares claims \"Scientists say chocolate is healthier than vegetables!\" It links to a blog, not a scientific study. Using the Five Key Questions of media literacy, evaluate this post. What facts would you check? How would you verify the claim?"
    },
    {
      "title": "The School News",
      "focus": "Five Ws and news basics",
      "text": "Your school is starting a student newspaper. Write a news article about a recent school event using the Five Ws. Then write an opinion piece about the same event. How are they different?"
    }
  ],
  "grade-7": [
    {
      "title": "The Controversial Story",
      "focus": "bias and two-source comparison",
      "text": "Find or imagine two news articles about the same controversial event written from different perspectives. Compare: What facts do both include? What does each leave out? What language choices reveal bias? Which is more balanced? Why?"
    },
    {
      "title": "The Propaganda Poster",
      "focus": "propaganda techniques",
      "text": "Examine a historical propaganda poster (or modern ad). Identify at least 3 propaganda techniques used. Who created it? Who was the target audience? What was the purpose? How might people from different backgrounds react differently?"
    }
  ],
  "grade-8": [
    {
      "title": "The Misinformation Challenge",
      "focus": "fact-checking and digital citizenship",
      "text": "A friend shares a news story claiming a major event happened, but you have not seen it anywhere else. Walk through the SIFT method. How would you fact-check it? What would you say to your friend? What is your responsibility as a digital citizen?"
    },
    {
      "title": "The Town Hall Debate",
      "focus": "informed opinion and civic action",
      "text": "Your town is debating whether to build a new highway through a neighborhood. Research the issue from multiple perspectives: homeowners, commuters, business owners, and environmentalists. Form an evidence-based opinion. What civic action could you take? Write a letter to the editor."
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
  return { type: 'short-answer', skill, grade, count: items.length, instruction: 'Answer each current events and media literacy question.', items };
}

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

class MSCurrentEvents {
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
        hook: `Real-world media scenario related to: ${target.category} - ${target.skill}`,
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: scenario ? `Analyze scenario: "${scenario.title}"` : 'Analyze a current news story using media literacy skills',
        connect: 'Link to history, geography, civics, or economics',
      },
    };
  }
}

module.exports = MSCurrentEvents;

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new MSCurrentEvents();
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
      default: out({ usage: 'node current-events.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','scenario'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
