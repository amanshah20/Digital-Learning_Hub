import { useMemo, useState } from "react";
import "./CoursesModule.css";

const allCourses = [
  { id: 1, title: "React Fundamentals", category: "Web Development", level: "Beginner", lessons: 24 },
  { id: 2, title: "Advanced JavaScript", category: "Programming", level: "Intermediate", lessons: 30 },
  { id: 3, title: "Data Structures in C", category: "Programming", level: "Intermediate", lessons: 28 },
  { id: 4, title: "UI Design Principles", category: "Design", level: "Beginner", lessons: 18 },
  { id: 5, title: "Database Management", category: "Data", level: "Advanced", lessons: 26 },
  { id: 6, title: "Node.js API Mastery", category: "Web Development", level: "Advanced", lessons: 32 },
];

function CoursesModule() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(allCourses.map((course) => course.category))],
    []
  );

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchText = course.title.toLowerCase().includes(query.toLowerCase());
      const matchCategory = category === "All" || course.category === category;
      return matchText && matchCategory;
    });
  }, [query, category]);

  return (
    <section className="courses-module">
      <header className="courses-header">
        <h2>Courses Module</h2>
        <p>Browse, filter, and explore available learning tracks.</p>
      </header>

      <div className="courses-toolbar">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search courses..."
          aria-label="Search courses"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <article key={course.id} className="course-card">
            <h3>{course.title}</h3>
            <p className="course-category">{course.category}</p>
            <div className="course-meta">
              <span>{course.level}</span>
              <span>{course.lessons} lessons</span>
            </div>
            <button type="button">View Course</button>
          </article>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <p className="courses-empty">No courses found for this filter.</p>
      )}
    </section>
  );
}

export default CoursesModule;
