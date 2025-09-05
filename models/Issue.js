/* I put schema here for the issues got find 
with many schema names 
like ProjectId, reportedBy and linenumber
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const IssueSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  lineNumber: Number,
  description: String,
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Issue', IssueSchema);
