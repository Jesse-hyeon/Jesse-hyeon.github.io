const params = new URLSearchParams(location.search);
const locales = { ko: korean, en: english };
let language = params.get('lang');
if (!Object.hasOwn(locales, language)) {
  try { language = localStorage.getItem('portfolio-language'); } catch {}
}
if (!Object.hasOwn(locales, language)) language = 'ko';
const page = document.body.dataset.page;
const copy = locales[language];
const text = (key) => key.split('.').reduce((v, part) => v?.[part], copy);
const localized = (entry) => ({ ...entry, ...(copy.entries[entry.id] || korean.entries[entry.id]) });
function node(tag, className, value) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (value !== undefined) el.textContent = value;
  return el;
}
function anchor(label, href, className = '') {
  const el = node('a', className, label);
  el.href = href;
  return el;
}
function pageUrl(name, extra = {}) {
  return `./${name}.html?${new URLSearchParams({ lang: language, ...extra })}`;
}
function entryPage(entry) { return ['project', 'research'].includes(entry.category) ? 'projects' : 'experience'; }
function detailUrl(entry, origin = page) {
  const from = ['projects', 'experience'].includes(origin) ? origin : entryPage(entry);
  const query = new URLSearchParams({ id: entry.id, lang: language, from });
  if (params.has('filter')) query.set('filter', params.get('filter'));
  return `./detail.html?${query}`;
}
function period(entry) {
  return [entry.startDate, entry.endDate || (entry.ongoing ? text('labels.present') : '')]
    .filter(Boolean).map((v) => v.replaceAll('-', '.')).join(' – ') || text('site.undated');
}
// Keep old timeline bookmarks useful, including language and filter context.
if (page === 'about' && (params.has('filter') || location.hash === '#timeline')) {
  const destination = ['project','research'].includes(params.get('filter')) ? 'projects' : 'experience';
  location.replace(pageUrl(destination, Object.fromEntries(params)) + '#timeline');
} else {
  init();
}
function init() {
  document.documentElement.lang = language;
  document.title = `${text('site.' + (page === 'detail' ? 'experience' : page))} | ${text('profile.name')}`;
  try { localStorage.setItem('portfolio-language', language); } catch {}
  const header = document.querySelector('.site-header');
  header.append(anchor(text('profile.name'), pageUrl('about'), 'brand'));
  const nav = node('nav', 'site-nav'); nav.setAttribute('aria-label', 'Main');
  const source = entries.find((e) => e.id === params.get('id'));
  const current = page === 'detail' ? (['projects','experience'].includes(params.get('from')) ? params.get('from') : source ? entryPage(source) : 'experience') : page;
  for (const name of ['about','experience','projects']) {
    const item = anchor(text('site.' + name), pageUrl(name), 'nav-link');
    if (name === current) item.setAttribute('aria-current', 'page');
    nav.append(item);
  }
  header.append(nav);
  const controls = node('div', 'language-switch'); controls.setAttribute('role','group'); controls.setAttribute('aria-label',text('site.language'));
  for (const lang of ['ko','en']) {
    const button = node('button', '', lang.toUpperCase()); button.type = 'button'; button.lang = lang;
    button.dataset.language = lang; button.setAttribute('aria-label', lang === 'ko' ? '한국어' : 'English');
    button.setAttribute('aria-pressed', String(lang === language));
    button.addEventListener('click', () => { const q = new URLSearchParams(location.search); q.set('lang',lang); location.assign(location.pathname + '?' + q + location.hash); });
    controls.append(button);
  }
  header.append(controls);
  document.querySelector('.skip-link').textContent = text('site.skip');
  if (page === 'detail') return renderDetail(source, current);
  if (page === 'about') return renderAbout();
  const main = document.querySelector('main');
  main.append(node('p','eyebrow','Portfolio'),node('h1','page-title',text('site.'+page)),node('p','lede',text('site.'+page+'Intro')));
  if (page === 'experience') renderExperience(main); else renderProjects(main);
}
function headingSection(title, className = '') {
  const section = node('section','cv-section '+className);
  section.append(node('h2','section-title',title)); return section;
}
function renderAbout() {
  const main = document.querySelector('main'); main.classList.add('about-layout');
  const aside = node('aside','profile');
  const photo = node('img','profile-avatar'); photo.src='./assets/profile.webp'; photo.width=360; photo.height=463; photo.alt=text('profile.alt');
  aside.append(photo,node('p','location',text('profile.location')));
  const contacts = node('ul','contact-list');
  for (const [label,url] of [[profileLinks.email,'mailto:'+profileLinks.email],['GitHub',profileLinks.github],['LinkedIn',profileLinks.linkedin]]) { const li=node('li'); li.append(anchor(label,url)); contacts.append(li); }
  aside.append(contacts); main.append(aside);
  const content = node('div','about-content'); content.id = 'about';
  content.append(node('p','eyebrow',text('site.aboutIntro')),node('h1','page-title',text('profile.name')),node('p','lede',text('profile.bio')));
  const school = headingSection(text('site.education')); school.id = 'education';
  school.append(node('h3','',text('education.title')),node('p','',text('education.summary')),node('p','date',period(education[0])),node('p','record-note',text('resume.educationNote')),node('p','record-note',text('resume.gpaLabel')+': '+education[0].gpa));
  const military = node('div','military'); military.id = 'military';
  military.append(node('h3','',text('site.military')),node('p','',`${text('militaryService.title')} · ${text('militaryService.summary')}`),node('p','date',period(militaryService[0])));
  school.append(military);content.append(school);
  const journey=headingSection('Journey'),list=node('ol','journey');
  journeyMilestones.forEach((milestone,i)=>{const source=milestone.education?education[0]:entries.find(e=>e.id===milestone.entryId);const li=node('li');li.append(node('time','',source.startDate.slice(0,4)),node('p','',text('site.journey')[i]));list.append(li);});
  journey.append(list);content.append(journey);
  const resume=headingSection(text('site.resume'),'resume-panel');resume.id='resume';resume.append(node('p','',text('site.resumeDescription')));
  const actions=node('div','resume-actions');
  for(const lang of ['KO','EN']){const file=`Hyeonwoo_Kim_Resume_${lang}.pdf`;const a=anchor('',`./assets/resumes/${file}`,'download-button');a.download=file;const icon=node('span','document-icon','▤');icon.setAttribute('aria-hidden','true');a.append(icon,node('span','',text('site.download'+lang)));actions.append(a);}
  resume.append(actions);content.append(resume);main.append(content);
}
function entryCard(source, project = false) {
  const e=localized(source),card=anchor('',detailUrl(e),project?'project-card':'entry-card');card.id='entry-'+e.id;
  if(project){const img=node('img','project-thumb');img.src=`./assets/project-${e.id === 'causal-x' || e.category === 'research' ? 'causal' : e.parentId ? 'industry' : 'other'}.svg`;img.alt='';img.width=480;img.height=240;img.loading='lazy';card.append(img);}
  const body=node('div','card-body');body.append(node('p','date',period(e)),node('h3','',e.title));
  if(e.role)body.append(node('p','role',e.role));
  if(e.summary)body.append(node('p','summary',e.summary));card.append(body);return card;
}
function appendEntry(list,e,allowChildren=true) {
  const li=node('li');li.append(entryCard(e));
  const children=allowChildren?entries.filter(c=>c.parentId===e.id):[];
  if(children.length){const details=node('details','child-activities');details.dataset.parent=e.id;details.open=params.get('open')===e.id;details.append(node('summary','',`${text('site.children')} (${children.length})`));const sub=node('ul','entry-list');children.forEach(c=>appendEntry(sub,c,false));details.append(sub);li.append(details);}list.append(li);
}
function renderExperience(main) {
  const root=node('div');root.id='timeline';
  const leadership=['likelion-leadership','likelion-planning-track'];
  const groups=[['career',entries.filter(e=>e.category==='career'||e.category==='research'||e.id==='causal-x')],['leadership',entries.filter(e=>leadership.includes(e.id))],['awards',entries.filter(e=>e.category==='award')],['additional',entries.filter(e=>e.category==='activity'&&!e.parentId&&!leadership.includes(e.id))]];
  for(const [key,items] of groups){const section=headingSection(text('site.'+key),key==='additional'?'secondary':'');section.id=key;const list=node('ul','entry-list');items.forEach(e=>appendEntry(list,e,key!=='awards'));if(key==='additional'){const details=node('details');details.open=Boolean(params.get('open'));details.append(node('summary','',text('site.additionalHint')),list);section.append(details);}else section.append(list);root.append(section);}main.append(root);
}
function renderProjects(main) {
  const root=node('div');root.id='timeline';
  for(const [key,list] of [['featured',entries.filter(e=>e.id==='causal-x'||e.category==='research')],['industry',entries.filter(e=>e.category==='project'&&e.parentId==='impactive-internship')],['other',entries.filter(e=>e.category==='project'&&!e.parentId&&e.id!=='causal-x')]]){const section=headingSection(text('site.'+key)),grid=node('div','project-grid');list.forEach(e=>grid.append(entryCard(e,true)));section.append(grid);root.append(section);}main.append(root);
}
function safeAsset(url) {
  try {const u=new URL(url,location.href);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}
}
function renderDetail(source,current) {
  const main=document.querySelector('main');main.classList.add('detail-main');
  const backParams={};if(source?.parentId)backParams.open=source.parentId;if(params.has('filter'))backParams.filter=params.get('filter');
  const back=anchor(text('site.back'),pageUrl(current,backParams)+(source?'#entry-'+source.id:''),'back-link');back.id='timeline-return';main.append(back);
  const article=node('article');article.id='entry-detail';main.append(article);
  if(!source){article.append(node('h1','',text('site.notFound')));return;}
  const e=localized(source);document.title=e.title+' | '+text('profile.name');
  const header=node('header','detail-header');header.append(node('p','eyebrow',text('filters.'+e.category)),node('h1','',e.title),node('p','date',period(e)));
  if(e.role)header.append(node('p','role',e.role));if(e.summary)header.append(node('p','lede',e.summary));article.append(header);
  for(const section of e.sections||[]){if(!section.text?.trim())continue;const block=headingSection(section.title);block.append(node('p','',section.text));article.append(block);}
  if(e.qa?.length){const section=headingSection(text('site.qa'));for(const item of e.qa){section.append(node('h3','',item.question),node('p','',item.answer));}article.append(section);}
  for(const item of e.media||[]){const url=safeAsset(item.src);if(!url)continue;const figure=node('figure');const media=node(item.type==='video'?'video':'img','detail-media');media.src=url;if(item.type==='video'){media.controls=true;media.preload='metadata';}else media.alt=item.alt||item.caption||'';figure.append(media);if(item.caption)figure.append(node('figcaption','',item.caption));article.append(figure);}
  if(e.links?.length||e.url){const section=headingSection(text('site.outputs'));for(const item of [...(e.links||[]),...(e.url?[{label:e.title,url:e.url}]:[])]){const url=safeAsset(item.url);if(url)section.append(anchor(item.label,url,'output-link'));}article.append(section);}
  if(!e.sections?.length&&!e.qa?.length&&!e.media?.length&&!e.links?.length)article.append(node('p','detail-pending',text('labels.pending')));
  const relatives=[];if(e.parentId){const parent=entries.find(x=>x.id===e.parentId);if(parent)relatives.push([text('site.parent'),parent]);}
  entries.filter(x=>x.parentId===e.id).forEach(x=>relatives.push([text('site.children'),x]));
  for(const rel of e.related||[]){const match=entries.find(x=>x.id===rel.id);if(match)relatives.push([rel.label,match]);}
  if(relatives.length){const section=headingSection(text('labels.related'));for(const [label,item] of relatives){const a=anchor('',detailUrl(item,current),'related-card');a.append(node('span','date',label),node('strong','',localized(item).title));section.append(a);}article.append(section);}
}
