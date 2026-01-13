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
import { Radio } from "antd";
import { LangContext } from "../../lib/useLang";
import { useContext } from "react";

const options = [
	{ label: "中文", value: "zh" },
	{ label: "英文", value: "en" },
];

export default function Login() {
	const { t } = useTranslation();
	const { lang, handleLang } = useContext(LangContext);
	const [avatar, setAvatar] = useState({
		file: null,
		url: "",
	});
	const [registerLoading, setRegisterLoading] = useState(false);
	const [loginLoading, setLoginLoading] = useState(false);
	const [isLogin, setIsLogin] = useState(true);

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
		} finally {
			setRegisterLoading(false);
		}
	};

	return (
		<div className="login">
			{/* 左侧品牌展示区 */}
			<div className="login-left">
				<div className="brand-section">
					<div className="logo-container">
						<div className="logo-circle">
							<span className="logo-text">WZ</span>
						</div>
					</div>
					<h1 className="brand-title">欢迎使用</h1>
					<p className="brand-subtitle">安全、便捷的即时通讯平台</p>
					<div className="brand-features">
						<div className="feature-item">
							<div className="feature-icon">💬</div>
							<span>实时聊天</span>
						</div>
						<div className="feature-item">
							<div className="feature-icon">🔒</div>
							<span>安全加密</span>
						</div>
						<div className="feature-item">
							<div className="feature-icon">📱</div>
							<span>多端同步</span>
						</div>
					</div>
				</div>
			</div>

			{/* 分隔线 */}
			<div className="separator"></div>

			{/* 右侧表单区 */}
			<div className="login-right">
				{/* 语言切换 */}
				<div className="lang-switcher">
					<Radio.Group
						options={options}
						onChange={(events) => handleLang(events.target.value)}
						value={lang}
						size="small"
					/>
				</div>

				{isLogin ? (
					<div className="form-container">
						<div className="form-header">
							<h2>{t("login.signUp.singUpTitle")}</h2>
							<p className="form-subtitle">登录您的账户以继续</p>
						</div>
						<form onSubmit={handleLogin} className="login-form">
							<div className="input-group">
								<label>{t("login.signUp.usernamePlaceholder")}</label>
								<input
									type="text"
									name="email"
									placeholder={t("login.signUp.usernamePlaceholder")}
								/>
							</div>
							<div className="input-group">
								<label>{t("login.signUp.passwordPlaceholder")}</label>
								<input
									type="password"
									name="password"
									placeholder={t("login.signUp.passwordPlaceholder")}
								/>
							</div>
							<div className="button-box">
								<button type="submit" className="btn-primary" disabled={loginLoading}>
									{loginLoading
										? t("loading")
										: t("login.signUp.signin")}
								</button>
							</div>
							<div className="form-footer">
								<span>还没有账户？</span>
								<button
									type="button"
									className="link-button"
									onClick={() => setIsLogin(false)}
								>
									{t("login.register.signin")}
								</button>
							</div>
						</form>
					</div>
				) : (
					<div className="form-container">
						<div className="form-header">
							<h2>{t("login.register.signin")}</h2>
							<p className="form-subtitle">创建新账户，开始您的旅程</p>
						</div>
						<form action="" onSubmit={handleRegister} className="login-form">
							<div className="avatar-upload">
								<label htmlFor="file" className="avatar-label">
									<div className="avatar-preview">
										<img
											src={avatar.url ? avatar.url : "./avatar.png"}
											alt=""
										/>
										<div className="avatar-overlay">
											<span>📷</span>
										</div>
									</div>
									<span className="upload-text">{t("login.register.uploadImg")}</span>
								</label>
								<input
									type="file"
									id="file"
									style={{ display: "none" }}
									onChange={(e) => handleAvatar(e)}
									accept="image/*"
								/>
							</div>
							<div className="input-group">
								<label>{t("login.register.usernamePlaceholder")}</label>
								<input
									type="text"
									placeholder={t("login.register.usernamePlaceholder")}
									name="username"
								/>
							</div>
							<div className="input-group">
								<label>{t("login.register.emailPlaceholder")}</label>
								<input
									type="text"
									placeholder={t("login.register.emailPlaceholder")}
									name="email"
								/>
							</div>
							<div className="input-group">
								<label>{t("login.register.passwordPlaceholder")}</label>
								<input
									type="password"
									placeholder={t("login.register.passwordPlaceholder")}
									name="password"
								/>
							</div>
							<div className="button-box">
								<button
									type="button"
									className="btn-secondary"
									onClick={() => setIsLogin(true)}
									disabled={loginLoading}
								>
									{loginLoading
										? t("loading")
										: t("login.signUp.signin")}
								</button>
								<button type="submit" className="btn-primary" disabled={registerLoading}>
									{registerLoading
										? t("loading")
										: t("login.register.signin")}
								</button>
							</div>
							<div className="form-footer">
								<span>已有账户？</span>
								<button
									type="button"
									className="link-button"
									onClick={() => setIsLogin(true)}
								>
									立即登录
								</button>
							</div>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}
