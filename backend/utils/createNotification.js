import notificationModel from "../models/notificationModel.js";


const createNotification = async ({
    recipient,
    recipientRole,
    title,
    message,
    order = null
}) => {
    try {
        const notification = await notificationModel.create({
            recipient,
            recipientRole,
            title,
            message,
            order
        });

        return notification;

    } catch (error) {
        console.error(
            "Create notification error:",
            error
        );

        return null;
    }
};


export default createNotification;