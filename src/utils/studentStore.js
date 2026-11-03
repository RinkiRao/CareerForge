
const fs = require("fs").promises;
const path = require("path");

const DATA_DIRECTORY = path.join(__dirname, "../data");
const STUDENTS_FILE = path.join(DATA_DIRECTORY, "students.json");

async function readStudents() {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });

  try {
    const content = await fs.readFile(STUDENTS_FILE, "utf8");
    const students = JSON.parse(content);

    if (!Array.isArray(students)) {
      throw new Error("students.json must contain a JSON array.");
    }

    return students;
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(STUDENTS_FILE, "[]", "utf8");
      return [];
    }

    throw error;
  }
}

async function writeStudents(students) {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });

  const tempFile = `${STUDENTS_FILE}.${Date.now()}.tmp`;

  try {
    await fs.writeFile(
      tempFile,
      JSON.stringify(students, null, 2),
      "utf8"
    );

    await fs.rename(tempFile, STUDENTS_FILE);
  } catch (error) {
    await fs.unlink(tempFile).catch(() => {});
    throw error;
  }
}

function publicStudent(student) {
  const {
    passwordHash,
    ...safeStudent
  } = student;

  return safeStudent;
}

module.exports = {
  readStudents,
  writeStudents,
  publicStudent,
};
