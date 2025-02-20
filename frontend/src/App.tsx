import { useState } from 'react';
import { Editor } from './components/Editor';
import { OutputPanel } from './components/OutputPanel';
import { LuCodesandbox, RiJavascriptLine, FaPython, TbBrandCpp, FaPlay } from './components/Icons';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { languageExtensions } from './components/constants';

const DEFAULT_CODE = languageExtensions['python'][1];

function App() {
	const [language, setLanguage] = useState('python')
	const [output, setOutput] = useState('')
	const [code, setCode] = useState(DEFAULT_CODE)
	const [theme, setTheme] = useState(vscodeDark)
	const [extension, setExtension] = useState(languageExtensions[language][0])
	const handleClear = () => setCode('')
	const handleReset = () => setCode(DEFAULT_CODE)
	const handleTheme = () => setTheme(theme === vscodeDark ? vscodeLight : vscodeDark)
	const handleLanguage = (newLanguage: string) => {
		const newExtension = languageExtensions[newLanguage][0];
		const newCode = languageExtensions[newLanguage][1];
		setCode(newCode ? newCode : DEFAULT_CODE);
		setLanguage(newLanguage);
		setExtension(newExtension);
	}
	const handleSend = (code: string, language: string) => {
		fetch('http://localhost:8000/code', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code, language }),
		})
			.then(response => response.json())
			.then(data => {
				// First, we need to check if there's an error in the response
				// If there is, we'll set the output to the error message
				// Otherwise, we'll set the output to the actual output
				if (data.error) {
					setOutput(data.error)
					return
				}
				setOutput(data.output)
			})
			.catch((error) => {
				if (error.message === 'Failed to fetch') {
					setOutput('Servidor no disponible actualmente...');
				} else {
					setOutput(error.message);
				}
			});
	}


	return (
		<div className=" bg-gray-950 text-white p-4">
			<div className="mx-auto">

				<header className='mb-4'>
					<div className="flex items-center gap-3 mb-4">
						<h1 className="flex gap-2 text-3xl font-bold"> <LuCodesandbox /> Code Editor</h1>
					</div>
					<button
						onClick={handleTheme}
						className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
						Change Theme
					</button>

					<div className="flex items-center gap-5 mb-4 mt-4">
						<h2 className="text-xl font-semibold">Language:</h2>
						<RiJavascriptLine
							onClick={() => handleLanguage('javascript')}
							className='h-10 hover:h-14 w-auto hover:shadow-dark hover:cursor-pointer rounded-full transition-all duration-300 ease-in-out'
						/>

						<FaPython
							onClick={() => handleLanguage('python')}
							className='h-10 hover:h-14 w-auto hover:shadow-dark hover:cursor-pointer rounded-full transition-all duration-300 ease-in-out'
						/>
						<TbBrandCpp
							onClick={() => handleLanguage('c')}
							className='h-10 hover:h-14 w-auto hover:shadow-dark hover:cursor-pointer rounded-full transition-all duration-300 ease-in-out'
						/>
					</div>
				</header>

				<main className='space-y-4'>
					<div className='bg-gray-900 rounded-lg p-4'>
						<Editor code={code} extension={extension} language={language} theme={theme} onChange={setCode} />
					</div>

					<div className="flex justify gap-4">
						<button
							onClick={() => handleSend(code, language)}
							className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
						>
							<FaPlay />  Send
						</button>
						<button
							onClick={handleReset}
							className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
						>
							Reset
						</button>

						<button
							onClick={handleClear}
							className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
						>
							Clear
						</button>

					</div>

					<div className="mt-6">
						<OutputPanel output={output} />
					</div>

				</main>
			</div>
		</div>

	)
}

export default App
