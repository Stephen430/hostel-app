# Roommate Reservation System Documentation

## Overview
The Roommate Reservation System allows students who have already booked a bed space to temporarily reserve additional bed spaces for their roommates who have not yet resumed on campus. This feature ensures that friends can stay together in the same room.

## Features Implemented

### 1. **Room & Bed Space Management**
- Each room contains 4 bed spaces
- Bed spaces have 3 statuses:
  - **Available**: Can be booked or reserved
  - **Reserved**: Temporarily held for a specific student
  - **Occupied**: Already booked by a student

### 2. **Reservation System**
- Students can reserve bed spaces for roommates (3-5 days)
- Reservations require the roommate's matric number
- Reserved spaces are locked and cannot be booked by others
- Automatic expiry mechanism frees up spaces after the duration

### 3. **Reservation Confirmation**
- Roommates can confirm their reservation using their matric number
- Confirmation converts the reservation to an active booking
- Expired reservations automatically free up the bed space

### 4. **Notifications**
- Badge counter on home page showing pending reservations
- Alert banner on home page for pending reservations
- Time remaining countdown for active reservations

## File Structure

```
types/
  └── reservation.ts                    # TypeScript types and interfaces

contexts/
  └── ReservationContext.tsx            # State management and business logic

app/
  ├── (tabs)/
  │   ├── index.tsx                     # Home page with reservation alerts
  │   ├── rooms.tsx                     # Browse available rooms
  │   └── my-booking.tsx                # View bookings and reservations
  ├── room-details.tsx                  # Room details with booking/reservation UI
  └── confirm-reservation.tsx           # Confirm pending reservations
```

## Data Models

### BedSpace
```typescript
interface BedSpace {
  id: string;
  bedNumber: number;
  status: "available" | "occupied" | "reserved";
  occupantId?: string;
  reservationId?: string;
}
```

### Room
```typescript
interface Room {
  id: string;
  blockName: string;
  roomNumber: string;
  totalBeds: number;
  bedSpaces: BedSpace[];
  pricePerBed: number;
  floor: number;
  amenities: string[];
}
```

### Reservation
```typescript
interface Reservation {
  id: string;
  reserverId: string;              // Who made the reservation
  reserverName: string;
  reservedFor: string;             // Roommate's matric number
  roomId: string;
  bedSpaceId: string;
  roomDetails: {
    blockName: string;
    roomNumber: string;
    bedNumber: number;
  };
  status: "active" | "confirmed" | "expired" | "cancelled";
  reservationDate: Date;
  expiryDate: Date;
  confirmedDate?: Date;
  durationDays: number;            // 3-5 days
}
```

### Booking
```typescript
interface Booking {
  id: string;
  studentId: string;               // Matric number
  studentName: string;
  roomId: string;
  bedSpaceId: string;
  roomDetails: {
    blockName: string;
    roomNumber: string;
    bedNumber: number;
  };
  bookingDate: Date;
  status: "active" | "cancelled" | "completed";
  amountPaid: number;
}
```

## Key Functions

### ReservationContext Functions

#### `bookRoom(roomId, bedSpaceId)`
Books a bed space for the current user.
- **Returns**: `Promise<boolean>`
- **Validates**: User is logged in, bed is available

#### `reserveSpaceForRoommate(roomId, bedSpaceId, roommateMatricNumber, durationDays)`
Reserves a bed space for a roommate.
- **Returns**: `Promise<{ success: boolean; message: string }>`
- **Validates**: 
  - User has a booking in the same room
  - Bed space is available
  - Duration is between 3-5 days
- **Creates**: Reservation record
- **Updates**: Bed space status to "reserved"

#### `confirmReservation(reservationId, matricNumber)`
Confirms a reservation when the roommate logs in.
- **Returns**: `Promise<{ success: boolean; message: string }>`
- **Validates**:
  - Reservation exists and matches matric number
  - Reservation is active (not expired)
