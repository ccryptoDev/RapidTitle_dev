import { SVGProps } from 'react';

const FlagIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 25}
    height={props.width || 25}
    fill="none"
    {...props}
  >
    <path
      stroke={props.stroke || '#B5B5BB'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.898 21.551v-5.313m0 0c5.819-4.55 10.182 4.55 16 0V4.865c-5.818 4.549-10.181-4.55-16 0v11.373Z"
    />
  </svg>
);
export default FlagIcon;
