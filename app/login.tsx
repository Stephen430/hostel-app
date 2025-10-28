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
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { login } = useAuth();
  const [matricNumber, setMatricNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validate inputs
    if (!matricNumber.trim()) {
      Alert.alert("Error", "Please enter your matric number");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(matricNumber, password);
      if (success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "Invalid matric number or password");
      }
    } catch {
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 justify-center">
        {/* Logo/Title Section */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-black rounded-full items-center justify-center mb-4">
            <Ionicons name="bed" size={40} color="white" />
          </View>
          <Text className="text-3xl font-bold text-black mb-2">
            Hostel Portal
          </Text>
          <Text className="text-gray-500 text-base">
            Student Login
          </Text>
        </View>

        {/* Input Fields */}
        <View className="gap-4 mb-6">
          {/* Matric Number Input */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Matric Number
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Ionicons name="person-outline" size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-base text-black"
                placeholder="e.g., CSC/2020/001"
                placeholderTextColor="#9CA3AF"
                value={matricNumber}
                onChangeText={setMatricNumber}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Password
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-base text-black"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="ml-2"
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity 
          className="self-end mb-6"
          onPress={() => router.push("/forgot-password")}
        >
          <Text className="text-black font-semibold text-sm">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          className={`bg-black rounded-xl py-4 items-center ${
            isLoading ? "opacity-50" : ""
          }`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-base">
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text className="text-black font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
