"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  // Get session on load
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()

      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // SIGN UP
  const signUp = async () => {
    setMessage("Signing up...")

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setMessage("❌ " + error.message)
    } else {
      setMessage("✅ Check your email (or auto logged in if disabled confirmation)")
    }
  }

  // LOGIN
  const signIn = async () => {
    setMessage("Logging in...")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setMessage("❌ " + error.message)
    } else {
      setMessage("✅ Logged in!")
    }
  }

  // LOGOUT
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  // LOADING
  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>
  }

  // LOGGED IN VIEW
  if (user) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Welcome 👋</h1>
        <p>Logged in as:</p>
        <p><b>{user.email}</b></p>

        <button onClick={signOut}>Logout</button>

        <hr />

        <p>Now you're ready for communities 🚀</p>
      </div>
    )
  }

  // LOGGED OUT VIEW
  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={signUp} style={{ marginRight: 10 }}>
        Sign Up
      </button>

      <button onClick={signIn}>
        Log In
      </button>

      <p>{message}</p>
    </div>
  )
}