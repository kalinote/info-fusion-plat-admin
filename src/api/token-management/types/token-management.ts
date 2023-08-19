export interface CreatePlatformTokenRequestData {
  /** 环境变量名 */
  env_var_name: string
  /** 环境变量值 */
  value: string
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