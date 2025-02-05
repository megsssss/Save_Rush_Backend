const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.post('/cart', async (req, res) => {
    try {
        const cart = new Cart(req.body);
        const savedCart = await cart.save();
        res.status(201).json(savedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/cart/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (err) {
        res.status(404).json({ message: 'Cart not found' });
    }
});

router.put('/cart/:userId', async (req, res) => {
    try {
        const updatedCart = await Cart.findOneAndUpdate(
            { userId: req.params.userId },
            { $set: { items: req.body.items } },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/cart/:userId/:productId', async (req, res) => {
    try {
        const updatedCart = await Cart.findOneAndUpdate(
            { userId: req.params.userId },
            { $pull: { items: { productId: req.params.productId } } },
            { new: true }
        );
        res.status(200).json({ message: 'Item removed', updatedCart });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

module.exports = router;
