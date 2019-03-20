declare enum OrderTypes {asc = 'asc', desc = 'desc'}

/**
 * @param {string} [build='./menus.json'] - 导出的路径
 * @param {string[]} [excludes=['exact','component','Routes']] - 返回忽略字段
 * @param {[[string], [string]]} [order=[[order], ['asc']]] - 根据字段排序 参考 lodash/orderBy
 */
export interface options {
	build?: string,
	excludes?: string[],
  order?: [[string], [OrderTypes]]
}
