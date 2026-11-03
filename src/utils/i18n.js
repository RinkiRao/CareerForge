import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// ==========================================
// CAREERFORGE - 200 SUPPORTED LANGUAGE OPTIONS
// ==========================================

const languageData = `
aa|Afar
ab|Abkhazian
ace|Acehnese
ach|Acholi
ada|Adangme
ady|Adyghe
ae|Avestan
aeb|Tunisian Arabic
af|Afrikaans
ak|Akan
am|Amharic
an|Aragonese
ar|Arabic
as|Assamese
ast|Asturian
av|Avaric
awa|Awadhi
ay|Aymara
az|Azerbaijani
ba|Bashkir
bal|Balochi
ban|Balinese
be|Belarusian
bem|Bemba
bg|Bulgarian
bh|Bihari
bho|Bhojpuri
bi|Bislama
bm|Bambara
bn|Bengali
bo|Tibetan
br|Breton
brx|Bodo
bs|Bosnian
ca|Catalan
ce|Chechen
ceb|Cebuano
ch|Chamorro
ckb|Central Kurdish
co|Corsican
cr|Cree
cs|Czech
cv|Chuvash
cy|Welsh
da|Danish
de|German
doi|Dogri
dv|Dhivehi
dz|Dzongkha
ee|Ewe
el|Greek
en|English
eo|Esperanto
es|Spanish
et|Estonian
eu|Basque
fa|Persian
ff|Fulah
fi|Finnish
fj|Fijian
fo|Faroese
fr|French
fy|Western Frisian
ga|Irish
gd|Scottish Gaelic
gl|Galician
gn|Guarani
gom|Goan Konkani
gu|Gujarati
gv|Manx
ha|Hausa
hak|Hakka Chinese
he|Hebrew
hi|Hindi
hne|Chhattisgarhi
hr|Croatian
ht|Haitian Creole
hu|Hungarian
hy|Armenian
ia|Interlingua
id|Indonesian
ig|Igbo
ii|Sichuan Yi
ik|Inupiaq
ilo|Iloko
is|Icelandic
it|Italian
iu|Inuktitut
ja|Japanese
jv|Javanese
ka|Georgian
kab|Kabyle
kg|Kongo
ki|Kikuyu
kk|Kazakh
kl|Kalaallisut
km|Khmer
kn|Kannada
ko|Korean
kok|Konkani
kr|Kanuri
ks|Kashmiri
ku|Kurdish
kv|Komi
kw|Cornish
ky|Kyrgyz
la|Latin
lb|Luxembourgish
lez|Lezghian
lg|Ganda
li|Limburgan
ln|Lingala
lo|Lao
lt|Lithuanian
lv|Latvian
mai|Maithili
mg|Malagasy
mh|Marshallese
mi|Maori
mk|Macedonian
ml|Malayalam
mn|Mongolian
mni|Manipuri
mr|Marathi
ms|Malay
mt|Maltese
my|Burmese
nan|Min Nan Chinese
nb|Norwegian Bokmal
nd|North Ndebele
ne|Nepali
new|Newari
ng|Ndonga
nl|Dutch
nn|Norwegian Nynorsk
no|Norwegian
nr|South Ndebele
nv|Navajo
ny|Nyanja
oc|Occitan
oj|Ojibwa
om|Oromo
or|Odia
os|Ossetian
pa|Punjabi
pl|Polish
ps|Pashto
pt|Portuguese
qu|Quechua
rm|Romansh
rn|Rundi
ro|Romanian
ru|Russian
rw|Kinyarwanda
sa|Sanskrit
sat|Santali
sc|Sardinian
sd|Sindhi
se|Northern Sami
sg|Sango
si|Sinhala
sk|Slovak
sl|Slovenian
sm|Samoan
sn|Shona
so|Somali
sq|Albanian
sr|Serbian
ss|Swati
st|Southern Sotho
su|Sundanese
sv|Swedish
sw|Swahili
ta|Tamil
te|Telugu
tg|Tajik
th|Thai
ti|Tigrinya
tk|Turkmen
tl|Tagalog
tn|Tswana
to|Tonga
tr|Turkish
ts|Tsonga
tt|Tatar
ty|Tahitian
ug|Uyghur
uk|Ukrainian
ur|Urdu
uz|Uzbek
ve|Venda
vi|Vietnamese
wa|Walloon
wo|Wolof
xh|Xhosa
yi|Yiddish
yo|Yoruba
za|Zhuang
zh|Chinese
zu|Zulu
`.trim();

