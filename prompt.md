# Enterprise Food Delivery Platform for Office Professionals

## Context and Role

As a Full-Stack Developer specializing in scalable enterprise-grade web applications and immersive modern user experiences, you are responsible for designing and implementing a high-performance food delivery ecosystem tailored specifically for office employees and working professionals.

The platform must deliver a seamless corporate food ordering experience during peak office hours while maintaining production-level scalability, responsiveness, accessibility, and security.

The application should leverage modern frontend technologies, advanced animations, real-time communication systems, and secure backend infrastructure to create a premium and highly interactive user experience.

Additionally, the system must support secure payment processing, live delivery tracking, restaurant and admin dashboards, real-time notifications, and enterprise-level traffic scalability.

---

# Objective

Develop a complete full-stack enterprise food delivery platform that:

- Implements smooth and immersive UI interactions using Framer Motion.
- Provides a highly responsive and modern corporate ordering experience.
- Supports restaurant discovery, meal customization, secure checkout, and real-time delivery tracking.
- Enables office-specific delivery logistics and scheduling.
- Uses real-time infrastructure for order updates and delivery status synchronization.
- Handles secure authentication and payment processing.
- Provides dedicated dashboards for users, restaurant partners, and administrators.
- Maintains scalability during heavy traffic hours.
- Ensures accessibility, SEO optimization, and production-level performance.

---

# UI & Animation Requirements

## Premium Landing Experience

### The landing page must include:

- Outstanding animated hero section
- Smooth scroll-based storytelling sections
- Beautiful animated sliders showcasing:
  - Local restaurants
  - Corporate lunch menus
  - Popular cuisines
- Featured office meal combos
- Social proof and testimonials section
- Animated statistics and counters
- Sticky navigation with smooth transitions

---

# Scroll-Based Storytelling & Motion Design

Implement immersive animations using Framer Motion.

### Required animation behaviors:

- Scroll-triggered animations
- Parallax effects
- Fade-in transitions
- Staggered animations
- Animated section reveals
- Smooth page transitions
- Hover interactions on food cards
- Animated loading states
- Skeleton loaders
- Animated add-to-cart interactions
- Floating cart animations
- Micro-interactions for buttons and filters

---

# Animation Performance Requirements

Ensure animations:

- Use GPU-friendly properties:
  - transform
  - opacity
- Avoid layout thrashing
- Maintain smooth scroll performance
- Do not block rendering
- Support mobile devices efficiently

---

# Layout Requirements

The platform must include:

- Hero section with animated CTA
- Restaurant showcase section
- Featured lunch menus
- Cuisine discovery section
- Office ordering workflow section
- User reviews/testimonials
- Corporate offers section
- Contact/support section

---

# Restaurant Discovery System

The restaurant browsing experience must support:

- Instant search
- Debounced filtering
- Cuisine filtering
- Rating filtering
- Delivery-time filtering
- Veg/non-veg filtering
- Price-range filtering
- Infinite scrolling
- Lazy loading

---

# Restaurant Card Requirements

Each restaurant card should include:

- Animated hover effects
- Delivery time
- Ratings
- Cuisine tags
- Pricing information
- Live availability status
- Promotional offers
- Favorite/bookmark functionality

---

# Ordering Experience

## Menu Features

Implement:

- Category-based menu organization
- Sticky category navigation
- Animated add-to-cart flying effects
- Smooth quantity updates
- Dynamic pricing updates
- Promo code input section
- Cart persistence
- Real-time cart synchronization

---

# Meal Customization Modal

Create an animated customization modal that allows users to:

- Change sides
- Add/remove toppings
- Add/remove meat
- Select spice level
- Add special instructions
- Choose portion size
- View dynamic price calculation

### Modal Requirements

- Smooth modal entrance/exit animations
- Keyboard accessibility
- Focus trapping
- Responsive behavior
- Proper ARIA support

---

# Corporate Checkout System

Unlike regular delivery apps, office delivery requires enterprise-grade logistics handling.

## Checkout Form Must Include

