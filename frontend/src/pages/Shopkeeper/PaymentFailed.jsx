
import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f5f7f4] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center shadow-sm">

                <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-3xl">✕</span>
                </div>

                <h1 className="mt-5 text-2xl font-bold text-gray-800">
                    Payment Failed
                </h1>

                <p className="mt-3 text-gray-500">
                    Unfortunately, your payment could not be completed.
                    Please try again.
                </p>

                <button
                    onClick={() => navigate("/shopkeeper/orders")}
                    className="mt-6 w-full py-3 rounded-xl bg-[#176B3A] text-white font-semibold hover:bg-[#12552E] transition"
                >
                    My Orders
                </button>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-3 w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                    Go Back
                </button>

            </div>
        </div>
    );
};

export default PaymentFailed;


