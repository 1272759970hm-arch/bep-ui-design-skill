# 图标库补充规则（外部开源库，非 BEP-S 原生数据）

> 2025-08 新增。之前生成页面时，BEP-S 图标 COMPONENT_SET 没覆盖到的图标（导航返回箭头、选择器右箭头、上门/电话/企微、搜索、筛选等）全靠 AI 手绘 SVG 凑数，用户反馈"太丑了"。现在改成接入真实的开源图标库，结构化数据在 [icon-library.json](icon-library.json)。

## 选了哪个库，为什么

**字节跳动 IconPark**（MIT License）。2025-08 更正：原来用的是 Ant Design Icons（蚂蚁集团，MIT License），用户直接要求换成字节的库，换源理由：

1. MIT 协议，可以直接把 SVG 嵌进页面里商用，没有法律风险——这条跟 Ant Design 一样，不是新增优势。
2. 用户主观判断字节的图标视觉质量更好，这是业务方的选型决定，不是 AI 自己判断出"字节一定比蚂蚁好"——两个库客观上都是靠谱的企业级开源图标库，选型本质是用户偏好，不是技术优劣。
3. 覆盖面同样广（2600+图标），目前用到的16个图标都能找到对应项或更贴切的同义项（比如"门店配送"从泛用的 `Car` 换成语义更准的 `Truck`，"工作台"从 Ant Design 的 `appstore` 换成语义/形状都对应的 `AllApplication`）。

⚠️ 换源代价：之前已经生成的几个测试页面（`examples/` 目录下的 repair-request-form / task-execution / fulfillment-detail）用的还是 Ant Design 图标，不会因为这次换源自动更新——它们是"某个时间点的产出快照"（`examples/README.md` 里本来就有这条声明），如果要统一成新图标库，需要重新生成，不属于本次改动范围。

## 数据是怎么来的，为什么可信

`icon-library.json` 里每一条的 SVG 内容，都是 2025-08 用 `curl` 直接从 `raw.githubusercontent.com/bytedance/IconPark` 官方仓库拉取的 TS 源文件解析出来的，不是凭记忆转述、也不是让 AI"照着样子画"的近似图形。IconPark 的源文件是 JS 字符串拼接形式（不是现成 SVG 文件），拉取后解析出 outline 主题的**官方默认渲染参数**（`colors=[currentColor,none,currentColor,none]`、`strokeLinecap=round`、`strokeLinejoin=round`）——这几个值都是从 IconPark 仓库自己的 `packages/svg/src/runtime/index.tsx` 里的 `DEFAULT_ICON_CONFIGS` 常量读到的官方默认值，不是 AI 猜的粗细/颜色数字。每条记录都保留了 `verifiedFrom` 字段说明这个来源方式，理论上可以重新拉取核验。

> ⚠️ **stroke-width 全局更正（2025-08，唯一偏离 IconPark 官方默认值的参数）**：`DEFAULT_ICON_CONFIGS` 官方默认 `strokeWidth=4`，但用户先后两次拿真实 BEP-S 页面截图跟生成结果比对，都反馈图标显得"细/粗糙"——第一次只针对"选择触发行"箭头单独开了个 `chevron-right-bold` 变体（stroke-width调到6），第二次在导航栏返回箭头/搜索/筛选图标上又被指出同样问题，说明这不是个别图标的孤立情况，是 IconPark 默认粗细在 BEP-S 常用的 18-24px 小尺寸场景下普遍偏细。因此把 `icon-library.json` 里全部16个 IconPark 图标的 `stroke-width` 统一从 4 改成了 6（原来单独的 `chevron-right-bold` 变体也合并回了主条目，不再需要区分"细/粗"两个版本），A/B 比对过 4/6/8 三档，6 更贴近真实观感又不会显得太笨重。以后新增 IconPark 图标时也要用 `stroke-width=6`，不要退回官方默认的 4。

这和之前"手绘 SVG 近似"的做法有本质区别，标记也不一样：

