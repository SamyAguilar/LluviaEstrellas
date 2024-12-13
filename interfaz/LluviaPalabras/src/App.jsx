import { useState } from 'react'
import './App.css'
import Login from './Component/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
//<<<<<<< login
    <div>
    <Login />
  </div>
//=======
    <>
    </>
//>>>>>>> Front
  )
}

export default App
