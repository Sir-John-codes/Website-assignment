

const menuButton = document.getElementById("menu-button");
const navigation = document.getElementById("navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
        navigation.classList.toggle("show");

        const menuIsOpen = navigation.classList.contains("show");

        menuButton.setAttribute("aria-expanded", menuIsOpen);
        menuButton.textContent = menuIsOpen ? "✕" : "☰";
    });

    // Close the menu after choosing a link.
    navigation.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
            navigation.classList.remove("show");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.textContent = "☰";
        }
    });
}




let students = [];
let nextStudentId = 1;




const studentForm = document.getElementById("student-form");

const studentNameInput = document.getElementById("student-name");
const studentAgeInput = document.getElementById("student-age");
const studentGenderInput = document.getElementById("student-gender");
const studentCourseInput = document.getElementById("student-course");
const studentMarksInput = document.getElementById("student-marks");

const registrationMessage = document.getElementById(
    "registration-message"
);

const studentTableBody = document.getElementById(
    "student-table-body"
);

const searchInput = document.getElementById("search-student");
const courseFilter = document.getElementById("filter-course");
const sortSelect = document.getElementById("sort-students");
const clearButton = document.getElementById("clear-students");




function showMessage(element, message, type) {
    element.textContent = message;
    element.className = "feedback " + type;
}




function getPerformance(marks) {
    if (marks >= 80) {
        return "Excellent";
    } else if (marks >= 70) {
        return "Very Good";
    } else if (marks >= 60) {
        return "Good";
    } else if (marks >= 50) {
        return "Average";
    } else {
        return "Failed";
    }
}

function getPerformanceClass(marks) {
    if (marks >= 80) {
        return "excellent";
    } else if (marks >= 70) {
        return "very-good";
    } else if (marks >= 60) {
        return "good";
    } else if (marks >= 50) {
        return "average";
    } else {
        return "failed";
    }
}




if (studentForm) {
    studentForm.addEventListener("submit", function (event) {
        // Prevent the form from refreshing the page.
        event.preventDefault();

        const fullName = studentNameInput.value.trim();
        const ageText = studentAgeInput.value.trim();
        const gender = studentGenderInput.value;
        const course = studentCourseInput.value;
        const marksText = studentMarksInput.value.trim();

        if (
            fullName === "" ||
            ageText === "" ||
            gender === "" ||
            course === "" ||
            marksText === ""
        ) {
            showMessage(
                registrationMessage,
                "Please complete all the required fields.",
                "error"
            );

            return;
        }

        const age = Number(ageText);
        const marks = Number(marksText);

        if (!Number.isInteger(age) || age <= 0) {
            showMessage(
                registrationMessage,
                "Please enter a valid age using a positive whole number.",
                "error"
            );

            studentAgeInput.focus();
            return;
        }

        if (
            !Number.isFinite(marks) ||
            marks < 0 ||
            marks > 100
        ) {
            showMessage(
                registrationMessage,
                "Marks must be a number between 0 and 100.",
                "error"
            );

            studentMarksInput.focus();
            return;
        }

        // Create one object to represent the new student.
        const newStudent = {
            id: nextStudentId,
            name: fullName,
            age: age,
            gender: gender,
            course: course,
            marks: marks
        };

        students.push(newStudent);
        nextStudentId++;

        studentForm.reset();

        // Show all records so the new student is visible.
        searchInput.value = "";
        courseFilter.value = "";
        sortSelect.value = "default";

        refreshDashboard();

        showMessage(
            registrationMessage,
            fullName + " has been registered successfully.",
            "success"
        );
    });

    // Prepare the empty dashboard when the page opens.
    refreshDashboard();
}




function displayStudents() {
    studentTableBody.replaceChildren();

    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;
    const selectedSort = sortSelect.value;

    let visibleStudents = [];

    // Find students matching both search and course.
    for (let i = 0; i < students.length; i++) {
        const student = students[i];

        const nameMatches = student.name
            .toLowerCase()
            .includes(searchText);

        const courseMatches =
            selectedCourse === "" ||
            student.course === selectedCourse;

        if (nameMatches && courseMatches) {
            visibleStudents.push(student);
        }
    }

    if (selectedSort === "highest") {
        visibleStudents.sort(function (a, b) {
            return b.marks - a.marks;
        });
    } else if (selectedSort === "lowest") {
        visibleStudents.sort(function (a, b) {
            return a.marks - b.marks;
        });
    }

    for (let i = 0; i < visibleStudents.length; i++) {
        const student = visibleStudents[i];
        const row = document.createElement("tr");

      
        addTableCell(row, student.name);
        addTableCell(row, student.age);
        addTableCell(row, student.gender);
        addTableCell(row, student.course);
        addTableCell(row, student.marks);

        const performanceCell = document.createElement("td");
        const performanceLabel = document.createElement("span");

        performanceLabel.textContent = getPerformance(
            student.marks
        );

        performanceLabel.className =
            "performance-label " +
            getPerformanceClass(student.marks);

        performanceCell.appendChild(performanceLabel);
        row.appendChild(performanceCell);

        const actionsCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Update Marks";
        editButton.className = "edit-button";

        editButton.setAttribute(
            "aria-label",
            "Update marks for " + student.name
        );

        editButton.addEventListener("click", function () {
            updateStudentMarks(student.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.setAttribute(
            "aria-label",
            "Delete " + student.name
        );

        deleteButton.addEventListener("click", function () {
            deleteStudent(student.id);
        });

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);
        studentTableBody.appendChild(row);
    }

    const recordsMessage = document.getElementById(
        "records-message"
    );

    if (students.length === 0) {
        recordsMessage.textContent =
            "No students registered yet.";
    } else if (visibleStudents.length === 0) {
        recordsMessage.textContent =
            "No students match your search or course filter.";
    } else {
        recordsMessage.textContent =
            "Showing " +
            visibleStudents.length +
            " of " +
            students.length +
            " registered students.";
    }

    clearButton.disabled = students.length === 0;
}

// Reusable function for creating a table cell.
function addTableCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
}




if (searchInput) {
    searchInput.addEventListener("input", displayStudents);
}

if (courseFilter) {
    courseFilter.addEventListener("change", displayStudents);
}

if (sortSelect) {
    sortSelect.addEventListener("change", displayStudents);
}




function updateStudentMarks(studentId) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === studentId) {
            const student = students[i];

            const newMarksText = prompt(
                "Enter new marks for " +
                student.name +
                " (0–100):",
                student.marks
            );

         
            if (newMarksText === null) {
                return;
            }

            if (newMarksText.trim() === "") {
                showMessage(
                    registrationMessage,
                    "Marks cannot be empty. The record was not changed.",
                    "error"
                );

                alert("Marks cannot be empty.");
                return;
            }

            const newMarks = Number(newMarksText);

            if (
                !Number.isFinite(newMarks) ||
                newMarks < 0 ||
                newMarks > 100
            ) {
                showMessage(
                    registrationMessage,
                    "Invalid marks. Enter a number between 0 and 100.",
                    "error"
                );

                alert("Please enter marks between 0 and 100.");
                return;
            }

            student.marks = newMarks;

            refreshDashboard();

            showMessage(
                registrationMessage,
                student.name + "'s marks have been updated.",
                "success"
            );

            return;
        }
    }
}



