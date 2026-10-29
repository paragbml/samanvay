import { useState, useEffect } from "react";

export type SupportedLanguage =
  | "en"
  | "hi"
  | "bn"
  | "te"
  | "mr"
  | "ta"
  | "gu"
  | "ur"
  | "kn"
  | "or"
  | "ml"
  | "pa"
  | "as"
  | "mai"
  | "sa"
  | "sd"
  | "ne"
  | "kok"
  | "doi"
  | "mni"
  | "sat"
  | "ks"
  | "bo";

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  native: string;
}

export const INDIAN_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "as", label: "Assamese", native: "অসমীয়া" },
  { code: "sa", label: "Sanskrit", native: "संस्कृतम्" },
  { code: "ne", label: "Nepali", native: "नेपाली" },
  { code: "mai", label: "Maithili", native: "मैथिली" },
  { code: "kok", label: "Konkani", native: "कोंकणी" },
  { code: "sd", label: "Sindhi", native: "سنڌي" },
  { code: "doi", label: "Dogri", native: "डोगरी" },
  { code: "ks", label: "Kashmiri", native: "कॉशुर" },
  { code: "mni", label: "Manipuri", native: "মৈতৈলোন্" },
  { code: "sat", label: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "bo", label: "Bodo", native: "बड़ो" },
];

