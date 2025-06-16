# 📽️CuraTube

**CuraTube** is a full-stack video streaming platform that supports a handful of cool features similar to any other video streaming application out there. These features start from user authentication, video uploads, comments, likes,etc to some additional features like tweets and many more.

Built using the MERN stack, it delivers a smooth video experience with HLS(HTTP Live Streaming) powered by Imagekit and a custom video player built with React.
## 🚀 Features

Here’s what CuraTube offers:

- **User Authentication:** Secure sign-up, login, and session management via JWT tokens.
- **Video Uploads:** Seamless video uploading.
- **Video Streaming:** Smooth HLS-powered playback in all qualities.
- **Video Thumbnails:** Add thumbnails for your videos.
- **Comments:** Engage with others through threaded discussions.
- **Likes:** Show appreciation for your favorite videos.
- **Tweets:** Share quick updates or thoughts, Twitter-style.
- **Search:** Search for videos.
- **User Profile:** Personalize your profile and manage your uploads.
- **Video Recommendations:** Get suggestions while you watch a video.
- **Watch History:** Keep track of what you’ve watched.



## 🛠️Tech Stack

### Frontend
- **Frameworks & Libraries:** Vite, React, Redux, TanStack Router, TanStack Query
- **UI & Styling:** Tailwind CSS, Shadcn UI, VidStack (custom video player)

### Backend
- **Server:** Node.js, Express.js
- **Database ORM:** Mongoose
- **File Handling:** Multer
- **Media Storage & Streaming:** ImageKit

### Database
- **Primary Database:** MongoDB


## 📦Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ayyush08/CuraTube.git
   ```

2. Navigate to the project directory:
   ```bash
   cd CuraTube
   ```

3. Install the dependencies:
   ```bash
   cd client
   npm install
    cd ../server
    npm install
   ```

4. Create a `.env` file in the root directory and add the necessary environment variables(You can also have separate `.env` files for client and server if needed):
   ```bash
   PORT=<your-port>
   ACCESS_TOKEN_SECRET=<your-access-token-secret>
   REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
   ACCESS_TOKEN_EXPIRY=<your-access-token-expiry>
   REFRESH_TOKEN_EXPIRY=<your-refresh-token-expiry>

    CORS_ORIGIN=<your-cors-origin>(e.g., http://localhost:5173)
    VITE_API_BASE_URL=<your-api-base-url>(e.g., http://localhost:3000)


   MONGODB_URI=<your-mongodb-uri>
   IMAGEKIT_PUBLIC_KEY=<your-imagekit-public-key>
   IMAGEKIT_PRIVATE_KEY=<your-imagekit-private-key>
   IMAGEKIT_URL_ENDPOINT=<your-imagekit-url-endpoint>
   ```

5. Start the development server for both client and server:
   ```bash
    # In one terminal, start the server
    cd server
   npm run dev
    # In another terminal, start the client
    cd client
    npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173` to view the application.
