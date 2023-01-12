document.getElementById("form-fill").addEventListener("submit", (event) => {
    handleFormSubmit(event);
})
const handleFormSubmit = (event) => {
    event.preventDefault();
    const desc = document.getElementById("desc-topic").value;
    const course = document.getElementById("select-class-course").value;
    const subject = document.getElementById("select-subject").value;
    if (desc && desc && course && subject) {
        fetch("/StuddentRequestsRoute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                desc: desc,
                course: course,
                subject: subject,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.url) {
                    window.location = "/student-call/" + response.url;
                }
            });

    } else {
        alert("Form is not filled");
    }
};
let value = {
    "6th-8th": ["Math", "Science", "English", "Social Science", "Odia"],

    "9th-10th": ["Math", "Science", "English", "Social Science", "Odia"],

    "JEE/NEET": ["Math", "Physics", "Chemistry", "Biology"],

    "Science": ["Mathematics", "Physics", "Chemistry", "Biology", "IT-Information Technology"],

    "Commerce": ["Accountancy", "Business Study", "Economics", "English"],

    "Arts": ["Political Science", "Economics", "Geography", "History", "Sociology", "Philosophy", "English"],

    "UPSC": ["General Studies", "Reasoning", "Quantitative Aptitude", "English", "Ethics", "Current Affair", "NCERT Science"],

    "OPSC": ["General Studies", "Reasoning", "Quantitative Aptitude", "English", "Current Affair", "NCERT Science"],

    "SSC": ["General Studies", "Reasoning", "Quantitative Aptitude", "English", "Current Affair", "NCERT Science"],

    "Railway": ["General Studies", "Reasoning", "Quantitative Aptitude", "English", "Current Affair", "NCERT Science"],

    "Banking": ["General Awareness", "Reasoning", "Quantitative Aptitude", "English", "Current Affair"],

    "Computer Science": ["C Programming", "C++", "Java", "JavaScript", "Python", "Data Structure", "Oracle", "Networking", "Cloud Computing", "Cyber Security", "Web Programming"],

    "NDA": ["English", "Mathematics", "General Awareness", "Geography"],

    "Counselling": ["Admission Query", "College Choice Query", "Academic Query", "Other"],
    "Others":[]
};
let val = {
    1: "6th-8th",
    2: "9th-10th",
    3: "Arts",
    4: "Commerce",
    5: "Science",
    6: "JEE/NEET",
    7: "Diploma/ITI",
    8: "UPSC",
    9: "OPSC",
    10: "SSC",
    11: "Railway",
    12: "Banking",
    13: "NDA",
    14: "Computer Science",
    15: "Counselling",
    16: "Others"
}
let SubjectElem = document.getElementById("select-subject");
document.getElementById("select-class-course").addEventListener("input", (event) => {
    if (event.target.value) {
        SubjectElem.innerHTML = `<option></option>` + (([...value[event.target.value]]).map(val => { return `<option value="${val}">${val}</option>` })).join("") + "<option value='Others'> Others</option > ";
    } else {
        SubjectElem.innerHTML = `<option></option>`;
    }
})
window.onload = function () {
    document.getElementById("desc-topic").value = "";
}