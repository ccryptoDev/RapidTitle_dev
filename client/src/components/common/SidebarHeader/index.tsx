import styled from '@emotion/styled';
import React from 'react';
import { useProSidebar } from 'react-pro-sidebar';
import { Typography } from '../Typography';
import RTCollapseLogo from 'assets/icons/rt_CollapseLogo.svg';
import RTExpnadedLogo from 'assets/icons/rtLogoBig.svg';
import { Link, useNavigate, useNavigation } from 'react-router-dom';

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const StyledSidebarHeader = styled.div`
  height: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;

  > div {
    width: 100%;
    overflow: hidden;
  }
`;

export const SidebarHeader = ({ children, collapsed, ...rest }: any) => {
  const { rtl, collapseSidebar } = useProSidebar();
  const navigate = useNavigate();
  return (
    <StyledSidebarHeader {...rest}>
      <div
        className="flex items-center cursor-pointer "
        onClick={() => collapseSidebar()}
      >
        {collapsed ? (
          <img
            src={RTCollapseLogo}
            className={collapsed ? '' : 'hidden'}
            alt=""
          />
        ) : (
          <div className="pt-3">
            <img src={RTExpnadedLogo} alt="" />
          </div>
        )}
      </div>
    </StyledSidebarHeader>
  );
};
