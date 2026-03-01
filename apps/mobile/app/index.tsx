/**
 * Home Screen
 */
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useSupabase } from '../lib/supabase-provider'
import { useAuth } from '@integratewise/supabase'

export default function HomeScreen() {
  const router = useRouter()
  const client = useSupabase()
  const { user, profile, loading } = useAuth(client)

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>IntegrateWise</Text>
        <Text style={styles.subtitle}>Your AI-powered OS</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {profile?.full_name || user.email}</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/workspace')}
      >
        <Text style={styles.buttonText}>Open Workspace</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push('/cognitive')}
      >
        <Text style={styles.buttonText}>AI Assistant</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D4A7C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#2D4A7C',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#4A6FA5',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
