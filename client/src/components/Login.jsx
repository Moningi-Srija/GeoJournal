import {useState} from 'react'
import axios from 'axios'

function Login({setToken, setShowRegister}){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        axios.post(process.env.REACT_APP_API_URL + '/api/auth/login', {email, password}).then(response=>{
            localStorage.setItem('token', response.data.token)
            setToken(response.data.token)
        })
    }

    return(
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">🗺️ GeoJournal</h1>
                    <p className="text-blue-200 text-sm">Your world, pinned.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-blue-200 text-sm font-medium block mb-1">Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e)=>{setEmail(e.target.value)}}
                            placeholder="you@example.com"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="text-blue-200 text-sm font-medium block mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(p)=>{setPassword(p.target.value)}}
                            placeholder="••••••••"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-white/50 text-sm mt-6">
                    Don't have an account?{' '}
                    <button
                        type='button'
                        onClick={()=>{setShowRegister(true)}}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Login
