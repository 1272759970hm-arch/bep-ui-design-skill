# Design QA 真源证据目录

放置设计校验的外部真源。脚本会自动发现，也可用 `--prd` / `--figma` 显式指定任意路径。

## 约定结构
```
evidence/<模块>/<页面>/prd.md        需求清单（D1 需求还原）
evidence/<模块>/<页面>/figma.json    Figma 尺寸/节点参考（D5 视觉还原）
```

## figma.json 格式
```json
{ "dimensions": { "CANVAS_W": 1440, "SIDE_W": 208, "HDR_H": 96 } }
```

无证据时 D1/D5 记 BLOCKED（不计为 PASS），不会假装完成校验。
