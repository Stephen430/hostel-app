# Payment Verification System Guide

## Overview

The payment verification system ensures that students complete their hostel payment before they can access room booking features. This provides revenue security and prevents unpaid room reservations.

## How It Works

### 1. Payment Status Check

When students attempt to access the Rooms page or Room Details page, the system checks if they have a confirmed payment record:

- **Paid Students**: Can browse rooms, view details, book beds, and reserve spaces for roommates
- **Unpaid Students**: See a payment prompt with a "Make Payment" button and cannot access booking features

### 2. Payment Gate Component

The `PaymentGate` component is a reusable wrapper that:
- Checks the current user's payment status
- Displays a blocking screen for unpaid students
- Shows the message: "Please complete your hostel payment to continue"
- Provides a "Make Payment" button that redirects to the Payment page
- Renders protected content only for paid students

### 3. Payment Process

**For Unpaid Students:**

1. Navigate to any protected page (Rooms or Room Details)
2. See the payment required screen
3. Click "Make Payment"
4. Choose payment method (Card or Bank Transfer)
5. Complete payment details
6. System creates a confirmed payment record
7. Gain immediate access to room booking features

**Payment Methods:**
- **Card Payment**: Enter card number, expiry date, and CVV
- **Bank Transfer**: Follow bank transfer instructions

## Payment Record Structure

Each payment record contains:

```typescript
{
  payment_id: string;           // Unique payment identifier (e.g., "PAY-1234567890")
  student_matric_no: string;    // Student's matriculation number
  amount: number;               // Payment amount in Naira
  payment_method: string;       // "card" | "bank_transfer" | "cash" | "online"
  payment_status: string;       // "confirmed" | "pending" | "failed"
  transaction_reference: string; // Transaction reference (e.g., "TRX-1234567890")
  payment_date: Date;           // Date of payment
  description: string;          // Payment description (e.g., "Initial hostel payment")
}
```

## Features

### Initial Payment Alert

On the Payment page, unpaid students see:
- **Orange Alert Box** with payment requirement notice
- **Amount**: ₦50,000 (initial hostel payment)
- **Make Initial Payment Button**: Quick access to payment modal

### Payment History

Displays all confirmed payments with:
- Payment description
- Amount paid
- Payment date
- Transaction reference
- Payment status badge

### Real-time Verification

Payment verification happens in real-time:
- After completing payment, access is granted immediately
- No need to logout/login or refresh the app
- System automatically updates payment status

## Protected Pages

The following pages are protected by the payment gate:

1. **Rooms Page** (`app/(tabs)/rooms.tsx`)
   - Browse available rooms
   - Search and filter by block
   - View bed space availability

2. **Room Details Page** (`app/room-details.tsx`)
   - View room details and amenities
   - Book bed spaces
   - Reserve spaces for roommates

## Implementation Details

### ReservationContext

The `ReservationContext` manages payment verification:

```typescript
// Check if student has valid payment
hasValidPayment(matricNumber: string): boolean

// Add new payment record
addPaymentRecord(payment: PaymentRecord): void

// Payment records state
paymentRecords: PaymentRecord[]
```

### Mock Payment Records

For development/testing, the system includes mock payment records for:
- Student: CS/2020/001 - ₦50,000 (confirmed)
- Student: CS/2020/002 - ₦60,000 (confirmed)

### Adding New Payments

When a student completes payment:

1. Payment modal collects payment details
2. System validates card information (if card payment)
3. Creates new PaymentRecord with:
   - Unique payment_id
   - Student's matric number
   - Payment amount
   - Selected payment method
   - Status: "confirmed"
   - Transaction reference
   - Current date
   - Description
4. Adds record to context using `addPaymentRecord()`
5. Updates UI to show payment success
6. Student gains immediate access to booking features

## User Experience Flow

### First-time User (Unpaid)

1. Login to app
2. Navigate to "Rooms" tab
3. See payment required screen
4. Click "Make Payment"
5. Complete payment process
6. Automatically redirected to Rooms page
7. Can now browse and book rooms

### Returning User (Paid)

1. Login to app
2. Navigate to "Rooms" tab
3. Immediately see available rooms
4. Browse, search, filter rooms
5. View room details
6. Book beds or reserve for roommates

## Security Features

- Payment status checked on each page access
- Cannot bypass payment gate by direct navigation
- Payment records stored in context (in production, use secure backend)
- Transaction references generated for audit trail
- Payment status clearly indicated (confirmed/pending/failed)

## Testing

### Test as Paid Student

Use mock credentials:
- Matric Number: CS/2020/001 or CS/2020/002
- These students have confirmed payments in mock data

### Test as Unpaid Student

Use any other matric number:
- Student will see payment required screen
- Complete payment to test full flow
- Payment record will be created in context

## Benefits

1. **Revenue Protection**: Ensures payment before room allocation
2. **User-Friendly**: Clear messaging and easy payment process
3. **Immediate Access**: No delays after payment
4. **Audit Trail**: Complete payment history with references
5. **Flexible Payment**: Multiple payment methods supported
6. **Scalable**: Easy to add more payment gateways (Paystack, Flutterwave)

## Future Enhancements

- Integration with real payment gateways (Paystack/Flutterwave)
- Email/SMS payment confirmations
- Payment receipts generation
- Partial payment support
- Payment plan options
- Refund processing
- Admin dashboard for payment monitoring

## Troubleshooting

**Issue**: Student paid but still sees payment required screen

**Solution**: Check that:
- Payment status is "confirmed" (not "pending")
- Matric number matches exactly
- Payment record exists in context

**Issue**: Payment not showing in history

**Solution**: Verify:
- Payment record was added to context
- Student is viewing correct tab (History/Pending)
- Matric number filter is correct

## Support

For payment-related issues:
1. Check payment status in Payment page
2. Verify transaction reference
3. Contact hostel administration with reference number
