import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  capacity: { type: Number, required: true },
  bookedSeats: { type: Number, default: 0 },
  bookedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who booked this event
  image: { type: String, required: true },
});



  

const Event = mongoose.model('Event', eventSchema);

export default Event;
