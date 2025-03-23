import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { supabase } from '../utils/supabase'
import { View, StyleSheet } from 'react-native'

export default function () {
  GoogleSignin.configure({
    iosClientId: '751950355153-hoep497to32kd2qhd79uo3cllkr4jrrs.apps.googleusercontent.com',
    webClientId: '751950355153-hqtudcuf6ssjdjeluq841us6n5q636kb.apps.googleusercontent.com'
  })

  return (
    <View style={styles.buttonWrapper}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={async () => {
          try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            if (userInfo?.data?.idToken) {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: userInfo.data.idToken,
              })
              if(error) {
                console.error(error)
              }

            } else {
              throw new Error('no ID token present!')
            }
          } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
          }
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
