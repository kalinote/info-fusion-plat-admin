<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true">
        <el-form-item prop="rss_name" label="RSS命令模板名称">
          <el-input placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" disabled>新建RSS命令模板</el-button>
          <el-button type="danger" :icon="Delete" disabled>批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="name" label="名称" align="center" />
          <el-table-column prop="platform_name" label="来源平台" align="center" />
          <el-table-column label="链接" align="center">
            <template #default="{ row }">
              <a :href="row.fullLink" target="_blank">{{ row.fullLink }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" align="center" />
          <el-table-column prop="tags" label="基础标签" align="center">
            <template #default="scope">
              <el-tag style="margin-left: 5px" v-for="(tag, key) in scope.row.tags" :key="key" effect="plain">
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" align="center" />
          <el-table-column prop="running_cycle" label="运行周期" align="center" width="450">
            <template #default="scope">
              <el-tag effect="plain">Cron表达式: {{ scope.row.running_cycle }}</el-tag>
              <br />
              <el-tag type="success" effect="plain">
                执行时间: {{ convertCronToDescription(scope.row.running_cycle) }}
              </el-tag>
              <br />
              <el-tag type="warning" effect="plain">
                下一次执行时间: {{ cronToNextExecution(scope.row.running_cycle) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="deploy_status" label="部署状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.deploy_status === '未部署'" type="danger" effect="plain">未部署</el-tag>
              <el-tag v-else-if="scope.row.deploy_status === '已部署,但未启用'" type="warning" effect="plain">
                已部署,但未启用
              </el-tag>
              <el-tag v-else-if="scope.row.deploy_status === '已启用'" type="success" effect="plain">已启用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operate" label="操作" align="center" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { Search, Refresh, Download, RefreshRight, CirclePlus, Delete } from "@element-plus/icons-vue"
import { RssTemplateData } from "@/api/datasource-management/types/datasource-management"
import { getRssTemplateDataApi } from "@/api/datasource-management"
import { parseExpression } from "cron-parser"
import cronstrue from "cronstrue/i18n"

//#region cron表达式处理
function cronToNextExecution(expression: string): string {
  try {
    const interval = parseExpression(expression)
    return interval.next().toString()
  } catch (err: any) {
    return "解析错误: " + err.message
  }
}

function convertCronToDescription(cronExpression: string, locale: string = "zh_CN"): string {
  try {
    return cronstrue.toString(cronExpression, { locale })
  } catch (error) {
    console.error("Error converting cron expression:", error)
    return "无效的 Cron 表达式"
  }
}
//#endregion

const loading = ref<boolean>(false)

//#region 查询所有RSS模板
const tableData = ref<RssTemplateData[]>([])
const getRssTemplates = () => {
  loading.value = true
  getRssTemplateDataApi({
    page: 0,
    size: 0
  })
    .then((res) => {
      tableData.value = res.data.list.map((item) => {
        // 将additional_params转换为查询字符串
        const queryParams = item.additional_params ? new URLSearchParams(item.additional_params).toString() : ""
        // 合成链接，如果有查询参数则添加
        const fullLink = `${item.protocol}://${item.host}${item.route}` + (queryParams ? `?${queryParams}` : "")
        return {
          ...item,
          fullLink // 更新的合成链接
        }
      })
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
//#endregion

//#region 页面加载工作
onMounted(() => {
  getRssTemplates()
})
//#endregion
</script>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}
</style>
