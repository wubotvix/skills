const core = require('../_lib/core');

const SKILL_NAME = 'polish-writing';

// ── Correction categories ──────────────────────────────────────────────────
const CORRECTION_CATEGORIES = [
  'case', 'gender', 'aspect', 'agreement', 'spelling',
  'word-order', 'register', 'punctuation',
];

// ── Prompts by CEFR level ──────────────────────────────────────────────────
const PROMPTS = {
  A1: [
    {
      id: 'a1-personal-1', category: 'personal', title: 'Pocztówka z wakacji',
      type: 'postcard',
      instructions: 'Napisz pocztówkę do przyjaciela z miejsca wakacyjnego. Napisz: gdzie jesteś, jaka jest pogoda, co robisz każdego dnia. (30-50 słów)',
      targetStructures: ['present tense regular verbs', 'być + location', 'pogoda expressions'],
      rubric: {
        content: 'Mentions location, weather, and daily activity',
        grammar: 'Correct present tense conjugation; basic case usage (locative for location)',
        vocabulary: 'Basic travel and weather words used appropriately',
        organization: 'Greeting, body, farewell structure',
      },
      modelResponse: 'Drogi Piotrze! Jestem w Zakopanem. Jest bardzo słonecznie i ciepło. Codziennie chodzę w góry i jem oscypki. Góry są bardzo piękne. Do zobaczenia wkrótce! Ania',
    },
    {
      id: 'a1-personal-2', category: 'personal', title: 'Moja rodzina',
      type: 'description',
      instructions: 'Opisz swoją rodzinę. Napisz: imiona, wiek, zawody i coś, co lubią robić. (40-60 słów)',
      targetStructures: ['być for descriptions', 'mieć for age', 'possessive adjectives'],
      rubric: {
        content: 'Names at least 3 family members with details',
        grammar: 'Correct use of być/mieć; gender agreement (mój/moja/moje)',
        vocabulary: 'Family terms, numbers, professions',
        organization: 'Logical grouping of family members',
      },
      modelResponse: 'Moja rodzina jest mała. Mój tata ma na imię Marek i ma 45 lat. Jest nauczycielem. Moja mama ma na imię Ewa i ma 42 lata. Jest lekarką. Moja siostra Kasia ma 12 lat. Jest uczennicą. W weekendy lubimy chodzić do parku.',
    },
    {
      id: 'a1-formal-1', category: 'formal', title: 'Rezerwacja hotelu',
      type: 'email',
      instructions: 'Napisz krótki email z rezerwacją pokoju hotelowego. Podaj: daty, typ pokoju, liczbę osób. (30-50 słów)',
      targetStructures: ['chcieć/potrzebować + infinitive', 'numbers and dates', 'formal Pan/Pani'],
      rubric: {
        content: 'Includes dates, room type, number of guests',
        grammar: 'Correct formal register (Pan/Pani); chcę + infinitive',
        vocabulary: 'Hotel vocabulary: pokój, rezerwacja, noc',
        organization: 'Greeting, request, sign-off',
      },
      modelResponse: 'Szanowny Panie! Chciałbym zarezerwować pokój dwuosobowy dla dwóch osób od 15 do 20 czerwca. Ile kosztuje jedna noc? Dziękuję za informację. Z poważaniem, Piotr Kowalski',
    },
    {
      id: 'a1-creative-1', category: 'creative', title: 'Mój idealny dzień',
      type: 'narrative',
      instructions: 'Opisz swój idealny dzień od rana do wieczora. Użyj wyrażeń czasowych. (40-60 słów)',
      targetStructures: ['time expressions', 'reflexive verbs', 'present tense sequence'],
      rubric: {
        content: 'Covers morning, afternoon, and evening with activities',
        grammar: 'Correct reflexive verb forms (budzę się); time expressions',
        vocabulary: 'Daily routine vocabulary',
        organization: 'Chronological order with time markers',
      },
      modelResponse: 'Rano budzę się o dziewiątej. Jem śniadanie z rodziną. O jedenastej idę na plażę. Po południu jem obiad w restauracji włoskiej. Wieczorem spaceruję po mieście i jem lody. Kładę się spać o jedenastej. To idealny dzień!',
    },
  ],
  A2: [
    {
      id: 'a2-personal-1', category: 'personal', title: 'Mój ostatni weekend',
      type: 'narrative',
      instructions: 'Opowiedz, co robiłeś/robiłaś w ostatni weekend. Podaj co najmniej 4 czynności i z kim byłeś/byłaś. (60-80 słów)',
      targetStructures: ['past tense gender-marked (robiłem/robiłam)', 'time markers: w sobotę, potem, później'],
      rubric: {
        content: 'At least 4 activities with companions mentioned',
        grammar: 'Correct past tense forms with gender marking; time connectors',
        vocabulary: 'Leisure activities, time connectors',
        organization: 'Chronological narrative with connectors',
      },
      modelResponse: 'W sobotę rano poszłam na targ z mamą i kupiłyśmy świeże owoce. Potem jadłyśmy obiad u babci. Po południu grałam w siatkówkę z koleżankami w parku. W niedzielę wstałam późno. Później uczyłam się polskiego, a wieczorem oglądałam film z bratem. To był fajny weekend.',
    },
    {
      id: 'a2-personal-2', category: 'personal', title: 'List do nowego kolegi',
      type: 'letter',
      instructions: 'Napisz list do nowego kolegi po korespondencji. Przedstaw się, opowiedz o swoich zainteresowaniach i zapytaj o jego. (70-90 słów)',
      targetStructures: ['lubić/interesować się + instrumental', 'question formation'],
      rubric: {
        content: 'Self-introduction, likes/dislikes, questions to the friend',
        grammar: 'Correct lubić + infinitive; interesować się + instrumental',
        vocabulary: 'Hobbies, interests, personality adjectives',
        organization: 'Informal letter format with greeting and questions',
      },
      modelResponse: 'Cześć Marku! Mam na imię Kasia i mam 16 lat. Mieszkam w Krakowie, pięknym mieście na południu Polski. Interesuję się muzyką i gram na gitarze. Lubię też czytać kryminały. Nie lubię sportów, są nudne! A Ty? Co lubisz robić w wolnym czasie? Interesujesz się muzyką? Czekam na odpowiedź. Pozdrawiam, Kasia',
    },
    {
      id: 'a2-formal-1', category: 'formal', title: 'Reklamacja produktu',
      type: 'email',
      instructions: 'Napisz email z reklamacją, bo kupiłeś produkt, który przyszedł uszkodzony. Wyjaśnij, co się stało i czego oczekujesz. (60-80 słów)',
      targetStructures: ['past tense for narrating events', 'conditional for polite requests (chciałbym)'],
      rubric: {
        content: 'States problem clearly, explains what happened, requests solution',
        grammar: 'Past tense narration; conditional for requests',
        vocabulary: 'Shopping and complaint vocabulary',
        organization: 'Problem statement, details, request, closing',
      },
      modelResponse: 'Szanowni Państwo! Dnia 3 marca kupiłem lampę w Państwa sklepie internetowym. Kiedy przyszła paczka, lampa była uszkodzona. Chciałbym otrzymać nową lampę lub zwrot pieniędzy. W załączeniu przesyłam zdjęcie uszkodzonego produktu. Proszę o szybką odpowiedź. Z poważaniem, Robert Nowak',
    },
    {
      id: 'a2-creative-1', category: 'creative', title: 'Historia ze słowami',
      type: 'narrative',
      instructions: 'Napisz krótką historię, w której użyjesz wszystkich tych słów: kot, deszcz, okno, czekolada, niespodzianka. (60-90 słów)',
      targetStructures: ['past tense imperfective vs perfective basic', 'descriptive adjectives', 'sequencing'],
      rubric: {
        content: 'All 5 words included in a coherent story',
        grammar: 'Appropriate use of imperfective and perfective past',
        vocabulary: 'Descriptive language, all trigger words used naturally',
        organization: 'Beginning, middle, end structure',
      },
      modelResponse: 'Był deszczowy wieczór. Mój kot siedział na oknie i patrzył na ulicę. Zrobiłam gorącą czekoladę i usiadłam czytać. Nagle kot skoczył z okna i pobiegł do drzwi. Otworzyłam drzwi i znalazłam paczkę. To była niespodzianka od mojej koleżanki! W środku była książka i ciastka. To był idealny wieczór.',
    },
  ],
  B1: [
    {
      id: 'b1-personal-1', category: 'personal', title: 'Ważna zmiana w moim życiu',
      type: 'essay',
      instructions: 'Napisz o ważnej zmianie, którą zrobiłeś/aś w swoim życiu (przeprowadzka, nowa praca, nowe hobby). Wyjaśnij dlaczego, jak się czułeś/aś i czego się nauczyłeś/aś. (100-140 słów)',
      targetStructures: ['past tense imperfective/perfective contrast', 'past emotions', 'cause/effect connectors'],
      rubric: {
        content: 'Describes change, motivation, feelings, and lesson learned',
        grammar: 'Consistent aspect distinction; correct connector usage',
        vocabulary: 'Emotions vocabulary, cause-effect language (bo, dlatego, więc)',
        organization: 'Introduction, development with timeline, reflection/conclusion',
      },
      modelResponse: 'Dwa lata temu zdecydowałem się przeprowadzić z małego miasteczka do Warszawy, żeby studiować na uniwersytecie. Na początku bardzo się bałem, bo nikogo nie znałem i wszystko było inne. Pierwsze miesiące były trudne: czułem się samotny i tęskniłem za rodziną. Jednak stopniowo poznałem kolegów na zajęciach i zacząłem cieszyć się miastem. Nauczyłem się gotować, organizować czas i być bardziej samodzielny. Teraz wiem, że to była najlepsza decyzja w moim życiu, bo pomogła mi dorosnąć. Czasem zmiany są straszne, ale są potrzebne.',
    },
    {
      id: 'b1-formal-1', category: 'formal', title: 'Podanie o pracę',
      type: 'letter',
      instructions: 'Napisz formalne podanie o pracę na stanowisko kelnera/kelnerki w restauracji. Podaj swoje doświadczenie, dostępność i dlaczego chcesz tę pracę. (100-130 słów)',
      targetStructures: ['formal register Pan/Pani', 'present perfect equivalent (aspect)', 'conditional for polite language'],
      rubric: {
        content: 'States position, relevant experience, availability, motivation',
        grammar: 'Consistent formal register; correct aspect usage for experience',
        vocabulary: 'Work vocabulary, formal expressions (zwracam się, w załączeniu)',
        organization: 'Formal letter structure: header, greeting, body paragraphs, closing',
      },
      modelResponse: 'Szanowny Panie Dyrektorze! Zwracam się z prośbą o zatrudnienie na stanowisko kelnera, o którym przeczytałem na Państwa stronie internetowej. Przez dwa lata pracowałem w restauracji „Pod Lipą", gdzie zdobyłem doświadczenie w obsłudze klienta i serwowaniu dań. Jestem osobą odpowiedzialną, zorganizowaną i lubię pracować w zespole. Jestem dostępny w weekendy i wieczorami w tygodniu. Chciałbym pracować w Państwa restauracji, ponieważ ma doskonałą opinię i chętnie dołączyłbym do zespołu. W załączeniu przesyłam swoje CV. Pozostaję do dyspozycji na rozmowę kwalifikacyjną. Z poważaniem, Adam Wiśniewski',
    },
    {
      id: 'b1-academic-1', category: 'academic', title: 'Zalety i wady mediów społecznościowych',
      type: 'essay',
      instructions: 'Napisz wypracowanie o zaletach i wadach mediów społecznościowych. Podaj co najmniej dwie zalety i dwie wady oraz swoją opinię. (120-150 słów)',
      targetStructures: ['opinion expressions (moim zdaniem)', 'contrast connectors (jednak, z drugiej strony)', 'impersonal constructions'],
      rubric: {
        content: 'At least 2 advantages, 2 disadvantages, personal opinion',
        grammar: 'Correct use of contrast connectors; impersonal constructions',
        vocabulary: 'Technology vocabulary, discourse markers',
        organization: 'Introduction, advantages paragraph, disadvantages paragraph, conclusion',
      },
      modelResponse: 'Media społecznościowe są częścią naszego codziennego życia, ale mają zarówno zalety, jak i wady. Z jednej strony pozwalają nam komunikować się z ludźmi z całego świata i szybko dzielić się informacjami. Ponadto są przydatne do szukania pracy i uczenia się nowych rzeczy. Z drugiej strony media społecznościowe mogą uzależniać, szczególnie młodych ludzi. Mogą też wpływać na naszą samoocenę, bo ciągle porównujemy swoje życie z życiem innych. Moim zdaniem media społecznościowe są przydatnym narzędziem, jeśli korzystamy z nich z umiarem. Ważne jest, żebyśmy nie spędzali za dużo czasu online i dbali o relacje w prawdziwym życiu. Podsumowując, uważam, że trzeba odpowiedzialnie z nich korzystać.',
    },
    {
      id: 'b1-creative-1', category: 'creative', title: 'Kontynuuj historię',
      type: 'narrative',
      instructions: 'Kontynuuj tę historię: „Kiedy otworzyłem drzwi mieszkania, wszystko było inne. Meble zniknęły, a na środku salonu stał..." Napisz, co stało się potem. (100-140 słów)',
      targetStructures: ['past perfect equivalent (aspect chains)', 'narrative tenses', 'direct speech'],
      rubric: {
        content: 'Coherent continuation with conflict/resolution; creative details',
        grammar: 'Correct aspect usage; consistent narrative tenses; punctuated dialogue',
        vocabulary: 'Descriptive and emotional language',
        organization: 'Builds suspense, develops plot, reaches resolution',
      },
      modelResponse: '...ogromny czerwony walizka. Podszedłem powoli, bo się bałem. Kiedy ją otworzyłem, znalazłem w środku liścik: „Nie martw się. Spójrz przez okno." Podszedłem do okna i zobaczyłem na ulicy samochód z firmy meblowej. W tym momencie zadzwonił telefon. To była moja siostra. „Niespodzianka! Urządziliśmy ci mieszkanie na nowo, kiedy byłeś na wyjeździe" — powiedziała ze śmiechem. Nie mogłem uwierzyć. Kiedy zszedłem na dół, cała rodzina już wniosła nowe meble. Wszystko wyglądało pięknie. To była najlepsza niespodzianka w moim życiu. Wieczorem świętowaliśmy razem przy kolacji.',
    },
  ],
  B2: [
    {
      id: 'b2-personal-1', category: 'personal', title: 'Refleksja o podróży, która zmieniła moje spojrzenie',
      type: 'essay',
      instructions: 'Napisz o podróży, która zmieniła twoje spojrzenie na świat. Opisz miejsce, konkretne doświadczenie i jak cię zmieniło. Użyj różnorodnych łączników i precyzyjnego słownictwa. (140-180 słów)',
      targetStructures: ['complex subordination', 'advanced connectors (mimo że, pomimo tego)', 'nominalizations'],
      rubric: {
        content: 'Vivid description, specific anecdote, reflection on personal change',
        grammar: 'Complex subordination; advanced connector variety; correct case usage',
        vocabulary: 'Rich descriptive language; precise emotional vocabulary',
        organization: 'Engaging introduction, narrative body, reflective conclusion',
      },
      modelResponse: 'Nigdy nie wyobrażałem sobie, że podróż do Gruzji może zmienić mój sposób postrzegania świata. Przyjechałem szukając gór i dobrego jedzenia, ale znalazłem coś znacznie głębszego. Pewnego ranka starsza kobieta zaprosiła mnie do swojego domu na obiad. Podczas gdy uczyła mnie lepić chinkali, opowiadała historię swojej wioski, która przetrwała wojny i trzęsienia ziemi. Uświadomiłem sobie, że mimo iż żyjemy w zglobalizowanym świecie, istnieją tradycje, których żadna technologia nie zastąpi. To doświadczenie skłoniło mnie do zakwestionowania mojej obsesji na punkcie efektywności. Jednakże najcenniejsze nie była technika, której się nauczyłem, lecz cierpliwość, którą dostrzegłem w każdym geście tej kobiety. Od tamtej pory staram się poświęcać więcej czasu procesom, a mniej wynikom.',
    },
    {
      id: 'b2-formal-1', category: 'formal', title: 'List do redakcji gazety',
      type: 'letter',
      instructions: 'Napisz list do redakcji gazety wyrażający opinię o zakazie samochodów w centrum miasta. Argumentuj za lub przeciw, podając dane i powody. (140-180 słów)',
      targetStructures: ['impersonal constructions (należy, trzeba)', 'conditional for hypothetical', 'formal argumentation'],
      rubric: {
        content: 'Clear position, at least 3 arguments, counterargument addressed',
        grammar: 'Impersonal constructions; conditional hypotheticals; formal register',
        vocabulary: 'Formal argumentation language; urban planning vocabulary',
        organization: 'Position statement, arguments with evidence, counterargument, conclusion',
      },
      modelResponse: 'Szanowna Redakcjo! Piszę w związku z propozycją zakazu ruchu samochodów w centrum miasta. Uważam, że jest to konieczne, aby poprawić jakość powietrza. Po pierwsze, udowodniono, że zanieczyszczenie w centrum przekracza normy WHO. Gdyby ograniczono ruch, poziom zanieczyszczeń spadłby nawet o 40%. Po drugie, europejskie miasta, które wprowadziły strefy piesze, odnotowały wzrost handlu lokalnego. To prawda, że niektórzy przedsiębiorcy obawiają się utraty klientów; jednakże doświadczenia innych miast dowodzą czegoś przeciwnego. Wreszcie, konieczne jest, abyśmy inwestowali w wydajny transport publiczny jako alternatywę. Nie byłoby sprawiedliwe zakazywać samochodów bez oferowania realnych opcji. Podsumowując, popieram tę inicjatywę, pod warunkiem że będzie jej towarzyszyć kompleksowy plan mobilności. Z poważaniem, Anna Kowalczyk',
    },
    {
      id: 'b2-academic-1', category: 'academic', title: 'Esej argumentacyjny: dwujęzyczna edukacja',
      type: 'essay',
      instructions: 'Napisz esej argumentacyjny o tym, czy edukacja dwujęzyczna powinna być obowiązkowa. Przedstaw tezę, argumenty, kontrargument i wnioski. (150-200 słów)',
      targetStructures: ['conditional constructions', 'passive constructions', 'academic hedging (należy zauważyć, warto podkreślić)'],
      rubric: {
        content: 'Clear thesis, 2-3 supporting arguments, counterargument, conclusion',
        grammar: 'Conditional/subjunctive equivalents; passive voice; hedging',
        vocabulary: 'Academic register; education terminology; hedging expressions',
        organization: 'Thesis introduction, body paragraphs with topic sentences, balanced conclusion',
      },
      modelResponse: 'W ostatnich dekadach edukacja dwujęzyczna stała się przedmiotem ożywionej debaty. Należy zauważyć, że mimo wyzwań, korzyści poznawcze i zawodowe uzasadniają jej obowiązkowe wprowadzenie. Po pierwsze, liczne badania wykazały, że dwujęzyczność poprawia elastyczność poznawczą i opóźnia degenerację umysłową. Warto podkreślić, że korzyści te są największe, gdy ekspozycja rozpoczyna się w dzieciństwie. Po drugie, na zglobalizowanym rynku pracy znajomość dwóch języków stanowi niezaprzeczalną przewagę konkurencyjną. Choć zrozumiałe jest, że niektórzy rodzice obawiają się, iż edukacja dwujęzyczna może spowolnić przyswajanie treści, badania wskazują, że w dłuższej perspektywie uczniowie dwujęzyczni dorównują lub przewyższają rówieśników jednojęzycznych. Niemniej konieczne jest zapewnienie odpowiedniego przygotowania nauczycieli i przeznaczenie wystarczających środków. Podsumowując, obowiązkowa edukacja dwujęzyczna stanowiłaby inwestycję w kapitał ludzki naszego społeczeństwa.',
    },
    {
      id: 'b2-creative-1', category: 'creative', title: 'Mikroopowiadanie: zagubiony przedmiot',
      type: 'narrative',
      instructions: 'Napisz mikroopowiadanie o kimś, kto znajduje tajemniczy przedmiot. Zadbaj o styl literacki: użyj metafor, rytmu i zaskakującego zakończenia. (120-160 słów)',
      targetStructures: ['literary past tenses', 'metaphor and simile', 'sentence rhythm variation'],
      rubric: {
        content: 'Complete micro-narrative with mystery element and surprise ending',
        grammar: 'Fluent past tense narration; varied sentence structures',
        vocabulary: 'Literary language; sensory details; figurative expressions',
        organization: 'Compressed narrative arc; impactful ending',
      },
      modelResponse: 'Znalazł go na chodniku, między dwiema kałużami odbijającymi ołowiane niebo. Był to mosiężny klucz, stary, z grawerunkiem przypominającym labirynt. Schował go do kieszeni jak obietnicę. Przez tygodnie próbował zamków: na strychu babci, w dzienniku, którego nigdy nie pisał, w szafie z listami, których nie wysłał. Żaden nie ustępował. Pewnej bezsennej nocy, przewracając się w łóżku, poczuł zimny metal na udzie. Wyjął klucz i bez namysłu przyłożył do własnej piersi. Pasował. Cichy klik, niemal niesłyszalny. Wtedy przypomniał sobie wszystko, co celowo zapomniał: głos ojca, zapach morza we wrześniu, śmiech, który uciszył. Klucz nie otwierał drzwi. Otwierał ludzi.',
    },
  ],
  C1: [
    {
      id: 'c1-academic-1', category: 'academic', title: 'Recenzja krytyczna: gentryfikacja kulturowa',
      type: 'essay',
      instructions: 'Napisz recenzję krytyczną o gentryfikacji kulturowej (lub podobnym zjawisku). Przeanalizuj przyczyny, skutki i propozycje. Rejestr akademicki z niuansami. (180-230 słów)',
      targetStructures: ['conditional constructions', 'nominalizations', 'academic hedging and distancing'],
      rubric: {
        content: 'Nuanced analysis with causes, effects, proposals; avoids oversimplification',
        grammar: 'Complex subordination; conditional hypotheticals; impersonal constructions',
        vocabulary: 'Academic lexis; abstract nominalizations; discipline-specific terms',
        organization: 'Introduction with framing, analytical body, nuanced conclusion',
      },
      modelResponse: 'Gentryfikacja kulturowa stanowi jedno z najbardziej kontrowersyjnych zjawisk współczesnej urbanizacji. Można ją zdefiniować jako proces, w wyniku którego napływ nowych mieszkańców o wyższej sile nabywczej przekształca nie tylko ekonomię, ale i tkankę kulturową dzielnicy. Wśród przyczyn wymienić należy spekulację nieruchomościami oraz utowarowienie dziedzictwa kulturowego. Jakkolwiek prawdą jest, że rewitalizacja miejska może poprawić infrastrukturę, nie można ignorować faktu, że często prowadzi do wysiedlania zakorzenionych społeczności. Gdyby nie polityka mieszkań socjalnych, skutki byłyby jeszcze dotkliwsze. Uproszczeniem byłoby przypisywanie tego zjawiska wyłącznie rynkowi; polityka publiczna odgrywa tu rolę decydującą. Pożądane byłoby, aby administracje wdrożyły mechanizmy ochrony tradycyjnego handlu i zagwarantowały prawo do mieszkania. Gentryfikacja kulturowa zmusza nas do przemyślenia, jaki model miasta chcemy budować i dla kogo.',
    },
    {
      id: 'c1-formal-1', category: 'formal', title: 'Raport z rekomendacjami',
      type: 'report',
      instructions: 'Napisz raport dla dyrekcji firmy rekomendujący wdrożenie częściowej pracy zdalnej. Uwzględnij kontekst, dane, zalety, ryzyka i rekomendację. (180-230 słów)',
      targetStructures: ['passive and impersonal constructions', 'conditional for recommendations (należałoby)', 'formal hedging'],
      rubric: {
        content: 'Context, evidence, balanced analysis, actionable recommendation',
        grammar: 'Passive/impersonal; modal verbs for hedging; conditional advice',
        vocabulary: 'Business register; report language (zaleca się, warto podkreślić)',
        organization: 'Numbered sections or clear heading structure; executive summary tone',
      },
      modelResponse: 'Raport w sprawie wdrożenia częściowej pracy zdalnej. 1. Kontekst: Po doświadczeniach ostatnich lat stwierdzono, że model pracy wyłącznie stacjonarnej staje się coraz mniej konkurencyjny. Niniejszy raport analizuje zasadność modelu hybrydowego. 2. Dane: Według badań produktywność wzrasta o 13% u pracowników zdalnych. Ponadto nasza ankieta wewnętrzna wskazuje, że 78% zespołu pozytywnie ocenia tę modalność. 3. Zalety: Koszty operacyjne zmniejszyłyby się o około 20%. Ponadto należałoby oczekiwać poprawy równowagi praca-życie, co zmniejszyłoby rotację kadr. 4. Ryzyka: Warto zauważyć, że izolacja społeczna mogłaby wpłynąć na pracę zespołową. Konieczne byłoby również zainwestowanie w narzędzia cyfrowe. 5. Rekomendacja: Zaleca się wdrożenie modelu trzech dni stacjonarnych i dwóch zdalnych na okres próbny sześciu miesięcy. Wdrożeniu powinno towarzyszyć szkolenie kadry kierowniczej z zarządzania zdalnego.',
    },
    {
      id: 'c1-creative-1', category: 'creative', title: 'Felieton z ironią',
      type: 'opinion',
      instructions: 'Napisz ironiczny felieton o współczesnej obsesji na punkcie produktywności. Użyj humoru, odniesień kulturowych i starannego stylu literackiego. (160-210 słów)',
      targetStructures: ['irony and understatement', 'rhetorical questions', 'conditional wishes (gdyby, oby)'],
      rubric: {
        content: 'Clear ironic thesis; humor that serves the argument; cultural references',
        grammar: 'Rhetorical structures; conditional for wishes/doubt; varied subordination',
        vocabulary: 'Journalistic register with literary flair; ironic tone markers',
        organization: 'Hook opening, escalating irony, reflective closing',
      },
      modelResponse: 'Wstań o piątej, medytuj, przebiegij dziesięć kilometrów, wypij zielony koktajl i napisz trzy strony powieści przed świtem. Witajcie w erze, w której odpoczynek jest grzechem, a lenistwo chorobą, którą trzeba leczyć aplikacjami do produktywności. Być może nasi dziadkowie, którzy siadali przy kawie bez stopera, byli nieodpowiedzialni. A może wiedzieli coś, co my zapomnieliśmy. Dziś optymalizujemy sen, gamifikujemy czytanie i zamieniamy każdy spacer w „sesję mindfulness z mierzalnymi celami". Oby ktoś wyjaśnił nam, kiedy straciliśmy prawo do absolutnego nicnierobienia. Największa ironia polega na tym, że obsesja na punkcie wydajności uczyniła nas głęboko niewydajnymi: więcej energii poświęcamy na organizowanie list zadań niż na ich wykonywanie. Tymczasem guru produktywności sprzedają nam kursy o odzyskiwaniu czasu, który tracimy na kupowanie kursów. Kto wie, może rewolucja XXI wieku nie będzie technologiczna, lecz najstarsza z możliwych: usiąść, popatrzeć przez okno i pozwolić, żeby czas robił, co chce.',
    },
    {
      id: 'c1-personal-1', category: 'personal', title: 'Esej refleksyjny: tożsamość i język',
      type: 'essay',
      instructions: 'Zastanów się, jak nauka polskiego wpłynęła na twoją tożsamość lub sposób myślenia. Zbadaj związek między językiem a myśleniem. (160-200 słów)',
      targetStructures: ['abstract vocabulary', 'complex conditional (gdybym nie zaczął)', 'concessive structures'],
      rubric: {
        content: 'Personal and philosophical depth; specific examples of language-thought link',
        grammar: 'Complex subordination; conditional forms; concessive clauses',
        vocabulary: 'Abstract/philosophical lexis; metalinguistic awareness',
        organization: 'Personal hook, philosophical exploration, insightful conclusion',
      },
      modelResponse: 'Gdybym nie zaczął uczyć się polskiego, prawdopodobnie nadal wierzyłbym, że emocje są uniwersalne. Ale kiedy odkryłem, że po polsku można „tęsknić" — to uczucie, które boli fizycznie — zrozumiałem, że każdy język inaczej wycina rzeczywistość. Nauka polskiego nie tylko dała mi narzędzie komunikacji; podarowała mi nowy sposób bycia w świecie. Siedem przypadków gramatycznych uczy precyzji — każde zakończenie niesie informację o relacji między słowami. Aspekt dokonany i niedokonany ukrywają filozofię: czynności są procesami lub rezultatami, a wybór między nimi zmienia całe znaczenie. Choć nie opanowałem jeszcze wszystkich niuansów zdań warunkowych, rozpoznaję, że myślenie po polsku uczyniło mnie bardziej tolerancyjnym wobec wieloznaczności. Przypadki i aspekt uczą, że język to nie etykieta na rzeczywistości, lecz soczewka, przez którą ją widzimy. Jeśli czegoś nauczył mnie polski, to tego, że nie wszystko musi być jednoznaczne.',
    },
  ],
  C2: [
    {
      id: 'c2-academic-1', category: 'academic', title: 'Esej akademicki: język i ideologia',
      type: 'essay',
      instructions: 'Napisz esej akademicki o tym, jak język konstruuje rzeczywistość ideologiczną. Przeanalizuj konkretny przykład (media, polityka, reklama). Rygorystyczny rejestr akademicki. (200-260 słów)',
      targetStructures: ['nominalization chains', 'academic distancing (można by argumentować)', 'intertextuality'],
      rubric: {
        content: 'Sophisticated thesis; concrete example analyzed in depth; theoretical grounding',
        grammar: 'Native-level subordination; impeccable register consistency; zero errors expected',
        vocabulary: 'Academic discourse; critical theory terminology; precise and varied',
        organization: 'Academic essay with thesis, analytical framework, evidence, implications',
      },
      modelResponse: 'Język, daleki od bycia neutralnym nośnikiem informacji, funkcjonuje jako mechanizm konstrukcji ideologicznej. Jak zauważył Fairclough, każdy akt dyskursywny wiąże się z wyborem — a każdy wybór z wykluczeniem. Rozważmy medialne traktowanie ruchów migracyjnych. Gdy medium posługuje się wyrażeniem „fala uchodźców" zamiast „przybycie osób migrujących", nie opisuje rzeczywistości: konfiguruje ją. Metafora kataklizmu naturalnego dehumanizuje podmiot i naturalizuje percepcję zagrożenia. Można by argumentować, że są to jedynie konwencje stylistyczne; jednakże badania z zakresu lingwistyki kognitywnej wykazały, że metafory konceptualne kształtują ramy interpretacyjne odbiorcy. Nominalizacja stanowi kolejny ideologicznie nacechowany zabieg: przekształcenie „policja eksmitowała rodziny" w „eksmisja rodzin" wymazuje sprawcę i rozmywa odpowiedzialność. Zjawisko to, które Fowler określił mianem „mistyfikacji syntaktycznej", jest szczególnie skuteczne właśnie dlatego, że pozostaje niezauważone. Należałoby konkludować, że alfabetyzacja krytyczna — zdolność demontażu tych mechanizmów — powinna zajmować centralne miejsce w edukacji. W przeciwnym razie ryzykujemy zamieszkiwanie świata, którego współrzędne ideologiczne zostały wytyczone przez innych, bez naszej świadomości.',
    },
    {
      id: 'c2-creative-1', category: 'creative', title: 'Opowiadanie: wielość głosów',
      type: 'narrative',
      instructions: 'Napisz krótkie opowiadanie z co najmniej dwoma odrębnymi głosami narracyjnymi (pierwsza osoba, trzecia osoba, monolog wewnętrzny itp.) o tym samym wydarzeniu. Zadbaj o styl literacki. (200-260 słów)',
      targetStructures: ['narrative voice shifts', 'literary tenses', 'rhetorical and poetic devices'],
      rubric: {
        content: 'At least 2 distinct narrative voices; same event from different perspectives',
        grammar: 'Flawless command of all tenses and aspects; deliberate stylistic choices',
        vocabulary: 'Literary register; sensory precision; voice differentiation through lexis',
        organization: 'Clear voice transitions; structural choice serves the narrative',
      },
      modelResponse: 'I. Kobieta na peronie. Widziałam, jak wsiadał do pociągu z tą walizką, która zdawała się zawierać ciężar wszystkich pożegnań. Nie odwrócił się. Nigdy nie odwracają się ci, którzy naprawdę odchodzą. Zostałam na peronie z pustymi rękami i tym uczuciem — jak to wytłumaczyć? — że ktoś wyrwał stronę z książki, którą pisaliśmy razem. Pociąg odjechał, a peron wypełnił się ciszą, która pachniała metalem i nadchodzącym deszczem. II. Mężczyzna w pociągu. Gdyby wiedziała, że każdy krok w stronę wagonu był aktem tchórzostwa przebranym za odwagę. Usiąść. Nie patrzeć. Tak się przetrwa: zamieniając ucieczki w decyzje. Walizka waży dokładnie tyle, ile ważą rzeczy, których się nie mówi. Pociąg rusza i krajobraz zaczyna się rozpadać jak wspomnienie, które już staje się fikcją. III. Konduktor. Kolejny pasażer z zaczerwienionymi oczami. Kolejna kobieta nieruchoma na peronie. Ten pociąg od trzydziestu lat przewozi historie, których nikt mu nie opowiada. Kasuję bilet. Warszawa-Kraków. W jedną stronę. Bilety w jedną stronę zawsze są cięższe.',
    },
    {
      id: 'c2-formal-1', category: 'formal', title: 'Przemówienie inauguracyjne',
      type: 'speech',
      instructions: 'Napisz przemówienie inauguracyjne na międzynarodowy kongres o różnorodności językowej. Ton uroczysty, ale przystępny, z cytatami lub odniesieniami kulturowymi. (200-260 słów)',
      targetStructures: ['rhetorical parallelism', 'subjunctive equivalents (niech, oby)', 'elevated register with accessibility'],
      rubric: {
        content: 'Appropriate gravitas; cultural references; call to action',
        grammar: 'Impeccable formal register; rhetorical structures; exhortative constructions',
        vocabulary: 'Ceremonial language; precise and evocative; culturally resonant',
        organization: 'Salutation, framing, thematic development, peroration',
      },
      modelResponse: 'Szanowni Państwo, drodzy koledzy, przyjaciele słowa! Wisława Szymborska napisała kiedyś: „Tyle wiemy o sobie, ile nas sprawdzono." Pozwólcie, że zasugeruję, iż każdy język jest takim właśnie sprawdzianem — innym pytaniem zadawanym rzeczywistości. Spotykamy się dziś, by celebrować nie jednolitość, lecz różnicę. Każdy z sześciu tysięcy języków, które wciąż oddychają na tej planecie, jest niezastąpionym archiwum wiedzy, unikalną kartografią tego, co możliwe. Kiedy umiera język — a umiera jeden co dwa tygodnie — nie znika tylko kod: gaśnie sposób nazywania deszczu, liczenia czasu, wyobrażania sacrum. Niech ten kongres będzie więc aktem oporu. Niech każdy referat przypomni nam, że różnorodność językowa nie jest problemem do rozwiązania, lecz dziedzictwem do ochrony. Nie zadowalajmy się dokumentowaniem tego, co ginie — pracujmy, by języki żyły tam, gdzie żyć powinny: w ustach tych, którzy je odziedziczyli. Oby po zakończeniu tych obrad wyszli stąd Państwo z przekonaniem, że bronić języka to bronić prawa społeczności do śnienia we własnych słowach. Jako Polacy wiemy to szczególnie dobrze — nasz język przetrwał rozbiory, wojny i zaborców. Niech ta pamięć będzie naszą siłą. Dziękuję serdecznie.',
    },
  ],
};

