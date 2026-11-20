"""Rebuild both public resumes from the same JS facts used by the website.
Requires Python 3 + reportlab. Run from any directory: python scripts/build_resume.py
"""
import json, subprocess
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether, PageBreak
ROOT=Path(__file__).resolve().parents[1]
js=r"""const fs=require('fs'),vm=require('vm');const src=['entries.js','locales/ko.js','locales/en.js'].map(p=>fs.readFileSync(p,'utf8')).join('\n');console.log(JSON.stringify(vm.runInNewContext(src+';({entries,education,militaryService,korean,english,profileLinks,resumeSelection})')));"""
data=json.loads(subprocess.check_output(['node','-e',js],cwd=ROOT))
for weight in ['Regular','Bold']:
    pdfmetrics.registerFont(TTFont('Nanum'+weight,str(ROOT/'assets/fonts'/f'NanumGothic-{weight}.ttf')))
styles={
    'name':ParagraphStyle('name',fontName='NanumBold',fontSize=23,leading=29,spaceAfter=7),
    'contact':ParagraphStyle('contact',fontName='NanumRegular',fontSize=8,leading=12,textColor=colors.HexColor('#444444')),
    'section':ParagraphStyle('section',fontName='NanumBold',fontSize=10.5,leading=15,spaceBefore=12,spaceAfter=4),
    'title':ParagraphStyle('title',fontName='NanumBold',fontSize=9.5,leading=14),
    'date':ParagraphStyle('date',fontName='NanumRegular',fontSize=8,leading=14,alignment=2,textColor=colors.HexColor('#555555')),
    'body':ParagraphStyle('body',fontName='NanumRegular',fontSize=9,leading=14),
    'bullet':ParagraphStyle('bullet',fontName='NanumRegular',fontSize=9,leading=14,leftIndent=10,firstLineIndent=-8),
}
def p(text,kind='body'): return Paragraph(escape(text),styles[kind])
def period(e,lang):
    def fmt(value):
        if lang=='ko':return value.replace('-','.')
        from datetime import datetime
        return datetime.strptime(value,'%Y-%m').strftime('%b %Y') if len(value)==7 and value[0].isdigit() else value
    start=e.get('startDate','');end=e.get('endDate','') or (('현재' if lang=='ko' else 'Present') if e.get('ongoing') else '')
    return ' - '.join(fmt(v) for v in [start,end] if v)
for lang,loc in [('ko',data['korean']),('en',data['english'])]:
    out=ROOT/'assets/resumes'/f'Hyeonwoo_Kim_Resume_{lang.upper()}.pdf'
    doc=SimpleDocTemplate(str(out),pagesize=A4,rightMargin=39,leftMargin=39,topMargin=34,bottomMargin=34,title=loc['profile']['name']+' | Resume',author=loc['profile']['name'])
    resume=loc['resume']
    story=[p(loc['profile']['name'],'name'),p(resume['tagline'],'title'),Spacer(1,6)]
    links=data['profileLinks']
    def a(label,url): return f'<link href="{escape(url)}" color="#333333">{escape(label)}</link>'
    portfolio=links['portfolio']+('?lang=en' if lang=='en' else '')
    story.append(Paragraph(a(links['email'],'mailto:'+links['email'])+'<br/>'+ '  |  '.join([a('github.com/Jesse-hyeon',links['github']),a('linkedin.com/in/hyeonwoo-kim01',links['linkedin']),a('jesse-hyeon.github.io',portfolio)]),styles['contact']))
    def section(index):
        story.extend([p(resume['sections'][index],'section'),HRFlowable(width='100%',thickness=.45,color=colors.HexColor('#777777')),Spacer(1,6)])
    def row(title,date=''):
        table=Table([[p(title,'title'),p(date,'date')]],colWidths=[doc.width-150,138])
        table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),2)]))
        return table
    def entry(id):return {**next(e for e in data['entries'] if e['id']==id),**loc['entries'][id]}
    def bullets(values):return [p('- '+value,'bullet') for value in values]
    section(0)
    story.append(p(loc['profile']['bio']))
    section(1)
    for id in data['resumeSelection']['experience']:
        e=entry(id)
        title=('Impactive AI' if id=='impactive-internship' else e['title'])+' | '+e['role']
        story.extend([KeepTogether([row(title,period(e,lang)),*bullets(e['bullets'])]),Spacer(1,7)])
    section(2)
    e=entry('lpcmci-research')
    story.extend([KeepTogether([row(e['title'],period(e,lang)),*bullets(e['bullets'])]),Spacer(1,7)])
    industry=[entry(id) for id in data['resumeSelection']['industry']]
    years=sorted({e['startDate'][:4] for e in industry}|{e.get('endDate',e['startDate'])[:4] for e in industry})
    story.append(KeepTogether([row(resume['industryTitle'],years[0]+' - '+years[-1]),*bullets(resume['industryBullets'])]))
    story.extend([PageBreak(),p(loc['profile']['name'],'title')])
    section(3)
    for id in data['resumeSelection']['leadership']:
        e=entry(id)
        story.append(KeepTogether([row(e['title']+' | '+e['role'],period(e,lang)),*bullets(e['bullets'])]))
    section(4)
    for id in data['resumeSelection']['awards']:
        e=entry(id);title=e['title']
        if id=='causal-discovery':title+= ' (제1저자)' if lang=='ko' else ' (First author)'
        story.append(row(title,period(e,lang)))
    section(5)
    story.extend([row(loc['education']['title'],period(data['education'][0],lang)),p(resume['educationNote'],'contact'),p('- '+loc['education']['summary'],'bullet'),p('- '+resume['gpaLabel']+': '+data['education'][0]['gpa'],'bullet')])
    section(6)
    for label,value in resume['skills']:
        story.append(p(label+': '+value,'bullet'))
    section(7)
    story.extend([row(loc['militaryService']['title']+' | '+loc['militaryService']['summary'],period(data['militaryService'][0],lang))])
    def footer(canvas,document):
        canvas.setFont('NanumRegular',8)
        canvas.setFillColor(colors.HexColor('#666666'))
        canvas.drawRightString(A4[0]-45,22,str(document.page))
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
    print(out.relative_to(ROOT))
