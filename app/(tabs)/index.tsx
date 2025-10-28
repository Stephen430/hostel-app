import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useAuth();
  const { getReservationsForMe } = useReservation();

  const pendingReservations = user
    ? getReservationsForMe(user.matricNumber)
    : [];

  const quickActions = [
    {
      id: 1,
      title: "Book Room",
      icon: "bed" as const,
      color: "bg-blue-500",
      route: "/rooms",
    },
    {
      id: 2,
      title: "My Bookings",
      icon: "calendar" as const,
      color: "bg-green-500",
      route: "/my-booking",
    },
    {
      id: 3,
      title: "Payments",
      icon: "card" as const,
      color: "bg-purple-500",
      route: "/payment",
    },
    {
      id: 4,
      title: "Profile",
      icon: "person" as const,
      color: "bg-orange-500",
      route: "/profile",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Room Booking Confirmed",
      description: "Block A, Room 101",
      time: "2 hours ago",
      icon: "checkmark-circle" as const,
      iconColor: "#10B981",
    },
    {
      id: 2,
      title: "Payment Successful",
      description: "₦50,000 - Hostel Fee",
      time: "1 day ago",
      icon: "card" as const,
      iconColor: "#3B82F6",
    },
    {
      id: 3,
      title: "Document Uploaded",
      description: "Acceptance Letter",
      time: "3 days ago",
      icon: "document" as const,
      iconColor: "#8B5CF6",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 py-6 rounded-b-3xl">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white text-base mb-1">Welcome back,</Text>
              <Text className="text-white text-2xl font-bold">
                {user?.name || "Student"}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                {user?.matricNumber}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-white/20 p-3 rounded-full relative"
              onPress={() => router.push("/confirm-reservation")}
            >
              <Ionicons name="notifications-outline" size={24} color="white" />
              {pendingReservations.length > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {pendingReservations.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Status Card */}
          <View className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-green-500 p-2 rounded-full mr-3">
                  <Ionicons name="checkmark" size={20} color="white" />
                </View>
                <View>
                  <Text className="text-white font-semibold text-base">
                    Room Allocated
                  </Text>
                  <Text className="text-gray-300 text-sm">
                    Block A, Room 101
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </View>
        </View>

        {/* Pending Reservation Alert */}
        {pendingReservations.length > 0 && (
          <View className="px-6 mt-4">
            <TouchableOpacity
              className="bg-orange-500 rounded-2xl p-4 flex-row items-center"
              onPress={() => router.push("/confirm-reservation")}
            >
              <View className="bg-white/20 p-3 rounded-full mr-3">
                <Ionicons name="alert-circle" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-base">
                  {pendingReservations.length} Pending Reservation
                  {pendingReservations.length > 1 ? "s" : ""}
                </Text>
                <Text className="text-white/90 text-sm mt-1">
                  Tap to confirm your room reservation
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View className="px-6 mt-6">
          <Text className="text-black text-xl font-bold mb-4">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="bg-white rounded-2xl p-4 shadow-sm flex-1 min-w-[45%]"
                style={{ elevation: 2 }}
                onPress={() => router.push(action.route as any)}
              >
                <View className={`${action.color} w-12 h-12 rounded-full items-center justify-center mb-3`}>
                  <Ionicons name={action.icon} size={24} color="white" />
                </View>
                <Text className="text-black font-semibold text-base">
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Statistics */}
        <View className="px-6 mt-6">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-blue-50 rounded-2xl p-4">
              <Ionicons name="calendar-outline" size={24} color="#3B82F6" />
              <Text className="text-2xl font-bold text-blue-600 mt-2">1</Text>
              <Text className="text-gray-600 text-sm">Active Booking</Text>
            </View>
            <View className="flex-1 bg-green-50 rounded-2xl p-4">
              <Ionicons name="card-outline" size={24} color="#10B981" />
              <Text className="text-2xl font-bold text-green-600 mt-2">2</Text>
              <Text className="text-gray-600 text-sm">Payments Made</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-6 mt-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-black text-xl font-bold">
              Recent Activity
            </Text>
            <TouchableOpacity>
              <Text className="text-black font-semibold text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-white rounded-2xl shadow-sm" style={{ elevation: 2 }}>
            {recentActivities.map((activity, index) => (
              <View key={activity.id}>
                <TouchableOpacity className="p-4 flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: `${activity.iconColor}20` }}
                  >
                    <Ionicons
                      name={activity.icon}
                      size={24}
                      color={activity.iconColor}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-black font-semibold text-base mb-1">
                      {activity.title}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {activity.description}
                    </Text>
                  </View>
                  <Text className="text-gray-400 text-xs">
                    {activity.time}
                  </Text>
                </TouchableOpacity>
                {index < recentActivities.length - 1 && (
                  <View className="h-px bg-gray-100 mx-4" />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
