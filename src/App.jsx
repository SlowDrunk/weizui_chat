import Chart from "./components/chart";
import List from "./components/list";
import Detial from "./components/detial";
import Login from "./components/login";
import Notification from "./components/notification";
import "./lang/i18n.config";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { useTranslation } from "react-i18next";
import { LangContext } from "./lib/useLang";

const App = () => {
	const { currentUser, isLoading, fetchUserInfo } = useUserStore();
	const { chatId } = useChatStore();
	const { t, i18n } = useTranslation();
	const [lang, setLang] = useState(localStorage.getItem("lang") || "zh");
	useEffect(() => {
		const unSub = onAuthStateChanged(auth, (user) => {
			fetchUserInfo(user?.uid);
		});
		i18n.changeLanguage(lang);
		return () => {
			unSub();
		};
	}, [fetchUserInfo, lang]);

	// 加载页
	if (isLoading) return <div className="loading">{t("loading")}</div>;

	const handleLang = (langStr) => {
		setLang(langStr);
		i18n.changeLanguage(langStr);
		localStorage.setItem("lang", langStr);
	};
	return (
		<div className="container">
			{currentUser ? (
				<LangContext.Provider value={{ lang, handleLang }}>
					<>
						<List />
						{chatId && <Chart />}
						{chatId && <Detial />}
					</>
				</LangContext.Provider>
			) : (
				<LangContext.Provider value={{ lang, handleLang }}>
					<Login />
				</LangContext.Provider>
			)}
			<Notification></Notification>
		</div>
	);
};

export default App;
