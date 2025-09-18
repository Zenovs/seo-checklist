"""SEO checklist updater script.

Dieses Skript lädt eine Ziel-URL, prüft ausgewählte SEO-Elemente
und aktualisiert basierend darauf den Status der Aufgabenliste aus
``docs/checklist.csv``. Zusätzlich werden Vorschläge für Titel und
Meta-Description über die OpenAI-API generiert.

Verwendung:
    python update_seo_checklist.py <URL>
"""

import argparse
import csv
import importlib.util
import os
import re
import sys
from html.parser import HTMLParser
from typing import Dict, Iterable, List, Optional, Tuple
from urllib.parse import urlparse
import urllib.error
import urllib.request

# "openai" ist optional. Wir prüfen die Verfügbarkeit über importlib,
# damit das Skript auch ohne installierte Bibliothek gestartet werden kann.
OPENAI_SPEC = importlib.util.find_spec("openai")
if OPENAI_SPEC is not None:
    openai = importlib.util.module_from_spec(OPENAI_SPEC)
    OPENAI_SPEC.loader.exec_module(openai)  # type: ignore[attr-defined]
else:
    openai = None  # type: ignore[assignment]

CHECKLIST_PATH = os.path.join("docs", "checklist.csv")
UPDATED_CHECKLIST_PATH = os.path.join("docs", "checklist_updated.csv")
SUGGESTION_PATH = "vorschlaege.txt"


class SEOHTMLParser(HTMLParser):
    """Einfacher HTML-Parser, der relevante SEO-Informationen extrahiert."""

    def __init__(self) -> None:
        super().__init__()
        self.title_parts: List[str] = []
        self.title_text: str = ""
        self.in_title = False

        self.meta_description: Optional[str] = None
        self.og_image: Optional[str] = None
        self.canonical: Optional[str] = None

        self.h1_parts: List[str] = []
        self.h1_texts: List[str] = []
        self.in_h1 = False

        self.paragraph_parts: List[str] = []
        self.paragraph_texts: List[str] = []
        self.in_paragraph = False

        self.anchor_parts: List[str] = []
        self.anchor_href: str = ""
        self.in_anchor = False

        self.button_parts: List[str] = []
        self.in_button = False

        self.cta_texts: List[str] = []

        self.has_image_with_alt = False
        self.legal_found = False

        self.page_text_parts: List[str] = []

        self.skip_text = False

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        attrs_dict = {name.lower(): (value or "") for name, value in attrs}

        if tag in {"script", "style"}:
            self.skip_text = True
            return

        if tag == "title":
            self.in_title = True
            self.title_parts = []
        elif tag == "meta":
            name = attrs_dict.get("name", "").lower()
            meta_property = attrs_dict.get("property", "").lower()
            content = attrs_dict.get("content", "").strip()
            if name == "description" and not self.meta_description:
                self.meta_description = content
            if meta_property.startswith("og:image") and not self.og_image:
                self.og_image = content
        elif tag == "link":
            rel_value = attrs_dict.get("rel", "").lower()
            if "canonical" in rel_value and not self.canonical:
                self.canonical = attrs_dict.get("href", "").strip()
        elif tag == "h1":
            self.in_h1 = True
            self.h1_parts = []
        elif tag == "p":
            self.in_paragraph = True
            self.paragraph_parts = []
        elif tag == "a":
            self.in_anchor = True
            self.anchor_parts = []
            self.anchor_href = attrs_dict.get("href", "")
            if not self.legal_found:
                haystack = f"{self.anchor_href.lower()}"
                if "impressum" in haystack or "datenschutz" in haystack:
                    self.legal_found = True
        elif tag == "button":
            self.in_button = True
            self.button_parts = []
        elif tag == "img":
            alt_text = attrs_dict.get("alt", "")
            if alt_text.strip():
                self.has_image_with_alt = True

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style"}:
            self.skip_text = False
            return

        if tag == "title" and self.in_title:
            self.title_text = "".join(self.title_parts).strip()
            self.in_title = False
            self.title_parts = []
        elif tag == "h1" and self.in_h1:
            text = "".join(self.h1_parts).strip()
            if text:
                self.h1_texts.append(text)
            self.h1_parts = []
            self.in_h1 = False
        elif tag == "p" and self.in_paragraph:
            text = "".join(self.paragraph_parts).strip()
            if text:
                self.paragraph_texts.append(text)
            self.paragraph_parts = []
            self.in_paragraph = False
        elif tag == "a" and self.in_anchor:
            text = "".join(self.anchor_parts).strip()
            if text:
                self.cta_texts.append(text)
                if not self.legal_found:
                    haystack = f"{self.anchor_href.lower()} {text.lower()}"
                    if "impressum" in haystack or "datenschutz" in haystack:
                        self.legal_found = True
            self.anchor_parts = []
            self.anchor_href = ""
            self.in_anchor = False
        elif tag == "button" and self.in_button:
            text = "".join(self.button_parts).strip()
            if text:
                self.cta_texts.append(text)
            self.button_parts = []
            self.in_button = False

    def handle_data(self, data: str) -> None:
        if self.skip_text or not data:
            return

        self.page_text_parts.append(data)

        if self.in_title:
            self.title_parts.append(data)
        if self.in_h1:
            self.h1_parts.append(data)
        if self.in_paragraph:
            self.paragraph_parts.append(data)
        if self.in_anchor:
            self.anchor_parts.append(data)
        if self.in_button:
            self.button_parts.append(data)

    def get_page_text(self, max_chars: int = 3000) -> str:
        text = "".join(self.page_text_parts)
        text = re.sub(r"\s+", " ", text).strip()
        if len(text) <= max_chars:
            return text
        return text[:max_chars] + "…"


