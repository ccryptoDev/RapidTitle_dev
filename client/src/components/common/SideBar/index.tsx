import React, { BaseSyntheticEvent, useState } from 'react';
import './index.view.css';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
  menuClasses,
  MenuItemStyles
} from 'react-pro-sidebar';
import { Typography } from '../Typography';
import { SidebarHeader } from '../SidebarHeader';
import { Plus } from 'components/Plus';
import { KeyIcon } from 'components/Key';
import { Message } from 'components/Message';
import { Book } from 'components/Book';
import { Setting } from 'components/Setting';
import { Badge } from '../Badge';
import dayIcon from '../../../assets/img/day.png';
import miniTitle from 'assets/icons/minttitleMenuIcon.svg';
import titleVault from 'assets/icons/titlevaultMenuIcon.svg';
import community from 'assets/icons/communityMEnuIcon.svg';
import rapidAI from 'assets/icons/rapidaiMenuIcon.svg';
import integration from 'assets/icons/integrationsMenuIcon.svg';
import sunIcon from 'assets/icons/sunMenuIcon.svg';
import lightPink from 'assets/icons/lightPink.svg';
import moonIcon from 'assets/icons/moonIcon.svg';
import { useDispatch } from 'react-redux';
import { imageListClasses } from '@mui/material';
import TitleVaultMenuIcon from 'components/icons/TitleVaultMenuIcon';
import CommunityMenuIcon from 'components/icons/CommunityMenuIcon';

type Theme = 'light' | 'dark';

const themes = {
  light: {
    sidebar: {
      backgroundColor: '#ffffff',
      color: '#607489'
    },
    menu: {
      menuContent: '#fbfcfd',
      icon: '#0098e5',
      hover: {
        backgroundColor: '#c5e4ff',
        color: '#44596e'
      },
      disabled: {
        color: '#9fb6cf'
      }
    }
  },
  dark: {
    sidebar: {
      backgroundColor: '#0b2948',
      color: '#8ba1b7'
    },
    menu: {
      menuContent: '#082440',
      icon: '#59d0ff',
      hover: {
        backgroundColor: '#00458b',
        color: '#b6c8d9'
      },
      disabled: {
        color: '#3e5e7e'
      }
    }
  }
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function SideBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const { toggleSidebar, collapseSidebar, broken, collapsed } = useProSidebar();
  const [isRTL, setIsRTL] = React.useState<boolean>(false);
  const [hasImage, setHasImage] = React.useState<boolean>(false);
  const [theme, setTheme] = React.useState<Theme>('light');
  const [activeMenu, setActiveMenu] = React.useState('title_vault');

  const dispatch = useDispatch();
  const location = useLocation();

  // handle on theme change event
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  };

  const createTitle = () => {
    navigate('/createtitle');
  };

  // handle on image change event
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasImage(e.target.checked);
  };

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: '18px',
      fontWeight: 400
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color
      }
    },
    SubMenuExpandIcon: {
      color: '#b6b7b9'
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(
              themes[theme].menu.menuContent,
              hasImage && !collapsed ? 0.4 : 1
            )
          : 'transparent'
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color
      },
      '&:hover': {
        backgroundColor: hexToRgba(
          themes[theme].menu.hover.backgroundColor,
          hasImage ? 0.8 : 1
        ),
        color: themes[theme].menu.hover.color
      }
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined
    })
  };

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div>
      <Sidebar
        image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
        rtl={isRTL}
        defaultCollapsed={true}
        breakPoint="lg"
        backgroundColor={hexToRgba(
          themes[theme].sidebar.backgroundColor,
          hasImage ? 0.9 : 1
        )}
        rootStyles={{
          color: themes[theme].sidebar.color,
          // borderRight: '1px solid grey',
          height: '85vh',
          position: 'relative'
        }}
      >
        <div>
          <div className="pb-7 ">
            <SidebarHeader collapsed={collapsed} />
          </div>
          <div className={`flex flex-col gap-4`}>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                icon={<img src={miniTitle} alt="menu item" />}
                onClick={() => {
                  createTitle();
                  dispatch({
                    type: 'SET_ACTIVE_MENU',
                    payload: 'create_title'
                  });
                }}
              >
                Create New Title
              </MenuItem>
              <MenuItem
                icon={
                  location.pathname.includes('home') ? (
                    <div className="bg-accent1-100 rounded-lg">
                      <TitleVaultMenuIcon stroke="#fff" />
                    </div>
                  ) : (
                    <TitleVaultMenuIcon />
                  )
                }
                onClick={() => {
                  navigate('/');
                  dispatch({ type: 'SET_ACTIVE_MENU', payload: 'title_vault' });
                }}
              >
                TitleVault
              </MenuItem>
              <MenuItem
                icon={
                  location.pathname.includes('community') ? (
                    <div className="bg-accent1-100 rounded-lg">
                      <CommunityMenuIcon stroke="#fff" />
                    </div>
                  ) : (
                    <CommunityMenuIcon />
                  )
                }
                suffix={<Badge variant="success">New</Badge>}
                onClick={() => {
                  navigate('/community');
                  dispatch({ type: 'SET_ACTIVE_MENU', payload: 'message' });
                }}
              >
                Community
              </MenuItem>
              {/* <SubMenu label="Community" icon={<Message/>}>
                <MenuItem onClick={() => {navigate('/community');dispatch({ type: 'SET_ACTIVE_MENU', payload:'message' })}}> Chat </MenuItem>
                <MenuItem onClick={() => {navigate('/community/digital_identity');dispatch({ type: 'SET_ACTIVE_MENU', payload:'message' })}}> Manage Accociates</MenuItem>
              </SubMenu> */}
              <MenuItem
                icon={<img src={rapidAI} alt="menu item" />}
                onClick={() => {}}
              >
                Reports
              </MenuItem>
              <MenuItem
                icon={<img src={integration} alt="menu item" />}
                onClick={() => {
                  navigate('/integrations');
                  dispatch({
                    type: 'SET_ACTIVE_MENU',
                    payload: 'integrations'
                  });
                }}
              >
                Integrations
              </MenuItem>
              <MenuItem onClick={() => {}} style={{ marginTop: 200 }}>
                {collapsed ? (
                  <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full border-2 border-[##F1F1F1]">
                    <img src={sunIcon} alt="theme icon" />
                  </div>
                ) : (
                  <div className="border-t-[1px] border-primary-20">
                    <div className="py-2 flex items-center gap-2">
                      <img src={lightPink} alt="information icon" />
                      <p className="text-sm text-secondary-100">
                        More About Rapid Title
                      </p>
                    </div>
                    <div className="w-[200px] p-1 flex justify-between rounded-full bg-primary-10">
                      <div className="px-4 py-1 flex items-center bg-primary-0 text-sm font-bold text-primary-90 rounded-full">
                        <img src={sunIcon} alt="light icon" />
                        Light
                      </div>
                      <div className="px-4 py-1 flex items-center text-sm font-bold text-primary-90 rounded-full">
                        <img src={moonIcon} alt="moon icon" />
                        Dark
                      </div>
                    </div>
                  </div>
                )}
              </MenuItem>
            </Menu>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}

export default SideBar;
