// ======================================================
// BeP Admin Kit — 合同列表页面 v3
// 修复：① PingFang SC  ② 筛选标签112px+12px间距
//       ③ 按钮组右对齐/末行同行  ④ 去除合同记录条数
//       ⑤ 表格文字截断  ⑥ 操作列冻结分隔线
// 1440×808，展开筛选状态（4行），显示 6 条数据
// ======================================================

const ICONS = {
  "bar-chart-2":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.25 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.25 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.25 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "layers":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.8923L2 6.8923L12 11.8923L22 6.8923L12 1.8923Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 16.8923L12 21.8923L22 16.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11.8923L12 16.8923L22 11.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "settings":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74486 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66514 20.1656 4.29 19.79C3.91445 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91445 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95235 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87235 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83445 6.74486 3.62343 6.23582 3.62343 5.705C3.62343 5.17418 3.83445 4.66514 4.21 4.29C4.58514 3.91445 5.09418 3.70343 5.625 3.70343C6.15582 3.70343 6.66486 3.91445 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95235 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87235 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83445 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83445 19.71 4.21C20.0856 4.58514 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66486 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "DropDown-Arrow":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  "Arrow-Open":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.9194 6.375C19.7579 6.375 20.2241 7.34493 19.7002 7.99969L12.7809 16.6489C12.3805 17.1493 11.6195 17.1493 11.2191 16.6489L4.29975 7.99969C3.77594 7.34493 4.24212 6.375 5.08062 6.375H18.9194Z" fill="currentColor"/></svg>`,
  "Search":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5532 1.69951C5.66353 1.69951 1.69971 5.66333 1.69971 10.553C1.69971 13.716 3.38716 16.6387 6.12643 18.2203C8.8657 19.8018 12.2406 19.8018 14.9799 18.2203C15.4665 17.9393 15.9199 17.616 16.3366 17.2566C16.3696 17.379 16.4342 17.4947 16.5303 17.5907L21.0204 22.0808L21.1242 22.1676C21.4165 22.3701 21.8207 22.3412 22.081 22.0808C22.3739 21.7879 22.3739 21.3131 22.081 21.0202L17.5909 16.5301L17.4871 16.4433C17.4157 16.3939 17.3377 16.3582 17.2567 16.3364C18.6229 14.7524 19.4066 12.7085 19.4066 10.553C19.4066 5.66333 15.4428 1.69951 10.5532 1.69951ZM10.5532 3.19951C14.6143 3.19951 17.9066 6.49176 17.9066 10.553C17.9066 13.1801 16.505 15.6077 14.2299 16.9212C11.9547 18.2348 9.15159 18.2348 6.87643 16.9212C4.60127 15.6077 3.19971 13.1801 3.19971 10.553C3.19971 6.49176 6.49196 3.19951 10.5532 3.19951Z" fill="currentColor"/></svg>`,
  "Download":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.7381 2.38159C12.6746 2.03172 12.3684 1.7664 12.0002 1.7664C11.586 1.7664 11.2502 2.10219 11.2502 2.5164V14.931L7.78873 11.4697L7.68486 11.3829C7.39256 11.1804 6.98842 11.2093 6.72807 11.4697C6.43518 11.7626 6.43518 12.2374 6.72807 12.5303L11.4699 17.2721L11.5746 17.3595L11.682 17.4212L11.748 17.4483L11.8302 17.4725C11.8848 17.4851 11.9417 17.4918 12.0002 17.4918L12.0641 17.4891L12.1702 17.4725L12.3184 17.4212L12.3783 17.3897L12.4663 17.3295L12.5305 17.2721L17.2723 12.5303L17.3591 12.4265C17.5616 12.1342 17.5327 11.73 17.2723 11.4697C16.9794 11.1768 16.5046 11.1768 16.2117 11.4697L12.7502 14.931V2.5164L12.7381 2.38159ZM22.2217 16.607C22.1582 16.2571 21.852 15.9918 21.4838 15.9918C21.0696 15.9918 20.7338 16.3276 20.7338 16.7418V17.9273L20.7254 18.1466C20.6135 19.594 19.4036 20.7336 17.9275 20.7336H6.07295L5.85364 20.7252C4.40624 20.6133 3.2666 19.4034 3.2666 17.9273V16.7418L3.25452 16.607C3.19101 16.2571 2.88479 15.9918 2.5166 15.9918C2.10239 15.9918 1.7666 16.3276 1.7666 16.7418V17.9273L1.77391 18.1803C1.90489 20.4408 3.77956 22.2336 6.07295 22.2336H17.9275L18.1805 22.2263C20.441 22.0953 22.2338 20.2206 22.2338 17.9273V16.7418L22.2217 16.607Z" fill="currentColor"/></svg>`,
  "Menu":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 5.25C3 4.83579 3.23703 4.5 3.52941 4.5H20.4706L20.5658 4.51208C20.8127 4.57559 21 4.88181 21 5.25C21 5.66421 20.763 6 20.4706 6H3.52941L3.43425 5.98792C3.18728 5.92441 3 5.61819 3 5.25ZM10.4118 12.1731C10.4118 11.7589 10.6488 11.4231 10.9412 11.4231H20.4706L20.5658 11.4352C20.8127 11.4987 21 11.8049 21 12.1731C21 12.5873 20.763 12.9231 20.4706 12.9231H10.9412L10.846 12.911C10.599 12.8475 10.4118 12.5413 10.4118 12.1731ZM3.52941 18.3462C3.23703 18.3462 3 18.6819 3 19.0962C3 19.4643 3.18728 19.7706 3.43425 19.8341L3.52941 19.8462H20.4706C20.763 19.8462 21 19.5104 21 19.0962C21 18.728 20.8127 18.4217 20.5658 18.3582L20.4706 18.3462H3.52941ZM4.49033 8.8858C4.16685 8.60379 3.66176 8.83354 3.66176 9.26269V14.4488C3.66176 14.878 4.16685 15.1077 4.49033 14.8257L7.46475 12.2327C7.69332 12.0334 7.69332 11.6782 7.46475 11.4789L4.49033 8.8858Z" fill="currentColor"/></svg>`,
  "Switch":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0142 3.86587C14.7138 3.67557 14.3112 3.7211 14.0618 3.99194L13.9794 4.0993C13.7891 4.39968 13.8346 4.80229 14.1055 5.05171L17.5785 8.25H4.50004L4.36523 8.26209C4.01536 8.32559 3.75004 8.63181 3.75004 9C3.75004 9.41422 4.08583 9.75 4.50004 9.75H19.5L19.6318 9.73918C20.2232 9.63982 20.4771 8.88024 20.0081 8.4483L15.1216 3.9483L15.0142 3.86587ZM20.25 15C20.25 14.5858 19.9143 14.25 19.5 14.25H4.50004L4.3683 14.2608C3.77691 14.3602 3.52295 15.1198 3.99198 15.5517L8.87851 20.0517L8.98587 20.1341C9.28625 20.3244 9.68886 20.2789 9.93827 20.0081L10.0207 19.9007C10.211 19.6003 10.1655 19.1977 9.89463 18.9483L6.42154 15.75H19.5L19.6349 15.7379C19.9847 15.6744 20.25 15.3682 20.25 15Z" fill="currentColor"/></svg>`,
  "Notice":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9992 2.42653C13.4337 2.42653 14.6482 3.43604 14.8977 4.82569L14.9303 5.06071L14.9338 5.148L15.0666 5.20459C17.319 6.21461 18.8957 8.27127 19.2505 10.6708L19.2928 11.0159L19.3173 11.3499L19.3253 11.679V15.0355C19.3252 15.2927 19.399 15.5441 19.5243 15.7484L19.6277 15.8923L19.7495 16.0242L21.2894 17.5174C21.7409 17.9552 21.4817 18.6981 20.8974 18.7953L20.7673 18.8058L16.0363 18.8055L16.0372 19.4114C16.0372 21.5079 14.361 23.214 12.254 23.3421L11.9992 23.3498C9.85966 23.3498 8.10117 21.7244 7.96907 19.661L7.9611 19.4114L7.96028 18.8055L3.231 18.8058C2.60216 18.8058 2.27099 18.092 2.62289 17.6155L2.70889 17.5174L4.2488 16.0242C4.43904 15.8397 4.57099 15.6101 4.63142 15.3817L4.66312 15.2112L4.67304 15.0364V11.679C4.67304 8.86417 6.36597 6.35802 8.94258 5.20089L9.06278 5.1495L9.066 5.07674C9.17163 3.74238 10.2071 2.66901 11.533 2.46247L11.7699 2.43515L11.9992 2.42653ZM14.5363 19.098H9.46028L9.4611 19.4114C9.4611 20.6075 10.3605 21.6092 11.5526 21.8123L11.7794 21.8408L11.9992 21.8498C13.3319 21.8498 14.4174 20.8653 14.5279 19.6211L14.5372 19.4114L14.5363 19.098ZM10.5667 5.14269C10.6494 4.4621 11.2549 3.92653 11.9992 3.92653C12.749 3.92653 13.366 4.47341 13.4348 5.17098L13.4421 5.33886L13.4412 5.66456L13.4534 5.79929C13.5014 6.06271 13.688 6.28484 13.9478 6.37397C16.1801 7.13985 17.7052 9.1321 17.8185 11.4058L17.8255 11.6976L17.8253 15.0353L17.8365 15.2881C17.8887 15.8745 18.1219 16.4328 18.5065 16.8881L18.6792 17.0744L18.9178 17.3055H5.08028L5.29302 17.101L5.46817 16.9158C5.85622 16.4678 6.09801 15.9136 6.15824 15.326L6.17206 15.0747L6.17304 11.679L6.18118 11.3803C6.30013 9.20191 7.71328 7.29254 9.79186 6.46947L10.0669 6.36814L10.1868 6.31139C10.4134 6.17847 10.5571 5.93373 10.5571 5.66456V5.30214L10.5667 5.14269Z" fill="currentColor"/></svg>`,
  "chevron-right":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "Add":
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.75C12.3682 3.75 12.6744 4.01531 12.7379 4.36519L12.75 4.5V11.25H19.5C19.9142 11.25 20.25 11.5858 20.25 12C20.25 12.3682 19.9847 12.6744 19.6348 12.7379L19.5 12.75H12.75V19.5C12.75 19.9142 12.4142 20.25 12 20.25C11.6318 20.25 11.3256 19.9847 11.2621 19.6348L11.25 19.5V12.75H4.5C4.08579 12.75 3.75 12.4142 3.75 12C3.75 11.6318 4.01531 11.3256 4.36519 11.2621L4.5 11.25H11.25V4.5C11.25 4.08579 11.5858 3.75 12 3.75Z" fill="currentColor"/></svg>`,
};

