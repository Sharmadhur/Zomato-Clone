import TryCatch from "../middlewares/trycatch.js";
import mongoose from "mongoose";
import Cart from "../models/Cart.js";
export const addToCart = TryCatch(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Please Login",
        });
    }
    const userId = req.user._id;
    const { restaurantId, itemId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({
            message: "Invalid restaurant and item Id",
        });
    }
    const cartFromDifferentRestaurant = await Cart.findOne({
        userId,
        restaurantId: { $ne: restaurantId },
    });
    if (cartFromDifferentRestaurant) {
        return res.status(400).json({
            message: "You can order from only one restaurant at a time.Please clear your cart first to add items from this restaurant.",
        });
    }
    const cartItem = await Cart.findOneAndUpdate({ userId, restaurantId, itemId }, {
        $inc: { quantity: 1 },
        $setOnInsert: { userId, restaurantId, itemId },
    }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return res.json({
        message: "Item Added To Cart",
        cart: cartItem,
    });
});
export const fetchMyCart = TryCatch(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Please Login",
        });
    }
    const userId = req.user._id;
    const cartItems = await Cart.find({ userId })
        .populate("itemId")
        .populate("restaurantId");
    let subtotal = 0;
    let cartLength = 0;
    for (const cartItem of cartItems) {
        const item = cartItem.itemId;
        subtotal += item.price * cartItem.quantity;
        cartLength += cartItem.quantity;
    }
    return res.json({
        success: true,
        cartLength,
        subtotal,
        cart: cartItems,
    });
});
export const incrementCartItem = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    const { itemId } = req.body;
    if (!userId || !itemId) {
        return res.status(400).json({
            message: "Invalid request",
        });
    }
    const cartItem = await Cart.findOneAndUpdate({ userId, itemId }, { $inc: { quantity: 1 } }, { new: true });
    if (!cartItem) {
        return res.status(404).json({
            message: "Item Not Found",
        });
    }
    res.json({
        message: "Quantity increased",
        cartItem,
    });
});
export const decrementCartItem = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    const { itemId } = req.body;
    if (!userId || !itemId) {
        return res.status(400).json({
            message: "Invalid request",
        });
    }
    const cartItem = await Cart.findOne({ userId, itemId });
    if (!cartItem) {
        return res.status(404).json({
            message: "Item Not Found",
        });
    }
    if (cartItem.quantity === 1) {
        await Cart.deleteOne({ userId, itemId });
        return res.json({
            message: "Item removed from cart",
        });
    }
    cartItem.quantity -= 1;
    await cartItem.save();
    res.json({
        message: "Quantity decreased",
        cartItem,
    });
});
export const clearCart = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorised",
        });
    }
    await Cart.deleteMany({ userId });
    res.json({
        message: "Cart cleared successfully "
    });
});
