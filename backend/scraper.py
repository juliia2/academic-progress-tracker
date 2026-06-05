import re
import json
import requests
from bs4 import BeautifulSoup

URL = "https://www.uottawa.ca/faculty-engineering/undergraduate-studies/programs/computer-science/course-sequence"

# Credits are 3 for all courses except these known exceptions
CREDIT_OVERRIDES = {
    "CSI 4900": 6,
}

def scrape_courses(url: str) -> dict:
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    catalog = {}
    # Courses appear as "CODE | Course Name" in list items
    pattern = re.compile(r"^([A-Z]{2,3}\s\d{4})\s*\|\s*(.+)$")

    for li in soup.find_all("li"):
        text = li.get_text(separator=" ", strip=True)
        match = pattern.match(text)
        if match:
            code = match.group(1).strip()
            name = match.group(2).strip()
            credits = CREDIT_OVERRIDES.get(code, 3)
            catalog[code] = {"name": name, "credits": credits}

    return catalog


if __name__ == "__main__":
    print(f"Fetching {URL} ...")
    catalog = scrape_courses(URL)
    print(f"Found {len(catalog)} courses.")

    output_path = "courseCatalog.json"
    with open(output_path, "w") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    print(f"Saved to {output_path}")
    for code, info in sorted(catalog.items()):
        print(f"  {code}: {info['name']} ({info['credits']} credits)")
