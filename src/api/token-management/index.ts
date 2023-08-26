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
export function getPlatformTokenDataApi(params: PlatformToken.GetPlatformTokenRequestData) {
  return request<PlatformToken.GetPlatformTokenResponseData>({
    url: "token_management",
    method: "get",
    params
  })
}

/** 修改 */
export function updatePlatformTokenDataApi(data: PlatformToken.PlatformTokenData) {
  return request({
    url: "token_management",
    method: "put",
    data
  })
}

/** 删除 */
export function deletePlatformTokenDataApi(id: string) {
  return request({
    url: `token_management/${id}`,
    method: "delete"
  })
}
