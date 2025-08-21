// Handling Issues in the code on the system and AI software will handle that 

const express = require('express');
const Issue = require('../models/Issue');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  const { projectId, lineNumber, description } = req.body;
  const issue = new Issue({
    projectId,
    reportedBy: req.user.id,
    lineNumber,
    description,
  });
  await issue.save();
  res.status(201).json(issue);
});

router.get('/:projectId', authenticateToken, async (req, res) => {
  const issues = await Issue.find({ projectId: req.params.projectId });
  res.json(issues);
});

module.exports = router;
