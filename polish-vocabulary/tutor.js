// Polish Vocabulary Tutor — complete implementation with embedded data
// Usage: node tutor.js <command> [args...]
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'polish-vocabulary';
const MAX_NEW_PER_SESSION = 7;

// ─── Embedded Word Banks by CEFR Level ───────────────────────────────────────

const WORD_BANKS = {
  A1: [
    // Greetings
    { word: 'cześć', article: null, category: 'greetings', definition: 'hi / bye (informal)',
      exampleSentence: 'Cześć, jak się masz?', collocations: ['powiedzieć cześć', 'cześć wszystkim'], falseFriends: null },
    { word: 'dzień dobry', article: null, category: 'greetings', definition: 'good morning / good day (formal)',
      exampleSentence: 'Dzień dobry, Panie Kowalski.', collocations: ['mówić dzień dobry'], falseFriends: null },
    { word: 'dziękuję', article: null, category: 'greetings', definition: 'thank you',
      exampleSentence: 'Bardzo dziękuję za pomoc.', collocations: ['dziękuję bardzo', 'dziękuję za'], falseFriends: null },
    { word: 'przepraszam', article: null, category: 'greetings', definition: 'excuse me / I am sorry',
      exampleSentence: 'Przepraszam, gdzie jest dworzec?', collocations: ['przepraszam za spóźnienie', 'przepraszam, że'], falseFriends: null },
    // Food
    { word: 'woda', article: null, category: 'food', definition: 'water',
      exampleSentence: 'Poproszę szklankę wody.', collocations: ['woda mineralna', 'szklanka wody', 'woda gazowana'], falseFriends: null },
    { word: 'chleb', article: null, category: 'food', definition: 'bread',
      exampleSentence: 'Kupuję chleb w piekarni.', collocations: ['chleb razowy', 'kromka chleba', 'chleb z masłem'], falseFriends: null },
    { word: 'mleko', article: null, category: 'food', definition: 'milk',
      exampleSentence: 'Piję mleko na śniadanie.', collocations: ['mleko krowie', 'szklanka mleka', 'kawa z mlekiem'], falseFriends: null },
    { word: 'jabłko', article: null, category: 'food', definition: 'apple',
      exampleSentence: 'Czerwone jabłko jest bardzo słodkie.', collocations: ['sok jabłkowy', 'szarlotka z jabłkami'], falseFriends: null },
    // Family
    { word: 'mama', article: null, category: 'family', definition: 'mom',
      exampleSentence: 'Moja mama świetnie gotuje.', collocations: ['Dzień Matki', 'mama i tata'], falseFriends: null },
    { word: 'tata', article: null, category: 'family', definition: 'dad',
      exampleSentence: 'Mój tata pracuje w szpitalu.', collocations: ['Dzień Ojca', 'tata i mama'], falseFriends: null },
    { word: 'brat', article: null, category: 'family', definition: 'brother',
      exampleSentence: 'Mój starszy brat ma na imię Piotr.', collocations: ['młodszy brat', 'starszy brat'], falseFriends: null },
    { word: 'przyjaciel', article: null, category: 'family', definition: 'friend (male)',
      exampleSentence: 'Mój przyjaciel mieszka blisko.', collocations: ['najlepszy przyjaciel', 'dobry przyjaciel'], falseFriends: null },
    // Everyday objects
    { word: 'dom', article: null, category: 'everyday', definition: 'house / home',
      exampleSentence: 'Nasz dom ma duży ogród.', collocations: ['w domu', 'iść do domu', 'dom rodzinny'], falseFriends: null },
    { word: 'książka', article: null, category: 'everyday', definition: 'book',
      exampleSentence: 'Czytam jedną książkę tygodniowo.', collocations: ['książka kulinarna', 'czytać książkę'], falseFriends: null },
    { word: 'stół', article: null, category: 'everyday', definition: 'table',
      exampleSentence: 'Jemy obiad przy stole.', collocations: ['nakryć stół', 'przy stole', 'okrągły stół'], falseFriends: null },
    { word: 'ulica', article: null, category: 'everyday', definition: 'street',
      exampleSentence: 'Ulica jest pełna ludzi.', collocations: ['główna ulica', 'przejść przez ulicę', 'na ulicy'], falseFriends: null },
    // Time / adjectives
    { word: 'dzień', article: null, category: 'time', definition: 'day',
      exampleSentence: 'Dziś jest piękny dzień.', collocations: ['codziennie', 'cały dzień', 'dzień wolny'], falseFriends: null },
    { word: 'noc', article: null, category: 'time', definition: 'night',
      exampleSentence: 'Noc jest bardzo cicha.', collocations: ['dobranoc', 'w nocy', 'całą noc'], falseFriends: null },
    { word: 'dzisiaj', article: null, category: 'time', definition: 'today',
      exampleSentence: 'Dzisiaj idziemy do parku.', collocations: ['dzisiaj rano', 'od dzisiaj'], falseFriends: null },
    { word: 'duży', article: null, category: 'adjectives', definition: 'big / large',
      exampleSentence: 'To jest duże miasto.', collocations: ['duży dom', 'za duży'], falseFriends: null },
  ],

  A2: [
    // Travel
    { word: 'bagaż', article: null, category: 'travel', definition: 'luggage / baggage',
      exampleSentence: 'Mój bagaż waży za dużo.', collocations: ['bagaż podręczny', 'nadać bagaż', 'odebrać bagaż'], falseFriends: null },
    { word: 'bilet', article: null, category: 'travel', definition: 'ticket',
      exampleSentence: 'Muszę kupić bilet na pociąg.', collocations: ['bilet w jedną stronę', 'bilet powrotny', 'kupić bilet'],
      falseFriends: null },
    { word: 'dworzec', article: null, category: 'travel', definition: 'station (train/bus)',
      exampleSentence: 'Dworzec autobusowy jest daleko.', collocations: ['dworzec kolejowy', 'dworzec autobusowy'], falseFriends: null },
    { word: 'walizka', article: null, category: 'travel', definition: 'suitcase',
      exampleSentence: 'Pakuję walizkę na wyjazd.', collocations: ['spakować walizkę', 'walizka podróżna'], falseFriends: null },
    // Food (expanded)
    { word: 'mięso', article: null, category: 'food', definition: 'meat',
      exampleSentence: 'Mięso wołowe jest moje ulubione.', collocations: ['mięso mielone', 'mięso z grilla'], falseFriends: null },
    { word: 'ryba', article: null, category: 'food', definition: 'fish',
      exampleSentence: 'Świeża ryba jest smaczniejsza.', collocations: ['ryba smażona', 'łowić ryby'], falseFriends: null },
    { word: 'rachunek', article: null, category: 'food', definition: 'bill / check (at restaurant); invoice',
      exampleSentence: 'Poproszę rachunek.', collocations: ['zapłacić rachunek', 'rachunek za prąd'],
      falseFriends: { en: 'Not "reckoning" — just a bill' } },
    { word: 'napiwek', article: null, category: 'food', definition: 'tip (gratuity)',
      exampleSentence: 'Zostawiliśmy hojny napiwek.', collocations: ['dać napiwek', 'zostawić napiwek'], falseFriends: null },
    // Shopping
    { word: 'sklep', article: null, category: 'shopping', definition: 'shop / store',
      exampleSentence: 'Sklep zamyka się o dziewiątej.', collocations: ['sklep spożywczy', 'iść do sklepu', 'sklep internetowy'],
      falseFriends: { ru: 'Russian склеп means tomb/crypt — not shop!' } },
    { word: 'cena', article: null, category: 'shopping', definition: 'price',
      exampleSentence: 'Cena owoców wzrosła.', collocations: ['dobra cena', 'za pół ceny', 'obniżka ceny'], falseFriends: null },
    { word: 'pieniądze', article: null, category: 'shopping', definition: 'money',
      exampleSentence: 'Nie mam wystarczająco pieniędzy.', collocations: ['zarabiać pieniądze', 'oszczędzać pieniądze', 'pieniądze gotówką'], falseFriends: null },
    { word: 'tani', article: null, category: 'shopping', definition: 'cheap / inexpensive',
      exampleSentence: 'Ta restauracja jest bardzo tania.', collocations: ['za tanio', 'tańszy'], falseFriends: null },
    // Weather
    { word: 'deszcz', article: null, category: 'weather', definition: 'rain',
      exampleSentence: 'Deszcz nie przestaje od wczoraj.', collocations: ['pada deszcz', 'deszczowy dzień', 'w deszczu'], falseFriends: null },
    { word: 'słońce', article: null, category: 'weather', definition: 'sun',
      exampleSentence: 'Dzisiaj świeci słońce.', collocations: ['opalać się na słońcu', 'okulary przeciwsłoneczne', 'zachód słońca'], falseFriends: null },
    { word: 'zimno', article: null, category: 'weather', definition: 'cold (it is cold)',
      exampleSentence: 'W zimie jest bardzo zimno.', collocations: ['jest zimno', 'zimna pogoda', 'mróz'], falseFriends: null },
    // Body / health
    { word: 'głowa', article: null, category: 'health', definition: 'head',
      exampleSentence: 'Boli mnie głowa.', collocations: ['ból głowy', 'zawroty głowy', 'od stóp do głów'], falseFriends: null },
    { word: 'lekarz', article: null, category: 'health', definition: 'doctor',
      exampleSentence: 'Mam wizytę u lekarza jutro.', collocations: ['iść do lekarza', 'lekarz rodzinny'], falseFriends: null },
    { word: 'chory', article: null, category: 'health', definition: 'sick / ill',
      exampleSentence: 'Mój syn jest dzisiaj chory.', collocations: ['zachorować', 'być chorym na'], falseFriends: null },
    { word: 'recepta', article: null, category: 'health', definition: 'prescription',
      exampleSentence: 'Lekarz wypisał mi receptę.', collocations: ['recepta na lek', 'wypisać receptę'],
      falseFriends: { en: 'Not "recipe" (which is przepis)' } },
    { word: 'ból', article: null, category: 'health', definition: 'pain / ache',
      exampleSentence: 'Mam silny ból pleców.', collocations: ['ból głowy', 'ból brzucha', 'uśmierzać ból'], falseFriends: null },
  ],

  B1: [
    // Work
    { word: 'firma', article: null, category: 'work', definition: 'company / business',
      exampleSentence: 'Pracuję w firmie technologicznej.', collocations: ['firma prywatna', 'założyć firmę', 'firma rodzinna'], falseFriends: null },
    { word: 'spotkanie', article: null, category: 'work', definition: 'meeting',
      exampleSentence: 'Spotkanie zaczyna się o dziesiątej.', collocations: ['mieć spotkanie', 'umówić spotkanie', 'sala konferencyjna'], falseFriends: null },
    { word: 'pensja', article: null, category: 'work', definition: 'salary / wages',
      exampleSentence: 'Dostanę podwyżkę pensji w tym roku.', collocations: ['pensja minimalna', 'wypłata pensji', 'podwyżka pensji'], falseFriends: null },
    { word: 'szef', article: null, category: 'work', definition: 'boss',
      exampleSentence: 'Mój szef jest wymagający, ale sprawiedliwy.', collocations: ['szef kuchni', 'szef działu'], falseFriends: null },
    { word: 'podanie', article: null, category: 'work', definition: 'application / request',
      exampleSentence: 'Złożyłem podanie o pracę wczoraj.', collocations: ['podanie o pracę', 'złożyć podanie', 'napisać podanie'], falseFriends: null },
    // Emotions
    { word: 'nadzieja', article: null, category: 'emotions', definition: 'hope',
      exampleSentence: 'Mam nadzieję, że wszystko się uda.', collocations: ['mieć nadzieję', 'stracić nadzieję', 'promyk nadziei'], falseFriends: null },
    { word: 'dumny', article: null, category: 'emotions', definition: 'proud',
      exampleSentence: 'Jestem bardzo dumny z mojej córki.', collocations: ['być dumnym z', 'duma'], falseFriends: null },
    { word: 'zmartwiony', article: null, category: 'emotions', definition: 'worried',
      exampleSentence: 'Jestem zmartwiony egzaminem.', collocations: ['być zmartwiony czymś', 'martwić się'], falseFriends: null },
    { word: 'wstyd', article: null, category: 'emotions', definition: 'shame / embarrassment',
      exampleSentence: 'Wstyd mi mówić publicznie.', collocations: ['wstyd mi', 'wstydzić się', 'bez wstydu'], falseFriends: null },
    // False friends
    { word: 'aktualny', article: null, category: 'abstract', definition: 'current / up-to-date',
      exampleSentence: 'Aktualna sytuacja jest skomplikowana.', collocations: ['aktualnie', 'aktualne wiadomości'],
      falseFriends: { en: '"actual" is "rzeczywisty" or "prawdziwy"' } },
    { word: 'ewentualnie', article: null, category: 'abstract', definition: 'possibly / alternatively',
      exampleSentence: 'Ewentualnie możemy spotkać się jutro.', collocations: ['ewentualnie można'],
      falseFriends: { en: '"eventually" is "w końcu" or "ostatecznie"' } },
    { word: 'sympatyczny', article: null, category: 'abstract', definition: 'nice / likeable',
      exampleSentence: 'To bardzo sympatyczna osoba.', collocations: ['sympatyczny człowiek'],
      falseFriends: { en: '"sympathetic" is "współczujący"' } },
    { word: 'ordynarny', article: null, category: 'abstract', definition: 'vulgar / crude',
      exampleSentence: 'To było ordynarne zachowanie.', collocations: ['ordynarny język'],
      falseFriends: { en: '"ordinary" is "zwyczajny"' } },
    // Education
    { word: 'przedmiot', article: null, category: 'education', definition: 'subject (school); object',
      exampleSentence: 'Matematyka jest moim ulubionym przedmiotem.', collocations: ['przedmiot szkolny', 'zdać przedmiot'], falseFriends: null },
    { word: 'notatki', article: null, category: 'education', definition: 'notes (class notes)',
      exampleSentence: 'Robię notatki na wszystkich zajęciach.', collocations: ['robić notatki', 'przepisać notatki'], falseFriends: null },
    { word: 'stypendium', article: null, category: 'education', definition: 'scholarship / grant',
      exampleSentence: 'Dostałem stypendium na studia w Krakowie.', collocations: ['starać się o stypendium', 'stypendium naukowe'], falseFriends: null },
    // Daily life
    { word: 'zwyczaj', article: null, category: 'daily', definition: 'habit / custom',
      exampleSentence: 'Mam zwyczaj spacerować po kolacji.', collocations: ['mieć zwyczaj', 'jak zwykle', 'polski zwyczaj'], falseFriends: null },
    { word: 'przeprowadzić się', article: null, category: 'daily', definition: 'to move (change residence)',
      exampleSentence: 'Przeprowadziliśmy się do Krakowa miesiąc temu.', collocations: ['przeprowadzić się do', 'przeprowadzka'], falseFriends: null },
    { word: 'wynajmować', article: null, category: 'daily', definition: 'to rent',
      exampleSentence: 'Chcę wynająć mieszkanie w centrum.', collocations: ['wynajmować mieszkanie', 'wynajmować samochód', 'wynajem'], falseFriends: null },
  ],

  B2: [
    // Work (advanced)
    { word: 'zwolnienie', article: null, category: 'work', definition: 'dismissal / layoff; sick leave',
      exampleSentence: 'Zwolnienie było zupełnie niespodziewane.', collocations: ['zwolnienie z pracy', 'zwolnienie lekarskie', 'zwolnienie grupowe'], falseFriends: null },
    { word: 'awans', article: null, category: 'work', definition: 'promotion (at work)',
      exampleSentence: 'Po pięciu latach dostał awans.', collocations: ['dostać awans', 'awans zawodowy'], falseFriends: null },
    { word: 'wydajność', article: null, category: 'work', definition: 'performance / productivity',
      exampleSentence: 'Wydajność zespołu znacznie się poprawiła.', collocations: ['wysoka wydajność', 'wydajność pracy', 'poprawić wydajność'], falseFriends: null },
    { word: 'przedsiębiorca', article: null, category: 'work', definition: 'entrepreneur',
      exampleSentence: 'To przedsiębiorca z dużą wizją.', collocations: ['duch przedsiębiorczości', 'młody przedsiębiorca'], falseFriends: null },
    // Society
    { word: 'nierówność', article: null, category: 'society', definition: 'inequality',
      exampleSentence: 'Nierówność społeczna nadal jest problemem.', collocations: ['nierówność dochodowa', 'walczyć z nierównością'], falseFriends: null },
    { word: 'obywatelstwo', article: null, category: 'society', definition: 'citizenship',
      exampleSentence: 'Złożył wniosek o obywatelstwo polskie.', collocations: ['uzyskać obywatelstwo', 'podwójne obywatelstwo'], falseFriends: null },
    { word: 'demonstracja', article: null, category: 'society', definition: 'demonstration / protest',
      exampleSentence: 'Na placu odbyła się pokojowa demonstracja.', collocations: ['zorganizować demonstrację', 'demonstracja pokojowa'], falseFriends: null },
    { word: 'zaangażowanie', article: null, category: 'society', definition: 'commitment / engagement',
      exampleSentence: 'Zaangażowanie w ochronę środowiska jest kluczowe.', collocations: ['zaangażowanie społeczne', 'okazać zaangażowanie'],
      falseFriends: null },
    // Abstract
    { word: 'niuans', article: null, category: 'abstract', definition: 'nuance / shade',
      exampleSentence: 'W tym zdaniu jest ważny niuans.', collocations: ['niuans znaczeniowy', 'drobny niuans'], falseFriends: null },
    { word: 'postawić', article: null, category: 'abstract', definition: 'to put / to pose (a question)',
      exampleSentence: 'Chcę postawić ważne pytanie.', collocations: ['postawić pytanie', 'postawić na swoim', 'postawić diagnozę'], falseFriends: null },
    { word: 'niezbędny', article: null, category: 'abstract', definition: 'essential / indispensable',
      exampleSentence: 'Słownik jest niezbędny na tym kursie.', collocations: ['być niezbędnym', 'niezbędne minimum'], falseFriends: null },
    { word: 'wykorzystać', article: null, category: 'abstract', definition: 'to take advantage of / make use of',
      exampleSentence: 'Trzeba wykorzystać dobrą pogodę.', collocations: ['wykorzystać okazję', 'wykorzystać czas', 'wykorzystać potencjał'], falseFriends: null },
    // False friends (B2)
    { word: 'hazard', article: null, category: 'abstract', definition: 'gambling',
      exampleSentence: 'Hazard jest niebezpiecznym nałogiem.', collocations: ['gra hazardowa', 'uzależnienie od hazardu'],
      falseFriends: { en: '"hazard" (danger) is "zagrożenie" or "niebezpieczeństwo"' } },
    { word: 'fabryka', article: null, category: 'everyday', definition: 'factory',
      exampleSentence: 'Fabryka zamknęła się w zeszłym roku.', collocations: ['fabryka samochodów', 'pracować w fabryce'],
      falseFriends: { en: '"fabric" is "tkanina" or "materiał"' } },
    { word: 'lunatyk', article: null, category: 'health', definition: 'sleepwalker',
      exampleSentence: 'Jego brat jest lunatykiem.', collocations: ['chodzić jak lunatyk'],
      falseFriends: { en: '"lunatic" is "szaleniec" or "wariat"' } },
    // Environment
    { word: 'środowisko', article: null, category: 'environment', definition: 'environment',
      exampleSentence: 'Musimy chronić środowisko naturalne.', collocations: ['ochrona środowiska', 'środowisko naturalne', 'szkodzić środowisku'], falseFriends: null },
    { word: 'zrównoważony', article: null, category: 'environment', definition: 'sustainable / balanced',
      exampleSentence: 'Potrzebujemy bardziej zrównoważonego rozwoju.', collocations: ['rozwój zrównoważony', 'zrównoważona gospodarka'], falseFriends: null },
    { word: 'zasoby', article: null, category: 'environment', definition: 'resources',
      exampleSentence: 'Zasoby naturalne są ograniczone.', collocations: ['zasoby naturalne', 'zasoby ludzkie', 'zasoby odnawialne'], falseFriends: null },
    { word: 'ślad', article: null, category: 'environment', definition: 'footprint / trace / track',
      exampleSentence: 'Powinniśmy zmniejszyć nasz ślad węglowy.', collocations: ['ślad węglowy', 'ślad ekologiczny', 'zostawić ślad'], falseFriends: null },
  ],

  C1: [
    // Academic
    { word: 'dziedzina', article: null, category: 'academic', definition: 'field / domain / sphere',
      exampleSentence: 'W dziedzinie badań wyniki są obiecujące.', collocations: ['w dziedzinie', 'dziedzina nauki', 'dziedzina zawodowa'], falseFriends: null },
    { word: 'podjąć', article: null, category: 'academic', definition: 'to undertake / to take up',
      exampleSentence: 'Konieczne jest podjęcie tego tematu z powagą.', collocations: ['podjąć decyzję', 'podjąć temat', 'podjąć działania'], falseFriends: null },
    { word: 'pełnić', article: null, category: 'academic', definition: 'to perform / fulfill (a role)',
      exampleSentence: 'Pełni kluczową rolę w firmie.', collocations: ['pełnić rolę', 'pełnić obowiązki', 'pełnić funkcję'], falseFriends: null },
    { word: 'obejmować', article: null, category: 'academic', definition: 'to encompass / to cover / to assume (a position)',
      exampleSentence: 'Badanie obejmuje okres dziesięciu lat.', collocations: ['obejmować zakres', 'obejmować stanowisko'], falseFriends: null },
    { word: 'przekazać', article: null, category: 'academic', definition: 'to convey / to transfer / to pass on',
      exampleSentence: 'Trudno przekazać tę ideę w innym języku.', collocations: ['przekazać wiadomość', 'przekazać wiedzę'], falseFriends: null },
    // Connectors
    { word: 'niemniej', article: null, category: 'connectors', definition: 'nevertheless / however',
      exampleSentence: 'Plan jest ryzykowny; niemniej warto spróbować.', collocations: ['niemniej jednak'], falseFriends: null },
    { word: 'mimo że', article: null, category: 'connectors', definition: 'despite / although',
      exampleSentence: 'Mimo że padał deszcz, wyszliśmy na spacer.', collocations: ['mimo to', 'mimo wszystko'], falseFriends: null },
    { word: 'natomiast', article: null, category: 'connectors', definition: 'on the other hand / whereas',
      exampleSentence: 'On woli kino; ona natomiast woli teatr.', collocations: [], falseFriends: null },
    // Idiomatic
    { word: 'liczyć na', article: null, category: 'idiomatic', definition: 'to count on / rely on',
      exampleSentence: 'Możesz na mnie liczyć w każdej sytuacji.', collocations: ['liczyć na kogoś', 'liczyć na pomoc'], falseFriends: null },
    { word: 'brać za pewnik', article: null, category: 'idiomatic', definition: 'to take for granted',
      exampleSentence: 'Nie bierz za pewnik, że wszystko się uda.', collocations: ['brać coś za pewnik'], falseFriends: null },
    { word: 'wziąć się w garść', article: null, category: 'idiomatic', definition: 'to pull yourself together',
      exampleSentence: 'Musisz wziąć się w garść przed egzaminem.', collocations: ['weź się w garść!'], falseFriends: null },
    // Abstract
    { word: 'zapał', article: null, category: 'abstract', definition: 'eagerness / zeal / enthusiasm',
      exampleSentence: 'Jego zapał do nauki jest godny podziwu.', collocations: ['z zapałem', 'zapał do pracy'], falseFriends: null },
    { word: 'stopniowy', article: null, category: 'abstract', definition: 'gradual',
      exampleSentence: 'Obserwujemy stopniową zmianę postaw.', collocations: ['stopniowo', 'zmiana stopniowa'], falseFriends: null },
    { word: 'rozłączyć', article: null, category: 'abstract', definition: 'to disconnect / separate',
      exampleSentence: 'Nie da się rozłączyć ekonomii od polityki.', collocations: ['rozłączyć się z', 'rozłączyć rozmowę'], falseFriends: null },
    { word: 'nieunikniony', article: null, category: 'abstract', definition: 'unavoidable / inevitable',
      exampleSentence: 'Reforma systemu jest nieunikniona.', collocations: ['nieunikniony skutek', 'nieunikniona zmiana'], falseFriends: null },
    // Formal
    { word: 'załatwić', article: null, category: 'formal', definition: 'to handle / to arrange / to take care of',
      exampleSentence: 'Muszę załatwić pozwolenie na pobyt.', collocations: ['załatwić sprawę', 'załatwić formalności'], falseFriends: null },
    { word: 'obowiązujący', article: null, category: 'formal', definition: 'in force / current / valid',
      exampleSentence: 'Obowiązujące prawo zabrania tej praktyki.', collocations: ['prawo obowiązujące', 'obowiązujące przepisy'], falseFriends: null },
    { word: 'orzec', article: null, category: 'formal', definition: 'to rule / to issue a ruling',
      exampleSentence: 'Sąd orzekł na korzyść powoda.', collocations: ['orzec wyrok', 'orzec w sprawie'], falseFriends: null },
    { word: 'rozwiązać', article: null, category: 'formal', definition: 'to dissolve / to cancel / to solve',
      exampleSentence: 'Firma zdecydowała rozwiązać umowę.', collocations: ['rozwiązać umowę', 'rozwiązać problem', 'rozwiązać spółkę'], falseFriends: null },
  ],

  C2: [
    // Literary
    { word: 'iście', article: null, category: 'literary', definition: 'truly / verily (archaic/elevated)',
      exampleSentence: 'To iście niezwykłe zjawisko.', collocations: ['iście po królewsku'], falseFriends: null },
    { word: 'zaistnieć', article: null, category: 'literary', definition: 'to come into being / to emerge',
      exampleSentence: 'Okoliczności, które zaistniały, zmieniły wszystko.', collocations: ['zaistnieć w sytuacji'], falseFriends: null },
    { word: 'rozgraniczenie', article: null, category: 'literary', definition: 'demarcation / delimitation',
      exampleSentence: 'Rozgraniczenie obu pojęć nie jest jasne.', collocations: ['rozgraniczenie między', 'jasne rozgraniczenie'], falseFriends: null },
    { word: 'dostrzec', article: null, category: 'literary', definition: 'to glimpse / to perceive / to notice',
      exampleSentence: 'Można dostrzec zmianę na horyzoncie politycznym.', collocations: ['dostrzec problem', 'dostrzec szansę'], falseFriends: null },
    // Colloquial
    { word: 'ogarnąć', article: null, category: 'colloquial', definition: 'to manage / to handle / to tidy up (informal)',
      exampleSentence: 'Nie ogarniam tego tematu.', collocations: ['ogarnąć sytuację', 'ogarnąć się'], falseFriends: null },
    { word: 'git', article: null, category: 'colloquial', definition: 'cool / great (slang)',
      exampleSentence: 'Ten film był git!', collocations: ['wszystko git'], falseFriends: null },
    { word: 'odjechany', article: null, category: 'colloquial', definition: 'amazing / wild / out there (informal)',
      exampleSentence: 'To był odjechany koncert.', collocations: ['odjechana muzyka'], falseFriends: null },
    // Idioms
    { word: 'nie mój cyrk, nie moje małpy', article: null, category: 'idiomatic', definition: 'not my circus, not my monkeys (not my problem)',
      exampleSentence: 'Nie mój cyrk, nie moje małpy — niech sami to rozwiążą.', collocations: [], falseFriends: null },
    { word: 'bułka z masłem', article: null, category: 'idiomatic', definition: 'a piece of cake (very easy)',
      exampleSentence: 'Ten egzamin to bułka z masłem.', collocations: [], falseFriends: null },
    { word: 'trafić w dziesiątkę', article: null, category: 'idiomatic', definition: 'to hit the bullseye / to be spot on',
      exampleSentence: 'Tym komentarzem trafiłeś w dziesiątkę.', collocations: [], falseFriends: null },
    // Academic
    { word: 'unikać', article: null, category: 'academic', definition: 'to avoid / sidestep',
      exampleSentence: 'Nie można unikać odpowiedzialności etycznej.', collocations: ['unikać problemu', 'unikać konfliktu'], falseFriends: null },
    { word: 'leżeć u podstaw', article: null, category: 'academic', definition: 'to underlie',
      exampleSentence: 'Przyczyny leżące u podstaw konfliktu są złożone.', collocations: ['leżeć u podstaw czegoś'], falseFriends: null },
    { word: 'powiązać', article: null, category: 'academic', definition: 'to link together / to connect',
      exampleSentence: 'Powiązano ze sobą kilka błędów, co doprowadziło do kryzysu.', collocations: ['powiązać fakty', 'powiązać ze sobą'], falseFriends: null },
    { word: 'wyjaśnić', article: null, category: 'academic', definition: 'to elucidate / to clarify / to explain',
      exampleSentence: 'Próbowano wyjaśnić przyczyny wypadku.', collocations: ['wyjaśnić sprawę', 'wyjaśnić wątpliwości'], falseFriends: null },
    { word: 'wysunąć', article: null, category: 'academic', definition: 'to put forward / to advance (an argument)',
      exampleSentence: 'Wysunął bardzo przekonujące argumenty.', collocations: ['wysunąć argument', 'wysunąć propozycję'], falseFriends: null },
    // Slavic false friends
    { word: 'uroda', article: null, category: 'abstract', definition: 'beauty',
      exampleSentence: 'Jej uroda zachwyca wszystkich.', collocations: ['naturalna uroda', 'salon urody'],
      falseFriends: { ru: 'Russian уродство means ugliness — opposite meaning!' } },
    { word: 'zapomnieć', article: null, category: 'abstract', definition: 'to forget',
      exampleSentence: 'Zapomniałem o spotkaniu.', collocations: ['zapomnieć o czymś', 'nie zapomnieć'],
      falseFriends: { ru: 'Russian запомнить means to remember — opposite!' } },
    { word: 'szukać', article: null, category: 'abstract', definition: 'to search / to look for (+ genitive)',
      exampleSentence: 'Szukam pracy od miesiąca.', collocations: ['szukać pracy', 'szukać informacji', 'szukać drogi'],
      falseFriends: null },
  ],
};

