export type Language = "en" | "ur";

export interface TranslationStrings {
  bankName: string;
  appTitle: string;
  appSubtitle: string;
  tagline: string;
  helpline: string;
  helplineNumber: string;
  assistant24_7: string;
  website: string;
  openMenu: string;
  collapseMenu: string;
  theme: string;
  light: string;
  dark: string;
  language: string;
  langToggleLabel: string;
  newChat: string;
  conversations: string;
  noConversations: string;
  deleteConversation: string;
  officialBank: string;
  officialFooterSub: string;
  welcomeTitle: string;
  welcomeDescription: string;
  faqTitle: string;
  searchingKnowledge: string;
  botLabel: string;
  copyAnswer: string;
  copied: string;
  sourcesCited: string;
  page: string;
  match: string;
  extractedContext: string;
  inputPlaceholder: string;
  pressEnter: string;
  disclaimer: string;
  send: string;
  clearChat: string;
  newConversationTitle: string;
  listen: string;
  stopListening: string;
  readingAloud: string;
  voiceInput: string;
  listeningNow: string;
  voiceInputNotSupported: string;
  voiceInputPermissionDenied: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    bankName: "National Bank of Pakistan",
    appTitle: "AI Knowledge Assistant",
    appSubtitle: "Official Company Knowledge Assistant",
    tagline: "The Nation's Bank",
    helpline: "Helpline",
    helplineNumber: "UAN 111 627 627",
    assistant24_7: "24/7 Digital Assistant",
    website: "www.nbp.com.pk",
    openMenu: "Open Menu",
    collapseMenu: "Collapse Menu",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    language: "Language",
    langToggleLabel: "اردو",
    newChat: "New Chat",
    conversations: "Conversations",
    noConversations: "No conversations yet. Start a new chat!",
    deleteConversation: "Delete Conversation",
    officialBank: "National Bank of Pakistan",
    officialFooterSub: "Official 24/7 Digital Assistant",
    welcomeTitle: "AI Company Knowledge Assistant",
    welcomeDescription:
      "Ask questions about NBP Digital mobile app, biometric banking, debit card limits, consumer financing loans, Asaan accounts, and Aitemaad Islamic banking.",
    faqTitle: "Frequently Asked Questions:",
    searchingKnowledge: "Searching official knowledge base...",
    botLabel: "NBP Knowledge Assistant",
    copyAnswer: "Copy answer",
    copied: "Copied!",
    sourcesCited: "Sources Cited",
    page: "Page",
    match: "match",
    extractedContext: "Extracted Context Chunk:",
    inputPlaceholder: "Ask anything about NBP products, digital banking, loan schemes, cards...",
    pressEnter: "Press Enter ↵ to send",
    disclaimer:
      "Answers are grounded in official public NBP documents and FAQs. Do not share confidential PINs or passwords.",
    send: "Send",
    clearChat: "Clear Chat",
    newConversationTitle: "New Conversation",
    listen: "Listen",
    stopListening: "Stop",
    readingAloud: "Speaking...",
    voiceInput: "Voice Input (Speak)",
    listeningNow: "Listening... speak now in English or Urdu",
    voiceInputNotSupported: "Voice recognition is not supported in this browser.",
    voiceInputPermissionDenied: "Microphone permission was denied.",
  },
  ur: {
    bankName: "نیشنل بینک آف پاکستان",
    appTitle: "اے آئی معلوماتی معاون",
    appSubtitle: "سرکاری ادارہ جاتی معلوماتی معاون",
    tagline: "قوم کا اپنا بینک",
    helpline: "ہیلپ لائن",
    helplineNumber: "یو اے این 627 627 111",
    assistant24_7: "24/7 ڈیجیٹل معاون",
    website: "www.nbp.com.pk",
    openMenu: "فہرست کھولیں",
    collapseMenu: "فہرست بند کریں",
    theme: "تھیم",
    light: "لائٹ",
    dark: "ڈارک",
    language: "زبان",
    langToggleLabel: "English",
    newChat: "نئی گفتگو",
    conversations: "گزشتہ گفتگو",
    noConversations: "ابھی کوئی گفتگو موجود نہیں ہے۔ نئی گفتگو شروع کریں!",
    deleteConversation: "گفتگو ختم کریں",
    officialBank: "نیشنل بینک آف پاکستان",
    officialFooterSub: "سرکاری 24/7 ڈیجیٹل اسسٹنٹ",
    welcomeTitle: "قومی بینک کا اے آئی معلوماتی اسسٹنٹ",
    welcomeDescription:
      "این بی پی ڈیجیٹل ایپ، بائیو میٹرک تصدیق، ڈیبٹ کارڈ کے فیچرز، صارفین کے قرضہ جات، آسان اکاؤنٹس اور اعتماد اسلامک بینکنگ کے بارے میں فوری معلومات حاصل کریں۔",
    faqTitle: "اکثر پوچھے جانے والے سوالات:",
    searchingKnowledge: "سرکاری بینک ریکارڈ سے معلومات تلاش کی جا رہی ہیں...",
    botLabel: "این بی پی معلوماتی معاون",
    copyAnswer: "جواب کاپی کریں",
    copied: "کاپی ہو گیا!",
    sourcesCited: "سرکاری حوالہ جاتی دستاویزات",
    page: "صفحہ",
    match: "مطابقت",
    extractedContext: "دستاویز سے حاصل کردہ اصل عبارت:",
    inputPlaceholder: "این بی پی کی سروسز، ڈیجیٹل بینکنگ، قرضہ جات، یا کارڈز کے بارے میں سوال درج کریں...",
    pressEnter: "ارسال کے لیے Enter ↵ دبائیں",
    disclaimer:
      "تمام جوابات این بی پی کی مستند عوامی دستاویزات پر مبنی ہیں۔ اپنا خفیہ پن کوڈ یا پاس ورڈ شیئر نہ کریں۔",
    send: "ارسال کریں",
    clearChat: "چیٹ صاف کریں",
    newConversationTitle: "نئی گفتگو",
    listen: "آواز سنیں",
    stopListening: "روکیں",
    readingAloud: "پڑھ کر سنا رہا ہے...",
    voiceInput: "آواز سے سوال پوچھیں",
    listeningNow: "سن رہا ہے... اردو یا انگریزی میں بولیں",
    voiceInputNotSupported: "آپ کا براؤزر آواز کی شناخت کو سپورٹ نہیں کرتا۔",
    voiceInputPermissionDenied: "مائیکروفون کی اجازت نہیں ملی۔",
  },
};

