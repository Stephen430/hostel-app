import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import { Reservation } from "@/types/reservation";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfirmReservationScreen() {
  const { getReservationsForMe, confirmReservation } = useReservation();
  const { user } = useAuth();

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-black text-xl">Please log in</Text>
      </SafeAreaView>
    );
  }

  const myReservations = getReservationsForMe(user.matricNumber);

  const handleConfirmReservation = async (reservationId: string) => {
    Alert.alert(
      "Confirm Reservation",
      "Are you sure you want to confirm this reservation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            const result = await confirmReservation(
              reservationId,
              user.matricNumber
            );
            if (result.success) {
              Alert.alert("Success", result.message, [
                { text: "OK", onPress: () => router.push("/my-booking") },
              ]);
            } else {
              Alert.alert("Error", result.message);
            }
          },
        },
      ]
    );
  };

  const getTimeRemaining = (expiryDate: Date) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const getTimeRemainingColor = (expiryDate: Date) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    const hoursRemaining = diff / (1000 * 60 * 60);

    if (hoursRemaining <= 0) return "text-red-600";
    if (hoursRemaining <= 24) return "text-orange-600";
    return "text-green-600";
  };

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
        <View className="bg-orange-50 px-3 py-2 rounded-full">
          <Text className="text-orange-600 font-semibold text-xs">
            Reserved
          </Text>
        </View>
      </View>

      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-600">Reserved by</Text>
          <Text className="text-black font-semibold">
            {reservation.reserverName}
          </Text>
        </View>
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-600">Reservation Date</Text>
          <Text className="text-black font-semibold">
            {new Date(reservation.reservationDate).toLocaleDateString()}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600">Expires on</Text>
          <Text className="text-black font-semibold">
            {new Date(reservation.expiryDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View className="bg-blue-50 rounded-xl p-3 mb-4 flex-row items-center">
        <Ionicons name="time" size={20} color="#3B82F6" />
        <Text
          className={`ml-2 font-bold ${getTimeRemainingColor(
            reservation.expiryDate
          )}`}
        >
          {getTimeRemaining(reservation.expiryDate)}
        </Text>
      </View>

      <TouchableOpacity
        className="bg-black rounded-xl py-4 flex-row items-center justify-center"
        onPress={() => handleConfirmReservation(reservation.id)}
      >
        <Ionicons name="checkmark-circle" size={20} color="white" />
        <Text className="text-white font-bold ml-2">Confirm Reservation</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 py-6 rounded-b-3xl">
          <TouchableOpacity className="mb-6" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-2xl font-bold">
              My Reservations
            </Text>
            <Text className="text-gray-400 text-sm mt-2">
              {myReservations.length} reservation
              {myReservations.length !== 1 ? "s" : ""} pending
            </Text>
          </View>
        </View>

        <View className="px-6 mt-6 mb-6">
          {myReservations.length > 0 ? (
            myReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <View className="bg-white rounded-2xl p-8 items-center" style={{ elevation: 2 }}>
              <View className="bg-gray-100 w-20 h-20 rounded-full items-center justify-center mb-4">
                <Ionicons name="calendar-outline" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-black text-xl font-bold mb-2">
                No Reservations
              </Text>
              <Text className="text-gray-500 text-center mb-6">
                You don&apos;t have any pending reservations from roommates.
              </Text>
              <TouchableOpacity
                className="bg-black px-6 py-3 rounded-full"
                onPress={() => router.push("/rooms")}
              >
                <Text className="text-white font-semibold">Browse Rooms</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
