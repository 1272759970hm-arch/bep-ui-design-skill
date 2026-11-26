# Design QA 校验报告

- **校验对象**：`/tmp/qa-fix-demo.html`（类型：html）
- **执行时间**：2026-11-19T02:50:30.439Z → 2026-11-19T02:50:30.509Z
- **校验轮次**：2 轮（含自动修复后的二次校验）
- **最终判定**：**BLOCKED** — 校验条件不足 3 项，需补齐依据或人工裁决

## 校验依据（唯一真值）

- tokens: `/Users/hz/.workbuddy/skills/c-mall-designer/references/tokens.md` ✅ 已读取
- registry: `/Users/hz/.workbuddy/skills/c-mall-designer/references/component-registry.md` ✅ 已读取
- preamble: `/Users/hz/.workbuddy/skills/c-mall-designer/scripts/preamble.js` ✅ 已读取
- changelog: `/Users/hz/.workbuddy/skills/c-mall-designer/CHANGELOG.md` ✅ 已读取
- skill: `/Users/hz/.workbuddy/skills/c-mall-designer/SKILL.md` ✅ 已读取

> **校验条件不足声明**：
> - 需求还原校验：校验条件不足：缺少真实 PRD
> - 设计规范校验：硬判定=色板界面色/字重/C 常量；阶梯类（字号·间距·圆角）按规范局限汇总为 WARNING；素材色按规则 6 豁免留痕
> - 组件引用校验：HTML 交付物未使用 data-component 标记，组件引用路径/变体/插槽无法程序化校验（需 Figma 组件实例数据）→ 标 NOT CHECKED，不假装 PASS。
> - 视觉还原校验：校验条件不足：缺少参考图 / 渲染截图
> - 交互逻辑校验：本页未检出弹窗组件（.sheet 为内容容器，不作弹窗判定）；弹窗交互未检查
> - 未提供 Figma 终稿参考图与渲染截图，视觉还原维度按 BLOCKED 处理（不假装校验）

## 六大维度校验结果

| # | 维度 | 状态 | 检查统计 | 说明 |
|---|---|---|---|---|
| 01 | 需求还原校验 | ⛔ BLOCKED | total=0 / pass=0 / fail=0 / notChecked=0 / forbiddenHits=0 | 校验条件不足：缺少真实 PRD |
| 02 | 设计规范校验 | ⚠️ WARNING | checked=5 / pass=0 / fail=0 / warning=4 / blocked=1 / scanned=[object Object] | 硬判定=色板界面色/字重/C 常量；阶梯类（字号·间距·圆角）按规范局限汇总为 WARNING；素材色按规则 6 豁免留痕 |
| 03 | 组件引用校验 | ⬜ NOT CHECKED | totalCalls=0 / validCalls=0 / invalidCalls=0 / notChecked=1 / literalCandidates=0 / accuracy=N/A | HTML 交付物未使用 data-component 标记，组件引用路径/变体/插槽无法程序化校验（需 Figma 组件实例数据）→ 标 NOT CHECKED，不假装 PASS。 |
| 04 | 组件使用校验 | ✅ PASS | legacyHits=0 / structureChecks=19 / structureFail=0 | — |
| 05 | 视觉还原校验 | ⛔ BLOCKED | screenshots=0 / compared=0 | 校验条件不足：缺少参考图 / 渲染截图 |
| 06 | 交互逻辑校验 | ⬜ NOT CHECKED | checked=4 / pass=3 / fail=0 / warning=0 / notChecked=1 | 本页未检出弹窗组件（.sheet 为内容容器，不作弹窗判定）；弹窗交互未检查 |

## 1. 需求还原情况

> 需求覆盖 = 已命中/应命中；语义条目与未提供真实 PRD 的条目不判 PASS

- 状态：**⛔ BLOCKED**
- 统计：total=0 / pass=0 / fail=0 / notChecked=0 / forbiddenHits=0
- 说明：校验条件不足：缺少真实 PRD
- 本维度问题数：1

## 2. 设计规范符合情况

> 颜色/字号/字重/间距/圆角/阴影，依据 tokens.md 实读色板与数值集合

