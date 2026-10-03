import api from './api';
import { Category, PageResponse, Product, ProductCreatePayload, ListingType } from '../types';

export interface ProductFilterParams {
  query?: string;
  category?: string;
  condition?: string;
  listingType?: ListingType;
  collegeId?: number;
  campusId?: number;
  semester?: string;
  course?: string;
  isSemesterEndResale?: boolean;
  isClubListing?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  size?: number;
}

export const productService = {
  async getProducts(params: ProductFilterParams = {}): Promise<PageResponse<Product>> {
    const res = await api.get<PageResponse<Product>>('/products', { params });
    return res.data;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const res = await api.get<Product[]>('/products/featured');
    return res.data;
  },

  async getProductById(id: number): Promise<Product> {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
  },

  async getSimilarProducts(id: number): Promise<Product[]> {
    const res = await api.get<Product[]>(`/products/${id}/similar`);
    return res.data;
  },

  async createProduct(payload: ProductCreatePayload): Promise<Product> {
    const res = await api.post<Product>('/products', payload);
    return res.data;
  },

  async updateProduct(id: number, payload: ProductCreatePayload): Promise<Product> {
    const res = await api.put<Product>(`/products/${id}`, payload);
    return res.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async getCategories(): Promise<Category[]> {
    const res = await api.get<Category[]>('/categories');
    return res.data;
  },

  async getAprioriRecommendations(productIds: number[], limit = 4): Promise<Product[]> {
    const idsParam = productIds.join(',');
    const res = await api.get<Product[]>('/recommendations/apriori', {
      params: { productIds: idsParam, limit }
    });
    return res.data;
  },

  async getFrequentlyBoughtTogether(productId: number, limit = 3): Promise<Product[]> {
    const res = await api.get<Product[]>(`/recommendations/frequently-bought-together/${productId}`, {
      params: { limit }
    });
    return res.data;
  }
};

export default productService;