// ==========================================
// CREATE LANGUAGE OPTIONS
// ==========================================

const nativeNames = {
  en: "English",
  hi: "हिन्दी",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ar: "العربية",
  pt: "Português",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ru: "Русский",
  it: "Italiano",
  bn: "বাংলা",
  ur: "اردو",
  id: "Bahasa Indonesia",
};

export const supportedLanguages = languageData
  .split("\n")
  .map((line) => {
    const [code, englishName] = line.split("|");

    let nativeName = englishName;

    try {
      const displayNames = new Intl.DisplayNames(
        [code],
        { type: "language" }
      );

      nativeName = displayNames.of(code) || englishName;
    } catch {
      nativeName = englishName;
    }

    return {
      code,
      name: englishName,
      nativeName: nativeNames[code] || nativeName,
    };
  });

// Verify the language list
if (supportedLanguages.length !== 200) {
  console.warn(
    "Expected 200 languages, found:",
    supportedLanguages.length
  );
}

// ==========================================
// TRANSLATIONS
// ==========================================

const resources = {
  en: {
    translation: {
      home: "Home",
      about: "About",
      register: "Register",
      login: "Login",
      logout: "Logout",
      dashboard: "Dashboard",
      welcome: "Welcome",
      profile: "My Profile",
      settings: "Settings",
      language: "Language",
      search: "Search",
      save: "Save Changes",
      back: "Back",
      courses: "Courses",
      learn: "Learn",
      jobs: "Jobs",
      internships: "Internships",
      companies: "Companies",
      students: "Students",
      skills: "Skills",
      projects: "Projects",
      certificates: "Certificates",
      messages: "Messages",
      notifications: "Notifications",
      explore: "Explore Opportunities",
      myCourses: "My Courses",
      progress: "My Progress",
      continueLearning: "Continue Learning",
      createAccount: "Create Account",
      email: "Email Address",
      password: "Password",
      fullName: "Full Name",
      confirmPassword: "Confirm Password",
      student: "Student",
      company: "Company",
      owner: "Owner",
      studentDashboard: "Student Dashboard",
      careerJourney: "Your Career Journey",
      preferredLanguage: "Preferred Language",
    },
  },

  hi: {
    translation: {
      home: "होम",
      about: "हमारे बारे में",
      register: "रजिस्ट्रेशन",
      login: "लॉगिन",
      logout: "लॉगआउट",
      dashboard: "डैशबोर्ड",
      welcome: "आपका स्वागत है",
      profile: "मेरी प्रोफाइल",
      settings: "सेटिंग्स",
      language: "भाषा",
      search: "खोजें",
      save: "बदलाव सेव करें",
      back: "वापस",
      courses: "कोर्स",
      learn: "सीखें",
      jobs: "नौकरियाँ",
      internships: "इंटर्नशिप",
      companies: "कंपनियाँ",
      students: "विद्यार्थी",
      skills: "कौशल",
      projects: "प्रोजेक्ट",
      certificates: "प्रमाणपत्र",
      messages: "संदेश",
      notifications: "सूचनाएँ",
      explore: "अवसर खोजें",
      myCourses: "मेरे कोर्स",
      progress: "मेरी प्रगति",
      continueLearning: "सीखना जारी रखें",
      createAccount: "अकाउंट बनाएँ",
      email: "ईमेल पता",
      password: "पासवर्ड",
      fullName: "पूरा नाम",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      student: "विद्यार्थी",
      company: "कंपनी",
      owner: "मालिक",
      studentDashboard: "स्टूडेंट डैशबोर्ड",
      careerJourney: "आपका करियर सफर",
      preferredLanguage: "पसंदीदा भाषा",
    },
  },

  es: {
    translation: {
      home: "Inicio",
      about: "Acerca de",
      register: "Registrarse",
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
      dashboard: "Panel",
      welcome: "Bienvenido",
      profile: "Mi perfil",
      settings: "Configuración",
      language: "Idioma",
      search: "Buscar",
      save: "Guardar cambios",
      back: "Volver",
      courses: "Cursos",
      learn: "Aprender",
      jobs: "Empleos",
      internships: "Prácticas",
      companies: "Empresas",
      students: "Estudiantes",
      skills: "Habilidades",
      projects: "Proyectos",
      certificates: "Certificados",
      messages: "Mensajes",
      notifications: "Notificaciones",
      explore: "Explorar oportunidades",
      myCourses: "Mis cursos",
      progress: "Mi progreso",
      continueLearning: "Continuar aprendiendo",
      createAccount: "Crear cuenta",
      email: "Correo electrónico",
      password: "Contraseña",
      fullName: "Nombre completo",
      confirmPassword: "Confirmar contraseña",
      student: "Estudiante",
      company: "Empresa",
      owner: "Propietario",
      studentDashboard: "Panel del estudiante",
      careerJourney: "Tu trayectoria profesional",
      preferredLanguage: "Idioma preferido",
    },
  },

  fr: {
    translation: {
      home: "Accueil",
      about: "À propos",
      register: "S'inscrire",
      login: "Connexion",
      logout: "Déconnexion",
      dashboard: "Tableau de bord",
      welcome: "Bienvenue",
      profile: "Mon profil",
      settings: "Paramètres",
      language: "Langue",
      search: "Rechercher",
      save: "Enregistrer",
      back: "Retour",
      courses: "Cours",
      learn: "Apprendre",
      jobs: "Emplois",
      internships: "Stages",
      companies: "Entreprises",
      students: "Étudiants",
      skills: "Compétences",
      projects: "Projets",
      certificates: "Certificats",
      messages: "Messages",
      notifications: "Notifications",
      explore: "Explorer les opportunités",
      myCourses: "Mes cours",
      progress: "Ma progression",
      continueLearning: "Continuer à apprendre",
      createAccount: "Créer un compte",
      email: "Adresse e-mail",
      password: "Mot de passe",
      fullName: "Nom complet",
      confirmPassword: "Confirmer le mot de passe",
      student: "Étudiant",
      company: "Entreprise",
      owner: "Propriétaire",
      studentDashboard: "Tableau de bord étudiant",
      careerJourney: "Votre parcours professionnel",
      preferredLanguage: "Langue préférée",
    },
  },

  de: {
    translation: {
      home: "Startseite",
      about: "Über uns",
      register: "Registrieren",
      login: "Anmelden",
      logout: "Abmelden",
      dashboard: "Dashboard",
      welcome: "Willkommen",
      profile: "Mein Profil",
      settings: "Einstellungen",
      language: "Sprache",
      search: "Suchen",
      save: "Änderungen speichern",
      back: "Zurück",
      courses: "Kurse",
      learn: "Lernen",
      jobs: "Jobs",
      internships: "Praktika",
      companies: "Unternehmen",
      students: "Studierende",
      skills: "Fähigkeiten",
      projects: "Projekte",
      certificates: "Zertifikate",
      messages: "Nachrichten",
      notifications: "Benachrichtigungen",
      explore: "Möglichkeiten entdecken",
      myCourses: "Meine Kurse",
      progress: "Mein Fortschritt",
      continueLearning: "Weiterlernen",
      createAccount: "Konto erstellen",
      email: "E-Mail-Adresse",
      password: "Passwort",
      fullName: "Vollständiger Name",
      confirmPassword: "Passwort bestätigen",
      student: "Student",
      company: "Unternehmen",
      owner: "Eigentümer",
      studentDashboard: "Studenten-Dashboard",
      careerJourney: "Dein Karriereweg",
      preferredLanguage: "Bevorzugte Sprache",
    },
  },

  ar: {
    translation: {
      home: "الرئيسية",
      about: "من نحن",
      register: "التسجيل",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      dashboard: "لوحة التحكم",
      welcome: "مرحباً",
      profile: "ملفي الشخصي",
      settings: "الإعدادات",
      language: "اللغة",
      search: "بحث",
      save: "حفظ التغييرات",
      back: "رجوع",
      courses: "الدورات",
      learn: "التعلم",
      jobs: "الوظائف",
      internships: "التدريب",
      companies: "الشركات",
      students: "الطلاب",
      skills: "المهارات",
      projects: "المشاريع",
      certificates: "الشهادات",
      messages: "الرسائل",
      notifications: "الإشعارات",
      explore: "استكشف الفرص",
      myCourses: "دوراتي",
      progress: "تقدمي",
      continueLearning: "متابعة التعلم",
      createAccount: "إنشاء حساب",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      fullName: "الاسم الكامل",
      confirmPassword: "تأكيد كلمة المرور",
      student: "طالب",
      company: "شركة",
      owner: "المالك",
      studentDashboard: "لوحة تحكم الطالب",
      careerJourney: "رحلتك المهنية",
      preferredLanguage: "اللغة المفضلة",
    },
  },

  pt: {
    translation: {
      home: "Início",
      about: "Sobre",
      register: "Cadastrar",
      login: "Entrar",
      logout: "Sair",
      dashboard: "Painel",
      welcome: "Bem-vindo",
      profile: "Meu perfil",
      settings: "Configurações",
      language: "Idioma",
      search: "Pesquisar",
      save: "Salvar alterações",
      back: "Voltar",
      courses: "Cursos",
      learn: "Aprender",
      jobs: "Empregos",
      internships: "Estágios",
      companies: "Empresas",
      students: "Estudantes",
      skills: "Habilidades",
      projects: "Projetos",
      certificates: "Certificados",
      messages: "Mensagens",
      notifications: "Notificações",
      explore: "Explorar oportunidades",
      myCourses: "Meus cursos",
      progress: "Meu progresso",
      continueLearning: "Continuar aprendendo",
      createAccount: "Criar conta",
      email: "Endereço de e-mail",
      password: "Senha",
      fullName: "Nome completo",
      confirmPassword: "Confirmar senha",
      student: "Estudante",
      company: "Empresa",
      owner: "Proprietário",
      studentDashboard: "Painel do estudante",
      careerJourney: "Sua jornada profissional",
      preferredLanguage: "Idioma preferido",
    },
  },

  zh: {
    translation: {
      home: "首页",
      about: "关于我们",
      register: "注册",
      login: "登录",
      logout: "退出登录",
      dashboard: "控制面板",
      welcome: "欢迎",
      profile: "我的资料",
      settings: "设置",
      language: "语言",
      search: "搜索",
      save: "保存更改",
      back: "返回",
      courses: "课程",
      learn: "学习",
      jobs: "工作",
      internships: "实习",
      companies: "公司",
      students: "学生",
      skills: "技能",
      projects: "项目",
      certificates: "证书",
      messages: "消息",
      notifications: "通知",
      explore: "探索机会",
      myCourses: "我的课程",
      progress: "我的进度",
      continueLearning: "继续学习",
      createAccount: "创建账户",
      email: "电子邮件",
      password: "密码",
      fullName: "全名",
      confirmPassword: "确认密码",
      student: "学生",
      company: "公司",
      owner: "所有者",
      studentDashboard: "学生控制面板",
      careerJourney: "你的职业旅程",
      preferredLanguage: "首选语言",
    },
  },

  ja: {
    translation: {
      home: "ホーム",
      about: "私たちについて",
      register: "登録",
      login: "ログイン",
      logout: "ログアウト",
      dashboard: "ダッシュボード",
      welcome: "ようこそ",
      profile: "プロフィール",
      settings: "設定",
      language: "言語",
      search: "検索",
      save: "変更を保存",
      back: "戻る",
      courses: "コース",
      learn: "学習",
      jobs: "求人",
      internships: "インターンシップ",
      companies: "企業",
      students: "学生",
      skills: "スキル",
      projects: "プロジェクト",
      certificates: "証明書",
      messages: "メッセージ",
      notifications: "通知",
      explore: "機会を探す",
      myCourses: "マイコース",
      progress: "学習の進捗",
      continueLearning: "学習を続ける",
      createAccount: "アカウントを作成",
      email: "メールアドレス",
      password: "パスワード",
      fullName: "氏名",
      confirmPassword: "パスワードを確認",
      student: "学生",
      company: "企業",
      owner: "管理者",
      studentDashboard: "学生ダッシュボード",
      careerJourney: "あなたのキャリアの旅",
      preferredLanguage: "希望する言語",
    },
  },

  ko: {
    translation: {
      home: "홈",
      about: "소개",
      register: "회원가입",
      login: "로그인",
      logout: "로그아웃",
      dashboard: "대시보드",
      welcome: "환영합니다",
      profile: "내 프로필",
      settings: "설정",
      language: "언어",
      search: "검색",
      save: "변경 사항 저장",
      back: "뒤로",
      courses: "강좌",
      learn: "학습",
      jobs: "채용",
      internships: "인턴십",
      companies: "기업",
      students: "학생",
      skills: "기술",
      projects: "프로젝트",
      certificates: "인증서",
      messages: "메시지",
      notifications: "알림",
      explore: "기회 탐색",
      myCourses: "내 강좌",
      progress: "내 진행 상황",
      continueLearning: "학습 계속하기",
      createAccount: "계정 만들기",
      email: "이메일 주소",
      password: "비밀번호",
      fullName: "성명",
      confirmPassword: "비밀번호 확인",
      student: "학생",
      company: "기업",
      owner: "소유자",
      studentDashboard: "학생 대시보드",
      careerJourney: "나의 커리어 여정",
      preferredLanguage: "선호 언어",
    },
  },

  ru: {
    translation: {
      home: "Главная",
      about: "О нас",
      register: "Регистрация",
      login: "Войти",
      logout: "Выйти",
      dashboard: "Панель управления",
      welcome: "Добро пожаловать",
      profile: "Мой профиль",
      settings: "Настройки",
      language: "Язык",
      search: "Поиск",
      save: "Сохранить изменения",
      back: "Назад",
      courses: "Курсы",
      learn: "Обучение",
      jobs: "Вакансии",
      internships: "Стажировки",
      companies: "Компании",
      students: "Студенты",
      skills: "Навыки",
      projects: "Проекты",
      certificates: "Сертификаты",
      messages: "Сообщения",
      notifications: "Уведомления",
      explore: "Изучить возможности",
      myCourses: "Мои курсы",
      progress: "Мой прогресс",
      continueLearning: "Продолжить обучение",
      createAccount: "Создать аккаунт",
      email: "Электронная почта",
      password: "Пароль",
      fullName: "Полное имя",
      confirmPassword: "Подтвердить пароль",
      student: "Студент",
      company: "Компания",
      owner: "Владелец",
      studentDashboard: "Панель студента",
      careerJourney: "Ваш карьерный путь",
      preferredLanguage: "Предпочитаемый язык",
    },
  },

  it: {
    translation: {
      home: "Home",
      about: "Chi siamo",
      register: "Registrati",
      login: "Accedi",
      logout: "Esci",
      dashboard: "Dashboard",
      welcome: "Benvenuto",
      profile: "Il mio profilo",
      settings: "Impostazioni",
      language: "Lingua",
      search: "Cerca",
      save: "Salva modifiche",
      back: "Indietro",
      courses: "Corsi",
      learn: "Impara",
      jobs: "Lavoro",
      internships: "Tirocini",
      companies: "Aziende",
      students: "Studenti",
      skills: "Competenze",
      projects: "Progetti",
      certificates: "Certificati",
      messages: "Messaggi",
      notifications: "Notifiche",
      explore: "Esplora opportunità",
      myCourses: "I miei corsi",
      progress: "I miei progressi",
      continueLearning: "Continua a imparare",
      createAccount: "Crea account",
      email: "Indirizzo email",
      password: "Password",
      fullName: "Nome completo",
      confirmPassword: "Conferma password",
      student: "Studente",
      company: "Azienda",
      owner: "Proprietario",
      studentDashboard: "Dashboard dello studente",
      careerJourney: "Il tuo percorso professionale",
      preferredLanguage: "Lingua preferita",
    },
  },

  bn: {
    translation: {
      home: "হোম",
      about: "আমাদের সম্পর্কে",
      register: "নিবন্ধন",
      login: "লগইন",
      logout: "লগআউট",
      dashboard: "ড্যাশবোর্ড",
      welcome: "স্বাগতম",
      profile: "আমার প্রোফাইল",
      settings: "সেটিংস",
      language: "ভাষা",
      search: "অনুসন্ধান",
      save: "পরিবর্তন সংরক্ষণ করুন",
      back: "ফিরে যান",
      courses: "কোর্স",
      learn: "শিখুন",
      jobs: "চাকরি",
      internships: "ইন্টার্নশিপ",
      companies: "কোম্পানি",
      students: "শিক্ষার্থী",
      skills: "দক্ষতা",
      projects: "প্রকল্প",
      certificates: "সার্টিফিকেট",
      messages: "বার্তা",
      notifications: "বিজ্ঞপ্তি",
      explore: "সুযোগ খুঁজুন",
      myCourses: "আমার কোর্স",
      progress: "আমার অগ্রগতি",
      continueLearning: "শেখা চালিয়ে যান",
      createAccount: "অ্যাকাউন্ট তৈরি করুন",
      email: "ইমেইল ঠিকানা",
      password: "পাসওয়ার্ড",
      fullName: "পূর্ণ নাম",
      confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
      student: "শিক্ষার্থী",
      company: "কোম্পানি",
      owner: "মালিক",
      studentDashboard: "শিক্ষার্থী ড্যাশবোর্ড",
      careerJourney: "আপনার ক্যারিয়ার যাত্রা",
      preferredLanguage: "পছন্দের ভাষা",
    },
  },

  ur: {
    translation: {
      home: "ہوم",
      about: "ہمارے بارے میں",
      register: "رجسٹریشن",
      login: "لاگ ان",
      logout: "لاگ آؤٹ",
      dashboard: "ڈیش بورڈ",
      welcome: "خوش آمدید",
      profile: "میری پروفائل",
      settings: "ترتیبات",
      language: "زبان",
      search: "تلاش کریں",
      save: "تبدیلیاں محفوظ کریں",
      back: "واپس",
      courses: "کورسز",
      learn: "سیکھیں",
      jobs: "ملازمتیں",
      internships: "انٹرن شپ",
      companies: "کمپنیاں",
      students: "طلبہ",
      skills: "مہارتیں",
      projects: "پروجیکٹس",
      certificates: "سرٹیفکیٹس",
      messages: "پیغامات",
      notifications: "اطلاعات",
      explore: "مواقع تلاش کریں",
      myCourses: "میرے کورسز",
      progress: "میری پیش رفت",
      continueLearning: "سیکھنا جاری رکھیں",
      createAccount: "اکاؤنٹ بنائیں",
      email: "ای میل پتہ",
      password: "پاس ورڈ",
      fullName: "پورا نام",
      confirmPassword: "پاس ورڈ کی تصدیق کریں",
      student: "طالب علم",
      company: "کمپنی",
      owner: "مالک",
      studentDashboard: "طالب علم ڈیش بورڈ",
      careerJourney: "آپ کا کیریئر کا سفر",
      preferredLanguage: "پسندیدہ زبان",
    },
  },

  id: {
    translation: {
      home: "Beranda",
      about: "Tentang Kami",
      register: "Daftar",
      login: "Masuk",
      logout: "Keluar",
      dashboard: "Dasbor",
      welcome: "Selamat Datang",
      profile: "Profil Saya",
      settings: "Pengaturan",
      language: "Bahasa",
      search: "Cari",
      save: "Simpan Perubahan",
      back: "Kembali",
      courses: "Kursus",
      learn: "Belajar",
      jobs: "Pekerjaan",
      internships: "Magang",
      companies: "Perusahaan",
      students: "Siswa",
      skills: "Keterampilan",
      projects: "Proyek",
      certificates: "Sertifikat",
      messages: "Pesan",
      notifications: "Notifikasi",
      explore: "Jelajahi Peluang",
      myCourses: "Kursus Saya",
      progress: "Kemajuan Saya",
      continueLearning: "Lanjutkan Belajar",
      createAccount: "Buat Akun",
      email: "Alamat Email",
      password: "Kata Sandi",
      fullName: "Nama Lengkap",
      confirmPassword: "Konfirmasi Kata Sandi",
      student: "Siswa",
      company: "Perusahaan",
      owner: "Pemilik",
      studentDashboard: "Dasbor Siswa",
      careerJourney: "Perjalanan Karier Anda",
      preferredLanguage: "Bahasa Pilihan",
    },
  },
};

