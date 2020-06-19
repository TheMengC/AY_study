/**
 * 处理表格body部分数据，增加字段 grids
 * grids 为一个数组，返回表格 Head 部分的栅格大小
 * @param   dataSource        表格数据源【必需】
 * @param   tableHead         表格标题配置【必需】
 *              title 标题文字
 *              grid  所占栅格数
 *
 * className:
 * my-table grid-item24
 *  head grid-cont【该组件封装层级】
 *  body
 *      row grid-cont
 *          cell grid-item6
 *          cell grid-item6
 *          cell grid-item6
 *          cell grid-item6
 * */
import { GRID_TABLE_HEAD } from './config';

export function getBodyGrids (dataSource, tableHead = GRID_TABLE_HEAD) {
    let grids = tableHead.map(item => item.grid);    // 建立要获取栅格的索引
    // 保存一个表格内容的栅格数
    dataSource.map(item => {
        item.grids = grids;
    });

    return dataSource;
}
