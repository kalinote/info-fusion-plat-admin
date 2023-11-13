import { request } from "@/utils/service"
import type * as DatasourceManagement from "./types/datasource-management"

/** 查询所有采集程序 */
export function getAllSpidersDataApi(params: DatasourceManagement.GetSpidersParam) {
  return request<DatasourceManagement.GetAllSpidersData>({
    url: "spider/all",
    method: "get",
    params
  })
}

//#region RSS采集模板
/** 查询RSS采集模板 */
export function getRssTemplateDataApi(params: DatasourceManagement.GetRssTemplateParam) {
  return request<DatasourceManagement.GetRssTemplateData>({
    url: "spider/rss",
    method: "get",
    params
  })
}

/** 新增RSS采集模板 */
export function createRssTemplateDataApi(data: DatasourceManagement.createRssTemplateData) {
  return request({
    url: "spider/rss",
    method: "post",
    data
  })
}
//#endregion

/** 部署RSS采集模板 */
export function developRssTemplateApi(data: DatasourceManagement.developRssTemplateData) {
  return request({
    url: "spider/rss/deploy",
    method: "post",
    data
  })
}
