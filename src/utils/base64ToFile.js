export function base64ToFile(base64Data, fileName) {
	// 去掉前缀部分
	const byteString = atob(base64Data.split(",")[1]);
	const mimeType = base64Data.match(/:(.*?);/)[1];

	// 创建一个ArrayBuffer和一个Uint8Array来存储二进制数据
	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);

	// 将base64字符串转为二进制数据
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	// 使用二进制数据创建Blob对象
	const blob = new Blob([ab], { type: mimeType });

	// 使用Blob创建File对象
	const file = new File([blob], fileName, { type: mimeType });

	return file;
}