// ─── Exercise Types ──────────────────────────────────────────────────────────

const EXERCISE_TYPES = ['definition', 'fill-in-blank', 'matching', 'context-guess', 'collocation'];

function makeDefinitionExercise(targetWord, level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const distractors = core.pick(bank.filter(w => w.word !== targetWord.word), 3)
    .map(w => w.definition);
  const options = core.shuffle([targetWord.definition, ...distractors]);
  return {
    type: 'definition',
    prompt: `Co znaczy "${targetWord.word}"?`,
    options,
    answer: targetWord.definition,
    word: targetWord.word,
  };
}

function makeFillInBlankExercise(targetWord) {
  const sentence = targetWord.exampleSentence;
  const escapedWord = targetWord.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedWord, 'i');
  const blanked = sentence.replace(regex, '________');
  if (blanked === sentence) {
    return {
      type: 'fill-in-blank',
      prompt: `Uzupełnij zdanie odpowiednim słowem:\n"${sentence.replace(targetWord.word, '________')}"`,
      answer: targetWord.word,
      hint: targetWord.definition,
      word: targetWord.word,
    };
  }
  return {
    type: 'fill-in-blank',
    prompt: `Uzupełnij lukę:\n"${blanked}"`,
    answer: targetWord.word,
    hint: targetWord.definition,
    word: targetWord.word,
  };
}

