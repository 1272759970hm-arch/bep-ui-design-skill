# 月份经营仪表数据约定

原节点 6695:316886 内圈包含三个独立弧形（6695:316908/316909/316910），innerRadius 约 0.72，源色为蓝、青、浅蓝。6695:316907 为旋转参照矩形，邻近原文为「军令状 46.5亿」。形状与绝对坐标记录保存在 evidence/monthly-gauge-shapes-2026-11-18.json。

每月可给 sectors 数组，每项含 name 和非负 value，最多三项。合计须等于当月 actual。分段金额使用 annualTarget 的共同分母；原稿中的业务占位名称和弧度不直接作为具体项目分母依据。referenceValue 与 annualTarget 使用相同金额单位，对应的 referenceLabel 由业务明确输入。超出目标的参照保留金额，在弧形边界标记并附说明。

无 sectors 时继续展示累计实际进度。目标为零或缺失时，金额保留，比例和参照位置不计算。外圈 status 仍由各月业务状态输入。

[离线核对](../assets/offline/月份经营仪表-离线核对.html)
