import { SVGProps } from 'react';
import { JSX } from 'react/jsx-runtime';

const CommunityMenuIcon = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={49}
    fill="none"
    {...props}
  >
    <path
      stroke={props.stroke || '#339'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m17.6 32.57 1.524-1.218.01-.009c.319-.254.479-.383.658-.474.16-.082.331-.142.508-.178.199-.04.406-.04.822-.04h8.681c1.118 0 1.678 0 2.105-.218a2 2 0 0 0 .874-.875c.218-.427.218-.986.218-2.104v-7.607c0-1.118 0-1.677-.218-2.105a2.001 2.001 0 0 0-.875-.874c-.427-.218-.987-.218-2.107-.218H18.2c-1.12 0-1.68 0-2.108.218a1.999 1.999 0 0 0-.874.874C15 18.17 15 18.73 15 19.851v11.47c0 1.066 0 1.599.219 1.873a1 1 0 0 0 .782.376c.35 0 .766-.334 1.599-1Z"
    />
  </svg>
);
export default CommunityMenuIcon;
