#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'polish-reading';

// ---------------------------------------------------------------------------
// Embedded reading texts by CEFR level
// ---------------------------------------------------------------------------

const TEXTS = {
  A1: [
    {
      id: 'a1-kawiarnia',
      title: 'W kawiarni',
      type: 'dialogue',
      text:
        '— Dzień dobry. Co podać?\n' +
        '— Dzień dobry. Poproszę kawę z mlekiem.\n' +
        '— Dużą czy małą?\n' +
        '— Dużą. I jeszcze rogalika.\n' +
        '— Dobrze. To będzie osiem złotych.\n' +
        '— Proszę. Dziękuję.\n' +
        '— Smacznego!',
      vocabulary: [
        { word: 'podać', definition: 'to serve / what can I get you', example: 'Co mogę podać?' },
        { word: 'poproszę', definition: 'I would like (polite request)', example: 'Poproszę herbatę.' },
        { word: 'smacznego', definition: 'enjoy your meal (bon appétit)', example: 'Smacznego!' },
      ],
      comprehensionQuestions: [
        {
          question: 'Co zamawia klient do picia?',
          options: ['Herbatę', 'Kawę z mlekiem', 'Sok pomarańczowy', 'Wodę'],
          answer: 1,
          explanation: 'Klient mówi „Poproszę kawę z mlekiem."',
        },
        {
          question: 'Jaki rozmiar kawy wybiera klient?',
          options: ['Mały', 'Średni', 'Duży', 'Nie mówi'],
          answer: 2,
          explanation: 'Klient odpowiada „Dużą."',
        },
        {
          question: 'Ile kosztuje zamówienie?',
          options: ['Pięć złotych', 'Siedem złotych', 'Osiem złotych', 'Dziesięć złotych'],
          answer: 2,
          explanation: 'Kelner mówi „To będzie osiem złotych."',
        },
      ],
    },
    {
      id: 'a1-rodzina',
      title: 'Moja rodzina',
      type: 'narrative',
      text:
        'Mam na imię Ania. Mam dwadzieścia pięć lat i mieszkam w Warszawie. Moja rodzina jest mała. ' +
        'Mój tata ma na imię Marek i ma pięćdziesiąt dwa lata. Jest nauczycielem. Moja mama ' +
        'ma na imię Katarzyna i ma czterdzieści dziewięć lat. Jest lekarką. Mam brata. ' +
        'Ma na imię Piotr i ma dwadzieścia dwa lata. Piotr studiuje na uniwersytecie. ' +
        'W weekendy jemy razem obiad u moich rodziców.',
      vocabulary: [
        { word: 'mieszkam', definition: 'I live', example: 'Mieszkam w dużym domu.' },
        { word: 'lekarką', definition: 'doctor (female, instrumental case)', example: 'Ona jest lekarką.' },
        { word: 'w weekendy', definition: 'on weekends', example: 'W weekendy odpoczywam.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Gdzie mieszka Ania?',
          options: ['W Krakowie', 'W Warszawie', 'W Gdańsku', 'We Wrocławiu'],
          answer: 1,
          explanation: 'Ania mówi „mieszkam w Warszawie."',
        },
        {
          question: 'Kim z zawodu jest mama Ani?',
          options: ['Nauczycielką', 'Pielęgniarką', 'Lekarką', 'Prawniczką'],
          answer: 2,
          explanation: 'Tekst mówi „Jest lekarką."',
        },
        {
          question: 'Co robi Piotr?',
          options: ['Pracuje', 'Studiuje na uniwersytecie', 'Podróżuje', 'Gotuje'],
          answer: 1,
          explanation: 'Tekst mówi „Piotr studiuje na uniwersytecie."',
        },
      ],
    },
    {
      id: 'a1-dzien',
      title: 'Mój dzień',
      type: 'narrative',
      text:
        'Codziennie wstaję o siódmej rano. Na śniadanie jem kanapkę i piję herbatę. ' +
        'O ósmej jadę do pracy autobusem. Pracuję w biurze od dziewiątej do piątej. ' +
        'W południe jem obiad w parku. Po południu wracam do domu i gotuję kolację. ' +
        'Potem oglądam telewizję albo czytam książkę. Kładę się spać o jedenastej.',
      vocabulary: [
        { word: 'wstaję', definition: 'I get up', example: 'Wstaję wcześnie.' },
        { word: 'kanapkę', definition: 'sandwich (accusative)', example: 'Jem kanapkę z serem.' },
        { word: 'kładę się spać', definition: 'I go to bed', example: 'Kładę się spać późno w piątki.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Jak jedzie do pracy?',
          options: ['Samochodem', 'Metrem', 'Autobusem', 'Pieszo'],
          answer: 2,
          explanation: 'Tekst mówi „jadę do pracy autobusem."',
        },
        {
          question: 'Gdzie je obiad?',
          options: ['W biurze', 'W restauracji', 'W domu', 'W parku'],
          answer: 3,
          explanation: 'Tekst mówi „jem obiad w parku."',
        },
        {
          question: 'O której kładzie się spać?',
          options: ['O dziesiątej', 'O jedenastej', 'O dwunastej', 'O dziewiątej'],
          answer: 1,
          explanation: 'Tekst mówi „Kładę się spać o jedenastej."',
        },
      ],
    },
  ],

  A2: [
    {
      id: 'a2-wakacje',
      title: 'Moje wakacje nad morzem',
      type: 'narrative',
      text:
        'Ostatniego lata pojechałam na wakacje nad morze z rodziną. Jechaliśmy samochodem ' +
        'cztery godziny. Hotel był blisko plaży i miał duży basen. Codziennie wstawaliśmy ' +
        'późno i jedliśmy śniadanie w hotelu. Rano chodziliśmy na plażę. Woda była trochę ' +
        'zimna, ale dzieciom bardzo się podobało pływanie. Po południu spacerowaliśmy po ' +
        'miasteczku i jedliśmy lody. Pewnego wieczoru jedliśmy kolację w restauracji z ' +
        'owocami morza. Zupa rybna była pyszna. To były najlepsze wakacje w moim życiu.',
      vocabulary: [
        { word: 'owoce morza', definition: 'seafood', example: 'Lubię owoce morza.' },
        { word: 'spacerowaliśmy', definition: 'we used to walk/stroll', example: 'Spacerowaliśmy po starym mieście.' },
        { word: 'pyszna', definition: 'delicious', example: 'Ta zupa jest pyszna.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Jak jechali nad morze?',
          options: ['Pociągiem', 'Samolotem', 'Samochodem', 'Autobusem'],
          answer: 2,
          explanation: 'Tekst mówi „Jechaliśmy samochodem cztery godziny."',
        },
        {
          question: 'Jaka była woda w morzu?',
          options: ['Ciepła', 'Trochę zimna', 'Bardzo zimna', 'Idealna'],
          answer: 1,
          explanation: 'Tekst mówi „Woda była trochę zimna."',
        },
        {
          question: 'Co jedli w restauracji?',
          options: ['Pizzę', 'Hamburgery', 'Zupę rybną', 'Sałatkę'],
          answer: 2,
          explanation: 'Tekst mówi „Zupa rybna była pyszna."',
        },
      ],
    },
    {
      id: 'a2-targ',
      title: 'Na targu',
      type: 'dialogue',
      text:
        '— Dzień dobry. Czy ma Pan świeże pomidory?\n' +
        '— Tak, oczywiście. Te są z dzisiejszego ogrodu. Ile Pan chce?\n' +
        '— Poproszę kilogram. A truskawki? Są dobre?\n' +
        '— Bardzo dobre. W tym tygodniu są bardzo słodkie.\n' +
        '— Dobrze, pół kilograma truskawek też poproszę. Ile płacę?\n' +
        '— Kilogram pomidorów — pięć złotych. Truskawki — osiem złotych. Razem trzynaście złotych.\n' +
        '— Proszę. Czy ma Pan torbę?\n' +
        '— Tak, proszę. Smacznego!',
      vocabulary: [
        { word: 'ogród', definition: 'garden', example: 'Pomidory są z ogrodu.' },
        { word: 'słodkie', definition: 'sweet', example: 'Truskawki są bardzo słodkie.' },
        { word: 'torba', definition: 'bag', example: 'Czy ma Pan torbę na zakupy?' },
      ],
      comprehensionQuestions: [
        {
          question: 'Skąd są pomidory?',
          options: ['Ze sklepu', 'Z dzisiejszego ogrodu', 'Z importu', 'Nie wiadomo'],
          answer: 1,
          explanation: 'Sprzedawca mówi „Te są z dzisiejszego ogrodu."',
        },
        {
          question: 'Ile kosztują truskawki?',
          options: ['Pięć złotych', 'Osiem złotych', 'Trzynaście złotych', 'Trzy złote'],
          answer: 1,
          explanation: 'Sprzedawca mówi „Truskawki — osiem złotych."',
        },
        {
          question: 'Jakie są truskawki w tym tygodniu?',
          options: ['Kwaśne', 'Bardzo słodkie', 'Trochę niedojrzałe', 'Normalne'],
          answer: 1,
          explanation: 'Sprzedawca mówi „W tym tygodniu są bardzo słodkie."',
        },
      ],
    },
  ],

  B1: [
    {
      id: 'b1-rowery',
      title: 'Rowery podbijają polskie miasta',
      type: 'article',
      text:
        'W ostatnich latach wiele polskich miast postawiło na rower jako środek transportu. ' +
        'Warszawa, Kraków i Wrocław stworzyły setki kilometrów ścieżek rowerowych. Wrocław, ' +
        'na przykład, zwiększył liczbę rowerzystów z kilku tysięcy do ponad pięćdziesięciu ' +
        'tysięcy podróży dziennie w ciągu kilku lat.\n\n' +
        'Powody są jasne: rower nie zanieczyszcza powietrza, jest tani i poprawia zdrowie. ' +
        'Ostatnie badania wykazały, że osoby dojeżdżające do pracy rowerem mają mniej stresu ' +
        'i lepiej śpią. Ponadto na krótkich dystansach rower jest szybszy od samochodu, bo ' +
        'nie ma problemów z parkowaniem.\n\n' +
        'Jednak wciąż są problemy. Wielu kierowców nie respektuje ścieżek rowerowych i brakuje ' +
        'bezpiecznych parkingów dla rowerów. Niektórzy rowerzyści również nie przestrzegają ' +
        'przepisów ruchu drogowego. Żeby rower stał się prawdziwą alternatywą dla wszystkich, ' +
        'miasta muszą więcej inwestować w infrastrukturę i edukację.',
      vocabulary: [
        { word: 'postawiło na', definition: 'bet on / committed to', example: 'Firma postawiła na nowe technologie.' },
        { word: 'ścieżki rowerowe', definition: 'bike lanes', example: 'Ścieżki rowerowe są bezpieczne.' },
        { word: 'przepisy ruchu drogowego', definition: 'traffic regulations', example: 'Trzeba przestrzegać przepisów ruchu drogowego.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Które miasto zwiększyło liczbę rowerzystów do ponad pięćdziesięciu tysięcy podróży dziennie?',
          options: ['Warszawa', 'Kraków', 'Wrocław', 'Poznań'],
          answer: 2,
          explanation: 'Tekst mówi „Wrocław zwiększył liczbę rowerzystów… do ponad pięćdziesięciu tysięcy podróży dziennie."',
        },
        {
          question: 'Dlaczego rower jest szybszy od samochodu na krótkich dystansach?',
          options: ['Bo jedzie szybciej', 'Bo nie ma problemów z parkowaniem', 'Bo ma własny pas', 'Bo nie ma świateł'],
          answer: 1,
          explanation: 'Tekst mówi „rower jest szybszy od samochodu, bo nie ma problemów z parkowaniem."',
        },
        {
          question: 'Co muszą zrobić miasta, żeby rower stał się prawdziwą alternatywą?',
          options: ['Więcej samochodów', 'Więcej infrastruktury i edukacji', 'Mniej ścieżek rowerowych', 'Darmowe rowery'],
          answer: 1,
          explanation: 'Tekst mówi „miasta muszą więcej inwestować w infrastrukturę i edukację."',
        },
      ],
    },
    {
      id: 'b1-list',
      title: 'List do przyjaciela',
      type: 'letter',
      text:
        'Drogi Michale!\n\n' +
        'Dawno do Ciebie nie pisałem! Opowiem Ci, że w zeszłym miesiącu zmieniłem pracę. ' +
        'Teraz pracuję w firmie technologicznej w centrum miasta. Godziny pracy są lepsze ' +
        'niż poprzednie: zaczynam o dziewiątej, a kończę o szóstej. Moi współpracownicy ' +
        'są bardzo sympatyczni, a szef jest dość elastyczny.\n\n' +
        'Najlepsze jest to, że teraz mogę chodzić do pracy pieszo, bo biuro jest tylko ' +
        'piętnaście minut od mojego domu. Wcześniej jechałem godzinę metrem, więc jestem ' +
        'bardzo zadowolony ze zmiany.\n\n' +
        'Chciałem Ci też powiedzieć, że ja i Kasia myślimy o wyjeździe do Chorwacji ' +
        'w sierpniu. Chcesz pojechać z nami? Moglibyśmy wynająć domek blisko plaży. ' +
        'Napisz, jak będziesz miał czas.\n\n' +
        'Pozdrawiam serdecznie,\nDaniel',
      vocabulary: [
        { word: 'dawno', definition: 'a long time (ago)', example: 'Dawno go nie widziałem.' },
        { word: 'współpracownicy', definition: 'colleagues', example: 'Moi współpracownicy są mili.' },
        { word: 'wynająć', definition: 'to rent', example: 'Chcemy wynająć mieszkanie.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Dlaczego Daniel jest zadowolony z nowej pracy?',
          options: ['Zarabia więcej', 'Może chodzić pieszo i ma lepsze godziny', 'Pracuje z domu', 'Ma więcej urlopu'],
          answer: 1,
          explanation: 'Daniel mówi, że godziny są lepsze i może chodzić pieszo, a wcześniej jechał godzinę metrem.',
        },
        {
          question: 'Ile czasu Daniel jechał do pracy wcześniej?',
          options: ['Piętnaście minut', 'Trzydzieści minut', 'Godzinę', 'Dwie godziny'],
          answer: 2,
          explanation: 'Tekst mówi „Wcześniej jechałem godzinę metrem."',
        },
        {
          question: 'Co Daniel proponuje Michałowi?',
          options: ['Zmianę pracy', 'Wyjazd do Chorwacji razem w sierpniu', 'Odwiedziny w Warszawie', 'Wynajęcie mieszkania'],
          answer: 1,
          explanation: 'Daniel pyta „Chcesz pojechać z nami?" o wyjeździe do Chorwacji w sierpniu.',
        },
      ],
    },
    {
      id: 'b1-wigilia',
      title: 'Wigilia w Polsce',
      type: 'article',
      text:
        'Wigilia, czyli wieczór przed Bożym Narodzeniem (24 grudnia), jest jednym z ' +
        'najważniejszych świąt w Polsce. Przygotowania zaczynają się już rano — trzeba ' +
        'ugotować dwanaście tradycyjnych potraw, bo tyle było apostołów.\n\n' +
        'Na stole wigilijnym zawsze leży biały obrus i siano pod nim — na pamiątkę ' +
        'narodzin Jezusa w stajence. Przy stole zostawia się jedno dodatkowe nakrycie ' +
        'dla niespodziewanego gościa. Kolacja zaczyna się, gdy na niebie pojawi się ' +
        'pierwsza gwiazdka.\n\n' +
        'Przed jedzeniem rodzina dzieli się opłatkiem i składa sobie życzenia. ' +
        'Tradycyjne potrawy to m.in. barszcz czerwony z uszkami, karp, pierogi z ' +
        'kapustą i grzybami, kutia i kompot z suszu. Ważna zasada: w Wigilię nie ' +
        'je się mięsa. Po kolacji rodzina śpiewa kolędy i otwiera prezenty pod choinką.',
      vocabulary: [
        { word: 'opłatek', definition: 'Christmas wafer (shared before the meal)', example: 'Dzieliliśmy się opłatkiem.' },
        { word: 'barszcz czerwony', definition: 'beetroot soup', example: 'Barszcz czerwony z uszkami jest tradycyjny.' },
        { word: 'kolędy', definition: 'Christmas carols', example: 'Śpiewaliśmy kolędy przy choince.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Ile tradycyjnych potraw powinno być na stole wigilijnym?',
          options: ['Siedem', 'Dziesięć', 'Dwanaście', 'Piętnaście'],
          answer: 2,
          explanation: 'Tekst mówi „dwanaście tradycyjnych potraw, bo tyle było apostołów."',
        },
        {
          question: 'Kiedy zaczyna się kolacja wigilijna?',
          options: ['O szóstej', 'Kiedy pojawi się pierwsza gwiazdka', 'O północy', 'Kiedy przyjdą goście'],
          answer: 1,
          explanation: 'Tekst mówi „Kolacja zaczyna się, gdy na niebie pojawi się pierwsza gwiazdka."',
        },
        {
          question: 'Jaka jest ważna zasada dotycząca jedzenia w Wigilię?',
          options: ['Trzeba jeść dużo', 'Nie je się mięsa', 'Trzeba jeść szybko', 'Nie pije się alkoholu'],
          answer: 1,
          explanation: 'Tekst mówi „w Wigilię nie je się mięsa."',
        },
      ],
    },
  ],

  B2: [
    {
      id: 'b2-praca-zdalna',
      title: 'Praca zdalna: rewolucja czy regres?',
      type: 'article',
      text:
        'Pandemia przyspieszyła trend, który już istniał: pracę zdalną. Według danych GUS, ' +
        'odsetek pracowników pracujących z domu w Polsce wzrósł z 4,3% w 2019 roku do 14,2% ' +
        'w 2020 roku. Choć wiele firm wróciło do wymagania obecności w biurze, debata trwa.\n\n' +
        'Zwolennicy pracy zdalnej twierdzą, że zwiększa ona produktywność, redukuje dojazdy i ' +
        'poprawia równowagę między życiem zawodowym a prywatnym. Badanie Uniwersytetu Stanforda ' +
        'wykazało, że pracownicy zdalni byli o 13% bardziej produktywni niż ich koledzy z biura. ' +
        'Ponadto każda osoba pracująca z domu emituje średnio o 1,4 tony CO₂ mniej rocznie.\n\n' +
        'Jednakże krytycy wskazują na poważne zagrożenia. Izolacja społeczna może prowadzić ' +
        'do problemów ze zdrowiem psychicznym. Granica między życiem osobistym a zawodowym ' +
        'się zaciera, co prowadzi do dłuższych dni pracy. Istnieje też obawa, że praca zdalna ' +
        'pogłębi nierówności: podczas gdy wykwalifikowani specjaliści cieszą się elastycznością, ' +
        'pracownicy usług nie mają takiej możliwości.\n\n' +
        'Być może rozwiązaniem nie jest wybór jednego modelu, lecz znalezienie równowagi. ' +
        'Model hybrydowy — dwa lub trzy dni w biurze, reszta z domu — wydaje się oferować ' +
        'to, co najlepsze z obu światów, choć jego wdrożenie wciąż stanowi poważne wyzwanie ' +
        'organizacyjne.',
      vocabulary: [
        { word: 'równowaga', definition: 'balance / equilibrium', example: 'Równowaga między pracą a życiem jest ważna.' },
        { word: 'zaciera się', definition: 'becomes blurred', example: 'Granica między sztuką a rzemiosłem się zaciera.' },
        { word: 'pogłębi', definition: 'will deepen (perfective)', example: 'To może pogłębić problem.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Jaki odsetek pracowników w Polsce pracował zdalnie w 2020 roku?',
          options: ['4,3%', '10,5%', '14,2%', '25%'],
          answer: 2,
          explanation: 'Tekst mówi „wzrósł… do 14,2% w 2020 roku."',
        },
        {
          question: 'Jaki problem z nierównościami wskazują krytycy pracy zdalnej?',
          options: [
            'Szefowie zarabiają więcej',
            'Tylko wykwalifikowani specjaliści mogą pracować zdalnie',
            'Kobiety pracują więcej',
            'Młodzi nie mają doświadczenia',
          ],
          answer: 1,
          explanation: 'Tekst mówi, że „wykwalifikowani specjaliści cieszą się elastycznością," a „pracownicy usług nie mają takiej możliwości."',
        },
        {
          question: 'Jakie rozwiązanie proponuje autor?',
          options: ['Pełna praca zdalna', 'Powrót do biura', 'Model hybrydowy', 'Krótszy tydzień pracy'],
          answer: 2,
          explanation: 'Autor proponuje „Model hybrydowy — dwa lub trzy dni w biurze, reszta z domu."',
        },
      ],
    },
    {
      id: 'b2-jezyki',
      title: 'Języki zagrożone wymarciem',
      type: 'article',
      text:
        'Spośród około siedmiu tysięcy języków używanych na świecie lingwiści szacują, że ' +
        'połowa zniknie przed końcem tego stulecia. Co dwa tygodnie umiera jeden język, ' +
        'a wraz z nim ginie unikalny system myślenia, niepowtarzalny sposób rozumienia ' +
        'rzeczywistości.\n\n' +
        'Polska perspektywa jest tu wyjątkowa. Język polski przetrwał 123 lata rozbiorów, ' +
        'kiedy to zaborcy aktywnie próbowali go wyeliminować. Szkoły tajne, literatura ' +
        'emigracyjna i upór pokoleń sprawiły, że język nie tylko przetrwał, ale stał się ' +
        'symbolem narodowej tożsamości. To doświadczenie powinno uwrażliwiać Polaków na losy ' +
        'zagrożonych języków na świecie.\n\n' +
        'W samej Polsce kaszubski jest jedynym uznanym językiem regionalnym, a silesian ' +
        '(śląski) walczy o uznanie. Wielu młodych ludzi porzuca te odmiany na rzecz ' +
        'standardowego polskiego, kojarząc je z prowincjonalnością.\n\n' +
        'Zachowanie różnorodności językowej to nie tylko kwestia kulturowa; to kwestia ' +
        'sprawiedliwości. Jak powiedział lingwista Ken Hale, kiedy umiera język, ginie ' +
        'intelektualny odpowiednik gatunku biologicznego.',
      vocabulary: [
        { word: 'niepowtarzalny', definition: 'unrepeatable, unique', example: 'To było niepowtarzalne doświadczenie.' },
        { word: 'rozbiory', definition: 'partitions (of Poland, 1772-1918)', example: 'Polska straciła niepodległość w czasie rozbiorów.' },
        { word: 'uwrażliwiać', definition: 'to make sensitive/aware', example: 'Edukacja powinna uwrażliwiać na problemy społeczne.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Jak często znika jeden język na świecie?',
          options: ['Co dzień', 'Co tydzień', 'Co dwa tygodnie', 'Co miesiąc'],
          answer: 2,
          explanation: 'Tekst mówi „Co dwa tygodnie umiera jeden język."',
        },
        {
          question: 'Jaki jest jedyny uznany język regionalny w Polsce?',
          options: ['Śląski', 'Kaszubski', 'Góralski', 'Łemkowski'],
          answer: 1,
          explanation: 'Tekst mówi „kaszubski jest jedynym uznanym językiem regionalnym."',
        },
        {
          question: 'Jakie porównanie stosuje lingwista Ken Hale?',
          options: [
            'Język jest jak kraj',
            'Utracony język jest jak utracony gatunek biologiczny',
            'Języki są jak rzeki',
            'Języki są jak książki',
          ],
          answer: 1,
          explanation: 'Hale powiedział, że „kiedy umiera język, ginie intelektualny odpowiednik gatunku biologicznego."',
        },
      ],
    },
    {
      id: 'b2-odlaczenie',
      title: 'Prawo do odłączenia się',
      type: 'article',
      text:
        'Francja w 2017 roku przyjęła ustawę uznającą prawo pracowników do nieodpowiadania ' +
        'na służbowe maile poza godzinami pracy. Polska dyskutuje o podobnym rozwiązaniu, ' +
        'ale codzienność wciąż daleko odbiega od tego ideału.\n\n' +
        'Badanie przeprowadzone przez Pracuj.pl wykazało, że 65% polskich pracowników ' +
        'sprawdza służbową pocztę w czasie wolnym. Co trzeci przyznaje, że odczuwa lęk, ' +
        'jeśli nie sprawdzi wiadomości w weekend. Powiadomienia na smartfonie zamieniły ' +
        'czas odpoczynku w stałe przedłużenie dnia pracy.\n\n' +
        'Problem jest nie tylko prawny, lecz kulturowy. W wielu środowiskach zawodowych ' +
        'szybkie odpowiadanie postrzegane jest jako dowód zaangażowania i profesjonalizmu. ' +
        'Osoby, które się odłączają, obawiają się, że zostaną uznane za leniwe lub mało ' +
        'ambitne. Ta niewidzialna presja jest, paradoksalnie, trudniejsza do zwalczenia ' +
        'niż jakikolwiek przepis prawny.\n\n' +
        'Aby prawo do odłączenia było skuteczne, firmy muszą zmienić swoją kulturę ' +
        'organizacyjną. Nie wystarczy uchwalić ustawę; konieczne jest, by kierownicy ' +
        'dawali przykład, odłączając się sami, i by ustanowiono jasne protokoły komunikacji ' +
        'poza godzinami pracy.',
      vocabulary: [
        { word: 'odbiega od', definition: 'departs from, differs from', example: 'Rzeczywistość odbiega od planu.' },
        { word: 'zaangażowanie', definition: 'commitment, engagement', example: 'Doceniam twoje zaangażowanie.' },
        { word: 'ustanowiono', definition: 'were established (impersonal past)', example: 'Ustanowiono nowe zasady.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Jaki procent polskich pracowników sprawdza służbową pocztę w czasie wolnym?',
          options: ['32%', '50%', '65%', '85%'],
          answer: 2,
          explanation: 'Badanie wykazało, że „65% polskich pracowników sprawdza służbową pocztę w czasie wolnym."',
        },
        {
          question: 'Jaka jest „niewidzialna presja", o której mówi autor?',
          options: [
            'Prawo jest zbyt surowe',
            'Kultura szybkiego odpowiadania jako dowód zaangażowania',
            'Szefowie wysyłają za dużo maili',
            'Brak Wi-Fi w domu',
          ],
          answer: 1,
          explanation: 'Tekst mówi, że „szybkie odpowiadanie postrzegane jest jako dowód zaangażowania" i że „osoby, które się odłączają, obawiają się."',
        },
        {
          question: 'Jakie rozwiązanie proponuje autor?',
          options: [
            'Więcej ustaw',
            'Zakaz telefonów',
            'Kierownicy powinni dawać przykład i ustanowić jasne protokoły',
            'Praca w krótszych godzinach',
          ],
          answer: 2,
          explanation: 'Autor mówi, że „konieczne jest, by kierownicy dawali przykład" i „ustanowiono jasne protokoły."',
        },
      ],
    },
  ],

  C1: [
    {
      id: 'c1-pamiec',
      title: 'Selektywna pamięć narodów',
      type: 'article',
      text:
        'Każdy naród buduje swoją tożsamość na narracji, która selekcjonuje, porządkuje ' +
        'i interpretuje pewne wydarzenia z przeszłości, relegując inne do zapomnienia. ' +
        'Proces ten, który francuski historyk Ernest Renan opisał jako „niezbędne zbiorowe ' +
        'zapomnienie", nie jest przypadkowy: odpowiada na polityczne i społeczne potrzeby ' +
        'teraźniejszości.\n\n' +
        'Przypadek polski jest szczególnie wymowny. Narracja o powstaniach narodowych — ' +
        'Kościuszkowskim, Listopadowym, Styczniowym, Warszawskim — kształtuje zbiorową ' +
        'tożsamość opartą na heroicznym oporze. Jednocześnie bardziej kontrowersyjne epizody, ' +
        'takie jak pogrom kielecki z 1946 roku czy masakra w Jedwabnem, przez dekady były ' +
        'marginalizowane w dyskursie publicznym.\n\n' +
        'Debata wywołana książką Jana Tomasza Grossa „Sąsiedzi" (2001) pokazała, jak ' +
        'bolesna jest konfrontacja z niewygodnymi prawdami. Jej obrońcy uważali ją za akt ' +
        'elementarnej sprawiedliwości; krytycy oskarżali o podważanie patriotyzmu. To, co ' +
        'jest pewne, to fakt, że żadne społeczeństwo nie może budować prawdziwie demokratycznej ' +
        'przyszłości bez uczciwej konfrontacji ze swoją przeszłością.\n\n' +
        'Jak ostrzegał filozof Leszek Kołakowski: „Naród, który traci pamięć, traci sumienie." ' +
        'Pytanie nie brzmi, czy powinniśmy pamiętać, lecz jak to robić, by pamięć nie stała ' +
        'się narzędziem zemsty, a zapomnienie — wspólnikiem bezkarności.',
      vocabulary: [
        { word: 'relegując', definition: 'relegating, pushing aside', example: 'Społeczeństwo releguje pewne tematy do zapomnienia.' },
        { word: 'wymowny', definition: 'eloquent, telling', example: 'Przypadek ten jest szczególnie wymowny.' },
        { word: 'bezkarność', definition: 'impunity', example: 'Nie można tolerować bezkarności.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Co Ernest Renan opisał jako niezbędne dla tożsamości narodowej?',
          options: [
            'Wojnę',
            'Zbiorowe zapomnienie',
            'Demokrację',
            'Edukację historyczną',
          ],
          answer: 1,
          explanation: 'Tekst mówi, że Renan opisał „niezbędne zbiorowe zapomnienie" jako część budowania tożsamości.',
        },
        {
          question: 'Jaką reakcję wywołała książka Grossa „Sąsiedzi"?',
          options: [
            'Pełną zgodę',
            'Bolesną debatę — jedni widzieli sprawiedliwość, inni podważanie patriotyzmu',
            'Obojętność',
            'Tylko krytykę',
          ],
          answer: 1,
          explanation: 'Tekst mówi, że obrońcy widzieli „akt sprawiedliwości", a krytycy „oskarżali o podważanie patriotyzmu."',
        },
        {
          question: 'Jaka jest główna teza autora w ostatnim akapicie?',
          options: [
            'Trzeba zapomnieć przeszłość, żeby iść naprzód',
            'Pamięć historyczna jest zawsze polityczna',
            'Powinniśmy pamiętać, ale tak, by pamięć nie była zemstą, a zapomnienie bezkarności',
            'Kołakowski miał rację we wszystkim',
          ],
          answer: 2,
          explanation: 'Autor mówi, że pytanie brzmi „jak to robić, by pamięć nie stała się narzędziem zemsty, a zapomnienie — wspólnikiem bezkarności."',
        },
      ],
    },
    {
      id: 'c1-sztuczna',
      title: 'Sztuczna inteligencja a iluzja obiektywności',
      type: 'article',
      text:
        'Istnieje powszechne przekonanie, że algorytmy są narzędziami neutralnymi, ' +
        'niezdolnymi do dyskryminacji, ponieważ pozbawione są ludzkich uprzedzeń. To ' +
        'pozornie logiczne założenie okazuje się głęboko mylne. Algorytmy nie powstają ' +
        'w próżni: są projektowane przez ludzi, trenowane na historycznych danych i ' +
        'wdrażane w konkretnych kontekstach społecznych. Na każdym z tych etapów ludzkie ' +
        'uprzedzenia mogą się przenikać i — co bardziej niepokojące — pozostawać ukryte ' +
        'za pozorem neutralności technicznej.\n\n' +
        'Przykład systemów stosowanych w amerykańskim wymiarze sprawiedliwości jest ' +
        'paradygmatyczny. Śledztwo ProPubliki ujawniło, że algorytm systematycznie ' +
        'przypisywał wyższe ryzyko recydywy oskarżonym Afroamerykanom niż białym, nawet ' +
        'gdy ich profile przestępcze były porównywalne. Stronniczość nie była zakodowana ' +
        'wprost: wynikała z historycznych danych systemu, który sam był nierówny.\n\n' +
        'Problem pogłębia się, gdy weźmiemy pod uwagę, że systemy te działają jak czarne ' +
        'skrzynki. W odróżnieniu od ludzkiego sędziego, którego rozumowanie można zakwestionować ' +
        'w apelacji, algorytm głębokiego uczenia nie potrafi wyjaśnić, dlaczego doszedł do ' +
        'danego wniosku. Ta nieprzejrzystość stanowi fundamentalne wyzwanie dla państwa prawa.\n\n' +
        'Rozwiązaniem nie jest odrzucenie technologii, lecz wymaganie tego, co matematyczka ' +
        'Cathy O\'Neil nazywa „audytami algorytmicznymi": niezależnych ewaluacji badających ' +
        'dane treningowe, metryki wydajności i zróżnicowany wpływ na poszczególne grupy ' +
        'społeczne.',
      vocabulary: [
        { word: 'uprzedzenia', definition: 'biases, prejudices', example: 'Uprzedzenia wpływają na nasze decyzje.' },
        { word: 'recydywa', definition: 'recidivism, reoffending', example: 'Wskaźnik recydywy jest wysoki.' },
        { word: 'nieprzejrzystość', definition: 'opacity, lack of transparency', example: 'Nieprzejrzystość systemu budzi nieufność.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Dlaczego, zdaniem autora, przekonanie o neutralności algorytmów jest mylne?',
          options: [
            'Bo komputery popełniają błędy matematyczne',
            'Bo algorytmy są projektowane przez ludzi i trenowane na stronniczych danych historycznych',
            'Bo technologia jest zawsze zła',
            'Bo programiści są uprzedzeni',
          ],
          answer: 1,
          explanation: 'Tekst argumentuje, że algorytmy „są projektowane przez ludzi, trenowane na historycznych danych" i uprzedzenia mogą się przenikać.',
        },
        {
          question: 'Jaki problem dla państwa prawa stanowią algorytmiczne „czarne skrzynki"?',
          options: [
            'Są zbyt drogie',
            'Nie potrafią wyjaśnić swojego rozumowania, co uniemożliwia przejrzystość i kontrolę',
            'Sędziowie nie umieją ich używać',
            'Nie działają dobrze',
          ],
          answer: 1,
          explanation: 'Tekst mówi, że nieprzejrzystość „stanowi fundamentalne wyzwanie dla państwa prawa."',
        },
        {
          question: 'Jakie rozwiązanie proponuje Cathy O\'Neil?',
          options: [
            'Zakazać sztucznej inteligencji',
            'Używać tylko ludzkich sędziów',
            'Niezależne audyty algorytmiczne',
            'Opublikować kod źródłowy',
          ],
          answer: 2,
          explanation: 'Tekst proponuje „audyty algorytmiczne: niezależne ewaluacje badające dane treningowe."',
        },
      ],
    },
    {
      id: 'c1-literacki',
      title: 'Lalka — fragment adaptowany (Prus)',
      type: 'narrative',
      text:
        'Stanisław Wokulski, właściciel sklepu galanteryjnego, uważał się za człowieka ' +
        'nowoczesnego. Jego ojciec był drobnym szlachcicem, matka — córką kupca. W sprzeczności ' +
        'tych dwóch światów Wokulski wybrał drogę pragmatyzmu i nauki, choć serce ciągnęło go ' +
        'ku romantycznym ideałom.\n\n' +
        'Za cenę wielu wyrzeczeń Wokulski zdołał zbudować fortunę na handlu z Rosją podczas ' +
        'wojny turecko-rosyjskiej. Jednym z jego przyzwyczajeń było wspominanie Paryża — ' +
        'wykładów Marcinkiewicza o fizyce, rozmów z francuskimi uczonymi, chwil, gdy ' +
        'czuł się częścią wielkiego świata nauki.\n\n' +
        'Lecz pogoń za miłością do arystokratki Izabeli Łęckiej okazała się silniejsza ' +
        'niż wszelki racjonalizm. Wokulski, niczym bohater romantyczny, którego pragnął ' +
        'porzucić, poświęcał majątek, pozycję i zdrowy rozsądek na ołtarzu uczucia, które ' +
        'nigdy nie mogło zostać odwzajemnione. Ironia Prusa jest tu najostrzejsza: ' +
        'pozytywista zostaje pokonany przez romantyzm, którego chciał się wyzbyć.',
      vocabulary: [
        { word: 'wyrzeczenia', definition: 'sacrifices, renunciations', example: 'Sukces wymagał wielu wyrzeczeń.' },
        { word: 'pogoń', definition: 'pursuit, chase', example: 'Pogoń za marzeniami bywa bolesna.' },
        { word: 'odwzajemnione', definition: 'reciprocated', example: 'Uczucie nie zostało odwzajemnione.' },
      ],
      comprehensionQuestions: [
        {
          question: 'Z jakich dwóch światów społecznych pochodził Wokulski?',
          options: [
            'Arystokracja i chłopstwo',
            'Drobna szlachta i kupiectwo',
            'Duchowieństwo i wojskowość',
            'Inteligencja i robotnicy',
          ],
          answer: 1,
          explanation: 'Tekst mówi, że ojciec był „drobnym szlachcicem", a matka „córką kupca."',
        },
        {
          question: 'Na czym Wokulski zbudował fortunę?',
          options: [
            'Na sklepie w Warszawie',
            'Na handlu z Rosją podczas wojny turecko-rosyjskiej',
            'Na dziedzictwie',
            'Na nauce',
          ],
          answer: 1,
          explanation: 'Tekst mówi, że „zdołał zbudować fortunę na handlu z Rosją podczas wojny turecko-rosyjskiej."',
        },
        {
          question: 'Jaka jest ironia, na którą wskazuje narrator?',
          options: [
            'Wokulski urodził się na wsi',
            'Pozytywista zostaje pokonany przez romantyzm, którego chciał się wyzbyć',
            'Izabela go kochała',
            'Wokulski nienawidził Paryża',
          ],
          answer: 1,
          explanation: 'Tekst mówi: „pozytywista zostaje pokonany przez romantyzm, którego chciał się wyzbyć."',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// ReadingTutor class
// ---------------------------------------------------------------------------

class ReadingTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.readingStats) {
      p.readingStats = {};
    }
    return p;
  }

  _save(p) {
    core.saveProfile(this.dir, p);
  }

  setLevel(studentId, level) {
    const lev = level.toUpperCase();
    if (!core.CEFR.includes(lev)) throw new Error(`Invalid level: ${level}. Use one of: ${core.CEFR.join(', ')}`);
    if (lev === 'C2') throw new Error('C2 texts are not yet available. Maximum level is C1.');
    const p = this.getProfile(studentId);
    p.level = lev;
    this._save(p);
    return { studentId, level: lev, message: `Level set to ${lev}.` };
  }

  getTextCatalog(level) {
    if (level) {
      const lev = level.toUpperCase();
      const texts = TEXTS[lev];
      if (!texts) return { error: `No texts for level ${lev}.` };
      return { level: lev, texts: texts.map(t => ({ id: t.id, title: t.title, type: t.type })) };
    }
    const catalog = {};
    for (const lev of Object.keys(TEXTS)) {
      catalog[lev] = TEXTS[lev].map(t => ({ id: t.id, title: t.title, type: t.type }));
    }
    return catalog;
  }

  _textsForLevel(level) {
    return TEXTS[level] || [];
  }

  _findText(textId) {
    for (const lev of Object.keys(TEXTS)) {
      const t = TEXTS[lev].find(t => t.id === textId);
      if (t) return { text: t, level: lev };
    }
    return null;
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    if (!p.level) throw new Error('No level set. Use set-level first.');
    const texts = this._textsForLevel(p.level);
    if (!texts.length) throw new Error(`No texts available for level ${p.level}.`);

    const stats = p.readingStats || {};
    const unattempted = texts.filter(t => !stats[t.id] || !stats[t.id].attempts || stats[t.id].attempts.length === 0);
    const chosen = unattempted.length > 0 ? core.pick(unattempted, 1)[0] : core.pick(texts, 1)[0];

    return {
      studentId,
      level: p.level,
      text: {
        id: chosen.id,
        title: chosen.title,
        type: chosen.type,
        text: chosen.text,
        vocabulary: chosen.vocabulary,
      },
      questions: chosen.comprehensionQuestions.map((q, i) => ({
        index: i,
        question: q.question,
        options: q.options.map((o, j) => `${j}) ${o}`),
      })),
      instructions: 'Przeczytaj tekst uważnie. Następnie odpowiedz na pytania, podając numer odpowiedzi (0-3).',
    };
  }

  getText(studentId, textId) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const t = found.text;
    return {
      id: t.id,
      title: t.title,
      type: t.type,
      level: found.level,
      text: t.text,
      vocabulary: t.vocabulary,
      questionCount: t.comprehensionQuestions.length,
    };
  }

  checkAnswer(studentId, textId, qIndex, answer) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const t = found.text;
    const qi = parseInt(qIndex, 10);
    if (qi < 0 || qi >= t.comprehensionQuestions.length) {
      throw new Error(`Invalid question index: ${qIndex}. Text has ${t.comprehensionQuestions.length} questions.`);
    }
    const q = t.comprehensionQuestions[qi];
    const ans = parseInt(answer, 10);
    const correct = ans === q.answer;
    return {
      textId,
      questionIndex: qi,
      correct,
      yourAnswer: ans,
      correctAnswer: q.answer,
      correctOption: q.options[q.answer],
      explanation: q.explanation,
    };
  }

  recordAssessment(studentId, textId, score, total) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const p = this.getProfile(studentId);
    if (!p.readingStats) p.readingStats = {};
    if (!p.readingStats[textId]) {
      p.readingStats[textId] = {
        attempts: [],
        stability: 1,
        difficulty: 5,
        nextReview: core.today(),
      };
    }
    const st = p.readingStats[textId];
    const s = parseInt(score, 10);
    const t = parseInt(total, 10);
    st.attempts.push({ score: s, total: t, date: core.today() });

    const grade = s === t ? 4 : s >= t * 0.7 ? 3 : s >= t * 0.5 ? 2 : 1;
    st.stability = core.fsrsUpdateStability(st.stability, st.difficulty, grade);
    st.difficulty = core.fsrsUpdateDifficulty(st.difficulty, grade);
    st.nextReview = (() => {
      const days = core.fsrsNextReview(st.stability);
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    })();

    p.assessments.push({
      type: 'reading',
      textId,
      score: s,
      total: t,
      date: core.today(),
    });

    this._save(p);
    return {
      studentId,
      textId,
      score: s,
      total: t,
      mastery: core.calcMastery(st.attempts),
      nextReview: st.nextReview,
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const stats = p.readingStats || {};
    const textIds = Object.keys(stats);
    const totalAttempts = textIds.reduce((sum, id) => sum + (stats[id].attempts || []).length, 0);
    const masteries = textIds.map(id => core.calcMastery(stats[id].attempts));
    const avgMastery = masteries.length ? Math.round(masteries.reduce((a, b) => a + b, 0) / masteries.length * 100) / 100 : 0;

    return {
      studentId,
      level: p.level || 'not set',
      textsAttempted: textIds.length,
      totalAttempts,
      averageMastery: avgMastery,
      masteryLabel: core.masteryLabel(avgMastery),
    };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const stats = p.readingStats || {};
    const details = [];
    for (const textId of Object.keys(stats)) {
      const st = stats[textId];
      const found = this._findText(textId);
      const mastery = core.calcMastery(st.attempts);
      details.push({
        textId,
        title: found ? found.text.title : textId,
        level: found ? found.level : '?',
        attempts: st.attempts.length,
        lastScore: st.attempts.length ? st.attempts[st.attempts.length - 1] : null,
        mastery,
        masteryLabel: core.masteryLabel(mastery),
        nextReview: st.nextReview,
      });
    }
    return {
      studentId,
      level: p.level || 'not set',
      createdAt: p.createdAt,
      texts: details,
    };
  }

  getNextTexts(studentId) {
    const p = this.getProfile(studentId);
    if (!p.level) throw new Error('No level set. Use set-level first.');
    const stats = p.readingStats || {};
    const todayStr = core.today();

    const due = [];
    for (const textId of Object.keys(stats)) {
      const st = stats[textId];
      if (st.nextReview <= todayStr) {
        const found = this._findText(textId);
        due.push({
          textId,
          title: found ? found.text.title : textId,
          level: found ? found.level : '?',
          nextReview: st.nextReview,
          mastery: core.calcMastery(st.attempts),
        });
      }
    }

    const texts = this._textsForLevel(p.level);
    const unattempted = texts
      .filter(t => !stats[t.id])
      .map(t => ({ textId: t.id, title: t.title, level: p.level, nextReview: 'new', mastery: 0 }));

    return {
      studentId,
      level: p.level,
      dueForReview: due,
      newTexts: unattempted,
    };
  }

  listStudents() {
    return { students: core.listProfiles(this.dir) };
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ReadingTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const [, sid, level] = args;
      if (!sid) throw new Error('Usage: start <studentId> [level]');
      if (level) tutor.setLevel(sid, level);
      const p = tutor.getProfile(sid);
      tutor._save(p);
      out({ message: `Profile loaded for ${sid}.`, level: p.level || 'not set' });
      break;
    }
    case 'set-level': {
      const [, sid, level] = args;
      if (!sid || !level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(sid, level));
      break;
    }
    case 'lesson': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: lesson <studentId>');
      out(tutor.generateLesson(sid));
      break;
    }
    case 'text': {
      const [, sid, textId] = args;
      if (!sid || !textId) throw new Error('Usage: text <studentId> <textId>');
      out(tutor.getText(sid, textId));
      break;
    }
    case 'check': {
      const [, sid, textId, qIndex, answer] = args;
      if (!sid || !textId || qIndex === undefined || answer === undefined) {
        throw new Error('Usage: check <studentId> <textId> <qIndex> <answer>');
      }
      out(tutor.checkAnswer(sid, textId, qIndex, answer));
      break;
    }
    case 'record': {
      const [, sid, textId, score, total] = args;
      if (!sid || !textId || score === undefined || total === undefined) {
        throw new Error('Usage: record <studentId> <textId> <score> <total>');
      }
      out(tutor.recordAssessment(sid, textId, score, total));
      break;
    }
    case 'progress': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(sid));
      break;
    }
    case 'report': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(sid));
      break;
    }
    case 'next': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: next <studentId>');
      out(tutor.getNextTexts(sid));
      break;
    }
    case 'texts': {
      const [, level] = args;
      out(tutor.getTextCatalog(level || null));
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
        commands: ['start', 'set-level', 'lesson', 'text', 'check', 'record', 'progress', 'report', 'next', 'texts', 'students'],
      });
  }
});