| 状态 | 手绘近似的做法 | 现在的做法 |
|---|---|---|
| 图标视觉 | AI 现场画的近似路径，形状是猜的 | 从开源库官方文件直接拉取解析的真实路径 |
| `data-bep-status` | `AI_PROPOSED` | `EXTERNAL_STANDARD` |
| `data-bep-source` | `ai-decision` | `icon-library` |
| 可信度 | 纯 AI 判断，不可复核 | 有具名开源库+MIT协议+可复核的拉取记录 |

## 使用规则（跟 interaction-adaptive-tokens.json 的 `EXTERNAL_STANDARD` 是同一套体系）

1. **优先级**：如果 BEP-S 自己的图标 COMPONENT_SET（`component-registry.json` 里的"图标"条目）已经有对应真实图标，永远优先用那个，不要因为这里有现成的开源图标就跳过 BEP-S 真实组件——`EXTERNAL_STANDARD` 只填 BEP-S 没有的空白，不跟真实组件抢位置。
2. 引用这里的图标时，`data-bep-status` 标 `EXTERNAL_STANDARD`，`data-bep-source` 标 `icon-library`，不能标成 `REMOTE_INSTANCE`/`COMPONENT_SET`——它真实，但不是 BEP-S 自己的。
3. 图标颜色/尺寸仍然要用 BEP-S 的 Token（`icon.color`/`icon.size.default` 等），只有形状（`innerSVG`）是外部来源，不要连颜色尺寸规则也一起换成 IconPark 自己的默认值——`innerSVG` 里已经把颜色替换成 `currentColor`，正好方便用 CSS 的 `color` 属性统一控制。
4. 以后遇到新的图标空白，同样去 IconPark 官方仓库拉真实 SVG（用同样的 outline 主题默认参数解析方式），追加进 `icon-library.json`，不要退回手绘、也不要中途换回 Ant Design（除非用户再次明确要求）。如果 IconPark 也没有贴切的图标，才允许标 `AI_PROPOSED` 手绘，且要在报告里说明"连开源库里也没找到对应图标"。

## 金刚区（图标宫格快捷入口）专用规则：Solar Icons（Bold Duotone），需要署名

> 2025-08 新增，同一天内三次更正，完整过程都留在这里，因为最终方案带着一个"必须实际执行"的义务（署名），以后有人质疑"为什么金刚区图标是这个来源""署名去哪了"时，答案都在这。

**起因**：一个真实业务原型「履约工作台」里的"金刚区"（首页顶部扫码核销/门店配送/订单任务/异常处理快捷入口）用了 Ant Design 线性单色图标，用户反馈"金刚区设计太平淡了"——这不是图标造假问题，是场景判断问题：金刚区天然偏 C 端消费级视觉语言，线性单色图标会显得像"设置页"而不是"入口区"。这条判断由 AI 主动做出、写入规则，不是等用户点名才改。

**第一、二次尝试（已被否决）**：Microsoft Fluent Emoji「Color」扁平风格、「3D」玻璃质感风格，都是真实拉取的 MIT 素材，但跟用户给的参考截图（哈啰出行金刚区，玻璃质感+渐变+高光的"立体糖果"风格）差距明显，两次都被否决。

**排查过但没采用的其他候选**：

| 候选库 | 协议 | 结论 |
|---|---|---|
| 字节 IconPark | MIT，免署名 | 只有纯色/双色/四色平铺，没有渐变玻璃质感，风格不匹配（但适合B端单色图标，见上方"数据来源"章节） |
| 3dicons.co | CC0，免署名 | 风格最接近"立体糖果"参考截图，但完整目录（约200个图标）里没有扫码/卡车配送/订单清单/警告这几个具体图标 |
| Icons8 3D 系列 | 免费版要求署名，付费去署名 | 大概率风格和覆盖度都够，但当时没让业务方拍板要不要接受署名，先放弃了 |

**过渡期决定**：用户先让"等设计团队出定制资产，当前用占位图撑版式"，`colorfulIcons` 一度短暂用 `PLACEHOLDER_PENDING_DESIGN` 状态标记（详见 design-tokens.json 的 `usageRule`），复用第一次尝试的 Fluent Emoji Color 素材撑场面。