- **Creates**: Booking for the roommate
- **Updates**: 
  - Reservation status to "confirmed"
  - Bed space status to "occupied"

#### `checkExpiredReservations()`
Automatically checks and expires reservations.
- **Runs**: Every minute via useEffect
- **Updates**: 
  - Expired reservations status to "expired"
  - Bed spaces back to "available"

#### `getMyReservations()`
Gets all reservations made by the current user.
- **Returns**: `Reservation[]`

#### `getReservationsForMe(matricNumber)`
Gets all active reservations made for a specific matric number.
- **Returns**: `Reservation[]`
- **Filters**: Only active reservations

## User Flows

### Flow 1: Student Books a Room
1. Navigate to **Rooms** tab
2. Browse available rooms
3. Tap on a room to view details
4. Select an available bed space
5. Tap **Book Bed** button
6. Confirm booking in modal
7. Bed space status changes to "occupied"
8. Booking appears in **My Booking** tab

### Flow 2: Student Reserves Space for Roommate
**Prerequisites**: Student must have already booked a bed in the room

1. Navigate to **Rooms** tab
2. Find and tap on the room where they have a booking
3. Select an available bed space
4. Tap **Reserve** button (only visible if student has booking in room)
5. Enter roommate's matric number
6. Select duration (3, 4, or 5 days)
7. Tap **Reserve Bed** button
8. Bed space status changes to "reserved"
9. Reservation appears in **My Booking** > **Reservations** tab
10. Countdown timer shows time remaining

### Flow 3: Roommate Confirms Reservation
1. Log in with matric number (that was used in reservation)
2. Home page shows orange alert banner with pending reservations count
3. Tap on alert banner OR notification icon
4. View list of reservations made for them
5. See reservation details and time remaining
6. Tap **Confirm Reservation** button
7. Confirm in alert dialog
8. Reservation converts to a booking
9. Bed space status changes to "occupied"
10. Booking appears in **My Booking** > **My Rooms** tab

### Flow 4: Reservation Expires
1. System checks reservations every minute
2. When expiry date passes:
   - Reservation status changes to "expired"
   - Bed space status changes back to "available"
   - Bed becomes available for other students to book
3. Expired reservation appears in **My Booking** with red "Expired" badge

## UI Components

### Home Page (`app/(tabs)/index.tsx`)
- **Notification Badge**: Shows count of pending reservations
- **Alert Banner**: Orange banner prompting user to confirm reservations
- **Quick Actions**: Links to browse rooms, bookings, etc.

### Rooms Page (`app/(tabs)/rooms.tsx`)
- **Search Bar**: Filter rooms by number or block
- **Block Filter**: Filter by Block A, B, C, D
- **Room Cards**: Show available, reserved, and occupied bed counts
- **Status Indicators**: Green (available), Orange (reserved), Gray (occupied)

### Room Details Page (`app/room-details.tsx`)
- **Bed Space Grid**: Visual grid showing all 4 beds
- **Bed Status**: Color-coded indicators
- **Action Buttons**:
  - **Book Bed**: Always visible for available beds
  - **Reserve**: Only visible if user has booking in this room
- **Modals**:
  - Book confirmation modal
  - Reserve modal with matric input and duration selector

### My Booking Page (`app/(tabs)/my-booking.tsx`)
- **Tab Switcher**: Toggle between "My Rooms" and "Reservations"
- **My Rooms Tab**: Shows confirmed bookings
- **Reservations Tab**: Shows reservations made for roommates
- **Status Badges**: Color-coded status indicators
- **Time Remaining**: Countdown for active reservations

### Confirm Reservation Page (`app/confirm-reservation.tsx`)
- **Reservation Cards**: List of pending reservations for logged-in user
- **Details**: Reserver name, dates, room details
- **Time Remaining**: Countdown with color coding:
  - Green: > 24 hours remaining
  - Orange: ≤ 24 hours remaining
  - Red: Expired
