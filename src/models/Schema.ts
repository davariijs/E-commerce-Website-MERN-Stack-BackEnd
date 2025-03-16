import mongoose, { Schema} from 'mongoose';
import { IAddressInfo, ICartList, ICheckOut, IWishlist } from '../types';


const WishlistSchema: Schema<IWishlist> = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    pathname:{
        type: String,
        required: true,
    },
    uid: {
        type: String,
        required: true,
    }
});

const CartSchema: Schema<ICartList>  = new mongoose.Schema({
    uid: String,
    items: [
        {
        title: String,
        image: String,
        price: Number,
        color: String,
        quantity: { type: Number, default: 1 },
        webID: Number,
        }
    ]
});


const InfoAccountSchema: Schema<IAddressInfo> = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: false,
    },
    street: {
        type: String,
        required: true,
    },
    apt: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    instruction: {
        type: String,
        required: false,
    },
    shipping: {
        type: Boolean,
        required: false,
    },
    billing: {
        type: Boolean,
        required: false,
    },
    uid: {
        type: String,
        required: true,
    }
});


const CheckOutSchema: Schema<ICheckOut> = new mongoose.Schema({
    uid: { type: String, required: true },
    orders: [
        {
            orderDate: { type: String, default: new Date().toISOString() }, // Default to current date
            deliveryDate: { type: String },
            orderStatus: { type: String, default: "Pending" }, // Default to "Pending"
            paymentMethod: { type: String, required: true },
            totalPrice: { type: Number, required: true }, // Price should be a number
            cartItems: [
                {
                    title: { type: String, required: true },
                    image: { type: String },
                    price: { type: Number, required: true },
                    color: { type: String },
                    quantity: { type: Number, default: 1 },
                }
            ],
            address: [
                {
                    firstName: { type: String, required: true },
                    lastName: { type: String, required: true },
                    country: { type: String, required: true },
                    company: { type: String },
                    street: { type: String, required: true },
                    apt: { type: String },
                    city: { type: String, required: true },
                    state: { type: String, required: true },
                    number: { type: String, required: true },
                    postalCode: { type: String, required: true },
                    instruction: { type: String },
                    shipping: { type: Boolean, default: false },
                    billing: { type: Boolean, default: false },
                    uid: {type: String},
                }
            ],
            payment: [
                {
                    cardNumber: { type: String, required: true }, // Use String to avoid leading zero issues
                    nameCard: { type: String, required: true },
                    expirationDate: { type: String, required: true },
                    securityCode: { type: String, required: true }, // Use String for leading zeros
                }
            ]
        }
    ]
});

module.exports = { CartSchema, WishlistSchema, InfoAccountSchema, CheckOutSchema}