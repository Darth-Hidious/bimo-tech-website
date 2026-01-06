export interface Brand {
  name: string;
  svg: string;
}

export const industryBrands: Brand[] = [
  {
    name: 'Bosch',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="currentColor">
      <path d="M10 15h35c8.284 0 15 6.716 15 15s-6.716 15-15 15H10V15zm8 8v14h27c3.866 0 7-3.134 7-7s-3.134-7-7-7H18z"/>
      <path d="M70 30c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15-15-6.716-15-15zm8 0c0 3.866 3.134 7 7 7s7-3.134 7-7-3.134-7-7-7-7 3.134-7 7z"/>
      <path d="M108 30c0-3.866 3.134-7 7-7s7 3.134 7 7v.5c0 2.485-2.015 4.5-4.5 4.5h-5c-2.485 0-4.5-2.015-4.5-4.5V30zm15 4.5c1.381 0 2.5-1.119 2.5-2.5s-1.119-2.5-2.5-2.5-2.5 1.119-2.5 2.5 1.119 2.5 2.5 2.5z"/>
      <path d="M138 30c0-3.866 3.134-7 7-7 2.761 0 5.142 1.609 6.276 3.943.568 1.169.224 2.585-.769 3.165-1.993 1.162-4.557.445-5.719-1.602-.231-.407-.788-.548-1.245-.316-.457.232-.628.789-.396 1.196 1.161 2.047.445 4.557-1.602 5.719-2.047 1.161-4.557.445-5.719-1.602C138.445 31.456 138 30.752 138 30z"/>
      <path d="M168 15v30h8V35h10c3.866 0 7-3.134 7-7v-6c0-3.866-3.134-7-7-7h-18zm8 8h10v6h-10v-6z"/>
    </svg>`
  },
  {
    name: 'Siemens',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="currentColor">
      <path d="M15 25c0-2.761 2.239-5 5-5h15c2.761 0 5 2.239 5 5v10c0 2.761-2.239 5-5 5H20c-2.761 0-5-2.239-5-5V25zm6 0v10h14V25H21z"/>
      <rect x="50" y="20" width="6" height="20"/>
      <path d="M65 20v20h20V20H65zm6 6h8v8h-8v-8z"/>
      <path d="M95 20v20h6v-8l8 8h8l-10-10 10-10h-8l-8 8v-8h-6z"/>
      <path d="M125 20v20h20V20h-20zm6 6h8v8h-8v-8z"/>
      <path d="M155 20v20h6V30l6 10h6V20h-6v10l-6-10h-6z"/>
    </svg>`
  },
  {
    name: 'BASF',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="currentColor">
      <path d="M15 15h25c5.523 0 10 4.477 10 10v10c0 5.523-4.477 10-10 10H15V15zm7 7v21h18c2.209 0 4-1.791 4-4V26c0-2.209-1.791-4-4-4H22z"/>
      <path d="M60 15h7l15 30h-8l-3-6H58l-3 6h-8l15-30zm3.5 8L59 33h9l-4.5-10z"/>
      <path d="M90 30c0-3.866 3.134-7 7-7s7 3.134 7 7v.5c0 2.485-2.015 4.5-4.5 4.5h-5c-2.485 0-4.5-2.015-4.5-4.5V30zm15 4.5c1.381 0 2.5-1.119 2.5-2.5s-1.119-2.5-2.5-2.5-2.5 1.119-2.5 2.5 1.119 2.5 2.5 2.5z"/>
      <path d="M120 15v7h12v23h7V22h12v-7h-31z"/>
    </svg>`
  },
  {
    name: '3M',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="currentColor">
      <path d="M30 15h8l8 15 8-15h8v30h-7V25l-9 15h-2l-9-15v20h-7V15z"/>
      <path d="M80 15h8l8 15 8-15h8v30h-7V25l-9 15h-2l-9-15v20h-7V15z"/>
      <circle cx="140" cy="30" r="15"/>
      <circle cx="140" cy="30" r="8" fill="#000"/>
    </svg>`
  },
  {
    name: 'DuPont',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="currentColor">
      <path d="M15 15h25c8.284 0 15 6.716 15 15s-6.716 15-15 15H15V15zm7 7v21h18c4.418 0 8-3.582 8-8s-3.582-8-8-8H22z"/>
      <path d="M65 15v22c0 4.418 3.582 8 8 8s8-3.582 8-8V15h7v22c0 8.284-6.716 15-15 15s-15-6.716-15-15V15h7z"/>
      <path d="M100 15h20c4.418 0 8 3.582 8 8s-3.582 8-8 8h-13v14h-7V15zm7 7v7h13v-7h-13z"/>
      <path d="M138 30c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15-15-6.716-15-15zm7 0c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8-8 3.582-8 8z"/>
      <path d="M178 15v30h-7V29l-8 16h-7V15h7v16l8-16h7z"/>
    </svg>`
  },
  {
    name: 'Dow',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="currentColor">
      <path d="M30 15h25c8.284 0 15 6.716 15 15s-6.716 15-15 15H30V15zm7 7v21h18c4.418 0 8-3.582 8-8s-3.582-8-8-8H37z"/>
      <path d="M80 30c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15-15-6.716-15-15zm7 0c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8-8 3.582-8 8z"/>
      <path d="M120 15h7l6 18 6-18h6l6 18 6-18h7l-10 30h-7l-5-15-5 15h-7l-10-30z"/>
    </svg>`
  },
  {
    name: 'Mitsubishi',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="currentColor">
      <path d="M100 10l15 15h-30l15-15z"/>
      <path d="M85 25l-15 15v-30l15 15z"/>
      <path d="M115 25l15 15V10l-15 15z"/>
      <text x="60" y="50" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="currentColor">MITSUBISHI</text>
    </svg>`
  },
  {
    name: 'Sumitomo',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="currentColor">
      <circle cx="40" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="3"/>
      <path d="M40 15v30M25 30h30"/>
      <text x="70" y="38" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="currentColor">SUMITOMO</text>
    </svg>`
  }
];
