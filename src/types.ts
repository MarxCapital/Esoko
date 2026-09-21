/**
 * E-Soko Burundi - Types & Data Models
 * Multi-Vendor Marketplace Specification
 */

export type UserRole = 'buyer' | 'seller' | 'admin';
export type UserStatus = 'active' | 'suspended';
export type SellerStatus = 'pending' | 'approved' | 'rejected' | 'none';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string; // Numéro burundais ex: +257 69 00 00 00
  role: UserRole;
  status: UserStatus;
  sellerStatus?: SellerStatus;
  sellerApplicationReason?: string;
  sellerRejectionReason?: string;
  sellerApplicationDate?: string;
  idCardUrl?: string; // Photo de la pièce d'identité (KYC)
  idCardSelfieUrl?: string; // Selfie avec pièce d'identité (KYC)
  address?: string; // Ville, quartier de contact/retrait
  avatarUrl?: string;
  createdAt: string;
}

export interface Shop {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  pickupLocation: string; // Ex: Galerie Kaze, Boulevard Patrice Lumumba, Bujumbura
  pickupHours: string; // Ex: Lundi - Samedi : 08h30 - 18h00
  city: string; // Bujumbura, Gitega, Ngozi, etc.
  phone: string;
  lumicashNumber: string;
  ecocashNumber: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
  slug?: string;
  productCount?: number;
}

export interface Product {
  id: string;
  vendorId: string;
  shopId: string;
  shopName: string;
  categoryId: string;
  name: string;
  description: string;
  price: number; // Prix en Francs Burundais (FBu / BIF)
  stock: number;
  images: string[];
  isPublished: boolean;
  unpublishReason?: string;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  vendorId: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'partially_ready' | 'completed' | 'cancelled';
export type SubOrderStatus = 'pending' | 'confirmed' | 'ready_for_pickup' | 'completed' | 'cancelled';
export type PaymentOperator = 'lumicash' | 'ecocash';
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded';

export interface SubOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface SubOrder {
  id: string;
  orderId: string;
  vendorId: string;
  shopId: string;
  shopName: string;
  pickupLocation: string;
  pickupHours: string;
  items: SubOrderItem[];
  vendorSubtotal: number; // FBu
  commissionAmount: number; // FBu déduit
  vendorNet: number; // FBu net pour le vendeur
  status: SubOrderStatus;
  cancelReason?: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  totalAmount: number; // FBu
  platformCommission: number; // FBu total
  paymentOperator: PaymentOperator;
  paymentPhone: string;
  paymentStatus: PaymentStatus;
  transactionId: string;
  status: OrderStatus;
  createdAt: string;
  subOrders: SubOrder[];
}

export interface Transaction {
  id: string;
  orderId: string;
  buyerId: string;
  buyerName: string;
  amount: number; // Total payé par l'acheteur en FBu
  platformCommission: number; // Part E-Soko
  vendorPayouts: {
    vendorId: string;
    shopName: string;
    amount: number; // Part vendeur
  }[];
  operator: PaymentOperator;
  phoneNumber: string;
  ussdRef: string;
  status: PaymentStatus;
  createdAt: string;
  failureReason?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  vendorId: string;
  shopId?: string;
  buyerId: string;
  buyerName: string;
  userName?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  vendorReply?: string;
  sellerReply?: { text: string; date?: string } | string;
  isApproved: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface DirectMessage {
  id: string;
  subOrderId?: string;
  shopId: string;
  shopName: string;
  buyerId: string;
  buyerName: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller';
  text: string;
  timestamp: string;
  read: boolean;
}

export interface PlatformSettings {
  commissionRate: number; // Pourcentage ex: 7%
  lumicashEnabled: boolean;
  ecocashEnabled: boolean;
  officialSlogan: string;
  supportPhone: string;
  supportEmail: string;
}

export interface AdminActionLog {
  id: string;
  adminId: string;
  adminName?: string;
  adminEmail: string;
  action?: string;
  actionType?: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface SettingsHistoryEntry {
  id: string;
  adminId: string;
  adminName?: string;
  adminEmail: string;
  changedField?: string;
  oldCommissionRate?: number;
  newCommissionRate?: number;
  oldValue?: string | number;
  newValue?: string | number;
  timestamp: string;
}

export interface Dispute {
  id: string;
  orderId?: string;
  productId?: string;
  amount?: number;
  reporterId?: string;
  reporterName?: string;
  buyerId?: string;
  buyerName?: string;
  sellerId?: string;
  shopId?: string;
  shopName?: string;
  targetType?: 'product' | 'seller' | 'review' | 'order';
  targetId?: string;
  targetName?: string;
  reason: string;
  status: 'open' | 'pending' | 'resolved' | 'dismissed';
  resolutionNote?: string;
  createdAt: string;
}