- 状态：**⚠️ WARNING**
- 统计：checked=5 / pass=0 / fail=0 / warning=4 / blocked=1 / scanned=[object Object]
- 说明：硬判定=色板界面色/字重/C 常量；阶梯类（字号·间距·圆角）按规范局限汇总为 WARNING；素材色按规则 6 豁免留痕
- 本维度问题数：5

## 3. 组件引用正确率

> 组件名、引用路径、API、属性、变体、插槽是否合法

- 状态：**⬜ NOT CHECKED**
- 统计：totalCalls=0 / validCalls=0 / invalidCalls=0 / notChecked=1 / literalCandidates=0 / accuracy=N/A
- 说明：HTML 交付物未使用 data-component 标记，组件引用路径/变体/插槽无法程序化校验（需 Figma 组件实例数据）→ 标 NOT CHECKED，不假装 PASS。
- 本维度问题数：1

## 4. 组件使用合规情况

> 是否复用标准组件、是否重复造轮子 / 错误组合 / 使用已作废形态

- 状态：**✅ PASS**
- 统计：legacyHits=0 / structureChecks=19 / structureFail=0
- 本维度问题数：0

## 5. 视觉还原评估

> 有终稿参考时做像素比对；布局/层级等定性判断明确标注

- 状态：**⛔ BLOCKED**
- 统计：screenshots=0 / compared=0
- 说明：校验条件不足：缺少参考图 / 渲染截图
- 本维度问题数：1

## 6. 交互逻辑完整性

> 按钮/弹窗/表单/状态切换的静态证据；运行时交互如实标注

- 状态：**⬜ NOT CHECKED**
- 统计：checked=4 / pass=3 / fail=0 / warning=0 / notChecked=1
- 说明：本页未检出弹窗组件（.sheet 为内容容器，不作弹窗判定）；弹窗交互未检查
- 本维度问题数：1

## 7. 发现的问题及修复记录

共 9 条问题（FAIL / WARNING / BLOCKED / NOT CHECKED）。每条含：问题描述、问题位置、对应规范、严重程度、修复建议、校验结果。

