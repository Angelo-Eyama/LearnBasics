import { useState } from "react";
import { readRoot } from "./client";

function App() {
	const [message, setMessage] = useState("Sin mensaje");

	const handleReadRoot = async () => {
		const response = await readRoot();
		const data = response.data?.message;
		if (data) {
			setMessage(data);
		}
	};
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1>React App</h1>
			<button
				type="button"
				onClick={handleReadRoot}
				className="text-white bg-black p-3 rounded-md cursor-pointer active:scale-95 hover:shadow-lg hover:bg-gray-800"
			>
				Haz clic!
			</button>

			<h2 className="bg-amber-600 w-1/4 p-2 m-4 text-center">{message}</h2>
		</div>
	);
}
export default App;
