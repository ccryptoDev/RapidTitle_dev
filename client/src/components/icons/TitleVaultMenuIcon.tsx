import { SVGProps } from 'react';
import { JSX } from 'react/jsx-runtime';

const TitleVaultMenuIcon = (
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
      d="M21.23 21.65H19.2c-1.12 0-1.68 0-2.108.218a1.999 1.999 0 0 0-.874.874C16 23.17 16 23.73 16 24.851v5.6c0 1.12 0 1.68.218 2.107a2 2 0 0 0 .874.875c.427.217.987.217 2.105.217h9.606c1.118 0 1.677 0 2.104-.217.377-.192.683-.498.875-.875.218-.427.218-.986.218-2.104v-5.607c0-1.118 0-1.677-.218-2.105a2.001 2.001 0 0 0-.875-.874c-.427-.218-.987-.218-2.107-.218H26.77m-5.538 0h5.538m-5.538 0a.23.23 0 0 1-.231-.23v-2.77a3 3 0 1 1 6 0v2.77c0 .127-.104.23-.231.23"
    />
  </svg>
);
export default TitleVaultMenuIcon;
