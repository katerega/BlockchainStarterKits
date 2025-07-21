import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("mobileMoney");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setPaymentSuccess(false);
        setAmount("");
        setPhoneNumber("");
        setWalletAddress("");
      }, 3000);
    }, 2000);
  };

  const paymentMethods = [
    { id: "mobileMoney", name: "Mobile Money (MTN/Airtel)", icon: "📱" },
    { id: "ugxStablecoin", name: "UGX Stablecoin", icon: "🪙" },
    { id: "crypto", name: "Cryptocurrency", icon: "₿" },
    { id: "bankTransfer", name: "Bank Transfer", icon: "🏦" },
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">💸</span>
            Uganda Blockchain Payments
          </h1>
          <p className="text-gray-600 mt-2">
            Send and receive payments using local and blockchain payment methods
          </p>
        </header>

        <Card>
          <CardContent className="p-6">
            {paymentSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600">
                  Your payment has been processed successfully.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                  Make a Payment
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                            paymentMethod === method.id
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{method.icon}</span>
                            <span className="text-sm font-medium">
                              {method.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Amount (UGX)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">UGX</span>
                      </div>
                      <input
                        type="number"
                        id="amount"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-14 pr-12 py-3 border-gray-300 rounded-md"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {paymentMethod === "mobileMoney" && (
                    <div className="mb-6">
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Mobile Money Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-3 border-gray-300 rounded-md"
                        placeholder="e.g. 256712345678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {(paymentMethod === "ugxStablecoin" ||
                    paymentMethod === "crypto") && (
                    <div className="mb-6">
                      <label
                        htmlFor="walletAddress"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {paymentMethod === "ugxStablecoin"
                          ? "UGX Stablecoin Wallet Address"
                          : "Cryptocurrency Wallet Address"}
                      </label>
                      <input
                        type="text"
                        id="walletAddress"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-3 border-gray-300 rounded-md"
                        placeholder={`e.g. 0x... or ${
                          paymentMethod === "ugxStablecoin" ? "ugx..." : "bc1..."
                        }`}
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {paymentMethod === "bankTransfer" && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Details
                      </label>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-600 mb-2">
                          Send to: Uganda Commercial Bank
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Account Name: Uganda Blockchain Payments
                        </p>
                        <p className="text-sm text-gray-600">
                          Account Number: 1234567890
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isProcessing
                          ? "bg-indigo-400"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {isProcessing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Make Payment"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Exchange Rate
              </h3>
              <p className="text-lg font-semibold text-gray-800">
                1 UGXc = 1 UGX
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Stablecoin pegged to Ugandan Shilling
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Transaction Fee
              </h3>
              <p className="text-lg font-semibold text-gray-800">
                {paymentMethod === "mobileMoney" ? "1.5%" : "0.5%"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {paymentMethod === "mobileMoney"
                  ? "Mobile Money fee"
                  : "Blockchain network fee"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;