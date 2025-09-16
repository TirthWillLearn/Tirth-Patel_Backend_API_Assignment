const express = require("express");
const router = express.Router();
const { authenticate, authorizeRole } = require("../middleware/auth");
const {
  createCourse,
  listCourses,
  getCourse,
  enrollCourse,
} = require("../controllers/courseController");

router.post("/", authenticate, authorizeRole("admin"), createCourse);
router.get("/", listCourses);
router.get("/:id", getCourse);
router.post(
  "/:id/enroll",
  authenticate,
  authorizeRole("student"),
  enrollCourse
);

module.exports = router;