function makeMatchingExercise(level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const items = core.pick(bank, 5);
  const pairs = items.map(w => ({
    word: w.word,
    definition: w.definition,
  }));
  return {
    type: 'matching',
    prompt: 'Dopasuj każde słowo do jego definicji.',
    pairs,
    shuffledDefinitions: core.shuffle(pairs.map(p => p.definition)),
    words: pairs.map(p => p.word),
  };
}

function makeContextGuessExercise(targetWord) {
  return {
    type: 'context-guess',
    prompt: `Przeczytaj zdanie i zgadnij znaczenie podkreślonego słowa:\n"${targetWord.exampleSentence}"\n\nCo znaczy "${targetWord.word}"?`,
    answer: targetWord.definition,
    word: targetWord.word,
    falseFriends: targetWord.falseFriends,
  };
}

function makeCollocationExercise(targetWord, level) {
  if (!targetWord.collocations || targetWord.collocations.length === 0) {
    return makeDefinitionExercise(targetWord, level);
  }
  const correctCollocation = core.pick(targetWord.collocations, 1)[0];
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const otherCollocations = [];
  for (const w of core.shuffle(bank)) {
    if (w.word !== targetWord.word && w.collocations && w.collocations.length) {
      otherCollocations.push(w.collocations[0]);
      if (otherCollocations.length >= 3) break;
    }
  }
  const options = core.shuffle([correctCollocation, ...otherCollocations]);
  return {
    type: 'collocation',
    prompt: `Które wyrażenie jest typową kolokacją ze słowem "${targetWord.word}"?`,
    options,
    answer: correctCollocation,
    word: targetWord.word,
  };
}

