const mongoose = require('mongoose');
const slugify = require('slugify'); 

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'A query must have a question'],
      trim: true,
      unique: false,
    },
    slug: String,
    subject: {
      type: String,
      required: [true, 'A question must have a subject'],
      enum: {
        values: [
          "Math",
          "Physics",
          "Biology",
          "Accountancy",
          "Business Study",
          "Economics",
          "Current Affair",
          "Reasoning",
          "Quantitative Aptitude",
          "Business Studies",
          "Sociology",
          "Political Science",
          "Current Affairs",
          "Environmental Science",
          "English",
          "Law",
          "Engineering",
          "Medical",
          "Geography",
          "Computer Science",
          "History",
          "Geology",
          "Hindi",
          "General Knowledge",
          "Odia",
          "Science",
          "Social studies",
          "Indian Language",
          "France",
          "German",
          "Spanis",
          "US History",
          "C",
          "C++",
          "JAVA",
          "JAVASCRIPT",
          "PYTHON",
          "Data Structure",
          "Tourism",
          "Mass Communication",
          "Introduction Law",
          "Urban Studies",
        ],
        message: 'Subject should be selected from valid options!',
      },
    },
    creationOn: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Question must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

questionSchema.index({ slug: 1 });
questionSchema.index({ user: 1 });
 
// Populating questions
questionSchema.pre(/^find/, function () {
  this.populate({
    path: 'userId',
    select: ' name photo role ',
  });
  this.populate({
    path: 'answers',
    select: 'answer createdOn likes',
  }).sort({ answers: -1 });
  this.populate({
    path: 'creationOn',
    select: 'createdOn',
  });

  this.populate({
    path: 'subject',
    select: 'subject',
  }); 
});
questionSchema.virtual('answers', {
  ref: 'Answer',
  foreignField: 'question',
  localField: '_id',
}); 
questionSchema.pre('save', function (next) {
  this.slug = slugify(this.question, { lower: true });
  next();
});
questionSchema.post('save', function (next) {
  this.slug = slugify(this.question, { lower: true }); 
}); 
const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
