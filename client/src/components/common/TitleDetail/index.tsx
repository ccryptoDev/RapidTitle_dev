import React, { BaseSyntheticEvent, useEffect, useState, useRef } from 'react';
import './index.view.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import SideBar from '../SideBar';
import HeaderBar from '../HeaderBar';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import TitleStatus from './TitleStatus';
import TitleHolds from './TitleHolds';
import TitleHistory from './TitleHistory';
import TitlePeople from './TitlePeople';
import { getVehicleDetail } from 'utils/useWeb3';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import api from 'utils/api';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { io, Socket } from 'socket.io-client';
import { loadMessages } from 'store/actions/message';
import ArrowRight from 'assets/icons/arrowRightIcon.svg';
import chatWidgetIcon from 'assets/icons/chatWidgetIcon.svg';
import qrCodeIcon from 'assets/icons/qrCodeIcon.svg';
import clipIcon from 'assets/icons/clipIcon.svg';
import cardTitleDetail from 'assets/icons/cardTitleDetail.svg';
import forbbidenIcon from 'assets/icons/forbbidenIcon.svg';
import peopleIconHolds from 'assets/icons/peopleIconHolds.svg';
import historyIcon from 'assets/icons/hisrotyIcon.svg';
import pathHoldIcon from 'assets/icons/pathHoldIcon.svg';
import CircularProgress, {
  CircularProgressProps
} from '@mui/material/CircularProgress';
import ArrowDown from 'components/icons/ArrowDown';

export const socket = io(`${process.env.REACT_APP_API_URL}`);
interface IMessage {
  filePath: string[];
  message: string;
  fname: string;
  __createdtime__: number;
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        style={{ color: '#333399' }}
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="#333399"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function formatDateFromTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return (
    <div>
      <p>
        {formattedHours}:{minutes} {ampm}
      </p>
    </div>
  );
}

function uploadedPath_edit(uploaded_path: string) {
  const path_Array = uploaded_path.split('.');
  const filename = path_Array[0].substring(8, path_Array[0].length - 16);
  const filetype = path_Array[1];
  return (
    <div>
      <p>
        {filename}.{filetype}
      </p>
    </div>
  );
}
const VehicleDataInitial = {
  make: '',
  plate: '',
  number: '',
  year_model: '',
  plate_model: '',
  plate_number: '',
  issue_date: '',
  expiration_date: ''
};

