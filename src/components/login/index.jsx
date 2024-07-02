import React, { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const testEmail = (email) => {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(email);
};
const testPassword = (password) => {
	const passwordRegex = /^[a-zA-Z0-9!@#&?.]{8,16}$/;
	return passwordRegex.test(password);
};
export default function Login() {
	const { t } = useTranslation();
	const [avatar, setAvatar] = useState({
		file: null,
		url: "",
	});
	const [registerLoading, setRegisterLoading] = useState(false);
	const [loginLoading, setLoginLoading] = useState(false);

	const handleAvatar = (e) => {
		if (e.target.files[0]) {
			setAvatar({
				file: e.target.files[0],
				url: URL.createObjectURL(e.target.files[0]),
			});
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		try {
			const { password, email } = Object.fromEntries(formData);
			if (!testPassword(password)) {
				toast.warn(t("login.register.passwordError"));
				return;
			}
			if (!testEmail(email)) {
				toast.warn(t("login.register.emailError"));
				return;
			}
			setRegisterLoading(true);
			await signInWithEmailAndPassword(auth, email, password);
			toast.success(t("login.signUp.loginMessage"));
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoginLoading(false);
		}
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const { username, password, email } = Object.fromEntries(formData);
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
			setRegisterLoading(true);
			const res = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const imgUrl = await upload(avatar.file);
			await setDoc(doc(db, "users", res.user.uid), {
				username,
				email,
				avatar: imgUrl,
				id: res.user.uid,
				blocked: [],
			});

			await setDoc(doc(db, "userchats", res.user.uid), {
				chats: [],
			});
			toast.success(t("login.register.registerMessage"));
			e.target.reset();
			setAvatar({
				file: null,
				url: "",
			});
		} catch (e) {
			toast.error(e.message);
			console.log(e);
		} finally {
			setRegisterLoading(false);
		}
	};
	return (
		<div className="login">
			<div className="item">
				<h2>欢迎回来！</h2>
				<form onSubmit={handleLogin}>
					<input
						type="text"
						placeholder={t("login.signUp.usernamePlaceholder")}
					/>
					<input
						type="password"
						placeholder={t("login.signUp.passwordPlaceholder")}
					/>
					<button disabled={loginLoading}>
						{loginLoading ? t("loading") : t("login.signUp.signin")}
					</button>
				</form>
			</div>
			<div className="separator"></div>
			<div className="item">
				<h2>{t("login.signUp.singUpTitle")}</h2>
				<form action="" onSubmit={handleRegister}>
					<label htmlFor="file">
						<img
							src={avatar.url ? avatar.url : "./avatar.png"}
							alt=""
						/>
						{t("login.register.uploadImg")}
					</label>
					<input
						type="file"
						id="file"
						style={{ display: "none" }}
						onChange={(e) => handleAvatar(e)}
					/>
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
					<button disabled={registerLoading}>
						{registerLoading
							? t("loading")
							: t("login.register.signin")}
					</button>
				</form>
			</div>
		</div>
	);
}
