import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export function useUser() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load on first mount
    async function loadUser() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        await loadOrCreateProfile(user)
      }

      setLoading(false)
    }

    loadUser()

    // Listen for login/logout
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user)
          await loadOrCreateProfile(session.user)
        } else if (event === "SIGNED_OUT") {
          setUser(null)
          setProfile(null)
        }
      }
    )

    return () => subscription.subscription.unsubscribe()
  }, [])

  async function loadOrCreateProfile(user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (error) {
      console.error("Profile fetch error:", error.message)
      return
    }

    if (!data) {
      // First login → create profile
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name || user.user_metadata.name || "",
        role: "user",
      })

      if (insertError) {
        console.error("Profile insert error:", insertError.message)
      } else {
        setProfile({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata.full_name || user.user_metadata.name || "",
          role: "user",
        })
      }
    } else {
      setProfile(data)
    }
  }

  return { user, profile, loading }
}