export const TRANSLATIONS: Record<string, Partial<Record<SupportedLanguage, string>>> = {
  // Navigation
  "Work queue": {
    hi: "कार्य सूची",
    mr: "कार्य सूची",
    bn: "কাজের সারি",
    ta: "பணி வரிசை",
    te: "పని క్యూ",
    gu: "કાર્ય સૂચિ",
    kn: "ಕೆಲಸದ ಸಾಲು",
    ml: "വർക്ക് ക്യൂ",
    pa: "ਕੰਮ ਦੀ ਕਤਾਰ",
    or: "କାର୍ଯ୍ୟ ଧାଡ଼ି",
    ur: "کام کی قطار",
    as: "কামৰ শাৰী",
    sa: "कार्यतालिका",
    ne: "कार्य सूची",
  },
  "Complaints": {
    hi: "शिकायतें",
    mr: "तक्रारी",
    bn: "অভিযোগ",
    ta: "புகார்கள்",
    te: "ఫిర్యాదులు",
    gu: "ફરિયાદો",
    kn: "ದೂರುಗಳು",
    ml: "പരാതികൾ",
    pa: "ਸ਼ਿਕਾਇਤਾਂ",
    or: "ଅଭିଯୋଗ",
    ur: "شکایات",
    as: "অভিযোগসমূহ",
    sa: "अभियोगाः",
    ne: "गुनासाहरू",
  },
  "Institutions": {
    hi: "संस्थान",
    mr: "संस्था",
    bn: "প্রতিষ্ঠান",
    ta: "நிறுவனங்கள்",
    te: "సంస్థలు",
    gu: "સંસ્થાઓ",
    kn: "ಸಂಸ್ಥೆಗಳು",
    ml: "സ്ഥാപനങ്ങൾ",
    pa: "ਸੰਸਥਾਵਾਂ",
    or: "ଅନୁଷ୍ଠାନ",
    ur: "ادارے",
    as: "প্ৰতিষ্ঠানসমূহ",
    sa: "संस्थाः",
    ne: "संस्थाहरू",
  },
  "Coordination": {
    hi: "समन्वय",
    mr: "समन्वय",
    bn: "সমন্বয়",
    ta: "ஒருங்கிணைப்பு",
    te: "సమన్వయం",
    gu: "સંકલન",
    kn: "ಸಮನ್ವಯ",
    ml: "ഏകോപനം",
    pa: "ਤਾਲਮੇਲ",
    or: "ସମନ୍ୱୟ",
    ur: "رابطہ کاری",
    as: "সমন্বয়",
    sa: "समन्वयः",
    ne: "समन्वय",
  },
  "Reports": {
    hi: "रिपोर्ट",
    mr: "अहवाल",
    bn: "প্রতিবেদন",
    ta: "அறிக்கைகள்",
    te: "నివేదికలు",
    gu: "અહેવાલો",
    kn: "ವರದಿಗಳು",
    ml: "റിപ്പോർട്ടുകൾ",
    pa: "ਰਿਪੋਰਟਾਂ",
    or: "ରିପୋର୍ଟ",
    ur: "رپورٹس",
    as: "প্ৰতিবেদন",
    sa: "विवरणानि",
    ne: "प्रतिवेदनहरू",
  },
  "Transfers": {
    hi: "स्थानांतरण",
    mr: "हस्तांतरण",
    bn: "স্থানান্তর",
    ta: "இடமாற்றங்கள்",
    te: "బదిలీలు",
    gu: "બદલીઓ",
    kn: "ವರ್ಗಾವಣೆಗಳು",
    ml: "കൈമാറ്റങ്ങൾ",
    pa: "ਤਬਾਦਲੇ",
    or: "ସ୍ଥାନାନ୍ତର",
    ur: "تبادلے",
    as: "স্থানান্তৰ",
    sa: "स्थानान्तरणम्",
    ne: "सरुवा",
  },
  "Notifications": {
    hi: "सूचनाएं",
    mr: "सूचना",
    bn: "বিজ্ঞপ্তি",
    ta: "அறிவிப்புகள்",
    te: "నోటిఫికేషన్లు",
    gu: "સૂચનાઓ",
    kn: "ಅಧಿಸೂಚನೆಗಳು",
    ml: "അറിയിപ്പുകൾ",
    pa: "ਸੂਚਨਾਵਾਂ",
    or: "ବିଜ୍ଞପ୍ତି",
    ur: "اطلاعات",
    as: "জাননী",
    sa: "सूचनाः",
    ne: "सूचनाहरू",
  },
  "Help & demo": {
    hi: "सहायता एवं डेमो",
    mr: "मदत आणि डेमो",
    bn: "সাহায্য ও ডেমো",
    ta: "உதவி & டெமோ",
    te: "సహాయం & డెమో",
    gu: "મદદ અને ડેમો",
    kn: "ಸಹಾಯ ಮತ್ತು ಡೆಮೊ",
    ml: "സഹായവും ഡെമോയും",
    pa: "ਮਦਦ ਅਤੇ ਡੈਮੋ",
    or: "ସହାୟତା ଏବଂ ଡେମୋ",
    ur: "مدد اور ڈیمو",
    as: "সহায় আৰু ডেমো",
    sa: "सहाय्यं च डेमो",
    ne: "सहयोग र डेमो",
  },

  // Actions and topbar
  "Sign out": {
    hi: "लॉग आउट",
    mr: "लॉग आउट",
    bn: "লগ আউট",
    ta: "வெளியேறு",
    te: "లాగ్ అవుట్",
    gu: "સાઇન આઉટ",
    kn: "ಸೈನ್ ಔಟ್",
    ml: "സൈൻ ഔട്ട്",
    pa: "ਸਾਈਨ ਆਊਟ",
    or: "ସାଇନ୍ ଆଉଟ୍",
    ur: "سائن آؤٹ",
    as: "লগ আউট",
    sa: "निर्गमनम्",
    ne: "लग आउट",
  },
  "Find a complaint or institution": {
    hi: "शिकायत या संस्थान खोजें...",
    mr: "तक्रार किंवा संस्था शोधा...",
    bn: "অভিযোগ বা প্রতিষ্ঠান খুঁজুন...",
    ta: "புகார் அல்லது நிறுவனத்தைத் தேடுங்கள்...",
    te: "ఫిర్యాదు లేదా సంస్థను వెతకండి...",
    gu: "ફરિયાદ અથવા સંસ્થા શોધો...",
    kn: "ದೂರು ಅಥವಾ ಸಂಸ್ಥೆಯನ್ನು ಹುಡುಕಿ...",
    ml: "പരാതിയോ സ്ഥാപനമോ തിരയുക...",
    pa: "ਸ਼ਿਕਾਇਤ ਜਾਂ ਸੰਸਥਾ ਲੱਭੋ...",
    or: "ଅଭିଯୋଗ କିମ୍ବା ଅନୁଷ୍ଠାନ ଖୋଜନ୍ତୁ...",
    ur: "شکایت یا ادارہ تلاش کریں...",
    as: "অভিযোগ বা প্ৰতিষ্ঠান সন্ধান কৰক...",
  },
  "New complaint": {
    hi: "नई शिकायत",
    mr: "नवीन तक्रार",
    bn: "নতুন অভিযোগ",
    ta: "புதிய புகார்",
    te: "కొత్త ఫిర్యాదు",
    gu: "નવી ફરિયાદ",
    kn: "ಹೊಸ ದೂರು",
    ml: "പുതിയ പരാതി",
    pa: "ਨਵੀਂ ਸ਼ਿਕਾਇਤ",
    or: "ନୂତନ ଅଭିଯୋଗ",
    ur: "نئی شکایت",
    as: "নতুন অভিযোগ",
    sa: "नूतनाभियोगः",
    ne: "नयाँ गुनासो",
  },

  // Workspace headers & filters
  "Your workspace": {
    hi: "आपका कार्यक्षेत्र",
    mr: "आपले कार्यक्षेत्र",
    bn: "আপনার কর্মক্ষেত্র",
    ta: "உங்கள் பணியிடம்",
    te: "మీ కార్యస్థలం",
    gu: "તમારું કાર્યસ્થળ",
    kn: "ನಿಮ್ಮ ಕೆಲಸದ ಸ್ಥಳ",
    ml: "നിങ്ങളുടെ ജോലിസ്ഥലം",
    pa: "ਤੁਹਾਡਾ ਕਾਰਜ ਖੇਤਰ",
    or: "ଆପଣଙ୍କ କାର୍ଯ୍ୟକ୍ଷେତ୍ର",
    ur: "آپ کا ورک اسپیس",
    as: "আপোনাৰ কৰ্মক্ষেত্ৰ",
    sa: "भवतः कार्यक्षेत्रम्",
    ne: "तपाईंको कार्यक्षेत्र",
  },
  "Every complaint has an owner. Every team has a next step.": {
    hi: "प्रत्येक शिकायत का एक उत्तरदायी अधिकारी है। प्रत्येक टीम का एक अगला कदम है।",
    mr: "प्रत्येक तक्रारीला एक जबाबदार अधिकारी आहे. प्रत्येक पथकाचे पुढील पाऊल निश्चित आहे.",
    bn: "প্রতিটি অভিযোগের একজন দায়িত্বপ্রাপ্ত কর্মকর্তা আছেন। প্রতিটি দলের পরবর্তী পদক্ষেপ রয়েছে।",
    ta: "ஒவ்வொரு புகாருக்கும் ஒரு பொறுப்பாளர் உண்டு. ஒவ்வொரு குழுவிற்கும் அடுத்த படி உண்டு.",
    te: "ప్రతి ఫిర్యాదుకు ఒక యజమాని ఉంటారు. ప్రతి బృందానికి ఒక తదుపరి దశ ఉంటుంది.",
    gu: "દરેક ફરિયાદનો એક જવાબદાર અધિકારી છે. દરેક ટીમનું એક આગલું પગલું છે.",
  },
  "Case queue": {
    hi: "शिकायत कतार",
    mr: "तक्रार रांग",
    bn: "মামলার সারি",
    ta: "வழக்கு வரிசை",
    te: "కేసు క్యూ",
    gu: "કેસ કતાર",
    kn: "ಪ್ರಕರಣಗಳ ಸಾಲು",
    ml: "കേസ് ക്യൂ",
    pa: "ਕੇਸ ਕਤਾਰ",
    or: "କେସ୍ ଧାଡ଼ି",
    ur: "کیس قطار",
    as: "গোচৰৰ শাৰী",
  },
  "Shared plans": {
    hi: "साझा योजनाएं",
    mr: "सामायिक योजना",
    bn: "ভাগ করা পরিকল্পনা",
    ta: "பகிர்ந்த திட்டங்கள்",
    te: "భాగస్వామ్య ప్రణాళికలు",
    gu: "શેર કરેલ યોજનાઓ",
    kn: "ಹಂಚಿಕೊಂಡ ಯೋಜನೆಗಳು",
    ml: "പങ്കുവെച്ച പദ്ധതികൾ",
    pa: "ਸਾਂਝੀਆਂ ਯੋਜਨਾਵਾਂ",
    or: "ଅଂଶୀଦାର ଯୋଜନା",
    ur: "مشترکہ منصوبے",
    as: "উমৈহতীয়া পৰিকল্পনা",
  },
  "All open": {
    hi: "सभी खुली",
    mr: "सर्व चालू",
    bn: "সব খোলা",
    ta: "அனைத்தும் திறந்தவை",
    te: "అన్నీ తెరిచి ఉన్నాయి",
    gu: "બધા ખુલ્લા",
    kn: "ಎಲ್ಲವೂ ತೆರೆದಿವೆ",
    ml: "എല്ലാം തുറന്നവ",
    pa: "ਸਾਰੇ ਖੁੱਲ੍ਹੇ",
    or: "ସମସ୍ତ ଖୋଲା",
    ur: "سب کھلے ہیں",
    as: "সকলো খোলা",
  },
  "Overdue": {
    hi: "अतिदेय",
    mr: "मुदत संपलेले",
    bn: "মেয়াদোত্তীর্ণ",
    ta: "தாமதமானவை",
    te: "గడువు ముగిసినవి",
    gu: "મુદત વીતી ગયેલ",
    kn: "ಅವಧಿ ಮೀರಿದ",
    ml: "കാലഹരണപ്പെട്ടത്",
    pa: "ਬਕਾਇਆ",
    or: "ମିଆଦ ପୂରିତ",
    ur: "واجب الادا",
    as: "ম্যাদ উকলি যোৱা",
  },
  "Assigned to me": {
    hi: "मुझे सौंपी गई",
    mr: "मला नेमून दिलेले",
    bn: "আমাকে অর্পিত",
    ta: "எனக்கு ஒதுக்கப்பட்டது",
    te: "నాకు కేటాయించబడింది",
    gu: "મને સોંપેલ",
    kn: "ನನಗೆ ನಿಯೋಜಿಸಲಾಗಿದೆ",
    ml: "എനിക്ക് നൽകിയത്",
    pa: "ਮੈਨੂੰ ਸੌਂਪਿਆ ਗਿਆ",
    or: "ମୋତେ ଦିଆଯାଇଥିବା",
    ur: "مجھے تفویض کردہ",
    as: "মোক দায়িত্ব দিয়া",
  },
  "Refresh": {
    hi: "ताज़ा करें",
    mr: "रिफ्रेश करा",
    bn: "রিফ্রেশ করুন",
    ta: "புதுப்பி",
    te: "రిఫ్రెష్ చేయండి",
    gu: "રિફ્રેશ કરો",
    kn: "ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    ml: "പുതുക്കുക",
    pa: "ਤਾਜ਼ਾ ਕਰੋ",
    or: "ରିଫ୍ରେଶ୍",
    ur: "تازہ کریں",
    as: "সতেজ কৰক",
    sa: "पुनर्भारं कुरु",
    ne: "ताजा गर्नुहोस्",
  },
  "Next in your queue": {
    hi: "आपकी कतार में अगला",
    mr: "तुमच्या रांगेत पुढील",
    bn: "আপনার সারিতে পরবর্তী",
    ta: "உங்கள் வரிசையில் அடுத்தது",
    te: "మీ క్యూలో తదుపరిది",
    gu: "તમારી કતારમાં આગળનું",
  },
  "Earliest due first": {
    hi: "पहले देय प्राथमिकता",
    mr: "पहिली देय तारीख प्राधान्य",
    bn: "প্রথম মেয়াদ প্রথম",
    ta: "முதலில் முதிர்வடையும் முன்னுரிமை",
  },
  "Case owner": {
    hi: "शिकायत प्रभारी",
    mr: "तक्रार प्रमुख",
    bn: "মামলার দায়িত্বপ্রাপ্ত",
    ta: "வழக்கு பொறுப்பாளர்",
    te: "కేసు యజమాని",
    gu: "કેસ અધિકારી",
  },
  "Due date": {
    hi: "नियत तारीख",
    mr: "अंतिम तारीख",
    bn: "নির্ধারিত তারিখ",
    ta: "கெடு தேதி",
    te: "గడువు తేదీ",
    gu: "નિયત તારીખ",
  },
  "Next step": {
    hi: "अगला कदम",
    mr: "पुढील पाऊल",
    bn: "পরবর্তী পদক্ষেপ",
    ta: "அடுத்த படி",
    te: "తదుపరి దశ",
    gu: "આગળનું પગલું",
  },
  "Waiting for information": {
    hi: "जानकारी की प्रतीक्षा",
    mr: "माहितीची प्रतीक्षा",
    bn: "তথ্যের জন্য অপেক্ষারত",
    ta: "தகவலுக்காக காத்திருக்கிறது",
    te: "సమాచారం కోసం వేచి ఉంది",
  },
  "Open complaint": {
    hi: "शिकायत खोलें",
    mr: "तक्रार उघडा",
    bn: "অভিযোগ খুলুন",
    ta: "புகாரைத் திற",
    te: "ఫిర్యాదు తెరవండి",
    gu: "ફરિયાદ ખોલો",
    ur: "شکایت کھولیں",
  },
  "Shared institution work": {
    hi: "साझा संस्थान कार्य",
    mr: "सामायिक संस्था कार्य",
    bn: "ভাগ করা প্রতিষ্ঠান কাজ",
    ta: "பகிர்ந்த நிறுவனப் பணி",
  },
  "One shared plan. Separate case owners.": {
    hi: "एक साझा योजना। अलग-अलग शिकायत प्रभारी।",
    mr: "एक सामायिक योजना. स्वतंत्र तक्रार प्रमुख.",
    bn: "একটি ভাগ করা পরিকল্পনা। পৃথক মামলার মালিক।",
  },
  "Working better, together.": {
    hi: "एक साथ, बेहतर कार्य।",
    mr: "एकत्र येऊन अधिक उत्तम काम.",
    bn: "একসাথে আরও ভালো কাজ।",
    ta: "ஒன்றாக இணைந்து சிறந்த செயல்பாடு.",
  },
  "One owner for each case.": {
    hi: "प्रत्येक मामले का एक प्रभारी।",
    mr: "प्रत्येक प्रकरणासाठी एक प्रमुख.",
    bn: "প্রতিটি মামলার একজন মালিক।",
  },
  "A shared plan across teams.": {
    hi: "टीमों के बीच एक साझा योजना।",
    mr: "पथकांमध्ये एक सामायिक योजना.",
    bn: "দলগুলোর মধ্যে একটি যৌথ পরিকল্পনা।",
  },
  "About this prototype": {
    hi: "इस प्रोटोटाइप के बारे में",
    mr: "या प्रोटोटाइप बद्दल",
    bn: "এই প্রোটোটাইপ সম্পর্কে",
    ta: "இந்த மாதிரி வடிவம் பற்றி",
  },
  "Student prototype": {
    hi: "छात्र प्रोटोटाइप",
    mr: "विद्यार्थी प्रोटोटाइप",
    bn: "শিক্ষার্থী প্রোটোটাইপ",
    ta: "மாணவர் மாதிரி",
  },
  "Demonstration data · Reference environment": {
    hi: "प्रदर्शन डेटा · संदर्भ वातावरण",
    mr: "प्रात्यक्षिक डेटा · संदर्भ वातावरण",
    bn: "প্রদর্শন ডেটা · রেফারেন্স পরিবেশ",
    ta: "விளக்கக் காட்சி தரவு · குறிப்பு சூழல்",
  },
  "Skip to main content": {
    hi: "मुख्य सामग्री पर जाएं",
    mr: "मुख्य मजकुराकडे जा",
    bn: "প্রধান বিষয়বস্তুতে যান",
    ta: "முக்கிய உள்ளடக்கத்திற்குச் செல்",
  },
  "High Contrast": {
    hi: "उच्च कंट्रास्ट",
    mr: "हाय कॉन्ट्रास्ट",
    bn: "উচ্চ বৈসাদৃশ্য",
    ta: "அதிக மாறுபாடு",
  },
  "Standard": {
    hi: "सामान्य",
    mr: "सामान्य",
    bn: "স্বাভাবিক",
    ta: "நிலையானது",
  },
  "Listen": {
    hi: "सुनें",
    mr: "ऐका",
    bn: "শুনুন",
    ta: "கேளுங்கள்",
    te: "వినండి",
    gu: "સાંભળો",
    kn: "ಕೇಳಿ",
    ml: "കേൾക്കൂ",
    pa: "ਸੁਣੋ",
    or: "ଶୁଣନ୍ତୁ",
    ur: "سنیں",
  },
  "Pause": {
    hi: "रोकें",
    mr: "थांबवा",
    bn: "বিরতি",
    ta: "இடைநிறுத்து",
    te: "పాజ్",
    gu: "અટકાવો",
  },
  "Resume": {
    hi: "जारी रखें",
    mr: "पुढे चालू करा",
    bn: "পুনরায় শুরু",
    ta: "தொடரவும்",
    te: "కొనసాగించండి",
  },
  "Stop": {
    hi: "समाप्त",
    mr: "थांबवा",
    bn: "থামুন",
    ta: "நிறுத்து",
    te: "ఆపు",
    gu: "બંધ કરો",
  },
  "You make the decision.": {
    hi: "निर्णय आप लेते हैं।",
    mr: "निर्णय तुम्ही घ्या.",
    bn: "সিদ্ধান্ত আপনি নেন।",
    ta: "முடிவை நீங்கள் எடுக்கிறீர்கள்.",
  },
  "Open coordination": {
    hi: "समन्वय खोलें",
    mr: "समन्वय उघडा",
    bn: "সমন্বয় খুলুন",
    ta: "ஒருங்கிணைப்பைத் திறக்கவும்",
  },
  "Open evidence reviews": {
    hi: "साक्ष्य समीक्षा खोलें",
    mr: "पुरावा पुनरावलोकन उघडा",
    bn: "প্রমাণ পর্যালোচনা খুলুন",
    ta: "சான்று மதிப்பாய்வைத் திற",
  },
  "Sign in to Samanvay": {
    hi: "समन्वय में साइन इन करें",
    mr: "समन्वय मध्ये साइन इन करा",
    bn: "সমন্বয়ে সাইন ইন করুন",
    ta: "சமன்வயில் உள்நுழைக",
    te: "సమన్వయ్‌లో సైన్ ఇన్ చేయండి",
  },
  "Role / Bureau": {
    hi: "भूमिका / ब्यूरो",
    mr: "भूमिका / विभाग",
    bn: "ভূমিকা / ব্যুরো",
    ta: "பங்கு / பணியகம்",
  },
  "Sign in": {
    hi: "साइन इन करें",
    mr: "साइन इन करा",
    bn: "সাইন ইন করুন",
    ta: "உள்நுழைக",
    te: "సైన్ ఇన్",
  },
};

