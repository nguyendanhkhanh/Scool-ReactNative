import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { getCriteria, getRegulation, getStudent } from '../api/mistake'
import { color } from '../assets/color'
import { fontSize, widthDevice } from '../assets/size'
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
  const dispatch = useDispatch()
  const route = useRoute()
  const { classInfo, fault, indexFault }: any = route.params

  const [listCriteria, setListCriteria] = useState<Criteria[]>([])
  const [listRegulationApi, setListRegulationApi] = useState<Regulation[]>([])
  const [listStudent, setListStudent] = useState<Student[]>([])
  const [listPicker, setListPicker] = useState<any[]>([])
  const [criteria, setCriteria] = useState('')
  const [regulation, setRegulation] = useState(fault.regulationId)
  const [regulationName, setRegulationName] = useState(fault.regulationName)
  const [studentMistake, setStudentMistake] = useState<Student[]>(fault.relatedStudentIds)
  const [modalType, setModalType] = useState<string | null>(null)
  const [point, setPoint] = useState(fault.point)
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    initCriteria()
    initRegulation()
    initStudent()
  }, [])

  useEffect(() => {
    if (modalType === TYPE_PICKER.CRITERIA) setListPicker(listCriteria)
    if (modalType === TYPE_PICKER.REGULATION && criteria !== '') {
      const listRegulation = listRegulationApi.filter(item => item.criteriaId === criteria)
      setListPicker(listRegulation)
    }
    if (modalType == TYPE_PICKER.STUDENT) setListPicker(listStudent)
    if (modalType === null) setListPicker([])
  }, [modalType])

  const initCriteria = async () => {
    try {
      const res: any = await getCriteria()
      setListCriteria(res.data.items)
    } catch (error) {
      Alert.alert('Error')
    }
  }

  const initRegulation = async () => {
    try {
      const res: any = await getRegulation()
      console.log(res.data)
      setListRegulationApi(res.data.items)
      const criteriaId = res.data.items.find((item: Regulation) => item.id === fault.regulationId).criteriaId
      setCriteria(criteriaId)
      console.log(criteriaId)
    } catch (err) {
      Alert.alert('Error')
    }
  }

  const initStudent = async () => {
    try {
      const res: any = await getStudent(classInfo.id)
      console.log('error2', classInfo)
      console.log('student', res.data.students)
      setListStudent(res.data.students)
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
        <TouchableOpacity
          disabled={!isEdit}
          onPress={() => deleteStudent(item)}>
          <Image source={require('../assets/icon/delete-student.png')} />
        </TouchableOpacity>
      </View>
    )
  }

  const editMistake = () => {
    if (!isEdit) return setIsEdit(true)
    if (regulation === '') return Alert.alert('Thông báo', 'Vui lòng chọn vi phạm')
    const mistake = {
      regulationId: regulation,
      regulationName: regulationName,
      relatedStudentIds: studentMistake,
      point: point
    }
    const newDcpReport: DcpReport = JSON.parse(JSON.stringify(dcpReport))
    const classMistake: any = newDcpReport.dcpClassReports.find(item => item.classId === classInfo.id)
    const indexClassMistake = newDcpReport.dcpClassReports.findIndex(item => item.classId === classInfo.id)
    classMistake.faults.splice(indexFault, 1, mistake)
    const newDcpClassReports = newDcpReport.dcpClassReports
    newDcpClassReports[indexClassMistake] = classMistake
    newDcpReport.dcpClassReports = newDcpClassReports
    dispatch(addClassMistake(newDcpReport))
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Chi tiết vi phạm" />
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <TouchableOpacity
            disabled={!isEdit}
            onPress={() => setModalType(TYPE_PICKER.CRITERIA)}
            style={styles.criteria}>
            <Text style={styles.criteriaName}>{criteria !== '' ? listCriteria.find(item => item.id === criteria)?.name : 'Tiêu chí'}</Text>
            <Image source={require('../assets/icon/next.png')} style={styles.iconNext} />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!isEdit}
            onPress={() => setModalType(TYPE_PICKER.REGULATION)}
            style={styles.criteria}>
            <Text style={styles.criteriaName}>{regulation !== '' ? listRegulationApi.find(item => item.id === regulation)?.name : 'Tên vi phạm'}</Text>
            <Image source={require('../assets/icon/next.png')} style={styles.iconNext} />
          </TouchableOpacity>

          <View style={styles.studentContainer}>
            <TouchableOpacity
              disabled={!isEdit}
              onPress={() => setModalType(TYPE_PICKER.STUDENT)}
              style={styles.studentButton}>
              <Text style={styles.criteriaName}>{'Học sinh vi phạm'}</Text>
              <Image source={require('../assets/icon/next.png')} style={styles.iconNext} />
            </TouchableOpacity>
            <View style={styles.studentList}>
              {studentMistake.map((item, index) => _renderStudentList(item, index))}
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => editMistake()}
          style={[mainStyle.buttonContainer, styles.buttonAdd]}>
          <Text style={mainStyle.buttonTitle}>{isEdit ? 'Hoàn thành' : 'Cập nhật'}</Text>
        </TouchableOpacity>
      </View>
      {listPicker.length > 1 && _renderModalPicker()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    alignItems: 'center'
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15
  },
  criteriaName: {
    fontSize: fontSize.content,
    fontWeight: 'bold',
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
    borderRadius: 15,
    borderWidth: 0.5,
    padding: 15,
    minHeight: '25%'
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
    marginBottom: 20
  }
})

export default MistakeCreate