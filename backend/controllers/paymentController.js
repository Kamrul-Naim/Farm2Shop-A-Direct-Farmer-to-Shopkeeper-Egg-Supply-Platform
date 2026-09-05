import orderModel from "../models/orderModel.js";
import shopkeeperModel from "../models/shopkeeper.js";
// import shopkeeperModel from "../models/Shopkeeper.js";
// import initiatePayment from "../services/sslcommerzService.js";
// import axios from "axios";
// import productModel from "../models/Product.js";
import SSLCommerzPayment from "sslcommerz-lts";
import createNotification from "../utils/createNotification.js";

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = false; //true for live, false for sandbox

const onlinePayment = async (req, res) => {
  const { orderId } = req.body;
  console.log("orderId", orderId);
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  try {
    const orderData = await orderModel
      .findById(orderId)
      .populate("shopkeeper")
      .populate("farmer")
      .populate("product")
      .populate("category");
    const tran_id = orderId; // use unique tran_id for each api call
    const data = {
      total_amount: orderData.totalAmount,
      currency: "BDT",
      tran_id: tran_id, // use unique tran_id for each api call
      success_url: `${backendUrl}/api/payment/online/success/${tran_id}`,
      fail_url: `${backendUrl}/api/payment/online/fail`,
      cancel_url: `${backendUrl}/api/payment/online/cancel`,
      ipn_url: `${backendUrl}/ipn`,
      shipping_method: "Courier",
      product_name: orderData.product.productName,
      product_category: orderData.category.category,
      product_profile: "general",
      cus_name: orderData.shopkeeper.name,
      cus_email: orderData.shopkeeper.email,
      cus_add1: orderData.shopkeeper.shopAddress,
      cus_add2: orderData.shopkeeper.shopAddress,
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      cus_fax: "01711111111",
      ship_name: orderData.shopkeeper.name,
      ship_add1: orderData.shopkeeper.shopAddress,
      ship_add2: orderData.shopkeeper.shopAddress,
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      res.json({ success: true, url: GatewayPageURL });
      console.log("Redirecting to: ", GatewayPageURL);
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};

const handleSuccess = async (req, res) => {
  const { tran_id } = req.params;

  try {

    const orderData = await orderModel
    .findById(tran_id)
    .populate("shopkeeper")
    .populate("farmer")
    .populate("product")
    .populate("category");

    await orderModel.findByIdAndUpdate(tran_id, {
      paymentStatus: "paid",
      paymentMethod: "online",
    });

    // Notify the shopkeeper about the successful payment
    const shopkeeper = orderData.shopkeeper;
    const product = orderData.product;
    const quantity = orderData.quantity;

    await createNotification({
      recipient: shopkeeper._id,
      recipientRole: "shopkeeper",
      title: "Online Payment Successful",
      message: `Your order for ${quantity} pieces of ${product.productName} has been paid successfully.`,
      order: tran_id,
    });

    // Notify the farmer about the new order
    await createNotification({
      recipient: product.farmer,
      recipientRole: "farmer",
      title: "Payment Received for Your Product",
      message: `You received payment for ${quantity} pieces of ${product.productName}.`,
      order: tran_id,
    });

    res.redirect(`${process.env.FRONTEND_URL}/shopkeeper/orders/${tran_id}`);
  } catch (error) {
    console.error("Error handling payment success:", error);
    res.status(500).json({ message: "Failed to handle payment success" });
  }
};

const handleFail = async (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/shopkeeper/paymentFail`);
}

export { onlinePayment, handleSuccess, handleFail };
