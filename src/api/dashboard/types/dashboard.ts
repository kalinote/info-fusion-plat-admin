export type getCollectedInfoSummaryResponseData = ApiResponseData<{
  /** 总信息量 */
  totalInfo: number
  /** 24小时新增信息量 */
  dailyNewInfo: number
  /** 24小时信息数量最多tag */
  tags: string[]
}>

export interface getDailyHighWeightInfoData {
  /** 信息内容 */
  content: string
  /** 信息tags */
  tags: string[]
  /** 信息来源 */
  source: string[]
  /** 信息meta */
  meta: string[]
}

export interface getNodeInfoData {
  /** 信息标题 */
  title: string
  /** 信息内容 */
  value: number
  /** icon */
  icon: string
  /** 背景颜色 */
  color: {
    background: string
  }
}

export type getDailyHighWeightInfoResponseData = ApiResponseData<{
  list: getDailyHighWeightInfoData[]
}>

export type getNodeInfoResponseData = ApiResponseData<{
  list: [getNodeInfoData[]]
}>
