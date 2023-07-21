import React, { BaseSyntheticEvent, useState } from 'react';
import './index.view.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { KeyIcon } from 'components/Key';
import multiIcon from 'assets/img/multi_select.svg';
import CO from 'assets/img/titleTable/dmv_icon.png';
import LA from 'assets/img/titleTable/lender_icon.png';
import Key from 'assets/img/key_icon.png';
import LockIcon from 'components/icons/LockIcon';
import listIcon from 'assets/icons/listIcon.svg';
import cardsIcon from 'assets/icons/cardsIcon.svg';
import ArrowDown from 'components/icons/ArrowDown';

function TitleTables({
  viewMode,
  filterMode,
  titleVault,
  changeView,
  changeFilterMode
}: any) {
  const navigate = useNavigate();

  return (
    <div className="p-2 max-h-[680px] overflow-y-scroll w-full">
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
          {filterMode === 'pending' ? (
            <button
              className="px-2 h-[28px] flex gap-2 bg-secondary-100 text-primary-0 items-center rounded"
              onClick={() => changeFilterMode()}
            >
              <span>Completed</span>
            </button>
          ) : (
            <button
              className="px-2 h-[28px] flex gap-2 bg-accent1-100 text-primary-0 items-center rounded"
              onClick={() => changeFilterMode()}
            >
              <span>Pending</span>
            </button>
          )}
          <button className="px-2 h-[28px] flex gap-1 items-center rounded">
            <p>Actions</p>
            <ArrowDown stroke="#312A64" />
          </button>
        </div>
      </div>
      <div className="title-body p-2">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-secondary-100">
            <thead className="text-lg">
              <tr className="text-sm">
                <th scope="col" className="px-6 py-3">
                  Vehicle Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Value
                </th>
                <th scope="col" className="px-6 py-3">
                  Floor Plan
                </th>
                <th scope="col" className="px-6 py-3">
                  Code
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Days
                </th>
                <th scope="col" className="px-6 py-3">
                  Sales Person
                </th>
                <th scope="col" className="px-6 py-3">
                  DMV
                </th>
                <th scope="col" className="px-6 py-3">
                  Lender
                </th>
                <th scope="col" className="px-6 py-3">
                  Select
                </th>
              </tr>
            </thead>
            <tbody className="text-primary-90">
              {titleVault.map((title: any, index: any) => {
                return (
                  <>
                    <tr
                      className={`${index % 2 === 0 ? `bg-secondary-20` : ''} `}
                    >
                      <td className="py-5 px-6 font-medium whitespace-nowrap flex items-center">
                        <div className="w-[39px] h-[39px] border-[1px] border-accent1-100 rounded-full">
                          <img
                            src={title.data.images[0]}
                            className="w-full h-full rounded-full object-cover"
                            alt="car_image"
                          />
                        </div>
                        <div className="ml-5">
                          <p className="text-secondary-100 text-xs">
                            {title.data.type}
                          </p>
                          <p> {title.data.make}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        $ {Number(title.data.cost).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 ">
                        $ {Number(title.data.floor_plan).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 ">{title.data.plate_number}</td>
                      <td className="pl-1 py-1 px-0 h-[52px]">
                        <div className="h-[52px]  px-2 flex items-center justify-center status-bg">
                          <div className="h-[28px] px-2 flex items-center bg-accent1-100 text-primary-0 rounded-md">
                            {title.status === 0 ? `Pending` : `Complete`}{' '}
                            {title.completedHolds}/{title.numHolds}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-0">
                        <div className=" h-[52px] flex items-center justify-center">
                          <div className="h-[28px] flex justify-center items-center bg-primary-10 px-2 rounded">
                            <p className="text-primary-80">{30}</p>
                          </div>
                        </div>
                      </td>
                      <td className="">
                        <div className="ml-4 w-fit bg-primary-10 px-2 flex items-center gap-2 h-[28px] rounded">
                          <img
                            src={'user1.png'}
                            alt="user"
                            className="w-[24px] h-[24px] rounded-full border-[1px] border-accent1-100"
                          />
                          <p className="text-primary-80">{'Earl Garris'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-0 text-lg">
                        <div className=" h-[52px] flex items-center  px-3 py-[19px] pt-[18px]">
                          <img
                            src={CO}
                            className="cursor-pointer w-[69px] h-[25px] border-2 border-primary-10 bg-primary-0 rounded-full"
                            alt="logo"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-0 text-lg">
                        <div className="h-[52px] flex items-center  px-3 py-[19px]">
                          <img
                            src={LA}
                            className="cursor-pointer w-[69px] h-[25px] border-2 border-primary-10 bg-primary-0 rounded-full"
                            alt="logo"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-0 pr-3 text-lg">
                        <div className="h-[52px] flex items-center justify-center border-bg">
                          <div className="flex items-center justify-center">
                            <div className="h-[28px] flex justify-center items-center bg-primary-10 px-2 rounded">
                              <input
                                id="default-checkbox"
                                type="checkbox"
                                value=""
                                className="accent-primary-80 border-2 border-primary-80"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TitleTables;
