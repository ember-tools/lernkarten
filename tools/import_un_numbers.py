"""Takes the list of UN numbers from chemie.de into `frontend/src/data/hazmat/`.

The page carries the German Wikipedia's list under the GNU Free Documentation License. Every row
of its tables gives a UN number or a range of them, the hazard identification number, the class
and the name. The import normalises what the list writes loosely:

- a range such as "0005 - 0007" becomes one entry per number;
- several hazard numbers in one field ("30 + 33", "60+66") become a list;
- an empty field (all of class 1, where the plate carries the classification code) and "?" become
  an empty list, the latter marked `uncertain`;
- classes written as "6-1" or "3." are read as "6.1" and "3", and classes the ADR does not know
  ("2.1", "8.1") are corrected to the class before the point and counted in `meta.json`; a class
  that stays unknown stops the import;
- an empty class stays empty, and its UN numbers are listed in `meta.json`;
- a hazard field part that is not a hazard number is left out and listed in `meta.json`, so a
  changed way of writing on the page shows instead of turning into "no number".

Writes `un.json` with the entries and `meta.json` with source, date, licence, where the authors
are listed and what was corrected, left without a class or not read.

Usage: python tools/import_un_numbers.py [saved page.html]
"""

import json
import re
import sys
import urllib.request
from datetime import date
from html.parser import HTMLParser
from pathlib import Path

SOURCE = "https://www.chemie.de/lexikon/Liste_der_UN-Nummern.html"
TARGET = Path(__file__).resolve().parent.parent / "frontend" / "src" / "data" / "hazmat"
NUMBER = re.compile(r"^(\d{4})(?:\s*-\s*(\d{4}))?$")
HAZARD = re.compile(r"^X?\d{2,3}$")
CLASSES = {"1", "2", "3", "4.1", "4.2", "4.3", "5.1", "5.2", "6.1", "6.2", "7", "8", "9"}


class Findings:
    """What the import corrected or could not read, for `meta.json`."""

    def __init__(self) -> None:
        """Start with nothing found."""
        self.class_corrections: dict[str, int] = {}
        self.missing_class: list[str] = []
        self.unread_hazard: dict[str, list[str]] = {}


class TableReader(HTMLParser):
    """Collects the text of every cell of the page's `prettytable` tables, row by row."""

    def __init__(self) -> None:
        """Start with no rows read."""
        super().__init__()
        self.rows: list[list[str]] = []
        self.depth = 0
        self.cell: list[str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        """Open tables, rows and cells."""
        if tag == "table":
            self.depth += 1 if self.depth or "prettytable" in (dict(attrs).get("class") or "") else 0
        elif self.depth and tag == "tr":
            self.rows.append([])
        elif self.depth and tag == "td":
            self.cell = []

    def handle_endtag(self, tag: str) -> None:
        """Close cells and tables."""
        if tag == "table" and self.depth:
            self.depth -= 1
        elif tag == "td" and self.cell is not None:
            self.rows[-1].append(" ".join("".join(self.cell).split()))
            self.cell = None

    def handle_data(self, data: str) -> None:
        """Collect the text of the open cell."""
        if self.cell is not None:
            self.cell.append(data)


def hazard_numbers(field: str) -> tuple[list[str], bool, list[str]]:
    """The hazard numbers of a field, whether the list marks them as uncertain, and the parts that are no hazard number."""
    if field.strip() == "?":
        return [], True, []
    parts = [part.strip() for part in field.split("+") if part.strip()]
    return [part for part in parts if HAZARD.match(part)], False, [part for part in parts if not HAZARD.match(part)]


def hazard_class(field: str, findings: Findings) -> str:
    """The class of a field, corrected to the class before the point where the ADR does not know it."""
    value = field.replace("-", ".").rstrip(".")
    if value in CLASSES or not value:
        return value
    corrected = value.split(".")[0]
    if corrected not in CLASSES:
        raise ValueError(f"Unknown class {field!r}")
    key = f"{value} -> {corrected}"
    findings.class_corrections[key] = findings.class_corrections.get(key, 0) + 1
    return corrected


def entries(page: str, findings: Findings) -> list[dict]:
    """The entries of the page, one per UN number, in the page's order within a number."""
    reader = TableReader()
    reader.feed(page)
    result = []
    for row in reader.rows:
        if len(row) != 4:
            continue
        number, hazard, klass, name = row
        match = NUMBER.match(number)
        if not match or not name:
            continue
        numbers, uncertain, unread = hazard_numbers(hazard)
        cls = hazard_class(klass, findings)
        first = int(match.group(1))
        last = int(match.group(2) or first)
        for un in range(first, last + 1):
            if unread:
                findings.unread_hazard[f"{un:04d}"] = unread
            if not cls:
                findings.missing_class.append(f"{un:04d}")
            entry = {"un": f"{un:04d}", "hazard": numbers, "class": cls, "name": name}
            if uncertain:
                entry["uncertain"] = True
            result.append(entry)
    return sorted(result, key=lambda entry: entry["un"])


def fetch(arguments: list[str]) -> str:
    """Read a saved page, or fetch it from the source."""
    if arguments:
        return Path(arguments[0]).read_text("utf-8")
    request = urllib.request.Request(SOURCE, headers={"User-Agent": "lernkarten-data-import"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8")


def main() -> int:
    """Take the list and write it with its metadata."""
    findings = Findings()
    found = entries(fetch(sys.argv[1:]), findings)
    if len(found) < 1000:
        print(f"Only {len(found)} entries read; the page has probably changed.", file=sys.stderr)
        return 1
    TARGET.mkdir(parents=True, exist_ok=True)
    lines = ",\n".join(json.dumps(entry, ensure_ascii=False) for entry in found)
    (TARGET / "un.json").write_text(f"[\n{lines}\n]\n", "utf-8")
    meta = {
        "source": SOURCE,
        "origin": "https://de.wikipedia.org/wiki/Liste_der_UN-Nummern",
        "authors": "https://de.wikipedia.org/w/index.php?title=Liste_der_UN-Nummern&action=history",
        "licence": "GNU-Lizenz für freie Dokumentation",
        "date": date.today().isoformat(),
        "entries": len(found),
        "classCorrections": findings.class_corrections,
        "missingClass": sorted(findings.missing_class),
        "unreadHazard": findings.unread_hazard,
    }
    (TARGET / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", "utf-8")
    print(f"Wrote {len(found)} entries to {TARGET}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
