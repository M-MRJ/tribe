"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Home() {
  const [status, setStatus] = useState("testing...")

  useEffect(() => {
    const run = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setStatus("❌ ERROR: " + error.message)
      } else {
        setStatus("✅ Supabase is connected")
      }
    }

    run()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>{status}</h1>
    </div>
  )
}