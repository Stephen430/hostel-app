import { PaymentGate } from "@/components/PaymentGate";
import { useReservation } from "@/contexts/ReservationContext";
import { Room } from "@/types/reservation";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoomsScreen() {
  const { rooms } = useReservation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const blocks = Array.from(new Set(rooms.map((room) => room.blockName)));

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.roomNumber.includes(searchQuery) ||
      room.blockName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlock = !selectedBlock || room.blockName === selectedBlock;
    return matchesSearch && matchesBlock;
  });

  const getAvailableBeds = (room: Room) => {
    return room.bedSpaces.filter((bed) => bed.status === "available").length;
  };

  const getOccupiedBeds = (room: Room) => {
    return room.bedSpaces.filter((bed) => bed.status === "occupied").length;
  };

  const getReservedBeds = (room: Room) => {
    return room.bedSpaces.filter((bed) => bed.status === "reserved").length;
  };

  return (
    <PaymentGate>
      <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="bg-black px-6 py-6 rounded-b-3xl">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-white text-2xl font-bold">
                  Available Rooms
                </Text>
              <Text className="text-gray-400 text-sm mt-1">
                {filteredRooms.length} rooms found
              </Text>
            </View>
            <View className="bg-white/20 px-4 py-2 rounded-full">
              <Text className="text-white font-semibold">
                {rooms.reduce((acc, room) => acc + getAvailableBeds(room), 0)}{" "}
                beds
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View className="bg-white/10 backdrop-blur rounded-2xl p-4 flex-row items-center">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-white text-base"
              placeholder="Search by room or block..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Block Filter */}
        <View className="px-6 mt-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-2"
          >
            <TouchableOpacity
              className={`px-6 py-3 rounded-full mr-2 ${
                selectedBlock === null ? "bg-black" : "bg-white"
              }`}
              style={selectedBlock === null ? {} : { elevation: 1 }}
              onPress={() => setSelectedBlock(null)}
            >
              <Text
                className={`font-semibold ${
                  selectedBlock === null ? "text-white" : "text-black"
                }`}
              >
                All Blocks
              </Text>
            </TouchableOpacity>
            {blocks.map((block) => (
              <TouchableOpacity
                key={block}
                className={`px-6 py-3 rounded-full mr-2 ${
                  selectedBlock === block ? "bg-black" : "bg-white"
                }`}
                style={selectedBlock === block ? {} : { elevation: 1 }}
                onPress={() => setSelectedBlock(block)}
              >
                <Text
                  className={`font-semibold ${
                    selectedBlock === block ? "text-white" : "text-black"
                  }`}
                >
                  {block}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Room Cards */}
        <View className="px-6 mt-6 mb-6">
          {filteredRooms.map((room) => {
            const availableBeds = getAvailableBeds(room);
            const occupiedBeds = getOccupiedBeds(room);
            const reservedBeds = getReservedBeds(room);

            return (
              <TouchableOpacity
                key={room.id}
                className="bg-white rounded-2xl p-5 mb-4 shadow-sm"
                style={{ elevation: 2 }}
                onPress={() =>
                  router.push({
                    pathname: "/room-details",
                    params: { roomId: room.id },
                  } as any)
                }
              >
                {/* Room Header */}
                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text className="text-black text-xl font-bold">
                      {room.blockName}
                    </Text>
                    <Text className="text-gray-600 text-base mt-1">
                      Room {room.roomNumber}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <Ionicons name="location" size={14} color="#6B7280" />
                      <Text className="text-gray-500 text-sm ml-1">
                        Floor {room.floor}
                      </Text>
                    </View>
                  </View>
                  <View className="bg-green-50 px-4 py-2 rounded-full">
                    <Text className="text-green-600 font-bold text-base">
                      ₦{room.pricePerBed.toLocaleString()}
                    </Text>
                    <Text className="text-gray-600 text-xs text-center">
                      per bed
                    </Text>
                  </View>
                </View>

                {/* Bed Status */}
                <View className="bg-gray-50 rounded-xl p-4 mb-4">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1 items-center">
                      <View className="bg-green-100 w-10 h-10 rounded-full items-center justify-center mb-2">
                        <Text className="text-green-600 font-bold">
                          {availableBeds}
                        </Text>
                      </View>
                      <Text className="text-gray-600 text-xs">Available</Text>
                    </View>
                    <View className="flex-1 items-center">
                      <View className="bg-orange-100 w-10 h-10 rounded-full items-center justify-center mb-2">
                        <Text className="text-orange-600 font-bold">
                          {reservedBeds}
                        </Text>
                      </View>
                      <Text className="text-gray-600 text-xs">Reserved</Text>
                    </View>
                    <View className="flex-1 items-center">
                      <View className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center mb-2">
                        <Text className="text-gray-600 font-bold">
                          {occupiedBeds}
                        </Text>
                      </View>
                      <Text className="text-gray-600 text-xs">Occupied</Text>
                    </View>
                  </View>
                </View>

                {/* Amenities */}
                <View className="mb-4">
                  <Text className="text-gray-700 font-semibold mb-2">
                    Amenities
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <View
                        key={index}
                        className="bg-blue-50 px-3 py-1 rounded-full"
                      >
                        <Text className="text-blue-600 text-xs">
                          {amenity}
                        </Text>
                      </View>
                    ))}
                    {room.amenities.length > 3 && (
                      <View className="bg-gray-100 px-3 py-1 rounded-full">
                        <Text className="text-gray-600 text-xs">
                          +{room.amenities.length - 3} more
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* View Details Button */}
                <TouchableOpacity
                  className={`rounded-xl py-3 flex-row items-center justify-center ${
                    availableBeds > 0 ? "bg-black" : "bg-gray-300"
                  }`}
                  onPress={() =>
                    router.push({
                      pathname: "/room-details",
                      params: { roomId: room.id },
                    } as any)
                  }
                  disabled={availableBeds === 0}
                >
                  <Text
                    className={`font-semibold text-base mr-2 ${
                      availableBeds > 0 ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {availableBeds > 0 ? "View Details" : "Fully Booked"}
                  </Text>
                  {availableBeds > 0 && (
                    <Ionicons name="arrow-forward" size={18} color="white" />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}

          {filteredRooms.length === 0 && (
            <View className="items-center justify-center py-12">
              <Ionicons name="bed-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 text-lg mt-4">
                No rooms found
              </Text>
              <Text className="text-gray-400 text-sm mt-2">
                Try adjusting your search
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
    </PaymentGate>
  );
}
