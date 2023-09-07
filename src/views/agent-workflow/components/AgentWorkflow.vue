<template>
  <div class="echarts" id="echarts" ref="chart" />
</template>

<script lang="ts" setup>
import * as echarts from "echarts"
import { onMounted, ref } from "vue"

const chart = ref()

onMounted(() => {
  const echart = echarts.init(chart.value)

  //#region 窗口自适应
  window.addEventListener(
    "resize",
    () => {
      echart.resize()
    },
    false
  )
  //#endregion

  echart.setOption({
    title: {
      text: "Agent workflow"
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        type: "graph",
        layout: "none",
        symbolSize: 50,
        roam: true,
        label: {
          show: true,
          position: "bottom"
        },
        edgeSymbol: ["circle", "arrow"],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: 20
        },
        data: [
          {
            name: "Global Main Agent",
            x: 0,
            y: 0,
            value: "Ready for work",
            itemStyle: {
              color: "#7CFC00"
            }
          },
          {
            name: "Worker Agent A",
            x: 200,
            y: 0,
            value: "Thinking",
            itemStyle: {
              color: "#FFD700"
            }
          },
          {
            name: "Worker Agent B",
            x: 100,
            y: 50,
            value: "Waiting for response",
            itemStyle: {
              color: "#FF4500"
            }
          },
          {
            name: "Worker subAgent A",
            x: 200,
            y: 50,
            value: "Thinking",
            itemStyle: {
              color: "#FFD700"
            }
          },
          {
            name: "Worker subAgent B",
            x: 200,
            y: 100,
            value: "Ready for work",
            itemStyle: {
              color: "#7CFC00"
            }
          }
        ],
        links: [
          {
            source: "Global Main Agent",
            target: "Worker Agent A",
            label: {
              show: true,
              formatter: "Managing"
            }
          },
          {
            source: "Global Main Agent",
            target: "Worker Agent B",
            label: {
              show: true,
              formatter: "Managing"
            }
          },
          {
            source: "Worker Agent B",
            target: "Worker subAgent A",
            label: {
              show: true
            }
          },
          {
            source: "Worker Agent B",
            target: "Worker subAgent B",
            label: {
              show: true,
              formatter: "Work completed"
            }
          }
        ],
        lineStyle: {
          opacity: 0.9,
          width: 2,
          curveness: 0
        }
      }
    ]
  })
})
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
