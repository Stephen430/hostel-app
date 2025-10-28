import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Move InputField component OUTSIDE to prevent re-creation on every render
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = "default",
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: "default" | "email-address" | "phone-pad";
  editable?: boolean;
}) => (
  <View className="mb-4">
    <Text className="text-gray-700 text-xs font-semibold mb-2 ml-1 uppercase tracking-wide">{label}</Text>
    <View
      className={`flex-row items-center rounded-xl px-4 py-3.5 ${
        editable 
          ? "bg-white border border-gray-200" 
          : "bg-gray-100 border border-gray-200"
      }`}
    >
      <Ionicons
        name={icon}
        size={20}
        color={editable ? "#000" : "#9CA3AF"}
      />
      <TextInput
        className="flex-1 ml-3 text-gray-900 text-base"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        editable={editable}
        autoCapitalize="none"
      />
      {!editable && (
        <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
      )}
    </View>
  </View>
);

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    // Validate inputs
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

    if (email && !email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (phoneNumber && phoneNumber.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    try {
      const success = await updateProfile({
        name: fullName,
        email: email,
        phoneNumber: phoneNumber,
      });

      if (success) {
        Alert.alert("Success", "Profile updated successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch {
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Sleek Header */}
      <View className="bg-black px-6 pt-4 pb-6">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="mr-4 w-10 h-10 bg-white/10 rounded-xl items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">Edit Profile</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

        {/* Clean Profile Photo Section */}
        <View className="items-center py-10 bg-gray-50">
          <View className="relative">
            <View className="w-28 h-28 bg-black rounded-full items-center justify-center">
              <Text className="text-white text-3xl font-bold">
                {fullName.charAt(0).toUpperCase() || "S"}
              </Text>
            </View>
            <TouchableOpacity
              className="absolute -bottom-2 -right-2 w-11 h-11 bg-blue-500 rounded-full items-center justify-center border-4 border-white"
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert("Coming Soon", "Photo upload feature coming soon!")
              }
            >
              <Ionicons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-900 text-lg font-semibold mt-4">{fullName || "Your Name"}</Text>
          <Text className="text-gray-500 text-sm mt-1">{user?.matricNumber}</Text>
        </View>

        {/* Form */}
        <View className="px-6 py-6 bg-white">
          <InputField
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            icon="person-outline"
          />

          <InputField
            label="Matric Number"
            value={user?.matricNumber || ""}
            onChangeText={() => {}}
            placeholder="Matric number"
            icon="card-outline"
            editable={false}
          />

          <InputField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="your.email@example.com"
            icon="mail-outline"
            keyboardType="email-address"
          />

          <InputField
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+234 800 000 0000"
            icon="call-outline"
            keyboardType="phone-pad"
          />

          {/* Info Card */}
          <View className="bg-blue-50 rounded-lg p-4 mb-6 flex-row items-start">
            <Ionicons name="information-circle-outline" size={20} color="#3B82F6" className="mt-0.5" />
            <Text className="text-blue-800 text-xs flex-1 ml-3 leading-5">
              Your matric number cannot be changed. Contact administration if you need to update it.
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 mb-3 ${
              isLoading ? "bg-gray-400" : "bg-black"
            }`}
            onPress={handleSave}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              {isLoading ? (
                <Text className="text-white font-semibold text-base">
                  Saving...
                </Text>
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={22} color="white" />
                  <Text className="text-white font-semibold text-base ml-2">
                    Save Changes
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            className="py-4"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text className="text-gray-600 text-center font-medium text-base">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
