import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { color } from '../assets/color'
import { fontSize } from '../assets/size'
import HeaderHome from '../component/HeaderMain'

const HomeScreen = () => {
  const navigation = useNavigation()

  const _renderItem = () => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.dateTime}>{`Phiếu chấm ngày ${'2021'}`}</Text>
          <View style={styles.line2Container}>
            <View style={styles.timeContainer}>
              <Image source={require('../assets/icon/clock.png')} />
              <Text style={styles.line2Content}>{`07:15 AM`}</Text>
            </View>
            <View style={styles.statusContainer}>
              <Image source={require('../assets/icon/status.png')} />
              <Text style={[styles.line2Content, { color: 'red' }]}>{`Đã duyệt`}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <TouchableOpacity
          // onPress={() => removeMistake(index)}
          >
            <Image source={require('../assets/icon/remove.png')} style={styles.iconRemove} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderHome title="Lịch sử chấm" />
      <ScrollView>
        {_renderItem()}
        {_renderItem()}
        {_renderItem()}
        {_renderItem()}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background
  },
  iconRemove: {
    tintColor: 'gray',
    width: 26,
    height: 26,
    marginRight: 5
  },
  itemContainer: {
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: '10%',
    marginTop: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: 15,
    paddingVertical: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1
  },
  dateTime: {
    fontSize: fontSize.content,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5
  },
  line2Container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: 10
  },
  line2Content: {
    fontSize: fontSize.contentSmall,
    marginLeft: 8
  },
  timeContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  }
});

export default HomeScreen