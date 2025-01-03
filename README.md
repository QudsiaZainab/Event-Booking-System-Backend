# Event Booking Systeem (Backend)

In this project there are six apis:

1. Create Event 
2. Book Event 
3. Display Upcoming Events
4. Display User Events
5. Login 
6. Signup

## Create Event
With this api, event is created in database. I just used it from postman. Images are stored in cloudinary.

## Book Event
With this api, seat is booked for specific user. JWT is used to authenticate logged in user. After booking, confirmation email is sent to user and bookedSeats is updated in database.

## Display Upcoming Events
With this api, all upcoming events are displayed in ascending order.

## Display User Events
With this api, all upcoming events are displayed in ascending order of specific user.

## Login 
It allows user to login by entering email and password. JWT is used.

## Signup
It allows user to create account and after signup token is also generated so that user can logged in immediately after signup.