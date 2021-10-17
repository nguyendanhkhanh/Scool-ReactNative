import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, Image, KeyboardAvoidingView, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import MultiSelect from 'react-native-multiple-select'
import { useDispatch, useSelector } from 'react-redux'
import { getCriteria, getRegulation, getStudent } from '../api/mistake'
import { color } from '../assets/color'
import { fontSize, heightDevice, widthDevice } from '../assets/size'
import Header from '../component/Header'
import { TYPE_PICKER } from '../constant'
import { Criteria, Regulation, Student } from '../model/Mistake'
import { addClassMistake } from '../redux/action/mistake'
import { RootState } from '../redux/reducer'
import { DcpReport } from '../redux/reducer/mistake'
import { mainStyle } from './mainStyle'

const MistakeCreate = () => {
  const navigation = useNavigation()
  const dcpReport = useSelector((state: RootState) => state.mistake)
  const listRegulationApi = useSelector((state: RootState) => state.regulation)
  const listCriteria = useSelector((state: RootState) => state.criteria)
  const dispatch = useDispatch()
  const route = useRoute()
  const classInfo: any = route.params

  const [listRegulation, setListRegulation] = useState<Regulation[]>([])
  const [listStudent, setListStudent] = useState<Student[]>([])
  const [listPicker, setListPicker] = useState<any[]>([])
  const [criteria, setCriteria] = useState('')
  const [regulation, setRegulation] = useState('')
  const [regulationName, setRegulationName] = useState('')
  const [studentMistake, setStudentMistake] = useState<Student[]>([])
  const [modalType, setModalType] = useState<string | null>(null)
  const [listTest, setListTest] = useState<any[]>([])
  const [point, setPoint] = useState(0)

  useEffect(() => {
    initStudent()
  }, [])

  // useEffect(() => {
  //   if (modalType === TYPE_PICKER.CRITERIA) setListPicker(listCriteria)
  //   if (modalType === TYPE_PICKER.REGULATION && criteria !== '') {
  //     const listRegulation = listRegulationApi.filter(item => item.criteriaId === criteria)
  //     setListPicker(listRegulation)
  //   }
  //   if (modalType == TYPE_PICKER.STUDENT) setListPicker(listStudent)
  //   if (modalType === null) setListPicker([])
  // }, [modalType])

  useEffect(() => {
    if (criteria === '') setListRegulation([])
    else setListRegulation(listRegulationApi.filter(item => item.criteriaId === criteria))
  }, [criteria])

  const initStudent = async () => {
    try {
      const res: any = await getStudent(classInfo.id)
      console.log('student', res.data.students)
      setListStudent(res.data.students)
      setListTest(res.data.students.map((item: Student) => {
        return {
          name: item.name,
          id: item.id
        }
      }))
    } catch (err) {
      Alert.alert('Error')
    }
  }
  const _onSelectItem = (item: any) => {
    switch (modalType) {
      case TYPE_PICKER.CRITERIA: {
        setCriteria(item.id)
        setRegulation('')
        setRegulationName('')
      }
        break;
      case TYPE_PICKER.REGULATION: {
        setRegulation(item.id)
        setRegulationName(item.name)
        setPoint(item.point)
      }
        break;
      case TYPE_PICKER.STUDENT: {
        if (studentMistake.find(student => student.id === item.id) === undefined) {
          setStudentMistake([...studentMistake, item])
        }
      }
        break;
      default:
        break;
    }
    setModalType(null)
  }

  const _renderItemPicker = (item: any, index: number) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => _onSelectItem(item)} key={index}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  )

  const _renderModalPicker = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        statusBarTranslucent={true}
        onRequestClose={() => { }}>
        <TouchableWithoutFeedback onPress={() => setModalType(null)}>
          <View style={styles.containerModalSelection}>
            <View style={styles.wrappScrollView}>
              <ScrollView style={styles.containerContent}>
                {listPicker.map((item, index) => {
                  return _renderItemPicker(item, index)
                })}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  const deleteStudent = (student: Student) => {
    const newStudentMistake = studentMistake.filter(item => item.id !== student.id)
    setStudentMistake(newStudentMistake)
  }

  const _renderStudentList = (item: Student, index: number) => {
    console.log()
    return (
      <View style={styles.student} key={index}>
        <Text style={styles.studentName}>{item.name}</Text>
        <TouchableOpacity onPress={() => deleteStudent(item)}>
          <Image source={require('../assets/icon/delete-student.png')} />
        </TouchableOpacity>
      </View>
    )
  }

  const addNewMistake = () => {
    if (regulation === '') return Alert.alert('Thông báo', 'Vui lòng chọn vi phạm')
    const mistake = {
      regulationId: regulation,
      relatedStudentIds: studentMistake,
    }
    const newDcpReport: DcpReport = JSON.parse(JSON.stringify(dcpReport))
    const classMistake: any = newDcpReport.dcpClassReports.find(item => item.classId === classInfo.id)
    const indexClassMistake = newDcpReport.dcpClassReports.findIndex(item => item.classId === classInfo.id)
    classMistake.faults = [...classMistake.faults, mistake]
    const newDcpClassReports = newDcpReport.dcpClassReports
    newDcpClassReports[indexClassMistake] = classMistake
    newDcpReport.dcpClassReports = newDcpClassReports
    dispatch(addClassMistake(newDcpReport))
    navigation.goBack()
  }

  const onSelectStudentChange = (e: any) => {
    setStudentMistake(e)
  }

  const onSelectCriteria = (e: any) => {
    setCriteria(e[0])
  }

  const onSelectRegulation = (e: any) => {
    setRegulation(e[0])
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Thêm vi phạm" />
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>




          {/* <View style={styles.studentContainer}> */}
          {/* <TouchableOpacity
              onPress={() => setModalType(TYPE_PICKER.STUDENT)}
              style={styles.studentButton}>
              <Text style={styles.criteriaName}>{'Học sinh vi phạm'}</Text>
              <Image source={require('../assets/icon/next.png')} style={styles.iconNext} />
            </TouchableOpacity>
            <View style={styles.studentList}>
              {studentMistake.map((item, index) => _renderStudentList(item, index))}
            </View> */}
          <MultiSelect
            items={listStudent}
            uniqueKey='id'
            styleMainWrapper={styles.studentContainer}
            onSelectedItemsChange={onSelectStudentChange}
            selectedItems={studentMistake}
            selectText='Học sinh vi phạm'
            searchInputPlaceholderText='Tên học sinh'
            styleTextDropdown={styles.criteriaName}
            styleTextDropdownSelected={styles.criteriaName}
            onChangeInput={(text) => console.warn(text)}
            tagRemoveIconColor='gray'
            tagBorderColor='gray'
            tagTextColor='black'
            selectedItemTextColor='red'
            selectedItemIconColor='red'
            itemTextColor='#000'
            displayKey='name'
            submitButtonColor='#CCC'
            submitButtonText='Submit'
            searchInputStyle={{ fontSize: fontSize.contentSmall }}
          />
          {/* </View> */}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => addNewMistake()}
        style={[mainStyle.buttonContainer, styles.buttonAdd]}>
        <Text style={mainStyle.buttonTitle}>Thêm vi phạm</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    alignItems: 'center',
    height: heightDevice
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  contentContainer: {
    flex: 1,
  },
  criteria: {
    marginTop: '15%',
    width: widthDevice * 80 / 100,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 0.5,
    paddingLeft: 15,
    paddingRight: 5,
  },
  criteriaName: {
    fontSize: fontSize.contentSmall,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 0
  },
  iconNext: {

  },
  studentList: {
    flex: 1,
    alignItems: 'flex-start',
  },
  studentContainer: {
    marginTop: '15%',
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 0.5,
    paddingLeft: 15,
    paddingRight: 5,
    width: widthDevice * 80 / 100,
    minHeight: 160
  },
  studentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentName: {
    fontSize: fontSize.contentSmall,
    marginRight: 5
  },
  student: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.border,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 5,
  },
  containerModalSelection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.blackOpacity,
  },
  wrappScrollView: {
    maxHeight: '70%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerContent: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 5,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
    alignItems: 'center'
  },
  buttonAdd: {
    backgroundColor: color.blueStrong,
    marginBottom: 20,
    position: 'absolute',
    top: heightDevice - 70
  }
})

export default MistakeCreate