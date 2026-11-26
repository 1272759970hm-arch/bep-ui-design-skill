# Design QA · 设计质量校验机制

> 让 Skill 不仅能生成设计稿，还能像专业设计走查一样**自动发现问题、验证规范、修复错误**。
> 不是提示词自检，而是可执行、可验证、可修复的脚本流程。接入 `SKILL.md` Step 14–17。

---

## 1. 工作流位置

```
产品分析 → 信息架构设计 → UI 视觉设计 → 设计输出 → 自动质量校验 → 问题修复 → 二次校验 → 最终交付
                                          Step 14      Step 15        Step 16     Step 17      Step 17
```

每次设计输出**必须**生成一份 Design QA 报告，随交付一起给出。

---

## 2. 快速开始

```bash
cd ~/.workbuddy/skills/c-mall-designer

# 单文件校验（HTML 交付稿）
node qa/qa-run.mjs --target /path/to/大促商品列表页.html --out qa/reports

# 多文件（HTML + 5 个 tpl 模板）一次性跑
node qa/qa-run.mjs --target <a.html> --target <b.html> \
  --target templates/tpl-home.js --target templates/tpl-detail.js ... --out qa/reports

# 带真实 PRD 的结构化需求规格
node qa/qa-run.mjs --target <file> --spec qa/specs/<项目>-prd.json --out qa/reports

# 带 Figma 终稿参考图 + 渲染截图做视觉比对
node qa/qa-run.mjs --target <file> \
  --reference <figma-final.png> --screenshot <render.png> \
  --reference-source figma-final --out qa/reports

# 自动修复闭环（校验 → 修复 → 二次校验 → 报告），修复前自动写 .bak 备份
node qa/qa-run.mjs --target <file> --fix --max-rounds 3 --out qa/reports

# CI / 门禁：FAIL 或 BLOCKED 退出码 1
node qa/qa-run.mjs --target <file> --strict --out qa/reports
```

**参数**：`--target`（可多次；也支持目录）、`--spec`、`--reference`、`--screenshot`、
`--reference-source figma-final|approved-design|product-prototype`、`--fix`、`--max-rounds`、
`--max-diff`、`--python`、`--out`、`--strict`、`--json-only`。

渲染截图可用无头 Chrome：
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --force-device-scale-factor=2 --window-size=375,812 \
  --screenshot=/tmp/render.png "file:///path/to/page.html" --virtual-time-budget=4000
```

---

## 3. 六大校验维度

| # | 维度 | 模块 | 检查内容 |
|---|---|---|---|
| 01 | 需求还原 | `rules/01-requirements.mjs` | PRD 功能/字段/流程覆盖，需求遗漏、擅自增加；语义条目标 `NOT CHECKED` |
| 02 | 设计规范 | `rules/02-tokens.mjs` | 颜色/字号/字重/间距/圆角/阴影，依据 `tokens.md` 实读；素材色按规则 6 豁免 |
| 03 | 组件引用 | `rules/03-component-ref.mjs` | helper 白名单、TAG_SPEC 语义键、Solar 图标源、按钮 type；虚构组件 FAIL |
| 04 | 组件使用 | `rules/04-component-use.mjs` | legacy 黑名单、价格到手价结构、标签首行对齐、加购圆钮规格、Tabbar 84 |
| 05 | 视觉还原 | `rules/05-visual.mjs` | Figma 终稿/批准稿截图像素比对；信息层级/审美明确 `NOT CHECKED` |
| 06 | 交互逻辑 | `rules/06-interaction.mjs` | 按钮状态、Tabs 选中态、弹窗遮罩/关闭、表单标签；运行时交互 `NOT CHECKED` |

**代码检查 / 构建 / 自动化测试**（`lib/code-check.mjs`，独立阶段）：
- 构建：按 `templates/INDEX.md` 把 `tpl-*.js` 插入 preamble 的 `# 在此填入页面代码` 占位符
- 代码检查：`node --check` 真实语法检查
- 自动化测试：Figma API mock 空跑，断言 paint 结构 / 渐变 stops alpha / 越界 / 未定位
- HTML：标签配对、CSS 花括号平衡、style 闭合

---

## 4. 状态语义（严格）

| 状态 | 含义 |
|---|---|
| `PASS` | **已实际执行检查**且通过 |
| `FAIL` | 已实际执行检查，发现硬性违规 |
| `WARNING` | 已检查，发现非阻断偏差 / 依据为样例 / 规范仅给阶梯无法穷举判定 |
| `BLOCKED` | **校验条件不足**（缺 PRD / Token / Figma 参考图 / 渲染环境 / Shadow Token）或需人工裁决 |
| `NOT CHECKED` | 本次未执行检查（运行时行为、审美判断、无结构化组件数据） |

> **没有实际检查的内容不得标 PASS。** 缺依据时明确写 `BLOCKED` 并列出原因，绝不假装完成校验。

---

## 5. 校验依据（唯一真值）

