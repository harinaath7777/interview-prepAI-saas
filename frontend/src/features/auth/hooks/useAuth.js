import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx"
import { login, register, logout } from "../services/auth.api"

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        try {
            const data = await login({ email, password })
            if (data && data.user) {
                setUser(data.user)
                return true
            }
            return false
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        try {
            const data = await register({ username, email, password })
            if (data && data.user) {
                setUser(data.user)
                return true
            }
            return false
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.error(err)
        }
    }

    return { user, loading, handleRegister, handleLogin, handleLogout }
}