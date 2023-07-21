import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import './index.view.css';
import { useNavigate } from 'react-router-dom';
import listIcon from 'assets/icons/listIcon.svg';
import cardsIcon from 'assets/icons/cardsIcon.svg';
import multiIcon from 'assets/img/multi_select.svg';
import flagIcon from 'assets/img/red_flag.svg';
import CO from 'assets/icons/Capital_One_logo.svg';
import LA from 'assets/icons/DMVIconLogo.svg';

import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { holds_status_const } from 'utils/constants';
// import HoldingStatusDropdown from '../HoldingStatusDropdown';
import LockIcon from 'components/icons/LockIcon';
import ArrowDown from 'components/icons/ArrowDown';
import FlagIcon from 'components/icons/FlagIcon';

export const socket = io(`${process.env.REACT_APP_API_URL}`);

function TitleList({ viewMode, filterMode, titleVault, changeView, changeFilterMode }: any) {
  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  const [chat_room_name, setChatRoomName] = useState('');
  const [isPending, setIsPending] = React.useState(true);
  // const [isOpenedDropdown, setIsOpenedDropdown] = React.useState(false);

  // const handleClose = (data: any) =>{
  //   setIsPending(data);
  //   setIsOpenedDropdown(false);
  // }

  useEffect(() => {
    // const cb = async () => {
    //   const result: any = await getAllTitles();
    //   console.log(result);
    //   result.map((titleLink: any) => {
    //     setTimeout(async () => {
    //       let res = await axios.get(titleLink);
    //       let vehicleJson = res.data;
    //     }, 500);
    //   });
    // };
    // cb();
  }, []);

  const handleTitleDetailClick = (room_id: any, room_name: any) => {
    if (chat_room_name !== '') {
      socket.emit('leave_room', { user, chat_room_name });
    }
    setChatRoomName(room_name);
    navigate(`/titleDetail/${room_id}`, {
      state: {
        room_name
      }
    });
  };

  return (
    <div className="p-2 w-full">
      <div className="h-[34px] flex justify-between">
        <div className="flex items-center gap-[6px]">
          <p className="text-[30px]">TitleVault</p>
          <LockIcon stroke="#333399" />
        </div>
        <div className="flex items-center gap-2">
          {viewMode === 'list' ? (
            <button
              className="px-2 h-[28px] flex gap-2 bg-accent1-100 text-primary-0 items-center rounded"
              onClick={() => changeView()}
            >
              <p className="text-sm">List View</p>
              <img src={listIcon} alt="list icon" className="w-[24px]" />
            </button>
          ) : (
            <button
              className="px-2 h-[28px] flex gap-2 bg-accent1-100 text-primary-0 items-center rounded"
              onClick={() => changeView()}
            >
              <p className="text-sm">Card View</p>
              <img src={cardsIcon} alt="cards icon" className="w-[24px]" />
            </button>
          )}
          {
            filterMode === 'complete' ? (
              <button
                className="px-2 h-[28px] flex gap-2 bg-secondary-100 text-primary-0 items-center rounded"
                onClick = {() => changeFilterMode()}
              >
                <p className="text-sm">Completed</p>
              </button>
            ):(
              <button
                className="px-2 h-[28px] flex gap-2 bg-accent1-100 text-primary-0 items-center rounded"
                onClick = {() => changeFilterMode()}
              >
                <p className="text-sm">Pending</p>
              </button>
            )
          }
          <button className="px-2 h-[28px] flex gap-1 items-center rounded">
            <p>Actions</p>
            <ArrowDown stroke="#312A64" />
          </button>
        </div>
      </div>
      <div className=" flex flex-wrap gap-4 mt-2">
        {titleVault.map((title: any, index: number) => {
          return (
                <div
                  className="w-[235px] border-[1px] border-secondary-10 rounded-xl p-2"
                  key={index}
            >
              <div
                className="relative w-full h-[143px] rounded-lg cursor-pointer"
                style={{
                  backgroundImage: `url(${title.data.images[0]})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
                onClick={() =>
                  handleTitleDetailClick(
                    title.titleId,
                    title.data.make + ' - ' + title.data.plate_number
                  )
                }
              >
                <input
                  type="checkbox"
                  name="checkbox"
                  id="checkbox"
                  className="absolute top-2 left-2 bg-transparent cursor-pointer"
                />
                <FlagIcon
                  stroke="#FF0000"
                  className="absolute bottom-1 left-1 cursor-pointer"
                  strokeOpacity={0.5}
                />
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <div className="w-[55px] h-[22px] flex justify-center items-center bg-primary-0 rounded-3xl">
                    <img
                      src={CO}
                      alt="logo icon"
                      className="w-[32px] h-[11px]"
                    />
                  </div>
                  <div className="w-[55px] h-[22px] flex justify-start items-center bg-primary-0 rounded-3xl">
                    <img src={LA} alt="logo icon" className="w-[24px] " />
                    <p className="pl-2 text-[8px] text-accent1-100">L.A</p>
                  </div>
                </div>
                <img
                  src={'user1.png'}
                  width={44}
                  height={43}
                  className="absolute right-2 bottom-[-20px]"
                  alt="icon"
                />
              </div>
              <p className="text-secondary-40 text-xs mt-2">
                {title.data.number}
              </p>
              <p
                className="text-secondary-90 font-bold text-xl cursor-pointer hover:text-accent1-90"
                onClick={() =>
                  handleTitleDetailClick(
                    title.titleId,
                    title.data.make + ' - ' + title.data.plate_number
                  )
                }
              >
                {title.data.make}
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-accent1-90 text-xl mt-1">
                    ${Number(title.data.cost).toLocaleString()}
                  </p>
                  <button className="w-[84px] h-[26px] bg-accent1-100 flex justify-center items-center text-sm text-primary-0 font-bold  px-1 rounded-lg ">
                    {title.completedHolds}/{title.numHolds} Holds
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-primary-80 text-sm mt-1">
                      {30} Days
                    </p>
                    <p className="text-primary-80 text-sm mt-1">
                      {title.data.plate_number}
                    </p>
                  </div>
                  <button className={`${title.status ? "bg-secondary-70" :  "bg-accent1-70"} w-[84px] h-[35px] flex justify-center items-center text-sm text-primary-0 font-bold px-1 rounded-lg`}>
                    {title.status ? "Completed" : "Pending"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TitleList;
