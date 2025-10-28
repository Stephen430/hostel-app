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

export default function ChangePasswordScreen() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    // Validate inputs
    if (!currentPassword) {
      Alert.alert("Error", "Please enter your current password");
      return;
    }

    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert("Error", "New password must be different from current password");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Password changed successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    }, 1500);
  };

  const PasswordField = ({
    label,
    value,
    onChangeText,
    placeholder,
    showPassword,
    onToggleShow,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    showPassword: boolean;
    onToggleShow: () => void;
  }) => (
    <View className="mb-5">
      <Text className="text-gray-700 text-sm font-semibold mb-2">{label}</Text>
      <View
        className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200"
        style={{ elevation: 1 }}
      >
        <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
        <TextInput
          className="flex-1 ml-3 text-black text-base"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={onToggleShow}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="bg-black px-6 py-6">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">
            Change Password
          </Text>
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

        {/* Security Icon */}
        <View className="items-center py-8">
          <View className="w-24 h-24 bg-black rounded-full items-center justify-center shadow-lg">
            <Ionicons name="shield-checkmark" size={48} color="white" />
          </View>
          <Text className="text-gray-700 text-base font-semibold mt-4">
            {user?.name || "Student"}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            {user?.matricNumber}
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 pb-8">
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            showPassword={showCurrentPassword}
            onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
          />

          <PasswordField
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            showPassword={showNewPassword}
            onToggleShow={() => setShowNewPassword(!showNewPassword)}
          />

          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            showPassword={showConfirmPassword}
            onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {/* Password Requirements */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text className="text-blue-900 text-sm font-semibold ml-2">
                Password Requirements
              </Text>
            </View>
            <View className="ml-7">
              <View className="flex-row items-center mb-1">
                <Ionicons
                  name={newPassword.length >= 6 ? "checkmark-circle" : "ellipse-outline"}
                  size={16}
                  color={newPassword.length >= 6 ? "#10B981" : "#9CA3AF"}
                />
                <Text className={`ml-2 text-xs ${newPassword.length >= 6 ? "text-green-700" : "text-blue-700"}`}>
                  At least 6 characters
                </Text>
              </View>
              <View className="flex-row items-center mb-1">
                <Ionicons
                  name={newPassword === confirmPassword && newPassword ? "checkmark-circle" : "ellipse-outline"}
                  size={16}
                  color={newPassword === confirmPassword && newPassword ? "#10B981" : "#9CA3AF"}
                />
                <Text className={`ml-2 text-xs ${newPassword === confirmPassword && newPassword ? "text-green-700" : "text-blue-700"}`}>
                  Passwords match
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name={currentPassword !== newPassword && newPassword ? "checkmark-circle" : "ellipse-outline"}
                  size={16}
                  color={currentPassword !== newPassword && newPassword ? "#10B981" : "#9CA3AF"}
                />
                <Text className={`ml-2 text-xs ${currentPassword !== newPassword && newPassword ? "text-green-700" : "text-blue-700"}`}>
                  Different from current password
                </Text>
              </View>
            </View>
          </View>

          {/* Change Password Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 ${
              isLoading ? "bg-gray-400" : "bg-black"
            }`}
            onPress={handleChangePassword}
            disabled={isLoading}
            style={{ elevation: 2 }}
          >
            <View className="flex-row items-center justify-center">
              {isLoading ? (
                <Text className="text-white font-bold text-base">
                  Changing Password...
                </Text>
              ) : (
                <>
                  <Ionicons name="shield-checkmark" size={22} color="white" />
                  <Text className="text-white font-bold text-base ml-2">
                    Change Password
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity className="mt-3 py-4" onPress={() => router.back()}>
            <Text className="text-gray-500 text-center font-semibold text-base">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
