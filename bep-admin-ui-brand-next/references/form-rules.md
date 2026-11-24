# 表单标签规范

---

## 核心规则

**标签右对齐。** 所有标签文字的右边缘对齐到 LABEL_W 基准线。
（为什么：右对齐让标签与输入框的视觉距离恒定，扫读更流畅）

**同一表单所有 bepFormItem 必须用同一个 LABEL_W。**
（为什么：不同 LABEL_W 会导致控件左边缘不对齐，视觉混乱）

**字段标题最多 8 个汉字。** LABEL_W 固定按“8 个汉字 + 必填星号”预留；超过 8 个汉字不得自动扩宽、换行或截断，必须要求产品/业务简化字段名。

---

## LABEL_W 确定方法

**固定方法（唯一）：**
```javascript
var LABEL_W = 90; // 8个汉字宽度 + 必填星号预留
```

生成表单前必须检查所有字段名：`label.replace(/\*/g, '').length <= 8`。超过 8 个汉字时，不生成替代缩写，不自行改名，在交付说明中标出并要求产品/业务确认简化命名。

---

## 间距规范

```
LABEL_GAP  = 12    // 标签区右边缘 → 控件左边缘
FIELD_GAP  = 20    // 表单行之间的垂直间距
CTRL_H     = 32    // 控件高度（固定）
```

---

## 必填标记

- 位置：标签文字左侧，间距 4px
- 样式：`*`，14px，#FE5E54（危险红）
- bepFormItem 传 `required:true` 自动处理

---

## 错误状态

- 控件边框变红：#FE5E54，1px INSIDE
- 控件下方显示错误文字：12px，#FE5E54，上方间距 4px
- bepFormItem 传 `error:'错误提示'` 自动处理
- **错误文字不改变行高**：bepFormItem 高度固定 = CTRL_H = 32px，FIELD_GAP 固定 20px
  错误文字（y = CTRL_H + ERR_GAP = 36）浮于 20px gap 区域内显示，frame clip:false 保证可见
  下一行 FormItem 始终从 CTRL_H + FIELD_GAP = 52px 处开始，与有无错误无关

---

## 禁用状态

bep-components.js 暂未封装禁用态，手动实现：
```javascript
var ctrl = bepSelect('菜单', CTRL_W, 32);
ctrl.fills = bepSolid(bepHex('F5F5F5'));   // 灰色背景表示禁用
// 同时可降低文字 opacity 加强视觉提示
```
<!-- TODO: 正式禁用态样式（边框颜色/文字颜色）待确认 -->

---

## 提示文字

字段下方的辅助说明：
```javascript
var tip = bepText('格式说明…', bepHex('8C8C8C'), 12, {lh:20});
tip.x = LABEL_W + LABEL_GAP;
tip.y = fieldItem.y + fieldItem.height + 4;
```

---

## 表单结构示例（抽屉内）

```javascript
var LBL  = 90;
var GAP  = 12;
var DRW_W = 640;
var CTRL_W = DRW_W - 24*2 - LBL - GAP;  // = 490

var fields = [
  { label:'菜单类型', required:true,  ctrl: bepSelect('请选择', CTRL_W, 32) },
  { label:'菜单名称', required:true,  ctrl: bepInput('请输入', CTRL_W, 32) },
  { label:'排序',     required:false, ctrl: bepInputNumber('1', CTRL_W, 32) },
  { label:'状态',     required:false, ctrl: bepSwitch(true,'启用','停用') },
];

var fy = 0;
var formContent = bepFrame(DRW_W - 48, 100, {name:'Form'});
formContent.fills = [];

fields.forEach(function(f, i) {
  var item = bepFormItem(f.label, f.ctrl, { labelW:LBL, gap:GAP, required:f.required });
  item.x = 0; item.y = fy;
  formContent.appendChild(item);
  fy += item.height + (i < fields.length-1 ? 20 : 0);
});
formContent.resize(formContent.width, fy);
```
