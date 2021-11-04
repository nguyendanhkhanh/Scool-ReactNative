import { DcpReport } from "../redux/reducer/mistake"
import { getApiService } from "./BaseApiService"

export const getCriteria = async () => {
    const endpoint = `/api/app/criteria/simple-list`
    const axios = await getApiService()
    return axios.get(endpoint)
}

export const getRegulation = async () => {
    const endpoint = `/api/app/regulation/simple-list`
    const axios = await getApiService()
    return axios.get(endpoint)
}

export const getStudent = async (classId: string) => {
    const endpoint = `/api/app/classes/${classId}`
    const axios = await getApiService()
    return axios.get(endpoint)
}

export const postDcpReport = async (params: DcpReport) => {
    const endpoint = `​/api/app/dcp-reports`
    const axios = await getApiService()
    return axios.post(endpoint, params)
}