| 依据 | 用途 |
|---|---|
| `references/tokens.md` | 色板 / 字号阶梯 / 间距阶梯 / 圆角阶梯 / 字重 / 界面用色规则 6 |
| `references/component-registry.md` | 组件登记表、组件实测特例（r9 / 2.23 / 0.86）、图标体系 |
| `scripts/preamble.js` | helper 白名单、C 常量色板、TAG_SPEC 语义键 |
| `CHANGELOG.md` | 已作废形态 → `rules/legacy.mjs` 黑名单 |

**禁止凭空编造校验标准**：早期版本把规范全文出现过的所有 `px/pt` 数值当白名单
（把笔画 2.23、tabbar 84、按钮 106×40 当成合法字号），已废弃。现在只对**规范明确声明的
唯一真值**判 FAIL；规范只给出「阶梯」而非穷举白名单的项目，阶梯外数值汇总为 `WARNING`
并列明细交人工核对。

**豁免区**（依据 tokens.md「界面用色规则 6：商品照片、活动插画及原生系统控件沿用素材用色」）：
`body` / `.phone` / `.home-bar` / `.statusbar` / `.sysicons` / `.thumb` / `.avatar` /
`.hero::after` 及 Hero / 活动渐变等非色板色值 → 留痕 `WARNING`，不判违规，也不假 PASS。

---

## 6. 自动修复闭环

```
六维检查 → 识别违规与位置 → 分析原因与规范 → 自动修复确定性问题 → 重新校验 → 输出报告
                                      ↑________________ 重复直到收敛 _______________|
```

**允许自动修**（确定性替换）：
- 旧色值 → N 系列定稿色（`#666666→#646566`、`#CCCCCC→#C8C9CC` …）
- `lucide:*` → Solar（**仅** registry §6 对照表内已登记映射，未登记则跳过，不编造图标名）
- 标签 tinted 旧透明度 → 定稿值（**仅** `rgba()` 第 4 位 `.09→.08` / `.45→.24`）

> 关键防护：早期裸正则 `/0\.09|0\.45/` 会命中 SVG path 坐标与 `opacity=".45"`，
> 且全局替换会破坏 SVG。现在用规则自带的精确回调，只改颜色函数内的 alpha 位。

**禁止自动修**：业务文案、区块结构、交互逻辑、组件形态（32×32 加购钮 / 描边 pill /
icon+文字按钮等）→ 一律标 `FAIL` 并给人工修复建议，**不得为通过校验降低设计要求**。

修复前自动写 `qa/reports/backups/<file>.<ts>.bak`，可随时回滚。

---

## 7. 报告结构（8 个章节）

1. 需求还原情况 2. 设计规范符合情况 3. 组件引用正确率 4. 组件使用合规情况
5. 视觉还原评估 6. 交互逻辑完整性 7. 发现的问题及修复记录 8. 尚未解决的问题及原因

另含：校验依据、六大维度总表、**代码检查/构建/自动化测试**记录、自动修复记录、逐轮结果。
每个问题标注：**问题描述 / 问题位置 / 对应规范 / 严重程度 / 修复建议 / 校验结果**（+ 证据）。
输出 `qa/reports/<name>-<ts>.md` 与 `.json` 双份（json 供 CI 消费）。

---

## 8. 模块化扩展

新增校验维度只需两步：

1. 在 `qa/rules/` 新建 `NN-xxx.mjs`，导出：
   ```js
   export const meta = { id:'07', key:'xxx', name:'新维度', requires:['tokens','registry'] };
   export function check(ctx, target, opts = {}) {
     return { issues: [/* issue({...}) */], note:'', stats:{}, blocked:false };
   }
   ```
   `meta.requires` 声明依赖的依据文件；缺失时引擎自动标 `BLOCKED`，无需自己判。
2. 在 `qa/rules/index.mjs` 的 `RULES` 数组里登记该模块。

`lib/` 提供公共件：`issue.mjs`（状态与问题结构）、`context.mjs`（依据加载）、
`html-extract.mjs` / `js-extract.mjs`（静态提取）、`report.mjs`（报告）、
`code-check.mjs`（代码检查）、`visual-diff.py`（像素比对）。

---

## 9. 已知条件不足（如实标注，不假装完成）

| 项 | 现状 | 状态 |
|---|---|---|
| 真实 PRD | 未提供结构化 PRD（仅 `specs/*.sample.json` 格式示例） | `BLOCKED` |
| Figma 终稿参考图 | 未提供；设计稿无法从桌面端当前活动文件读取 | `BLOCKED` |
| 组件实例数据 | HTML 交付物无 `data-component` 标记，引用路径/变体/插槽 | `NOT CHECKED` |
| 阴影 Token | `tokens.md` 无 Shadow 章节 | `BLOCKED` |
| 运行时交互 | 无浏览器自动化 E2E 环境 | `NOT CHECKED` |
| 视觉层级/审美 | 静态像素差异不等价于视觉一致性 | `NOT CHECKED` |
| 规范冲突 | `#333333` 在 tokens 标旧值、在 registry §2 双段胶囊为实测特例 | 降 `MINOR` + 冲突说明，人工裁决 |

补齐任一项后重跑即可自动解除对应 `BLOCKED` / `NOT CHECKED`。
