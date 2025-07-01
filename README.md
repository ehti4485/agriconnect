# AgriConnect - Agriculture Marketplace Mobile App

AgriConnect is a mobile application that connects farmers with traders, providing a platform for agricultural product trading. Built with React, TypeScript, and Express.js, it offers a seamless experience for buying and selling agricultural products.

## 🌟 Features

- User registration & login (farmers, traders)
- Add/update/delete crop listings
- Marketplace view with search and filters
- Buy/sell functionality with transaction tracking
- Dashboard with sales and crop yield charts
- Crop advisory section
- Contact/support system
- Responsive mobile-first design

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Radix UI
- **Backend**: Express.js, Drizzle ORM
- **Database**: PostgreSQL
- **Authentication**: Passport.js with session support
- **State Management**: TanStack React Query
- **Form Handling**: React Hook Form + Zod
- **Mobile Build**: Capacitor.js

## 📱 Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Android Studio (for Android build)
- JDK 17 or higher

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/agriconnect.git
   cd agriconnect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/agriconnect
   SESSION_SECRET=your-session-secret
   ```

4. Initialize the database:
   ```bash
   npm run db:push
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## 📦 Building for Android

1. Build the web application:
   ```bash
   npm run build
   ```

2. Initialize Capacitor:
   ```bash
   npm run cap:init
   ```

3. Add Android platform:
   ```bash
   npm run cap:add
   ```

4. Sync web content:
   ```bash
   npm run cap:sync
   ```

5. Open in Android Studio:
   ```bash
   npm run cap:open
   ```

6. Build APK from Android Studio:
   - Click 'Build' > 'Build Bundle(s) / APK(s)' > 'Build APK(s)'
   - Find the APK in `android/app/build/outputs/apk/debug/`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.