''' put this into terminal ONCE
python -m venv venv
# activate virtual environment:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

'''
# to run: uvicorn main:app --reload --port 5000


### code here
from pydantic import BaseModel

# prevent 404 in browser
from fastapi.responses import FileResponse, JSONResponse
import os



# api stuff
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


# allow React dev server to access FastAPI
'''app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_methods=["*"],
    allow_headers=["*"]
)
'''
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://u-dash.tech",
        "http://localhost:5173",
        "udash-smoky.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




class CoursePayload(BaseModel):
    course: str
class GradePayload(BaseModel):
    course: str
    grade: str
class ElectivePayload(BaseModel):
    courseName: str
    credits: int = 3


# to run: uvicorn main:app --reload --port 5000


#HARDCODING FOR DEMO

# Course catalog mapping
COURSE_CATALOG = {
    'ENG 1112': {'name': 'Technical Report Writing', 'credits': 3},
    'ITI 1100': {'name': 'Digital Systems I', 'credits': 3},
    'ITI 1120': {'name': 'Introduction to Computing I', 'credits': 3},
    'ITI 1121': {'name': 'Introduction to Computing II', 'credits': 3},
    'MAT 1320': {'name': 'Calculus I', 'credits': 3},
    'MAT 1322': {'name': 'Calculus II', 'credits': 3},
    'MAT 1341': {'name': 'Introduction to Linear Algebra', 'credits': 3},
    'MAT 1348': {'name': 'Discrete Mathematics for Computing', 'credits': 3},
    'CEG 2136': {'name': 'Computer Architecture I', 'credits': 3},
    'CSI 2101': {'name': 'Discrete Structures', 'credits': 3},
    'CSI 2110': {'name': 'Data Structures and Algorithms', 'credits': 3},
    'CSI 2120': {'name': 'Programming Paradigms', 'credits': 3},
    'CSI 2132': {'name': 'Databases I', 'credits': 3},
    'CSI 2911': {'name': 'Professional Practice in Computing', 'credits': 3},
    'MAT 2377': {'name': 'Probability and Statistics for Engineers', 'credits': 3},
    'SEG 2105': {'name': 'Introduction to Software Engineering', 'credits': 3},
    'CSI 3104': {'name': 'Introduction to Formal Languages', 'credits': 3},
    'CSI 3105': {'name': 'Design and Analysis of Algorithms I', 'credits': 3},
    'CSI 3120': {'name': 'Programming Language Concepts', 'credits': 3},
    'CSI 3131': {'name': 'Operating Systems', 'credits': 3},
    'CSI 3140': {'name': 'WWW Structures, Techniques and Standards', 'credits': 3},
    'CEG 3185': {'name': 'Introduction to Data Communications and Networking', 'credits': 3},
    'CSI 4900': {'name': 'Computer Science Project', 'credits': 6},
}

required_courses=['ENG 1112', 'ITI 1100', 'ITI 1120', 
                  'ITI 1121', 'MAT 1320', 'MAT 1322', 
                  'MAT 1341', 'MAT 1348', 'CEG 2136', 
                  'CSI 2101', 'CSI 2110', 'CSI 2120', 
                  'CSI 2132', 'CSI 2911', 'MAT 2377', 
                  'SEG 2105', 'CSI 3104', 'CSI 3105', 
                  'CSI 3120', 'CSI 3131', 'CSI 3140', 
                  'CEG 3185', 'CSI 4900']

required_courses_units = len(required_courses) *3  # assuming each course is 3 units
requirements_EXAMPLE = {
    "completed": [required_courses[0]], ## 
    "in_progress": [required_courses[1]], }

requirements = {
    "completed": [],
    "in_progress": [],
    "to do": [],
    "electives": []
}



course_grades = {}


"""
degree_requirements is declarative data.
NO business logic should live here.
Evaluation logic will consume this structure.
"""

