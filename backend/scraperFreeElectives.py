import re
import json
import requests
from bs4 import BeautifulSoup

URL = "https://www.uottawa.ca/study/course-enrolment/electives-without-prerequisites"

def scrape_free_electives(url: str) -> dict:
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    electives = {}
    pattern = re.compile(r"^([A-Z]{2,4}\d{4})\s+(.+)$")

    for li in soup.find_all("li"):
        text = li.get_text(strip=True)
        match = pattern.match(text)
        if match:
            raw_code = match.group(1).strip()
            # Insert space: "SRS1110" → "SRS 1110"
            code = raw_code[:-4] + " " + raw_code[-4:]
            name = match.group(2).strip()
            electives[code] = {"name": name, "credits": 3}

    return electives


if __name__ == "__main__":
    print(f"Fetching {URL} ...")
    electives = scrape_free_electives(URL)
    print(f"Found {len(electives)} free electives.")

    with open("freeElectives.json", "w") as f:
        json.dump(electives, f, indent=2, ensure_ascii=False)

    print("Saved to freeElectives.json")
    for code, info in sorted(electives.items()):
        print(f"  {code}: {info['name']}")