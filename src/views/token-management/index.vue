<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="environment_variable_name" label="环境变量名">
          <el-input v-model="searchData.token_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="platform_name" label="平台名称">
          <el-input v-model="searchData.platform" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增环境变量</el-button>
          <el-button type="danger" :icon="Delete" disabled>批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getPlatformTokenData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="token_name" label="环境变量名" align="center" />
          <el-table-column prop="token_value" label="值" align="center" />
          <el-table-column prop="platform" label="平台" align="center" />
          <el-table-column prop="description" label="描述" align="center" />
          <el-table-column prop="is_using" label="使用状态" align="center">
            <template #default="scope">
              <el-switch
                class="ml-2"
                style="--el-switch-on-color: #67c23a; --el-switch-off-color: #f56c6c"
                v-model="scope.row.is_using"
                @change="handleSwitchChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" align="center">
            <template #default="scope">
              {{ formatTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="更新时间" align="center">
            <template #default="scope">
              {{ formatTime(scope.row.update_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Token状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="success" effect="plain">正常</el-tag>
              <el-tag v-else type="danger" effect="plain">失效</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="deploy-wrapper">
        <el-button type="primary" :icon="Check" @click="console.log('点击部署')">RssHub部署</el-button>
      </div>
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增环境变量' : '修改环境变量'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="token_name" label="环境变量名">
          <el-input v-model="formData.token_name" placeholder="请输入" :disabled="currentUpdateId !== undefined" />
        </el-form-item>
        <el-form-item prop="value" label="值">
          <el-input v-model="formData.token_value" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="platform" label="平台">
          <el-input v-model="formData.platform" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="formData.description" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs"
import { Search, Refresh, Download, RefreshRight, CirclePlus, Delete, Check } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { reactive, ref, onMounted } from "vue"
import { type PlatformTokenData } from "@/api/token-management/types/token-management"
import {
  createPlatformTokenDataApi,
  getPlatformTokenDataApi,
  updatePlatformTokenDataApi,
  deletePlatformTokenDataApi
} from "@/api/token-management"

const loading = ref<boolean>(false)
const formatTime = (timestamp: number) => {
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss")
}

//#region 新增token
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  id: -1,
  token_name: "",
  token_value: "",
  platform: "",
  description: "",
  is_using: false,
  create_time: Date.now(),
  update_time: Date.now(),
  status: true
})

const formRules: FormRules = reactive({
  token_name: [{ required: true, trigger: "blur", message: "请输入环境变量名" }],
  value: [{ required: true, trigger: "blur", message: "请输入值" }],
  platform: [{ required: true, trigger: "blur", message: "请输入平台" }]
})

const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createPlatformTokenDataApi(formData)
          .then(() => {
            ElMessage.success("新增成功")
            getPlatformTokenData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        // 进行修改操作
        updatePlatformTokenDataApi(formData)
          .then(() => {
            ElMessage.success("修改成功")
            getPlatformTokenData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

const resetForm = () => {
  setTimeout(() => {
    currentUpdateId.value = undefined
    formData.id = -1
    formData.token_name = ""
    formData.token_value = ""
    formData.platform = ""
    formData.description = ""
  }, 200) /** 延迟0.2秒执行，免得窗口还没消失，设置了currentUpdateId.value = undefined导致标题和内容发生变化 */
}
//#endregion

//#region 查询所有token
const tableData = ref<PlatformTokenData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  token_name: "",
  platform: ""
})

const getPlatformTokenData = () => {
  loading.value = true
  getPlatformTokenDataApi({
    token_name: searchData.token_name || undefined,
    platform: searchData.platform || undefined
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

const handleSearch = () => {
  getPlatformTokenData()
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

//#region 行操作
const currentUpdateId = ref<undefined | number>(undefined)

/* 切换使用状态开关 */
const handleSwitchChange = (row: PlatformTokenData) => {
  updatePlatformTokenDataApi(row).then(() => {
    ElMessage.success("修改成功")
    getPlatformTokenData()
  })
}

/** 修改数据 */
function handleUpdate(row: PlatformTokenData): void {
  currentUpdateId.value = row.id
  formData.id = row.id
  formData.token_name = row.token_name
  formData.token_value = row.token_value
  formData.platform = row.platform
  formData.description = row.description
  dialogVisible.value = true
}

/** 删除数据 */
const handleDelete = (row: PlatformTokenData) => {
  ElMessageBox.confirm(`正在环境变量：${row.token_name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deletePlatformTokenDataApi(row.id.toString()).then(() => {
      ElMessage.success("删除成功")
      getPlatformTokenData()
    })
  })
}
//#endregion

//#region 页面加载工作
onMounted(() => {
  getPlatformTokenData()
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

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}

.deploy-wrapper {
  display: flex;
  justify-content: flex-end;
}

.right-align {
  margin-left: auto;
}
</style>
