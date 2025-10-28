import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { bookings, reservations, paymentRecords, hasValidPayment } =
    useReservation();

  const userBookings = bookings.filter((b) => b.studentId === user?.matricNumber);
  const userReservations = reservations.filter(
    (r) => r.reserverId === user?.matricNumber
  );
  const userPayments = paymentRecords.filter(
    (p) => p.student_matric_no === user?.matricNumber
  );
  const isPaid = user ? hasValidPayment(user.matricNumber) : false;

  const totalAmountPaid = userPayments
    .filter((p) => p.payment_status === "confirmed")
    .reduce((sum, p) => sum + p.amount, 0);

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let completed = 1; // Matric number always present
    if (user.name) completed++;
    if (user.email) completed++;
    if (user.phoneNumber) completed++;
    return Math.round((completed / 4) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const MenuItem = ({
    icon,
    label,
    onPress,
    showChevron = true,
    iconColor = "#000",
    textColor = "text-black",
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
    showChevron?: boolean;
    iconColor?: string;
    textColor?: string;
  }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between bg-white rounded-xl px-4 py-4 mb-3 border border-gray-100"
      onPress={onPress}
      style={{ elevation: 1 }}
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center">
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text className={`ml-3 text-base font-semibold ${textColor}`}>
          {label}
        </Text>
      </View>
      {showChevron && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with gradient background */}
        <View className="bg-black px-6 py-8 rounded-b-3xl">
          <Text className="text-white text-2xl font-bold mb-6">My Profile</Text>

          {/* Profile Avatar and Info */}
          <View className="items-center">
            <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4 border-4 border-white/30">
              <Text className="text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || "S"}
              </Text>
            </View>
            <Text className="text-white text-xl font-bold mb-1">
              {user?.name || "Student"}
            </Text>
            <Text className="text-gray-300 text-base mb-4">
              {user?.matricNumber || "Not Available"}
            </Text>

            {/* Payment Status Badge */}
            <View
              className={`px-4 py-2 rounded-full ${
                isPaid ? "bg-green-500" : "bg-orange-500"
              }`}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name={isPaid ? "checkmark-circle" : "alert-circle"}
                  size={16}
                  color="white"
                />
                <Text className="text-white text-sm font-semibold ml-1">
                  {isPaid ? "Payment Confirmed" : "Payment Pending"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-6 mt-6">
          <View className="bg-white rounded-2xl p-5" style={{ elevation: 2 }}>
            <Text className="text-black text-lg font-bold mb-4">
              My Statistics
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-2">
                  <Ionicons name="bed" size={24} color="#3B82F6" />
                </View>
                <Text className="text-2xl font-bold text-black">
                  {userBookings.length}
                </Text>
                <Text className="text-gray-500 text-xs">Booking{userBookings.length !== 1 ? 's' : ''}</Text>
              </View>
              <View className="items-center">
                <View className="w-12 h-12 bg-orange-50 rounded-full items-center justify-center mb-2">
                  <Ionicons name="people" size={24} color="#F59E0B" />
                </View>
                <Text className="text-2xl font-bold text-black">
                  {userReservations.length}
                </Text>
                <Text className="text-gray-500 text-xs">Reservation{userReservations.length !== 1 ? 's' : ''}</Text>
              </View>
              <View className="items-center">
                <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center mb-2">
                  <Ionicons name="cash" size={24} color="#10B981" />
                </View>
                <Text className="text-2xl font-bold text-black">
                  ₦{(totalAmountPaid / 1000).toFixed(0)}k
                </Text>
                <Text className="text-gray-500 text-xs">Paid</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Profile Completion Card */}
        {profileCompletion < 100 && (
          <View className="px-6 mt-6">
            <View className="bg-gradient-to-r bg-orange-50 rounded-2xl p-5 border border-orange-100" style={{ elevation: 1 }}>
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Ionicons name="trophy" size={24} color="#F59E0B" />
                  <Text className="text-orange-900 text-base font-bold ml-2">
                    Complete Your Profile
                  </Text>
                </View>
                <Text className="text-orange-600 text-sm font-bold">
                  {profileCompletion}%
                </Text>
              </View>
              
              {/* Progress Bar */}
              <View className="bg-orange-200 rounded-full h-2 mb-3">
                <View 
                  className="bg-orange-500 rounded-full h-2"
                  style={{ width: `${profileCompletion}%` }}
                />
              </View>
              
              <Text className="text-orange-700 text-xs mb-3">
                Add missing information to unlock all features
              </Text>
              
              <TouchableOpacity
                className="bg-orange-500 rounded-lg py-2 px-4 self-start"
                onPress={() => router.push("/edit-profile")}
              >
                <Text className="text-white text-xs font-semibold">
                  Complete Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Account Section */}
        <View className="px-6 mt-6">
          <Text className="text-gray-500 text-xs font-semibold mb-3 uppercase">
            Account
          </Text>
          <MenuItem
            icon="person-outline"
            label="Edit Profile"
            onPress={() => router.push("/edit-profile")}
          />
          <MenuItem
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => router.push("/change-password")}
          />
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() => Alert.alert("Coming Soon", "Notification settings coming soon")}
          />
        </View>

        {/* Hostel Section */}
        <View className="px-6 mt-6">
          <Text className="text-gray-500 text-xs font-semibold mb-3 uppercase">
            Hostel
          </Text>
          <MenuItem
            icon="bed-outline"
            label="My Bookings"
            onPress={() => router.push("/(tabs)/my-booking")}
          />
          <MenuItem
            icon="receipt-outline"
            label="Payment History"
            onPress={() => router.push("/(tabs)/payment")}
          />
          <MenuItem
            icon="home-outline"
            label="Browse Rooms"
            onPress={() => router.push("/(tabs)/rooms")}
          />
        </View>

        {/* Support Section */}
        <View className="px-6 mt-6">
          <Text className="text-gray-500 text-xs font-semibold mb-3 uppercase">
            Support
          </Text>
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => Alert.alert("Support", "Contact: support@hostel.com\nPhone: +234 800 000 0000")}
          />
          <MenuItem
            icon="information-circle-outline"
            label="About App"
            onPress={() => Alert.alert("Hostel Management App", "Version 1.0.0\n\nA comprehensive solution for managing hostel bookings and payments.")}
          />
          <MenuItem
            icon="star-outline"
            label="Rate App"
            onPress={() => Alert.alert("Thank You!", "Thank you for using our app!")}
          />
        </View>

        {/* Logout Button */}
        <View className="px-6 mt-6 mb-8">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 rounded-xl px-4 py-4 border border-red-100"
            style={{ elevation: 1 }}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out-outline" size={22} color="#DC2626" />
              <Text className="ml-3 text-base font-bold text-red-600">
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="items-center pb-6">
          <Text className="text-gray-400 text-xs">Version 1.0.0</Text>
          <Text className="text-gray-400 text-xs mt-1">
            © 2024 Hostel Management System
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
