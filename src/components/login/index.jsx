import React, { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
export default function Login() {
	const { t } = useTranslation();
	const [avatar, setAvatar] = useState({
		file: null,
		url: "",
	});

	const handleAvatar = (e) => {
		if (e.target.files[0]) {
			setAvatar({
				file: e.target.files[0],
				url: URL.createObjectURL(e.target.files[0]),
			});
		}
	};

	const handleLogin = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		toast.warn("");
	};
	return (
		<div className="login">
			<div className="item">
				<h2>欢迎回来！</h2>
				<form onSubmit={handleLogin}>
					<input type="text" placeholder={t('login.signUp.usernamePlaceholder')} />
					<input type="password" placeholder={t('login.signUp.passwordPlaceholder')} />
					<button>{t('login.signUp.signin')}</button>
				</form>
			</div>
			<div className="separator"></div>
			<div className="item">
				<h2>{t('login.signUp.singUpTitle')}</h2>
				<form action="">
					<label htmlFor="file">
						<img
							src={avatar.url ? avatar.url : "./avatar.png"}
							alt=""
						/>
						{t('login.register.uploadImg')}
					</label>
					<input
						type="file"
						id="file"
						style={{ display: "none" }}
						onChange={(e) => handleAvatar(e)}
					/>
					<input type="text" placeholder={t('login.register.usernamePlaceholder')} name="username" />
					<input type="text" placeholder={t('login.register.emailPlaceholder')} name="email" />
					<input type="password" placeholder={t('login.register.passwordPlaceholder')} name="password" />
					<button>{t('login.register.signin')}</button>
				</form>
			</div>
		</div>
	);
}
