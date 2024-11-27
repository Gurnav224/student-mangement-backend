const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name:String,
    email:String,
    contactNumber:String,
    gender:String,
    department:String,
    qualifications:String,
    subjects:String
})


const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = {Teacher}