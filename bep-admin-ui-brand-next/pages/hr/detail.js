// ======================================================
// BeP Admin Kit — 员工详情页（图文 + 信息区 + 操作按钮）
// 画布：1440×900，侧边栏：208px，Header：56px
// ======================================================

const ICONS = {
  "home": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 9L12 2L21 9V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22V12H15V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "bar-chart-2": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.25 20V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.25 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.25 20V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "layers": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.8923L2 6.8923L12 11.8923L22 6.8923L12 1.8923Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 16.8923L12 21.8923L22 16.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11.8923L12 16.8923L22 11.8923" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "file-text": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0068 1.82849H6.00684C4.90227 1.82849 4.00684 2.72392 4.00684 3.82849V19.8285C4.00684 20.9331 4.90227 21.8285 6.00684 21.8285H18.0068C19.1114 21.8285 20.0068 20.9331 20.0068 19.8285V7.82849L14.0068 1.82849Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.0068 1.82849V7.82849H20.0068" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.0068 12.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.0068 16.8285H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.0068 8.82849H9.00684H8.00684" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "tool": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.6982 6.30265C14.3171 6.69139 14.3171 7.31353 14.6982 7.70227L16.2977 9.30184C16.6865 9.68288 17.3086 9.68288 17.6974 9.30184L21.4663 5.53286C22.4957 7.80751 22.0084 10.4819 20.2429 12.2473C18.4775 14.0128 15.8031 14.5 13.5285 13.4707L6.62034 20.3788C5.79214 21.2071 4.44936 21.2071 3.62115 20.3788C2.79295 19.5506 2.79295 18.2079 3.62115 17.3797L10.5293 10.4715C9.49996 8.19687 9.98724 5.5225 11.7527 3.75706C13.5181 1.99162 16.1925 1.50434 18.4671 2.53367L14.7082 6.29265L14.6982 6.30265Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "pie-chart": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.2104 15.89C19.4603 20.0289 15.1643 22.4921 10.7082 21.9116C6.25216 21.331 2.73058 17.8495 2.09923 13.4003C1.46787 8.95119 3.88181 4.62732 8.00044 2.83002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.0005 12C22.0005 9.34784 20.9469 6.8043 19.0716 4.92893C17.1962 3.05357 14.6527 2 12.0005 2V12H22.0005Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "settings": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74486 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66514 20.1656 4.29 19.79C3.91445 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91445 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95235 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87235 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83445 6.74486 3.62343 6.23582 3.62343 5.705C3.62343 5.17418 3.83445 4.66514 4.21 4.29C4.58514 3.91445 5.09418 3.70343 5.625 3.70343C6.15582 3.70343 6.66486 3.91445 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95235 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87235 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83445 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83445 19.71 4.21C20.0856 4.58514 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66486 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "DropDown-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 7.73212C18.4486 7.42424 18.9229 7.39928 19.2307 7.67638C19.5044 7.92268 19.5545 8.32474 19.3677 8.62728L19.2865 8.73557L12.5365 16.2356C12.2717 16.5298 11.8321 16.5625 11.5284 16.3337L11.4215 16.2356L4.67154 8.73557C4.39445 8.42769 4.4194 7.95347 4.72729 7.67638C5.00096 7.43007 5.40606 7.42242 5.68731 7.64L5.78648 7.73212L11.9776 14.6115L18.1715 7.73212Z" fill="currentColor"/></svg>`,
  "PutAway-Arrow": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.1715 16.2356C18.4486 16.5435 18.9229 16.5684 19.2307 16.2913C19.5044 16.045 19.5545 15.643 19.3677 15.3404L19.2865 15.2321L12.5365 7.73213C12.2717 7.43787 11.8321 7.40518 11.5284 7.63404L11.4215 7.73213L4.67154 15.2321C4.39445 15.54 4.4194 16.0142 4.72729 16.2913C5.00096 16.5376 5.40606 16.5453 5.68731 16.3277L5.78648 16.2356L11.9791 9.3555L18.1715 16.2356Z" fill="currentColor"/></svg>`,
  "bell": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8C18 6.4 17.37 4.88 16.24 3.76C15.12 2.63 13.59 2 12 2C10.41 2 8.88 2.63 7.76 3.76C6.63 4.88 6 8 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21C13.55 21.3 13.3 21.55 12.998 21.73C12.69 21.9 12.35 22 12 22C11.65 22 11.31 21.9 11.002 21.73C10.7 21.55 10.45 21.3 10.27 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "user": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 21C20 21 22 21 22 19C22 17 20 11 12 11C4 11 2 17 2 19C2 21 4 21 4 21H20Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "chevron-left": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "edit-2": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "trash-2": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H5H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "download": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "phone": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22 16.92V19.92C22.0011 20.4853 21.7677 21.0268 21.3573 21.4143C20.9469 21.8018 20.3958 22.0013 19.83 21.97C16.7432 21.6467 13.7874 20.5773 11.19 18.85C8.77383 17.2669 6.72534 15.2184 5.14202 12.8C3.40602 10.1903 2.3363 7.21945 2.02002 4.12C1.98891 3.55636 2.18692 3.00718 2.57264 2.59754C2.95836 2.18791 3.49667 1.95419 4.06002 1.95H7.06002C8.05559 1.94007 8.90328 2.64632 9.06002 3.63C9.18792 4.49329 9.4069 5.34082 9.71202 6.16C9.97611 6.85667 9.7799 7.63846 9.23002 8.14L7.97002 9.4C9.44927 11.9068 11.4932 13.9508 14 15.43L15.26 14.17C15.7615 13.6201 16.5433 13.4239 17.24 13.688C18.0593 13.9931 18.9068 14.2121 19.77 14.34C20.7638 14.4988 21.4775 15.3636 21.46 16.37L22 16.92Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "mail": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "map-pin": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "briefcase": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "calendar": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 10H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "award": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.477 13.127L17 22L12 19L7 22L8.523 13.127" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "image": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "clock": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "git-branch": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="6" y1="3" x2="6" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="6" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 9C18 10.5 17.5 12 16 13C14.5 14 12 14 12 14H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

async function buildPage() {
  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
  }
  function solid(c, a = 1) { return [{ type: 'SOLID', color: c, opacity: a }]; }

  const C = {
    white:         hex('#FFFFFF'),
    pageBg:        hex('#F0F2F5'),
    sidebarBg:     hex('#002138'),
    sidebarSub:    hex('#00182a'),
    logoBlue:      hex('#006D9B'),
    primary:       hex('#006D9B'),
    textPrimary:   hex('#1A1A1A'),
    textSecond:    hex('#595959'),
    textTertiary:  hex('#8C8C8C'),
    textPlaceholder: hex('#BFBFBF'),
    border:        hex('#E5E6EB'),
    borderLight:   hex('#F0F0F0'),
    tableHeader:   hex('#FAFAFA'),
    statusGreen:   hex('#52C41A'),
    statusGreenBg: hex('#F6FFED'),
    statusOrange:  hex('#FA8C16'),
    statusOrangeBg:hex('#FFF7E6'),
    statusRed:     hex('#FF4D4F'),
    statusRedBg:   hex('#FFF1F0'),
    danger:        hex('#FF4D4F'),
    tagBlueBg:     hex('#E6F7FF'),
    tagBlue:       hex('#1890FF'),
    divider:       hex('#F0F0F0'),
    avatarBg1:     hex('#006D9B'),
    coverGrad1:    hex('#004F72'),
    coverGrad2:    hex('#0A8DC0'),
    statBg:        hex('#F5F9FC'),
  };

  await Promise.all([
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Regular' }),
    figma.loadFontAsync({ family: 'PingFang SC', style: 'Medium' }),
  ]);

  function mkFrame(name, w, h, bg, opts = {}) {
    const f = figma.createFrame();
    f.name = name; f.resize(w, h);
    f.fills = bg ? solid(bg, opts.a || 1) : [];
    f.clipsContent = opts.clip !== false;
    if (opts.r !== undefined) f.cornerRadius = opts.r;
    if (opts.x !== undefined) f.x = opts.x;
    if (opts.y !== undefined) f.y = opts.y;
    if (opts.stroke) {
      f.strokes = solid(opts.stroke, opts.strokeA || 1);
      f.strokeWeight = opts.strokeW || 1;
      f.strokeAlign = 'INSIDE';
    }
    return f;
  }
  function mkRect(w, h, color, opts = {}) {
    const r = figma.createRectangle();
    r.resize(w, h); r.fills = color ? solid(color, opts.a || 1) : [];
    if (opts.r !== undefined) r.cornerRadius = opts.r;
    if (opts.x !== undefined) r.x = opts.x;
    if (opts.y !== undefined) r.y = opts.y;
    if (opts.stroke) {
      r.strokes = solid(opts.stroke, opts.strokeA || 1);
      r.strokeWeight = opts.strokeW || 1;
      r.strokeAlign = 'INSIDE';
    }
    return r;
  }
  function mkText(chars, color, size, opts = {}) {
    const t = figma.createText();
    t.fontName = { family: 'PingFang SC', style: opts.weight || 'Regular' };
    t.fontSize = size;
    t.lineHeight = { value: opts.lh || Math.round(size * 1.6), unit: 'PIXELS' };
    t.characters = chars;
    t.fills = solid(color, opts.a || 1);
    if (opts.w !== undefined) { t.resize(opts.w, opts.h || 24); t.textAutoResize = 'HEIGHT'; }
    else { t.textAutoResize = 'WIDTH_AND_HEIGHT'; }
    if (opts.x !== undefined) t.x = opts.x;
    if (opts.y !== undefined) t.y = opts.y;
    if (opts.align) t.textAlignHorizontal = opts.align;
    return t;
  }
  function placeIcon(parent, key, size, color, opacity, cx, cy) {
    const svgStr = ICONS[key];
    if (!svgStr) return null;
    const node = figma.createNodeFromSvg(svgStr);
    node.resize(size, size);
    node.opacity = opacity;
    node.x = Math.round(cx - size / 2);
    node.y = Math.round(cy - size / 2);
    node.findAll(n => n.fills && n.fills.length > 0).forEach(n => { n.fills = solid(color); });
    node.findAll(n => n.strokes && n.strokes.length > 0).forEach(n => { n.strokes = solid(color); });
    parent.appendChild(node);
    return node;
  }

  // ── 页面 Frame ───────────────────────────────────────
  const page = mkFrame('员工详情页', 1440, 900, C.pageBg);
  figma.currentPage.appendChild(page);
  page.x = 0; page.y = 0;

  // ══════════════════════════════════════════════════════
  // 一、侧边栏
  // ══════════════════════════════════════════════════════
  const SIDEBAR_W = 208, ROW_H = 48, LOGO_H = 64;
  const sidebar = mkFrame('侧边栏', SIDEBAR_W, 900, C.sidebarBg, { clip: true });
  page.appendChild(sidebar);

  let sY = 0;

  // Logo 区
  {
    const row = mkFrame('Logo', SIDEBAR_W, LOGO_H, null);
    row.fills = []; row.x = 0; row.y = sY; sY += LOGO_H;
    sidebar.appendChild(row);
    row.appendChild(mkRect(32, 32, C.logoBlue, { r: 6, x: 24, y: 16 }));
    row.appendChild(mkText('BeP设计平台', C.white, 16, { weight: 'Medium', x: 64, y: 14, lh: 20 }));
    row.appendChild(mkText('COUNTRY GARDEN SERVICES', C.white, 7, { a: 0.6, x: 64, y: 37, lh: 10 }));
  }

  function addDivider(parent, y) {
    parent.appendChild(mkRect(160, 1, C.white, { a: 0.08, x: 24, y }));
    return 1;
  }
  function addL1(label, iconKey, opts = {}) {
    const { active = false, expanded = false } = opts;
    const op = active ? 1 : 0.5;
    const row = mkFrame(`L1·${label}`, SIDEBAR_W, ROW_H, null);
    row.fills = []; row.x = 0; row.y = sY; sY += ROW_H;
    sidebar.appendChild(row);
    placeIcon(row, iconKey, 16, C.white, op, 32, ROW_H / 2);
    row.appendChild(mkText(label, C.white, 14, { a: op, x: 52, y: 13, lh: 22 }));
    placeIcon(row, expanded ? 'PutAway-Arrow' : 'DropDown-Arrow', 12, C.white, op, 192, ROW_H / 2);
  }
  function addL2(label, opts = {}) {
    const { active = false, expanded = false } = opts;
    const op = active ? 1 : 0.5;
    const row = mkFrame(`L2·${label}`, SIDEBAR_W, ROW_H, C.sidebarSub);
    row.x = 0; row.y = sY; sY += ROW_H;
    sidebar.appendChild(row);
    row.appendChild(mkText(label, C.white, 14, { a: op, x: 40, y: 13, lh: 22 }));
    placeIcon(row, expanded ? 'PutAway-Arrow' : 'DropDown-Arrow', 12, C.white, op, 192, ROW_H / 2);
  }
  function addL3(label, opts = {}) {
    const { active = false } = opts;
    const op = active ? 1 : 0.5;
    const row = mkFrame(`L3·${label}`, SIDEBAR_W, ROW_H, C.sidebarSub);
    row.x = 0; row.y = sY; sY += ROW_H;
    sidebar.appendChild(row);
    row.appendChild(mkText(label, C.white, 14, { a: op, x: 56, y: 13, lh: 22 }));
  }

  addL1('工作台', 'home');
  addDivider(sidebar, sY); sY += 1;
  addL1('数据分析', 'bar-chart-2');
  addDivider(sidebar, sY); sY += 1;
  addL1('组件管理', 'layers', { active: true, expanded: true });
  addL2('设计规范', { expanded: false });
  addL2('人员管理', { expanded: true });
  addL3('员工列表', { active: true });
  addL3('部门管理');
  addL3('角色权限');
  addL2('资产库');
  addDivider(sidebar, sY); sY += 1;
  addL1('合同管理', 'file-text');
  addDivider(sidebar, sY); sY += 1;
  addL1('系统工具', 'tool');
  addDivider(sidebar, sY); sY += 1;
  addL1('报表中心', 'pie-chart');
  addDivider(sidebar, sY); sY += 1;
  addL1('系统设置', 'settings');

  // ══════════════════════════════════════════════════════
  // 二、顶部 Header
  // ══════════════════════════════════════════════════════
  const HEADER_H = 56;
  const CONTENT_X = SIDEBAR_W;
  const CONTENT_W = 1440 - SIDEBAR_W; // 1232

  const header = mkFrame('Header', CONTENT_W, HEADER_H, C.white, { stroke: C.border, strokeW: 1 });
  page.appendChild(header);
  header.x = CONTENT_X; header.y = 0;

  // 面包屑：人员管理 / 员工列表 / 员工详情
  {
    header.appendChild(mkText('人员管理', C.textTertiary, 14, { x: 24, y: 18, lh: 20 }));
    header.appendChild(mkText('/', C.textTertiary, 14, { x: 84, y: 18, lh: 20 }));
    header.appendChild(mkText('员工列表', C.textTertiary, 14, { x: 96, y: 18, lh: 20 }));
    header.appendChild(mkText('/', C.textTertiary, 14, { x: 154, y: 18, lh: 20 }));
    header.appendChild(mkText('员工详情', C.primary, 14, { weight: 'Medium', x: 166, y: 18, lh: 20 }));
  }

  // 右侧：铃铛 + 分隔线 + 头像
  {
    placeIcon(header, 'bell', 20, C.textSecond, 1, CONTENT_W - 72, HEADER_H / 2);
    header.appendChild(mkRect(1, 24, C.border, { x: CONTENT_W - 48, y: 16 }));
    header.appendChild(mkRect(28, 28, C.primary, { r: 14, x: CONTENT_W - 40, y: 14 }));
    const uNode = figma.createNodeFromSvg(ICONS['user']);
    uNode.resize(16, 16); uNode.x = CONTENT_W - 36; uNode.y = 20;
    uNode.findAll(n => n.strokes && n.strokes.length > 0).forEach(n => { n.strokes = solid(C.white); });
    header.appendChild(uNode);
  }

  // ══════════════════════════════════════════════════════
  // 三、内容区
  // ══════════════════════════════════════════════════════
  const CONTENT_H = 900 - HEADER_H; // 844
  const MARGIN = 16;
  const CARD_W = CONTENT_W - MARGIN * 2; // 1200
  const PAD = 24;

  const content = mkFrame('内容区', CONTENT_W, CONTENT_H, C.pageBg);
  page.appendChild(content);
  content.x = CONTENT_X; content.y = HEADER_H;

  let cy = MARGIN;

  // ── 卡片1：图文区（头图 + 头像 + 基本信息 + 状态 + 统计） ──
  const PROFILE_CARD_H = 196;
  const profileCard = mkFrame('图文区', CARD_W, PROFILE_CARD_H, C.white, { r: 8, clip: true });
  content.appendChild(profileCard);
  profileCard.x = MARGIN; profileCard.y = cy;

  // 封面渐变背景（顶部 96px）
  const coverH = 96;
  const coverBg = mkRect(CARD_W, coverH, C.coverGrad1, { r: 0, x: 0, y: 0 });
  profileCard.appendChild(coverBg);
  // 渐变装饰圆圈
  const deco1 = mkRect(160, 160, C.coverGrad2, { r: 80, x: CARD_W - 120, y: -60 });
  deco1.opacity = 0.3;
  profileCard.appendChild(deco1);
  const deco2 = mkRect(80, 80, C.white, { r: 40, x: CARD_W - 200, y: 20 });
  deco2.opacity = 0.06;
  profileCard.appendChild(deco2);

  // 封面文字：姓名 + 职位（白色，在封面上）
  profileCard.appendChild(mkText('张伟', C.white, 20, { weight: 'Medium', x: PAD + 88, y: 18, lh: 28 }));
  profileCard.appendChild(mkText('高级设计师  |  产品设计部', C.white, 13, { a: 0.8, x: PAD + 88, y: 50, lh: 20 }));

  // 工号标签
  const noTagW = 120;
  const noTag = mkRect(noTagW, 22, C.white, { r: 11, x: PAD + 88, y: 70, a: 0.15 });
  profileCard.appendChild(noTag);
  profileCard.appendChild(mkText('EMP-2024-001', C.white, 11, { a: 0.9, x: PAD + 102, y: 74, lh: 16 }));

  // 大头像（跨封面与内容区）
  const AV_SIZE = 72;
  const AV_X = PAD;
  const AV_Y = coverH - AV_SIZE / 2; // 垂直居中跨越分界线
  const avBorder = mkRect(AV_SIZE + 4, AV_SIZE + 4, C.white, { r: (AV_SIZE + 4) / 2, x: AV_X - 2, y: AV_Y - 2 });
  profileCard.appendChild(avBorder);
  const av = mkRect(AV_SIZE, AV_SIZE, C.primary, { r: AV_SIZE / 2, x: AV_X, y: AV_Y });
  profileCard.appendChild(av);
  profileCard.appendChild(mkText('张', C.white, 28, { weight: 'Medium', x: AV_X + 20, y: AV_Y + 20, lh: 32 }));

  // 在职状态标签（右上角）
  const stTagW = 52, stTagH = 24;
  profileCard.appendChild(mkRect(stTagW, stTagH, C.statusGreenBg, { r: 4, x: CARD_W - PAD - stTagW, y: 12 }));
  profileCard.appendChild(mkText('在职', C.statusGreen, 12, { weight: 'Medium', x: CARD_W - PAD - stTagW + 14, y: 16, lh: 16 }));

  // 分隔线（封面与内容区）
  const divLine = mkRect(CARD_W, 1, C.border, { x: 0, y: coverH });
  profileCard.appendChild(divLine);

  // 下方信息区（4 个统计卡）
  const statsY = coverH + 20;
  const statItems = [
    { icon: 'briefcase', label: '工龄',   value: '4 年 2 月' },
    { icon: 'award',     label: '绩效',   value: 'A 级优秀' },
    { icon: 'calendar',  label: '入职',   value: '2021-03-15' },
    { icon: 'clock',     label: '剩余年假', value: '8 天' },
  ];
  const STAT_W = 180, STAT_GAP = 16;
  const statsStartX = PAD + AV_SIZE + 16 + 120 + 32; // 头像右侧留白后排列
  statItems.forEach((item, i) => {
    const sx = statsStartX + i * (STAT_W + STAT_GAP);
    const statBox = mkRect(STAT_W, 60, C.statBg, { r: 6, x: sx, y: statsY });
    profileCard.appendChild(statBox);
    placeIcon(profileCard, item.icon, 16, C.primary, 0.7, sx + 20, statsY + 20);
    profileCard.appendChild(mkText(item.label, C.textTertiary, 11, { x: sx + 32, y: statsY + 12, lh: 16 }));
    profileCard.appendChild(mkText(item.value, C.textPrimary, 14, { weight: 'Medium', x: sx + 12, y: statsY + 34, lh: 20 }));
  });

  // 联系方式（头像右侧，封面下）
  {
    const cx0 = PAD + AV_SIZE + 16;
    placeIcon(profileCard, 'phone', 14, C.textTertiary, 1, cx0 + 8, statsY + 14);
    profileCard.appendChild(mkText('138 0000 1111', C.textSecond, 13, { x: cx0 + 18, y: statsY + 6, lh: 20 }));
    placeIcon(profileCard, 'mail', 14, C.textTertiary, 1, cx0 + 8, statsY + 38);
    profileCard.appendChild(mkText('zhangwei@bep.com', C.textSecond, 13, { x: cx0 + 18, y: statsY + 30, lh: 20 }));
  }

  cy += PROFILE_CARD_H + MARGIN;

  // ── 卡片2：详细信息区 ─────────────────────────────────
  // 两列布局：左侧基本信息 + 右侧合同/教育信息
  const INFO_CARD_H = 300;
  const LEFT_W = Math.round(CARD_W * 0.62) - 8;   // ~736
  const RIGHT_W = CARD_W - LEFT_W - 8;              // ~456

  // 左侧卡片：基本信息
  const leftCard = mkFrame('基本信息', LEFT_W, INFO_CARD_H, C.white, { r: 8 });
  content.appendChild(leftCard);
  leftCard.x = MARGIN; leftCard.y = cy;

  // 卡片标题
  leftCard.appendChild(mkText('基本信息', C.textPrimary, 15, { weight: 'Medium', x: PAD, y: PAD, lh: 22 }));
  leftCard.appendChild(mkRect(LEFT_W - PAD * 2, 1, C.divider, { x: PAD, y: PAD + 30 }));

  // 字段 grid（两列，每行 key-value）
  const fields = [
    ['姓名',   '张伟'],
    ['工号',   'EMP-2024-001'],
    ['性别',   '男'],
    ['出生日期', '1990-08-22'],
    ['手机号',  '138 0000 1111'],
    ['邮箱',   'zhangwei@bep.com'],
    ['所属部门', '产品设计部'],
    ['职位',   '高级设计师'],
    ['直属上级', '李明华'],
    ['工作地点', '广州市天河区'],
    ['入职日期', '2021-03-15'],
    ['合同类型', '劳动合同'],
  ];

  const FIELD_COL_W = (LEFT_W - PAD * 2) / 2;
  const FIELD_ROW_H = 44;
  const fieldsStartY = PAD + 38;

  fields.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const fx = PAD + col * FIELD_COL_W;
    const fy = fieldsStartY + row * FIELD_ROW_H;
    leftCard.appendChild(mkText(f[0], C.textTertiary, 12, { x: fx, y: fy, lh: 18 }));
    leftCard.appendChild(mkText(f[1], C.textPrimary, 13, { x: fx, y: fy + 20, lh: 20 }));
  });

  // 右侧卡片：合同 & 教育信息
  const rightCard = mkFrame('合同&教育', RIGHT_W, INFO_CARD_H, C.white, { r: 8 });
  content.appendChild(rightCard);
  rightCard.x = MARGIN + LEFT_W + 8; rightCard.y = cy;

  rightCard.appendChild(mkText('合同 & 教育', C.textPrimary, 15, { weight: 'Medium', x: PAD, y: PAD, lh: 22 }));
  rightCard.appendChild(mkRect(RIGHT_W - PAD * 2, 1, C.divider, { x: PAD, y: PAD + 30 }));

  const rightFields = [
    ['合同编号',  'CTR-2021-0315'],
    ['合同开始',  '2021-03-15'],
    ['合同到期',  '2024-03-14'],
    ['续签次数',  '1 次'],
    ['最高学历',  '本科'],
    ['毕业院校',  '华南理工大学'],
    ['专业',    '工业设计'],
    ['毕业年份',  '2013 年'],
  ];

  const R_FIELD_ROW_H = 44;
  const rFieldsStartY = PAD + 38;

  rightFields.forEach((f, i) => {
    const fy = rFieldsStartY + i * R_FIELD_ROW_H;
    rightCard.appendChild(mkText(f[0], C.textTertiary, 12, { x: PAD, y: fy, lh: 18 }));
    rightCard.appendChild(mkText(f[1], C.textPrimary, 13, { x: PAD + 88, y: fy, lh: 20 }));
    // 分隔线
    if (i < rightFields.length - 1) {
      rightCard.appendChild(mkRect(RIGHT_W - PAD * 2, 1, C.divider, { x: PAD, y: fy + 30 }));
    }
  });

  cy += INFO_CARD_H + MARGIN;

  // ── 卡片3：操作按钮区 ─────────────────────────────────
  const ACTION_CARD_H = 72;
  const actionCard = mkFrame('操作区', CARD_W, ACTION_CARD_H, C.white, { r: 8 });
  content.appendChild(actionCard);
  actionCard.x = MARGIN; actionCard.y = cy;

  // 返回按钮（左侧）
  const backBtn = mkRect(88, 36, C.white, { r: 4, x: PAD, y: (ACTION_CARD_H - 36) / 2, stroke: C.border, strokeW: 1 });
  actionCard.appendChild(backBtn);
  placeIcon(actionCard, 'chevron-left', 16, C.textSecond, 1, PAD + 16, ACTION_CARD_H / 2);
  actionCard.appendChild(mkText('返回', C.textSecond, 13, { x: PAD + 26, y: (ACTION_CARD_H - 20) / 2, lh: 20 }));

  // 右侧按钮组
  const btns = [
    { label: '导出档案',  icon: 'download', style: 'outline', w: 100 },
    { label: '删除员工',  icon: 'trash-2',  style: 'danger',  w: 100 },
    { label: '编辑信息',  icon: 'edit-2',   style: 'primary', w: 100 },
  ];
  let bx = CARD_W - PAD;
  btns.reverse().forEach(btn => {
    bx -= btn.w;
    const isBg = btn.style === 'primary' ? C.primary : btn.style === 'danger' ? C.statusRedBg : C.white;
    const isFg = btn.style === 'primary' ? C.white : btn.style === 'danger' ? C.statusRed : C.textSecond;
    const isBorder = btn.style === 'outline' ? C.border : btn.style === 'danger' ? C.statusRed : null;
    const box = mkRect(btn.w, 36, isBg, { r: 4, x: bx, y: (ACTION_CARD_H - 36) / 2, stroke: isBorder || undefined, strokeW: 1, strokeA: 0.5 });
    if (!isBorder) box.strokes = [];
    actionCard.appendChild(box);
    placeIcon(actionCard, btn.icon, 14, isFg, 1, bx + 16, ACTION_CARD_H / 2);
    actionCard.appendChild(mkText(btn.label, isFg, 13, { x: bx + 26, y: (ACTION_CARD_H - 20) / 2, lh: 20 }));
    bx -= 8;
  });

  // ── Resize sidebar ───────────────────────────────────
  sidebar.resize(SIDEBAR_W, 900);

  figma.currentPage.selection = [page];
  figma.viewport.scrollAndZoomIntoView([page]);
  console.log('✅ 员工详情页生成完毕');
}

buildPage();
