import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: '/', // 确保使用根路径
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		// 确保生产构建不包含开发服务器相关代码
		minify: 'esbuild',
	},
	server: {
		// 仅在开发环境使用
		port: 5173,
	},
});
