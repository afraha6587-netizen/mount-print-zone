import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const customOrderSchema = z.object({
  customerName: z.string().min(2, 'Full name is required'),
  customerPhone: z.string().min(10, 'Valid 10-digit phone number is required'),
  customerEmail: z.string().email('Valid email address is required'),
  serviceId: z.string().min(1, 'Please select a service'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
  designFileUrl: z.string().optional(),
  designFileName: z.string().optional(),
});

export const trackOrderSchema = z.object({
  orderId: z.string().min(4, 'Order ID is required'),
  phone: z.string().min(4, 'Phone number is required'),
});

export const serviceSchema = z.object({
  name: z.string().min(2, 'Service name required'),
  slug: z.string().min(2, 'Slug required'),
  description: z.string().min(10, 'Detailed description required'),
  categoryId: z.string().min(1, 'Category required'),
  basePrice: z.coerce.number().min(0, 'Price must be non-negative'),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  estimatedDelivery: z.string().min(2, 'Estimated delivery time required'),
  isFeatured: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  image: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name required'),
  slug: z.string().min(2, 'Category slug required'),
  description: z.string().optional(),
  image: z.string().optional(),
  displayOrder: z.coerce.number().default(0),
});

export const portfolioSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  categoryId: z.string().min(1, 'Category is required'),
  image: z.string().min(1, 'Image URL is required'),
  description: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

export const testimonialSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  photo: z.string().optional(),
  review: z.string().min(10, 'Review text is required'),
  rating: z.coerce.number().min(1).max(5).default(5),
  isFeatured: z.boolean().default(true),
});

export const bannerSchema = z.object({
  title: z.string().min(2, 'Banner title required'),
  subtitle: z.string().optional(),
  image: z.string().min(1, 'Image URL required'),
  link: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.coerce.number().default(0),
});

export const offerSchema = z.object({
  code: z.string().min(3, 'Coupon code required'),
  title: z.string().min(2, 'Title required'),
  discountPercent: z.coerce.number().min(1).max(100),
  minOrderValue: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});
