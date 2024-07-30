import Chart from "./components/chart";
import List from "./components/list";
import Detial from "./components/detial";
import Login from "./components/login";
import Notification from "./components/notification";
import "./lang/i18n.config";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { useTranslation } from "react-i18next";

const App = () => {
	const { currentUser, isLoading, fetchUserInfo } = useUserStore();
	const { chatId } = useChatStore();
	const { t } = useTranslation();
	useEffect(() => {
		const unSub = onAuthStateChanged(auth, (user) => {
			fetchUserInfo(user?.uid);
		});
		if (localStorage.getItem("lang")) {
			localStorage.setItem("lang", localStorage.getItem("lang"));
		}
		return () => {
			unSub();
			localStorage.removeItem("lang");
		};
	}, [fetchUserInfo]);
	// 加载页
	if (isLoading) return <div className="loading">{t("loading")}</div>;

	return (
		<div className="container">
			{currentUser ? (
				<>
					<List />
					{chatId && <Chart />}
					{chatId && <Detial />}
				</>
			) : (
				<Login />
			)}
			<Notification></Notification>
		</div>
	);
};

export default App;