export interface LocalizedSampleQuery {
  category: string;
  query: string;
  tag: string;
}

export const SAMPLE_QUERIES_BY_LANG: Record<Language, LocalizedSampleQuery[]> = {
  en: [
    {
      category: "Digital Banking",
      query: "What is NBP Digital and what are the daily transaction limits?",
      tag: "NBP Digital FAQ",
    },
    {
      category: "Debit Cards",
      query: "What are the features and withdrawal limits of NBP Visa Platinum Debit Card?",
      tag: "Debit Cards Guide",
    },
    {
      category: "Consumer Loans",
      query: "How does NBP Advance Plus salary loan work and what is the maximum limit?",
      tag: "Loans & Financing",
    },
    {
      category: "Accounts & Deposits",
      query: "What are the requirements for opening an NBP Asaan Account?",
      tag: "Accounts & Deposits",
    },
    {
      category: "Islamic Banking",
      query: "Explain the Shariah principles and Mudarabah structure of NBP Aitemaad Banking.",
      tag: "Aitemaad Islamic",
    },
    {
      category: "Corporate Overview",
      query: "What is the historical role of NBP as an agent to the State Bank of Pakistan?",
      tag: "Official Website",
    },
  ],
  ur: [
    {
      category: "ڈیجیٹل بینکنگ",
      query: "این بی پی ڈیجیٹل موبائل بینکنگ کی خصوصیات اور روزانہ ٹرانزیکشن کی حد کیا ہے؟",
      tag: "ڈیجیٹل بینکنگ گائیڈ",
    },
    {
      category: "ڈیبٹ کارڈز",
      query: "این بی پی ویزا پلاٹینم ڈیبٹ کارڈ کے فوائد اور اے ٹی ایم سے رقم نکلوانے کی حد کیا ہے؟",
      tag: "ڈیبٹ کارڈز معلومات",
    },
    {
      category: "صارفین کے قرضے",
      query: "این بی پی ایڈوانس پلس سیلری لون کی اہلیت اور زیادہ سے زیادہ حد کیا ہے؟",
      tag: "قرضہ اسکیمیں",
    },
    {
      category: "بینک اکاؤنٹس",
      query: "این بی پی آسان اکاؤنٹ کھولنے کے لیے کن شرائط اور شناختی دستاویزات کی ضرورت ہے؟",
      tag: "اکاؤنٹس تفصیلات",
    },
    {
      category: "اسلامی بینکنگ",
      query: "این بی پی اعتماد اسلامک بینکنگ کے شریعہ اصول اور مضاربہ بچت کھاتے کی تفصیل کیا ہے؟",
      tag: "اعتماد اسلامک",
    },
    {
      category: "قومی بینک کا تعارف",
      query: "اسٹیٹ بینک آف پاکستان کے ایجنٹ کے طور پر این بی پی کا تاریخی کردار کیا ہے؟",
      tag: "این بی پی تعارف",
    },
  ],
};
