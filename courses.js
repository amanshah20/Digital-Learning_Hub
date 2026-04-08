// ============= COMPLETE COURSES DATA =============

const courses = [
    {
        id: 1,
        title: "📊 Data Structures & Algorithms",
        instructor: "Prof. Anil Kumar",
        price: 3999,
        originalPrice: 12999,
        thumbnail: "📚",
        modules: [
            { id: 1, title: "Arrays & Strings", duration: "3h", videoUrl: "https://www.youtube.com/embed/3IuW9nC9Q6Q", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/rCkXsNz5YZqW9xLv8", assignmentQuestion: "Implement a function to reverse an array in O(n) time. Explain your approach with time complexity." },
            { id: 2, title: "Linked Lists", duration: "2.5h", videoUrl: "https://www.youtube.com/embed/58YbpRDc4yw", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/aBcDeFgHiJkLmNoPq1", assignmentQuestion: "Write code to detect a cycle in a linked list. Explain Floyd's Cycle Detection Algorithm." },
            { id: 3, title: "Stacks & Queues", duration: "2h", videoUrl: "https://www.youtube.com/embed/wjI1WNcIntg", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/XyZwVuTsRqPoNmLi2", assignmentQuestion: "Implement a queue using two stacks. Provide pseudocode and explain the operations." },
            { id: 4, title: "Trees & Graphs", duration: "4h", videoUrl: "https://www.youtube.com/embed/1-lUOFf4lVw", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/AbCdEfGhIjKlMnOpQr", assignmentQuestion: "Implement a binary search tree with insert, delete, and search operations." }
        ]
    },
    {
        id: 2,
        title: "🐍 Data Science Masterclass",
        instructor: "Dr. Priya Sharma",
        price: 4499,
        originalPrice: 14999,
        thumbnail: "📈",
        modules: [
            { id: 1, title: "Python for Data Science", duration: "4h", videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/PythonDS1", assignmentQuestion: "Write a Python script to read a CSV file and perform basic data cleaning operations." },
            { id: 2, title: "NumPy & Pandas", duration: "3.5h", videoUrl: "https://www.youtube.com/embed/QeWBS0JYNz4", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/PythonDS2", assignmentQuestion: "Using Pandas, analyze a dataset and find mean, median, and mode of numerical columns." },
            { id: 3, title: "Data Visualization", duration: "3h", videoUrl: "https://www.youtube.com/embed/3SSI6M-8iWo", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/PythonDS3", assignmentQuestion: "Create a bar chart and line plot using Matplotlib for a given dataset." }
        ]
    },
    {
        id: 3,
        title: "🌐 HTML5 Complete Guide",
        instructor: "Sarah Johnson",
        price: 1999,
        originalPrice: 5999,
        thumbnail: "🏷️",
        modules: [
            { id: 1, title: "HTML Basics & Structure", duration: "2h", videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/HTMLModule1", assignmentQuestion: "Create a basic HTML webpage with header, main content, and footer sections." },
            { id: 2, title: "Forms & Input Types", duration: "1.5h", videoUrl: "https://www.youtube.com/embed/fNcJuP4C9cE", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/HTMLModule2", assignmentQuestion: "Design a registration form with all input types (text, email, password, radio, checkbox, submit)." },
            { id: 3, title: "Semantic HTML", duration: "1.5h", videoUrl: "https://www.youtube.com/embed/kGW8Al_cga4", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/HTMLModule3", assignmentQuestion: "Convert a non-semantic HTML structure into semantic HTML5 elements." }
        ]
    },
    {
        id: 4,
        title: "🎨 CSS3 Styling Mastery",
        instructor: "Emily Davis",
        price: 2499,
        originalPrice: 6999,
        thumbnail: "🎨",
        modules: [
            { id: 1, title: "CSS Selectors & Properties", duration: "2.5h", videoUrl: "https://www.youtube.com/embed/1PnVor36_40", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/CSSModule1", assignmentQuestion: "Style a webpage using different CSS selectors (class, id, element, descendant)." },
            { id: 2, title: "Flexbox & Grid", duration: "3h", videoUrl: "https://www.youtube.com/embed/JJSoEo8JSnc", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/CSSModule2", assignmentQuestion: "Create a responsive navbar and card layout using Flexbox and CSS Grid." },
            { id: 3, title: "Animations & Transitions", duration: "2h", videoUrl: "https://www.youtube.com/embed/SgmNxE8lW5Y", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/CSSModule3", assignmentQuestion: "Create a button with hover effects and a loading spinner animation using CSS." },
            { id: 4, title: "Responsive Design", duration: "2.5h", videoUrl: "https://www.youtube.com/embed/srvUrASNj0s", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/CSSModule4", assignmentQuestion: "Make a webpage fully responsive using media queries for mobile, tablet, and desktop." }
        ]
    },
    {
        id: 5,
        title: "⚡ JavaScript: The Complete Guide",
        instructor: "John Doe",
        price: 3499,
        originalPrice: 9999,
        thumbnail: "⚡",
        modules: [
            { id: 1, title: "Variables & Data Types", duration: "2h", videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/JSModule1", assignmentQuestion: "Write a program that demonstrates all JavaScript data types with examples." },
            { id: 2, title: "Functions & Scope", duration: "2.5h", videoUrl: "https://www.youtube.com/embed/FOD408a4EzA", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/JSModule2", assignmentQuestion: "Create a function that calculates factorial using recursion and explain scope chain." },
            { id: 3, title: "Arrays & Objects", duration: "2h", videoUrl: "https://www.youtube.com/embed/R8rmfD9Y5-c", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/JSModule3", assignmentQuestion: "Implement map, filter, and reduce methods on an array of objects." },
            { id: 4, title: "DOM Manipulation", duration: "3h", videoUrl: "https://www.youtube.com/embed/0ik6X4DJKCc", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/JSModule4", assignmentQuestion: "Build a to-do list app where users can add, delete, and mark tasks as complete." },
            { id: 5, title: "Async JavaScript", duration: "2.5h", videoUrl: "https://www.youtube.com/embed/ZYb_ZU8LNxs", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/JSModule5", assignmentQuestion: "Fetch data from a public API using async/await and display it on a webpage." }
        ]
    },
    {
        id: 6,
        title: "⚛️ React.js Mastery",
        instructor: "Mike Wilson",
        price: 3999,
        originalPrice: 12999,
        thumbnail: "⚛️",
        modules: [
            { id: 1, title: "React Basics & JSX", duration: "2.5h", videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/ReactModule1", assignmentQuestion: "Create your first React component using JSX and explain the syntax." },
            { id: 2, title: "Components & Props", duration: "2h", videoUrl: "https://www.youtube.com/embed/IuOa5D-A0jU", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/ReactModule2", assignmentQuestion: "Build a parent and child component that passes data via props." },
            { id: 3, title: "State & Hooks", duration: "3h", videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/ReactModule3", assignmentQuestion: "Implement a counter app using useState hook and explain state management." },
            { id: 4, title: "React Router", duration: "2h", videoUrl: "https://www.youtube.com/embed/Ul3y1LXxzdU", watched: false, quizCompleted: false, assignmentSubmitted: false, assignmentAnswer: "", quizFormUrl: "https://forms.gle/ReactModule4", assignmentQuestion: "Create a multi-page React app with navigation using React Router DOM." }
        ]
    }
];

let currentCourse = null;
let currentModule = null;
let purchasedCourses = JSON.parse(localStorage.getItem('purchasedCourses') || '{}');

// Save purchased courses to localStorage
function savePurchasedCourses() {
    localStorage.setItem('purchasedCourses', JSON.stringify(purchasedCourses));
}

// Show all courses (Home page)
function showAllCourses() {
    document.getElementById('allCoursesView').style.display = 'block';
    document.getElementById('courseDetailView').style.display = 'none';
    document.querySelector('.page-header h1').innerText = '🚀 Choose Your Learning Path';
    
    const grid = document.getElementById('coursesGrid');
    grid.innerHTML = courses.map(course => `
        <div class="course-card" onclick="openCourse(${course.id})">
            <div class="course-thumbnail">
                ${course.thumbnail}
            </div>
            <div class="course-info">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-instructor"><i class="fas fa-chalkboard-teacher"></i> ${course.instructor}</p>
                <div class="course-price">₹${course.price} <span>₹${course.originalPrice}</span></div>
                <button class="enroll-btn">${purchasedCourses[course.id] ? '📖 Continue Learning' : '🎓 Enroll Now'}</button>
            </div>
        </div>
    `).join('');
}

// Open specific course
function openCourse(courseId) {
    currentCourse = courses.find(c => c.id === courseId);
    
    document.getElementById('allCoursesView').style.display = 'none';
    document.getElementById('courseDetailView').style.display = 'block';
    
    document.getElementById('courseThumbnail').innerHTML = currentCourse.thumbnail;
    document.getElementById('courseTitle').innerText = currentCourse.title;
    document.getElementById('courseInstructor').innerHTML = `<i class="fas fa-chalkboard-teacher"></i> ${currentCourse.instructor}`;
    document.getElementById('coursePrice').innerHTML = `₹${currentCourse.price} <span>₹${currentCourse.originalPrice}</span>`;
    document.getElementById('modalPrice').innerHTML = `₹${currentCourse.price} <span>₹${currentCourse.originalPrice}</span>`;
    
    // Update purchase buttons
    if (purchasedCourses[currentCourse.id]) {
        document.getElementById('purchaseBtn').style.display = 'none';
        document.getElementById('purchasedBtn').style.display = 'block';
    } else {
        document.getElementById('purchaseBtn').style.display = 'block';
        document.getElementById('purchasedBtn').style.display = 'none';
    }
    
    renderModulesList();
    
    // Auto-select first module
    if (currentCourse.modules.length > 0) {
        selectModule(currentCourse.modules[0].id);
    }
    
    updateCourseProgress();
}

// Render modules in sidebar
function renderModulesList() {
    const container = document.getElementById('modulesList');
    container.innerHTML = currentCourse.modules.map(module => `
        <div class="module-item ${currentModule?.id === module.id ? 'active' : ''}" onclick="selectModule(${module.id})">
            <div class="module-title">
                <i class="fas ${module.watched ? 'fa-check-circle' : 'fa-play-circle'}" style="color: ${module.watched ? '#10b981' : '#64748b'}"></i>
                ${module.title}
            </div>
            <div class="module-duration"><i class="far fa-clock"></i> ${module.duration}</div>
        </div>
    `).join('');
}

// Select a module
function selectModule(moduleId) {
    if (!purchasedCourses[currentCourse.id]) {
        showPaymentModal();
        return;
    }
    
    currentModule = currentCourse.modules.find(m => m.id === moduleId);
    
    document.getElementById('videoPlayer').src = currentModule.videoUrl;
    document.getElementById('currentModuleTitle').innerText = currentModule.title;
    
    if (currentModule.watched) {
        document.getElementById('quizSection').style.display = 'block';
        document.getElementById('assignmentSection').style.display = 'block';
        loadQuiz();
        loadAssignment();
    } else {
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('assignmentSection').style.display = 'none';
    }
    
    renderModulesList();
}

// Mark video as watched
function markCurrentVideoWatched() {
    if (!currentModule) {
        alert("Please select a module first!");
        return;
    }
    if (!purchasedCourses[currentCourse.id]) {
        showPaymentModal();
        return;
    }
    if (currentModule.watched) {
        alert("You've already completed this video!");
        return;
    }
    
    currentModule.watched = true;
    updateCourseProgress();
    renderModulesList();
    
    document.getElementById('quizSection').style.display = 'block';
    document.getElementById('assignmentSection').style.display = 'block';
    loadQuiz();
    loadAssignment();
    
    alert(`🎉 Great! You completed "${currentModule.title}"! Now complete the quiz & assignment.`);
}

// Update course progress
function updateCourseProgress() {
    if (!currentCourse) return;
    const totalModules = currentCourse.modules.length;
    const watchedCount = currentCourse.modules.filter(m => m.watched).length;
    const progress = (watchedCount / totalModules) * 100;
    
    document.getElementById('courseProgressFill').style.width = progress + '%';
    document.getElementById('progressText').innerText = Math.round(progress) + '% Complete';
}

// Load quiz
function loadQuiz() {
    const container = document.getElementById('quizContainer');
    
    if (currentModule.quizCompleted) {
        container.innerHTML = `<p style="color:#10b981;"><i class="fas fa-check-circle"></i> ✅ Quiz completed for this module!</p>`;
        return;
    }
    
    container.innerHTML = `
        <div style="background:#f0f9ff; padding:1rem; border-radius:12px;">
            <p><i class="fas fa-question-circle"></i> This module has a 5-question MCQ quiz.</p>
            <a href