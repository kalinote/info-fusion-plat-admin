import { request } from "@/utils/service"
import { type getCollectedInfoSummaryData } from "@/api/dashboard/types/dashboard"

/** 获取主页顶部概览信息 */
export function getCollectedInfoSummaryDataApi() {
  return request<getCollectedInfoSummaryData>({
    url: "dashboard/collected_info_summary_data",
    method: "get"
  })
}
