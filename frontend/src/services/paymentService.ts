import api from './api';
import { CheckoutPayload, Order } from '../types';

export interface RazorpayOrderResponse {
  razorpayOrderId: string;
  amountInPaise: number;
  currency: string;
  keyId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
}

export interface RazorpayVerificationPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  checkoutRequest: CheckoutPayload;
}

export const paymentService = {
  createRazorpayOrder: async (amount: number): Promise<RazorpayOrderResponse> => {
    const response = await api.post<RazorpayOrderResponse>('/payments/create-razorpay-order', {
      amount,
      currency: 'INR'
    });
    return response.data;
  },

  verifyRazorpayPayment: async (payload: RazorpayVerificationPayload): Promise<Order> => {
    const response = await api.post<Order>('/payments/verify-razorpay-payment', payload);
    return response.data;
  }
};
