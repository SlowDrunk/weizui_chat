import React, { useEffect, useState, useRef } from "react";
import "./index.css";
import "cropperjs/dist/cropper.css";
import CropperJs from "cropperjs";
import { Button, Upload, Modal } from "antd";

export default function CopperImage({ file, handleSend, isOpen, handleClose }) {
	const ref = useRef();
	const [cropper, setCropper] = useState(); // 存储cropper对象
	const [image, setImage] = useState(); // 记录图片，没有图片时toBlob会报错
	const [loading, setLoading] = useState(false); // 记录上传的状态

	useEffect(() => {
		if (!ref.current) return;
		const myCropper = new CropperJs(ref.current, {
			viewMode: 1,
			dragMode: "move",
			autoCropArea: 1,
			background: false,
			highlight: false,
			cropBoxResizable: true,
			toggleDragModeOnDblclick: true,
			minContainerHeight: 500,
		});
		setCropper(myCropper);
	}, []);

	const replaceImg = (img) => {
		setImage(undefined);
		// 通过FileReader读取用户选取的文件
		const reader = new FileReader();
		reader.readAsDataURL(img);
		//加载图片后获取到图片的base64格式
		reader.onload = ({ target: { result } = {} }) => {
			//更新替换为目标图片
			cropper.replace(result);
			setImage(img);
		};

		return false;
	};

	const onSubmit = () => {
		if (image) {
			setLoading(true);
			// 获取HTMLCanvasElement.toBlob获取blob，并通过FormData上传至服务器
			const cropperCanvas = cropper.getCroppedCanvas();
			if (!cropperCanvas) return;
			cropperCanvas.toBlob(async (blob) => {
				if (blob) {
					// console.log(blob);
					const file = new File([blob], image?.name, {
						type: "image/png",
					});
					await handleSend("picture", file);
					setLoading(false);
					setImage(undefined);
					cropper.destroy();
				}
			}, "image/png");
		}
	};

	return (
		<>
			<Modal
				open={isOpen}
				maskClosable={false}
				forceRender={true}
				onCancel={() => {
					setImage(undefined);
					cropper.destroy();
					handleClose(false);
				}}
				footer={null}
			>
				<div className="image-container">
					<div className="title">{image?.name ?? "请上传图片"}</div>
					<div className="cropper">
						<img ref={ref} alt="" />
					</div>
					<div className="buttons">
						<Upload
							fileList={[]}
							beforeUpload={replaceImg}
							accept="image/*"
						>
							<Button className="upload">
								选择图片
								<ion-icon name="cloud-upload-outline"></ion-icon>
							</Button>
						</Upload>
						<Button
							className="button"
							type="primary"
							loading={loading}
							onClick={onSubmit}
						>
							确定上传
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}
