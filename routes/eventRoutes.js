import express from 'express';
import { createEvent, bookSeat, getUpcomingEvents, getEventDetails} from '../controllers/eventController.js';
import upload from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';

const eventRouter = express.Router();

// Route for creating an event
eventRouter.post('/create', upload.single('image'), createEvent); 

// Route for booking a seat
eventRouter.post('/:eventId/book', authenticateToken, bookSeat);

eventRouter.get('/upcoming', getUpcomingEvents); 

eventRouter.get('/event-detail/:id', getEventDetails);

export default eventRouter;
