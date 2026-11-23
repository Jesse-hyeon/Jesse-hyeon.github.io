"""Build the two public, selectable portfolio resumes.

Run with Python 3 and ReportLab available:
    python3 scripts/build_resume.py
"""
from pathlib import Path
import json
import subprocess

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "resumes"
FONT_DIR = ROOT / "assets" / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

pdfmetrics.registerFont(TTFont("NanumRegular", str(FONT_DIR / "NanumGothic-Regular.ttf")))
pdfmetrics.registerFont(TTFont("NanumBold", str(FONT_DIR / "NanumGothic-Bold.ttf")))


def load_shared_data():
    js = """
const fs = require('fs'), vm = require('vm');
const source = ['entries.js', 'locales/ko.js', 'locales/en.js']
  .map((file) => fs.readFileSync(file, 'utf8')).join('\\n');
const context = vm.createContext({});
vm.runInContext(source, context);
console.log(vm.runInContext('JSON.stringify({ entries, korean, english, education, militaryService })', context));
"""
    return json.loads(subprocess.check_output(["node", "-e", js], cwd=ROOT, text=True))


DATA = load_shared_data()
ENTRIES = {entry["id"]: entry for entry in DATA["entries"]}

KO = {
    "tag": "AI · Entrepreneurship · Psychology",
    "experience": [
        ("impactive-internship", ["산업 수요예측 및 AI 기반 PoC 프로젝트 참여", "인과분석 솔루션 기획 및 개발"]),
        ("causal-x", ["원자재 시장의 인과분석 기반 의사결정 지원 서비스 기획 및 개발"]),
    ],
    "research": [
        ("causal-discovery", ["한국데이터사이언스학회 하계종합학술대회 우수논문상", "제1저자"]),
        ("", []),
    ],
    "awards": ["g-star-award", "likelion-hackathon-award", "demo-day-award", "rpm-award-2025", "rpm-award-2024"],
}

EN = {
    "tag": "AI · Entrepreneurship · Psychology",
    "experience": [
        ("impactive-internship", ["Participated in demand forecasting and AI PoC projects", "Planned and developed a causal analysis solution"]),
        ("causal-x", ["Planned and developed a causal-analysis decision support service for commodity markets"]),
    ],
    "research": [
        ("causal-discovery", ["KADS Summer Conference", "First author"]),
        ("", []),
    ],
    "awards": ["g-star-award", "likelion-hackathon-award", "demo-day-award", "rpm-award-2025", "rpm-award-2024"],
}

STYLES = {
    "name": ParagraphStyle("name", fontName="NanumBold", fontSize=22, leading=26, spaceAfter=5),
    "tag": ParagraphStyle("tag", fontName="NanumRegular", fontSize=9, leading=13, textColor=colors.HexColor("#444444"), spaceAfter=6),
    "contact": ParagraphStyle("contact", fontName="NanumRegular", fontSize=8.2, leading=12, textColor=colors.HexColor("#444444")),
    "section": ParagraphStyle("section", fontName="NanumBold", fontSize=10.5, leading=14, spaceBefore=10, spaceAfter=3),
    "title": ParagraphStyle("title", fontName="NanumBold", fontSize=9.1, leading=12),
    "date": ParagraphStyle("date", fontName="NanumRegular", fontSize=8, leading=12, alignment=2, textColor=colors.HexColor("#555555")),
    "body": ParagraphStyle("body", fontName="NanumRegular", fontSize=8.5, leading=12),
    "bullet": ParagraphStyle("bullet", fontName="NanumRegular", fontSize=8.5, leading=12, leftIndent=9, firstLineIndent=-7),
}


def paragraph(value, style="body"):
    return Paragraph(value.replace("&", "&amp;"), STYLES[style])


def period(entry, lang):
    start = entry.get("startDate", "")
    end = entry.get("endDate") or (("현재" if lang == "KO" else "Present") if entry.get("ongoing") else "")
    return " – ".join(value.replace("-", ".") for value in [start, end] if value) if lang == "KO" else " – ".join([start, end] if end else [start])


