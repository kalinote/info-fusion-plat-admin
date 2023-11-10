<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true">
        <el-form-item prop="spider_name" label="采集程序名称">
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
          <el-button type="primary" :icon="CirclePlus" disabled>新建采集程序</el-button>
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
          <el-table-column prop="project_name" label="项目" align="center" />
          <el-table-column prop="last_status" label="最后运行状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.last_status === 'finished'" type="success" effect="plain">已完成</el-tag>
              <el-tag v-else-if="scope.row.last_status === 'error'" type="danger" effect="plain">错误</el-tag>
              <el-tag v-else-if="scope.row.last_status === 'running'" type="warning" effect="plain">运行中</el-tag>
              <el-tag v-else-if="scope.row.last_status === 'pending'" effect="plain">部署中</el-tag>
              <el-tag v-else-if="scope.row.last_status === 'cancelled'" type="info" effect="plain">已取消</el-tag>
              <el-tag v-else-if="scope.row.last_status === 'none'" type="info" effect="plain">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="statistical" label="统计数据" align="center">
            <template #default="scope">
              <el-tooltip class="box-item" effect="dark" content="该程序运行的任务总数" placement="bottom">
                <el-tag effect="plain">{{ scope.row.statistical.tasks }}</el-tag>
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" content="所有任务的结果总数" placement="bottom">
                <el-tag style="margin-left: 5px" effect="plain" type="success">
                  {{ scope.row.statistical.results }}
                </el-tag>
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" content="平均任务运行时长(s)" placement="bottom">
                <el-tag style="margin-left: 5px" effect="plain" type="warning">
                  {{ scope.row.statistical.average_total_duration }}
                </el-tag>
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" content="所有任务运行总时长(s)" placement="bottom">
                <el-tag style="margin-left: 5px" effect="plain" type="danger">
                  {{ scope.row.statistical.total_duration }}
                </el-tag>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" align="center" />
          <el-table-column prop="target_site" label="目标站点" align="center" />
          <el-table-column prop="tags" label="标签" align="center">
            <template #default="scope">
              <el-tag style="margin-left: 5px" v-for="(tag, key) in scope.row.tags" :key="key" effect="plain">
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operate" label="操作" align="center" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { Search, Refresh, Download, RefreshRight, CirclePlus, Delete } from "@element-plus/icons-vue"
import { ref, onMounted } from "vue"
import { type SpiderData } from "@/api/datasource-management/types/datasource-management"
import { getAllSpidersDataApi } from "@/api/datasource-management"

const loading = ref<boolean>(false)

//#region 查询所有spiders
const tableData = ref<SpiderData[]>([])

const getAllSpiders = () => {
  loading.value = true
  //TODO 实现分页
  getAllSpidersDataApi({
    page: 0,
    size: 0
  })
    .then((res) => {
      tableData.value = res.data.list
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
  getAllSpiders()
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