function generateExercise(targetWord, level, type) {
  switch (type) {
    case 'fill-in-blank': return makeFillInBlankExercise(targetWord);
    case 'matching': return makeMatchingExercise(level);
    case 'context-guess': return makeContextGuessExercise(targetWord);
    case 'collocation': return makeCollocationExercise(targetWord, level);
    default: return makeDefinitionExercise(targetWord, level);
  }
}

// ─── Answer Checking ─────────────────────────────────────────────────────────

function checkAnswer(exercise, userAnswer) {
  const normalise = s => core.norm(s);
  if (exercise.type === 'matching') {
    if (!Array.isArray(userAnswer)) return { correct: false, message: 'Podaj dopasowane pary.' };
    const correctCount = userAnswer.filter(ua =>
      exercise.pairs.some(p => normalise(p.word) === normalise(ua.word) && normalise(p.definition) === normalise(ua.definition))
    ).length;
    return {
      correct: correctCount === exercise.pairs.length,
      score: correctCount,
      total: exercise.pairs.length,
      message: correctCount === exercise.pairs.length ? 'Doskonale!' : `${correctCount}/${exercise.pairs.length} poprawnie.`,
    };
  }

  const expected = normalise(exercise.answer);
  const given = normalise(userAnswer);

  if (given === expected) {
    return { correct: true, message: 'Poprawnie! Świetna robota.' };
  }

  if (expected.includes(given) && given.length > 2) {
    return { correct: true, partial: true, message: `Blisko — pełna odpowiedź to "${exercise.answer}".` };
  }

  return {
    correct: false,
    message: `Nie do końca. Odpowiedź to "${exercise.answer}".`,
    expected: exercise.answer,
  };
}

