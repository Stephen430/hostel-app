import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PaymentGateProps {
  children: React.ReactNode;
}

export const PaymentGate: React.FC<PaymentGateProps> = ({ children }) => {
  const { user } = useAuth();
  const { hasValidPayment } = useReservation();

  if (!user) {
    return null;
  }

  const hasPaid = hasValidPayment(user.matricNumber);

  if (!hasPaid) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-8 w-full max-w-md shadow-sm">
          <View className="bg-orange-100 w-20 h-20 rounded-full items-center justify-center self-center mb-6">
            <Text className="text-4xl">💳</Text>
          </View>

          <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
            Payment Required
          </Text>

          <Text className="text-base text-gray-600 text-center mb-8 leading-6">
            Please complete your hostel payment to continue and access room
            booking features.
          </Text>

          <TouchableOpacity
            className="bg-blue-600 rounded-xl py-4 px-6 active:bg-blue-700"
            onPress={() => router.push("/(tabs)/payment")}
          >
            <Text className="text-white text-center font-semibold text-base">
              Make Payment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4 py-3 px-6"
            onPress={() => router.push("/")}
          >
            <Text className="text-gray-500 text-center text-sm">
              Go to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <>{children}</>;
};
