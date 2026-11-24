# 缺省插画资产（Empty State Illustrations）

源文件真值在 Figma：`BeP移动端组件-S端` → 画板 **`138:3955`「35空状态」**
（fileKey `vIpu7tb1dguui3QuqYETtM`）。本目录是**导出并抠好白底的成品**，供 HTML 原型直接内嵌。

## 已有资产

| 文件 | 场景 | 插画组件名 | Figma nodeId | 尺寸 | 状态 |
|---|---|---|---|---|---|
| `empty.png` | 通用无内容 | `nothing_image_empty` | `138:4008` | 225×195 | 可用 |
| `record.png` | 记录为空 | `nothing_image_record` | `138:4013` | 225×195 | 可用 |
| `search.png` | 搜索无结果 | `nothing_image_search` | `138:3998` | 225×195 | 可用 |
| — | 网络异常 | `nothing_image_network` | `138:3984` | 225×195 | **待导出** |
| — | 定位失败 | `nothing_image_position` | `138:3979` | 225×195 | **待导出** |
| — | 未开通 | `nothing_image_fuction` | `138:3989` | 225×195 | **待导出** |
| — | 功能建设中 | `nothing_image_door` | `138:3994` | 225×195 | **待导出** |
| — | 功能维护中 | `nothing_image_wrong` | `138:4003` | 225×195 | **待导出** |

> 8 张全部为同一套吉祥物风格，可混用但要按场景选对：**不要拿一张图套所有场景**（见 `component-library.md` §6.36）。

## 怎么补齐剩下的 / 以后怎么新增

### 路径 A：Dev Mode MCP 直接导（最快，需 Figma 桌面端把组件库开在当前标签页）

```bash
# 确认当前活动标签页是组件库
node ~/.workbuddy/skills/figma-devmode-read/scripts/figma_mcp.mjs get_metadata | head -3

# 按 nodeId 导出（会把 PNG 存到 /tmp/figma_out_*.png）
node ~/.workbuddy/skills/figma-devmode-read/scripts/figma_mcp.mjs get_image '{"nodeId":"138:3984"}'
```

### 路径 B：设计师在 Figma 里手动 Export

选中插画 instance → Export → PNG → 1x（225×195 原尺寸即可，不要 2x，页面里靠 CSS 缩放会糊）。

### 必须做的一步：抠白底

```bash
python3 assets/empty-states/keyout.py <导出的.png|目录> assets/empty-states/
```

**为什么必须抠**：Figma 导出的 PNG 自带不透明白底（实测纯 `255,255,255`），贴到页面底色 `#F7F8FA` 上就是一块白方块。`keyout.py` 用边缘连通域把背景白清掉，同时保留插画内部被轮廓包住的白色（高光、白纸）。阈值默认 244，改之前先读脚本头部注释。

**抠完自检**：把 PNG 合成到 `#F7F8FA` 上看——不能有白方块，吉祥物的白色部件要还在。

## 怎么用进页面

```html
<!-- 位图直接 base64 内嵌，禁止外链 Figma 或任何图床 -->
<img src="data:image/png;base64,..." alt="" width="225" height="195">
```

完整结构、间距与文案规格见 `component-library.md` §6.36；
可运行示例见 `examples/empty-states/all-states.html`（8 场景交互演示 + 并排全览）。
