import { View, StyleSheet } from "react-native"
import GoogleSigninButton from './Auth.native'

export default function Auth() {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <GoogleSigninButton />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 150,
    width: '100%',
    alignItems: 'center',
  }
});
