import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../utils/supabase';
import { Session } from '@supabase/supabase-js';
import { fetch } from 'expo/fetch';

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Get user details
        getUserDetails(session);
      } else {
        setLoading(false);
      }
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          getUserDetails(session);
        } else {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getUserDetails = async (session: Session) => {
    try {
      setLoading(true);

      await fetch('http://192.168.1.199:3000', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      })

      // Get user info from auth
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      setUserDetails(data.user);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Not signed in</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>User Profile</Text>
        </View>

        <View style={styles.profileSection}>
          {userDetails?.user_metadata?.avatar_url ? (
            <Image
              source={{ uri: userDetails.user_metadata.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarLetter}>
                {userDetails?.email?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}

          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {userDetails?.user_metadata?.full_name || userDetails?.email?.split('@')[0] || 'User'}
            </Text>
            <Text style={styles.email}>{userDetails?.email}</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <DetailItem label="User ID" value={userDetails?.id} />
          {userDetails?.user_metadata?.name && (
            <DetailItem label="Name" value={userDetails.user_metadata.name} />
          )}
          <DetailItem label="Provider" value={userDetails?.app_metadata?.provider || 'Unknown'} />
          <DetailItem
            label="Email Verified"
            value={userDetails?.email_confirmed_at ? 'Yes' : 'No'}
          />
          <DetailItem
            label="Created"
            value={userDetails?.created_at ? new Date(userDetails.created_at).toLocaleDateString() : 'Unknown'}
          />
          <DetailItem
            label="Last Sign In"
            value={userDetails?.last_sign_in_at ? new Date(userDetails.last_sign_in_at).toLocaleDateString() : 'Unknown'}
          />
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Helper component for displaying user details
const DetailItem = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e2e8f0',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  nameContainer: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  email: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  detailsSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    width: 120,
  },
  detailValue: {
    fontSize: 15,
    color: '#0f172a',
    flex: 1,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#64748b',
  },
  signOutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
