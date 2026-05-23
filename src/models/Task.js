const mongoose = require('mongoose');

const TASK_STATUS = ['todo', 'in_progress', 'done'];
const TASK_PRIORITY = ['low', 'med', 'high'];

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 5000 },
    status: { type: String, enum: TASK_STATUS, default: 'todo', index: true },
    priority: { type: String, enum: TASK_PRIORITY, default: 'med', index: true },
    dueDate: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

taskSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Task', taskSchema);
module.exports.TASK_STATUS = TASK_STATUS;
module.exports.TASK_PRIORITY = TASK_PRIORITY;
