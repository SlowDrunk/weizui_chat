import React, { useState, useEffect } from "react";
import "./index.css";
import { useTranslation } from "react-i18next";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import upload from "../../../../lib/upload";
import { useUserStore } from "../../../../lib/userStore";
import { testEmail, testPassword } from "../../../../lib/testUtils";
import { auth } from "../../../../lib/firebase";
import { toast } from "react-toastify";
import CopperImage from "../../../CopperImage";
import { CloseOutlined } from "@ant-design/icons";

export default function UpdateUser(props) {
	const { setUpdateUser } = props;
	const { t } = useTranslation();
	const { currentUser } = useUserStore();
	const updateForm = React.useRef("updateForm");
	const [loading, setLoading] = useState(false);
	const [avatar, setAvatar] = useState({
		file: null,
		url: "",
	});
	const [uploadImg, setUploadImg] = useState(false);

	useEffect(() => {
		setAvatar({
			file: currentUser.avatar,
			url: currentUser.avatar,
		});
		updateForm.current.username.value = currentUser.username;
		updateForm.current.email.value = currentUser.email;
		updateForm.current.signature.value = currentUser.signature
			? currentUser.signature
			: "";
	}, [currentUser]);

	const handleAvatar = () => {
		// if (e.target.files[0]) {
		// 	setAvatar({
		// 		file: e.target.files[0],
		// 		url: URL.createObjectURL(e.target.files[0]),
		// 	});
		// }
		setUploadImg(true);
	};

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
		const formData = new FormData(e.target);
		const { username, password, email, signature } =
			Object.fromEntries(formData);
		try {
			if (!avatar.file) {
				toast.warn(t("login.register.uploadError"));
				return;
			}
			if (!testPassword(password)) {
				toast.warn(t("login.register.passwordError"));
				return;
			}
			if (!testEmail(email)) {
				toast.warn(t("login.register.emailError"));
				return;
			}
			const imgUrl = await upload(avatar.file);

			await updateDoc(doc(db, "users", currentUser.id), {
				username,
				email,
				avatar: imgUrl,
				password,
				signature,
			});
			toast.success("修改成功");
			setUpdateUser(false);
			e.target.reset();
			auth.signOut();
		} catch (err) {
			console.error(err);
			toast.error("修改失败");
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="update-user">
			<div className="close-icon" onClick={() => setUpdateUser(false)}>
				<CloseOutlined />
			</div>
			<div className="item">
				<form action="" onSubmit={handleSubmit} ref={updateForm}>
					<label onClick={handleAvatar}>
						<img
							src={avatar.url ? avatar.url : "./avatar.png"}
							alt=""
						/>
						{t("login.register.uploadImg")}
					</label>
					{/* <input
						type="file"
						id="file"
						style={{ display: "none" }}
						onChange={(e) => handleAvatar(e)}
					/> */}
					<input
						type="text"
						placeholder={t("login.register.usernamePlaceholder")}
						name="username"
					/>
					<input
						type="text"
						placeholder={t("login.register.emailPlaceholder")}
						name="email"
					/>
					<input
						type="password"
						placeholder={t("login.register.passwordPlaceholder")}
						name="password"
					/>
					<input
						type="text"
						placeholder={t("login.register.signaturePlaceholder")}
						name="signature"
					/>
					<div className="button-box">
						<button disabled={loading}>
							{loading ? t("loading") : t("editUser")}
						</button>
					</div>
				</form>
			</div>
			<CopperImage
				isOpen={uploadImg}
				handleSend={(type, file) => {
					setAvatar({
						file: file,
						url: URL.createObjectURL(file),
					});
					setUploadImg(false);
				}}
				handleClose={setUploadImg}
			/>
		</div>
	);
}
