# 图标使用规范

> 所有图标已内置于 bep-components.js 的 BEP_ICONS 对象（33 实测 + 4 近似）。
> 调用方式：`bepIcon('图标名', 尺寸, 颜色对象)`
> 不得用矩形、emoji、文字、自定义 SVG 或页面注入 `BEP_ICONS` 代替图标。

---

## 标准尺寸

| 场景 | 尺寸 | 说明 |
|---|---|---|
| 表格操作列、筛选区 | 16×16 | 最常用 |
| 面包屑分隔箭头 | 12×12 | 小场景 |
| 展开/折叠箭头（树表格）| 16×16 | 嵌入树状表格行内 |
| TopBar 右侧图标 | 16×16 | Search/Download/Notice |
| 按钮内图标 | 14×14 或 16×16 | 与文字对齐 |

---

## 可用图标列表

### Fill 系列（实心）

| 名称 | 典型用途 |
|---|---|
| `Fill/Abnormal` | 警告提示、Popconfirm |
| `Fill/Tips` | 信息提示 ℹ |
| `Fill/Arrow-Open` | 展开 ▼（树形组件、树表格展开态）|
| `Fill/Arrow-PutAway` | 收起 ▶（树形组件、树表格折叠态）|
| `Fill/Fail` | 失败状态 ✗ |
| `Fill/Success` | 成功状态 ✓ |
| `Fill/Search` | 搜索 |
| `Fill/Download` | 下载 |
| `Fill/Star` | 评分实心星 |
| `Fill/Notice` | 通知铃（TopBar 右侧）|
| `Fill/MenuOpen` | 菜单折叠图标（TopBar 左侧）|
| `Fill/Add` | 加号实心圆（近似）|
| `Fill/Close` | × 关闭（实为 Line/Close 替代）|
| `Fill/FolderOpened` | 文件夹（近似）|
| `Fill/Aim` | 瞄准靶（近似）|

### Line 系列（线性）

| 名称 | 典型用途 |
|---|---|
| `Line/DoubleLeft` | 分页 « 第一页 |
| `Line/DoubleRight` | 分页 » 最后页 |
| `Line/Left-Arrow` | 分页 ‹ 上一页 |
| `Line/Right-Arrow` | 分页 › 下一页、面包屑分隔 |
| `Line/Field` | 文本域右下角可拉伸标记 |
| `Line/Filter` | 筛选漏斗 |
| `Line/Close` | × 关闭（弹窗/抽屉/标签）|
| `Line/Add` | + 加号 |
| `Line/Cut` | 半选 / 部分选中（级联选择器多选）|
| `Line/Select` | 选中对勾（级联选择器、选择状态）|
| `Line/Loading` | 加载中（圆弧）|
| `Line/DropDown-Arrow` | 下拉箭头 ∨（选择器）|
| `Line/PutAway-Arrow` | 收起箭头 ∧ |
| `Line/Search` | 搜索 |
| `Line/Download` | 下载 |
| `Line/Notice` | 通知铃 |
| `Line/Paperclip` | 附件 |
| `Line/Menu` | 汉堡菜单 |
| `Line/Date` | 日历（日期区间控件）|
| `Line/Clock` | 时钟（时间选择器）|
| `Line/upload-cloud` | 上传云 |
| `Line/MenuOpen` | 菜单展开（侧边栏）|
| `Line/Trash` | 删除 |
| `Line/Edit` | 编辑 |
| `Line/Switch` | 切换 |
| `Line/More` | 更多… ⋮（操作列 overflow）|

---

## 着色规则

```javascript
// 图标默认跟随上下文颜色，通过第三个参数指定颜色
bepIcon('Line/Close', 16, B)               // 黑色
bepIcon('Fill/Notice', 16, bepHex('666666'))  // 灰色（TopBar 右侧）
bepIcon('Line/DropDown-Arrow', 16, B)      // 黑色，不透明度在父级控制

// 侧边栏图标使用白色
bepIcon('Line/Menu', 16, BEP_C.white)

// opacity 用于弱化图标
var ico = bepIcon('Line/Close', 16, B);
ico.opacity = 0.45;   // 弱化显示
```

---

## 不在 BEP_ICONS 中的图标

页面脚本不得临时手绘、内联 SVG 或 `Object.assign(BEP_ICONS, {...})` 注入图标。

标准组件参数中的图标 key 也属于正式图标引用，不是普通字符串。常见形式包括：

- `bepIcon('Line/search', 16, B)`
- `bepSidebarItem(label, level, state, 'Line/box')`
- `bepCard({ iconKey:'Line/box' })`
- 数据驱动写法中的 `['商品管理', 1, 'expanded', 'Line/box']`

构建产物必须保留这些 key 对应的 `BEP_ICONS` 条目；静态校验发现源码引用存在但 dist 未保留时必须报错。

如引用不到图标，必须先提出缺口：

- 说明业务场景和所需语义，例如“门店”“商品”“数据中心”。
- 优先给出 `BEP_ICONS` 中已有候选替代。
- 若没有合适候选，经确认后补进 `scripts/bep-components.js` 的 `BEP_ICONS`，并同步更新本文件。
- 补齐后页面脚本仍只调用 `bepIcon('图标名', size, color)`。
