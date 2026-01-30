import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize package imports - tree-shake large icon libraries
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-slot",
    ],
  },
};

export default nextConfig;