- **Confirm Button**: Converts reservation to booking

## Validation Rules

### Booking Validation
✅ User must be logged in
✅ Bed space must be available (not reserved or occupied)
✅ Cannot book multiple beds in the same room

### Reservation Validation
✅ User must have an active booking in the same room
✅ Bed space must be available
✅ Duration must be between 3 and 5 days
✅ Roommate matric number is required
✅ Cannot reserve already reserved or occupied beds

### Confirmation Validation
✅ Reservation must exist
✅ Matric number must match the `reservedFor` field
✅ Reservation must be active (not expired or cancelled)
✅ Reservation must not have passed expiry date

## Automatic Processes

### Expiry Check (Every 1 Minute)
```typescript
useEffect(() => {
  const interval = setInterval(checkExpiredReservations, 60000);
  checkExpiredReservations(); // Run immediately
  return () => clearInterval(interval);
}, [reservations]);
```

### Actions Performed:
1. Check all active reservations
2. Compare expiry date with current time
3. If expired:
   - Update reservation status to "expired"
   - Update bed space status to "available"
   - Remove reservationId from bed space

## Future Enhancements (Not Implemented)

### Email/SMS Notifications
- Send email/SMS when reservation is created
- Send reminder 24 hours before expiry
- Send notification when reservation expires
- Send confirmation when roommate confirms

### Payment Integration
- Payment for reserved student when they confirm
- Refund/penalty system for expired reservations

### Persistent Storage
- Currently uses in-memory state (mock data)
- Integrate with backend API:
  - POST `/api/reservations` - Create reservation
  - GET `/api/reservations/:matricNumber` - Get reservations
  - PUT `/api/reservations/:id/confirm` - Confirm reservation
  - DELETE `/api/reservations/:id` - Cancel reservation

### Advanced Features
- Allow student to cancel their reservation
- Set custom expiry dates
- Reserve multiple beds at once
- Room preference matching
- Waitlist for fully booked rooms

## Testing Scenarios

### Scenario 1: Happy Path - Reserve & Confirm
1. Student A books Bed 1 in Room 101
2. Student A reserves Bed 2 for Student B (3 days)
3. Student B logs in and sees pending reservation
4. Student B confirms reservation
5. ✅ Both students have active bookings in Room 101

### Scenario 2: Reservation Expires
1. Student A books Bed 1 in Room 101
2. Student A reserves Bed 2 for Student B (3 days)
3. Wait for 3 days (or manually change system time)
4. ✅ Reservation status changes to "expired"
5. ✅ Bed 2 becomes available again
6. Student C can now book Bed 2

### Scenario 3: Validation Errors
1. Student A (no booking) tries to reserve bed
   - ❌ Error: "You must have a booking in this room first"
2. Student A tries to reserve with invalid duration (2 days)
   - ❌ Error: "Reservation duration must be between 3 and 5 days"
3. Student B tries to confirm with wrong matric number
   - ❌ Error: "This reservation is not for your matric number"

## Mock Data

### Generated Rooms
- 4 blocks (A, B, C, D)
- 10 rooms per block (101-110)
- 4 beds per room
- Total: 160 bed spaces

### Price Ranges
- Block A: ₦50,000 per bed
- Block B: ₦60,000 per bed
- Block C: ₦70,000 per bed
- Block D: ₦80,000 per bed

### Default Amenities
- WiFi
- Study Desk
- Wardrobe
- Air Conditioning

## API Integration Guide (For Backend Developers)

### Required Endpoints

#### 1. GET `/api/rooms`
Returns all rooms with bed space availability.

**Response:**
```json
{
  "rooms": [
    {
      "id": "room-1",
      "blockName": "Block A",
      "roomNumber": "101",
      "totalBeds": 4,
      "bedSpaces": [
        {
          "id": "bed-1-1",
          "bedNumber": 1,
          "status": "available",
          "occupantId": null,
          "reservationId": null
        }
      ],
      "pricePerBed": 50000,
      "floor": 1,
      "amenities": ["WiFi", "Study Desk", "Wardrobe", "Air Conditioning"]
    }
  ]
}
```