**第三次尝试（用户看了另一张不同风格的参考图后，最终采用）**：用户又发来一张车服类App的金刚区截图，风格是"剪影主图形 + 同色浅透明度高光角标"（不是玻璃质感3D，是更扁平的双色层次），要求查有没有对应的开源库。查到 **Solar Icons**（作者 480 Design，通过 [Iconify](https://iconify.design) 的 `solar` 合集分发，7476个图标，`Bold Duotone` 主题正好是这个视觉结构——单一颜色 + `opacity=".5"` 的背景层，靠透明度区分主次而不是真的多段渐变，但视觉效果很接近）。查到的四个图标：`solar:qr-code-bold-duotone`（扫码核销）、`solar:clipboard-list-bold-duotone`（订单任务）、`solar:delivery-bold-duotone`（门店配送，字面意义的"配送"图标，比之前任何候选都更精确）、`solar:danger-triangle-bold-duotone`（异常处理）。用户确认"接受Solar署名，用它"后正式采用，见 `icon-library.json` 的 `colorfulIcons` 分组。

**⚠️ 唯一遗留义务——署名，这条必须真的执行，不是写在这份文档里就算完成**：Solar Icons 用的是 **CC BY 4.0**，不是免署名协议，这是它跟之前所有候选（Ant Design/IconPark/Fluent Emoji/3dicons）唯一的、也是关键的区别。

⚠️ 2025-08 更正（第一版做法被用户否决）：第一版直接在生成的业务页面（比如"履约工作台"）底部加了一行可见署名文字，用户反馈"这样肯定不行"——确实不实用，正常App不会在每个业务页面上挂第三方素材的署名，这不是行业惯例。

**正确做法**：署名应该集中放在整个App统一的一个地方——"设置-关于-开源软件声明/第三方内容声明"这类页面，把所有用到的第三方素材（不只是图标，包括其他开源组件）的署名都列在那一处，参考格式："部分图标来自 Solar Icons by 480 Design (CC BY 4.0)"，附来源链接。**这是App级别的一次性工程配置，不是每个生成页面自带的产出物**——生成带金刚区图标的页面（HTML本身）不需要包含任何可见的署名文字，只需要在生成报告里提醒一句"这个App需要有开源软件声明页收录 Solar Icons 的署名（如果目前还没有的话）"，让业务方自己决定放在哪个已有页面或新建哪个页面，不要替业务方决定页面结构。**每次用这份 Registry 生成带金刚区图标的页面时，报告里都要提醒这条署名义务**（提醒到位就算完成AI这一侧的责任，不代表要在生成的HTML代码里体现），这是这四个候选库里唯一会在产品上线后被追责的合规风险点，不是普通的设计规范提醒。

**规则**：
1. 金刚区图标固定用 `colorfulIcons` 分组里的 Solar Bold Duotone 素材，`data-bep-status` 标 `EXTERNAL_STANDARD`（不再是占位），`data-bep-source` 标 `icon-library`，但 `data-bep-note` 必须带上"CC BY 4.0需署名"字样，不能省略。
2. 图标本身用 `currentColor`承接颜色，实际颜色（含 `opacity=".5"` 的背景层跟着主体一起变色）由使用处的 CSS `color` 属性指定——允许按图标语义分别配色（比如警告用红橙色系、常规操作用蓝色系），这跟B端单色图标"整批统一一个颜色"的规则不同，因为 Bold Duotone 这套图标本身就是靠色相/层次做区分的设计语言。
3. 背景容器沿用之前定的规则：中性色背景（白色或 `color.fill.1` 极浅灰），不需要再叠加强调色色块——图标自己已经有足够的视觉层次。
4. 如果以后设计团队交付了真正的定制资产（比这套开源库更贴合品牌），替换时把 `data-bep-status` 换成新状态并把 Solar 的记录存档，不要直接覆盖删除——参考之前 Fluent Emoji 素材的处理方式。
5. B端功能性图标（导航栏、表单内小图标、列表行内小图标等非金刚区场景）不受这条规则影响，仍然默认用字节 IconPark 线性单色图标，见上方"数据来源"章节。
