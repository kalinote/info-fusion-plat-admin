export interface SpiderStatisticalData {
  /** 采集程序任务总数 */
  tasks: number
  /** 采集程序结果总数 */
  results: number
  /** 平均运行时间 */
  average_total_duration: number
  /** 运行总时长 */
  total_duration: number
}

export interface SpiderData {
  /** id */
  id: number
  /** 采集程序名称 */
  name: string
  /** 项目名称 */
  project_name: string
  /** 最后运行状态 */
  last_status: string
  /** 统计信息 */
  statistical: SpiderStatisticalData
  /** 采集程序描述 */
  description: string
  /** 目标站点 */
  target_site: string
  /** 采集程序tags */
  tags: string[]
}

export interface GetSpidersParam {
  /** 页码 */
  page: number
  /** 大小 */
  size: number
}

export type GetAllSpidersData = ApiResponseData<{
  list: SpiderData[]
  total: number
}>

export interface RssTemplateData {
  id: number
  additional_params: { [key: string]: string }
  tags: string[]
  name: string
  platform_name: string
  protocol: string
  host: string
  route: string
  category: string
  description: string
  running_cycle: string
  create_time: string
  update_time: string
  deploy_status: string
  is_deleted: boolean
}

export interface GetRssTemplateParam {
  /** 页码 */
  page: number
  /** 大小 */
  size: number
}

export type GetRssTemplateData = ApiResponseData<{
  list: RssTemplateData[]
  total: number
}>
