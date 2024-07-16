import { toast } from "react-toastify";

export const handleDownload = (url) => {
	if (!url) {
		toast.error("无效的下载链接");
		return;
	}

	try {
		const link = document.createElement("a");
		link.href = url;
		link.download = "image.jpeg";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		// toast.success("图片下载提示已触发，请检查您的浏览器");
	} catch (error) {
		console.error("下载失败:", error);
		toast.error("下载失败");
	}
};
