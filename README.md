# 📸 Instagram Clone - Full-Stack Social Network

> A modern, real-time social networking application inspired by Instagram, built with Next.js 15 and React 19.

## 🎯 Project Overview

**Problem Solved:** Building a scalable, real-time social media platform with modern UX patterns including infinite scrolling, optimistic updates, and real-time messaging.

**My Role:** Full-stack development - designed architecture, implemented features, and integrated third-party services.

---

## ✨ Key Features I Built

### Core Social Features

- **Post Management** - Create, edit, delete posts with multi-image carousel support
- **Engagement System** - Like, comment, nested replies with real-time count updates
- **Social Graph** - Follow/unfollow, follower recommendations, user discovery
- **Notifications** - Real-time notification system with read/unread states
- **User Profiles** - Dynamic profiles with posts grid, saved posts, QR code sharing

### Real-time Messaging

- Integrated **CometChat SDK** for instant messaging
- Conversation list with unread message badges
- Direct messaging from user profiles

### Authentication

- JWT-based authentication with **auto token refresh**
- OAuth2 integration (Google)
- Protected routes with middleware

---

## 🛠 Tech Stack & Architecture

| Layer                | Technology                                            |
| -------------------- | ----------------------------------------------------- |
| **Framework**        | Next.js 15 (App Router, Turbopack)                    |
| **UI**               | React 19, Tailwind CSS 4, Radix UI                    |
| **State Management** | TanStack Query (server state), Zustand (client state) |
| **Forms**            | React Hook Form                                       |
| **Real-time Chat**   | CometChat SDK                                         |
| **Type Safety**      | TypeScript 5                                          |

### Architecture Highlights

```
src/
├── app/           # App Router pages & layouts
├── components/    # Reusable UI components (auth, post, comment, etc.)
├── hooks/         # Custom hooks (business logic separation)
├── services/      # API service layer
├── types/         # TypeScript definitions
└── providers/     # Context providers
```

---

## 💡 Technical Highlights

### 1. **Custom Hooks Pattern**

Extracted business logic into reusable hooks for clean separation:

- `usePost()` - Infinite query with cursor-based pagination
- `useLike()` - Optimistic like toggle with rollback
- `useComment()` - Nested comments with reply registry
- `useRelationship()` - Follow system with recommendations

### 2. **Smart API Layer**

```typescript
// Auto retry with token refresh on 401
async function apiFetch(endpoint, options, autoRetry = true) {
  const res = await fetch(...)
  if (res.status === 401 && autoRetry) {
    await refreshToken()
    return apiFetch(endpoint, options, false) // Retry once
  }
  return res
}
```

### 3. **Infinite Scroll Implementation**

- Intersection Observer API for efficient scroll detection
- Cursor-based pagination (not offset) for consistency
- Automatic prefetching for smooth UX

### 4. **Component Architecture**

- Fully componentized auth flow (LoginForm, RegisterForm, PhoneMockup)
- Compound components for complex UI (Carousel, Dialog)
- Mobile-first responsive design with breakpoint-based layouts

---

## 🧩 Challenges & Solutions

| Challenge                        | Solution                                                                               |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| **Nested replies sync**          | Created `repliesRegistry` - a centralized store to sync reply counts across components |
| **Token expiration mid-session** | Implemented transparent token refresh in API layer with retry logic                    |
| **Real-time message count**      | Integrated CometChat's `getUnreadMessageCount()` with React state sync                 |
| **Optimistic UI updates**        | TanStack Query mutations with `onMutate` for instant feedback                          |
| **SSR with Chat SDK**            | Dynamic imports with `ssr: false` for CometChat components                             |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Configure: NEXT_PUBLIC_COMETCHAT_APP_ID, REGION, AUTH_KEY

# Run development server
npm run dev

# Open http://localhost:3000
```

**Requirements:** Node.js 18+, Backend API running on port 8080

---

## 📈 Future Improvements

- [ ] Stories feature with 24h expiration
- [ ] Image optimization with Next.js Image component
- [ ] Push notifications (FCM/Web Push)
- [ ] Post scheduling
- [ ] Analytics dashboard
- [ ] E2E testing with Playwright

---

## 📊 Project Metrics

- **Components:** 25+ reusable components
- **Custom Hooks:** 10+ business logic hooks
- **Type Coverage:** Full TypeScript with strict mode
- **API Services:** 7 service modules

---

## 👤 About Me

This project demonstrates my ability to:

- Architect scalable React applications
- Integrate complex third-party SDKs
- Implement real-time features
- Write clean, maintainable TypeScript code
- Apply modern React patterns (hooks, server components, App Router)

---

_Built with ❤️ using Next.js 15, React 19, and modern web technologies._
