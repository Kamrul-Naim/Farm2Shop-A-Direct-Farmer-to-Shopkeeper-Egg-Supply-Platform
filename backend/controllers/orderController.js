
import orderModel from "../models/orderModel.js";
import productModel from "../models/Product.js";
import categoryPriceModel from "../models/CategoryPrice.js";
import shopkeeperModel from "../models/shopkeeper.js";
import createNotification from "../utils/createNotification.js";

// Create order
const createOrder = async (req, res) => {
    try {
        const {
            productId,
            quantity,
            deliveryAddress,
            paymentMethod
        } = req.body;

        // Check required fields
        if (
            !productId ||
            quantity === undefined ||
            !deliveryAddress ||
            !paymentMethod
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided."
            });
        }

        // Only COD and online payment are allowed
        if (!["cod", "online"].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method."
            });
        }

        // Validate quantity
        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1."
            });
        }

        // Get logged-in shopkeeper
        const shopkeeper = await shopkeeperModel.findById(
            req.user.id
        );

        if (!shopkeeper) {
            return res.status(404).json({
                success: false,
                message: "Shopkeeper not found."
            });
        }

        // Only verified shopkeepers can place orders
        if (shopkeeper.verificationStatus !== "approved") {
            return res.status(403).json({
                success: false,
                message: "Only verified shopkeepers can place orders."
            });
        }

        // Shopkeeper must be active
        if (!shopkeeper.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive."
            });
        }

        // Find product
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        // Product must be available
        if (!product.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "This product is currently unavailable."
            });
        }

        // Product must not be expired
        if (product.expiresAt <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "This product has expired."
            });
        }

        // Check minimum order quantity
        if (quantity < product.minimumOrderQuantity) {
            return res.status(400).json({
                success: false,
                message:
                    `Minimum order quantity is ${product.minimumOrderQuantity} pieces.`
            });
        }

        // Check available stock
        if (quantity > product.quantity) {
            return res.status(400).json({
                success: false,
                message:
                    `Only ${product.quantity} pieces are available.`
            });
        }

        // Get category
        const category = await categoryPriceModel.findById(
            product.category
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Product category not found."
            });
        }

        // Category must be active
        if (!category.isActive) {
            return res.status(400).json({
                success: false,
                message: "This category is currently inactive."
            });
        }

        // Get current category price
        const unitPrice = category.price;

        // Calculate total amount on backend
        const totalAmount = quantity * unitPrice;

        // Create order
        const order = await orderModel.create({
            shopkeeper: shopkeeper._id,
            farmer: product.farmer,
            product: product._id,
            category: category._id,

            quantity,
            unitPrice,
            totalAmount,

            deliveryAddress: deliveryAddress.trim(),

            orderStatus: "placed",

            paymentMethod,
            paymentStatus: "pending"
        });

        // Reduce stock immediately only for COD
        if (paymentMethod === "cod") {
            product.quantity -= quantity;

            // If no stock remains, mark product unavailable
            if (product.quantity === 0) {
                product.isAvailable = false;
            }

            await product.save();
        }

        // Notify farmer
        await createNotification({
            recipient: product.farmer,
            recipientRole: "farmer",
            title: "New Order Received",
            message:
                `You received a new order for ${quantity} pieces of ${product.productName}.`,
            order: order._id
        });

        // Notify shopkeeper
        await createNotification({
            recipient: shopkeeper._id,
            recipientRole: "shopkeeper",
            title: "Order Placed",
            message:
                `Your order for ${quantity} pieces of ${product.productName} has been placed successfully.`,
            order: order._id
        });

        return res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            order
        });

    } catch (error) {
        console.error(
            "Create order error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while creating the order."
        });
    }
};

// Get shopkeeper orders
const getShopkeeperOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({
                shopkeeper: req.user.id
            })
            .populate(
                "product",
                "productName images"
            )
            .populate(
                "category",
                "category price"
            )
            .populate(
                "farmer",
                "name farmName"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error("Get shopkeeper orders error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch your orders."
        });
    }
};


// Get farmer orders
 const getFarmerOrders = async (req, res) => {
   try {
     const orders = await orderModel
       .find({ farmer: req.user.id })
       .populate("product", "productName images")
       .populate("category", "category price")
       .populate("shopkeeper", "name shopName shopAddress profileImage")
       .sort({ createdAt: -1 });
     return res.status(200).json({ success: true, orders });
   } catch (error) {
     console.error("Get farmer orders error:", error);
     return res
       .status(500)
       .json({ success: false, message: "Failed to fetch your orders." });
   }
 };

// Get single order
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await orderModel
            .findById(orderId)
            .populate(
                "product",
                "productName description images quantity"
            )
            .populate(
                "category",
                "category price"
            )
            .populate(
                "farmer",
                "name farmName farmAddress profileImage"
            )
            .populate(
                "shopkeeper",
                "name shopName shopAddress profileImage"
            );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        // Only the farmer or shopkeeper involved in the order
        // can view the order
        const isShopkeeper =
            order.shopkeeper._id.toString() === req.user.id;

        const isFarmer =
            order.farmer._id.toString() === req.user.id;

        if (!isShopkeeper && !isFarmer) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this order."
            });
        }

        return res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error("Get order by ID error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch order."
        });
    }
};


// Update order status - Admin only
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        const allowedStatuses = [
            "placed",
            "confirmed",
            "processing",
            "ready_for_delivery",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ];

        // Validate status
        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status."
            });
        }

        // Find order
        const order = await orderModel
            .findById(orderId)
            .populate("product", "productName");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        // Prevent updating an already delivered/cancelled order
        if (
            order.orderStatus === "delivered" ||
            order.orderStatus === "cancelled"
        ) {
            return res.status(400).json({
                success: false,
                message: "This order can no longer be updated."
            });
        }

        // Update status
        order.orderStatus = orderStatus;

        await order.save();

        // Notification messages
        const statusMessages = {
            confirmed:
                "Your order has been confirmed.",

            processing:
                "Your order is now being processed.",

            ready_for_delivery:
                "Your order is ready for delivery.",

            out_for_delivery:
                "Your order is now out for delivery.",

            delivered:
                "Your order has been delivered.",

            cancelled:
                "Your order has been cancelled."
        };

        // Notify shopkeeper
        await createNotification({
            recipient: order.shopkeeper,
            recipientRole: "shopkeeper",
            title: "Order Status Updated",
            message:
                statusMessages[orderStatus] ||
                `Your order status has been changed to ${orderStatus}.`,
            order: order._id
        });

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully.",
            order
        });

    } catch (error) {
        console.error(
            "Update order status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update order status."
        });
    }
};



export {
    createOrder,
    getShopkeeperOrders,
    getFarmerOrders,
    getOrderById,
    updateOrderStatus
};