degree_requirements = [
    {
        "id": "core_courses",
        "units": required_courses_units,
        "type": "required_pool",
        "courses": required_courses
    },
    
    {
        
        "id": "option_group_1",
        "type": "either",
        "units": 6,
        "options": [
            {
                "id": "opt1",
                "type": "optional_pool",
                "constraints": {
                    "subjects": ["CEG", "ELG", "SEG", "CSI"],
                    "levels": [3000, 4000],
                    "csi_min_level": 4000
                }
            },
            {
                "id": "opt2",
                "type": "composite",
                "includes": [
                    {
                        # "units": 3,
                        "type": "required_course",
                        "course": "CSI 2372"
                    },
                    {
                        # "units": 3,
                        "type": "optional_pool",
                        "constraints": {
                            "subjects": ["CEG", "ELG", "SEG", "CSI"],
                            "levels": [3000, 4000],
                            "csi_min_level": 4000
                        }
                    }
                ]
            }
        ]
    },

    {
        "id": "csi_4000_optional",
        "units": 12,
        "type": "optional_pool",
        "constraints": {
            "subjects": ["CSI"],
            "levels": [4000]
        }
    },

    {
        "id": "csi_seg_upper",
        "units": 3,
        "type": "optional_pool",
        "constraints": {
            "subjects": ["CSI", "SEG"],
            "levels": [3000, 4000]
        }
    },

    {
        "id": "non_comp_math",
        "units": 27,
        "type": "category_total",
        "category": "non_computing_non_math"
    },

    {
        "id": "free_electives",
        "units": 3,
        "type": "free_elective"
    },

    {
        "total_units_required": 120
    }
]
# ---------- BACKEND LOGIC ----------

# FUNCTIONS

def compute_todo(requirements):
    return [
        course for course in required_courses
        if course not in requirements["completed"]
        and course not in requirements["in_progress"]
    ]

def get_all_data(requirements, course_grades):
    return {
        "requirements": requirements,
        "to_do": compute_todo(requirements),
        "course_grades": course_grades,
        "cgpa": calculate_cgpa(course_grades),
        "electives": requirements["electives"],  # ✅ user-added electives
    }



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



def build_transcript_years(requirements, course_grades):
    """
    Build transcript data from completed courses and electives.
    Returns a list with one academic year for now.
    """
    completed = requirements["completed"]
    electives = requirements["electives"]
    
    courses_data = []
    total_credits = 0
    grade_points_sum = 0
    graded_courses = 0
    
    grade_point_mapping = {
        'A+': 10.0, 'A': 9.0, 'A-': 8.0,
        'B+': 7.0, 'B': 6.0, 'C+': 5.0,
        'C': 4.0, 'D+': 3.0, 'D': 2.0,
        'E': 1.0, 'F': 0.0, 'ABS': 0.0, 'EIN': 0.0
    }
    
    # Process completed required courses
    for course_code in completed:
        if course_code in required_courses:
            course_info = COURSE_CATALOG.get(course_code, {
                'name': course_code,
                'credits': 3
            })
            
            grade = course_grades.get(course_code, "—")
            grade_variant = "success" if grade != "—" else "info"
            
            credits = course_info['credits']
            total_credits += credits
            
            if grade in grade_point_mapping:
                grade_points_sum += grade_point_mapping[grade] * credits
                graded_courses += credits
            
            courses_data.append({
                "code": course_code,
                "name": course_info['name'],
                "category": "Core Requirements",
                "credits": credits,
                "grade": grade,
                "gradeVariant": grade_variant
            })
    
    # Process completed electives
    elective_codes = {e["code"]: e["units"] for e in electives}
    for course_code in completed:
        if course_code in elective_codes:
            credits = elective_codes[course_code]
            grade = course_grades.get(course_code, "—")
            grade_variant = "success" if grade != "—" else "info"
            
            total_credits += credits
            
            if grade in grade_point_mapping:
                grade_points_sum += grade_point_mapping[grade] * credits
                graded_courses += credits
            
            courses_data.append({
                "code": course_code,
                #"name": course_code,  # user-added electives use code as name
                "category": "Electives",
                "credits": credits,
                "grade": grade,
                "gradeVariant": grade_variant
            })
    
    # Calculate GPA for this year
    year_gpa = round(grade_points_sum / graded_courses, 2) if graded_courses > 0 else 0.0
    
    if not courses_data:
        return []
    
    return [{
        "year": 2025,
        "academicYear": "2025–2026",
        "gpa": year_gpa,
        "credits": total_credits,
        "courses": courses_data
    }]

