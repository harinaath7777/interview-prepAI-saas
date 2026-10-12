import React,{useState} from 'react';
import "../auth.form.scss"
import {useNavigate,Link} from "react-router";
import {useAuth} from "../hooks/useAuth.js"

const Login = () => {
  const {loading,handleLogin}=useAuth()

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState("")
  const [submitting,setSubmitting]=useState(false)

  const navigate=useNavigate();

  const handleSubmit= async(e)=>{
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const success = await handleLogin({email,password})
      if(success) {
        navigate("/")
      }
    } catch(err) {
      const msg = err.response?.data?.message || err.message || "Failed to login. Please try again."
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if(loading){
    return (<main><h1>Loading........</h1></main>)
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid #ef4444",
            color: "#fca5a5",
            padding: "0.75rem",
            borderRadius: "6px",
            marginBottom: "1rem",
            fontSize: "0.9rem"
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
            onChange={(e)=>{setEmail(e.target.value)}}
            type="email" name="email" id="email" placeholder="Enter your email" required></input>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
            onChange={(e)=>{setPassword(e.target.value)}}
            type="password" id="password" name="password" placeholder="Enter your password" required></input>
          </div>
          <button className="button primary-button" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
      </div>
    </main>
  )
}


export default Login