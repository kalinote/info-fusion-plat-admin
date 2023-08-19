import { request } from "@/utils/service"
import type * as PlatformToken from "./types/token-management"

/** 新增 */
export function createPlatformTokenDataApi(data: PlatformToken.PlatformTokenData) {
  return request({
    url: "token_management",
    method: "post",
    data
  })
}

/** 查询 */
export function getPlatformTokenDataApi() {
  return request<PlatformToken.GetPlatformTokenResponseData>({
    url: "token_management",
    method: "get"
  })
}
