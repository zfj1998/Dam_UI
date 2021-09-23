export const baseMap = {
    title: {
        text: '测点数据'
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: []
    },
    grid: {
        width: '80%',
        height: '80%',
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value}mm'
        }
    },
    series: [
    ]
};