import { request } from "@/utils/service"
import type * as DashboardType from "@/api/dashboard/types/dashboard"

/** 获取主页顶部概览信息 */
export function getCollectedInfoSummaryDataApi() {
  return request<DashboardType.getCollectedInfoSummaryResponseData>({
    url: "dashboard/collected_info_summary_data",
    method: "get"
  })
}

/** 获取24小时高权重信息 */
export function getDailyNewInfoApi() {
  return request<DashboardType.getDailyNewInfoResponseData>({
    url: "dashboard/daily_new_info",
    method: "get"
  })
}

/** 获取采集节点信息 */
export function getNodeInfoApi() {
  return request<DashboardType.getNodeInfoResponseData>({
    url: "dashboard/node_info",
    method: "get"
  })
}
