export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MTUwZDQ3NS1mYzY5LTRiNzAtYjk5YS1hZGRiZTYzZTgyZGYiLCJpZCI6Njg4MzQsImlhdCI6MTYzMjg5NTExN30.qPq9W2KiIj5bPvreaPNTcSXJcdk-EB_egnG0zXAtmvM"
export const modelID = 688463;

export const baseMap = {
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
    axisLabel: {
      textStyle: {
        fontSize: 16,
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      textStyle: {
        fontSize: 16,
      }
    }
  },
  series: []
};

export const modelTree = [{
  label: '断面',
  children: [{
    label: '1-1断面',
    value: NaN,
   }, {
    label: '2-2断面',
    value: NaN
  }, {
    label: '3-3断面',
    value: NaN,
    children: [{
        label: 'DC3测点',
        section: 'DC3',
        title: '3-3断面DC3数据',
        message: '这里是测试这里是测试这里是测试',
        value: NaN,
      }, {
        label: 'DC4测点',
        value: NaN,
        section: 'DC4',
        title: '3-3断面DC4数据',
        message: '这里是测试这里是测试这里是测试',
      }, {
        label: 'DC5测点',
        value: NaN,
    }]
  }, {
    label: '4-4断面',
    value: NaN
  }, {
    label: '5-5断面',
    value: NaN
  }, {
    label: '全部断面',
    value: 688464
  }, {
    label: '基本模型',
    value: 688463
  }]
}];

export const cesiumStyle = {
  color: {
    conditions: [
      // ["${Intensity} < 100", "${COLOR}*rgba(255,255,255, ${Intensity}/100)"],
      ["${Intensity} === 101", "rgba(255, 255, 255, 1)"],
      ["${Intensity} === 102", "rgba(127, 0, 0, 1)"],
      ["${Intensity} === 103","rgba(96, 96, 96, 0.1)"],
      ["${Intensity} === 104","rgba(20, 38, 183, 1)"],
      ["${Intensity} === 105","rgba(51, 153, 255, 1)"],
      ["${Intensity} === 106","rgba(153, 51, 255, 1)"],
      ["${Intensity} === 107","rgba(255, 0, 255, 1)"],
      ["${Intensity} === 108","rgba(204, 0, 102, 1)"],
    ],
  },
  pointSize: {
    conditions: [
      // ["${Intensity} > 100", "${Intensity}/100"],
      // ["${Intensity} === 101", "3"],
      // ["${Intensity} === 102", "3"],
      ["${Intensity} === 103", "1"],
      ["${Intensity} === 104", "3"],
      ["${Intensity} === 105", "3"],
      ["${Intensity} === 106", "3"],
      ["${Intensity} === 107", "3"],
      ["${Intensity} === 108", "3"],
      ["true", "2"],
    ]
  }
}