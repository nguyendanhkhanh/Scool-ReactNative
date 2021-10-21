import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Image, SafeAreaView, StyleSheet, View, Text } from 'react-native'
import { fontSize, widthDevice } from '../assets/size'
import HeaderHome from '../component/HeaderMain'

const UserScreen = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={styles.container}>
      <HeaderHome title="Thông tin tài khoản" />
      <View style={styles.mainContainer}>
        <View style={styles.user}>
          <Image source={require('../assets/icon/user-photo.png')} />
          <View style={styles.contentContainer}>
            <View style={styles.lineContainer}>
              <Text style={styles.contentTitle}>Tên</Text>
              <Text style={styles.content}>Tên</Text>
            </View>
            <View style={styles.lineContainer}>
              <Text style={styles.contentTitle}>Tên</Text>
              <Text style={styles.content}>Tên</Text>
            </View>
            <View style={styles.lineContainer}>
              <Text style={styles.contentTitle}>Tên</Text>
              <Text style={styles.content}>Tên</Text>
            </View>

          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  mainContainer: {
    flex: 1,
  },
  user: {
    flexDirection: 'row',
    width: widthDevice * 80 / 100,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 35

  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  lineContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 15
  },
  contentTitle: {
    fontWeight: 'bold',
    fontSize: fontSize.contentSmall
  },
  content: {
    fontSize: fontSize.contentSmall
  }

});

export default UserScreen