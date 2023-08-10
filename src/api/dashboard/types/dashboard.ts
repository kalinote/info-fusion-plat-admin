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

export type getDailyHighWeightInfoResponseData = ApiResponseData<{
  list: getDailyHighWeightInfoData[]
}>
