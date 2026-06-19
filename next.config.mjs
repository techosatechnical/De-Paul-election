/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Adjust this limit (e.g., '5mb', '10mb') as needed
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jwzyiamwsolwtrxcsjif.supabase.co",
        pathname: "/storage/v1/object/public/election/**", 
      },
    ],
  },
};

export default nextConfig;