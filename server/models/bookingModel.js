const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    date: {type: String, required:true},
    from_time: {type: String, required:true},
    to_time:{type: String, required:true},
    requester:{type: mongoose.Schema.Types.ObjectId,  ref: 'User', required: true},
    service_provider:{type: mongoose.Schema.Types.ObjectId,  ref: 'User', required: true}
},{
    timestamps:true,
});

const bookingModel = mongoose.model("Booking", bookingSchema);
module.exports = bookingModel;