// ── WritingTutor class ─────────────────────────────────────────────────────

class WritingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId, level) {
    const p = core.loadProfile(this.dir, studentId);
    if (level && core.CEFR.includes(level)) {
      p.level = level;
      if (!p.corrections) p.corrections = {};
      for (const cat of CORRECTION_CATEGORIES) {
        if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
      }
      core.saveProfile(this.dir, p);
    } else if (!p.level) {
      p.level = 'A1';
      if (!p.corrections) p.corrections = {};
      for (const cat of CORRECTION_CATEGORIES) {
        if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
      }
      core.saveProfile(this.dir, p);
    }
    return p;
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error(`Invalid level: ${level}. Must be one of ${core.CEFR.join(', ')}`);
    const p = this.getProfile(studentId);
    p.level = level;
    core.saveProfile(this.dir, p);
    return p;
  }

  generatePrompt(studentId, category) {
    const p = this.getProfile(studentId);
    const levelPrompts = PROMPTS[p.level] || PROMPTS.A1;
    let pool = levelPrompts;
    if (category) {
      pool = levelPrompts.filter(pr => pr.category === category);
      if (!pool.length) pool = levelPrompts;
    }

    const attempted = new Set((p.assessments || []).map(a => a.promptId));
    const fresh = pool.filter(pr => !attempted.has(pr.id));
    const chosen = fresh.length ? core.pick(fresh, 1)[0] : core.pick(pool, 1)[0];

    return {
      studentId,
      level: p.level,
      prompt: chosen,
    };
  }

  getRubric(promptId) {
    for (const level of core.CEFR) {
      const found = (PROMPTS[level] || []).find(pr => pr.id === promptId);
      if (found) return { promptId, level, title: found.title, rubric: found.rubric, targetStructures: found.targetStructures, modelResponse: found.modelResponse };
    }
    throw new Error(`Prompt not found: ${promptId}`);
  }

  recordAssessment(studentId, promptId, scores, corrections) {
    const p = this.getProfile(studentId);
    if (!p.assessments) p.assessments = [];
    if (!p.corrections) p.corrections = {};
    for (const cat of CORRECTION_CATEGORIES) {
      if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
    }

    for (const dim of ['content', 'grammar', 'vocabulary', 'organization']) {
      const v = Number(scores[dim]);
      if (isNaN(v) || v < 1 || v > 5) throw new Error(`Score ${dim} must be 1-5, got: ${scores[dim]}`);
    }

    const assessment = {
      promptId,
      date: core.today(),
      scores: {
        content: Number(scores.content),
        grammar: Number(scores.grammar),
        vocabulary: Number(scores.vocabulary),
        organization: Number(scores.organization),
      },
      total: Number(scores.content) + Number(scores.grammar) + Number(scores.vocabulary) + Number(scores.organization),
      maxTotal: 20,
    };

    if (corrections && typeof corrections === 'object') {
      assessment.corrections = corrections;
      for (const [cat, count] of Object.entries(corrections)) {
        if (!CORRECTION_CATEGORIES.includes(cat)) continue;
        const rec = p.corrections[cat];
        const errorCount = Number(count) || 0;
        if (errorCount > 0) {
          rec.attempts.push({ score: 0, total: 1, date: core.today() });
          const grade = 1;
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        } else {
          rec.attempts.push({ score: 1, total: 1, date: core.today() });
          const grade = 4;
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        }
      }
      for (const cat of CORRECTION_CATEGORIES) {
        if (!(cat in corrections)) {
          const rec = p.corrections[cat];
          rec.attempts.push({ score: 1, total: 1, date: core.today() });
          const grade = 3;
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        }
      }
    }

    p.assessments.push(assessment);
    core.saveProfile(this.dir, p);

    return {
      studentId,
      assessment,
      overallScore: `${assessment.total}/${assessment.maxTotal}`,
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const categories = {};
    for (const cat of CORRECTION_CATEGORIES) {
      const rec = p.corrections[cat] || { attempts: [] };
      const mastery = core.calcMastery(rec.attempts);
      categories[cat] = {
        mastery,
        label: core.masteryLabel(mastery),
        attempts: rec.attempts.length,
        nextReview: rec.stability ? core.fsrsNextReview(rec.stability, core.DEFAULT_RETENTION) : null,
      };
    }

    const recent = (p.assessments || []).slice(-10);
    const avgScores = { content: 0, grammar: 0, vocabulary: 0, organization: 0 };
    if (recent.length) {
      for (const a of recent) {
        for (const dim of Object.keys(avgScores)) avgScores[dim] += a.scores[dim];
      }
      for (const dim of Object.keys(avgScores)) avgScores[dim] = Math.round(avgScores[dim] / recent.length * 10) / 10;
    }

    return {
      studentId,
      level: p.level,
      totalAssessments: (p.assessments || []).length,
      correctionCategories: categories,
      averageScores: recent.length ? avgScores : null,
    };
  }

  getNextTopics(studentId) {
    const progress = this.getProgress(studentId);
    const cats = progress.correctionCategories;
    const sorted = CORRECTION_CATEGORIES
      .map(cat => ({ category: cat, ...cats[cat] }))
      .sort((a, b) => a.mastery - b.mastery || (a.nextReview || 999) - (b.nextReview || 999));

    return {
      studentId,
      level: progress.level,
      focusAreas: sorted.slice(0, 3).map(s => ({
        category: s.category,
        mastery: s.mastery,
        label: s.label,
        recommendation: this._recommendation(s.category, s.label),
      })),
    };
  }

  _recommendation(category, label) {
    const recs = {
      case: 'Practice noun declension in context. Write descriptions using various prepositions (w, na, z, do, od).',
      gender: 'Practice noun-adjective-verb gender agreement. Write past tense narratives (robiłem/robiłam).',
      aspect: 'Write narratives mixing imperfective background and perfective events. Practice aspect pairs.',
      agreement: 'Focus on adjective-noun agreement across all cases. Write complex descriptions.',
      spelling: 'Review Polish diacriticals (ą, ę, ć, ś, ź, ż, ł, ń, ó). Practice dictation.',
      'word-order': 'Practice topic-comment structures. Rewrite sentences with different emphasis.',
      register: 'Practice Pan/Pani formal register. Write formal and informal versions of the same message.',
      punctuation: 'Review comma rules with subordinate clauses (że, który, żeby). Practice compound sentences.',
    };
    if (label === 'mastered' || label === 'proficient') return `${category}: strong. Maintain through varied writing.`;
    return recs[category] || `Focus on ${category} in your next writing exercises.`;
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const topics = this.getNextTopics(studentId);

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      totalAssessments: progress.totalAssessments,
      averageScores: progress.averageScores,
      correctionCategories: progress.correctionCategories,
      focusAreas: topics.focusAreas,
      recentAssessments: (p.assessments || []).slice(-5).map(a => ({
        promptId: a.promptId,
        date: a.date,
        score: `${a.total}/${a.maxTotal}`,
      })),
    };
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }

  getPromptCatalog(level) {
    if (level) {
      if (!core.CEFR.includes(level)) throw new Error(`Invalid level: ${level}`);
      return (PROMPTS[level] || []).map(p => ({ id: p.id, category: p.category, title: p.title, type: p.type, level }));
    }
    const catalog = [];
    for (const lvl of core.CEFR) {
      for (const p of (PROMPTS[lvl] || [])) {
        catalog.push({ id: p.id, category: p.category, title: p.title, type: p.type, level: lvl });
      }
    }
    return catalog;
  }
}