#### 2. POST `/api/bookings`
Creates a new booking.

**Request:**
```json
{
  "studentId": "CSC/2023/001",
  "roomId": "room-1",
  "bedSpaceId": "bed-1-1"
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "booking-123",
    "studentId": "CSC/2023/001",
    "roomId": "room-1",
    "bedSpaceId": "bed-1-1",
    "bookingDate": "2025-10-25T10:00:00Z",
    "status": "active",
    "amountPaid": 50000
  }
}
```

#### 3. POST `/api/reservations`
Creates a reservation for a roommate.

**Request:**
```json
{
  "reserverId": "CSC/2023/001",
  "reservedFor": "CSC/2023/002",
  "roomId": "room-1",
  "bedSpaceId": "bed-1-2",
  "durationDays": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Space reserved until 2025-10-28",
  "reservation": {
    "id": "reservation-123",
    "reserverId": "CSC/2023/001",
    "reservedFor": "CSC/2023/002",
    "roomId": "room-1",
    "bedSpaceId": "bed-1-2",
    "status": "active",
    "reservationDate": "2025-10-25T10:00:00Z",
    "expiryDate": "2025-10-28T10:00:00Z",
    "durationDays": 3
  }
}
```

#### 4. GET `/api/reservations/for/:matricNumber`
Gets active reservations for a specific student.

**Response:**
```json
{
  "reservations": [
    {
      "id": "reservation-123",
      "reserverId": "CSC/2023/001",
      "reserverName": "John Doe",
      "reservedFor": "CSC/2023/002",
      "roomId": "room-1",
      "bedSpaceId": "bed-1-2",
      "roomDetails": {
        "blockName": "Block A",
        "roomNumber": "101",
        "bedNumber": 2
      },
      "status": "active",
      "expiryDate": "2025-10-28T10:00:00Z"
    }
  ]
}
```

#### 5. PUT `/api/reservations/:id/confirm`
Confirms a reservation.

**Request:**
```json
{
  "matricNumber": "CSC/2023/002"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reservation confirmed successfully",
  "booking": {
    "id": "booking-456",
    "studentId": "CSC/2023/002",
    "roomId": "room-1",
    "bedSpaceId": "bed-1-2",
    "status": "active"
  }
}
```

#### 6. Background Job: Expire Reservations
Run a cron job every hour to check and expire reservations.

**Pseudocode:**
```javascript
function expireReservations() {
  const now = new Date();
  const expiredReservations = db.reservations.find({
    status: 'active',
    expiryDate: { $lt: now }
  });

  for (const reservation of expiredReservations) {
    // Update reservation
    db.reservations.update(
      { id: reservation.id },
      { status: 'expired' }
    );

    // Free up bed space
    db.bedSpaces.update(
      { id: reservation.bedSpaceId },
      { 
        status: 'available',
        reservationId: null
      }
    );

    // Optional: Send notification
    sendNotification(reservation.reserverId, 'Reservation expired');
  }
}
```

## Conclusion

The Roommate Reservation System is a comprehensive feature that allows students to secure bed spaces for their friends who haven't resumed yet. The system includes automatic expiry, validation, and a complete UI flow from reservation to confirmation.

All core requirements have been implemented:
✅ Multiple bed spaces per room
✅ Reservation by existing students
✅ Fixed duration (3-5 days)
✅ Reserved spaces locked from other bookings
✅ Confirmation by roommate with matric number
✅ Tracking of all required fields
✅ Automatic expiry and space release
✅ Status updates on confirmation
✅ Notification system (UI badges and alerts)

The system is currently using mock data and can be easily integrated with a backend API using the provided API guide.