// ======================================================
// 数据（20条，显示前6条）
// ======================================================
const DATA = [
  {no:'HT202605180001',scene:'企业订单',type:'框架合同', status:'已生效',     name:'广州区域设施设备年度框架采购合同',    customer:'碧桂园物业广州区域',bipNo:'BIP202605180021',total:'¥1,200,000.00',ordered:'¥485,000.00', sales:'王明', effective:'2026-05-18',expire:'2027-05-17'},
  {no:'HT202605160002',scene:'企业订单',type:'具体合同', status:'待财务审核', name:'深圳区域监控设备专项采购合同',          customer:'碧桂园物业深圳区域',bipNo:'BIP202605160015',total:'¥280,000.00',  ordered:'—',           sales:'李娜', effective:'2026-05-16',expire:'2026-07-15'},
  {no:'HT202605140003',scene:'企业订单',type:'无金额合同',status:'已生效',    name:'佛山区战略合作意向协议',               customer:'碧桂园物业佛山区域',bipNo:'BIP202605140009',total:'—',            ordered:'—',           sales:'王明', effective:'2026-05-14',expire:'—'},
  {no:'HT202605120004',scene:'企业订单',type:'框架合同', status:'草稿',        name:'江门区域智慧门禁框架采购合同',          customer:'碧桂园物业江门区域',bipNo:'—',             total:'¥500,000.00',  ordered:'—',           sales:'刘芳', effective:'2026-06-01',expire:'2027-05-31'},
  {no:'HT202605100005',scene:'企业订单',type:'框架合同', status:'审核驳回',    name:'珠海区域厨电年度框架采购合同',          customer:'碧桂园物业珠海区域',bipNo:'BIP202605100003',total:'¥800,000.00',  ordered:'—',           sales:'陈强', effective:'2026-05-10',expire:'2027-05-31'},
  {no:'HT202604010006',scene:'企业订单',type:'具体合同', status:'已终止',      name:'保利华南清洁设备专项采购合同',          customer:'保利物业华南区域',  bipNo:'BIP202604010007',total:'¥150,000.00',  ordered:'¥78,000.00',  sales:'张涛', effective:'2026-04-01',expire:'2026-08-18'},
  {no:'HT202605150007',scene:'企业订单',type:'框架合同', status:'已生效',     name:'北京区域电梯维保年度框架合同',          customer:'碧桂园物业北京区域',bipNo:'BIP202605150019',total:'¥960,000.00',  ordered:'¥230,000.00', sales:'王明', effective:'2026-05-15',expire:'2027-05-14'},
  {no:'HT202605130008',scene:'企业订单',type:'具体合同', status:'待财务审核', name:'上海区域智能安防设备采购合同',          customer:'碧桂园物业上海区域',bipNo:'BIP202605130006',total:'¥320,000.00',  ordered:'—',           sales:'李娜', effective:'2026-05-13',expire:'2026-09-12'},
  {no:'HT202605110009',scene:'企业订单',type:'具体合同', status:'已生效',     name:'成都区域绿化养护服务合同',              customer:'碧桂园物业成都区域',bipNo:'BIP202605110004',total:'¥180,000.00',  ordered:'¥60,000.00',  sales:'刘芳', effective:'2026-05-11',expire:'2026-11-10'},
  {no:'HT202605090010',scene:'企业订单',type:'框架合同', status:'草稿',        name:'武汉区域消防设施年度维保合同',          customer:'碧桂园物业武汉区域',bipNo:'—',             total:'¥420,000.00',  ordered:'—',           sales:'陈强', effective:'2026-06-01',expire:'2027-05-31'},
  {no:'HT202605070011',scene:'企业订单',type:'框架合同', status:'已生效',     name:'万科华南区域安保服务框架合同',          customer:'万科物业华南区域',  bipNo:'BIP202605070012',total:'¥1,500,000.00',ordered:'¥300,000.00', sales:'张涛', effective:'2026-05-07',expire:'2027-05-06'},
  {no:'HT202605050012',scene:'企业订单',type:'具体合同', status:'审核驳回',    name:'重庆区域停车管理系统采购合同',          customer:'碧桂园物业重庆区域',bipNo:'BIP202605050008',total:'¥245,000.00',  ordered:'—',           sales:'王明', effective:'2026-05-05',expire:'2026-08-04'},
  {no:'HT202605030013',scene:'企业订单',type:'框架合同', status:'已生效',     name:'杭州区域物业管理系统年度服务合同',      customer:'碧桂园物业杭州区域',bipNo:'BIP202605030014',total:'¥680,000.00',  ordered:'¥140,000.00', sales:'李娜', effective:'2026-05-03',expire:'2027-05-02'},
  {no:'HT202605010014',scene:'企业订单',type:'具体合同', status:'待财务审核', name:'南京区域环境整治专项服务合同',          customer:'碧桂园物业南京区域',bipNo:'BIP202605010011',total:'¥195,000.00',  ordered:'—',           sales:'刘芳', effective:'2026-05-01',expire:'2026-07-31'},
  {no:'HT202604280015',scene:'企业订单',type:'无金额合同',status:'已生效',    name:'华润广州区域清洁外包服务合同',          customer:'华润物业广州区域',  bipNo:'BIP202604280009',total:'—',            ordered:'—',           sales:'陈强', effective:'2026-04-28',expire:'—'},
  {no:'HT202604250016',scene:'企业订单',type:'具体合同', status:'已到期',      name:'长沙区域智慧停车设备采购合同',          customer:'碧桂园物业长沙区域',bipNo:'BIP202604250005',total:'¥168,000.00',  ordered:'¥168,000.00', sales:'张涛', effective:'2025-04-25',expire:'2026-04-24'},
  {no:'HT202604200017',scene:'企业订单',type:'框架合同', status:'已生效',     name:'天津区域暖通设备维保年度合同',          customer:'碧桂园物业天津区域',bipNo:'BIP202604200016',total:'¥540,000.00',  ordered:'¥90,000.00',  sales:'王明', effective:'2026-04-20',expire:'2027-04-19'},
  {no:'HT202604150018',scene:'企业订单',type:'具体合同', status:'已终止',      name:'西安区域门禁系统升级改造合同',          customer:'碧桂园物业西安区域',bipNo:'BIP202604150010',total:'¥298,000.00',  ordered:'¥298,000.00', sales:'李娜', effective:'2026-04-15',expire:'2026-07-14'},
  {no:'HT202604100019',scene:'企业订单',type:'框架合同', status:'已生效',     name:'中海华南区域设施设备维保框架合同',      customer:'中海物业华南区域',  bipNo:'BIP202604100017',total:'¥2,100,000.00',ordered:'¥560,000.00', sales:'刘芳', effective:'2026-04-10',expire:'2027-04-09'},
  {no:'HT202604050020',scene:'企业订单',type:'框架合同', status:'草稿',        name:'郑州区域物业服务年度框架采购合同',      customer:'碧桂园物业郑州区域',bipNo:'—',             total:'¥750,000.00',  ordered:'—',           sales:'陈强', effective:'2026-06-01',expire:'2027-05-31'},
];

