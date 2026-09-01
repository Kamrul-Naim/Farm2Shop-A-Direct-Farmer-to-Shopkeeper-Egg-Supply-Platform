import axios from "axios";

const SSLCOMMERZ_STORE_ID =
    process.env.SSLCOMMERZ_STORE_ID;

const SSLCOMMERZ_STORE_PASSWORD =
    process.env.SSLCOMMERZ_STORE_PASSWORD;

const SSLCOMMERZ_IS_SANDBOX =
    process.env.SSLCOMMERZ_IS_SANDBOX === "true";

const SSLCOMMERZ_BASE_URL =
    SSLCOMMERZ_IS_SANDBOX
        ? "https://sandbox.sslcommerz.com"
        : "https://securepay.sslcommerz.com";


const initiatePayment = async ({
    transactionId,
    amount,
    productName,
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    deliveryPostcode,
    successUrl,
    failUrl,
    cancelUrl,
    ipnUrl
}) => {

    try {

        const paymentData = {
            store_id: SSLCOMMERZ_STORE_ID,
            store_passwd: SSLCOMMERZ_STORE_PASSWORD,

            total_amount: amount,
            currency: "BDT",

            tran_id: transactionId,

            success_url: successUrl,
            fail_url: failUrl,
            cancel_url: cancelUrl,
            ipn_url: ipnUrl,

            product_name: productName,
            product_category: "Egg",
            product_profile: "physical-goods",

            cus_name: customerName,
            cus_email: customerEmail,
            cus_phone: customerPhone,
            cus_add1: deliveryAddress,
            cus_city: "Dhaka",
            cus_country: "Bangladesh",

            shipping_method: "YES",

            ship_name: customerName,
            ship_add1: deliveryAddress,
            ship_city: "Dhaka",
            ship_postcode: deliveryPostcode,
            ship_country: "Bangladesh",

            num_of_item: 1
        };

        const response = await axios.post(
            `${SSLCOMMERZ_BASE_URL}/gwprocess/v4/api.php`,
            new URLSearchParams(paymentData).toString(),
            {
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "SSLCOMMERZ payment initiation error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


export default initiatePayment;