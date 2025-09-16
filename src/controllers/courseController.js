const pool = require("../db");

const createCourse = async (req, res, next) => {
  try {
    const { title, description, price } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const [result] = await pool.execute(
      "INSERT INTO courses (title, description, price, created_by) VALUES (?, ?, ?, ?)",
      [title, description || null, price || 0, req.user.id]
    );
    const [rows] = await pool.execute("SELECT * FROM courses WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

const listCourses = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    page = Math.max(1, page);
    limit = Math.min(100, Math.max(1, limit));
    const offset = (page - 1) * limit;

    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) AS total FROM courses"
    );
    const [rows] = await pool.execute(
      "SELECT * FROM courses ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.json({
      data: rows,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

const getCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.execute("SELECT * FROM courses WHERE id = ?", [
      id,
    ]);
    if (!rows.length)
      return res.status(404).json({ message: "Course not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

const enrollCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    // check course exists
    const [courses] = await pool.execute(
      "SELECT id FROM courses WHERE id = ?",
      [courseId]
    );
    if (!courses.length)
      return res.status(404).json({ message: "Course not found" });

    // try insert enrollment; unique constraint prevents duplicate
    try {
      await pool.execute(
        "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)",
        [userId, courseId]
      );
      return res.status(201).json({ message: "Enrolled successfully" });
    } catch (err) {
      // duplicate key
      if (err && err.code === "ER_DUP_ENTRY")
        return res.status(409).json({ message: "Already enrolled" });
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { createCourse, listCourses, getCourse, enrollCourse };
