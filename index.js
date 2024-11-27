const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

const { initializeDatabase } = require("./db/db.connection");
const { Student } = require("./models/students.model");
const { Teacher } = require("./models/teacher.model");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
initializeDatabase();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/students", async (req, res) => {
  const { name, age, grade, gender } = req.body;

  console.log("new student data", req.body);

  try {
    const student = new Student({ name, age, grade, gender });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/students/:id", async (req, res) => {
  const studentId = req.params.id;
  const updatedStudentData = req.body;
  console.log(updatedStudentData);

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updatedStudentData,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/students/:id", async (req, res) => {
  const studentId = req.params.id;

  try {
    const deletedStudent = await Student.findByIdAndRemove(studentId);

    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      student: deletedStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// teacher API

app.get("/teachers", async (req, res) => {
  try {
    const teacher = await Teacher.find({});
    res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/teachers/:teacherId", async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacher = await Teacher.findById(teacherId);
    res.status(200).json(teacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/teachers", async (req, res) => {
  const { name, email, contactNumber, gender, department } = req.body;
  try {
    const teacher = new Teacher({
      name,
      email,
      contactNumber,
      gender,
      department,
    });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/teachers/:teacherId", async (req, res) => {
  const { teacherId } = req.params;
  const {
    name,
    email,
    gender,
    contactNumber,
    department,
    qualifications,
    subjects,
  } = req.body;

  const updatedTeacher = {
    name: name,
    email: email,
    gender: gender,
    contactNumber: contactNumber,
    department: department,
    qualifications: qualifications,
    subjects: subjects,
  };

  if (!updatedTeacher) {
    res.status(404).json({ message: "Teacher not found" });
  }

  try {
    const teacher = await Teacher.findByIdAndUpdate(teacherId, updatedTeacher, {
      new: true,
    });
    res.status(200).json(teacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/teachers/:teacherId", async (req, res) => {
  const { teacherId } = req.params;
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);

    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(deletedTeacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
