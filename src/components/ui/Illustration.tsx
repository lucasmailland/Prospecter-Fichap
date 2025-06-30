'use client';

interface IllustrationProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Illustration({ name, size = 'md', className = '' }: IllustrationProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };

  const illustrations = {
    'empty-search': (
      <svg viewBox="0 0 701 559.91" className={`${sizeClasses[size]} ${className}`}>
        <path
          d="M273.36863,445.90847a5.51778,5.51778,0,0,0-7.1998,2.91l-1.08008,2.14a5.51781,5.51781,0,0,0,2.91016,7.2,5.45716,5.45716,0,0,0,2.145.44,5.52975,5.52975,0,0,0,5.05468-3.35l1.08008-2.14A5.5178,5.5178,0,0,0,273.36863,445.90847Z"
          className="fill-gray-400 dark:fill-gray-500"
        />
        <circle cx="350.5" cy="280" r="120" className="fill-gray-300 dark:fill-gray-600" opacity="0.5" />
        <path
          d="M600.5,420c0,44.18-75.37,80-168.5,80s-168.5-35.82-168.5-80,75.37-80,168.5-80S600.5,375.82,600.5,420Z"
          className="fill-gray-200 dark:fill-gray-700"
          opacity="0.3"
        />
        <path
          d="M432,340a70,70,0,1,0,70,70A70.08,70.08,0,0,0,432,340Zm0,130a60,60,0,1,1,60-60A60.07,60.07,0,0,1,432,470Z"
          className="fill-gray-600 dark:fill-gray-300"
        />
        <path
          d="M483.31,461.31a8,8,0,0,1-11.32,0l-20-20a8,8,0,0,1,11.32-11.32l20,20A8,8,0,0,1,483.31,461.31Z"
          className="fill-gray-600 dark:fill-gray-300"
        />
      </svg>
    ),
    'no-data': (
      <svg viewBox="0 0 647.8 632.7" className={`${sizeClasses[size]} ${className}`}>
        <path
          d="M411.9,364.2c0,19.7-16,35.7-35.7,35.7s-35.7-16-35.7-35.7,16-35.7,35.7-35.7S411.9,344.5,411.9,364.2Z"
          className="fill-gray-300 dark:fill-gray-600"
          opacity="0.4"
        />
        <rect x="175" y="200" width="300" height="200" rx="20" className="fill-gray-200 dark:fill-gray-700" opacity="0.6" />
        <path
          d="M200,250h50v20h-50v-20zm70,0h100v20h-100v-20zm0,40h80v20h-80v-20zm-70,40h150v20h-150v-20z"
          className="fill-gray-400 dark:fill-gray-500"
        />
        <circle cx="325" cy="150" r="40" className="fill-gray-300 dark:fill-gray-600" opacity="0.5" />
      </svg>
    ),
    'analytics': (
      <svg viewBox="0 0 820 713" className={`${sizeClasses[size]} ${className}`}>
        <path
          d="M200,400L300,350L400,380L500,300L600,350"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-gray-600 dark:text-gray-300"
        />
        <circle cx="200" cy="400" r="8" className="fill-gray-600 dark:fill-gray-300" />
        <circle cx="300" cy="350" r="8" className="fill-gray-600 dark:fill-gray-300" />
        <circle cx="400" cy="380" r="8" className="fill-gray-600 dark:fill-gray-300" />
        <circle cx="500" cy="300" r="8" className="fill-gray-600 dark:fill-gray-300" />
        <circle cx="600" cy="350" r="8" className="fill-gray-600 dark:fill-gray-300" />
        <rect x="150" y="450" width="500" height="200" rx="10" className="fill-gray-200 dark:fill-gray-700" opacity="0.3" />
        <rect x="180" y="480" width="60" height="120" className="fill-gray-400 dark:fill-gray-500" opacity="0.6" />
        <rect x="260" y="500" width="60" height="100" className="fill-gray-400 dark:fill-gray-500" opacity="0.6" />
        <rect x="340" y="460" width="60" height="140" className="fill-gray-400 dark:fill-gray-500" opacity="0.6" />
        <rect x="420" y="520" width="60" height="80" className="fill-gray-400 dark:fill-gray-500" opacity="0.6" />
        <rect x="500" y="490" width="60" height="110" className="fill-gray-400 dark:fill-gray-500" opacity="0.6" />
      </svg>
    ),
    'settings': (
      <svg viewBox="0 0 512 512" className={`${sizeClasses[size]} ${className}`}>
        <path
          d="M256,150c-58.9,0-106,47.1-106,106s47.1,106,106,106s106-47.1,106-106S314.9,150,256,150z M256,320c-35.3,0-64-28.7-64-64s28.7-64,64-64s64,28.7,64,64S291.3,320,256,320z"
          className="fill-gray-600 dark:fill-gray-300"
        />
        <path
          d="M256,120c-8.8,0-16-7.2-16-16V64c0-8.8,7.2-16,16-16s16,7.2,16,16v40C272,112.8,264.8,120,256,120z M256,464c-8.8,0-16-7.2-16-16v-40c0-8.8,7.2-16,16-16s16,7.2,16,16v40C272,456.8,264.8,464,256,464z M120,256c0-8.8-7.2-16-16-16H64c-8.8,0-16,7.2-16,16s7.2,16,16,16h40C112.8,272,120,264.8,120,256z M464,256c0-8.8-7.2-16-16-16h-40c-8.8,0-16,7.2-16,16s7.2,16,16,16h40C456.8,272,464,264.8,464,256z"
          className="fill-gray-400 dark:fill-gray-500"
        />
        <circle cx="256" cy="256" r="30" className="fill-gray-300 dark:fill-gray-600" />
      </svg>
    ),
    'success': (
      <svg viewBox="0 0 596 512" className={`${sizeClasses[size]} ${className}`}>
        <circle cx="300" cy="256" r="150" className="fill-green-100 dark:fill-green-900" opacity="0.3" />
        <path
          d="M380,200L280,300L220,240"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600 dark:text-green-400"
        />
        <circle cx="300" cy="256" r="80" className="fill-green-200 dark:fill-green-800" opacity="0.4" />
      </svg>
    ),
    'loading': (
      <svg viewBox="0 0 200 200" className={`${sizeClasses[size]} ${className} animate-pulse`}>
        <circle cx="100" cy="100" r="60" className="fill-gray-200 dark:fill-gray-700" opacity="0.3" />
        <path
          d="M100,40a60,60 0 0,1 52,30"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          className="text-blue-500 dark:text-blue-400 animate-spin"
          style={{ transformOrigin: '100px 100px' }}
        />
        <circle cx="100" cy="100" r="20" className="fill-gray-400 dark:fill-gray-500" />
      </svg>
    ),
    'team': (
      <svg viewBox="0 0 512 512" className={`${sizeClasses[size]} ${className}`}>
        <circle cx="200" cy="150" r="50" className="fill-gray-400 dark:fill-gray-500" />
        <circle cx="312" cy="150" r="50" className="fill-gray-400 dark:fill-gray-500" />
        <circle cx="256" cy="200" r="35" className="fill-gray-300 dark:fill-gray-600" />
        <path
          d="M200,200c0,25-20,45-45,45h-30c-25,0-45,20-45,45v50h120v-50c0-25,20-45,45-45h30c25,0,45-20,45-45v-50h-120Z"
          className="fill-gray-300 dark:fill-gray-600"
          opacity="0.6"
        />
        <path
          d="M312,200c0,25-20,45-45,45h-30c-25,0-45,20-45,45v50h120v-50c0-25,20-45,45-45h30c25,0,45-20,45-45v-50h-120Z"
          className="fill-gray-300 dark:fill-gray-600"
          opacity="0.6"
        />
      </svg>
    )
  };

  return illustrations[name as keyof typeof illustrations] || null;
} 