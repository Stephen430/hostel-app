# Same Room Reservation - How It Works

## ✅ The Rule: Reserve ONLY in Your Room

**A student can ONLY reserve a bed space for their roommate in THE SAME ROOM where they already have a booking.**

---

## 📋 Example Scenario

### Student A (John) - CSC/2023/001

**Step 1: Book Your Bed First**

- John browses rooms and finds **Block A, Room 101**
- He books **Bed 1** for himself
- ✅ John now has a booking in Room 101

**Step 2: Reserve for Roommate**

- John goes to **Block A, Room 101** (same room)
- He sees the **"Reserve"** button (appears because he has a bed here)
- He selects **Bed 2** (available)
- Clicks **"Reserve for Roommate"**
- Enters his friend's matric number: **CSC/2023/002** (Student B - Mary)
- Chooses duration: **3 days**
- ✅ Bed 2 is now RESERVED for Mary

### Student B (Mary) - CSC/2023/002

**Step 3: Confirm Reservation**

- Mary logs in with her matric number: CSC/2023/002
- She sees a **notification badge** on home page
- Taps the **orange alert banner**
- Views reservation details:
  - Reserved by: John (CSC/2023/001)
  - Room: Block A, Room 101, Bed 2
  - Time remaining: 2 days, 18 hours
- Clicks **"Confirm Reservation"**
- ✅ Bed 2 is now BOOKED for Mary

**Result:** John and Mary are now roommates in **Block A, Room 101**! 🎉

---

## ❌ What CANNOT Happen

### ❌ Scenario 1: No Booking in Room

- John has a booking in **Block A, Room 101** (Bed 1)
- John tries to reserve a bed in **Block B, Room 205**
- **ERROR:** "You must have a booking in this room first"
- ❌ **Reserve button doesn't appear** in Block B

### ❌ Scenario 2: Student Without Any Booking

- Tom has NO bookings anywhere
- Tom tries to reserve a bed for his friend in any room
- **ERROR:** "You must have a booking in this room first"
- ❌ **Reserve button never appears**

---

## 🎯 UI Indicators

### When You DON'T Have a Booking in the Room

```
┌─────────────────────────────────────────┐
│ ℹ️ Book a bed in this room first to    │
│    reserve for roommates                │
└─────────────────────────────────────────┘
┌────────────┐
│ Book Bed   │  ← Only this button shows
└────────────┘
```

### When You HAVE a Booking in the Room

```
┌────────────┐  ┌────────────┐
│ Book Bed   │  │ Reserve    │  ← Both buttons show
└────────────┘  └────────────┘

Bed 2 selected • You have a bed in this room
```

### Reserve Modal Shows

```
┌─────────────────────────────────────────┐
│ ✅ Same Room Reservation                │
│                                         │
│ Reserve a bed in Block A, Room 101 for │
│ your roommate                           │
└─────────────────────────────────────────┘
```

---

## 🔒 Technical Validation

### Frontend Check (UI)

```typescript
// In room-details.tsx
const userHasBookingInRoom = bookings.some(
  (b) => b.roomId === room.id && b.studentId === user?.matricNumber
);

// Reserve button only shows when true
{userHasBookingInRoom && (
  <TouchableOpacity onPress={() => setShowReserveModal(true)}>
    <Text>Reserve</Text>
  </TouchableOpacity>
)}
```

### Backend Check (Context)

```typescript
// In ReservationContext.tsx
const userHasBooking = bookings.some(
  (b) => b.roomId === roomId && b.studentId === user.matricNumber
);

if (!userHasBooking) {
  return {
    success: false,
    message: "You must have a booking in this room first",
  };
}
```

---

## 📊 Complete Flow Chart

```
┌─────────────────────┐
│  Student Logs In    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Browse Rooms       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐      ┌─────────────────────┐
│  Book a Bed         │──────▶│  Booking Confirmed  │
│  (e.g., Room 101)   │      │  (Room 101, Bed 1)  │
└─────────────────────┘      └──────────┬──────────┘
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │ Go to SAME ROOM (101) │
                            └──────────┬────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                     │
                    ▼                                     ▼
        ┌──────────────────────┐           ┌──────────────────────┐
        │ Reserve Button Shows │           │ Different Room?      │
        │ (You have a bed here)│           │ No Reserve Button    │
        └──────────┬───────────┘           └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Select Available Bed │
        │ (e.g., Bed 2, 3, 4)  │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Enter Roommate Info  │
        │ (Matric Number)      │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Choose Duration      │
        │ (3, 4, or 5 days)    │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Reservation Created  │
        │ ✅ Same Room!        │
        └──────────────────────┘
```

---

## 💡 Benefits of Same Room Restriction

1. **Guaranteed Roommates**: Friends stay in the SAME room, not just same building
2. **No Confusion**: Clear which room the reservation is for
3. **Easier Management**: Students manage their own room's occupancy
4. **Fair System**: Can't reserve beds in multiple rooms
5. **Room Coordination**: All roommates in one place for better coordination

---

## 🚀 Quick Test Instructions

1. **Login as Student 1** (e.g., CSC/2023/001)
2. **Book Bed 1** in Block A, Room 101
3. **Go back to Block A, Room 101**
4. **Notice:** Reserve button appears! ✅
5. **Select Bed 2** and tap Reserve
6. **Enter Student 2's matric** (e.g., CSC/2023/002)
7. **Reservation created** ✅
8. **Try going to Room 102**
9. **Notice:** Reserve button does NOT appear ❌
10. **Logout and login as Student 2**
11. **Confirm the reservation** ✅
12. **Both students now in Room 101** 🎉

---

## ✅ Summary

- ✅ **Same Room ONLY**: Can only reserve in the room where you have a booking
- ✅ **UI Enforced**: Reserve button hidden if no booking in that room
- ✅ **Backend Validated**: Double-check ensures rule is enforced
- ✅ **Clear Messages**: Users know exactly why they can/can't reserve
- ✅ **Roommates Together**: Ensures friends stay in the SAME room

This design ensures students can keep their friends together in the same room, making the hostel experience better for everyone! 🏠
