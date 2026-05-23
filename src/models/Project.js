const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000 },
    color: {
      type: String,
      trim: true,
      match: [/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'color must be a hex code'],
    },
  },
  { timestamps: true }
);

projectSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Project', projectSchema);
