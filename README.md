# YY-Showcase

A modern, mobile-first web application for managing community announcements, course registrations, and user profiles. Built with React, TypeScript, and Firebase.

## 🌟 Features

- **📰 Announcements**: Create, read, update, and delete community announcements with image support
- **📚 Course Management**: Browse, enroll, and manage course registrations
- **👤 User Profiles**: User authentication and profile customization
- **❤️ Like System**: Like/unlike announcements to show support
- **📱 PWA Support**: Install as a native app on mobile devices
- **🌐 Offline Support**: Works offline with service worker caching
- **🎨 Responsive Design**: Fully optimized for mobile and desktop screens
- **📸 Screenshot & Share**: Capture and share course/announcement details

## 🛠 Tech Stack

- **Frontend**: React 19.2, TypeScript
- **Styling**: Tailwind CSS 3.4
- **Build Tool**: Vite 5.1
- **Backend**: Firebase Firestore (Realtime Database)
- **Mobile**: PWA with Service Worker
- **Utilities**: html2canvas (for screenshot capture)

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- Firebase project account

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd yy-showcase
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Note**: Get these values from your Firebase project settings.

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Build & Deploy

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## 📁 Project Structure

```
yy-showcase/
├── components/           # React components
│   ├── ArticleForm.tsx   # Article creation/editing
│   ├── CourseForm.tsx    # Course creation/editing
│   ├── CoursesTab.tsx    # Course list view
│   ├── Layout.tsx        # App layout with navigation
│   ├── LoginPrompt.tsx   # Login interface
│   ├── NewsTab.tsx       # Announcements view
│   ├── SettingsTab.tsx   # User settings
│   └── ShareCard.tsx     # Share/preview card
├── services/
│   └── firebase.ts       # Firebase service functions
├── utils/
│   └── storage.ts        # Local storage utilities
├── public/
│   ├── manifest.json     # PWA manifest
│   └── sw.js            # Service worker
├── App.tsx              # Main app component
├── index.tsx            # App entry point
├── types.ts             # TypeScript interfaces
├── styles.css           # Global styles
├── vite.config.ts       # Vite configuration
└── tailwind.config.js   # Tailwind configuration
```

## 🔐 Authentication

Users authenticate via phone number:

1. Enter phone number in login prompt
2. User data is stored in Firestore under the phone number as ID
3. Admin privileges can be assigned directly in Firestore

## 🗄 Database Structure

### Collections

**Articles**

- `id`: Document ID
- `title`: Article title
- `content`: Article content
- `imageUrl`: Optional image URL
- `date`: Timestamp
- `likedBy`: Array of phone numbers of users who liked it

**Courses**

- `id`: Document ID
- `name`: Course name
- `desc`: Course description
- `date`: Course date
- `enrolledUsers`: Array of phone numbers of enrolled users

**Users**

- `id`: Phone number (used as document ID)
- `name`: User display name
- `isAdmin`: Boolean indicating admin status
- `createdAt`: Account creation timestamp

## 📱 Mobile Features

- **PWA Installation**: Users can install the app on home screen
- **Safe Area Support**: Properly handles notch/safe areas on modern phones
- **Touch Optimized**: Smooth interactions for touch devices
- **Offline Mode**: Service worker caches essential assets
- **Status Bar**: Custom styling for iOS status bar

## 🎨 Customization

### Theme Colors

Modify `tailwind.config.js` to change the theme:

```js
theme: {
  extend: {
    colors: {
      primary: '#2563eb',
      // Add more colors
    }
  }
}
```

### App Metadata

Update `public/manifest.json` to customize:

- App name and description
- Theme color
- App icons
- Screenshots

## 🐛 Troubleshooting

### Service Worker Not Working

- Check that `public/sw.js` is accessible
- Clear browser cache and reload
- Check browser console for errors

### Firebase Connection Issues

- Verify `.env` variables are correct
- Check Firebase project security rules
- Ensure Firestore is enabled in Firebase console

### Tailwind Styles Not Applying

- Run `npm run build` to rebuild CSS
- Clear browser cache
- Check that Tailwind classes are spelled correctly

---

**Last Updated**: February 2026
