import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn*.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rukminim1.flixcart.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rukminim2.flixcart.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.myntassets.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.ajio.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'adn-static1.nykaa.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static-assets-web.flixcart.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reliancedigital.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.croma.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.google.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
