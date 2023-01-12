const mongoose = require("mongoose");
const studdentReviews = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    foremail:String
});
const StudentReview = mongoose.model("StudentReview", studdentReviews);
module.exports = StudentReview;