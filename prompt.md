# Food Delivery Platform for Office Employees

## Context and Role

You are a Full-Stack Developer who makes company websites and apps that people love to use. Your job is to make a food delivery system for people who work in offices. This system has to be very good at handling a lot of orders when everyone's at work.

The food delivery system has to be easy to use when a lot of people are ordering food at the time. It also has to be fast and work well on all devices. The food delivery system has to be very secure so people do not have to worry about their information.

You will use frontend technologies, like animations that make the app fun to use and real-time communication systems to make the food delivery system very interactive. The backend infrastructure has to be secure so everything works correctly.

The food delivery system also has to be able to handle payments so people can pay for their food without worrying. It has to be able to track deliveries in time so people know when their food is coming. The food delivery system has to have dashboards for restaurants and admins so they can see what is going on. It also has to be able to send notifications in time so people get updates, about their food. The food delivery system has to be able to handle a lot of traffic like a company website.
---

# Objective

Develop a complete full-stack enterprise food delivery platform that:

- Implements UI interactions using Framer Motion.

- Provides a modern ordering experience that is easy to use.

- Supports finding restaurants, customizing meals, secure checkout and tracking deliveries in real-time.

- Helps with delivery logistics and scheduling for offices.

- Uses real-time updates for orders and delivery status.

- Handles secure authentication and payment processing securely.

- Offers dashboards, for users, restaurant partners and administrators to manage their accounts.

- Maintains performance during busy hours.

- Ensures website is accessible optimized for search engines and runs smoothly.

---

# UI & Animation Requirements

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
- Cuisine filtering
- Rating filtering , filtering restaurants on the basis of their rating
- Delivery-time filtering , filtering food items 
- Veg/non-veg filtering 
- Price-range filtering , filtering food items based on price
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

1. Order Accepted by the employee and the food outlet 
2. Preparing Food 
3. In Kitchen Queue
4. Driver Assigned
5. On The Way
6. Reaching Office Location
7. Delivered

---

# Tracking UI Requirements

Implement:

- Animated timeline
- Real-time updates
- Live ETA updates
- Driver status updates
- Delivery progress animations

---

# Real-Time Infrastructure

Use:

- Socket.IO
OR
- WebSockets

---

# Real-Time Features

Support:

- Live order tracking by customers
- Real-time order status updates to customers
- Driver location updates using google APis
- Kitchen updates by the restaurants 
- Restaurant acceptance updates 
- Real-time notifications 
- Cart items 


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
---

# Admin Dashboard

Admins should be able to:

- Manage restaurants
- Manage users
- Track deliveries
- Manage refunds
- Add promotional campaigns 

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
- Search functionality help to find nearby resturants
- Responsive admin layouts add or subtract food items and restaurants

---

# Backend Architecture

Build scalable backend APIs using:

- Node.js + Express


---

# Database Requirements

Use:

- MongoDB

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