const TitleDetail = () => {
  const [progress, setProgress] = React.useState(0);
  const [isuploading, setIsUploading] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const formRef = useRef<HTMLFormElement>(null);

  const [messagesReceived, setMessagesReceived] = useState<IMessage[]>([]);
  const messagesEndRef = useRef(null);

  const [isOpen, setIsOpen] = React.useState(false);

  const user = useSelector((state: any) => state.auth.user);

  const [tab, setActiveTab] = React.useState('holds');
  const [vehicleData, setVehicleData] = React.useState(VehicleDataInitial);

  const { id } = useParams();
  const location = useLocation();
  const room_name = location.state ? location.state.room_name : '';

  const [numHolds, setNumHolds] = useState(8);
  const [completedHolds, setCompletedHolds] = useState(0);

  console.log(room_name);
  console.log(id);

  const dispatch = useDispatch();

  const handleFormClick = () => {
    if (formRef.current) {
      // console.log(formRef)
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
      // alert('okay');
    }
  };

  const isImageFile = (fileName: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(extension);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    let formData = new FormData();
    formData.append('myfile', file[0]);
    console.log('type: ', file[0]);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      }
    };

    try {
      //@ts-ignore
      const res = await api.post('/v2/fileupload', formData, config);
      setIsUploading(false);
      setProgress(0);
      //@ts-ignore
      setUploadedFiles([...uploadedFiles, res.data.path]);
      setFile([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFile(newFiles);
      console.log(file);
      setTimeout(() => {
        handleFormClick();
      }, 1000);
    }
  };

  const scrollToBottom = () => {
    //@ts-ignore
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    messagesEndRef.current?.scrollIntoView();
  };

  socket.emit('join_room', { user, room_name });

  const [modalOpend, setModalOpened] = React.useState(false);
  const handleMiniChat = () => setModalOpened(!modalOpend);
  const [chat, setChat] = useState('');

  const sendMessage = () => {
    if (chat !== '' || uploadedFiles.length > 0) {
      const __createdtime__ = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      const user_id = user._id;
      const user_fname = user.fname;

      const chat_room_id = id;

      const chat_room_name = room_name;
      socket.emit('send_message', {
        chat_room_id,
        chat_room_name,
        user_fname,
        user_id,
        chat,
        __createdtime__,
        uploadedFiles
      });
      setChat('');
      setFile([]);
      setUploadedFiles([]);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  useEffect(() => {
    const cb = async () => {
      let vehicleURI = await getVehicleDetail(Number(id));
      let res = await axios.get(vehicleURI, {
        headers: {
          Accept: 'text/plain'
        }
      });
      let vehicleJson = res.data;
      setVehicleData(vehicleJson);
    };

    cb();

    const fetchMessages = async (room_id: any) => {
      console.log('room_id: ' + room_id);
      const data = await loadMessages(room_id);
      console.log(data);
      setMessagesReceived(data);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    };

    fetchMessages(id);

    socket.on('receive_message', (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          filePath: data.uploadedFiles,
          message: data.chat,
          fname: data.user_fname,
          __createdtime__: data.__createdtime__
        }
      ]);
    });

    setTimeout(() => {
      scrollToBottom();
    }, 1000);

    return () => {
      // clearInterval(timer);
      socket.off('receive_message');
    };
  }, [modalOpend]);

  const _onKeypress = (e: any) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const downloadFile = async (fileName: string) => {
    const response = await fetch(`/uploads/${fileName}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setModalOpened(false);
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '52%',
    left: '85%',
    transform: 'translate(-50%, -50%)',
    width: 390,
    height: 750,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  };

  const navigate = useNavigate();

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  console.log({ tab });

  return (
    <div className="pr-5">
      <div className="flex">
        <SideBar />
        <div className="w-full py-5">
          <HeaderBar />
          <div className="flex w-full items-center p-2">
            <div className="w-full h-[34px] flex items-center my-3">
              <button onClick={() => navigate(-1)}>
                <img src={ArrowRight} alt="arrow right icon" />
              </button>
              {/* 
              //@ts-ignore */}
              <h2 className="text-[#FF3366] font-bold">
                {vehicleData.make} {vehicleData.plate_model}
              </h2>
            </div>
            <div
              className="w-[32px] h-[32px] flex justify-center items-center bg-secondary-100 rounded-full cursor-pointer relative"
              onClick={handleMiniChat}
            >
              <img src={chatWidgetIcon} alt="chat widget" />
              <div className="w-2 h-2 absolute bg-accent1-100 top-[5px] right-[4px] rounded-full"></div>
            </div>
            <Modal
              open={modalOpend}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              disableEnforceFocus={false}
            >
              <Box sx={style}>
                <div className="flex">
                  <span
                    className="text-secondary-100 text-4xl cursor-pointer absolute top-[25px] left-[20px]"
                    onClick={handleClose}
                  >
                    {' '}
                    &larr;
                  </span>
                  <span className="text-secondary-100 text-4xl absolute top-[25px] left-[50px] font-bold">
                    TitleChat
                  </span>
                </div>
                <div className="grid grid-cols-10 pr-[26px] absolute top-[90px]">
                  <div className="col-span-5 ml-[10px]">
                    <p className="text-[12px] text-left">Title information</p>
                    <div className="bg-secondary-50 rounded-md py-2 pr-[10px] mr-[2px] text-left px-2">
                      <p className="text-primary-0 text-[18px]">
                        {room_name.split(' - ')[0]}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <p className="text-[12px] text-left ml-[5px]">ID Number</p>
                    <div className="bg-secondary-50 rounded-md py-2 pr-[10px] ml-[5px] mr-[2px] text-left px-2">
                      <p className="text-primary-0 text-[18px]">
                        {room_name.split(' - ')[1]}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[12px] text-left ml-[5px]">Holds</p>
                    <div className={`${completedHolds === numHolds ? "bg-secondary-100" : "bg-accent1-100"} rounded-md py-2 ml-[5px] pr-[10px] mr-[2px] text-left px-2`}>
                      <p className="text-primary-0 text-[18px]">{completedHolds}/{numHolds}</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`${
                    uploadedFiles && uploadedFiles.length > 0
                      ? 'bottom-[115px] max-h-[470px]'
                      : 'bottom-[85px] max-h-[500px]'
                  } grid flex-col absolute py-[10px] px-[20px] overflow-y-auto`}
                  style={{ width: 'calc(100% - 30px)' }}
                >
                  {messagesReceived.map((msg, i) => (
                    <>
                      {user.fname === msg.fname ? (
                        <>
                          {msg.message !== '' && (
                            <>
                              <span className="text-[12px] text-right">
                                {formatDateFromTimestamp(msg.__createdtime__)}
                              </span>
                              <div className="grid relative mb-[10px]" key={i}>
                                <div
                                  className="bg-accent1-80 justify-self-end text-primary-0 w-fit p-[15px] float-right"
                                  style={{ borderRadius: '20px 20px 0px' }}
                                >
                                  {msg.message}
                                </div>
                              </div>
                            </>
                          )}
                          {msg.filePath && msg.filePath.length > 0 && (
                            <>
                              {msg.filePath.map((uploaded_path, j) => (
                                <>
                                  <span className="text-[12px] text-right">
                                    {formatDateFromTimestamp(
                                      msg.__createdtime__
                                    )}
                                  </span>
                                  <div
                                    className="grid relative mb-[10px]"
                                    key={j}
                                  >
                                    <div
                                      className="bg-accent1-80 justify-self-end w-fit p-[15px] float-right"
                                      style={{ borderRadius: '20px 20px 0px' }}
                                    >
                                      {/* <img src='/file_icon.png' width={16} className='h-[16px] mt-[5px] mx-[2px]' alt='fileicon_img'></img> */}
                                      {isImageFile(uploaded_path) && (
                                        <img
                                          src={`../${uploaded_path}`}
                                          width={200}
                                          className="h-[200] mt-[5px] mx-[2px]"
                                          alt="fileicon_img"
                                        />
                                      )}
                                      <div className="flex justify-center">
                                        <img
                                          src="/file_icon.png"
                                          width={16}
                                          className="h-[16px] mt-[5px] mx-[2px]"
                                          alt="fileicon_img"
                                        ></img>
                                        <span
                                          className=" cursor-pointer text-primary-0 text-center"
                                          onClick={() =>
                                            downloadFile(uploaded_path.slice(8))
                                          }
                                        >
                                          {uploadedPath_edit(uploaded_path)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {msg.message !== '' && (
                            <>
                              <div className="flex">
                                <span className="text-[12px] mt-[0px] right-[20px] mb-[5px] text-left mr-[5px]">
                                  {msg.fname},
                                </span>
                                <span className="text-[12px] text-left">
                                  {formatDateFromTimestamp(msg.__createdtime__)}
                                </span>
                              </div>
                              <div className="grid relative mb-[10px]" key={i}>
                                <div
                                  className="bg-secondary-80 text-primary-0 w-fit p-[15px] float-left"
                                  style={{ borderRadius: '0px 20px 20px' }}
                                >
                                  {msg.message}
                                </div>
                              </div>
                            </>
                          )}
                          {msg.filePath && msg.filePath.length > 0 && (
                            <>
                              {msg.filePath.map((uploaded_path, j) => (
                                <>
                                  <div className="flex">
                                    <span className="text-[12px] mt-[0px] right-[20px] mb-[5px] text-left mr-[5px]">
                                      {msg.fname},
                                    </span>
                                    <span className="text-[12px] text-left">
                                      {formatDateFromTimestamp(
                                        msg.__createdtime__
                                      )}
                                    </span>
                                  </div>
                                  <div
                                    className="grid relative mb-[10px]"
                                    key={j}
                                  >
                                    <div
                                      className="bg-secondary-80 w-fit p-[15px] float-left"
                                      style={{ borderRadius: '20px 20px 0px' }}
                                    >
                                      {/* <img src='/file_icon.png' width={16} className='h-[16px] mt-[5px] mx-[2px]' alt='fileicon_img'></img> */}
                                      {isImageFile(uploaded_path) && (
                                        <img
                                          src={`../${uploaded_path}`}
                                          width={200}
                                          className="h-[200] mt-[5px] mx-[2px]"
                                          alt="fileicon_img"
                                        />
                                      )}
                                      <div className="flex justify-center">
                                        <img
                                          src="/file_icon.png"
                                          width={16}
                                          className="h-[16px] mt-[5px] mx-[2px]"
                                          alt="fileicon_img"
                                        ></img>
                                        <span
                                          className=" cursor-pointer text-primary-0 text-center"
                                          onClick={() =>
                                            downloadFile(uploaded_path.slice(8))
                                          }
                                        >
                                          {uploadedPath_edit(uploaded_path)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </>
                          )}
                        </>
                      )}
                    </>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                {uploadedFiles && uploadedFiles.length > 0 && (
                  <div
                    className="bg-primary-50 flex absolute top-[635px] pt-[5px] items-center px-[10px] h-[30px]"
                    style={{ width: 'calc(100% - 0px)' }}
                  >
                    {uploadedFiles.map((file, i) => (
                      <div className="flex border border-solid rounded-lg border-gray-400 px-[2px] mx-[2px]">
                        <span className="px-[5px]" key={i}>
                          {uploadedPath_edit(file)}
                        </span>
                        <img
                          src="/file_close.png"
                          width={16}
                          className="h-[16px] mt-[5px] cursor-pointer"
                          alt="imoticon_img"
                          onClick={() => {
                            setUploadedFiles(
                              uploadedFiles.filter((item) => item !== file)
                            );
                          }}
                        ></img>
                      </div>
                    ))}
                  </div>
                )}
                <div
                  className="bg-primary-50 flex absolute bottom-0 py-[10px] items-center px-[10px] h-[85px] rounded-b-2xl"
                  style={{ width: 'calc(100% - 0px)' }}
                >
                  <img
                    src="/imoticon.png"
                    width={24}
                    className="h-[24px]"
                    alt="imoticon_img"
                  ></img>
                  <img
                    src="/file_chat.png"
                    width={24}
                    className="h-[24px] ml-[10px] cursor-pointer"
                    alt="file_attach"
                    onClick={handleClick}
                  ></img>
                  {isuploading && (
                    <div className="w-[30px] ml-[10px] mt-[7px] mr-[10px]">
                      <CircularProgressWithLabel value={progress} />
                    </div>
                  )}
                  <form ref={formRef} onSubmit={onFormSubmit}>
                    <input
                      type="file"
                      ref={inputRef}
                      className="file-input"
                      onChange={handleFileChange}
                      hidden
                    />
                  </form>
                  <input
                    type="text"
                    style={{ flex: 1 }}
                    className="rounded-3xl ml-[10px] px-[20px] h-[48px]"
                    placeholder="Say something..."
                    value={chat}
                    onChange={(e) => setChat(e.target.value)}
                    onKeyDown={_onKeypress}
                  ></input>
                  <div className="bg-white rounded-3xl ml-[10px] right-[10px] h-[48px] w-[48px] cursor-pointer">
                    <img
                      src="/paper_plane.png"
                      alt="paper_plane"
                      onClick={sendMessage}
                    ></img>
                  </div>
                </div>
              </Box>
            </Modal>
          </div>
          <div className="flex px-2">
            {/* left side */}
            <div>
              <div className="p-4 w-[380px] rounded-xl bg-secondary-20 relative shadow-dark">
                <div className="flex justify-between items-center">
                  <p className="text-[26px] font-medium text-secondary-100">
                    Certificate of Title
                  </p>
                  <div className="flex flex-col gap-2">
                    <p className="w-[84px] h-[28px] bg-accent1-80 flex justify-center items-center text-sm text-primary-0 font-bold  px-1 rounded-lg ">
                      {completedHolds}/{numHolds} Holds
                    </p>
                    <p className={`${numHolds === completedHolds ? "bg-secondary-100" : "bg-accent1-80"} w-[84px] h-[35px] flex justify-center items-center text-sm text-primary-0 font-bold  px-1 rounded-lg`}>
                      {numHolds === completedHolds ? "Completed" : "Pending"}
                    </p>
                  </div>
                </div>
                <p className="text-xs">Vehicle Number</p>
                <p className="text-xl text-secondary-90">
                  {vehicleData.number}
                </p>
                {/* year make plate */}
                <div className="flex justify-between mt-4">
                  <div className="w-[25%]">
                    <p className="text-xs">Year Model</p>
                    <p className="text-xl text-secondary-90">
                      {vehicleData.year_model}
                    </p>
                  </div>
                  <div className="w-[50%]">
                    <p className="text-xs">Make</p>
                    <p className=" text-xl text-secondary-90 whitespace-nowrap text-ellipsis">
                      {vehicleData.make.slice(0, 13)}
                    </p>
                  </div>
                  <div className="w-[25%]">
                    <div className="text-xs">Plate Number</div>
                    <div className="text-xl text-secondary-90 ">
                      {vehicleData.plate_number.slice(0, 7)}
                    </div>
                  </div>
                </div>
                {/* issue exp and fees */}
                <div className="flex justify-between my-4">
                  <div>
                    <p className="text-xs">Issue Date</p>
                    <p className="text-xl text-secondary-90">
                      {vehicleData.issue_date}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs">Expiration Date</div>

                    <div className="text-xl text-secondary-90">
                      {vehicleData.expiration_date}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs">Fees Paid</div>
                    <div className="text-xl text-secondary-90">201</div>
                  </div>
                </div>
                {/* city */}
                <div>
                  <p className="text-xs"> City/State</p>
                  <p className="text-xl text-secondary-90">
                    Sacramento/California
                  </p>
                </div>
                {/* serial */}
                <div className="h-[74px] flex justify-between my-5">
                  <div className="flex flex-col justify-center rounded-2xl bg-secondary-50 p-2 text-primary-0">
                    <div className="flex justify-between">
                      <p className="text-xs">Serial Number</p>
                      <div className="w-[27px] h-[27px] flex items-center justify-center rounded-full bg-secondary-90">
                        <img src={qrCodeIcon} alt="QR code" />
                      </div>
                    </div>
                    <p className="font-sm">ZACCJBDT9FPB41159</p>
                  </div>

                  <div className="w-[74px] flex justify-center items-center flex-col rounded-2xl bg-secondary-50">
                    <img
                      src={clipIcon}
                      alt="clip icon"
                      className="w-[41px] h-[41px] bg-secondary-90 rounded-full p-1"
                    />
                  </div>

                  <img src={cardTitleDetail} alt="card detail icon" />
                </div>
                {/* carousel */}
                <div className="p-5 flex items-center justify-around bg-secondary-50 text-primary-0 rounded-xl h-[127px]">
                  <div>
                    <p className="text-xs">Vehicle Worth</p>
                    <p className="text-xl text-secondary-10"> $30,400USD </p>
                  </div>
                  <div>
                    <p className="text-xs">Floor Plan</p>
                    <p className="text-xl text-secondary-10"> $11,400USD </p>
                  </div>
                </div>
                {/* <Carousel
                className="flex items-center justify-center bg-secondary-50 text-primary-0 rounded-xl h-[127px]"
                centerMode={true}
                dynamicHeight={true}
                showThumbs={false}
              >
                <div className="flex bg-transparent">
                  <div className="h-full bg-transparent">
                    <div className="text-xs">Vehicle Worth</div>
                    <div className="text-xl"> $ 30,400USD </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-xs">Floor Plan</div>
                    <div className="text-xl"> $ 11,400USD </div>
                  </div>
                </div>
                <div className="flex">
                  <div className="h-full">
                    <div className="text-xs">Vehicle Worth</div>
                    <div className="text-xl"> $ 30,400USD </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-xs">Floor Plan</div>
                    <div className="text-2xl"> $ 111,400USD </div>
                  </div>
                </div>
              </Carousel> */}
              </div>
              {/* footer */}
              <div className="flex justify-between mt-3">
                <div className="w-[120px] h-[120px] bg-secondary-50 rounded-xl text-primary-0 flex items-center justify-center">
                  <div className="flex justify-center items-center flex-col">
                    <img src="/user1.png" width={40} height={40} alt="avatar" />
                    <p className="text-[10px] text-primary-10">Salesman</p>
                    <p className="text-sm text-primary-10">Earl Garris</p>
                  </div>
                </div>
                <div className="w-[120px] h-[120px] bg-secondary-50 rounded-xl text-primary-0 flex items-center justify-center">
                  <div className="flex justify-center items-center flex-col">
                    <img
                      src={'/capitalone.png'}
                      width={40}
                      height={40}
                      alt=""
                    />
                    <p className="text-[10px] text-primary-10">Lender</p>
                    <p className="text-sm text-primary-10">Capital One</p>
                  </div>
                </div>
                <div className="w-[120px] h-[120px] bg-secondary-50 rounded-xl text-primary-0 flex items-center justify-center">
                  <div className="flex justify-center items-center flex-col">
                    <img src="/DMV.png" width={40} height={40} alt="" />
                    <p className="text-[10px] text-primary-10">DMV</p>
                    <p className="text-sm text-primary-10">Sacramento</p>
                  </div>
                </div>
              </div>
            </div>
            {/* right side - table */}
            <div className="col-span-6 ml-5 rounded-xl flex flex-col items-center shadow-dark">
              <div className="grid grid-cols-5 w-full">
                {
                  <div
                    className={`flex items-center justify-center px-3 rounded-l-xl cursor-pointer ${
                      tab === 'status'
                        ? 'bg-accent1-100 text-primary-0'
                        : 'bg-secondary-20 text-secondary-80'
                    }`}
                    onClick={() => setActiveTab('status')}
                    style={{
                      borderRight: '1px solid',
                      fontWeight: 500,
                      fontSize: 18
                    }}
                  >
                    Title's Status
                  </div>
                }
                <div
                  className={`${
                    tab === 'holds'
                      ? 'bg-accent1-100 text-primary-0'
                      : 'bg-secondary-20 text-secondary-80'
                  }  flex items-center justify-center cursor-pointer h-[46px]`}
                  onClick={() => setActiveTab('holds')}
                  style={{
                    borderRight: '1px solid',
                    fontWeight: 500,
                    fontSize: 18
                  }}
                >
                  <img
                    src={forbbidenIcon}
                    width={35}
                    height={35}
                    className="!h-[35px]"
                    alt="forbidden icon"
                  />
                  <span className="ml-2">Holds</span>
                </div>
                <div
                  className={`${
                    tab === 'people'
                      ? 'bg-accent1-100 text-primary-0'
                      : 'bg-secondary-20 text-secondary-80'
                  } flex items-center justify-center p-3 cursor-pointer h-[46px]`}
                  onClick={() => setActiveTab('people')}
                  style={{
                    borderRight: '1px solid',
                    fontWeight: 500,
                    fontSize: 18
                  }}
                >
                  <img
                    src={peopleIconHolds}
                    width={35}
                    height={35}
                    className="!h-[35px]"
                    alt="people icon"
                  />
                  <span className="ml-2">People</span>
                </div>
                <div
                  className={`${
                    tab === 'history'
                      ? 'bg-accent1-100 text-primary-0'
                      : 'bg-secondary-20 text-secondary-80'
                  } flex items-center justify-center p-3 cursor-pointer h-[46px]`}
                  onClick={() => setActiveTab('history')}
                  style={{
                    borderRight: '1px solid',
                    fontWeight: 500,
                    fontSize: 18
                  }}
                >
                  <img
                    src={historyIcon}
                    width={35}
                    height={35}
                    className="!h-[35px]"
                    alt="history icon"
                  />
                  <span className="ml-2">History</span>
                </div>
                <div
                  className={`${
                    tab === 'flow'
                      ? 'bg-accent1-100 text-primary-0'
                      : 'bg-secondary-20 text-secondary-80'
                  } flex items-center justify-center p-3 cursor-pointer rounded-r-xl h-[46px]`}
                  onClick={() => setActiveTab('flow')}
                >
                  <img
                    src={pathHoldIcon}
                    width={35}
                    height={35}
                    className="!h-[35px]"
                    alt="path icon"
                  />
                </div>
              </div>
              <div className="px-4 w-full">
                <div className="w-full px-2 bg-secondary-20 h-[43px] mt-[22px] rounded-lg flex items-center  ">
                  <div className="w-full flex justify-between">
                    <div className="flex gap-2">
                      <p className="h-[28px] p-2 flex items-center rounded-md bg-accent1-90 text-center text-primary-0 text-sm">
                        Pending
                      </p>
                      <p className="h-[28px] p-2 flex items-center rounded-md bg-accent1-100 text-center text-primary-0 text-sm">
                        3 Days
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 pr-2">
                    <img src="/share_icon.png" width={28} height={28} alt="" />
                    <div className="flex gap-1 items-center">
                      <p className="text-[18px]">Actions</p>
                      <ArrowDown stroke="#312A64" />
                    </div>
                  </div>
                </div>
              </div>
              {tab === 'status' && <TitleStatus />}
              {tab === 'holds' && <TitleHolds title_id={id} totalNumHolds={setNumHolds} totalCompletedHolds={setCompletedHolds} />}
              {tab === 'people' && <TitlePeople />}
              {tab === 'history' && <TitleHistory />}
              {tab === 'flow' && <TitleHolds title_id={id} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleDetail;
