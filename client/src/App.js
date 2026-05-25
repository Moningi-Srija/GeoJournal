import Map from './components/Map'
import Login from './components/Login'
import Register from './components/Register'
import { useState } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [showRegister, setShowRegister] = useState(false)
  if(token){
    return (
      <div>
        <Map setToken={setToken}/>
      </div>
    );
  }
  else{
    if(showRegister){
      return(
        <div>
          <Register setToken={setToken} setShowRegister={setShowRegister}/>
        </div>
      )
    }
    else{
      return(
        <div>
          <Login setToken={setToken} setShowRegister={setShowRegister}/>
        </div>
      )
    }
  }
}

export default App;
