# API Testing & Validation Checklist
# MERN Travel Booking System

## Pre-Testing Setup
- [ ] Backend running on http://localhost:5000 (Status: MongoDB connected)
- [ ] Frontend running on http://localhost:5173
- [ ] Thunder Client / Postman installed
- [ ] Have a registered user email and password ready

---

## Test Case 1: User Registration

**Endpoint:** POST /api/register  
**URL:** http://localhost:5000/api/register

### Request
```
Method: POST
Headers:
  Content-Type: application/json

Body:
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "TestPassword123",
  "mobileNumber": "9876543210"
}
```

### Expected Response (Status: 201)
```json
{
  "message": "User registered successfully"
}
```

### Validation
- [ ] Response status is 201
- [ ] Success message received
- [ ] User can be logged in with same credentials
- [ ] Duplicate email rejected with 400 status

**Test Date:** ___________  
**Status:** ✅ Pass / ❌ Fail  
**Notes:** _________________________________

---

## Test Case 2: User Login

**Endpoint:** POST /api/login  
**URL:** http://localhost:5000/api/login

### Request
```
Method: POST
Headers:
  Content-Type: application/json

Body:
{
  "email": "testuser@example.com",
  "password": "TestPassword123"
}
```

### Expected Response (Status: 200)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "testuser@example.com"
  }
}
```

### Validation
- [ ] Response status is 200
- [ ] Token received in response
- [ ] User object contains id, name, email
- [ ] Invalid credentials return 400 status
- [ ] **IMPORTANT: Copy token for next tests**

**Token Copied:** _____________________________  
**Test Date:** ___________  
**Status:** ✅ Pass / ❌ Fail  
**Notes:** _________________________________

---

## Test Case 3: Create Booking (Protected)

**Endpoint:** POST /api/bookings  
**URL:** http://localhost:5000/api/bookings  
**Requires:** JWT Token from login

### Request
```
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE

Body:
{
  "destinationName": "Paris",
  "travelDate": "2024-06-15",
  "numberOfTravelers": 2,
  "packageType": "Gold",
  "price": 50000,
  "bookingStatus": "Pending",
  "contactAddress": "123 Main Street, New York, USA"
}
```

### Expected Response (Status: 201)
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "destinationName": "Paris",
  "travelDate": "2024-06-15T00:00:00.000Z",
  "numberOfTravelers": 2,
  "packageType": "Gold",
  "price": 50000,
  "bookingStatus": "Pending",
  "contactAddress": "123 Main Street, New York, USA",
  "createdAt": "2024-05-12T10:30:00.000Z",
  "updatedAt": "2024-05-12T10:30:00.000Z"
}
```

### Validation
- [ ] Response status is 201
- [ ] Booking created with correct data
- [ ] User ID is linked to booking
- [ ] Timestamps added automatically
- [ ] Missing token returns 401
- [ ] **IMPORTANT: Copy booking _id for update/delete tests**

**Booking ID Copied:** _____________________________  
**Test Date:** ___________  
**Status:** ✅ Pass / ❌ Fail  
**Notes:** _________________________________

---

## Test Case 4: Get All Bookings (Protected)

**Endpoint:** GET /api/bookings  
**URL:** http://localhost:5000/api/bookings  
**Requires:** JWT Token

### Request
```
Method: GET
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

### Expected Response (Status: 200)
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439011",
    "destinationName": "Paris",
    "travelDate": "2024-06-15T00:00:00.000Z",
    "numberOfTravelers": 2,
    "packageType": "Gold",
    "price": 50000,
    "bookingStatus": "Pending",
    "contactAddress": "123 Main Street, New York, USA",
    "createdAt": "2024-05-12T10:30:00.000Z",
    "updatedAt": "2024-05-12T10:30:00.000Z"
  }
]
```

### Validation
- [ ] Response status is 200
- [ ] Array of bookings returned
- [ ] Each booking contains all fields
- [ ] Only logged-in user's bookings shown
- [ ] Empty array if no bookings
- [ ] Missing token returns 401

**Test Date:** ___________  
**Status:** ✅ Pass / ❌ Fail  
**Notes:** _________________________________

---

## Test Case 5: Get Single Booking (Protected)

**Endpoint:** GET /api/bookings/:id  
**URL:** http://localhost:5000/api/bookings/BOOKING_ID_HERE  
**Requires:** JWT Token and Booking ID

### Request
```
Method: GET
URL: http://localhost:5000/api/bookings/507f1f77bcf86cd799439012
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

### Expected Response (Status: 200)
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "destinationName": "Paris",
  "travelDate": "2024-06-15T00:00:00.000Z",
  "numberOfTravelers": 2,
  "packageType": "Gold",
  "price": 50000,
  "bookingStatus": "Pending",
  "contactAddress": "123 Main Street, New York, USA",
  "createdAt": "2024-05-12T10:30:00.000Z",
  "updatedAt": "2024-05-12T10:30:00.000Z"
}
```

### Validation
- [ ] Response status is 200
- [ ] Correct booking returned
- [ ] Invalid ID returns 404
- [ ] Missing token returns 401
- [ ] All booking fields present

