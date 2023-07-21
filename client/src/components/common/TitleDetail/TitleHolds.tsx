import React, {
  BaseSyntheticEvent,
  useEffect,
  useCallback,
  useState
} from 'react';
import './index.view.css';
import { useNavigate } from 'react-router-dom';
import { loadHoldingTitles } from 'store/actions/title';
import HoldingStatusDropdown from '../HoldingStatusDropdown';
import { Console } from 'console';
import api from 'utils/api';
import { useSelector } from 'react-redux';
import { setAlert } from 'store/actions/alert';
import {
  getTitleDetail,
  getHoldsStatus,
  updateHoldsStatus
} from 'utils/useWeb3';
import { holds_status_const } from 'utils/constants';
import pendingHold from 'assets/icons/holdPendingIcon.svg';
import completeHold from 'assets/icons/holdCompleteIcon.svg';
import sacramento from 'assets/icons/sacramentoBuilding.svg';
import chatIconBlack from 'assets/icons/chatIconBlack.svg';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

interface holds_type {
  status: boolean;
  updateAt: string;
}

function TitleHolds(props: any) {
  const dispatch = useDispatch();
  const { title_id, totalNumHolds, totalCompletedHolds } = props;
  const [titleDetail, setTitleDetail] = useState([]);
  const [createdTime, setCreatedTime] = useState<Date>(new Date());
  const user = useSelector((state: any) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const [openedRow, setOpenedRow] = useState(-1);
  const navigate = useNavigate();
  const [holds, setHolds] = useState<holds_type[]>([]);
  const [holdUpdated, setHoldUpdated] = useState(false);

  const handleOpen = (index: any) => {
    if (user.userType != 2)
      setAlert('Only DMV is able to update the holds status!');
    else setOpenedRow(index);
  };

  const handleClose = (newStatus: boolean) => {
    let update_id = openedRow;

    const update_status = async (
      title_id: number,
      update_id: number,
      newStatus: boolean
    ) => {
      try {
        // spinner turn on
        dispatch({ type: 'SET_LOADING', payload: true });

        const tx = await updateHoldsStatus(title_id, update_id, newStatus);
        if(tx) {
          if( tx.events?.StatusUpdated?.returnValues ) {
            setHoldUpdated(true);
            Swal.fire({
              title: 'Success',
              html: 'The holds status is successfully updated',
              icon: 'success'
            });
          } else if (tx.code === 4001) {
            Swal.fire({
              title: 'Error',
              html: 'You denied transaction signature.',
              icon: 'error'
            });
          }
        } else {
          Swal.fire({
            title: 'Error',
            html: 'Make sure that you have connected to a wallet',
            icon: 'error'
          });
        }

        // spinner turn off
        dispatch({ type: 'SET_LOADING', payload: false });

        /**
         * updating holds status from db
         */
        /* const res = await api.put(`/v2/holdingtitles/${update_id}`, {newStatus, title_id});
        const holdsStatusAfterUpdate = await loadHoldingTitles(title_id.title_id);
        console.log('status after update', holdsStatusAfterUpdate);
        setHolds(holdsStatusAfterUpdate); */
      } catch (err: any) {
        console.log(err);
      }
    };

    if (holds[openedRow].status !== newStatus) {
      update_status(Number(title_id), update_id, newStatus); 
    }

    console.log('updateID --- ', update_id);

    setTimeout(() => {
      setOpenedRow(-1);
    }, 100);
  };

  useEffect(() => {
    const cb = async (title_id: number) => {
      // get Title details
      const titleInfo = await getTitleDetail(title_id);
      setTitleDetail(titleInfo);

      const hold_createTime = new Date(titleInfo[7] * 1000);
      const formattedCreateTime = hold_createTime.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      } as Intl.DateTimeFormatOptions);
      setCreatedTime(hold_createTime);
      console.log('createdTime ', createdTime);

      // load holds_status from db
      // let holds = await loadHoldingTitles(title_id);
    };

    cb(Number(title_id) - 1);
  }, []);

  const getHolds = useCallback(async () => {
    // load holds status from smart contract
    return await getHoldsStatus(Number(title_id), 8);
  }, [holdUpdated, createdTime]);

  useEffect(() => {
    const cb = async () => {
      // spinner turn on
      dispatch({ type: 'SET_LOADING', payload: true });

      // load holds status from smart contract
      const holds = await getHolds();

      if( holds ) {
        const updatedHolds: holds_type[] = holds.map((hold: holds_type) => {
          const timestamp = parseInt(hold.updateAt);
          const updatedDate = new Date(timestamp * 1000);
          const diffInMs = updatedDate > createdTime ? updatedDate.getTime() - createdTime.getTime() : 0;
          const diffInDays = diffInMs > 0 ? Math.floor(diffInMs / (1000 * 60 * 60 * 24)) : 0;
          return { ...hold, updateAt: diffInDays };
        });

        console.log('updated holds', updatedHolds);

        setHolds(updatedHolds);
        const count_completedHolds = updatedHolds.map(hold => hold.status).filter(status => status === true).length;
        
        // Update total Holds number and completed holds number in title detail block
        totalNumHolds(updatedHolds.length);
        totalCompletedHolds(count_completedHolds);

        const updatedTitle = {
          numHolds: updatedHolds.length,
          completedHolds: count_completedHolds,
          status: updatedHolds.length === count_completedHolds ? 1 : 0
        }
        
        const res = await api.put(`/v2/titles/${title_id}`, {updatedTitle: updatedTitle});
        console.log(res.data);
      } else {
        // in case of error
        Swal.fire({
          title: "Error",
          html: "An error caused while reading holds status",
          icon: 'error'
        });
        setHolds([]);
      }

      // spinner turn off
      dispatch({ type: 'SET_LOADING', payload: false });
      setHoldUpdated(false);
    };

    cb();
  }, [holdUpdated, createdTime, getHolds]);

  return (
    <div className="px-2 w-[990px] h-[550px] overflow-y-scroll">
      <div className="title-body px-2">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-[#333399]">
            <thead className="text-lg">
              <tr className="text-sm">
                <th scope="col" className="px-2 py-3">
                  Select All
                </th>
                <th scope="col" className="px-6 py-3">
                  Hold
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Responsible
                </th>
                <th scope="col" className="px-6 py-3">
                  Days
                </th>
                <th scope="col" className="px-6 py-3">
                  Notes
                </th>
              </tr>
            </thead>

            <tbody className="text-[#212133]">
              {
                //Array.isArray(holds)?
                holds.map((hold: any, index: any) => {
                  return (
                    <tr
                      className={`${index % 2 === 0 ? `bg-[#D6D6EB]` : ''} `}
                      key={index}
                    >
                      <td className="">
                        <div className="my-auto bg-primary-10 rounded ml-5 px-2 w-fit">
                          <input
                            id="default-checkbox"
                            type="checkbox"
                            value=""
                            className="accent-primary-100"
                          />
                        </div>
                      </td>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium whitespace-nowrap flex items-center"
                      >
                        <div>
                          <img
                            src={
                              hold.status === false ? pendingHold : completeHold
                            }
                            style={{ width: 42, height: 40 }}
                            alt=""
                          />
                        </div>
                        <div className="ml-5">
                          <p
                            className={
                              hold.status === false
                                ? 'text-[#FF3366] text-xs'
                                : 'text-[#333399] text-xs'
                            }
                          >
                            {hold.status === false ? 'Pending' : 'Completed'}
                          </p>
                          <p className="text-base font-thin text-primary-90">
                            {holds_status_const[index]}
                          </p>
                        </div>
                      </th>

                      <td className="px-4 py-4  relative">
                        {hold.status === false ? (
                          <p
                            className="h-[28px] px-1 flex justify-center items-center cursor-pointer  rounded-md bg-accent1-100 text-primary-0 text-center"
                            onClick={() => handleOpen(index)}
                          >
                            Pending
                          </p>
                        ) : (
                          <p
                            className="h-[28px] px-1 flex justify-center items-center rounded-md cursor-pointer bg-secondary-100 text-primary-0 text-center"
                            onClick={() => handleOpen(index)}
                          >
                            Completed
                          </p>
                        )}
                        {index === openedRow && (
                          <HoldingStatusDropdown
                            handler={handleClose}
                            holdstatus={hold.status}
                          />
                        )}
                      </td>

                      <td className="px-6 py-4 ">
                        {
                          <div
                            className={`${
                              hold.status === false
                                ? `rounded-md  text-center w-fit`
                                : ''
                            } bg-primary-10 h-[28px] rounded-lg flex justify-center items-center p-2
                            `}
                          >
                            <img
                              src={
                                index % 4 === 0
                                  ? '/user1.png'
                                  : index % 4 === 1
                                  ? sacramento
                                  : index % 4 === 2
                                  ? '/DMV.png'
                                  : '/user2.png'
                              }
                              alt="user icon"
                              style={{ width: 24, height: 24 }}
                            />
                            <span className="ml-2">
                              {index % 4 === 0
                                ? 'Earl Garris'
                                : index % 4 === 1
                                ? 'Sacramento'
                                : index % 4 === 2
                                ? 'DMV'
                                : 'Melina B.'}
                            </span>
                          </div>
                        }
                      </td>

                      <td className="px-6 py-4">
                        {hold.status === '0' ? (
                          <div className="pending-badge flex justify-center py-1 px-2 rounded-md text-center text-white w-fit bg-primary-10">
                            {hold.updateAt} Days
                          </div>
                        ) : (
                          <div className="bg-primary-10 px-2 whitespace-nowrap rounded-lg h-[28px] flex items-center justify-center">
                            {hold.updateAt} Days
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {hold.status ? (
                          <div className="flex items-center justify-center bg-primary-10 p-1 rounded-lg">
                            <img src={chatIconBlack} alt="" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center bg-primary-10 p-1 rounded-lg">
                            <img
                              src="/note_edit.svg"
                              style={{ color: 'white' }}
                              alt=""
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                }) //:null
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TitleHolds;
