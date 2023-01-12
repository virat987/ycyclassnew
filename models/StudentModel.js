const mongoose = require("mongoose");
const studdentRequests = new mongoose.Schema({
    url: String,
    name: String,
    course: String,
    desc: String,
    sdata: String,
    tdata:String,
    subject: String,
    isTeacherConnected:{type:Boolean,default:false}
});
studdentRequests.index({ course: "text", subject: "text" }, { weights: { course: 1, subject: 2 } });
const StuddentRequests = mongoose.model("StuddentRequests", studdentRequests);
module.exports = StuddentRequests;