import { request } from "@/utils/service"
import type * as PlatformToken from "./types/token-management"

/** 新增 */
export function createPlatformTokenDataApi(data: PlatformToken.CreatePlatformTokenRequestData) {
  return request({
    url: "token_management",
    method: "post",
    data
  })
}