def parse_arguments() -> argparse.Namespace:
    """Parse command line arguments."""

    parser = argparse.ArgumentParser(
        description="Aktualisiert die SEO-Checkliste für eine gegebene URL."
    )
    parser.add_argument(
        "url",
        help="Ziel-URL, die analysiert werden soll (inkl. Schema, z.B. https://example.com)",
    )
    return parser.parse_args()


def load_checklist(path: str) -> List[Dict[str, str]]:
    """Load checklist rows from CSV using semicolon delimiter."""

    with open(path, "r", encoding="utf-8", newline="") as csvfile:
        reader = csv.DictReader(
            csvfile,
            delimiter=";",
            quoting=csv.QUOTE_ALL,
        )
        rows = list(reader)
    return rows


def write_checklist(path: str, rows: Iterable[Dict[str, str]]) -> None:
    """Write updated checklist to CSV using the same format as input."""

    rows = list(rows)
    if not rows:
        raise ValueError("Keine Daten zum Schreiben der Checkliste vorhanden.")

    fieldnames = list(rows[0].keys())
    with open(path, "w", encoding="utf-8", newline="") as csvfile:
        writer = csv.DictWriter(
            csvfile,
            fieldnames=fieldnames,
            delimiter=";",
            quoting=csv.QUOTE_ALL,
        )
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def fetch_html(url: str) -> str:
    """Retrieve HTML content from target URL."""

    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; SEOChecklistBot/1.0)",
        "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
    }
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=20) as response:  # nosec B310
        charset = response.headers.get_content_charset() or "utf-8"
        return response.read().decode(charset, errors="replace")


def normalise_url(url: str) -> str:
    """Normalise URL for comparison (scheme, host and path without trailing slash)."""

    parsed = urlparse(url)
    scheme = parsed.scheme.lower() if parsed.scheme else "http"
    netloc = parsed.netloc.lower()
    path = parsed.path or "/"
    if path != "/":
        path = path.rstrip("/")
    normalised = f"{scheme}://{netloc}{path}"
    if parsed.query:
        normalised += f"?{parsed.query}"
    return normalised


def check_title(parser: SEOHTMLParser) -> bool:
    if not parser.title_text:
        return False
    length = len(parser.title_text)
    return 30 <= length <= 65


def check_meta_description(parser: SEOHTMLParser) -> bool:
    if not parser.meta_description:
        return False
    return len(parser.meta_description) <= 155


def check_og_image(parser: SEOHTMLParser) -> bool:
    return bool(parser.og_image)


def check_canonical(parser: SEOHTMLParser, target_url: str) -> bool:
    if not parser.canonical:
        return False
    return normalise_url(parser.canonical) == normalise_url(target_url)


def check_h1(parser: SEOHTMLParser) -> bool:
    return any(text.strip() for text in parser.h1_texts)


def check_intro_paragraph(parser: SEOHTMLParser) -> bool:
    return any(len(text.strip()) >= 40 for text in parser.paragraph_texts)


def check_alt_text(parser: SEOHTMLParser) -> bool:
    return parser.has_image_with_alt


CTA_KEYWORDS = [
    "jetzt",
    "kontakt",
    "termin",
    "angebot",
    "buchen",
    "anfragen",
    "melden",
]


def check_cta(parser: SEOHTMLParser) -> bool:
    for text in parser.cta_texts:
        lowered = text.casefold()
        if any(keyword in lowered for keyword in CTA_KEYWORDS):
            return True
    return False


PHONE_PATTERN = re.compile(
    r"(\+41\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}|0\d{2}\s?\d{3}\s?\d{2}\s?\d{2})"
)
ADDRESS_PATTERN = re.compile(r"\b\d{4}\b")


def check_contact_block(page_text: str) -> bool:
    return bool(re.search(PHONE_PATTERN, page_text)) or "tel:" in page_text.lower()


def check_legal_links(parser: SEOHTMLParser) -> bool:
    return parser.legal_found


def check_address(page_text: str) -> bool:
    return bool(re.search(ADDRESS_PATTERN, page_text))


def check_local_phone(page_text: str) -> bool:
    return bool(re.search(PHONE_PATTERN, page_text))


