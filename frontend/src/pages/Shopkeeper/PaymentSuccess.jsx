import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F7FAF8] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">

                <FiCheckCircle
                    size={64}
                    className="mx-auto text-[#176B3A]"
                />

                <h1 className="mt-5 text-2xl font-bold text-gray-800">
                    Payment Successful
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Your payment has been completed successfully.
                </p>

                <button
                    onClick={() =>
                        navigate("/shopkeeper/orders")
                    }
                    className="w-full mt-6 py-3 rounded-xl bg-[#176B3A] text-white font-semibold hover:bg-[#12582f] transition"
                >
                    Go to My Orders
                </button>

            </div>
        </div>
    );
};

export default PaymentSuccess;