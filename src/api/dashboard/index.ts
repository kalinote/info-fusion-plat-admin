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
export function getDailyHighWeightInfoApi() {
  return request<DashboardType.getDailyHighWeightInfoResponseData>({
    url: "dashboard/daily_high_weight_info",
    method: "get"
  })
}
