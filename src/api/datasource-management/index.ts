import { request } from "@/utils/service"
import type * as DatasourceManagement from "./types/datasource-management"

/** 查询所有采集程序 */
export function getAllSpidersApi(params: DatasourceManagement.GetSpidersParam) {
  return request<DatasourceManagement.GetAllSpidersData>({
    url: "spider/all",
    method: "get",
    params
  })
}
