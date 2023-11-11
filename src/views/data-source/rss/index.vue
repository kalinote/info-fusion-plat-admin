<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true">
        <el-form-item prop="rss_name" label="RSS采集模板名称">
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新建RSS采集模板</el-button>
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
          <el-table-column prop="category" label="分类" align="center" width="120" />
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
          <el-table-column prop="deploy_status" label="部署状态" align="center" width="100">
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
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增环境变量' : '修改环境变量'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px" label-position="left">
        <el-form-item prop="name" label="名称">
          <el-input v-model="formData.name" placeholder="请输入名称" :disabled="currentUpdateId !== undefined" />
        </el-form-item>
        <el-form-item prop="platform_name" label="平台名称">
          <el-input v-model="formData.platform_name" placeholder="请输入平台名称" />
        </el-form-item>
        <el-form-item prop="protocol" label="协议">
          <el-select v-model="formData.protocol" class="m-2" placeholder="Select">
            <el-option key="1" label="http" value="http" />
            <el-option key="1" label="https" value="https" />
          </el-select>
        </el-form-item>
        <el-form-item prop="host" label="Host或域名">
          <el-input v-model="formData.host" placeholder="请输入Host或域名" />
        </el-form-item>
        <el-form-item prop="route" label="路由地址(以/开头)">
          <el-input v-model="formData.host" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item prop="category" label="分类">
          <el-input v-model="formData.category" placeholder="请输入分类" />
        </el-form-item>
        <el-form-item prop="tags" label="基础标签">
          <el-tag
            v-for="tag in formData.tags"
            :key="tag"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="handleTagClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputTagVisible"
            ref="InputRef"
            v-model="inputTagValue"
            class="ml-1 w-20"
            size="small"
            @keyup.enter="handleInputTagConfirm"
            @blur="handleInputTagConfirm"
          />
          <el-button v-else class="button-new-tag ml-1" size="small" @click="showTagInput"> + New Tag </el-button>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="formData.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item prop="running_cycle" label="运行周期">
          <el-input v-model="formData.running_cycle" placeholder="请输入Cron表达式" />
          {{ convertCronToDescription(formData.running_cycle) }}
        </el-form-item>
        <el-form-item prop="additional_params" label="附加参数">
          <el-table
            v-if="Object.keys(formData.additional_params).length"
            :data="additionalParamsAsArray"
            style="width: 100%; margin-bottom: 10px"
          >
            <el-table-column prop="key" label="参数名" />
            <el-table-column prop="value" label="参数值" />
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button @click="editKeyValue(row)">编辑</el-button>
                <el-button type="danger" @click="deleteKeyValue(row.key)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-form-item label="新增键值对："> -->
          <el-input v-model="tempKeyValue.key" placeholder="参数名" style="width: 100px; margin-right: 10px" />
          <el-input v-model="tempKeyValue.value" placeholder="参数值" style="width: 200px; margin-right: 10px" />
          <el-button @click="addKeyValue">添加</el-button>
          <!-- </el-form-item> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="console.log(formData)" type="primary">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick, computed } from "vue"
import { Search, Refresh, Download, RefreshRight, CirclePlus, Delete } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElInput } from "element-plus"
import { RssTemplateData } from "@/api/datasource-management/types/datasource-management"
import { getRssTemplateDataApi } from "@/api/datasource-management"
import { parseExpression } from "cron-parser"
import cronstrue from "cronstrue/i18n"

const loading = ref<boolean>(false)
const currentUpdateId = ref<undefined | number>(undefined)

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

//#region 新增RSS采集模板
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  id: -1,
  name: "",
  platform_name: "",
  protocol: "http",
  host: "",
  route: "",
  category: "",
  tags: ["RSS"],
  additional_params: {} as Record<string, string>,
  description: "",
  running_cycle: ""
})

const formRules: FormRules = reactive({})

const resetForm = () => {
  setTimeout(() => {
    formData.id = -1
    formData.name = ""
    formData.platform_name = ""
    formData.protocol = ""
    formData.host = ""
    formData.route = ""
    formData.category = ""
    formData.tags = ["RSS"]
    formData.additional_params = {}
    formData.description = ""
    formData.running_cycle = ""
  }, 200) /** 延迟0.2秒执行，免得窗口还没消失，设置了currentUpdateId.value = undefined导致标题和内容发生变化 */
}

const inputTagVisible = ref(false)
const InputTagRef = ref<InstanceType<typeof ElInput>>()
const inputTagValue = ref("")
const handleTagClose = (tag: string) => {
  formData.tags.splice(formData.tags.indexOf(tag), 1)
}

const showTagInput = () => {
  inputTagVisible.value = true
  nextTick(() => {
    InputTagRef.value!.input!.focus()
  })
}

const handleInputTagConfirm = () => {
  if (inputTagValue.value) {
    formData.tags.push(inputTagValue.value)
  }
  inputTagVisible.value = false
  inputTagValue.value = ""
}

const tempKeyValue = reactive({ key: "", value: "" })
const addKeyValue = () => {
  if (tempKeyValue.key && tempKeyValue.value) {
    formData.additional_params[tempKeyValue.key] = tempKeyValue.value
    tempKeyValue.key = ""
    tempKeyValue.value = ""
  }
}

const additionalParamsAsArray = computed(() => {
  return Object.entries(formData.additional_params).map(([key, value]) => ({ key, value }))
})

const deleteKeyValue = (key: string) => {
  delete formData.additional_params[key]
}

const editKeyValue = (row: { key: string; value: string }) => {
  tempKeyValue.key = row.key
  tempKeyValue.value = row.value
  // 如果需要，这里可以添加逻辑来处理编辑状态
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