// ==========================================
// INITIAL LANGUAGE
// ==========================================

const storedLanguage =
  localStorage.getItem("careerforge_language") || "en";

const initialLanguage = supportedLanguages.some(
  (language) => language.code === storedLanguage
)
  ? storedLanguage
  : "en";

// ==========================================
// INITIALIZE I18NEXT
// ==========================================

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: supportedLanguages.map(
    (language) => language.code
  ),
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// ==========================================
// GLOBAL LANGUAGE FUNCTION
// ==========================================

export const setAppLanguage = (languageCode) => {
  const validLanguage = supportedLanguages.some(
    (language) => language.code === languageCode
  );

  if (!validLanguage) {
    console.warn("Unsupported language:", languageCode);
    return;
  }

  i18n.changeLanguage(languageCode);

  localStorage.setItem(
    "careerforge_language",
    languageCode
  );

  document.documentElement.lang = languageCode;

  document.documentElement.dir =
    ["ar", "ur", "aeb", "ckb"].includes(languageCode)
      ? "rtl"
      : "ltr";
};

// ==========================================
// LANGUAGE CHANGE EVENT
// ==========================================

i18n.on("languageChanged", (languageCode) => {
  localStorage.setItem(
    "careerforge_language",
    languageCode
  );

  document.documentElement.lang = languageCode;

  document.documentElement.dir =
    ["ar", "ur", "aeb", "ckb"].includes(languageCode)
      ? "rtl"
      : "ltr";
});

// INITIAL PAGE DIRECTION

document.documentElement.lang = initialLanguage;

document.documentElement.dir =
  ["ar", "ur", "aeb", "ckb"].includes(initialLanguage)
    ? "rtl"
    : "ltr";

export default i18n;