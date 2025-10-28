import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleResetPassword = async () => {
    // Validate email
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const success = await forgotPassword(email);
      if (success) {
        setIsEmailSent(true);
      } else {
        Alert.alert("Error", "Failed to send reset link. Please try again.");
      }
    } catch {
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
        <View className="flex-1 px-6 justify-center items-center">
          {/* Success Icon */}
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
          </View>

          {/* Success Message */}
          <Text className="text-2xl font-bold text-black mb-3 text-center">
            Email Sent!
          </Text>
          <Text className="text-gray-600 text-base text-center mb-8 px-4">
            We&apos;ve sent a password reset link to{"\n"}
            <Text className="font-semibold text-black">{email}</Text>
          </Text>

          <Text className="text-gray-500 text-sm text-center mb-8 px-6">
            Please check your email and click on the link to reset your password. 
            The link will expire in 24 hours.
          </Text>

          {/* Back to Login Button */}
          <TouchableOpacity
            className="bg-black rounded-xl py-4 px-8 items-center w-full mb-4"
            onPress={() => router.replace("/login")}
          >
            <Text className="text-white font-bold text-base">
              Back to Login
            </Text>
          </TouchableOpacity>

          {/* Resend Email Link */}
          <TouchableOpacity
            onPress={() => {
              setIsEmailSent(false);
              handleResetPassword();
            }}
          >
            <Text className="text-black font-semibold text-sm">
              Didn&apos;t receive the email? Resend
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-1 px-6">
        {/* Header with Back Button */}
        <View className="flex-row items-center pt-4 mb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">
            Forgot Password
          </Text>
        </View>

        <View className="flex-1 justify-center">
          {/* Icon */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="lock-closed" size={48} color="#6B7280" />
            </View>
            <Text className="text-2xl font-bold text-black mb-3 text-center">
              Reset Your Password
            </Text>
            <Text className="text-gray-500 text-base text-center px-4">
              Enter your email address and we&apos;ll send you a link to reset your password
            </Text>
          </View>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Ionicons name="mail-outline" size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-base text-black"
                placeholder="your.email@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
              />
            </View>
          </View>

          {/* Reset Password Button */}
          <TouchableOpacity
            className={`bg-black rounded-xl py-4 items-center mb-4 ${
              isLoading ? "opacity-50" : ""
            }`}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text className="text-white font-bold text-base">
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Text>
          </TouchableOpacity>

          {/* Back to Login Link */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Remember your password? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-black font-semibold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
