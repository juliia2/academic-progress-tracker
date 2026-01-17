''' put this into terminal ONCE
python -m venv venv
# activate virtual environment:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

'''
# to run: uvicorn main:app --reload --port 5000


### code here
from typing import Dict


# api stuff
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


# allow React dev server to access FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_methods=["*"],
    allow_headers=["*"]
)

## >> app.jsx for later
'''
import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then(res => res.json())
      .then(data => setItems(data.items));
  }, []);

  const handleUpdate = () => {
    fetch("http://localhost:5000/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    })
    .then(res => res.json())
    .then(console.log);
  };

  return (
    <div>
      <ul>
        {items.map((i, idx) => <li key={idx}>{i}</li>)}
      </ul>
      <button onClick={handleUpdate}>Send to Python</button>
    </div>
  );
}

export default App;

'''

# to run: uvicorn main:app --reload --port 5000


#HARDCODING FOR DEMO

required_courses=['ENG 1112', 'ITI 1100', 'ITI 1120', 
                  'ITI 1121', 'MAT 1320', 'MAT 1322', 
                  'MAT 1341', 'MAT 1348', 'CEG 2136', 
                  'CSI 2101', 'CSI 2110', 'CSI 2120', 
                  'CSI 2132', 'CSI 2911', 'MAT 2377', 
                  'SEG 2105', 'CSI 3104', 'CSI 3105', 
                  'CSI 3120', 'CSI 3131', 'CSI 3140', 
                  'CEG 3185', 'CSI 4900']
requirements_EXAMPLE = {
    "completed": [required_courses[0]], ## 
    "in_progress": [required_courses[1]], }

requirements = {
    "completed": [],
    "in_progress": [],
    "to do": []
}

course_grades = {}

# FUNCTIONS

def get_requirements(requirements):
    requirements["to do"] = [course for course in required_courses if course not in requirements["completed"] and course not in requirements["in_progress"]]
    return requirements

def get_completed_courses(requirements):
    return requirements["completed"]

def get_in_progress_courses(requirements):
    return requirements["in_progress"]


def add_completed_course(requirements, course_code):
    if course_code not in requirements["completed"]:
        requirements["completed"].append(course_code)

    if course_code in requirements["in_progress"]:
        requirements["in_progress"].remove(course_code)
        
    return requirements

def add_in_progress_course(requirements, course_code):
    if course_code not in requirements["in_progress"]:
        requirements["in_progress"].append(course_code)

    if course_code in requirements["completed"]:
        requirements["completed"].remove(course_code)
        
    return requirements

# make dictionary of courses with their grades
def add_course_grade(course_grades, course_code, grade):
    course_grades[course_code] = grade
    return course_grades

def get_course_grades(course_grades):
    return course_grades

def calculate_cgpa(course_grades):
    if not course_grades:
        return 0.0

    total_points = 0
    total_courses = 0

    ## 10.0 scale

    grade_point_mapping = {
        'A+': 10.0,
        'A': 9.0,
        'A-': 8.0,
        'B+': 7.0,
        'B': 6.0,
        'C+': 5.0,
        'C': 4.0,
        'D+': 3.0,
        'D': 2.0,
        'E': 1.0,
        'F': 0.0,
        'ABS': 0.0,
        'EIN': 0.0
    }

    for grade in course_grades.values():
        if grade in grade_point_mapping:
            total_points += grade_point_mapping[grade]
            total_courses += 1

    if total_courses == 0:
        return 0.0

    gpa = total_points / total_courses
    return round(gpa, 2)



# ---------- FASTAPI ENDPOINTS ----------
@app.get("/api/requirements")
def api_get_requirements():
    return get_requirements(requirements)

@app.post("/api/add_completed")
def api_add_completed(payload: Dict):
    course = payload.get("course")
    add_completed_course(requirements, course)
    return get_requirements(requirements)

@app.post("/api/add_in_progress")
def api_add_in_progress(payload: Dict):
    course = payload.get("course")
    add_in_progress_course(requirements, course)
    return get_requirements(requirements)

@app.get("/api/cgpa")
def api_get_cgpa():
    return {"cgpa": calculate_cgpa(course_grades)}

@app.post("/api/add_grade")
def api_add_grade(payload: Dict):
    course = payload.get("course")
    grade = payload.get("grade")
    add_course_grade(course_grades, course, grade)
    return {"cgpa": calculate_cgpa(course_grades)}
