/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
        { 
          protocol: "http",
          hostname: 'localhost:8000',
          
    
        },
          {
            protocol: "https",
            hostname: "avatars.githubusercontent.com",
          },
          {
            protocol: "https",
            hostname: "lh3.googleusercontent.com",
          },
          {
            protocol: "https",
            hostname: "randomuser.me",
          },
        ],
      },


};

export default nextConfig;