# ---------- FASTAPI ENDPOINTS ----------
@app.get("/api/dashboard")
def api_get_dashboard():
    completed = requirements["completed"]
    in_progress = requirements["in_progress"]
    electives = requirements["electives"]

    requiredCredits = 120
    electiveCreditsRequired = 12
    creditsPerCourse = 3

    elective_codes = [e["code"] for e in electives]

    # required course credits
    required_completed = [c for c in completed if c in required_courses]
    completed_required_credits = len(required_completed) * creditsPerCourse

    # elective credits completed
    completed_elective_credits = sum(
        int(e["units"]) for e in electives if e["code"] in completed
    )

    completedCredits = completed_required_credits + completed_elective_credits

    # in-progress credits
    in_progress_credits = len(in_progress) * creditsPerCourse

    # make electives appear in dropdown
    todo_required = compute_todo(requirements)
    availableCourses = [
        c for c in (todo_required + elective_codes)
        if c not in completed and c not in in_progress
    ]

    requirementsBreakdown = [
        {
            "label": "Required Courses",
            "done": completed_required_credits,  
            "req": required_courses_units,
        },
        {
            "label": "In Progress",
            "done": in_progress_credits,  
            "req": in_progress_credits,  
        },
        {
            "label": "Electives",
            "done": completed_elective_credits,
            "req": electiveCreditsRequired,
        },
    ]

    data = {
        "requiredCredits": requiredCredits,
        "completedCredits": completedCredits,
        "cumulativeGPA": calculate_cgpa(course_grades),
        "transcriptCreditsCompleted": completedCredits,

        "requirements": requirementsBreakdown,

        "availableCourses": availableCourses,
        "completedCourses": completed,
        "inProgressCourses": in_progress,

        "transcriptYears": build_transcript_years(requirements, course_grades),

        # optional debug
        "electives": electives,
        "courseGrades": course_grades,
    }
    return JSONResponse(
        content=data,
        status_code=200,
        headers={"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"}
    )


@app.get("/api/degree_requirements")
def api_get_degree_requirements():
    return degree_requirements



@app.post("/api/add_completed")
def api_add_completed(payload: CoursePayload):
    add_completed_course(requirements, payload.course)
    return {"status": "ok"}

@app.post("/api/add_in_progress")
def api_add_in_progress(payload: CoursePayload):
    course = payload.course
    add_in_progress_course(requirements, course)
    return {"status": "ok"}

# @app.get("/api/cgpa")
# def api_get_cgpa():
#     return {"cgpa": calculate_cgpa(course_grades)}

@app.post("/api/add_grade")
def api_add_grade(payload: GradePayload):
    add_course_grade(course_grades, payload.course, payload.grade)
    return {"cgpa": calculate_cgpa(course_grades)}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"status": "Backend is running. Use /api/dashboard or /api/degree_requirements."}

@app.get("/favicon.ico")
def favicon():
    # put a favicon.ico file in the backend folder if you want an actual icon
    path = os.path.join(os.path.dirname(__file__), "favicon.ico")
    if os.path.exists(path):
        return FileResponse(path)
    return {}

class ElectivePayload(BaseModel):
    courseName: str
    credits: int = 3

@app.post("/api/add_elective")
def api_add_elective(payload: ElectivePayload):
    code = payload.courseName.strip().upper()
    credits = int(payload.credits)

    if not code:
        return {"ok": False, "message": "courseName is required"}
    if credits <= 0:
        return {"ok": False, "message": "credits must be > 0"}

    # store electives inside requirements (your state)
    exists = any(e.get("code") == code for e in requirements["electives"])
    if not exists:
        requirements["electives"].append({"code": code, "units": credits})

    return {"ok": True}

