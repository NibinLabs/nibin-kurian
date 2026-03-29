import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'export',
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src')],
  },
};

export default nextConfig;
