/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        API_ADDRESS: "http://localhost:3000",
        DATABASE_URL: "postgresql://postgres:123qweQWE@localhost:6699/spb-league?schema=public",
        NEXTAUTH_SECRET: "33faf0929b9529815dd581344aa202546d01b52f1bd1a48257a16aa37b38356a",
      },
};

export default nextConfig;
