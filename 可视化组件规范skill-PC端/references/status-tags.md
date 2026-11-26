# 带边框状态标签

用户于2026-11-18指定来源：[7952:98702](https://www.figma.com/design/2oSqZAFWhrtQoOytyamFOn/?node-id=7952-98702)。此规范用于高／低户效等业务状态，不是同比环比标签。原始参数与五态保留文字SVG见[提取目录](../assets/status-tags/)。离线使用不依赖Figma。

## 实测视觉

- PingFang SC Regular，12px／20px，字距0；不使用DIN或加粗字体。
- 标签总高22px；两字40px、三字52px，文字左右各8px。边框与背景使用内部矩形，不能误读外层实例的空fills、零圆角为无背景无描边。
- SVG描边1px，矩形位于0.5px，路径圆角rx1.5，外轮廓对应2px圆角；非胶囊。
- CSS使用border-box、height22px、padding-inline7px、border1px、border-radius2px，文字行高20px，得到与原稿一致的文字起点8px。三字“高户效／低户效”宽52px。

|原始状态|文字|背景|边框|实例|
|---|---|---|---|---|
|未生效|#BBBBBB|#FAFAFA|#D9D9D9|7952:98685|
|提示|#006D9B|#E6F0F5|#CCE2EB|7952:98686|
|正常|#3BBB3E|#EBF8EC|#D8F1D8|7952:98687|
|严重|#FFA645|#FFF6EC|#FFEDDA|7952:98688|
|危险|#FE5E54|#FFEFEE|#FFDFDD|7952:98689|

## 户效绑定

- 业务文案仅分“高户效／低户效”，同一指标只显示当前状态，不把两种状态并排作为结果。
- 当前页面已有“高户效”结论，采用正常绿色边框样式；不沿用之前自建的#D9F4EE实底标签。
- 用户于2026-11-18明确指定：低户效采用橙色，绑定原规范“严重”样式（tone="severe"）：文字#FFA645、背景#FFF6EC、边框#FFEDDA。高户效绑定正常绿色（tone="normal"）。这是用户确认的户效业务映射，保留原组件字体、几何与描边，不改成红色或实底胶囊。
- 不根据标签反推公式、阈值或等于中位数时的分类；业务输入明确状态时直接绑定，不新增目标完成率或涨跌箭头。

## HTML复用

默认生成器已通过runtime-manifest接入随包[status-tags.css](../assets/status-tags/status-tags.css)，CSS会内嵌进最终自包含HTML。页面配置使用`{"type":"statusTag","props":{"status":"高户效"}}`或`{"type":"statusTag","props":{"status":"低户效"}}`，自动绑定已确认的绿色／橙色。手工HTML示例：`<span class="yk-status-tag" data-tone="normal">高户效</span>`。字体回退不是原样验收；运行环境缺少PingFang SC时须披露，不能把CSS中写了字体名当作实际命中字体。

低户效示例：`<span class="yk-status-tag" data-tone="severe">低户效</span>`。也可使用`data-status="高户效"`或`data-status="低户效"`直接绑定随包CSS中的业务映射。

原始SVG保留原始“正常／严重”等文字作为来源对照；业务页面用可绑定HTML文字，不直接把“正常”当作“高户效”显示。原始JSON包括五个主组件key、实例ID与逐段字体。已核实原始参数和SVG；本次未完成页面替换或新增标签的浏览器视觉验收。
