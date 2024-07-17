import { toast } from "react-toastify";

export const handleDownload = (url) => {
	if (!url) {
		toast.error("无效的下载链接");
		return;
	}

	try {
		// 图片链接
		var imageUrl = url;
		fetch(imageUrl)
			.then((response) => response.blob())
			.then((blob) => {
				var link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				link.download = "image.jpg"; // 设置下载文件名
				document.body.appendChild(link);
				link.click(); // 模拟点击
				document.body.removeChild(link); // 移除a标签
				URL.revokeObjectURL(link.href); // 释放URL对象
			})
			.catch((error) =>
				console.error("Error downloading the image:", error)
			);
		// toast.success("图片下载提示已触发，请检查您的浏览器");
	} catch (error) {
		console.error("下载失败:", error);
		toast.error("下载失败");
	}
};
