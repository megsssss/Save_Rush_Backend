const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');

router.post('/order', async (req, res) => {
    try {
        const { userId, cartId } = req.body;
        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const totalAmount = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        const order = new Order({
            userId,
            cartId,
            totalAmount,
            status: 'Pending'
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.get('/order/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch (err) {
        res.status(404).json({ message: 'Orders not found' });
    }
}
);

router.put('/order/:orderId/status', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.orderId,
            { $set: { status: req.body.status } },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.delete('/order/:orderId', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.orderId);
        res.status(200).json({ message: 'Order deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

module.exports = router;
