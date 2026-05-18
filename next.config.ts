import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		staleTimes: {
			dynamic: 60,
			static: 300,
		},
	},
	serverExternalPackages: ["@prisma/client", "prisma"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com"
			}
		]
	},
	webpack: (config) => {
		// Required for react-pdf / pdfjs-dist
		config.resolve.alias.canvas = false;
		return config;
	},
};

export default nextConfig;
