import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import { PaymentRecord } from "@/types/reservation";
import { Ionicons } from "@expo/vector-icons";
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

interface Payment {
  id: string;
  studentId: string;
  type: "hostel_fee" | "reservation_fee" | "maintenance" | "fine";
  amount: number;
  status: "completed" | "pending" | "failed";
  description: string;
  date: Date;
  reference: string;
  paymentMethod?: "card" | "bank_transfer" | "cash";
}

export default function PaymentScreen() {
  const { user } = useAuth();
  const { paymentRecords, addPaymentRecord, hasValidPayment } = useReservation();
  const [activeTab, setActiveTab] = useState<"history" | "pending">("history");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank_transfer">(
    "card"
  );
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const hasPaid = user ? hasValidPayment(user.matricNumber) : false;

  // Mock payment data
  const mockPayments: Payment[] = [
    {
      id: "pay-1",
      studentId: user?.matricNumber || "",
      type: "hostel_fee",
      amount: 50000,
      status: "completed",
      description: "Hostel Fee - Block A, Room 101",
      date: new Date("2024-10-15"),
      reference: "HST-2024-001",
      paymentMethod: "card",
    },
    {
      id: "pay-2",
      studentId: user?.matricNumber || "",
      type: "maintenance",
      amount: 5000,
      status: "completed",
      description: "Maintenance Fee - Semester 1",
      date: new Date("2024-10-01"),
      reference: "MNT-2024-001",
      paymentMethod: "bank_transfer",
    },
  ];

  const mockPendingPayments: Payment[] = [
    {
      id: "pay-3",
      studentId: user?.matricNumber || "",
      type: "fine",
      amount: 2000,
      status: "pending",
      description: "Late Payment Fine",
      date: new Date("2024-10-20"),
      reference: "FINE-2024-001",
    },
  ];

  const [payments] = useState<Payment[]>(mockPayments);
  const [pendingPayments, setPendingPayments] =
    useState<Payment[]>(mockPendingPayments);

  const getTotalPaid = () => {
    return payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getTotalPending = () => {
    return pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  };

  const getPaymentIcon = (type: Payment["type"]) => {
    switch (type) {
      case "hostel_fee":
        return "bed";
      case "reservation_fee":
        return "calendar";
      case "maintenance":
        return "construct";
      case "fine":
        return "warning";
      default:
        return "card";
    }
  };

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-600";
      case "pending":
        return "bg-orange-50 text-orange-600";
      case "failed":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const handlePayNow = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    if (!user) return;

    if (paymentMethod === "card") {
      if (!cardNumber || !expiryDate || !cvv) {
        Alert.alert("Error", "Please fill in all card details");
        return;
      }
      if (cardNumber.length < 16) {
        Alert.alert("Error", "Invalid card number");
        return;
      }
    }

    // Simulate payment processing
    setTimeout(() => {
      // Create payment record
      const newPaymentRecord: PaymentRecord = {
        payment_id: `PAY-${Date.now()}`,
        student_matric_no: user.matricNumber,
        amount: selectedPayment?.amount || 50000,
        payment_method: paymentMethod === "card" ? "card" : "bank_transfer",
        payment_status: "confirmed",
        transaction_reference: `TRX-${Date.now()}`,
        payment_date: new Date(),
        description:
          selectedPayment?.description || "Initial hostel payment",
      };

      addPaymentRecord(newPaymentRecord);

      Alert.alert("Success", "Payment processed successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Remove from pending if applicable
            if (selectedPayment) {
              setPendingPayments(
                pendingPayments.filter((p) => p.id !== selectedPayment.id)
              );
            }
            setShowPaymentModal(false);
            setCardNumber("");
            setExpiryDate("");
            setCvv("");
            setSelectedPayment(null);
          },
        },
      ]);
    }, 1500);
  };

  const PaymentCard = ({ payment }: { payment: Payment }) => (
    <View
      className="bg-white rounded-2xl p-5 mb-4 shadow-sm"
      style={{ elevation: 2 }}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-start flex-1">
          <View className="bg-blue-50 w-12 h-12 rounded-full items-center justify-center mr-3">
            <Ionicons
              name={getPaymentIcon(payment.type) as any}
              size={24}
              color="#3B82F6"
            />
          </View>
          <View className="flex-1">
            <Text className="text-black text-base font-bold mb-1">
              {payment.description}
            </Text>
            <Text className="text-gray-500 text-sm">
              {payment.date.toLocaleDateString()}
            </Text>
            {payment.paymentMethod && (
              <Text className="text-gray-400 text-xs mt-1">
                {payment.paymentMethod === "card"
                  ? "Card Payment"
                  : "Bank Transfer"}
              </Text>
            )}
          </View>
        </View>
        <View className="items-end">
          <Text className="text-black font-bold text-lg">
            ₦{payment.amount.toLocaleString()}
          </Text>
          <View
            className={`px-3 py-1 rounded-full mt-2 ${getStatusColor(
              payment.status
            )}`}
          >
            <Text className="text-xs font-semibold">
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-gray-50 rounded-xl p-3 flex-row justify-between items-center">
        <Text className="text-gray-600 text-sm">Reference</Text>
        <Text className="text-black font-semibold text-sm">
          {payment.reference}
        </Text>
      </View>

      {payment.status === "pending" && (
        <TouchableOpacity
          className="bg-black rounded-xl py-3 mt-4 flex-row items-center justify-center"
          onPress={() => handlePayNow(payment)}
        >
          <Ionicons name="card" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-black px-6 py-6 rounded-b-3xl">
          <Text className="text-white text-2xl font-bold mb-2">Payments</Text>
          <Text className="text-gray-400 text-sm">{user?.matricNumber}</Text>

          {/* Initial Payment Alert for unpaid students */}
          {!hasPaid && (
            <View className="bg-orange-500 rounded-2xl p-4 mt-4">
              <View className="flex-row items-center mb-3">
                <Ionicons name="warning" size={24} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Payment Required
                </Text>
              </View>
              <Text className="text-white text-sm mb-4">
                You need to complete your initial hostel payment to access room
                booking features.
              </Text>
              <TouchableOpacity
                className="bg-white rounded-xl py-3 flex-row items-center justify-center"
                onPress={() => {
                  setSelectedPayment({
                    id: "initial-payment",
                    studentId: user?.matricNumber || "",
                    type: "hostel_fee",
                    amount: 50000,
                    status: "pending",
                    description: "Initial hostel payment",
                    date: new Date(),
                    reference: `HST-${Date.now()}`,
                  });
                  setShowPaymentModal(true);
                }}
              >
                <Ionicons name="card" size={20} color="#000" />
                <Text className="text-black font-bold ml-2">
                  Make Initial Payment
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Summary Cards */}
          <View className="flex-row gap-3 mt-6">
            <View className="flex-1 bg-white/10 backdrop-blur rounded-2xl p-4">
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text className="text-white text-2xl font-bold mt-2">
                ₦{getTotalPaid().toLocaleString()}
              </Text>
              <Text className="text-gray-300 text-xs mt-1">Total Paid</Text>
            </View>
            <View className="flex-1 bg-white/10 backdrop-blur rounded-2xl p-4">
              <Ionicons name="time" size={24} color="#F59E0B" />
              <Text className="text-white text-2xl font-bold mt-2">
                ₦{getTotalPending().toLocaleString()}
              </Text>
              <Text className="text-gray-300 text-xs mt-1">Pending</Text>
            </View>
          </View>

          {/* Tab Selector */}
          <View className="bg-white/10 backdrop-blur rounded-2xl p-1 flex-row mt-6">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl ${
                activeTab === "history" ? "bg-white" : ""
              }`}
              onPress={() => setActiveTab("history")}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "history" ? "text-black" : "text-white"
                }`}
              >
                History ({payments.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl ${
                activeTab === "pending" ? "bg-white" : ""
              }`}
              onPress={() => setActiveTab("pending")}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "pending" ? "text-black" : "text-white"
                }`}
              >
                Pending ({pendingPayments.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment List */}
        <View className="px-6 mt-6 mb-6">
          {activeTab === "history" ? (
            <>
              {/* Display payment records from ReservationContext */}
              {paymentRecords
                .filter((pr) => pr.student_matric_no === user?.matricNumber)
                .map((record) => (
                  <View
                    key={record.payment_id}
                    className="bg-white rounded-2xl p-5 mb-4 shadow-sm"
                    style={{ elevation: 2 }}
                  >
                    <View className="flex-row justify-between items-start mb-4">
                      <View className="flex-row items-start flex-1">
                        <View className="bg-green-50 w-12 h-12 rounded-full items-center justify-center mr-3">
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#10B981"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-black text-base font-bold mb-1">
                            {record.description}
                          </Text>
                          <Text className="text-gray-500 text-sm">
                            {new Date(record.payment_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-black font-bold text-lg">
                          ₦{record.amount.toLocaleString()}
                        </Text>
                        <View className="bg-green-50 px-3 py-1 rounded-full mt-1">
                          <Text className="text-green-600 text-xs font-semibold">
                            {record.payment_status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="bg-gray-50 rounded-xl p-3 flex-row justify-between items-center">
                      <Text className="text-gray-600 text-sm">Reference</Text>
                      <Text className="text-black font-semibold text-sm">
                        {record.transaction_reference}
                      </Text>
                    </View>
                  </View>
                ))}

              {/* Display mock payments */}
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))
              ) : paymentRecords.filter(
                  (pr) => pr.student_matric_no === user?.matricNumber
                ).length === 0 ? (
                <View
                  className="bg-white rounded-2xl p-8 items-center"
                  style={{ elevation: 2 }}
                >
                  <View className="bg-gray-100 w-20 h-20 rounded-full items-center justify-center mb-4">
                    <Ionicons
                      name="receipt-outline"
                      size={40}
                      color="#9CA3AF"
                    />
                  </View>
                  <Text className="text-black text-xl font-bold mb-2">
                    No Payment History
                  </Text>
                  <Text className="text-gray-500 text-center">
                    Your payment transactions will appear here
                  </Text>
                </View>
              ) : null}
            </>
          ) : pendingPayments.length > 0 ? (
            <>
              <View className="bg-orange-50 rounded-2xl p-4 mb-4 flex-row items-center">
                <Ionicons name="alert-circle" size={24} color="#F59E0B" />
                <Text className="text-orange-600 text-sm ml-3 flex-1">
                  You have {pendingPayments.length} pending payment
                  {pendingPayments.length > 1 ? "s" : ""}
                </Text>
              </View>
              {pendingPayments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </>
          ) : (
            <View
              className="bg-white rounded-2xl p-8 items-center"
              style={{ elevation: 2 }}
            >
              <View className="bg-green-100 w-20 h-20 rounded-full items-center justify-center mb-4">
                <Ionicons
                  name="checkmark-circle"
                  size={40}
                  color="#10B981"
                />
              </View>
              <Text className="text-black text-xl font-bold mb-2">
                All Caught Up!
              </Text>
              <Text className="text-gray-500 text-center">
                You have no pending payments
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
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
                    Make Payment
                  </Text>
                  <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                    <Ionicons name="close" size={28} color="black" />
                  </TouchableOpacity>
                </View>

            {/* Payment Details */}
            <View className="bg-gray-50 rounded-2xl p-4 mb-6">
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Description</Text>
                <Text className="text-black font-semibold flex-1 text-right ml-4">
                  {selectedPayment?.description}
                </Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Reference</Text>
                <Text className="text-black font-semibold">
                  {selectedPayment?.reference}
                </Text>
              </View>
              <View className="h-px bg-gray-200 my-2" />
              <View className="flex-row justify-between">
                <Text className="text-gray-700 font-bold">Amount</Text>
                <Text className="text-black font-bold text-xl">
                  ₦{selectedPayment?.amount.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Payment Method Selector */}
            <Text className="text-gray-700 font-semibold mb-3">
              Payment Method
            </Text>
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity
                className={`flex-1 rounded-xl py-4 border-2 ${
                  paymentMethod === "card"
                    ? "border-black bg-black"
                    : "border-gray-200 bg-white"
                }`}
                onPress={() => setPaymentMethod("card")}
              >
                <View className="items-center">
                  <Ionicons
                    name="card"
                    size={24}
                    color={paymentMethod === "card" ? "white" : "black"}
                  />
                  <Text
                    className={`font-bold mt-2 ${
                      paymentMethod === "card" ? "text-white" : "text-black"
                    }`}
                  >
                    Card
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 rounded-xl py-4 border-2 ${
                  paymentMethod === "bank_transfer"
                    ? "border-black bg-black"
                    : "border-gray-200 bg-white"
                }`}
                onPress={() => setPaymentMethod("bank_transfer")}
              >
                <View className="items-center">
                  <Ionicons
                    name="business"
                    size={24}
                    color={
                      paymentMethod === "bank_transfer" ? "white" : "black"
                    }
                  />
                  <Text
                    className={`font-bold mt-2 ${
                      paymentMethod === "bank_transfer"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    Bank Transfer
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Card Payment Form */}
            {paymentMethod === "card" && (
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-2">
                  Card Number
                </Text>
                <TextInput
                  className="bg-gray-50 rounded-xl px-4 py-4 text-black text-base border border-gray-200 mb-4"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChangeText={(text) =>
                    setCardNumber(text.replace(/\s/g, "").slice(0, 16))
                  }
                  keyboardType="numeric"
                  maxLength={16}
                />

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-gray-700 font-semibold mb-2">
                      Expiry Date
                    </Text>
                    <TextInput
                      className="bg-gray-50 rounded-xl px-4 py-4 text-black text-base border border-gray-200"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChangeText={setExpiryDate}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-700 font-semibold mb-2">
                      CVV
                    </Text>
                    <TextInput
                      className="bg-gray-50 rounded-xl px-4 py-4 text-black text-base border border-gray-200"
                      placeholder="123"
                      value={cvv}
                      onChangeText={setCvv}
                      keyboardType="numeric"
                      maxLength={3}
                      secureTextEntry
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Bank Transfer Info */}
            {paymentMethod === "bank_transfer" && (
              <View className="bg-blue-50 rounded-2xl p-4 mb-6">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="information-circle" size={20} color="#3B82F6" />
                  <Text className="text-blue-600 font-semibold ml-2">
                    Bank Transfer Details
                  </Text>
                </View>
                <View className="mb-2">
                  <Text className="text-gray-600 text-sm">Bank Name</Text>
                  <Text className="text-black font-semibold">
                    First Bank of Nigeria
                  </Text>
                </View>
                <View className="mb-2">
                  <Text className="text-gray-600 text-sm">Account Number</Text>
                  <Text className="text-black font-semibold">1234567890</Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm">Account Name</Text>
                  <Text className="text-black font-semibold">
                    University Hostel Services
                  </Text>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-4"
                onPress={() => setShowPaymentModal(false)}
              >
                <Text className="text-black font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-black rounded-xl py-4"
                onPress={processPayment}
              >
                <Text className="text-white font-semibold text-center">
                  {paymentMethod === "card" ? "Pay Now" : "I've Transferred"}
                </Text>
              </TouchableOpacity>
            </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