// ─── VocabularyTutor Class ───────────────────────────────────────────────────

class VocabularyTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.sessions) p.sessions = [];
    return p;
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error(`Invalid CEFR level: ${level}`);
    const p = this.getProfile(studentId);
    p.level = level;
    core.saveProfile(this.dir, p);
    return { studentId, level };
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level];
    if (!bank) throw new Error(`No word bank for level ${level}`);

    const seen = Object.keys(p.skills);
    const unseen = bank.filter(w => !seen.includes(w.word));
    const newWords = core.pick(unseen.length > 0 ? unseen : bank, Math.min(MAX_NEW_PER_SESSION, unseen.length || MAX_NEW_PER_SESSION));

    const exercises = newWords.map((w, i) => {
      const type = EXERCISE_TYPES[i % EXERCISE_TYPES.length];
      return generateExercise(w, level, type);
    });

    return {
      date: core.today(),
      level,
      newWords: newWords.map(w => ({
        word: w.word,
        definition: w.definition,
        exampleSentence: w.exampleSentence,
        collocations: w.collocations,
        falseFriends: w.falseFriends,
        category: w.category,
      })),
      exercises,
    };
  }

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level];
    if (!bank) throw new Error(`No word bank for level ${level}`);
    const targetWord = core.pick(bank, 1)[0];
    const exType = type && EXERCISE_TYPES.includes(type) ? type : core.pick(EXERCISE_TYPES, 1)[0];
    return generateExercise(targetWord, level, exType);
  }

  checkAnswer(exercise, userAnswer) {
    return checkAnswer(exercise, userAnswer);
  }

  recordAssessment(studentId, word, grade) {
    if (!core.isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4 (1=forgot, 2=hard, 3=good, 4=easy)');
    const p = this.getProfile(studentId);

    if (!p.skills[word]) {
      p.skills[word] = {
        word,
        encounters: 0,
        stability: 1,
        difficulty: 5,
        lastReview: null,
        nextReview: null,
        attempts: [],
      };
    }
    const sk = p.skills[word];
    sk.encounters += 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = core.today();
    sk.nextReview = (() => {
      const days = core.fsrsNextReview(sk.stability, core.DEFAULT_RETENTION);
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    })();
    sk.attempts.push({ score: grade >= 3 ? 1 : 0, total: 1, date: core.today() });

    p.assessments.push({ word, grade, date: core.today() });
    core.saveProfile(this.dir, p);

    return {
      word,
      grade,
      mastery: core.masteryLabel(core.calcMastery(sk.attempts)),
      nextReview: sk.nextReview,
      encounters: sk.encounters,
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bankSize = (WORD_BANKS[level] || []).length;
    const words = Object.keys(p.skills);
    const masteryMap = {};
    let masteredCount = 0;
    let totalEncounters = 0;

    for (const w of words) {
      const sk = p.skills[w];
      const m = core.calcMastery(sk.attempts);
      masteryMap[w] = { mastery: m, label: core.masteryLabel(m), encounters: sk.encounters };
      if (m >= core.MASTERY_THRESHOLD) masteredCount++;
      totalEncounters += sk.encounters;
    }

    return {
      studentId,
      level,
      wordsStudied: words.length,
      wordsMastered: masteredCount,
      totalInLevel: bankSize,
      totalEncounters,
      words: masteryMap,
    };
  }

  getNextTopics(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level] || [];
    const seen = new Set(Object.keys(p.skills));
    const unseen = bank.filter(w => !seen.has(w.word));

    const categories = {};
    for (const w of unseen) {
      if (!categories[w.category]) categories[w.category] = [];
      categories[w.category].push(w.word);
    }

    return { level, unseenCount: unseen.length, byCategory: categories };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const review = this.getReviewDue(studentId);

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      sessionsCount: p.assessments.length,
      ...progress,
      reviewDueCount: review.length,
      reviewDueWords: review.map(r => r.word),
    };
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }

  getWordCatalog(level) {
    const lvl = level && core.CEFR.includes(level) ? level : null;
    if (lvl) {
      return { [lvl]: (WORD_BANKS[lvl] || []).map(w => ({ word: w.word, definition: w.definition, category: w.category })) };
    }
    const catalog = {};
    for (const l of core.CEFR) {
      if (WORD_BANKS[l]) {
        catalog[l] = WORD_BANKS[l].map(w => ({ word: w.word, definition: w.definition, category: w.category }));
      }
    }
    return catalog;
  }

  getReviewDue(studentId) {
    const p = this.getProfile(studentId);
    const t = core.today();
    const due = [];
    for (const [word, sk] of Object.entries(p.skills)) {
      if (sk.nextReview && sk.nextReview <= t) {
        due.push({ word, nextReview: sk.nextReview, encounters: sk.encounters, mastery: core.masteryLabel(core.calcMastery(sk.attempts)) });
      }
    }
    return due.sort((a, b) => a.nextReview.localeCompare(b.nextReview));
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const tutor = new VocabularyTutor();

core.runCLI((cmd, args, out) => {
  const sid = args[1] || 'default';
  switch (cmd) {
    case 'start':
      out(tutor.getProfile(sid));
      break;
    case 'set-level':
      out(tutor.setLevel(sid, (args[2] || '').toUpperCase()));
      break;
    case 'lesson':
      out(tutor.generateLesson(sid));
      break;
    case 'exercise':
      out(tutor.generateExercise(sid, args[2]));
      break;
    case 'check': {
      const ex = JSON.parse(args[2]);
      const ans = args.slice(3).join(' ');
      out(tutor.checkAnswer(ex, ans));
      break;
    }
    case 'record':
      out(tutor.recordAssessment(sid, args[2], parseInt(args[3], 10)));
      break;
    case 'review':
      out(tutor.getReviewDue(sid));
      break;
    case 'progress':
      out(tutor.getProgress(sid));
      break;
    case 'report':
      out(tutor.getReport(sid));
      break;
    case 'next':
      out(tutor.getNextTopics(sid));
      break;
    case 'words':
      out(tutor.getWordCatalog(args[1] ? args[2].toUpperCase() : null));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ info: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({
        usage: 'node tutor.js <command> [studentId] [args...]',
        commands: {
          start: 'Load or create student profile',
          'set-level': 'Set CEFR level (A1-C2)',
          lesson: 'Generate a lesson with new words + exercises',
          exercise: 'Generate a single exercise [type]',
          check: 'Check answer: check <id> <exerciseJSON> <answer>',
          record: 'Record assessment: record <id> <word> <grade 1-4>',
          review: 'Get words due for review',
          progress: 'Show progress summary',
          report: 'Full student report',
          next: 'Show upcoming topics by category',
          words: 'Show word catalog [level]',
          students: 'List all students',
        },
      });
  }
});
