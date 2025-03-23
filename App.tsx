import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'
import Auth from './components/Auth'
import Account from './components/Account'
import { View, StyleSheet } from 'react-native'
import { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <View style={styles.container}>
      {session && session.user ? <Account /> : <Auth />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  }
});