const VISIBLE_ROWS = 6;

// ======================================================
async function buildPage() {

  function hex(h) {
    const n = parseInt(h.replace('#',''), 16);
    return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255 };
  }
  function solid(color, a) {
    return [{ type:'SOLID', color, opacity:(a===undefined?1:a) }];
  }

  const C = {
    pageBg:      hex('#F0F2F5'),
    white:       hex('#FFFFFF'),
    black:       hex('#000000'),
    sidebarBg:   hex('#002138'),
    sidebarSub:  hex('#00182A'),
    primary:     hex('#006D9B'),
    statusGreenBg:  hex('#E6F7EF'), statusGreenFg:  hex('#00875A'),
    statusOrangeBg: hex('#FFF7E6'), statusOrangeFg: hex('#D46B08'),
    statusGrayBg:   hex('#F5F5F5'), statusGrayFg:   hex('#595959'),
    statusRedBg:    hex('#FFF1F0'), statusRedFg:    hex('#CF1322'),
    statusGray2Fg:  hex('#8C8C8C'),
    typeBlueBg:  hex('#E6F4FF'), typeBlueFg:  hex('#0958D9'),
    typeGreenBg: hex('#F6FFED'), typeGreenFg: hex('#389E0D'),
    typeGrayBg:  hex('#F5F5F5'), typeGrayFg:  hex('#595959'),
    scenePurpleBg: hex('#F9F0FF'), scenePurpleFg: hex('#531DAB'),
    tblHeaderBg: hex('#F5F5F5'),
  };

  // ── 字体加载（PingFang SC = 简体中文标准）──────────────
  await Promise.all([
    figma.loadFontAsync({ family:'Inter',       style:'Regular' }),
    figma.loadFontAsync({ family:'Inter',       style:'Medium'  }),
    figma.loadFontAsync({ family:'Inter',       style:'Bold'    }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Regular' }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Medium'  }),
    figma.loadFontAsync({ family:'PingFang SC', style:'Semibold'}),
  ]);

  // ── 工具函数 ──────────────────────────────────────────
  function frame(name, w, h, bg, opts) {
    opts = opts||{};
    const f = figma.createFrame();
    f.name = name; f.resize(w, h);
    f.fills = bg ? solid(bg, opts.bgA!==undefined?opts.bgA:1) : [];
    f.clipsContent = opts.clip !== false;
    if (opts.r !== undefined) f.cornerRadius = opts.r;
    if (opts.x !== undefined) f.x = opts.x;
    if (opts.y !== undefined) f.y = opts.y;
    if (opts.stroke) {
      f.strokes = solid(opts.stroke, opts.strokeA!==undefined?opts.strokeA:1);
      f.strokeWeight = opts.strokeW||1;
      f.strokeAlign = 'INSIDE';
    }
    return f;
  }
  function rect(w, h, color, opts) {
    opts = opts||{};
    const r = figma.createRectangle();
    r.resize(w, h);
    r.fills = color ? solid(color, opts.a!==undefined?opts.a:1) : [];
    if (opts.r !== undefined) r.cornerRadius = opts.r;
    if (opts.x !== undefined) r.x = opts.x;
    if (opts.y !== undefined) r.y = opts.y;
    if (opts.stroke) {
      r.strokes = solid(opts.stroke, opts.strokeA!==undefined?opts.strokeA:1);
      r.strokeWeight = opts.strokeW||1;
      r.strokeAlign = 'INSIDE';
    }
    return r;
  }
  // 自动宽高文本（用于 UI 标签、标题、非截断场景）
  function text(chars, color, size, opts) {
    opts = opts||{};
    const t = figma.createText();
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.fontName = { family:'PingFang SC', style:opts.style||'Regular' };
    t.fontSize = size;
    t.lineHeight = { value:opts.lh||(size+8), unit:'PIXELS' };
    t.characters = String(chars);
    t.fills = solid(color, opts.a!==undefined?opts.a:1);
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }
  // 固定宽度截断文本（用于表格单元格）
  function truncText(chars, color, maxW, opts) {
    opts = opts||{};
    const t = figma.createText();
    t.fontName = { family:'PingFang SC', style:opts.style||'Regular' };
    t.fontSize = 14;
    t.lineHeight = { value:22, unit:'PIXELS' };
    t.characters = String(chars);
    t.fills = solid(color, opts.a!==undefined?opts.a:1);
    t.textAutoResize = 'NONE';
    t.resize(Math.max(maxW, 8), 22);
    t.textTruncation = 'ENDING';
    if (opts.alignH) t.textAlignHorizontal = opts.alignH;
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    return t;
  }
  function icon(key, size, color, opacity) {
    if (opacity===undefined) opacity=1;
    const svg = ICONS[key];
    if (!svg) return null;
    const node = figma.createNodeFromSvg(svg);
    node.resize(size, size);
    node.opacity = opacity;
    node.findAll(n=>n.fills&&n.fills.length>0&&n.fills[0].type==='SOLID').forEach(n=>{n.fills=solid(color,1);});
    node.findAll(n=>n.strokes&&n.strokes.length>0).forEach(n=>{n.strokes=solid(color,1);});
    return node;
  }
  function measureText(chars, size, style) {
    const tmp = figma.createText();
    tmp.textAutoResize = 'WIDTH_AND_HEIGHT';
    tmp.fontName = { family:'PingFang SC', style:style||'Regular' };
    tmp.fontSize = size||14;
    tmp.lineHeight = { value:22, unit:'PIXELS' };
    tmp.characters = String(chars);
    const w = tmp.width; tmp.remove(); return w;
  }
  function tagPill(label, bgColor, fgColor, parent, x, y) {
    const pill = frame('tag-'+label, 60, 22, bgColor, {r:4});
    pill.x=x; pill.y=y; parent.appendChild(pill);
    const t = text(label, fgColor, 12, {lh:20});
    pill.appendChild(t);
    pill.resize(t.width+12, 22);
    t.x=6; t.y=1;
    return pill;
  }

  // ── 状态 / 类型颜色 ──────────────────────────────────
  function statusColors(s) {
    return ({
      '已生效':    {bg:C.statusGreenBg,  fg:C.statusGreenFg},
      '待财务审核':{bg:C.statusOrangeBg, fg:C.statusOrangeFg},
      '草稿':      {bg:C.statusGrayBg,   fg:C.statusGrayFg},
      '审核驳回':  {bg:C.statusRedBg,    fg:C.statusRedFg},
      '已终止':    {bg:C.statusGrayBg,   fg:C.statusGray2Fg},
      '已到期':    {bg:C.statusGrayBg,   fg:C.statusGray2Fg},
    })[s]||{bg:C.statusGrayBg,fg:C.statusGrayFg};
  }
  function typeColors(t) {
    return ({
      '框架合同':  {bg:C.typeBlueBg,  fg:C.typeBlueFg},
      '具体合同':  {bg:C.typeGreenBg, fg:C.typeGreenFg},
      '无金额合同':{bg:C.typeGrayBg,  fg:C.typeGrayFg},
    })[t]||{bg:C.typeGrayBg,fg:C.typeGrayFg};
  }
  function getOps(status) {
    const pri=C.primary, suc=C.statusGreenFg, dng=C.statusRedFg, wrn=C.statusOrangeFg;
    return ({
      '已生效':    [['详情',pri],['终止',wrn]],
      '待财务审核':[['详情',pri],['财务通过',suc],['财务驳回',dng]],
      '草稿':      [['详情',pri],['编辑',pri],['提交审核',suc]],
      '审核驳回':  [['详情',pri],['编辑',pri],['提交审核',suc]],
      '已终止':    [['详情',pri]],
      '已到期':    [['详情',pri]],
    })[status]||[['详情',pri]];
  }

  // ══════════════════════════════════════════════════════
  // 布局常量
  // ══════════════════════════════════════════════════════
  const SIDEBAR_W = 208;
  const CANVAS_W  = 1440, CANVAS_H = 808;
  const MAIN_W    = CANVAS_W - SIDEBAR_W;   // 1232
  const OUTER_PAD = 16, PAD = 24;
  const CARD_W    = 1200, CARD_H = 680;
  const TBL_W     = CARD_W - PAD*2;         // 1152

  // 筛选区：字段名称宽112px，与输入框间距12px，列间距8px
  const LABEL_W   = 112;
  const LABEL_GAP = 12;
  const FCOL_W    = 379;
  const INPUT_W   = FCOL_W - LABEL_W - LABEL_GAP;  // 255
  const COL_X     = [24, 411, 798];
  const FROW_Y    = [24, 72, 120, 168];

  // 末行（行3）仅有 col0 → 按钮组与末行同行（右对齐）
  const FILTER_ACT_Y = 168;   // = FROW_Y[3]
  const TABLE_ACT_Y  = 216;   // FILTER_ACT_Y + 48
  const DIVIDER_Y    = 256;   // TABLE_ACT_Y + 40
  const TBL_Y        = 264;   // DIVIDER_Y + 8
  const ROW_H = 48, HEADER_H = 48;

  // PAGER_Y = 264 + 48 + 6×48 + 16 = 616
  const PAGER_Y = TBL_Y + HEADER_H + VISIBLE_ROWS * ROW_H + 16;

  // 表格列宽（13列合计 1152px）
  // 100+92+96+64+64+72+96+100+100+52+78+78+160 = 1152
  const COLS = [
    {label:'合同编号',   w:100, type:'link'     },
    {label:'客户名称',   w: 92, type:'plain'    },
    {label:'合同名称',   w: 96, type:'plain'    },
    {label:'合同场景',   w: 64, type:'sceneTag' },
    {label:'合同类型',   w: 64, type:'typeTag'  },
    {label:'合同状态',   w: 72, type:'statusTag'},
    {label:'BIP审批编号',w: 96, type:'plain'    },
    {label:'合同总金额', w:100, type:'amount'   },
    {label:'已下单金额', w:100, type:'amount'   },
    {label:'销售人员',   w: 52, type:'plain'    },
    {label:'生效日期',   w: 78, type:'plain'    },
    {label:'到期日期',   w: 78, type:'plain'    },
    {label:'操作',       w:160, type:'ops'      },
  ];
  // 操作列冻结分隔线 x（相对于 row frame）
  const FROZEN_X = COLS.slice(0,-1).reduce((s,c)=>s+c.w, 0); // 992

  // ══════════════════════════════════════════════════════
  // 根框架
  // ══════════════════════════════════════════════════════
  const page = frame('合同列表 v3', CANVAS_W, CANVAS_H, C.pageBg);
  figma.currentPage.appendChild(page);
  page.x = 100; page.y = 100;

  // ══════════════════════════════════════════════════════
  // 1. 侧边栏
  // ══════════════════════════════════════════════════════
  const sidebar = frame('侧边栏', SIDEBAR_W, CANVAS_H, C.sidebarBg, {clip:true});
  page.appendChild(sidebar);

  {
    const logoRow = frame('Logo', SIDEBAR_W, 64, null);
    logoRow.fills = []; sidebar.appendChild(logoRow);
    const markBox = frame('mark', 32, 32, C.primary, {r:6, x:24, y:16});
    logoRow.appendChild(markBox);
    const markT = text('SC', C.white, 13, {lh:18, style:'Medium'});
    markT.x = Math.round((32-markT.width)/2); markT.y = 7;
    markBox.appendChild(markT);
    logoRow.appendChild(text('供应链管理平台', C.white, 16, {lh:20, style:'Medium', x:64, y:14}));
    logoRow.appendChild(text('SUPPLY CHAIN MANAGEMENT PLATFORM', C.white, 6, {lh:10, a:0.6, x:64, y:37}));
  }

  function sideL1(parent, label, iconKey, y, opts) {
    opts = opts||{};
    const op = opts.active ? 1 : 0.5;
    const row = frame('L1·'+label, SIDEBAR_W, ROW_H, C.sidebarBg);
    row.y = y; parent.appendChild(row);
    const ic = icon(iconKey, 16, C.white, op);
    if (ic) { ic.x=24; ic.y=16; row.appendChild(ic); }
    row.appendChild(text(label, C.white, 14, {lh:22, a:op, x:52, y:13}));
    if (opts.hasArrow !== false) {
      const arr = icon(opts.expanded?'PutAway-Arrow':'DropDown-Arrow', 12, C.white, op);
      if (arr) { arr.x=182; arr.y=18; row.appendChild(arr); }
    }
  }
  function sideL2(parent, label, y, opts) {
    opts = opts||{};
    const op = opts.active ? 1 : 0.5;
    const row = frame('L2·'+label, SIDEBAR_W, ROW_H, C.sidebarSub);
    row.y = y; parent.appendChild(row);
    row.appendChild(text(label, C.white, 14, {lh:22, a:op, x:40, y:13}));
  }

  let sy = 64;
  sideL1(sidebar,'订单管理','layers',      sy,{expanded:false});  sy+=ROW_H;
  sideL2(sidebar,'企业订单管理',sy);                               sy+=ROW_H;
  sideL2(sidebar,'订单履约',    sy);                               sy+=ROW_H;
  sideL1(sidebar,'销售管理','bar-chart-2',sy,{active:true,expanded:true}); sy+=ROW_H;
  sideL2(sidebar,'合同管理',    sy,{active:true});                 sy+=ROW_H;
  sideL1(sidebar,'基础档案','settings',   sy,{expanded:false});    sy+=ROW_H;
  sideL2(sidebar,'客户管理',    sy);                               sy+=ROW_H;
  sideL2(sidebar,'供应商管理',  sy);

  // ══════════════════════════════════════════════════════
  // 2. 主区域
  // ══════════════════════════════════════════════════════
  const main = frame('主区域', MAIN_W, CANVAS_H, C.pageBg, {clip:true});
  main.x = SIDEBAR_W; page.appendChild(main);

  // ── 顶部导航 48px ──────────────────────────────────
  {
    const nav = frame('顶部导航', MAIN_W, 48, C.white,
      {stroke:C.black, strokeA:0.06, strokeW:1});
    main.appendChild(nav);
    const icMenu = icon('Menu', 16, C.black, 0.45);
    if (icMenu) { icMenu.x=16; icMenu.y=16; nav.appendChild(icMenu); }
    const SYS_W = 200;
    const sysBox = frame('系统切换', SYS_W, 32, C.white, {r:2, x:56, y:8, stroke:C.black, strokeA:0.15, strokeW:1});
    nav.appendChild(sysBox);
    sysBox.appendChild(text('业务系统切换', C.black, 14, {lh:22, a:0.25, x:12, y:5}));
    const icSwitch = icon('Switch', 16, C.black, 0.45);
    if (icSwitch) { icSwitch.x=SYS_W-28; icSwitch.y=8; sysBox.appendChild(icSwitch); }
    let rx = MAIN_W - 16;
    const uArr = icon('Arrow-Open', 16, C.black, 0.45);
    if (uArr) { uArr.x=rx-16; uArr.y=16; nav.appendChild(uArr); rx=uArr.x-4; }
    const uName = text('碧小园', C.black, 14, {lh:22, a:0.85});
    uName.x=rx-uName.width; uName.y=13; nav.appendChild(uName); rx=uName.x-8;
    nav.appendChild(rect(24, 24, C.primary, {r:12, x:rx-24, y:12}));
    const uT = text('碧', C.white, 12, {lh:24, style:'Medium'});
    uT.x=rx-24+Math.round((24-uT.width)/2); uT.y=12; nav.appendChild(uT);
    rx=rx-24-16;
    nav.appendChild(rect(1, 16, C.black, {a:0.1, x:rx, y:16})); rx=rx-16;
    const icBell = icon('Notice', 16, C.black, 0.45);
    if (icBell) { icBell.x=rx-16; icBell.y=16; nav.appendChild(icBell); rx=icBell.x-24; }
    const icDl = icon('Download', 16, C.black, 0.45);
    if (icDl) { icDl.x=rx-16; icDl.y=16; nav.appendChild(icDl); rx=icDl.x-24; }
    const icS = icon('Search', 16, C.black, 0.45);
    if (icS) { icS.x=rx-16; icS.y=16; nav.appendChild(icS); }
  }

  // ── 标题栏 48px ──────────────────────────────────────
  {
    const bar = frame('标题栏', MAIN_W, 48, C.white, {stroke:C.black, strokeA:0.06, strokeW:1});
    bar.y = 48; main.appendChild(bar);
    const titleNode = text('合同管理', C.black, 16, {lh:24, style:'Medium', x:PAD, y:12});
    bar.appendChild(titleNode);
    const crumbs = [{label:'首页'},{label:'销售管理'},{label:'合同管理'}];
    let bx = PAD + titleNode.width + 16;
    crumbs.forEach((c,i)=>{
      const cn = text(c.label, C.black, 12, {lh:18, a:0.65});
      cn.x=bx; cn.y=15; bar.appendChild(cn); bx+=cn.width;
      if (i<crumbs.length-1) {
        const sep = icon('chevron-right', 12, C.black, 0.25);
        if (sep) { sep.x=bx+2; sep.y=18; bar.appendChild(sep); bx+=12+4; }
      }
    });
  }

  // ── 内容区 → 卡片 ─────────────────────────────────
  const content = frame('内容区', MAIN_W, CANVAS_H-96, C.pageBg);
  content.y = 96; main.appendChild(content);
  const mainCard = frame('内容卡片', CARD_W, CARD_H, C.white, {r:2, x:OUTER_PAD, y:OUTER_PAD});
  content.appendChild(mainCard);

  // ══════════════════════════════════════════════════════
  // ② 筛选区（展开 4 行）
  //    字段名称宽 112px，与输入框间距 12px，列间距 8px
  // ══════════════════════════════════════════════════════
  function addFilter(label, col, rowIdx, fieldType) {
    const x0 = COL_X[col];
    const y0 = FROW_Y[rowIdx];
    // 字段名称：固定 112px 区域，文本左对齐
    mainCard.appendChild(text(label, C.black, 14, {lh:22, a:0.65, x:x0, y:y0+5}));
    const inputX = x0 + LABEL_W + LABEL_GAP;  // 标签区 + 间距

    if (fieldType==='text') {
      const box = frame('inp-'+label, INPUT_W, 32, C.white,
        {r:4, x:inputX, y:y0, stroke:C.black, strokeA:0.15, strokeW:1});
      mainCard.appendChild(box);
      box.appendChild(text('请输入', C.black, 14, {lh:22, a:0.25, x:12, y:5}));

    } else if (fieldType==='select') {
      const box = frame('sel-'+label, INPUT_W, 32, C.white,
        {r:4, x:inputX, y:y0, stroke:C.black, strokeA:0.15, strokeW:1});
      mainCard.appendChild(box);
      box.appendChild(text('请选择', C.black, 14, {lh:22, a:0.25, x:12, y:5}));
      const arr = icon('DropDown-Arrow', 12, C.black, 0.35);
      if (arr) { arr.x=INPUT_W-20; arr.y=10; box.appendChild(arr); }

    } else if (fieldType==='multiselect') {
      const box = frame('msel-'+label, INPUT_W, 32, C.white,
        {r:4, x:inputX, y:y0, stroke:C.black, strokeA:0.15, strokeW:1});
      mainCard.appendChild(box);
      box.appendChild(text('请选择（可多选）', C.black, 13, {lh:22, a:0.25, x:12, y:5}));
      const arr = icon('DropDown-Arrow', 12, C.black, 0.35);
      if (arr) { arr.x=INPUT_W-20; arr.y=10; box.appendChild(arr); }

    } else if (fieldType==='daterange') {
      const box = frame('dr-'+label, INPUT_W, 32, C.white,
        {r:4, x:inputX, y:y0, stroke:C.black, strokeA:0.15, strokeW:1});
      mainCard.appendChild(box);
      const hw = Math.floor((INPUT_W-20)/2);
      box.appendChild(text('开始日期', C.black, 12, {lh:22, a:0.25, x:8, y:5}));
      const sep = text('至', C.black, 12, {lh:22, a:0.45});
      sep.x=hw+4; sep.y=5; box.appendChild(sep);
      const rph = text('结束日期', C.black, 12, {lh:22, a:0.25});
      rph.x=hw+4+sep.width+4; rph.y=5; box.appendChild(rph);

    } else if (fieldType==='amountrange') {
      const box = frame('ar-'+label, INPUT_W, 32, C.white,
        {r:4, x:inputX, y:y0, stroke:C.black, strokeA:0.15, strokeW:1});
      mainCard.appendChild(box);
      const hw = Math.floor((INPUT_W-20)/2);
      box.appendChild(text('最小金额', C.black, 12, {lh:22, a:0.25, x:8, y:5}));
      const sep = text('至', C.black, 12, {lh:22, a:0.45});
      sep.x=hw+4; sep.y=5; box.appendChild(sep);
      const rph = text('最大金额', C.black, 12, {lh:22, a:0.25});
      rph.x=hw+4+sep.width+4; rph.y=5; box.appendChild(rph);
    }
  }

  // 行 0
  addFilter('合同编号', 0, 0, 'text');
  addFilter('客户名称', 1, 0, 'text');
  addFilter('合同场景', 2, 0, 'select');
  // 行 1
  addFilter('合同类型', 0, 1, 'select');
  addFilter('合同状态', 1, 1, 'multiselect');
  addFilter('销售人员', 2, 1, 'select');
  // 行 2
  addFilter('BIP审批编号', 0, 2, 'text');
  addFilter('签订日期',    1, 2, 'daterange');
  addFilter('到期日期',    2, 2, 'daterange');
  // 行 3（展开后）：仅 col0 → 按钮组与此行同行
  addFilter('合同金额', 0, 3, 'amountrange');

  // ── 按钮组（查询/重置/收起）右对齐，与行 3 同行 ──────
  {
    let bx = CARD_W - PAD;  // 从右边缘向左排列

    // 收起（最右）
    const collapseT = text('收起', C.primary, 14, {lh:22, a:0.85});
    const arrUp = icon('DropDown-Arrow', 16, C.primary, 0.85);
    const colW = collapseT.width + (arrUp ? 4+16 : 0);
    collapseT.x = bx - colW; collapseT.y = FILTER_ACT_Y+5;
    mainCard.appendChild(collapseT);
    if (arrUp) { arrUp.x = bx-16; arrUp.y = FILTER_ACT_Y+8; mainCard.appendChild(arrUp); }
    bx = bx - colW - 16;

    // 重置
    const rstW = measureText('重置',14) + 32;
    const rstBtn = frame('btn-重置', rstW, 32, C.white,
      {r:4, x:bx-rstW, y:FILTER_ACT_Y, stroke:C.black, strokeA:0.15, strokeW:1});
    mainCard.appendChild(rstBtn);
    rstBtn.appendChild(text('重置', C.black, 14, {lh:22, a:0.65, x:16, y:5}));
    bx = bx - rstW - 8;

    // 查询
    const qryW = measureText('查询',14) + 32;
    const qryBtn = frame('btn-查询', qryW, 32, C.primary, {r:4, x:bx-qryW, y:FILTER_ACT_Y});
    mainCard.appendChild(qryBtn);
    qryBtn.appendChild(text('查询', C.white, 14, {lh:22, x:16, y:5}));
  }

  // ── ③ 表格工具行（仅右侧操作按钮，去除条数文字）───────
  {
    // 新增合同（primary，含 Add 图标）
    const newBtnW = 12 + 16 + 8 + measureText('新增合同',14) + 12;
    const newBtn = frame('btn-新增合同', newBtnW, 32, C.primary,
      {r:4, x:CARD_W-PAD-newBtnW, y:TABLE_ACT_Y});
    mainCard.appendChild(newBtn);
    const addIc = icon('Add', 16, C.white, 1);
    if (addIc) { addIc.x=12; addIc.y=8; newBtn.appendChild(addIc); }
    newBtn.appendChild(text('新增合同', C.white, 14, {lh:22, x:36, y:5}));

    // 导出（outline，新增合同左侧 8px）
    const expBtnW = measureText('导出',14) + 32;
    const expBtn = frame('btn-导出', expBtnW, 32, C.white,
      {r:4, x:CARD_W-PAD-newBtnW-8-expBtnW, y:TABLE_ACT_Y,
       stroke:C.black, strokeA:0.15, strokeW:1});
    mainCard.appendChild(expBtn);
    expBtn.appendChild(text('导出', C.black, 14, {lh:22, a:0.65, x:16, y:5}));
  }

  // ── 分割线 ────────────────────────────────────────────
  mainCard.appendChild(rect(CARD_W, 1, C.black, {a:0.06, x:0, y:DIVIDER_Y}));

  // ══════════════════════════════════════════════════════
  // ④ 表格（带冻结列 — 操作列冻结，文本截断省略）
  //    100+92+96+64+64+72+96+100+100+52+78+78+160 = 1152
  // ══════════════════════════════════════════════════════

  // 表头
  {
    const thead = frame('表头', TBL_W, HEADER_H, C.tblHeaderBg, {x:PAD, y:TBL_Y});
    mainCard.appendChild(thead);
    thead.appendChild(rect(TBL_W, 1, C.black, {a:0.06, x:0, y:HEADER_H-1}));
    // 冻结分隔线（操作列左侧，加强显示）
    thead.appendChild(rect(1, HEADER_H, C.black, {a:0.18, x:FROZEN_X, y:0}));
    let cx=0;
    COLS.forEach(col=>{
      const padL = (col.type==='amount') ? 0 : 16;
      const padR = 8;
      const maxW = col.w - padL - padR;
      const t = truncText(col.label, C.black, maxW,
        {style:'Medium', a:0.85,
         alignH: col.type==='amount' ? 'RIGHT' : 'LEFT',
         x: col.type==='amount' ? cx+col.w-maxW-padR : cx+padL,
         y: Math.round((HEADER_H-22)/2)});
      thead.appendChild(t);
      cx += col.w;
    });
  }

  // 数据行
  DATA.slice(0, VISIBLE_ROWS).forEach((row, ri)=>{
    const trFrame = frame('tr-'+ri, TBL_W, ROW_H, C.white,
      {x:PAD, y:TBL_Y+HEADER_H+ri*ROW_H});
    mainCard.appendChild(trFrame);
    trFrame.appendChild(rect(TBL_W, 1, C.black, {a:0.06, x:0, y:ROW_H-1}));
    // 冻结列分隔线
    trFrame.appendChild(rect(1, ROW_H, C.black, {a:0.18, x:FROZEN_X, y:0}));

    const vals = [
      row.no, row.customer, row.name,
      row.scene, row.type, row.status,
      row.bipNo, row.total, row.ordered,
      row.sales, row.effective, row.expire,
      'OPS',
    ];
    const cellY = Math.round((ROW_H-22)/2);

    let cx=0;
    COLS.forEach((col, ci)=>{
      const val = vals[ci];

      if (col.type==='link') {
        const t = truncText(val, C.primary, col.w-16-8, {x:cx+16, y:cellY});
        trFrame.appendChild(t);

      } else if (col.type==='plain') {
        const t = truncText(val, C.black, col.w-16-8, {a:0.85, x:cx+16, y:cellY});
        trFrame.appendChild(t);

      } else if (col.type==='amount') {
        // 金额右对齐，不截断（—符号宽度很小，金额截断不友好）
        const t = text(val, C.black, 14, {lh:22, a:0.85});
        t.x = cx + col.w - t.width - 8; t.y = cellY;
        trFrame.appendChild(t);

      } else if (col.type==='sceneTag') {
        tagPill(val, C.scenePurpleBg, C.scenePurpleFg, trFrame, cx+8, cellY);

      } else if (col.type==='typeTag') {
        const tc = typeColors(val);
        tagPill(val, tc.bg, tc.fg, trFrame, cx+8, cellY);

      } else if (col.type==='statusTag') {
        const sc = statusColors(val);
        tagPill(val, sc.bg, sc.fg, trFrame, cx+8, cellY);

      } else if (col.type==='ops') {
        const ops = getOps(row.status);
        let ox = cx+8;
        ops.forEach(([label, color])=>{
          const ot = text(label, color, 14, {lh:22, x:ox, y:cellY});
          trFrame.appendChild(ot);
          ox += ot.width + 10;
        });
      }

      cx += col.w;
    });
  });

  // ══════════════════════════════════════════════════════
  // ⑤ 分页组件（全部右对齐）
  // 右→左：页 ← 输入框 ← 跳转至 ← 翻页器 ← 每页条数 ← 共N条
  // ══════════════════════════════════════════════════════
  {
    const BTN=32, GAP=4;
    let px = CARD_W - PAD;

    const tPage = text('页', C.black, 14, {lh:22, a:0.85});
    tPage.x=px-tPage.width; tPage.y=PAGER_Y+5;
    mainCard.appendChild(tPage); px=tPage.x-4;

    const jumpBox = frame('jump-input', 40, 32, C.white,
      {r:4, x:px-40, y:PAGER_Y, stroke:C.black, strokeA:0.15, strokeW:1});
    mainCard.appendChild(jumpBox);
    const tJ = text('1', C.black, 14, {lh:22, a:0.65});
    tJ.x=Math.round((40-tJ.width)/2); tJ.y=5; jumpBox.appendChild(tJ);
    px=px-40-4;

    const tGoto = text('跳转至', C.black, 14, {lh:22, a:0.65});
    tGoto.x=px-tGoto.width; tGoto.y=PAGER_Y+5;
    mainCard.appendChild(tGoto); px=tGoto.x-12;

    function mkPageBtn(label, isActive) {
      const b = frame('pgbtn-'+label, BTN, BTN,
        isActive?C.primary:C.white,
        {r:4, x:px-BTN, y:PAGER_Y,
         stroke:isActive?undefined:C.black, strokeA:0.15, strokeW:1});
      mainCard.appendChild(b);
      const t = text(label, isActive?C.white:C.black, 14,
        {lh:22, a:isActive?1:0.85});
      t.x=Math.round((BTN-t.width)/2);
      t.y=Math.round((BTN-22)/2);
      b.appendChild(t);
      px -= BTN+GAP;
    }
    mkPageBtn('›', false);
    mkPageBtn('3', false);
    mkPageBtn('2', false);
    mkPageBtn('1', true);
    mkPageBtn('‹', false);
    px -= (8-GAP);

    const PS_W=96;
    const psBox = frame('page-size', PS_W, 32, C.white,
      {r:4, x:px-PS_W, y:PAGER_Y, stroke:C.black, strokeA:0.15, strokeW:1});
    mainCard.appendChild(psBox);
    psBox.appendChild(text('20条/页', C.black, 14, {lh:22, a:0.65, x:10, y:5}));
    const psArr = icon('DropDown-Arrow', 12, C.black, 0.35);
    if (psArr) { psArr.x=PS_W-20; psArr.y=10; psBox.appendChild(psArr); }
    px=px-PS_W-16;

    const tTotal = text('共 20 条', C.black, 14, {lh:22, a:0.65});
    tTotal.x=px-tTotal.width; tTotal.y=PAGER_Y+5;
    mainCard.appendChild(tTotal);
  }

  figma.currentPage.selection = [page];
  figma.viewport.scrollAndZoomIntoView([page]);
  figma.closePlugin('✅ 合同列表 v3 已生成');
}

buildPage().catch(e => figma.closePlugin('❌ ' + e.message));
