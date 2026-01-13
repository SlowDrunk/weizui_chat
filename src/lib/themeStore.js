import { create } from "zustand";

// 主题配置
const themes = {
	light: {
		name: "light",
		colors: {
			// 主背景色
			primaryBg: "#f5f5f5",
			secondaryBg: "#ffffff",
			tertiaryBg: "#f0f0f0",
			
			// 文本颜色
			primaryText: "#000000",
			secondaryText: "#666666",
			tertiaryText: "#999999",
			
			// 边框颜色
			border: "#e5e5e5",
			borderLight: "#f0f0f0",
			
			// 消息气泡颜色
			messageOwnBg: "#95ec69", // QQ绿色
			messageOtherBg: "#ffffff",
			messageText: "#000000",
			
			// 悬停效果
			hoverBg: "#f5f5f5",
			
			// 输入框
			inputBg: "#ffffff",
			inputBorder: "#e5e5e5",
			
			// 按钮
			buttonPrimary: "#12b7f5", // QQ蓝色
			buttonHover: "#0fa8d8",
		},
	},
	dark: {
		name: "dark",
		colors: {
			// 主背景色
			primaryBg: "#1e1e1e",
			secondaryBg: "#2d2d2d",
			tertiaryBg: "#252525",
			
			// 文本颜色
			primaryText: "#ffffff",
			secondaryText: "#cccccc",
			tertiaryText: "#999999",
			
			// 边框颜色
			border: "#3a3a3a",
			borderLight: "#2d2d2d",
			
			// 消息气泡颜色
			messageOwnBg: "#95ec69", // QQ绿色保持不变
			messageOtherBg: "#3a3a3a",
			messageText: "#ffffff",
			
			// 悬停效果
			hoverBg: "#353535",
			
			// 输入框
			inputBg: "#2d2d2d",
			inputBorder: "#3a3a3a",
			
			// 按钮
			buttonPrimary: "#12b7f5",
			buttonHover: "#0fa8d8",
		},
	},
};

// 创建主题store
export const useThemeStore = create((set) => {
	// 从localStorage读取主题，默认为light
	const savedTheme = localStorage.getItem("theme") || "light";
	const currentTheme = themes[savedTheme] || themes.light;
	
	// 应用CSS变量
	const applyTheme = (theme) => {
		const root = document.documentElement;
		Object.entries(theme.colors).forEach(([key, value]) => {
			root.style.setProperty(`--${key}`, value);
		});
		root.setAttribute("data-theme", theme.name);
	};
	
	// 初始化时应用主题
	if (typeof window !== "undefined") {
		applyTheme(currentTheme);
	}
	
	return {
		theme: currentTheme.name,
		currentTheme: currentTheme,
		themes: themes,
		
		setTheme: (themeName) => {
			const theme = themes[themeName] || themes.light;
			set({ theme: theme.name, currentTheme: theme });
			localStorage.setItem("theme", theme.name);
			applyTheme(theme);
		},
		
		toggleTheme: () => {
			set((state) => {
				const newThemeName = state.theme === "light" ? "dark" : "light";
				const newTheme = themes[newThemeName];
				localStorage.setItem("theme", newThemeName);
				applyTheme(newTheme);
				return { theme: newThemeName, currentTheme: newTheme };
			});
		},
	};
});