function deleteStudent(studentId) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === studentId) {
            const studentName = students[i].name;

            const confirmDelete = confirm(
                "Delete the record for " + studentName + "?"
            );

            if (!confirmDelete) {
                return;
            }

           
            students.splice(i, 1);

            refreshDashboard();

            showMessage(
                registrationMessage,
                studentName + "'s record has been deleted.",
                "success"
            );

            return;
        }
    }
}




if (clearButton) {
    clearButton.addEventListener("click", function () {
        if (students.length === 0) {
            return;
        }

        const confirmClear = confirm(
            "Delete all registered student records?"
        );

        if (!confirmClear) {
            return;
        }

        students = [];

        searchInput.value = "";
        courseFilter.value = "";
        sortSelect.value = "default";

        refreshDashboard();

        showMessage(
            registrationMessage,
            "All student records have been cleared.",
            "success"
        );
    });
}




function updateStatistics() {
    let totalMarks = 0;
    let passedStudents = 0;
    let failedStudents = 0;

    for (let i = 0; i < students.length; i++) {
        totalMarks += students[i].marks;

        if (students[i].marks >= 50) {
            passedStudents++;
        } else {
            failedStudents++;
        }
    }

    let averageMarks = 0;

    
    if (students.length > 0) {
        averageMarks = totalMarks / students.length;
    }

    document.getElementById("total-students").textContent =
        students.length;

    document.getElementById("passed-students").textContent =
        passedStudents;

    document.getElementById("failed-students").textContent =
        failedStudents;

    document.getElementById("average-marks").textContent =
        averageMarks.toFixed(2) + "%";

    updatePerformanceSummary(averageMarks);
}




function updatePerformanceSummary(averageMarks) {
    const highestElement = document.getElementById(
        "highest-student"
    );

    const lowestElement = document.getElementById(
        "lowest-student"
    );

    const classElement = document.getElementById(
        "class-performance"
    );

    if (students.length === 0) {
        highestElement.textContent = "No records available.";
        lowestElement.textContent = "No records available.";
        classElement.textContent = "No records available.";
        return;
    }

    let highestMarks = students[0].marks;
    let lowestMarks = students[0].marks;

    for (let i = 1; i < students.length; i++) {
        if (students[i].marks > highestMarks) {
            highestMarks = students[i].marks;
        }

        if (students[i].marks < lowestMarks) {
            lowestMarks = students[i].marks;
        }
    }

   
    let highestNames = [];
    let lowestNames = [];

    for (let i = 0; i < students.length; i++) {
        if (students[i].marks === highestMarks) {
            highestNames.push(students[i].name);
        }

        if (students[i].marks === lowestMarks) {
            lowestNames.push(students[i].name);
        }
    }

    highestElement.textContent =
        highestNames.join(", ") + " — " + highestMarks + "%";

    lowestElement.textContent =
        lowestNames.join(", ") + " — " + lowestMarks + "%";

    classElement.textContent =
        averageMarks.toFixed(2) +
        "% — " +
        getPerformance(averageMarks);
}




function refreshDashboard() {
    displayStudents();
    updateStatistics();
}





const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nameInput = document.getElementById(
            "contact-name"
        );

        const emailInput = document.getElementById(
            "contact-email"
        );

        const subjectInput = document.getElementById(
            "contact-subject"
        );

        const messageInput = document.getElementById(
            "contact-message"
        );

        const feedback = document.getElementById(
            "contact-feedback"
        );

        const fullName = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        if (
            fullName === "" ||
            email === "" ||
            subject === "" ||
            message === ""
        ) {
            showMessage(
                feedback,
                "Please complete all the contact form fields.",
                "error"
            );

            return;
        }

        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showMessage(
                feedback,
                "Please enter a valid email, such as name@example.com.",
                "error"
            );

            emailInput.focus();
            return;
        }

        if (message.length < 10) {
            showMessage(
                feedback,
                "Your message must contain at least 10 characters.",
                "error"
            );

            messageInput.focus();
            return;
        }

        showMessage(
            feedback,
            "Thank you, " +
            fullName +
            "! Your message passed validation. " +
            "This is a demonstration form; no message was sent.",
            "success"
        );

        contactForm.reset();
    });
}