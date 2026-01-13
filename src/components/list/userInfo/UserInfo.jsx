import React from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import { useState } from "react";
import UpdateUser from "./updateUser";
import { Dropdown, Space, Switch } from "antd";
import { LogoutOutlined, BulbOutlined, MoonOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { auth } from "../../../lib/firebase";
import { LangContext } from "../../../lib/useLang";
import { useContext } from "react";
import { useThemeStore } from "../../../lib/themeStore";

export default function UserInfo() {
	const { t } = useTranslation();
	const { currentUser } = useUserStore();
	const [updateUser, setUpdateUser] = useState(false);
	const { lang, handleLang } = useContext(LangContext);
	const { theme, toggleTheme } = useThemeStore();

	const items = [
		{
			key: "1",
			label: (
				<div className="set-lang">
					<span style={{ marginRight: "16px" }}>
						{t("userInfo.chatSeting")}
					</span>
					<Space direction="vertical">
						<Switch
							checkedChildren="中文"
							unCheckedChildren="english"
							defaultChecked={lang === "zh" ? true : false}
							onChange={(val) => handleLang(val ? "zh" : "en")}
						/>
					</Space>
				</div>
			),
		},
		{
			key: "2",
			label: (
				<div className="set-lang">
					<span style={{ marginRight: "16px" }}>
						{theme === "light" ? "深色模式" : "浅色模式"}
					</span>
					<Space direction="vertical">
						<Switch
							checkedChildren={<MoonOutlined />}
							unCheckedChildren={<BulbOutlined />}
							checked={theme === "dark"}
							onChange={toggleTheme}
						/>
					</Space>
				</div>
			),
		},
		{
			key: "3",
			label: (
				<div className="set-lang" onClick={() => auth.signOut()}>
					<Space direction="vertical" style={{ marginRight: "16px" }}>
						<span>{t("userInfo.loginOut")}</span>
					</Space>
					<span>
						<LogoutOutlined />
					</span>
				</div>
			),
		},
	];

	return (
		<div className="userInfo">
			<div className="user" onClick={() => setUpdateUser((pre) => !pre)}>
				<img
					src={
						currentUser.avatar ? currentUser.avatar : "./avatar.png"
					}
					alt=""
				/>
				<h2>{currentUser.username}</h2>
			</div>
			<div className="icons">
				<Dropdown menu={{ items }}>
					<Space>
						<img className="icon" src="./more.png" alt="" />
					</Space>
				</Dropdown>
				<img
					className="icon"
					src="./edit.png"
					alt=""
					onClick={() => setUpdateUser((pre) => !pre)}
				/>
			</div>
			{updateUser && <UpdateUser setUpdateUser={setUpdateUser} />}
		</div>
	);
}
