const Project = require('../models/Project');
const Task = require('../models/Task');

async function create(req, res, next) {
  try {
    const { name, description, color } = req.body || {};
    const project = await Project.create({
      userId: req.user._id,
      name,
      description,
      color,
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

async function readOne(req, res, next) {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ error: 'project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { name, description, color } = req.body || {};
    const patch = {};
    if (name !== undefined) patch.name = name;
    if (description !== undefined) patch.description = description;
    if (color !== undefined) patch.color = color;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      patch,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ error: 'project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!project) return res.status(404).json({ error: 'project not found' });

    // Cascade: remove all tasks belonging to this project.
    await Task.deleteMany({ projectId: project._id, userId: req.user._id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, readOne, update, remove };
