import Chart from "./components/chart";
import List from "./components/list";
import Detial from "./components/detial";
import Login from "./components/login";
import Notification from "./components/notification";
import "./lang/i18n.config";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";

const App = () => {
	const user = false;
	useEffect(() => {
		const unSub = onAuthStateChanged(auth, (user) => {
			console.log(user);
		});
		return () => {
			unSub();
		};
	});
	return (
		<div className="container">
			{user ? (
				<>
					<List />
					<Chart />
					<Detial />
				</>
			) : (
				<Login />
			)}
			<Notification></Notification>
		</div>
	);
};

export default App;