| ID | 维度 | 问题描述 | 问题位置 | 对应规范 | 严重程度 | 修复建议 | 校验结果 | 证据 |
|---|---|---|---|---|---|---|---|---|
| R-000 | 需求还原校验 | 未提供结构化 PRD/需求规格，需求还原校验无法执行 | /tmp/qa-fix-demo.html（整体） | Design QA 机制要求：需求还原以真实 PRD 为唯一依据 | MAJOR | 提供 qa/specs/*.json（source 标记为 prd）后重新校验 | ⛔ BLOCKED | opts.spec 缺失或非规范格式 |
| T-EXEMPT | 设计规范校验 | 按「界面用色规则 6」豁免 8 处非色板色值（画布外壳 / 系统控件 / 图片占位 / 活动素材），未做 Token 比对 | /tmp/qa-fix-demo.html | references/tokens.md「界面用色规则 6：商品照片、活动插画及原生系统控件沿用素材用色」 | INFO | 素材用色无 Token 依据，如需一致性校验请补充正式色板；本次按规范豁免，不判违规也不标 PASS | ⚠️ WARNING | body{background:#E7E9EC} → 画布外壳/系统控件/图片占位 \| /* ---------- Hero ---------- */ .hero{background:rgba(255,214,120,.55)} → 活动素材 \| /* ---------- Hero ---------- */ .hero{background:rgba(255,214,120,0)} → 活动素材 \| /* ---------- Hero ---------- */ .hero{background:#FF8F42} → 活动素材 \| /* ---------- Hero ---------- */ .hero{background:#F04700} → 活动素材 \| .cd-num{background:rgba(72,22,0,.34)} → 活动素材 \| .thumb{background:#F4F5F7} → 画布外壳/系统控件/图片占位 \| .home-bar{background:#111} → 画布外壳/系统控件/图片占位 |
| T-FS-OUT | 设计规范校验 | 字号阶梯外数值 10 种（9 / 10.5 / 11 / 12.5 / 13 / 13.5 / 15 / 20 / 22 / 104px） | /tmp/qa-fix-demo.html | tokens.md Typography（10/12/14/16px）\| registry 实测 pt 字号（10/12/13/14/15/20pt） | MINOR | 人工确认是否为组件实测字号；如需程序化硬判定，须先把完整字号表写入 tokens.md | ⚠️ WARNING | 规范仅给出阶梯值，未声明穷举白名单；且 HTML 预览稿 CSS px 与 Figma 实测 pt 非一一对应，静态无法判定是否违规 → 标 WARNING，交人工核对；明细 104px@1处, 15px@1处, 12.5px@1处, 20px@1处, 22px@2处, 11px@7处, 10.5px@3处, 13.5px@1处, 13px@1处, 9px@1处 |
| T-S-OUT | 设计规范校验 | 间距阶梯外数值 11 种（1 / 2 / 3 / 5 / 6 / 9 / 10 / 11 / 28 / 34 / 110px） | /tmp/qa-fix-demo.html | tokens.md Spacing（4/8/12/16/24/32） | INFO | 细调值优先对齐阶梯；确需保留请在设计说明中记录，本次不判违规 | ⚠️ WARNING | 规范仅给出阶梯值，未声明穷举白名单；且 HTML 预览稿 CSS px 与 Figma 实测 pt 非一一对应，静态无法判定是否违规 → 标 WARNING，交人工核对；明细 28px@3处, 5px@3处, 6px@4处, 3px@6处, 10px@5处, 1px@2处, 2px@2处, 34px@2处, 11px@1处, 9px@2处, 110px@1处 |
| T-R-OUT | 设计规范校验 | 圆角阶梯外数值 2 种（3 / 7px） | /tmp/qa-fix-demo.html | tokens.md Border radius（2/4/8/999）+ registry 组件实测特例（r9/r12/r16/r18） | INFO | 人工确认是否为组件实测圆角；组件特例已按 registry 放行 | ⚠️ WARNING | 规范仅给出阶梯值，未声明穷举白名单；且 HTML 预览稿 CSS px 与 Figma 实测 pt 非一一对应，静态无法判定是否违规 → 标 WARNING，交人工核对；明细 3px@2处, 7px@1处 |
| T-SH | 设计规范校验 | 使用 2 处 box-shadow，但规范未定义阴影 Token，无法判定是否合规 | /tmp/qa-fix-demo.html | references/tokens.md（无 Shadow 章节） | MINOR | 补充阴影 Token 后校验；本次不得标 PASS | ⛔ BLOCKED | /* ---------- 手机画布 ---------- */ .phone:29 → 0 16px 56px rgba(20,24,32,.18) \| /* ---------- 白底吸顶区 ---------- */ .sheet:92 → 0 -3px 12px rgba(24,18,12,.05) |
| C-HTML-000 | 组件引用校验 | 组件名称/引用路径/变体/插槽无结构化数据，未执行检查 | /tmp/qa-fix-demo.html | Design QA：组件引用以组件库实例数据为依据 | INFO | 输出 Figma 脚本或加 data-component 标记后校验 | ⬜ NOT CHECKED | data-component 标记数 = 0 |
| V-000 | 视觉还原校验 | 缺少 Figma 终稿参考截图或实际渲染截图，视觉还原校验未执行 | reference=未提供 / screenshot=未提供 | Design QA 机制：有视觉参考时必须做截图比对；条件不足不得标 PASS | MAJOR | 提供 --reference <figma-final.png> --screenshot <render.png>；渲染用无头 Chrome 截图 | ⛔ BLOCKED | 文件参数缺失 |
| I-4 | 交互逻辑校验 | 点击后跳转、异步数据加载、倒计时动效时序等运行时交互未执行检查 | /tmp/qa-fix-demo.html | Design QA：静态源码无法验证运行时行为 | INFO | 接入 Playwright/浏览器自动化用例（本次不具备该条件） | ⬜ NOT CHECKED | 未运行浏览器自动化 |

### 代码检查 / 构建 / 自动化测试

> 依据：Design QA 自动化校验机制「有代码输出时，执行代码检查、构建和必要的自动化测试」。JS 交付物执行 `node --check` + 按 INDEX.md 构建 + Figma API mock 空跑（paint 结构 / 越界 / 未定位断言）；HTML 执行标签配对与 CSS 括号平衡构建检查。

| ID | 检查项 | 结果 | 校验结果 | 证据 |
|---|---|---|---|---|
| K-BUILD | HTML 构建检查通过（标签配对 / CSS 括号平衡 / style 闭合） | 通过 | ✅ PASS | style=1 块；检查项：标签配对 / 花括号平衡 / style 闭合 |
| K-TEST | HTML 交付物未接入渲染自动化用例（无头 Chrome 截图 / DOM 断言），运行时交互未执行测试 | 见建议 | ⬜ NOT CHECKED | 本次未运行浏览器自动化 |

### 自动修复记录

| 轮次 | 目标 | 替换 | 次数 | 对应问题 | 备份 |
|---|---|---|---|---|---|
| 1 | qa-fix-demo.html | `lucide:chevron-left` → `solar:alt-arrow-left-outline` | 1 | U-L-L-ICON-001-279 | `/tmp/qa-fix-reports/backups/qa-fix-demo.html.1795056630479.bak` |
| 1 | qa-fix-demo.html | `rgba(...,.09 / .45)` → `rgba(...,.08 / .24)` | 1 | U-L-L-TAG-001-153 | `/tmp/qa-fix-reports/backups/qa-fix-demo.html.1795056630479.bak` |
| 1 | qa-fix-demo.html | `#666666` → `#646566` | 1 | U-L-L-COLOR-001-12 | `/tmp/qa-fix-reports/backups/qa-fix-demo.html.1795056630479.bak` |
| 1 | qa-fix-demo.html | `#CCCCCC` → `#C8C9CC` | 1 | U-L-L-COLOR-002-12 | `/tmp/qa-fix-reports/backups/qa-fix-demo.html.1795056630479.bak` |

### 逐轮结果

| 轮次 | 问题总数 | FAIL | WARNING | BLOCKED | NOT CHECKED | 自动修复数 |
|---|---|---|---|---|---|---|
| 1 | 13 | 4 | 4 | 3 | 2 | 4 |
| 2 | 9 | 0 | 4 | 3 | 2 | 0 |

## 8. 尚未解决的问题及原因

| ID | 状态 | 原因 / 阻塞条件 | 建议 |
|---|---|---|---|
| R-000 | ⛔ BLOCKED | opts.spec 缺失或非规范格式 | 提供 qa/specs/*.json（source 标记为 prd）后重新校验 |
| T-SH | ⛔ BLOCKED | /* ---------- 手机画布 ---------- */ .phone:29 → 0 16px 56px rgba(20,24,32,.18) \| /* ---------- 白底吸顶区 ---------- */ .sheet:92 → 0 -3px 12px rgba(24,18,12,.05) | 补充阴影 Token 后校验；本次不得标 PASS |
| C-HTML-000 | ⬜ NOT CHECKED | data-component 标记数 = 0 | 输出 Figma 脚本或加 data-component 标记后校验 |
| V-000 | ⛔ BLOCKED | 文件参数缺失 | 提供 --reference <figma-final.png> --screenshot <render.png>；渲染用无头 Chrome 截图 |
| I-4 | ⬜ NOT CHECKED | 未运行浏览器自动化 | 接入 Playwright/浏览器自动化用例（本次不具备该条件） |
| K-TEST | ⬜ NOT CHECKED | 本次未运行浏览器自动化 | 接 --screenshot 走视觉比对；交互用浏览器自动化 E2E |

---

> 状态定义：PASS=已实际检查且通过；FAIL=已实际检查发现硬性违规；WARNING=已检查发现非阻断偏差/依据为样例；BLOCKED=校验条件不足或需人工裁决；NOT CHECKED=本次未执行检查。**未实际检查的内容一律不标 PASS。**
> 自动修复仅覆盖样式/Token/组件名的确定性替换，不改动业务文案、区块结构与交互逻辑。