import {
  BedSpace,
  Booking,
  PaymentRecord,
  Reservation,
  ReservationStatus,
  Room,
} from "@/types/reservation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface ReservationContextType {
  rooms: Room[];
  bookings: Booking[];
  reservations: Reservation[];
  paymentRecords: PaymentRecord[];
  hasValidPayment: (matricNumber: string) => boolean;
  addPaymentRecord: (payment: PaymentRecord) => void;
  bookRoom: (roomId: string, bedSpaceId: string) => Promise<boolean>;
  reserveSpaceForRoommate: (
    roomId: string,
    bedSpaceId: string,
    roommateMatricNumber: string,
    durationDays: number
  ) => Promise<{ success: boolean; message: string }>;
  confirmReservation: (
    reservationId: string,
    matricNumber: string
  ) => Promise<{ success: boolean; message: string }>;
  getMyReservations: () => Reservation[];
  getReservationsForMe: (matricNumber: string) => Reservation[];
  checkExpiredReservations: () => void;
  getAvailableBedSpaces: (roomId: string) => BedSpace[];
  getRoomById: (roomId: string) => Room | undefined;
}

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

// Mock room data
const generateMockRooms = (): Room[] => {
  const blocks = ["A", "B", "C", "D"];
  const rooms: Room[] = [];
  let roomCounter = 0;

  blocks.forEach((block, blockIndex) => {
    for (let roomNum = 101; roomNum <= 110; roomNum++) {
      roomCounter++;
      const bedSpaces: BedSpace[] = [];

      for (let bedNum = 1; bedNum <= 4; bedNum++) {
        bedSpaces.push({
          id: `bed-${roomCounter}-${bedNum}`,
          bedNumber: bedNum,
          status: "available",
        });
      }

      rooms.push({
        id: `room-${roomCounter}`,
        blockName: `Block ${block}`,
        roomNumber: roomNum.toString(),
        totalBeds: 4,
        bedSpaces,
        pricePerBed: 50000 + blockIndex * 10000,
        floor: Math.floor((roomNum - 100) / 10),
        amenities: ["WiFi", "Study Desk", "Wardrobe", "Air Conditioning"],
      });
    }
  });

  return rooms;
};

