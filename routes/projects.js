const express = require('express');
const Project = require('./models/Project.js');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  const { name, description, members } = req.body;
  const project = new Project({
    name,
    description,
    members: members || [],
    createdBy: req.user.id,
  });
  await project.save();
  res.status(201).json(project);
});

router.get('/', authenticateToken, async (req, res) => {
  const projects = await Project.find({ members: req.user.id });
  res.json(projects);
});

module.exports = router;
