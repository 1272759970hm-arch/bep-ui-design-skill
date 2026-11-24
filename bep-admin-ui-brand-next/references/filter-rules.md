# 筛选区规范（已定稿）

---

## 两个函数，场景不同不可混用

### bepFilterRow（特殊情况）
```
适用：筛选条件 ≤2 个，且右侧需要操作按钮（新增等）
布局：[条件1] [条件2] [查询]                    [+ 新增]
```
- 查询按钮紧跟条件右侧，不右对齐
- 操作按钮（新增等）右对齐到容器边缘

---

### bepFilterGrid（通用多条件）

**布局参数（硬编码，不可修改）：**
```
三列等宽：colW = floor((tableW - 8×2) / 3)
标题区：  固定 112px，文字右对齐，无冒号
标题→控件间距：12px
列间距：  8px
每行高：  16px上边距 + 32px控件 + 16px下边距 = 64px
```

**按钮组（查询/重置/展开收起）：**
```
整组右对齐
查询 ↔ 重置：间距 8px
重置 ↔ 展开/收起：间距 16px（Figma实测）
```
- 查询/重置必须使用按钮（`bepButton`）或按钮组（`bepButtonGroup`），文案不得写成 `查 询` / `重 置`。
- 展开/收起是筛选区唯一允许的“文字 + 图标”按钮例外，必须使用 `bepButton('展开','text',32,{iconKey:'Line/DropDown-Arrow', iconPosition:'right'})` 或 `bepButton('收起','text',32,{iconKey:'Line/PutAway-Arrow', iconPosition:'right'})`。
- 不得在筛选区局部手写文字、箭头图标和按钮容器。

**折叠规则：**

| 条件数 | 按钮组位置 | 折叠 |
|--------|-----------|------|
| 1～2 | 第1行末，右对齐 | 无 |
| 3（第1行满）| 第2行，右对齐 | 无 |
| 4～5 | 第2行末，右对齐 | 无 |
| 6（第2行满）| 第3行 → 触发折叠 | 有 |
| 7～8 | 第3行 → 触发折叠 | 有 |

**折叠态（方案乙）：** 只显示前5个条件，第2行末放按钮组+展开
```
[条件1] [条件2] [条件3]
[条件4] [条件5]          [查询] [重置] [展开↓]
```

**展开态：**
```
[条件1] [条件2] [条件3]
[条件4] [条件5] [条件6]
[条件7] [条件8]          [查询] [重置] [收起∧]
```

---

## 控件类型（filter.type）

| type | 渲染 | 说明 |
|---|---|---|
| `'input'`（默认）| bepInput | 文字输入 |
| `'select'` | bepSelect | 下拉选择 |
| `'cascader'` | bepCascader | 层级级联选择 |
| `'date'` | bepDate | 单个日期 |
| `'daterange'` | bepDateRange | 日期区间（含图标+至）|
| `'time'` | bepTime | 单个时间 |
| `'timerange'` | bepTimeRange | 时间区间（含图标+至）|
| `'datetime'` | bepDateTime | 单个日期+时间 |
| `'datetimerange'` | bepDateTimeRange | 日期+时间区间（含图标+至）|

---

## 操作按钮（新增等）

**不属于筛选区。** 应单独放在筛选区下方的工具栏行，右对齐。
（为什么：新增是对表格数据的操作，不是筛选行为，混放语义不清）

**唯一例外：** bepFilterRow（条件极少时），操作按钮与筛选同行。

---

## 调用示例

```javascript
// 单行特殊
bepFilterRow(
  [{label:'菜单名称', placeholder:'请输入', width:200}],
  '+ 新增', TABLE_W
)

// 多条件展开态
bepFilterGrid([
  { label:'商品名称', placeholder:'请输入' },
  { label:'状态',     placeholder:'请选择',  type:'select' },
  { label:'创建时间', placeholder:'',        type:'daterange' },
], TABLE_W, false)

// 多条件折叠态
bepFilterGrid(filters, TABLE_W, true)
```
