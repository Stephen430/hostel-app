import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import { Booking, Reservation } from "@/types/reservation";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyBookingScreen() {
  const { bookings, getMyReservations } = useReservation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"bookings" | "reservations">(
    "bookings"
  );

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-black text-xl">Please log in</Text>
      </SafeAreaView>
    );
  }

  const myBookings = bookings.filter((b) => b.studentId === user.matricNumber);
  const myReservations = getMyReservations();

  const getTimeRemaining = (expiryDate: Date) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-600";
      case "confirmed":
        return "bg-blue-50 text-blue-600";
      case "expired":
        return "bg-red-50 text-red-600";
      case "cancelled":
        return "bg-gray-50 text-gray-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm" style={{ elevation: 2 }}>
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-black text-xl font-bold">
            {booking.roomDetails.blockName}
          </Text>
          <Text className="text-gray-600 text-base mt-1">
            Room {booking.roomDetails.roomNumber}, Bed{" "}
            {booking.roomDetails.bedNumber}
          </Text>
        </View>
        <View className="bg-green-50 px-3 py-2 rounded-full">
          <Text className="text-green-600 font-semibold text-xs">
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-600">Booking Date</Text>
          <Text className="text-black font-semibold">
            {new Date(booking.bookingDate).toLocaleDateString()}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600">Amount Paid</Text>
          <Text className="text-black font-bold">
            ₦{booking.amountPaid.toLocaleString()}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center">
        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        <Text className="text-green-600 ml-2 font-semibold">
          Booking Confirmed
        </Text>
      </View>
    </View>
  );

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm" style={{ elevation: 2 }}>
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-black text-xl font-bold">
            {reservation.roomDetails.blockName}
          </Text>
          <Text className="text-gray-600 text-base mt-1">
            Room {reservation.roomDetails.roomNumber}, Bed{" "}
            {reservation.roomDetails.bedNumber}
          </Text>
        </View>
        <View
          className={`px-3 py-2 rounded-full ${getStatusColor(
            reservation.status
          )}`}
        >
          <Text className="font-semibold text-xs">
            {reservation.status.charAt(0).toUpperCase() +
              reservation.status.slice(1)}
          </Text>
        </View>
      </View>

      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-600">Reserved For</Text>
          <Text className="text-black font-semibold">
            {reservation.reservedFor}
          </Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-600">Reservation Date</Text>
          <Text className="text-black font-semibold">
            {new Date(reservation.reservationDate).toLocaleDateString()}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600">Expires</Text>
          <Text className="text-black font-semibold">
            {new Date(reservation.expiryDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {reservation.status === "active" && (
        <View className="bg-orange-50 rounded-xl p-3 flex-row items-center">
          <Ionicons name="time" size={20} color="#EA580C" />
          <Text className="text-orange-600 ml-2 font-semibold">
            {getTimeRemaining(reservation.expiryDate)} remaining
          </Text>
        </View>
      )}

      {reservation.status === "confirmed" && (
        <View className="flex-row items-center">
          <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
          <Text className="text-blue-600 ml-2 font-semibold">
            Confirmed on{" "}
            {reservation.confirmedDate &&
              new Date(reservation.confirmedDate).toLocaleDateString()}
          </Text>
        </View>
      )}

      {reservation.status === "expired" && (
        <View className="flex-row items-center">
          <Ionicons name="close-circle" size={20} color="#DC2626" />
          <Text className="text-red-600 ml-2 font-semibold">
            Reservation Expired
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 py-6 rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-white text-2xl font-bold">My Bookings</Text>
              <Text className="text-gray-400 text-sm mt-1">
                {user.matricNumber}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-white/20 p-3 rounded-full"
              onPress={() => router.push("/confirm-reservation")}
            >
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Tab Selector */}
          <View className="bg-white/10 backdrop-blur rounded-2xl p-1 flex-row">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl ${
                activeTab === "bookings" ? "bg-white" : ""
              }`}
              onPress={() => setActiveTab("bookings")}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "bookings" ? "text-black" : "text-white"
                }`}
              >
                My Rooms ({myBookings.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl ${
                activeTab === "reservations" ? "bg-white" : ""
              }`}
              onPress={() => setActiveTab("reservations")}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "reservations" ? "text-black" : "text-white"
                }`}
              >
                Reservations ({myReservations.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 mt-6 mb-6">
          {activeTab === "bookings" ? (
            myBookings.length > 0 ? (
              myBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <View className="bg-white rounded-2xl p-8 items-center" style={{ elevation: 2 }}>
                <View className="bg-gray-100 w-20 h-20 rounded-full items-center justify-center mb-4">
                  <Ionicons name="bed-outline" size={40} color="#9CA3AF" />
                </View>
                <Text className="text-black text-xl font-bold mb-2">
                  No Bookings Yet
                </Text>
                <Text className="text-gray-500 text-center mb-6">
                  You haven&apos;t booked any rooms. Browse available rooms to
                  get started.
                </Text>
                <TouchableOpacity
                  className="bg-black px-6 py-3 rounded-full"
                  onPress={() => router.push("/rooms")}
                >
                  <Text className="text-white font-semibold">Browse Rooms</Text>
                </TouchableOpacity>
              </View>
            )
          ) : myReservations.length > 0 ? (
            myReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <View className="bg-white rounded-2xl p-8 items-center" style={{ elevation: 2 }}>
              <View className="bg-gray-100 w-20 h-20 rounded-full items-center justify-center mb-4">
                <Ionicons name="people-outline" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-black text-xl font-bold mb-2">
                No Reservations
              </Text>
              <Text className="text-gray-500 text-center mb-6">
                You haven&apos;t reserved any spaces for roommates yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
