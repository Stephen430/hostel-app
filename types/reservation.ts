export type BedSpaceStatus = "available" | "occupied" | "reserved";
export type ReservationStatus = "active" | "confirmed" | "expired" | "cancelled";
export type PaymentStatus = "pending" | "confirmed" | "failed";
export type PaymentMethod = "cash" | "bank_transfer" | "online" | "card";

export interface PaymentRecord {
  payment_id: string;
  student_matric_no: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_reference: string;
  payment_date: Date;
  description: string;
}

export interface BedSpace {
  id: string;
  bedNumber: number;
  status: BedSpaceStatus;
  occupantId?: string; // matric number of occupant
  reservationId?: string; // if status is "reserved"
}

export interface Room {
  id: string;
  blockName: string;
  roomNumber: string;
  totalBeds: number;
  bedSpaces: BedSpace[];
  pricePerBed: number;
  floor: number;
  amenities: string[];
}

export interface Reservation {
  id: string;
  reserverId: string; // matric number of student who made the reservation
  reserverName: string;
  reservedFor: string; // matric number of roommate
  roomId: string;
  bedSpaceId: string;
  roomDetails: {
    blockName: string;
    roomNumber: string;
    bedNumber: number;
  };
  status: ReservationStatus;
  reservationDate: Date;
  expiryDate: Date;
  confirmedDate?: Date;
  durationDays: number; // 3-5 days
}

export interface Booking {
  id: string;
  studentId: string; // matric number
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