export function t(key: string, lang?: string): string {
  const currentLang = (lang || localStorage.getItem("samanvay_lang") || "en") as SupportedLanguage;
  if (currentLang === "en") return key;
  const entry = TRANSLATIONS[key];
  if (entry && entry[currentLang]) {
    return entry[currentLang]!;
  }
  // Fallback to Hindi if available for Indic languages, otherwise English key
  if (currentLang !== "hi" && entry && entry.hi) {
    return entry.hi;
  }
  return key;
}

const LANGUAGE_CHANGE_EVENT = "samanvay_language_changed";

export function setPortalLanguage(lang: SupportedLanguage) {
  localStorage.setItem("samanvay_lang", lang);
  document.documentElement.lang = lang;
  window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: { lang } }));
  translateDOM(lang);
}

export function useCurrentLanguage(): SupportedLanguage {
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem("samanvay_lang") as SupportedLanguage) || "en";
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ lang: SupportedLanguage }>;
      if (customEvent.detail?.lang) {
        setLang(customEvent.detail.lang);
      }
    };
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handler);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handler);
  }, []);

  return lang;
}

// Live DOM text node translator
declare global {
  interface Node {
    __samanvayOriginalText?: string;
  }
}

export function translateDOM(targetLang: SupportedLanguage) {
  const root = document.querySelector(".samanvay-app") || document.body;
  if (!root) return;

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (tag === "script" || tag === "style" || tag === "svg" || tag === "code") {
          return NodeFilter.FILTER_REJECT;
        }
        // Do not touch language dropdown options
        if (parent.closest(".gov-lang-selector") || parent.closest(".tts-active-controls")) {
          return NodeFilter.FILTER_REJECT;
        }
        const text = node.textContent?.trim();
        if (!text || text.length < 2) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const nodesToUpdate: Node[] = [];
  let currentNode = walker.nextNode();
  while (currentNode) {
    nodesToUpdate.push(currentNode);
    currentNode = walker.nextNode();
  }

  for (const node of nodesToUpdate) {
    const raw = node.textContent?.trim();
    if (!raw) continue;

    if (!node.__samanvayOriginalText) {
      node.__samanvayOriginalText = raw;
    }

    const original = node.__samanvayOriginalText;
    if (targetLang === "en") {
      node.textContent = original;
    } else {
      const translated = t(original, targetLang);
      if (translated && translated !== original) {
        node.textContent = translated;
      }
    }
  }
}
