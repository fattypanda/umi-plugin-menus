/**
 * @param {string} [build=./menus.json] - 导出的路径
 * @param {string[]} [excludes=exact,component,Routes] - 返回忽略字段
 */
export interface options {
	build?: string,
	excludes?: string[],
}