const Project = require('../models/Project');
const Task = require('../models/Task');
const { TASK_STATUS, TASK_PRIORITY } = require('../models/Task');

function pickTaskFields(body) {
  const fields = {};
  for (const k of ['title', 'description', 'status', 'priority', 'dueDate']) {
    if (body[k] !== undefined) fields[k] = body[k];
  }
  return fields;
}

async function createForProject(req, res, next) {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.user._id,
    });
    if (!project) return res.status(404).json({ error: 'project not found' });

    const fields = pickTaskFields(req.body || {});
    const task = await Task.create({
      ...fields,
      projectId: project._id,
      userId: req.user._id,
      completedAt: fields.status === 'done' ? new Date() : undefined,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function listForProject(req, res, next) {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.user._id,
    });
    if (!project) return res.status(404).json({ error: 'project not found' });

    const filter = { projectId: project._id, userId: req.user._id };
    if (req.query.status) {
      if (!TASK_STATUS.includes(req.query.status)) {
        return res.status(400).json({ error: 'invalid status filter' });
      }
      filter.status = req.query.status;
    }
    if (req.query.priority) {
      if (!TASK_PRIORITY.includes(req.query.priority)) {
        return res.status(400).json({ error: 'invalid priority filter' });
      }
      filter.priority = req.query.priority;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

async function readOne(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ error: 'task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ error: 'task not found' });

    const { title, description, status, priority, dueDate } = req.body || {};
    const prevStatus = task.status;

    task.title = title;
    task.description = description;
    task.status = status !== undefined ? status : 'todo';
    task.priority = priority !== undefined ? priority : 'med';
    task.dueDate = dueDate;

    // Computed: completedAt tracks transitions into/out of "done".
    if (task.status === 'done') {
      if (prevStatus !== 'done') task.completedAt = new Date();
    } else {
      task.completedAt = undefined;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!task) return res.status(404).json({ error: 'task not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createForProject,
  listForProject,
  readOne,
  update,
  remove,
};
