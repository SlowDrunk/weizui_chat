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
import { testEmail, testPassword } from "../../lib/testUtils";


export default function Login() {
	const { t, i18n } = useTranslation();
	const [avatar, setAvatar] = useState({
		file: null,
		url: "",
	});
	const [registerLoading, setRegisterLoading] = useState(false);
	const [loginLoading, setLoginLoading] = useState(false);
	const [isLogin, setIsLogin] = useState(true);
	const [lang, setLang] = useState(i18n.language);

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
		const { password, email } = Object.fromEntries(formData);
		try {
			if (!testPassword(password)) {
				toast.warn(t("login.register.passwordError"));
				return;
			}
			if (!testEmail(email)) {
				toast.warn(t("login.register.emailError"));
				return;
			}
			setLoginLoading(true);
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
	const handleLang = (lang) => {
		setLang(lang);
		i18n.changeLanguage(lang);
	};
	return (
		<div className="login">
			<div className="lang">
				<h4>设置语言</h4>
				<div className="langs">
					<div className="langItem" onClick={() => handleLang("zh")}>
						<input
							type="radio"
							id="zh"
							name="zh"
							value="zh"
						/>
						<label htmlFor="zh">中文</label>
					</div>
					<div className="langItem" onClick={() => handleLang("en")}>
						<input
							type="radio"
							id="en"
							name="en"
							value="en"
							checked={lang === "en"}
							onChange={() => setLang("en")}
						/>
						<label htmlFor="en">英文</label>
					</div>
				</div>
			</div>
			{isLogin ? (
				<div className="item">
					<h2>{t("login.signUp.singUpTitle")}</h2>
					<form onSubmit={handleLogin}>
						<input
							type="text"
							name="email"
							placeholder={t("login.signUp.usernamePlaceholder")}
						/>
						<input
							type="password"
							name="password"
							placeholder={t("login.signUp.passwordPlaceholder")}
						/>
						<div className="button-box">
							<button disabled={loginLoading}>
								{loginLoading
									? t("loading")
									: t("login.signUp.signin")}
							</button>
							<button onClick={() => setIsLogin(false)}>
								{t("login.register.signin")}
							</button>
						</div>
					</form>
				</div>
			) : (
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
							placeholder={t(
								"login.register.usernamePlaceholder"
							)}
							name="username"
						/>
						<input
							type="text"
							placeholder={t("login.register.emailPlaceholder")}
							name="email"
						/>
						<input
							type="password"
							placeholder={t(
								"login.register.passwordPlaceholder"
							)}
							name="password"
						/>

						<div className="button-box">
							<button disabled={registerLoading}>
								{registerLoading
									? t("loading")
									: t("login.register.signin")}
							</button>
							<button onClick={() => setIsLogin(true)}>
								{t("login.signUp.signin")}
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
