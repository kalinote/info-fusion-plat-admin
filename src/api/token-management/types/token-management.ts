export interface PlatformTokenData {
  /** id */
  id: number
  /** 环境变量名 */
  token_name: string
  /** 环境变量值 */
  token_value: string
  /** 所属平台 */
  platform: string
  /** 描述 */
  description: string
  /** 是否启用 */
  is_using: boolean
  /** 创建时间 */
  create_time: number
  /** 更新时间 */
  update_time: number
  /** token状态 */
  status: boolean
}

export interface GetPlatformTokenRequestData {
  /** 环境变量名 */
  token_name?: string
  /** 所属平台 */
  platform?: string
}

export type GetPlatformTokenResponseData = ApiResponseData<{
  list: PlatformTokenData[]
  total: number
}>
