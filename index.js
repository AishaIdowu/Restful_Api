const express = require("express");
const Joi = require("joi"); //For validation
const courses = require("./courses");

const app = express();

app.use(express.json());
// app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Hello Aisha");
});

//  To get the courses
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// To get a single course using the ID
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(400).send("The given ID was not found");
  } else {
    res.send(course);
  }
});

// To create a new course
app.post("/api/courses", (req, res) => {
  const { error } = Joi.validate(req.body, schema);

  if (error) {
    //to validate input
    return res.status(400).send(error.details[0].message);
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

// To update the course
app.put("/api/courses/:id", (req, res) => {
  // Look for the course
  // If not existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(400).send("The given ID was not found");
  }

  //Validate, If invalid, return 400
  const { error } = validateCourse(req.body); //Object destructuring
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Update course
  course.name = req.body.name;
  res.send(course);
});

//For input validation
function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

// Delete course
app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
  return res.status(400).send("The ID was not found");
  // To delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server created on port: ${PORT}`));
