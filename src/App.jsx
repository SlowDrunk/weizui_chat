import Chart from "./components/chart";
import List from "./components/list";
import Detial from "./components/detial";
import Login from "./components/login";
import Notification from "./components/notification";
import "./lang/i18n.config";

const App = () => {
	
	const user = true;
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
