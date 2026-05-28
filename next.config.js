const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'mixkit.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

module.exports = nextConfig;