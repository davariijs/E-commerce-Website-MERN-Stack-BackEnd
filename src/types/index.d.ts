import {Document} from 'mongoose';

export interface IWishlist extends Document {
    title: string;
    image: string;
    price: string;
    pathname: string;
    uid: string;
}

export interface TCartItem {
    _id?: Types.ObjectId,
    quantity: number;
    title: string,
    image: string,
    price: number,
    color: string,
    webID: number,
}

export interface ICartList extends Document {
    uid: string,
    items: TCartItem[],
    _id:string,
}


export interface IAddressInfo {
    _id?:string,
    firstName:string,
    lastName:string,
    number:string,
    street:string,
    apt?:string,
    city:string,
    state:string,
    billing?:boolean,
    shipping?:boolean,
    company?:string,
    postalCode?:string,
    instruction?:string,
    country?:string,
    uid?:string,
  }


export interface IPayment {
    cardNumber: string,
    nameCard: string,
    expirationDate: string,
    securityCode: string, 
  }

export interface TOrder  {
          orderDate?: string, // Default to current date
          deliveryDate: string,
          orderStatus: string, // Default to "Pending"
          paymentMethod: string,
          totalPrice: number, // Price should be a number
          cartItems: TCartItem[],
          address: IAddressInfo[],
          payment: IPayment[],
          _id: string,
    }

export interface ICheckOut {
  orders: TOrder[],
  uid:string,
}