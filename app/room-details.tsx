import { PaymentGate } from "@/components/PaymentGate";
import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import { BedSpace } from "@/types/reservation";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoomDetailsScreen() {
  const { roomId } = useLocalSearchParams();
  const { getRoomById, bookRoom, reserveSpaceForRoommate, bookings } =
    useReservation();
  const { user } = useAuth();
  const room = getRoomById(roomId as string);

  const [selectedBed, setSelectedBed] = useState<BedSpace | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [roommateMatric, setRoommateMatric] = useState("");
  const [reservationDays, setReservationDays] = useState("3");

  if (!room) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-black text-xl">Room not found</Text>
        <TouchableOpacity
          className="mt-4 bg-black px-6 py-3 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const userHasBookingInRoom = bookings.some(
    (b) => b.roomId === room.id && b.studentId === user?.matricNumber
  );

  const handleBookBed = async () => {
    if (!selectedBed || !user) return;

    const success = await bookRoom(room.id, selectedBed.id);
    if (success) {
      Alert.alert("Success", "Bed booked successfully!", [
        { text: "OK", onPress: () => setShowBookModal(false) },
      ]);
      setSelectedBed(null);
    } else {
      Alert.alert("Error", "Failed to book bed. Please try again.");
    }
  };

  const handleReserveBed = async () => {
    if (!selectedBed || !user || !roommateMatric) {
      Alert.alert("Error", "Please enter roommate's matric number");
      return;
    }

    const days = parseInt(reservationDays);
    if (isNaN(days) || days < 3 || days > 5) {
      Alert.alert("Error", "Reservation duration must be between 3 and 5 days");
      return;
    }

    const result = await reserveSpaceForRoommate(
      room.id,
      selectedBed.id,
      roommateMatric,
      days
    );

    if (result.success) {
      Alert.alert("Success", result.message, [
        {
          text: "OK",
          onPress: () => {
            setShowReserveModal(false);
            setRoommateMatric("");
            setReservationDays("3");
            setSelectedBed(null);
          },
        },
      ]);
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const getBedStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "reserved":
        return "bg-orange-500";
      case "occupied":
        return "bg-gray-400";
      default:
        return "bg-gray-300";
    }
  };

  const getBedStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "reserved":
        return "Reserved";
      case "occupied":
        return "Occupied";
      default:
        return "Unknown";
    }
  };

  return (
    <PaymentGate>
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 py-6">
          <TouchableOpacity
            className="mb-6"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-white text-3xl font-bold">
                {room.blockName}
              </Text>
              <Text className="text-gray-300 text-lg mt-2">
                Room {room.roomNumber}
              </Text>
              <View className="flex-row items-center mt-3">
                <Ionicons name="location" size={16} color="#9CA3AF" />
                <Text className="text-gray-400 ml-2">Floor {room.floor}</Text>
              </View>
            </View>
            <View className="bg-white/20 px-4 py-3 rounded-2xl">
              <Text className="text-white font-bold text-xl">
                ₦{room.pricePerBed.toLocaleString()}
              </Text>
              <Text className="text-gray-300 text-xs text-center mt-1">
                per bed
              </Text>
            </View>
          </View>
        </View>

        {/* Amenities */}
        <View className="px-6 mt-6">
          <Text className="text-black text-xl font-bold mb-4">Amenities</Text>
          <View className="flex-row flex-wrap gap-3">
            {room.amenities.map((amenity, index) => (
              <View
                key={index}
                className="bg-white rounded-xl px-4 py-3 flex-row items-center"
                style={{ elevation: 1 }}
              >
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text className="text-gray-700 ml-2">{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bed Spaces */}
        <View className="px-6 mt-6">
          <Text className="text-black text-xl font-bold mb-4">Bed Spaces</Text>
          <View className="bg-white rounded-2xl p-5" style={{ elevation: 2 }}>
            <View className="flex-row flex-wrap gap-4">
              {room.bedSpaces.map((bed) => (
                <TouchableOpacity
                  key={bed.id}
                  className={`flex-1 min-w-[45%] rounded-xl p-4 border-2 ${
                    selectedBed?.id === bed.id
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      bed.status === "available" ? "#F0FDF4" : "#F9FAFB",
                  }}
                  onPress={() =>
                    bed.status === "available" && setSelectedBed(bed)
                  }
                  disabled={bed.status !== "available"}
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View>
                      <Text className="text-gray-600 text-sm">Bed</Text>
                      <Text className="text-black text-2xl font-bold">
                        {bed.bedNumber}
                      </Text>
                    </View>
                    <View
                      className={`${getBedStatusColor(
                        bed.status
                      )} w-3 h-3 rounded-full`}
                    />
                  </View>
                  <View
                    className={`${
                      bed.status === "available"
                        ? "bg-green-100"
                        : bed.status === "reserved"
                        ? "bg-orange-100"
                        : "bg-gray-200"
                    } px-3 py-1 rounded-full`}
                  >
                    <Text
                      className={`text-xs font-semibold text-center ${
                        bed.status === "available"
                          ? "text-green-600"
                          : bed.status === "reserved"
                          ? "text-orange-600"
                          : "text-gray-600"
                      }`}
                    >
                      {getBedStatusText(bed.status)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Legend */}
        <View className="px-6 mt-4 mb-6">
          <View className="bg-white rounded-xl p-4" style={{ elevation: 1 }}>
            <View className="flex-row justify-around">
              <View className="flex-row items-center">
                <View className="bg-green-500 w-4 h-4 rounded-full mr-2" />
                <Text className="text-gray-600 text-sm">Available</Text>
              </View>
              <View className="flex-row items-center">
                <View className="bg-orange-500 w-4 h-4 rounded-full mr-2" />
                <Text className="text-gray-600 text-sm">Reserved</Text>
              </View>
              <View className="flex-row items-center">
                <View className="bg-gray-400 w-4 h-4 rounded-full mr-2" />
                <Text className="text-gray-600 text-sm">Occupied</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {selectedBed && (
        <View className="bg-white px-6 py-4 border-t border-gray-200">
          {!userHasBookingInRoom && (
            <View className="bg-blue-50 rounded-xl p-3 mb-3 flex-row items-center">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text className="text-blue-600 text-xs ml-2 flex-1">
                Book a bed in this room first to reserve for roommates
              </Text>
            </View>
          )}
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-black rounded-xl py-4 flex-row items-center justify-center"
              onPress={() => setShowBookModal(true)}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Book Bed</Text>
            </TouchableOpacity>
            {userHasBookingInRoom && (
              <TouchableOpacity
                className="flex-1 bg-blue-600 rounded-xl py-4 flex-row items-center justify-center"
                onPress={() => setShowReserveModal(true)}
              >
                <Ionicons name="people" size={20} color="white" />
                <Text className="text-white font-bold ml-2">Reserve</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text className="text-gray-500 text-xs text-center mt-3">
            Bed {selectedBed.bedNumber} selected
            {userHasBookingInRoom && " • You have a bed in this room"}
          </Text>
        </View>
      )}

      {/* Book Modal */}
      <Modal
        visible={showBookModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-black text-2xl font-bold">
                Confirm Booking
              </Text>
              <TouchableOpacity onPress={() => setShowBookModal(false)}>
                <Ionicons name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>

            <View className="bg-gray-50 rounded-2xl p-4 mb-6">
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Room</Text>
                <Text className="text-black font-semibold">
                  {room.blockName} - {room.roomNumber}
                </Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Bed Number</Text>
                <Text className="text-black font-semibold">
                  {selectedBed?.bedNumber}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Amount</Text>
                <Text className="text-black font-bold text-lg">
                  ₦{room.pricePerBed.toLocaleString()}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-4"
                onPress={() => setShowBookModal(false)}
              >
                <Text className="text-black font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-black rounded-xl py-4"
                onPress={handleBookBed}
              >
                <Text className="text-white font-semibold text-center">
                  Confirm Booking
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reserve Modal */}
      <Modal
        visible={showReserveModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReserveModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-black text-2xl font-bold">
                    Reserve for Roommate
                  </Text>
                  <TouchableOpacity onPress={() => setShowReserveModal(false)}>
                    <Ionicons name="close" size={28} color="black" />
                  </TouchableOpacity>
                </View>

            <View className="bg-green-50 rounded-2xl p-4 mb-4">
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <View className="ml-2 flex-1">
                  <Text className="text-green-700 font-semibold mb-1">
                    Same Room Reservation
                  </Text>
                  <Text className="text-green-600 text-xs">
                    Reserve a bed in {room.blockName}, Room {room.roomNumber} for your roommate
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-blue-50 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center">
                <Ionicons name="time" size={20} color="#3B82F6" />
                <Text className="text-blue-600 text-sm ml-2 flex-1">
                  Reservation will be held for 3-5 days
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">
                Roommate&apos;s Matric Number
              </Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-4 text-black text-base border border-gray-200"
                placeholder="e.g., CSC/2023/001"
                value={roommateMatric}
                onChangeText={setRoommateMatric}
                autoCapitalize="characters"
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">
                Reservation Duration (days)
              </Text>
              <View className="flex-row gap-3">
                {["3", "4", "5"].map((days) => (
                  <TouchableOpacity
                    key={days}
                    className={`flex-1 rounded-xl py-3 border-2 ${
                      reservationDays === days
                        ? "border-black bg-black"
                        : "border-gray-200 bg-white"
                    }`}
                    onPress={() => setReservationDays(days)}
                  >
                    <Text
                      className={`text-center font-bold ${
                        reservationDays === days ? "text-white" : "text-black"
                      }`}
                    >
                      {days} Days
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-4"
                onPress={() => setShowReserveModal(false)}
              >
                <Text className="text-black font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-600 rounded-xl py-4"
                onPress={handleReserveBed}
              >
                <Text className="text-white font-semibold text-center">
                  Reserve Bed
                </Text>
              </TouchableOpacity>
            </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
    </PaymentGate>
  );
}