**Test Date:** ___________  
**Status:** ✅ Pass / ❌ Fail  
**Notes:** _________________________________

---

## Test Case 6: Update Booking (Protected)

**Endpoint:** PUT /api/bookings/:id  
**URL:** http://localhost:5000/api/bookings/BOOKING_ID_HERE  
**Requires:** JWT Token and Booking ID

### Request
```
Method: PUT
URL: http://localhost:5000/api/bookings/507f1f77bcf86cd799439012
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE

Body:
{
  "destinationName": "London",
  "packageType": "Platinum",
  "bookingStatus": "Confirmed",
  "price": 75000
}
```

### Expected Response (Status: 200)
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "destinationName": "London",
  "travelDate": "2024-06-15T00:00:00.000Z",
  "numberOfTravelers": 2,
  "packageType": "Platinum",
  "price": 75000,
  "bookingStatus": "Confirmed",
  "contactAddress": "123 Main Street, New York, USA",
  "createdAt": "2024-05-12T10:30:00.000Z",
  "updatedAt": "2024-05-12T11:00:00.000Z"
}
```

### Validation
- [ ] Response status is 200
- [ ] Fields updated correctly
- [ ] updatedAt timestamp changed
- [ ] Only specified fields updated
- [ ] Invalid ID returns 404
- [ ] Missing token returns 401

**Test Date:** ___________  
**Status:** ✅ Pass / ❌ Fail  
**Notes:** _________________________________

---

## Test Case 7: Delete Booking (Protected)

**Endpoint:** DELETE /api/bookings/:id  
**URL:** http://localhost:5000/api/bookings/BOOKING_ID_HERE  
**Requires:** JWT Token and Booking ID

### Request
```
Method: DELETE
URL: http://localhost:5000/api/bookings/507f1f77bcf86cd799439012
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

### Expected Response (Status: 200)
```json
{
  "message": "Booking deleted successfully"
}
```

### Validation
- [ ] Response status is 200
- [ ] Success message received
- [ ] Booking no longer found on GET
- [ ] Invalid ID returns 404
- [ ] Missing token returns 401
- [ ] Verify deletion with GET /api/bookings (booking not in list)

**Test Date:** ___________  
**Status:** ✅ Pass / ❌ Fail  
**Notes:** _________________________________

---

## Frontend Testing

### Register Page Tests
- [ ] All input fields render correctly
- [ ] Form validation works
- [ ] Submit button creates new user
- [ ] Error message shows for duplicate email
- [ ] Redirect to login after successful registration
- [ ] Link to login page works

### Login Page Tests
- [ ] Email and password inputs render
- [ ] Submit button logs in user
- [ ] Token saved to localStorage
- [ ] User data saved to localStorage
- [ ] Redirect to dashboard after login
- [ ] Error message shows for invalid credentials
- [ ] Link to register page works

### Dashboard Page Tests
- [ ] Displays user name in header
- [ ] Add Booking form renders with all fields
- [ ] Create booking works and appears in table
- [ ] Bookings table displays all user bookings
- [ ] Edit button loads booking data in form
- [ ] Update booking works correctly
- [ ] Delete button removes booking from table
- [ ] Logout button clears localStorage and redirects to login
- [ ] Status colors display correctly (Pending=orange, Confirmed=green, Cancelled=red)

---

## MongoDB Verification

### Users Collection
- [ ] Navigate to MongoDB Atlas → Database
- [ ] Verify "travel-booking" database exists
- [ ] Users collection contains registered user
- [ ] User document has: _id, name, email, password (hashed), mobileNumber, timestamps

### Bookings Collection
- [ ] Bookings collection exists
- [ ] Created bookings appear in collection
- [ ] Each booking has: _id, user (reference), destinationName, travelDate, numberOfTravelers, packageType, price, bookingStatus, contactAddress, timestamps
- [ ] User reference correctly links to Users collection
- [ ] Updated bookings reflect changes in database
- [ ] Deleted bookings removed from collection

---

## Overall Test Summary

**Total Test Cases:** 7 API + Frontend + DB Verification

**Passed:** _____ / 7  
**Failed:** _____ / 7  
**Pass Rate:** _____ %

**Issues Found:**
1. ________________________________
2. ________________________________
3. ________________________________

**Notes:**
________________________________
________________________________
________________________________

**Tested By:** ____________________  
**Date:** ____________________  
**Approved:** ✅ Yes / ❌ No

---

## Screenshots for PDF Submission

Capture screenshots of:
1. ✅ Register page with form filled
2. ✅ Login page with credentials
3. ✅ Dashboard page with booking form and table
4. ✅ POST /api/register - Success response
5. ✅ POST /api/login - Token response
6. ✅ POST /api/bookings - Create success
7. ✅ GET /api/bookings - List response
8. ✅ GET /api/bookings/:id - Single booking
9. ✅ PUT /api/bookings/:id - Update success
10. ✅ DELETE /api/bookings/:id - Delete success
11. ✅ MongoDB Users collection
12. ✅ MongoDB Bookings collection

