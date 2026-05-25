/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import axios from 'axios'
import {jwtDecode} from 'jwt-decode'

const API = process.env.REACT_APP_API_URL

function Friends({ isOpen, setIsOpen, setMapRefresh }){
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [sentRequests, setSentRequests] = useState([])
    const [receivedRequests, setReceivedRequests] = useState([])
    const [refresh, setRefresh] = useState(false)
    const token = localStorage.getItem('token')
    const my_id = jwtDecode(token).id

    useEffect(()=>{
        axios.get(`${API}/api/friends/requests/sent`, {headers:{Authorization:`Bearer ${token}`}}).then(response=>{setSentRequests(response.data)})
        axios.get(`${API}/api/friends/requests/received`, {headers:{Authorization:`Bearer ${token}`}}).then(response=>{setReceivedRequests(response.data)})
    }, [token, refresh])

    const handleSearch = async(e)=>{
        setSearchQuery(e.target.value)
        axios.get(`${API}/api/users/search?q=${e.target.value}`, {headers:{Authorization:`Bearer ${token}`}}).then(response=>{setSearchResults(response.data)})
    }

    const handleSendRequest = async(user_id)=>{
        axios.post(`${API}/api/friends/request`, {addressee_id:user_id}, {headers:{Authorization:`Bearer ${token}`}})
        .then(()=>setRefresh(prev=>!prev))
        .catch((err)=>console.error('Friend request failed:', err.response?.data?.message))
    }

    const handleAccept = async(user_id)=>{
        axios.put(`${API}/api/friends/${user_id}/accept`, {}, {headers:{Authorization:`Bearer ${token}`}})
        .then(()=>{
            setRefresh(prev=>!prev)
            setMapRefresh(prev=>!prev)
        })
        .catch((err)=>console.error('Accept failed:', err.response?.data?.message))
    }

    const handleDelete = async(user_id)=>{
        axios.delete(`${API}/api/friends/${user_id}`, {headers:{Authorization:`Bearer ${token}`}}).then(()=>setRefresh(prev=>!prev))
    }

    return(
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-[998]"
                    onClick={()=>setIsOpen(false)}
                />
            )}

            {/* Side Panel */}
            <div className={`fixed top-0 left-0 h-full w-80 bg-slate-900/95 backdrop-blur border-r border-white/10 shadow-2xl z-[999] transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <h2 className="text-white font-semibold text-lg">👥 Friends</h2>
                    <button
                        type="button"
                        onClick={()=>setIsOpen(false)}
                        className="text-white/50 hover:text-white text-xl transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

                    {/* Search */}
                    <div>
                        <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Find People</p>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Search by username..."
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-400"
                        />

                        {searchResults.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {searchResults.filter(user => user.id !== my_id).map(user => (
                                    <div key={user.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                                        <span className="text-white text-sm">@{user.username}</span>
                                        <button
                                            type="button"
                                            onClick={()=>handleSendRequest(user.id)}
                                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Received Requests */}
                    {receivedRequests.length > 0 && (
                        <div>
                            <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Requests Received</p>
                            <div className="space-y-2">
                                {receivedRequests.map(user=>(
                                    <div key={user.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                                        <span className="text-white text-sm">@{user.username}</span>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={()=>handleAccept(user.id)}
                                                className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full transition-colors"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                type="button"
                                                onClick={()=>handleDelete(user.id)}
                                                className="text-xs bg-red-500/70 hover:bg-red-600 text-white px-3 py-1 rounded-full transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sent Requests */}
                    {sentRequests.length > 0 && (
                        <div>
                            <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Requests Sent</p>
                            <div className="space-y-2">
                                {sentRequests.map(user=>(
                                    <div key={user.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                                        <span className="text-white text-sm">@{user.username}</span>
                                        <button
                                            type="button"
                                            onClick={()=>handleDelete(user.id)}
                                            className="text-xs bg-white/10 hover:bg-white/20 text-white/70 px-3 py-1 rounded-full transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {receivedRequests.length === 0 && sentRequests.length === 0 && (
                        <p className="text-white/30 text-sm text-center pt-4">No pending requests</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default Friends
