export type Mechanic =
  | "match"
  | "picture"
  | "choice"
  | "number"
  | "color"
  | "blank"
  | "sentence"
  | "dialogue"
  | "detect";
export type Prompt = {
  question: string;
  answer: string;
  options: string[];
  type?: Mechanic;
  explanation: string;
  hint?: string;
};
export type Exercise = {
  id: string;
  chapter: number;
  title: string;
  type: Mechanic;
  instructions: string;
  prompts: Prompt[];
};
export const chapters = [
  {
    title: "Willkommen!",
    level: "Fillestar · A1",
    description: "Filloni me përshëndetjet, fjalët, numrat dhe shprehjet e thjeshta.",
    image: "chapter-willkommen",
    theme: "welcome",
  },
  {
    title: "Im Alltag",
    level: "Gjermanisht e përditshme · A1",
    description: "Përdorni gjermanisht të thjeshtë në shkollë, rutinë dhe biseda.",
    image: "chapter-alltag",
    theme: "everyday",
  },
  {
    title: "Deutschland!",
    level: "Sfida praktike · A2",
    description: "Përdorni gjermanisht në udhëtim, ushqim, udhëzime dhe situata të reja.",
    image: "chapter-deutschland",
    theme: "travel",
  },
];
const p = (
  question: string,
  answer: string,
  options: string[],
  explanation: string,
  type?: Mechanic,
): Prompt => ({ question, answer, options, explanation, type });
const e = (
  chapter: number,
  n: number,
  title: string,
  type: Mechanic,
  instructions: string,
  prompts: Prompt[],
): Exercise => ({ id: `c${chapter + 1}-e${n}`, chapter, title, type, instructions, prompts });
export const exercises: Exercise[] = [
  e(0, 1, "Përputhja e përshëndetjes", "match", "Përputh përshëndetjen gjermane me kuptimin në shqip.", [
    p(
      "Hallo!",
      "Përshëndetje!",
      ["Mirupafshim!", "Përshëndetje!", "Mirëmëngjes!"],
      "Hallo është një mënyrë miqësore për të thënë përshëndetje.",
    ),
    p(
      "Guten Morgen!",
      "Mirëmëngjes!",
      ["Përshëndetje!", "Mirëmëngjes!", "Mirupafshim!"],
      "Përdorim Guten Morgen kur përshëndesim dikë në mëngjes.",
    ),
    p(
      "Auf Wiedersehen!",
      "Mirupafshim!",
      ["Mirëmëngjes!", "Përshëndetje!", "Mirupafshim!"],
      "Auf Wiedersehen është një mënyrë e sjellshme për të thënë lamtumirë.",
    ),
  ]),
  e(0, 2, "Fjalët me foto", "picture", "Zgjidh foton që përputhet me fjalën gjermane.", [
    p(
      "der Apfel",
      "apple",
      ["book", "apple", "cat", "house"],
      "Der Apfel do të thotë “mollë”.",
    ),
    p(
      "das Buch",
      "book",
      ["house", "dog", "book", "apple"],
      "Das Buch do të thotë “libër”.",
    ),
    p(
      "das Haus",
      "house",
      ["cat", "book", "apple", "house"],
      "Das Haus do të thotë “shtëpi”.",
    ),
  ]),
  e(0, 3, "Sprinti i numrave", "number", "Gjej numerin për secilin numër gjerman.", [
    p("eins", "1", ["3", "1", "8", "5"], "Eins do të thotë një."),
    p("drei", "3", ["2", "8", "3", "1"], "Drei do të thotë tre."),
    p("acht", "8", ["6", "4", "1", "8"], "Acht do të thotë tetë."),
  ]),
  e(0, 4, "Gjeni ngjyrën", "color", "Zgjidh ngjyrën e duhur.", [
    p("rot", "E kuqe", ["E kaltër", "E kuqe", "E gjelbër", "E verdhë"], "Rot do të thotë e kuqe."),
    p("blau", "E kaltër", ["E gjelbër", "E verdhë", "E kaltër", "E kuqe"], "Blau do të thotë e kaltër."),
    p("grün", "E gjelbër", ["E kuqe", "E kaltër", "E verdhë", "E gjelbër"], "Grün do të thotë e gjelbër."),
  ]),
  e(0, 5, "Plotëso frazën", "blank", "Zgjidh fjalën që plotëson frazën.", [
    p("Guten ____!", "Morgen", ["Morgen", "Nacht", "Täglich"], "Guten Morgen është një përshëndetje e zakonshme në mëngjes."),
    p("Wie heißt ____?", "du", ["ich", "du", "wir"], "Wie heißt du? pyet për emrin e dikujt."),
    p("Ich komme ____ Albanien.", "aus", ["in", "auf", "aus"], "Përdor aus kur thuash ku vijnë."),
  ]),
  e(1, 1, "Der, Die ose Das?", "blank", "Zgjidh artikullin e saktë të përcaktuar.", [
    p("____ Tisch", "der", ["die", "der", "das"], "Tisch është mashkullor: der Tisch."),
    p("____ Schule", "die", ["das", "der", "die"], "Schule është femërore: die Schule."),
    p("____ Buch", "das", ["der", "das", "die"], "Buch është neutror: das Buch."),
  ]),
  e(1, 2, "Ndërtuesi i fjalisë", "sentence", "Trokit fjalët në rendin e duhur për të ndërtuar një fjali.", [
    p(
      "Unë mësoj gjermanisht.",
      "Ich lerne Deutsch.",
      ["Deutsch.", "Ich", "lerne"],
      "Fjali i ka foljen në vendin e dytë: Ich lerne Deutsch.",
    ),
    p(
      "Sot unë luaj futboll.",
      "Heute spiele ich Fußball.",
      ["ich", "Fußball.", "Heute", "spiele"],
      "Pas Heute, folja mbetet në vendin e dytë.",
    ),
    p(
      "Në mëngjes pi ujë.",
      "Am Morgen trinke ich Wasser.",
      ["Wasser.", "ich", "trinke", "Am Morgen"],
      "Am Morgen vjen në fillim, dhe pastaj trinke.",
    ),
  ]),
  e(1, 3, "Sfida e foljes", "blank", "Zgjidh formën e foljes që i përshtatet subjektit.", [
    p("Ich ____ Deutsch.", "lerne", ["lernst", "lernen", "lerne"], "Ich merr formën lerne."),
    p("Du ____ në Tiranë.", "wohnst", ["wohne", "wohnst", "wohnen"], "Du merr mbaresën -st: wohnst."),
    p("Er ____ einen Apfel.", "isst", ["essen", "esse", "isst"], "Er merr formën isst, versioni jo i rregullt i essen."),
  ]),
  e(1, 4, "Ritmi i përditshëm", "match", "Përputh rutinën gjermane me kuptimin në shqip.", [
    p(
      "Ich stehe um sieben Uhr auf.",
      "Unë zgjohem në shtatë të dielën.",
      ["Unë shkoj në shkollë.", "Unë zgjohem në shtatë të dielën.", "Në mbrëmje bëj detyrat e shtëpisë."],
      "Aufstehen do të thotë të zgjohet; sieben Uhr është shtatë e vogël.",
    ),
    p(
      "Ich gehe zur Schule.",
      "Unë shkoj në shkollë.",
      ["Në mbrëmje bëj detyrat e shtëpisë.", "Unë shkoj në shkollë.", "Unë zgjohem në shtatë të dielën."],
      "Zur Schule gehen do të thotë të shkosh në shkollë.",
    ),
    p(
      "Am Abend mache ich meine Hausaufgaben.",
      "Në mbrëmje bëj detyrat e shtëpisë.",
      ["Unë zgjohem në shtatë të dielën.", "Unë shkoj në shkollë.", "Në mbrëmje bëj detyrat e shtëpisë."],
      "Am Abend do të thotë në mbrëmje; Hausaufgaben do të thotë detyra shtëpie.",
    ),
  ]),
  e(1, 5, "Biseda e përditshme", "dialogue", "Zgjidh një përgjigje natyrale për pyetjen.", [
    p(
      "Wie heißt du?",
      "Ich heiße Mia.",
      ["Mirë, faleminderit. Dhe ti?", "Ich heiße Mia.", "Unë vijn nga Shqipëria."],
      "Përgjigju pyetjes për emrin me Ich heiße…",
    ),
    p(
      "Woher kommst du?",
      "Ich komme aus Albanien.",
      ["Ich heiße Mia.", "Ich komme aus Albanien.", "Mirë, faleminderit. Dhe ti?"],
      "Woher pyet ku vjen dikush.",
    ),
    p(
      "Wie geht es dir?",
      "Mirë, faleminderit. Dhe ti?",
      ["Unë vijn nga Shqipëria.", "Ich heiße Mia.", "Mirë, faleminderit. Dhe ti?"],
      "Wie geht es dir? do të thotë Si je?",
    ),
  ]),
  e(2, 1, "Në kafe", "dialogue", "Zgjidh përgjigjen natyrale në këtë bisedë në kafe.", [
    p(
      "Shërbëtor: Was möchten Sie trinken?",
      "Einen Tee, bitte.",
      ["Jo, faleminderit.", "Einen Tee, bitte.", "Ich heiße Mia."],
      "Einen Tee, bitte. porosit një çaj në mënyrë të sjellshme.",
    ),
    p(
      "Shërbëtor: Möchten Sie noch etwas?",
      "Nein, danke.",
      ["Nein, danke.", "Unë jetoj në Tiranë.", "Guten Morgen ist acht."],
      "Nein, danke. refuzon me të qetë ndonjë gjë tjetër.",
    ),
    p(
      "Klienti: Könnte ich bitte bezahlen?",
      "Natürlich. Das macht 8 Euro.",
      ["Unë vijn nga Shqipëria.", "Natürlich. Das macht 8 Euro.", "Ich lerne Deutsch."],
      "Shërbëtori pranon dhe jep totalin e çmimit.",
    ),
  ]),
  e(2, 2, "Gjej rrugën", "match", "Përputh secilin drejtim me kuptimin në shqip.", [
    p(
      "Gehen Sie geradeaus.",
      "Shko drejt.",
      ["Kthehu majtas.", "Shko drejt.", "Stacioni i trenit është pranë hoteli."],
      "Geradeaus do të thotë drejt.",
    ),
    p(
      "Biegen Sie links ab.",
      "Kthehu majtas.",
      ["Shko drejt.", "Stacioni i trenit është pranë hoteli.", "Kthehu majtas."],
      "Links do të thotë majtas; abbiegen do të thotë të kthehesh.",
    ),
    p(
      "Der Bahnhof ist neben dem Hotel.",
      "Stacioni i trenit është pranë hoteli.",
      ["Stacioni i trenit është pranë hoteli.", "Kthehu majtas.", "Shko drejt."],
      "Neben do të thotë pranë; Bahnhof do të thotë stacion tren.",
    ),
  ]),
  e(2, 3, "Sfida e Perfekt", "blank", "Plotëso fjalinë me foljen ndihmëse të saktë.", [
    p("Gestern ____ ich Fußball gespielt.", "habe", ["bin", "habe", "hat"], "Spielen përdor haben në Perfekt; ich habe."),
    p("Wir ____ nach Berlin gefahren.", "sind", ["haben", "ist", "sind"], "Fahren me një udhëtim përdor sein; wir sind."),
    p("Meine Schwester ____ einen Film gesehen.", "hat", ["hat", "ist", "haben"], "Sehen përdor haben; meine Schwester hat."),
  ]),
  e(2, 4, "Detektivi i gabimeve", "detect", "Zgjidh fjalinë që është gramatikisht e saktë.", [
    p("Si thuash moshën tënde?", "Ich bin 15 Jahre alt.", ["Ich habe 15 Jahre alt.", "Ich bin 15 Jahre alt."], "Gjermanisht përdor sein, jo haben, për të shprehur moshën."),
    p("Zgjidh formën e saktë të foljes.", "Er geht jeden Tag zur Schule.", ["Er geht jeden Tag zur Schule.", "Er gehen jeden Tag zur Schule."], "Er kërkon geht, jo gehen."),
    p("Zgjidh fjalinë e saktë në Perfekt.", "Wir haben Pizza gegessen.", ["Wir sind Pizza gegessen.", "Wir haben Pizza gegessen."], "Essen përdor haben në Perfekt."),
  ]),
  e(2, 5, "Misioni final", "choice", "Vëre në praktikë gjithçka që ke mësuar.", [
    p(
      "Në fundjavë vizitoj miqtë e mi.",
      "Am Wochenende besuche ich meine Freunde.",
      ["ich", "meine Freunde.", "besuche", "Am Wochenende"],
      "Fjala besuche vjen e dyta, pas Am Wochenende.",
      "sentence",
    ),
    p(
      "Zgjidh fjalinë e saktë në Perfekt.",
      "Wir sind am Samstag nach Berlin gefahren.",
      ["Wir haben am Samstag nach Berlin gefahren.", "Wir sind am Samstag nach Berlin gefahren."],
      "Fahren përdor sein për udhëtim në një destinacion.",
      "detect",
    ),
    p(
      "Më falni, si të arrij te stacioni i trenit?",
      "Gehen Sie geradeaus und dann rechts.",
      ["Einen Tee, bitte.", "Gehen Sie geradeaus und dann rechts.", "Ich heiße Mia."],
      "Jep udhëzime: drejt e pastaj djathtas.",
      "dialogue",
    ),
  ]),
];
export const vocabulary = [
  "apple",
  "book",
  "books",
  "house",
  "cat",
  "dog",
  "bread",
  "coffee",
  "water",
  "car",
  "school",
  "train",
  "bus",
  "bicycle",
  "clock",
  "sun",
  "tree",
  "phone",
];