// ── CLI ────────────────────────────────────────────────────────────────────

const tutor = new WritingTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const [, studentId, level] = args;
      if (!studentId) throw new Error('Usage: start <studentId> [level]');
      out(tutor.getProfile(studentId, level));
      break;
    }
    case 'set-level': {
      const [, studentId, level] = args;
      if (!studentId || !level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(studentId, level));
      break;
    }
    case 'prompt': {
      const [, studentId, category] = args;
      if (!studentId) throw new Error('Usage: prompt <studentId> [category]');
      out(tutor.generatePrompt(studentId, category));
      break;
    }
    case 'rubric': {
      const [, promptId] = args;
      if (!promptId) throw new Error('Usage: rubric <promptId>');
      out(tutor.getRubric(promptId));
      break;
    }
    case 'record': {
      const [, studentId, promptId, content, grammar, vocabulary, organization, correctionsJson] = args;
      if (!studentId || !promptId || !content) throw new Error('Usage: record <studentId> <promptId> <content> <grammar> <vocab> <org> [correctionsJson]');
      const scores = { content, grammar, vocabulary, organization };
      let corrections = null;
      if (correctionsJson) {
        try { corrections = JSON.parse(correctionsJson); }
        catch { throw new Error('corrections must be valid JSON, e.g. \'{"case":2,"aspect":1}\''); }
      }
      out(tutor.recordAssessment(studentId, promptId, scores, corrections));
      break;
    }
    case 'progress': {
      const [, studentId] = args;
      if (!studentId) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(studentId));
      break;
    }
    case 'report': {
      const [, studentId] = args;
      if (!studentId) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(studentId));
      break;
    }
    case 'prompts': {
      const [, level] = args;
      out(tutor.getPromptCatalog(level));
      break;
    }
    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }

    case 'help':
      out({ info: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({
        error: `Unknown command: ${cmd}`,
        commands: ['start', 'set-level', 'prompt', 'rubric', 'record', 'progress', 'report', 'prompts', 'students'],
      });
  }
});

module.exports = { WritingTutor, PROMPTS, CORRECTION_CATEGORIES };
