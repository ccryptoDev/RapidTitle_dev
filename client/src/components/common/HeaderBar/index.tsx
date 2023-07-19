import React, { BaseSyntheticEvent, useState, useRef, useEffect } from 'react';
import './index.view.css';
import { logout, setWallet } from 'store/actions/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import avatar from 'assets/icons/avatar.svg';
import SearchIcon from 'assets/icons/searchIcon.svg';
import ListAddIcon from 'assets/icons/listAddIcon.svg';
import FlagIcon from 'assets/icons/flagIcon.svg';
import BellIcon from 'assets/icons/bellIcon.svg';
import Drawer from 'react-modern-drawer';
import walletLogo from 'assets/icons/rtLogoBig.svg';
import categoryIcon from 'assets/icons/categoryIcon.svg';
import metamaskLogo from 'assets/img/metamask.png';
import skeleton from 'assets/img/skeleton.png';
import wallet from 'utils/wallet';
import { getUserAddress } from 'utils/useWeb3';
import { walletList } from 'utils/constants';

function HeaderBar({ search_title, titledata }: any) {
  const navigate = useNavigate();
  const {search} = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [walletType, setWalletType] = React.useState('');
  const [tempWalletType, setTempWalletType] = React.useState('');
  const [searchTitle, setSearchTitle] = React.useState('');
  const [showList, setShowList] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTitles = titledata && titledata.filter((data: any) =>
    data.data.make.toLowerCase().includes(searchTitle.toLocaleLowerCase())
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTitle(value);
    search_title(value);
  };

  const handleItemClick = (item: string) => {
    setSearchTitle(item);
    setShowList(false);
    search_title(searchTitle);
  };

  const handleClickOutside = (event: MouseEvent) => {
    console.log('out clicked');
    setShowList(false);
    // Check if the click target is outside of the input element and the list
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      event.target !== inputRef.current &&
      showList
    ) {
      setShowList(false);
    }
  };
  
  useEffect(() => {
    const query = new URLSearchParams(search);
    if(query.get('connectwallet')){
      setIsOpen(true)
    }
    // Add event listener for click events on the document
    document.addEventListener('click', handleClickOutside);

    return () => {
      // Remove event listener on unmount
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const connectWallet = async (param: string) => {
    await wallet.setProvider(param);
    await wallet.login(param);
    const walletAddress = await getUserAddress();
    if (walletAddress) {
      const result = await setWallet({ wallet: walletAddress });
      console.log(result);
      setCollapsed(true);
      toggleDrawer();
    }
  };

  const selectWallet = (param: string, e: any) => {
    setTempWalletType(param);
    const allWithClass = Array.from(document.getElementsByClassName('active'));
    //toggle wallet logo
    allWithClass.map((elem) => {
      elem.classList.toggle('active');
      elem.children[0].classList.toggle('hidden');
      elem.children[1].classList.toggle('hidden');
      return null;
    });

    e.currentTarget.classList.toggle('active');
    e.currentTarget.children[0].classList.toggle('hidden');
    e.currentTarget.children[1].classList.toggle('hidden');
  };

  const capitalizeFirstLetter = (param: string) => {
    // get the first character of the string
    let firstCharacter = param.charAt(0);

    // convert the first character to uppercase
    firstCharacter = firstCharacter.toUpperCase();

    // combine the first character with the rest of the string
    let capitalizedString = firstCharacter + param.slice(1);

    // log the capitalized string to the console
    return capitalizedString;
  };

  return (
    <div className="w-full h-[47px]">
      <div className="pl-1 flex justify-between items-center gap-4">
        <div className="relative flex-grow pl-4 flex items-center bg-secondary-80 border-[1px] border-secondary-60 rounded-xl">
          <img src={SearchIcon} alt="search icon" className="mr-3" />
          <input
            type="text"
            placeholder="Search for titles"
            className="bg-secondary-80 w-full outline-none text-primary-0 placeholder:text-primary-0"
            value={searchTitle}
            onChange={handleInputChange}
            ref={inputRef}
          />
          <button className="w-[47px] h-[47px] flex justify-center items-center bg-primary-0 border-[1px] border-primary-30 rounded-xl">
            <img src={ListAddIcon} alt="add icon" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-[47px] h-[47px] flex justify-center items-center bg-primary-0 border-[1px] border-primary-30 rounded-xl">
            <img src={FlagIcon} alt="flag icon" />
          </button>
          <button className="relative w-[47px] h-[47px] flex justify-center items-center bg-primary-0 border-[1px] border-primary-30 rounded-xl">
            <div className="absolute right-[14px] top-[12px] w-2 h-2 rounded-full bg-accent1-100 border border-primary-0"></div>
            <img src={BellIcon} alt="notification icon" />
          </button>
          <button
            onClick={() => toggleDrawer()}
            className=" h-[47px] px-4 flex justify-center items-center bg-primary-0 border-[1px] border-primary-30 rounded-xl"
          >
            <p className="text-primary-50">WalletName</p>
            <img src={avatar} className="ml-3" alt="avatar" />
          </button>
        </div>
      </div>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
        size={423}
        overlayColor="rgba(217, 217, 217, 0.70)"
        overlayOpacity={0.7}
      >
        <div className="px-10 py-10 max-h-full">
          <div className="flex justify-center">
            <img src={walletLogo} alt="Rapid title logo" className="h-[64px]" />
          </div>
          <p className="text-sm text-primary-60 mt-10">
            What is a <span className="text-[#FF85A3]">wallet</span>?
          </p>
          <button className="wallet-btn mt-[36px] w-full flex justify-center items-center py-2 px-2 rounded-full">
            <img src={categoryIcon} alt="category icon" />
            <span className="ml-3 text-sm font-semibold text-secondary-80">
              Select your wallet
            </span>
          </button>
          <div className={walletType ? `mt-[48px]` : 'hidden'}>
            <span>Chosen Wallet</span>
            <div className=" flex items-center justify-center mt-2">
              <img src={metamaskLogo} alt="" width={24} height={24} />
              <span className="flex-1 ml-2 overflow-hidden">
                {capitalizeFirstLetter(walletType)}
              </span>
              <span
                className="cursor-pointer"
                onClick={() => setCollapsed(!collapsed)}
              >
                <svg
                  width="14"
                  height="9"
                  viewBox="0 0 14 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={collapsed ? `hidden` : ''}
                >
                  <path
                    d="M1.16732 7.5L7.00065 1.66667L12.834 7.5"
                    stroke="#4A5567"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  width="14"
                  height="9"
                  viewBox="0 0 14 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ transform: 'rotate(180deg)' }}
                  className={collapsed ? '' : 'hidden'}
                >
                  <path
                    d="M1.16732 7.5L7.00065 1.66667L12.834 7.5"
                    stroke="#4A5567"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className={walletType ? 'hidden' : ''}>
            <div
              className={`w-full flex items-center justify-between mt-[48px]`}
            >
              <p className="text-left text-base text-primary-40">Wallets</p>
              <span
                className="cursor-pointer"
                onClick={() => setCollapsed(!collapsed)}
              >
                <svg
                  width="14"
                  height="9"
                  viewBox="0 0 14 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={collapsed ? `hidden` : ''}
                >
                  <path
                    d="M1.16732 7.5L7.00065 1.66667L12.834 7.5"
                    stroke="#4A5567"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  width="14"
                  height="9"
                  viewBox="0 0 14 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ transform: 'rotate(180deg)' }}
                  className={collapsed ? '' : 'hidden'}
                >
                  <path
                    d="M1.16732 7.5L7.00065 1.66667L12.834 7.5"
                    stroke="#4A5567"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className={collapsed ? `hidden` : ''}>
            <div className=" flex items-center mt-[29px]">
              <span className="text-xs text-primary-40">
                MOST POPULAR WALLETS
              </span>
            </div>
            {walletList.map((w, index) => {
              return (
                <div
                  className=" flex items-center p-[10px] cursor-pointer"
                  key={index}
                  onClick={(e) => selectWallet(w.id, e)}
                >
                  <img src={skeleton} alt="" width={24} height={24} />
                  <img
                    src={metamaskLogo}
                    alt=""
                    width={24}
                    height={24}
                    className="hidden"
                  />
                  <span className="ml-2 text-base">{w.name}</span>
                </div>
              );
            })}
            <button className="bg-secondary-100 mt-4 w-full flex justify-center items-center py-2 px-2 rounded-full">
              <span className="ml-3 text-primary-0">Load More</span>
            </button>
            <button
              className="bg-accent1-100 mt-4 w-full flex justify-center items-center py-2 px-2 rounded-full mb-[39px]"
              onClick={() => {
                setWalletType(tempWalletType);
                setCollapsed(true);
              }}
            >
              <span className="ml-3 text-white">Select Wallet</span>
            </button>
          </div>
          {walletType && collapsed ? (
            <div>
              <button
                className="bg-[#FF3366] mt-[36px] w-full flex justify-center items-center py-2 px-2 rounded-full mb-[39px]"
                onClick={() => connectWallet(walletType)}
              >
                <span className="ml-3 text-primary-0">
                  Continue to RapidTitle
                </span>
              </button>

              <span className="text-grey ">
                Remember, once you have selected a wallet, all Titles will be
                attached to that account until you move them.
              </span>
            </div>
          ) : (
            <div></div>
          )}

          <button
            className="mt-[36px] flex justify-end w-full items-center py-2 px-2"
            onClick={logout}
          >
            <svg
              width="19"
              height="18"
              viewBox="0 0 19 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M2.40625 4.83525C2.40625 2.997 3.92893 1.5 5.79965 1.5H9.52048C11.3874 1.5 12.9062 2.9925 12.9062 4.82775V13.1648C12.9062 15.0037 11.3836 16.5 9.51209 16.5H5.79278C3.92511 16.5 2.40625 15.0075 2.40625 13.1722V12.4672V4.83525Z"
                fill="#A8A8A8"
              />
              <path
                d="M17.2411 8.5911L15.1068 6.40935C14.8862 6.18435 14.5312 6.18435 14.3114 6.41085C14.0922 6.63735 14.093 7.0026 14.3128 7.2276L15.4823 8.42235H14.361H8.0683C7.75786 8.42235 7.50586 8.6811 7.50586 8.99985C7.50586 9.31935 7.75786 9.57735 8.0683 9.57735H15.4823L14.3128 10.7721C14.093 10.9971 14.0922 11.3623 14.3114 11.5888C14.4217 11.7021 14.5656 11.7591 14.7102 11.7591C14.8533 11.7591 14.9972 11.7021 15.1068 11.5903L17.2411 9.40935C17.3471 9.3006 17.407 9.1536 17.407 8.99985C17.407 8.84685 17.3471 8.69985 17.2411 8.5911Z"
                fill="#A8A8A8"
              />
            </svg>
            <span className="ml-3 text-gray">Logout</span>
          </button>
        </div>
      </Drawer>
    </div>
  );
}

export default HeaderBar;
