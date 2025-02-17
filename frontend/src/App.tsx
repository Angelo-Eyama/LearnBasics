import { useState } from 'react'
import { readRoot } from './client'

function App() {
  const [message, setMessage] = useState('Sin mensaje')

  const handleReadRoot = async () => {
    const response = await readRoot()
    const data = (response.data as { message: string }).message
    setMessage(data)
  }
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1>React App</h1>
      <button type="button" onClick={handleReadRoot} className="inline-flex h-12 items-center justify-center rounded-md bg-neutral-950 px-6 font-medium text-neutral-50 shadow-lg shadow-neutral-500/20 transition active:scale-95">Click me</button>

      <h2 className='bg-amber-600 w-1/4 p-2 m-4 text-center' >{message}</h2>
    </div>
  )

}
export default App
