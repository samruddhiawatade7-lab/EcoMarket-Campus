import api from './api';
import { MarketplaceRequest, ListingType, MarketplaceRequestStatus } from '../types';

export interface CreateMarketplaceRequestPayload {
  productId: number;
  requestType: ListingType;
  message?: string;
  offeredProductId?: number;
  pickupLocation?: string;
}

export const marketplaceRequestService = {
  createRequest: async (payload: CreateMarketplaceRequestPayload): Promise<MarketplaceRequest> => {
    const response = await api.post<MarketplaceRequest>('/requests', payload);
    return response.data;
  },

  getUserRequests: async (): Promise<MarketplaceRequest[]> => {
    const response = await api.get<MarketplaceRequest[]>('/requests/my-requests');
    return response.data;
  },

  getSellerRequests: async (): Promise<MarketplaceRequest[]> => {
    const response = await api.get<MarketplaceRequest[]>('/requests/seller-requests');
    return response.data;
  },

  updateRequestStatus: async (
    requestId: number,
    status: MarketplaceRequestStatus,
    pickupLocation?: string
  ): Promise<MarketplaceRequest> => {
    const response = await api.put<MarketplaceRequest>(`/requests/${requestId}/status`, {
      status,
      pickupLocation,
    });
    return response.data;
  },
};

export default marketplaceRequestService;
