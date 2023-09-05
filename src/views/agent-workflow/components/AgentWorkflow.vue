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
          show: true
        },
        edgeSymbol: ["circle", "arrow"],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: 20
        },
        data: [
          {
            name: "Global Main Agent",
            x: 300,
            y: 300,
            value: "Waiting for work",
            itemStyle: {
              color: "#7CFC00"
            }
          },
          {
            name: "Worker Agent A",
            x: 800,
            y: 300,
            value: "Thinking",
            itemStyle: {
              color: "#FFD700"
            }
          },
          {
            name: "Worker Agent B",
            x: 550,
            y: 400,
            value: "Waiting for response",
            itemStyle: {
              color: "#FF4500"
            }
          },
          {
            name: "Worker subAgent",
            x: 800,
            y: 400,
            value: "Thinking",
            itemStyle: {
              color: "#FFD700"
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
            },
            lineStyle: {
              curveness: 0.2
            }
          },
          {
            source: "Global Main Agent",
            target: "Worker Agent B",
            label: {
              show: true,
              formatter: "Managing"
            },
            lineStyle: {
              curveness: 0.2
            }
          },
          {
            source: "Worker Agent B",
            target: "Worker subAgent",
            label: {
              show: true
            },
            lineStyle: {
              curveness: 0.2
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