def evaluate_checks(
    parser: SEOHTMLParser, target_url: str, page_text: str
) -> Dict[str, bool]:
    """Evaluate supported checklist items and return mapping id -> bool."""

    return {
        "tech-title": check_title(parser),
        "tech-description": check_meta_description(parser),
        "tech-og": check_og_image(parser),
        "tech-canonical": check_canonical(parser, target_url),
        "content-h1": check_h1(parser),
        "content-intro": check_intro_paragraph(parser),
        "content-alt": check_alt_text(parser),
        "content-cta": check_cta(parser),
        "trust-contact": check_contact_block(page_text),
        "trust-legal": check_legal_links(parser),
        "local-address": check_address(page_text),
        "local-phone": check_local_phone(page_text),
    }


def generate_suggestions(page_text: str) -> Tuple[Optional[str], Optional[str]]:
    """Use OpenAI API to generate title and meta description suggestions."""

    if not openai:
        print("OpenAI-Bibliothek nicht verfügbar. Vorschläge werden übersprungen.")
        return None, None

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Umgebung enthält keinen OPENAI_API_KEY. Vorschläge werden übersprungen.")
        return None, None

    prompt = (
        "Du bist ein SEO-Experte. Lies den folgenden Seitentext und erstelle "
        "einen prägnanten Meta-Titel (maximal 60 Zeichen) sowie eine Meta-"
        "Description (maximal 155 Zeichen). Antworte im JSON-Format mit den "
        "Schlüsseln 'title' und 'description'.\n\n"
        f"Seitentext:\n{page_text}"
    )

    openai.api_key = api_key
    response = openai.ChatCompletion.create(  # type: ignore[attr-defined]
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Du bist ein hilfreicher SEO-Assistent."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        max_tokens=200,
    )

    content = response["choices"][0]["message"]["content"].strip()

    # Einfache Extraktion aus JSON-Antwort. Bei Fehlern Rückfall auf Rohtext.
    title_suggestion = None
    description_suggestion = None
    match = re.search(r'"title"\s*:\s*"(.*?)"', content)
    if match:
        title_suggestion = match.group(1)
    match = re.search(r'"description"\s*:\s*"(.*?)"', content)
    if match:
        description_suggestion = match.group(1)

    if not title_suggestion or not description_suggestion:
        print("Antwort konnte nicht vollständig geparst werden. Rohtext wird verwendet.")
        if not title_suggestion:
            title_suggestion = content
        if not description_suggestion:
            description_suggestion = content

    return title_suggestion, description_suggestion


def save_suggestions(
    title: Optional[str], description: Optional[str], path: str
) -> None:
    """Persist the generated suggestions to a text file."""

    lines = []
    if title:
        lines.append(f"Titel-Vorschlag: {title}")
    if description:
        lines.append(f"Meta-Description-Vorschlag: {description}")

    if not lines:
        lines.append("Keine Vorschläge verfügbar.")

    with open(path, "w", encoding="utf-8") as file:
        file.write("\n".join(lines))


def update_status(rows: List[Dict[str, str]], results: Dict[str, bool]) -> List[Dict[str, str]]:
    """Update status column based on evaluation results."""

    updated_rows: List[Dict[str, str]] = []
    for row in rows:
        row_copy = dict(row)
        row_id = row_copy.get("id")
        if row_id in results:
            row_copy["Status"] = "erledigt" if results[row_id] else "offen"
        updated_rows.append(row_copy)
    return updated_rows


def print_summary(results: Dict[str, bool]) -> None:
    """Output the evaluation summary to the console."""

    print("\nErgebnis der automatisierten Checks:")
    for key, value in sorted(results.items()):
        status = "erledigt" if value else "offen"
        print(f"- {key}: {status}")


def main() -> None:
    args = parse_arguments()
    target_url = args.url

    print(f"Analysiere {target_url} ...")

    try:
        html = fetch_html(target_url)
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as error:
        print(f"Fehler beim Laden der Seite: {error}")
        sys.exit(1)

    parser = SEOHTMLParser()
    parser.feed(html)
    parser.close()

    page_text = parser.get_page_text()

    try:
        rows = load_checklist(CHECKLIST_PATH)
    except FileNotFoundError:
        print(f"Checkliste wurde nicht gefunden unter {CHECKLIST_PATH}.")
        sys.exit(1)

    results = evaluate_checks(parser, target_url, page_text)
    print_summary(results)

    updated_rows = update_status(rows, results)
    write_checklist(UPDATED_CHECKLIST_PATH, updated_rows)
    print(f"Aktualisierte Checkliste gespeichert unter {UPDATED_CHECKLIST_PATH}.")

    title_suggestion, description_suggestion = generate_suggestions(page_text)
    if title_suggestion:
        print(f"\nTitel-Vorschlag: {title_suggestion}")
    if description_suggestion:
        print(f"Meta-Description-Vorschlag: {description_suggestion}")
    if not title_suggestion and not description_suggestion:
        print("Keine Vorschläge erzeugt.")

    save_suggestions(title_suggestion, description_suggestion, SUGGESTION_PATH)
    print(f"Vorschläge gespeichert in {SUGGESTION_PATH}.")


if __name__ == "__main__":
    main()
