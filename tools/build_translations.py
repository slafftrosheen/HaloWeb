"""Build the dependency-free website language bundle from reviewed copy."""
from pathlib import Path
import json
ROOT = Path(__file__).resolve().parent.parent
en = json.loads((ROOT / 'tools/english-catalog.json').read_text(encoding='utf-8'))
# Final English editorial pass. Keep technical names stable in all languages.
en.update({
    't019': 'Halo is an open-source Android assistant with a shared runtime for AI, tools and devices. It can answer using a model on your phone, perform phone actions, work with your notes and study materials, and use connected devices. No Halo account is required, and cloud services are optional.',
    't024': 'Your phone is all you need',
    't028': 'Actions, files, screen and system',
    't038': 'Connect devices for more capabilities.',
    't041': 'One assistant. A clear place for every task.',
    't045': 'Ask by voice or text, follow task status, continue a conversation and manage context.',
    't056': 'Your phone, saved hardware, available capabilities, device health and connections.',
    't077': 'An assistant that can take action.',
    't081': 'Examples: “Set a timer for 12 minutes.” · “Put the phone on vibrate.”',
    't084': 'When an action is handed to another app, Halo reports that the request was dispatched. Completion may still be unconfirmed.',
    't087': 'Access to sensitive data follows tool policies and approval rules.',
    't092': 'Requested does not mean completed.',
    't098': 'Halo’s first-run target is Qwen 3 0.6B Dynamic INT4. Once installed, the model can answer locally without a Halo account or cloud service.',
    't100': 'Ollama and companion connections',
    't103': 'Connect your provider',
    't104': 'You can connect Gemini, OpenRouter, OpenAI, Anthropic, Groq, Cerebras, xAI, OpenCode Zen and compatible endpoints.',
    't111': 'Your provider choice is respected.',
    't113': 'Credentials are protected.',
    't114': 'Credentials use Android Keystore-backed storage rather than ordinary app preferences.',
    't116': 'A clear workspace for your AI.',
    't117': 'Halo keeps your work in Notebook. You choose what enters the working context. Study turns selected material into a saved learning session, so your work can extend beyond chat history.',
    't122': 'Working context',
    't123': 'Add or remove workspace items from Halo’s context so you can see what the assistant is using.',
    't126': 'Keep notes, files, conversations and collections together. Canvas gives you a visual space for ideas, images and documents. PDF tools are still in development.',
    't133': 'Your phone is the foundation. Devices extend it.',
    't142': 'ANDROID AUDIO DEVICES',
    't146': 'A physical Halo device for testing capabilities, safety and action contracts. BuddyBot is an experimental direction for the project.',
    't148': 'Models change. Your assistant stays.',
    't160': 'CAPABILITIES BEFORE BRANDS',
    't163': 'CLOUD BY YOUR CHOICE',
    't164': 'Privacy rules determine where data goes.',
    't170': 'Real project. Active development. Readiness backed by evidence.',
    't176': 'The phone-action path has test coverage.',
    't187': 'Help make Halo clearer.',
    't202': 'The Study example follows three basil seedlings with different daily light exposure. The PDF describes the conditions, and the image shows the final measurements. Together they help check whether Halo uses the source or invents a plausible answer. Downloadable examples are in English.',
    't230': 'Try the app in around 15–25 minutes.',
    't248': '. If image analysis is unavailable, Halo should say so.',
    't258': 'A missing feature, unsupported file, failed provider or missing permission is useful test evidence. Record the actual outcome.',
})
lv, ru = {}, {}
for line in (ROOT / 'tools/translations.tsv').read_text(encoding='utf-8').splitlines():
    key, latvian, russian = line.split('\t')
    if key in lv: raise ValueError(f'Duplicate key: {key}')
    lv[key], ru[key] = latvian, russian
if set(en) != set(lv) or set(en) != set(ru): raise ValueError('Incomplete language catalog')
extras = {
 'en': {
  'progress': '{done} of {total} tried', 'copySuccess': 'Template copied.',
  'copyManual': 'Select the template above to copy it manually.', 'copyFailure': 'Copy unavailable. Select the template above instead.',
  'template': 'Halo version / Android version:\nScreen or feature:\nWhat I tried:\nExpected:\nActual:\nSteps to reproduce:\nScreenshot (hide private data):',
  'title': 'Halo — your Android assistant, your choice',
  'description': 'An open-source Android assistant with local AI, phone actions, Notebook, Study and connected devices. No Halo account required.',
 },
 'lv': {
  'progress': 'Izmēģināts: {done} no {total}', 'copySuccess': 'Veidne nokopēta.',
  'copyManual': 'Atlasīto veidni vari nokopēt manuāli.', 'copyFailure': 'Kopēšana nav pieejama. Atlasi veidni un nokopē to manuāli.',
  'template': 'Halo versija / Android versija:\nEkrāns vai funkcija:\nKo mēģināju:\nSagaidāmais rezultāts:\nFaktiskais rezultāts:\nAtkārtošanas soļi:\nEkrānuzņēmums (aizklāj privātos datus):',
  'title': 'Halo — tavs Android palīgs, tava izvēle',
  'description': 'Android palīgs ar atvērtu pirmkodu, vietējo MI, darbībām tālrunī, Piezīmju grāmatu, Mācībām un pievienotām ierīcēm. Halo konts nav vajadzīgs.',
 },
 'ru': {
  'progress': 'Попробовано: {done} из {total}', 'copySuccess': 'Шаблон скопирован.',
  'copyManual': 'Выдели шаблон выше и скопируй его вручную.', 'copyFailure': 'Копирование недоступно. Выдели шаблон выше и скопируй вручную.',
  'template': 'Версия Halo / версия Android:\nЭкран или функция:\nЧто я попробовал:\nОжидаемый результат:\nФактический результат:\nШаги для воспроизведения:\nСкриншот (скрой личные данные):',
  'title': 'Halo — твой Android-помощник, твой выбор',
  'description': 'Android-помощник с открытым кодом: локальный ИИ, действия на телефоне, Блокнот, Учёба и подключённые устройства. Аккаунт Halo не нужен.',
 }
}
catalog = {'en': en, 'lv': lv, 'ru': ru}
for lang, values in extras.items(): catalog[lang].update(values)
annotation_copy = json.loads((ROOT / 'tools/annotation_copy.json').read_text(encoding='utf-8'))
for lang, values in annotation_copy.items(): catalog[lang].update(values)
workspace_copy = json.loads((ROOT / 'tools/workspace_copy.json').read_text(encoding='utf-8'))
for lang, values in workspace_copy.items(): catalog[lang].update(values)
(ROOT / 'js/translations.js').write_text('/* Generated by tools/build_translations.py. */\nwindow.HaloTranslations = ' + json.dumps(catalog, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
# Keep the no-JavaScript English page consistent with the catalog.
import re
html = (ROOT / 'index.html').read_text(encoding='utf-8')
html = re.sub(r'(<span data-i18n="([^"]+)">)[^<]*(</span>)', lambda m: m[1] + en[m[2]] + m[3], html)
html = re.sub(r'<title>.*?</title>', '<title>' + en['title'] + '</title>', html)
html = re.sub(r'(<meta (?:name="description"|property="og:description") content=")[^"]*', lambda m: m[1] + en['description'], html)
html = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m[1] + en['title'], html)
(ROOT / 'index.html').write_text(html, encoding='utf-8')
print(f'Built {len(en)} page strings and {len(extras["en"])} dynamic strings in EN/LV/RU.')
