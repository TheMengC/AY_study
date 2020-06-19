/**
 * grid-table-head 组件
 * 根据表格的 head 部分，可自定义每一个 col 的栅格大小
 * @param title         表格列head的文字
 * @param grid          栅格数组，可传多个值
 * {
 *     className   自定义样式类名
 *     col         栅格大小，col为0则该列不进行渲染
 * }
 *
 * 注意：和 getBodyGrids方法联合使用
 *
 * gridTableHead is an example data
 * */
export const GRID_TABLE_HEAD = {
    '0': [
        {
            title: '列1',
            className: '',
            grid: 6,
        },
        {
            title: '列12',
            className: '',
            grid: 6,
        },
        {
            title: '列3',
            className: '',
            grid: 6,
        },
        {
            title: '列4',
            className: '',
            grid: 6,
        },
    ],
};
