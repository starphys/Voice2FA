import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from '../pages/Home'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Logout from '../pages/Logout'

function App () {
  const [userToken, setUserToken] = useState({})

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<Register loginFunction={(id) => setUserToken({ id })} />} />
        <Route path='/login' element={<Login loginFunction={(id) => setUserToken({ id })} />} />
        <Route path='/logout' element={<Logout userToken={userToken} logoutFunction={() => setUserToken({})} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
