export type Role = 'BUYER' | 'SELLER' | 'ADMIN';

export type ListingType = 'SELL' | 'EXCHANGE' | 'DONATE' | 'FREE_CORNER';

export type ProductCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'REFURBISHED' | 'UPCYCLED';

export type ProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SOLD_OUT';

export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'READY_FOR_HANDOVER' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type HandoverMethod = 'CAMPUS_PICKUP' | 'CAMPUS_DELIVERY';

export type MarketplaceRequestStatus = 'REQUESTED' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';

export interface Campus {
  id: number;
  collegeId: number;
  collegeName: string;
  name: string;
  address?: string;
}

export interface College {
  id: number;
  name: string;
  code: string;
  emailDomain: string;
  location?: string;
  logoUrl?: string;
  campuses?: Campus[];
}

export interface Club {
  id: number;
  name: string;
  collegeId: number;
  collegeName: string;
  description?: string;
  category?: string;
  clubRepName?: string;
  clubRepEmail?: string;
  verified: boolean;
  logoUrl?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  collegeId?: number;
  collegeName?: string;
  collegeCode?: string;
  campusId?: number;
  campusName?: string;
  verifiedStudent?: boolean;
  collegeEmail?: string;
  course?: string;
  branch?: string;
  graduationYear?: number;
  active: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: Role;
  profileImage?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  verifiedStudent?: boolean;
  collegeName?: string;
  collegeCode?: string;
  collegeEmail?: string;
  course?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  condition: ProductCondition;
  listingType: ListingType;
  category: Category;
  seller: User;
  collegeId?: number;
  collegeName?: string;
  collegeCode?: string;
  campusId?: number;
  campusName?: string;
  images: string[];
  brand?: string;
  material?: string;
  location?: string;
  academicYear?: string;
  semester?: string;
  course?: string;
  subject?: string;
  author?: string;
  isbn?: string;
  isSemesterEndResale?: boolean;
  isClubListing?: boolean;
  clubId?: number;
  clubName?: string;
  exchangePreference?: string;
  status: ProductStatus;
  sustainabilityScore?: number;
  co2Saved: number;
  waterSaved: number;
  wasteReduced: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface ProductCreatePayload {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  condition: ProductCondition;
  listingType?: ListingType;
  categoryId: number;
  collegeId?: number;
  campusId?: number;
  brand?: string;
  material?: string;
  location?: string;
  academicYear?: string;
  semester?: string;
  course?: string;
  subject?: string;
  author?: string;
  isbn?: string;
  isSemesterEndResale?: boolean;
  isClubListing?: boolean;
  clubId?: number;
  exchangePreference?: string;
  images?: string[];
}

export interface MarketplaceRequest {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  productPrice?: string;
  buyerId: number;
  buyerName: string;
  buyerEmail: string;
  buyerCollege?: string;
  sellerId: number;
  sellerName: string;
  sellerEmail: string;
  sellerCollege?: string;
  requestType: ListingType;
  status: MarketplaceRequestStatus;
  message?: string;
  offeredProductId?: number;
  offeredProductName?: string;
  pickupLocation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImage?: string;
  condition: ProductCondition;
  sustainabilityScore?: number;
  quantity: number;
  subtotal: number;
  sellerId: number;
  sellerName: string;
  availableStock: number;
  co2Saved: number;
  waterSaved: number;
  wasteReduced: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  co2Saved: number;
  waterSaved: number;
  wasteReduced: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  condition: ProductCondition;
  sellerId: number;
  sellerName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderTrackingHistory {
  id: number;
  status: OrderStatus;
  title: string;
  description: string;
  location?: string;
  timestamp: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  subtotal: number;
  deliveryFee: number;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentMethod: string;
  handoverMethod: HandoverMethod;
  pickupLocation: string;
  preferredTimeSlot: string;
  handoverCode?: string;
  items: OrderItem[];
  trackingHistory?: OrderTrackingHistory[];
  buyerId: number;
  buyerName: string;
  buyerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutPayload {
  fullName: string;
  phone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod?: string;
  handoverMethod?: HandoverMethod;
  pickupLocation?: string;
  preferredTimeSlot?: string;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  userProfileImage?: string;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SustainabilityImpact {
  co2Saved: number;
  waterSaved: number;
  wasteReduced: number;
  productsReused: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
  totalRevenue: number;
  impact: SustainabilityImpact;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
