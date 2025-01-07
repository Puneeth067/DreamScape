const DreamscapeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-full w-full">
    <defs>
      <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{stopColor: "#4F46E5", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: "#7C3AED", stopOpacity: 1}} />
      </linearGradient>
      
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: "#FBBF24", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: "#F59E0B", stopOpacity: 1}} />
      </linearGradient>
      
      <pattern id="starPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M10,2 L11,8 L17,8 L12,12 L14,18 L10,14 L6,18 L8,12 L3,8 L9,8 Z" 
              fill="url(#starGradient)" 
              transform="scale(0.7)" />
      </pattern>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#skyGradient)" />
    <path d="M65,35 A25,25 0 1,1 35,65 A20,20 0 1,0 65,35 Z" 
          fill="white" 
          opacity="0.95" />
    <path d="M40,45 L60,45 C65,45 65,45 65,50 L65,65 C65,70 65,70 60,70 L40,70 C35,70 35,70 35,65 L35,50 C35,45 35,45 40,45" 
          fill="white" 
          opacity="0.9" />
    <line x1="35" y1="55" x2="65" y2="55" stroke="#4F46E5" strokeWidth="1" opacity="0.3" />
    <line x1="35" y1="62" x2="65" y2="62" stroke="#4F46E5" strokeWidth="1" opacity="0.3" />
    <circle cx="30" cy="30" r="1.5" fill="#FBBF24" opacity="0.8" />
    <circle cx="70" cy="35" r="1" fill="#FBBF24" opacity="0.8" />
    <circle cx="65" cy="25" r="1.2" fill="#FBBF24" opacity="0.8" />
    <circle cx="75" cy="50" r="1" fill="#FBBF24" opacity="0.8" />
    <circle cx="25" cy="45" r="1" fill="#FBBF24" opacity="0.8" />
    <path d="M20,25 L30,35 M22,27 L28,33" 
          stroke="#FBBF24" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          opacity="0.8" />
  </svg>
);

export default DreamscapeIcon;