- Office Building Name
- Company Name
- Floor Number
- Wing/Department
- Desk/Cubicle Number
- Delivery Instructions
- Preferred Delivery Time
- Contact Number

---

# Authentication System

Implement a complete authentication system using JWT-based authentication.

## Required Features

- User registration
- Login
- Logout
- Forgot password
- Password reset
- Refresh tokens
- Secure session handling
- Protected routes
- Role-based access control (RBAC)

---

# Security Requirements (Non-Negotiable)

## Password Security

Use:

- bcrypt password hashing
- JWT authentication
- HTTP-only cookies
- Secure token storage

---

# Security Middleware

Implement:

- helmet
- express-rate-limit
- xss-clean
- express-mongo-sanitize
- dotenv

---

# Data Protection Requirements

Protect against:

- XSS attacks
- Injection attacks
- CSRF attacks
- Rate-limit abuse
- Unauthorized access
- Sensitive credential exposure

---

# User Dashboard

Users must be able to:

- Manage profiles
- Save office addresses
- Bookmark favorite restaurants
- Track active orders
- View order history
- Manage payment methods
- Save delivery preferences
- View invoices and receipts

---

# Live Order Tracking System

After checkout, redirect users to a live tracking interface.

## Tracking States

1. Order Accepted
2. Preparing Food
3. In Kitchen Queue
4. Driver Assigned
5. On The Way
6. Reaching Office Location
7. Delivered

---

# Tracking UI Requirements

Implement:

- Animated stepper/timeline
- Real-time updates
- Live ETA updates
- Driver status updates
- Delivery progress animations
- Interactive tracking map (optional)

---

# Real-Time Infrastructure

Use:

- Socket.IO
OR
- WebSockets

---

# Real-Time Features

Support:

- Live order tracking
- Real-time order status updates
- Driver location updates
- Kitchen updates
- Restaurant acceptance updates
- Real-time notifications
- Cart synchronization

No manual refresh should be required.

---

# Notification System

Integrate:

- Nodemailer
- Firebase Cloud Messaging (FCM)

---

# Notification Triggers

Send notifications for:

- Order confirmation
- Payment success
- Restaurant acceptance
- Food preparation started
- Driver assigned
- Delivery dispatched
- Order delivered

### Example Notification

> "Your lunch order has been delivered to the reception desk on the 4th floor."

---

# Restaurant Partner Dashboard

Restaurant partners must be able to:

- View incoming orders in real-time
- Accept/reject orders
- Update order statuses
- Manage menus
- Perform CRUD operations
- Configure delivery timings
- Manage inventory availability
- Monitor sales analytics

---

# Admin Dashboard

Admins should be able to:

- Manage restaurants
- Manage users
- Track deliveries
- Monitor platform activity
- View enterprise analytics
- Manage disputes/refunds
- Configure promotional campaigns

---

# Analytics Requirements

Include:

- Daily revenue
- Order volume
- Active users
- Delivery performance
- Top-performing restaurants
- Peak-hour analytics
- Conversion metrics

---

# Dashboard UI Requirements

Include:

- Interactive charts
- Graphs
- Tables
- Advanced filtering
- Search functionality
- Export functionality
- Responsive admin layouts

---

# Backend Architecture

Build scalable backend APIs using:

- Node.js + Express
OR
- Next.js API Routes

---

# Database Requirements

Use:

- MongoDB
OR
- PostgreSQL

---

# Database Must Store

- Users
- Restaurants
- Menu items
- Orders
- Payments
- Delivery tracking data
- Reviews
- Ratings
- Notifications
- Saved addresses

---

# Payment Integration

Integrate:

- Stripe
- Razorpay
- PayPal

---

# Payment Features

Implement:

- Secure transactions
- Payment success handling
- Payment failure handling
- Webhooks
- Invoice generation
- Receipt generation
- Refund workflows

---

# API Requirements

Backend APIs must:

- Handle authentication
- Manage restaurants
- Process orders
- Handle secure payments
- Send notifications
- Manage dashboards
- Support real-time updates

---

# API Response Structure

## Success Response

```json
{
  "success": true,
  "status": 200,
  "message": "Order fetched successfully",
  "data": {}
}