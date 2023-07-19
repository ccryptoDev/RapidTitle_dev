import { SVGProps } from 'react';

const ArrowDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 23}
    height={props.height || 22}
    fill="none"
  >
    <path
      stroke={props.stroke || '#A6A9B3'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m17.992 8.374-6.588 5.97-6.587-5.97"
    />
  </svg>
);
export default ArrowDown;