def date_range(start, end, lang, expected=False):
    label = end or (("현재" if lang == "KO" else "Present") if expected else "")
    if lang == "KO":
        value = " – ".join(v.replace("-", ".") for v in [start, label] if v)
        return value + (" (졸업 예정)" if expected else "")
    value = " – ".join(v for v in [start, label] if v)
    return value + (" (Expected)" if expected else "")


def dated_row(title, date, width):
    table = Table([[paragraph(title, "title"), paragraph(date, "date")]], colWidths=[width - 142, 132])
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    return table


def build(data, lang):
    locale = DATA["korean"] if lang == "KO" else DATA["english"]
    path = OUT / f"Hyeonwoo_Kim_Resume_{lang}.pdf"
    profile_name = locale["profile"]["name"]
    doc = SimpleDocTemplate(str(path), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=15 * mm, bottomMargin=14 * mm, title=profile_name + " Resume", author=profile_name)
    story = [paragraph(locale["profile"]["name"], "name"), paragraph(data["tag"], "tag")]
    contact = '<link href="mailto:hyeonwookim2001@gmail.com" color="#333333">hyeonwookim2001@gmail.com</link> | <link href="https://github.com/Jesse-hyeon" color="#333333">GitHub: github.com/Jesse-hyeon</link> | <link href="https://www.linkedin.com/in/hyeonwoo-kim01" color="#333333">LinkedIn: linkedin.com/in/hyeonwoo-kim01</link> | <link href="https://jesse-hyeon.github.io" color="#333333">Portfolio: jesse-hyeon.github.io</link>'
    story += [Paragraph(contact, STYLES["contact"]), Spacer(1, 5)]

    def section(title):
        story.extend([paragraph(title, "section"), HRFlowable(width="100%", thickness=.45, color=colors.HexColor("#777777")), Spacer(1, 4)])

    section("학력" if lang == "KO" else "Education")
    education = DATA["education"][0]
    title = locale["education"]["title"]
    detail = locale["education"]["summary"]
    date = date_range(education["startDate"], education.get("endDate"), lang, True)
    story += [dated_row(title, date, doc.width), paragraph(detail, "body"), Spacer(1, 3)]

    section("경력" if lang == "KO" else "Experience")
    for entry_id, bullets in data["experience"]:
        title = locale["entries"].get(entry_id, {}).get("title", entry_id)
        if entry_id == "causal-x":
            title += " | " + ("창업" if lang == "KO" else "Founder")
        elif entry_id == "impactive-internship":
            title += " | " + ("인턴" if lang == "KO" else "Intern")
        story.append(KeepTogether([dated_row(title, period(ENTRIES[entry_id], lang), doc.width), *[paragraph("- " + bullet, "bullet") for bullet in bullets], Spacer(1, 4)]))

    section("연구 및 주요 프로젝트" if lang == "KO" else "Research & Selected Projects")
    for entry_id, bullets in data["research"]:
        if entry_id:
            title = locale["entries"][entry_id]["title"]
            date = period(ENTRIES[entry_id], lang)
        else:
            children = [entry for entry in ENTRIES.values() if entry.get("parentId") == "impactive-internship"]
            start = min(entry["startDate"] for entry in children)
            ends = [entry.get("endDate") for entry in children if entry.get("endDate")]
            date = date_range(start, max(ends) if ends else None, lang)
            title = "주요 프로젝트" if lang == "KO" else "Selected Industry Projects"
            bullets = [locale["entries"][entry["id"]]["title"] for entry in sorted(children, key=lambda e: (e["startDate"], e.get("order", 0)))]
        story.append(KeepTogether([dated_row(title, date, doc.width), *[paragraph("- " + bullet, "bullet") for bullet in bullets], Spacer(1, 3)]))

    section("수상" if lang == "KO" else "Honors & Awards")
    for entry_id in data["awards"]:
        story.append(dated_row(locale["entries"][entry_id]["title"], period(ENTRIES[entry_id], lang), doc.width))
    doc.build(story)
    return path


for language, data in [("KO", KO), ("EN", EN)]:
    print(build(data, language))