// Mock payment records
const generateMockPaymentRecords = (): PaymentRecord[] => {
  return [
    {
      payment_id: "PAY001",
      student_matric_no: "CS/2020/001",
      amount: 50000,
      payment_method: "bank_transfer",
      payment_status: "confirmed",
      transaction_reference: "TRX123456789",
      payment_date: new Date("2024-01-15"),
      description: "Initial hostel payment - Block A",
    },
    {
      payment_id: "PAY002",
      student_matric_no: "CS/2020/002",
      amount: 60000,
      payment_method: "card",
      payment_status: "confirmed",
      transaction_reference: "TRX987654321",
      payment_date: new Date("2024-01-16"),
      description: "Initial hostel payment - Block B",
    },
  ];
};

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>(generateMockRooms());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(
    generateMockPaymentRecords()
  );

  // Check for expired reservations every minute
  useEffect(() => {
    const interval = setInterval(checkExpiredReservations, 60000); // Check every minute
    checkExpiredReservations();
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservations]);

  const checkExpiredReservations = () => {
    const now = new Date();
    let hasChanges = false;

    const updatedReservations = reservations.map((reservation) => {
      if (
        reservation.status === "active" &&
        new Date(reservation.expiryDate) < now
      ) {
        hasChanges = true;
        return { ...reservation, status: "expired" as ReservationStatus };
      }
      return reservation;
    });

    if (hasChanges) {
      setReservations(updatedReservations);

      // Free up bed spaces for expired reservations
      setRooms((prevRooms) => {
        return prevRooms.map((room) => {
          const expiredReservation = updatedReservations.find(
            (r) =>
              r.roomId === room.id &&
              r.status === "expired" &&
              reservations.find((or) => or.id === r.id)?.status === "active"
          );

          if (expiredReservation) {
            return {
              ...room,
              bedSpaces: room.bedSpaces.map((bed) =>
                bed.id === expiredReservation.bedSpaceId
                  ? {
                      ...bed,
                      status: "available" as const,
                      reservationId: undefined,
                    }
                  : bed
              ),
            };
          }
          return room;
        });
      });
    }
  };

  const bookRoom = async (
    roomId: string,
    bedSpaceId: string
  ): Promise<boolean> => {
    if (!user) return false;

    const room = rooms.find((r) => r.id === roomId);
    if (!room) return false;

    const bedSpace = room.bedSpaces.find((b) => b.id === bedSpaceId);
    if (!bedSpace || bedSpace.status !== "available") return false;

    // Create booking
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      studentId: user.matricNumber,
      studentName: user.name || "Student",
      roomId,
      bedSpaceId,
      roomDetails: {
        blockName: room.blockName,
        roomNumber: room.roomNumber,
        bedNumber: bedSpace.bedNumber,
      },
      bookingDate: new Date(),
      status: "active",
      amountPaid: room.pricePerBed,
    };

    setBookings([...bookings, newBooking]);

    // Update bed space status
    setRooms((prevRooms) =>
      prevRooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              bedSpaces: r.bedSpaces.map((b) =>
                b.id === bedSpaceId
                  ? { ...b, status: "occupied" as const, occupantId: user.matricNumber }
                  : b
              ),
            }
          : r
      )
    );

    return true;
  };

  const reserveSpaceForRoommate = async (
    roomId: string,
    bedSpaceId: string,
    roommateMatricNumber: string,
    durationDays: number
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: "You must be logged in" };
    }

    // Check if user has already booked a bed in this room
    const userHasBooking = bookings.some(
      (b) => b.roomId === roomId && b.studentId === user.matricNumber
    );

    if (!userHasBooking) {
      return {
        success: false,
        message: "You must have a booking in this room first",
      };
    }

    const room = rooms.find((r) => r.id === roomId);
    if (!room) {
      return { success: false, message: "Room not found" };
    }

    const bedSpace = room.bedSpaces.find((b) => b.id === bedSpaceId);
    if (!bedSpace) {
      return { success: false, message: "Bed space not found" };
    }

    if (bedSpace.status !== "available") {
      return { success: false, message: "Bed space is not available" };
    }

    // Validate duration
    if (durationDays < 3 || durationDays > 5) {
      return {
        success: false,
        message: "Reservation duration must be between 3 and 5 days",
      };
    }

    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setDate(expiryDate.getDate() + durationDays);

    const newReservation: Reservation = {
      id: `reservation-${Date.now()}`,
      reserverId: user.matricNumber,
      reserverName: user.name || "Student",
      reservedFor: roommateMatricNumber,
      roomId,
      bedSpaceId,
      roomDetails: {
        blockName: room.blockName,
        roomNumber: room.roomNumber,
        bedNumber: bedSpace.bedNumber,
      },
      status: "active",
      reservationDate: now,
      expiryDate,
      durationDays,
    };

    setReservations([...reservations, newReservation]);

    // Update bed space to reserved
    setRooms((prevRooms) =>
      prevRooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              bedSpaces: r.bedSpaces.map((b) =>
                b.id === bedSpaceId
                  ? {
                      ...b,
                      status: "reserved" as const,
                      reservationId: newReservation.id,
                    }
                  : b
              ),
            }
          : r
      )
    );

    return {
      success: true,
      message: `Space reserved for ${roommateMatricNumber} until ${expiryDate.toLocaleDateString()}`,
    };
  };

  const confirmReservation = async (
    reservationId: string,
    matricNumber: string
  ): Promise<{ success: boolean; message: string }> => {
    const reservation = reservations.find((r) => r.id === reservationId);

    if (!reservation) {
      return { success: false, message: "Reservation not found" };
    }

    if (reservation.reservedFor !== matricNumber) {
      return {
        success: false,
        message: "This reservation is not for your matric number",
      };
    }

    if (reservation.status !== "active") {
      return {
        success: false,
        message: `Reservation is ${reservation.status}`,
      };
    }

    if (new Date(reservation.expiryDate) < new Date()) {
      return { success: false, message: "Reservation has expired" };
    }

    // Update reservation status
    setReservations((prevReservations) =>
      prevReservations.map((r) =>
        r.id === reservationId
          ? {
              ...r,
              status: "confirmed" as ReservationStatus,
              confirmedDate: new Date(),
            }
          : r
      )
    );

    // Create booking for the roommate
    const room = rooms.find((r) => r.id === reservation.roomId);
    if (room) {
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        studentId: matricNumber,
        studentName: matricNumber, // In real app, fetch from user database
        roomId: reservation.roomId,
        bedSpaceId: reservation.bedSpaceId,
        roomDetails: reservation.roomDetails,
        bookingDate: new Date(),
        status: "active",
        amountPaid: room.pricePerBed,
      };

      setBookings([...bookings, newBooking]);

      // Update bed space to occupied
      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.id === reservation.roomId
            ? {
                ...r,
                bedSpaces: r.bedSpaces.map((b) =>
                  b.id === reservation.bedSpaceId
                    ? {
                        ...b,
                        status: "occupied" as const,
                        occupantId: matricNumber,
                        reservationId: undefined,
                      }
                    : b
                ),
              }
            : r
        )
      );
    }

    return {
      success: true,
      message: "Reservation confirmed successfully",
    };
  };

  const getMyReservations = (): Reservation[] => {
    if (!user) return [];
    return reservations.filter((r) => r.reserverId === user.matricNumber);
  };

  const getReservationsForMe = (matricNumber: string): Reservation[] => {
    return reservations.filter(
      (r) => r.reservedFor === matricNumber && r.status === "active"
    );
  };

  const getAvailableBedSpaces = (roomId: string): BedSpace[] => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return [];
    return room.bedSpaces.filter((b) => b.status === "available");
  };

  const getRoomById = (roomId: string): Room | undefined => {
    return rooms.find((r) => r.id === roomId);
  };

  // Payment verification functions
  const hasValidPayment = (matricNumber: string): boolean => {
    const payment = paymentRecords.find(
      (p) =>
        p.student_matric_no === matricNumber && p.payment_status === "confirmed"
    );
    return !!payment;
  };

  const addPaymentRecord = (payment: PaymentRecord): void => {
    setPaymentRecords((prev) => [...prev, payment]);
  };

  return (
    <ReservationContext.Provider
      value={{
        rooms,
        bookings,
        reservations,
        paymentRecords,
        hasValidPayment,
        addPaymentRecord,
        bookRoom,
        reserveSpaceForRoommate,
        confirmReservation,
        getMyReservations,
        getReservationsForMe,
        checkExpiredReservations,
        getAvailableBedSpaces,
        getRoomById,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
};
