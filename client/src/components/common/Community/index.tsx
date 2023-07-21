import React, { useEffect, useState, useRef, BaseSyntheticEvent } from 'react';
import './index.view.css';
import SideBar from '../SideBar';
import HeaderBar from '../HeaderBar';
import Switcher from '../Switcher';
import DmvDropdown from '../DmvDropdown';
import InputTextField from '../SelectTables/InputTextField';
import { loadTitles, loadTitles_search } from 'store/actions/title';
import { loadMessages } from 'store/actions/message';
import ChatTitleList from '../ChatTitleList';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import api from 'utils/api';
import CircularProgress, {
  CircularProgressProps
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ArrowDown from 'assets/icons/chevronDown_15.svg';
import fileDocumentIcon from 'assets/icons/fileDocumentIcon.svg';
import chatAddIcon from 'assets/icons/chatAddIcon.svg';
import emoticonSmile from 'assets/icons/emoticonSmile.svg';
import avatar from 'assets/icons/avatar.svg';
import Switch from 'components/common/Switch/Switch';
import SearchIcon from 'components/icons/SearchIcon';
import FileDocumentIcon from 'components/icons/FileDocumentIcon';

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

export default function Community() {
  const search_title = (searchTitle: any) => {
    const fetchTitles = async () => {
      const data = await loadTitles_search(searchTitle);
      setTitleData(data);
    };
    fetchTitles();
  };
  const isImageFile = (fileName: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(extension);
  };
  const [progress, setProgress] = React.useState(0);
  const [isuploading, setIsUploading] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const formRef = useRef<HTMLFormElement>(null);
  const handleFormClick = () => {
    if (formRef.current) {
      // console.log(formRef)
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
      // alert('okay');
    }
  };
  const [file, setFile] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
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
  const [messagesReceived, setMessagesReceived] = useState<IMessage[]>([]);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    //@ts-ignore
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    // const timer = setInterval(() => {
    //     setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    //   }, 800);
    const fetchTitles = async () => {
      const data = await loadTitles('all');
      setTitleData(data);
    };
    fetchTitles();

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
  }, [socket]);

  const [titleData, setTitleData] = React.useState([]);
  const user = useSelector((state: any) => state.auth.user);
  const [chat_tab, setChatTab] = useState('titles');
  const [chat_room_id, setChatRoomID] = useState('');
  const [chat_room_img, setChatRoomImg] = useState('');
  const [chat_room_name, setChatRoomName] = useState('');

  const fetchMessages = async (room_id: any) => {
    console.log('room_id: ' + room_id);
    const data = await loadMessages(room_id);
    console.log(data);
    setMessagesReceived(data);
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const changeRoom = async (room_id: any, room_img: any, room_name: any) => {
    console.log(room_id);
    console.log(room_name);
    if (chat_room_name !== '') {
      const __createdtime__ = Date.now();
      socket.emit('leave_room', { user, chat_room_name });
    }
    fetchMessages(room_id);

    setChatRoomID(room_id);
    setChatRoomImg(room_img);
    setChatRoomName(room_name);
    console.log(room_name);
    socket.emit('join_room', { user, room_name });
  };
  const [isOpen1, setIsOpen1] = useState(false);
  const [dmv, setDMV] = useState({ name: 'Los Angeles DMV', image: 'Avatar2' });
  const [isSelected, setSelected] = useState(false);
  const [chat, setChat] = useState('');
  const [chatContent, setChatContent] = useState([]);
  const sendMessage = () => {
    if (chat !== '' || uploadedFiles.length > 0) {
      const __createdtime__ = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      const user_id = user._id;
      const user_fname = user.fname;
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

  const handleChange1 = () => {
    setIsOpen1((current) => !current);
  };
  const handleClose = (index: number, param: any) => {
    setDMV(param);
    setIsOpen1(false);
    setSelected(true);
  };

  const _onKeypress = (e: any) => {
    console.log('enter', 'safsd');
    if (e.key === 'Enter') {
      // if(!isSelected){
      //   setChat('');
      //   return;
      // }
      // let temp = chatContent;
      //@ts-ignore
      sendMessage();
      // setChat('');
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

  return (
    <div className="pr-5">
      <div className="flex">
        <SideBar />
        <div className="w-full mt-2 px-6">
          <HeaderBar search_title={search_title} titledata={titleData} />
          <div className="my-6 w-full  bg-secondary-10 rounded-r-[24px] rounded-l-lg">
            {/* chat container */}
            <div className="flex">
              {/* right side */}
              <div className="col-span-1 flex flex-col justify-center">
                <div className="max-w-[340px] flex flex-col m-4">
                  {/* chat headers tabs */}
                  <div className="w-full h-[40px] pr-4 bg-primary-0 flex justify-between items-center rounded-xl font-bold text-xs">
                    <div className="h-[39px] pl-3 pr-4 py-3 flex text-primary-0 bg-secondary-80 justify-center text-base rounded-l-xl">
                      <Switch placeholder="Chat" />
                    </div>
                    <div
                      className={`${
                        chat_tab === 'titles'
                          ? 'text-accent1-90'
                          : 'text-secondary-60'
                      } flex p-[10px] rounded-l-2xl ml-[5px] justify-center cursor-pointer`}
                      onClick={() => {
                        setChatTab('titles');
                      }}
                    >
                      <p>Titles</p>
                    </div>
                    <div
                      className={`${
                        chat_tab === 'groups'
                          ? 'text-accent1-90'
                          : 'text-secondary-60'
                      } flex p-[10px] w-[99px] justify-center cursor-pointer`}
                      onClick={() => {
                        setChatTab('groups');
                      }}
                    >
                      <p>Groups</p>
                    </div>
                    <div
                      className={`${
                        chat_tab === 'people'
                          ? 'text-accent1-90'
                          : 'text-secondary-60'
                      } flex rounded-r-2xl w-[99px] p-[10px] justify-center cursor-pointer`}
                      onClick={() => {
                        setChatTab('people');
                      }}
                    >
                      <p>People</p>
                    </div>

                    <img src={ArrowDown} alt="arrow down icon" />
                  </div>
                  {/* chat section */}
                  <div className="mt-[30px] w-[340px] h-[535px] overflow-y-auto rounded-l-lg">
                    {chat_tab === 'titles' && (
                      <ChatTitleList
                        data={titleData}
                        changeRoom={changeRoom}
                        socket={socket}
                        room_id={chat_room_id}
                      />
                    )}
                  </div>
                  {/* chat footer */}
                  <div className="mt-7 h-[91px] flex justify-between pr-2 ">
                    <div className="flex flex-col items-center gap-1 bg-secondary-90 rounded-lg px-[30px] py-[16px]">
                      <img src="/create_group.png" alt="create new group" />
                      <p className="text-primary-0 text-sm">
                        Create a new Group
                      </p>
                    </div>
                    <div className="h-full flex flex-col justify-between items-center bg-secondary-60 px-2 py-3 rounded-lg ">
                      <img src={chatAddIcon} alt="add new chat icon" />
                      <span className="text-primary-0 text-sm"> New Chat</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* left side */}
              <div className="w-full h-full flex flex-col">
                {/* TODO: this section was commented by original author - im not sure what it does leave here for the future */}
                <div>
                  {/* {
                !isSelected ? <>
                      <div className="store-card px-8 py-4">
                        <div className="flex items-end py-3 text-accent1-100">
                            <h1 className="text-2xl flex-1 ml-[20px]">New Chat With...</h1>
                        </div>
                        <div className="flex items-center p-[15px] cursor-pointer bg-primary-0" onClick={handleChange1}>
                            <img src={require('../../../assets/img/Avatar/'+dmv.image+'.png')} alt="" />
                            <h3 className="px-2 flex-1 text-primary-100" style={{ fontSize: '16px', fontWeight: 600 }}>{dmv.name}</h3>
                            <img className="pe-4" src={require('../../../assets/img/Product/Arrow/Vector.png')} alt="" />
                            <img className="ps-3" src={require('../../../assets/img/Filter.png')} alt="" />
                        </div>
                        {isOpen1 && (
                            <DmvDropdown handleClose={handleClose}/>
                        )}
                      </div>
                      <div className='grid grid-cols-4 items-center'>
                        <div className='col-span-2 p-[50px] text-gray-700'>
                            You can either start a conversation with an User that's already on your contacts or send an Invite!
                        </div>
                        <div className="store-card col-span-2 px-8 py-4 h-[238px]">
                            <div className="flex items-end py-3 text-accent1-100">
                                <h1 className="text-2xl flex-1 ml-[20px]">Invite a new Associate</h1>
                            </div>
                            <div className='grid grid-cols-5'>
                              <div className='col-span-3'>
                                <InputTextField
                                    label='Name and last name'
                                    defaultValue=''
                                    name="name"
                                    placeholder='John Doe'
                                    onChange={(e) => console.log(e.target.value)}
                                    value={""}
                                    variant="filled"
                                    style={{ marginTop: 11, width: '100%' }}
                                />
                              </div>
                              <div className='col-span-2 ml-4'>
                                <InputTextField
                                    label='Sales Person'
                                    defaultValue=''
                                    name="sales_person"
                                    placeholder='Sales Person'
                                    onChange={(e) => console.log(e.target.value)}
                                    value={""}
                                    variant="filled"
                                    style={{ marginTop: 11, width: '100%' }}
                                />
                              </div>
                              <div className='col-span-3'>
                                <InputTextField
                                    label='Email'
                                    defaultValue=''
                                    name="email"
                                    placeholder='JohnDoe@gmail.com'
                                    onChange={(e) => console.log(e.target.value)}
                                    value={""}
                                    variant="filled"
                                    style={{ marginTop: 11, width: '100%' }}
                                />
                              </div>
                              <div className='col-span-2 ml-4 mt-3'>
                                <div className='bg-secondary-100 text-primary-0 p-2 rounded-lg flex h-full items-center justify-center'>
                                  <span className='text-lg'> Create Link</span>
                                  <img src='/link.png' width={17} className='ml-2' style={{height:17}}></img>
                                </div>
                              </div>
                            </div>
                        </div>
                      </div>
                      <div className='text-md text-gray-700 mt-10'>
                        Remember, aside from the Salespeople, you may have to wait for the DMV or Lender to accept the request to join this space. 
                      </div>
                  </>
                  : <>
                    <div className='bg-secondary-20 flex absolute top-0 py-[16px] items-center px-[40px] h-[85px]' style={{width: 'calc(100% - 30px)'}}>
                      <img src='/avatar10.png' width={48} className='h-[48px]' alt='imoticon_img'></img>
                      <div className='flex flex-col justify-center ml-3'>
                        <span className='text-xl'> Melina Baht</span>
                        <span className='flex items-center'> <img src='/badge_green.svg'></img> <span className='text-gray-600 ml-1'>online</span></span>
                      </div>
                    </div>
                    <div className='grid flex-col absolute bottom-[85px] py-[16px] px-[40px] max-h-[598px] overflow-y-auto' style={{width: 'calc(100% - 30px)'}}>
                      {chatContent}
                    </div>
                  </>
              } */}
                </div>
                <div className="px-6 h-[88px] flex items-center gap-4">
                  {chat_room_id !== '' ? (
                    <>
                      <img
                        src={chat_room_img}
                        className="w-[48px] h-[48px] rounded-lg object-cover"
                        alt="car pic"
                      />
                      <div className="flex flex-col gap-1 flex-grow">
                        <h6 className="text-[18px]">{chat_room_name}</h6>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-[#128C7E]"></div>
                          <p className="text-xs text-primary-50">Online</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="py-1 px-3 bg-accent1-100 text-sm text-primary-0 font-bold rounded-lg">
                          6/10 Holds
                        </div>
                        <div className="py-2 px-3 bg-accent1-70 text-sm text-primary-0 font-bold rounded-lg">
                          Pending
                        </div>
                        <div className="mx-5 flex items-center gap-7">
                          <SearchIcon fill="#000" />
                          <img src={ArrowDown} alt="arrow down icon" />
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
                {chat_room_id !== '' ? (
                  <div>
                    {/* TODO: review height */}
                    <div className="h-[580px] bg-primary-0 px-11 py-2">
                      {messagesReceived.map((msg, i) => (
                        <>
                          {user.fname === msg.fname ? (
                            <>
                              {msg.message !== '' && (
                                <>
                                  <span className="text-[12px] text-right ">
                                    {formatDateFromTimestamp(
                                      msg.__createdtime__
                                    )}
                                  </span>
                                  <div
                                    className="grid relative mb-[10px]"
                                    key={i}
                                  >
                                    <div
                                      className="bg-accent1-70 justify-self-end text-primary-100 w-fit p-[15px] float-right"
                                      style={{
                                        borderRadius: '20px 20px 0px'
                                      }}
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
                                          className="bg-accent1-70 justify-self-end w-fit p-[15px] float-right"
                                          style={{
                                            borderRadius: '20px 20px 0px'
                                          }}
                                        >
                                          {/* <img src='/file_icon.png' width={16} className='h-[16px] mt-[5px] mx-[2px]' alt='fileicon_img'></img> */}
                                          {isImageFile(uploaded_path) && (
                                            <img
                                              src={`../${uploaded_path}`}
                                              width={300}
                                              className="h-[300] mt-[5px] mx-[2px]"
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
                                              className=" cursor-pointer text-secondary-100 text-center"
                                              onClick={() =>
                                                downloadFile(
                                                  uploaded_path.slice(8)
                                                )
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
                                <div className="relative w-fit mb-5">
                                  <div className="grid mb-1" key={i}>
                                    <div className="py-4 px-6 bg-secondary-10 text-primary-100 rounded-t-lg rounded-br-lg ">
                                      {msg.message}
                                    </div>
                                  </div>
                                  <div className="flex text-secondary-60">
                                    <span className="text-[12px] mt-[0px] mb-[5px] text-left mr-[5px]">
                                      {msg.fname},
                                    </span>
                                    <span className="text-[12px] text-left ">
                                      {formatDateFromTimestamp(
                                        msg.__createdtime__
                                      )}
                                    </span>
                                  </div>

                                  <img
                                    src={avatar}
                                    alt="profile pic"
                                    className="absolute bottom-1 right-[-16px] rounded-full"
                                  />
                                </div>
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
                                          className="bg-primary-10 w-fit p-[15px] float-left"
                                          style={{
                                            borderRadius: '20px 20px 0px'
                                          }}
                                        >
                                          {/* <img src='/file_icon.png' width={16} className='h-[16px] mt-[5px] mx-[2px]' alt='fileicon_img'></img> */}
                                          {isImageFile(uploaded_path) && (
                                            <img
                                              src={`../${uploaded_path}`}
                                              width={300}
                                              className="h-[300] mt-[5px] mx-[2px]"
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
                                              className=" cursor-pointer text-secondary-100 text-center"
                                              onClick={() =>
                                                downloadFile(
                                                  uploaded_path.slice(8)
                                                )
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
                    <div className="pl-12 pr-4 h-[88px] bg-secondary-20 flex items-center rounded-br-[24px]">
                      <div className="h-[48px] flex items-center gap-2">
                        <div className="flex gap-5">
                          <img
                            src={emoticonSmile}
                            alt="emoticon"
                            className="cursor-pointer"
                          />
                          <FileDocumentIcon
                            stroke="#333399"
                            onClick={handleClick}
                            className="cursor-pointer"
                          />
                          {isuploading && (
                            <div className="w-[30px] ml-[10px] mt-[7px] mr-[10px]">
                              <CircularProgressWithLabel value={progress} />
                            </div>
                          )}
                        </div>
                        <form ref={formRef} onSubmit={onFormSubmit}>
                          <input
                            type="file"
                            ref={inputRef}
                            className="file-input"
                            onChange={handleFileChange}
                            hidden
                          />
                        </form>
                      </div>
                      {uploadedFiles && uploadedFiles.length > 0 && (
                        <>
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
                                    uploadedFiles.filter(
                                      (item) => item !== file
                                    )
                                  );
                                }}
                              ></img>
                            </div>
                          ))}
                        </>
                      )}
                      <input
                        type="text"
                        style={{ flex: 1 }}
                        className="rounded-3xl ml-[20px] px-10 h-[48px] text-sm"
                        placeholder="Say something..."
                        value={chat}
                        onChange={(e) => setChat(e.target.value)}
                        onKeyDown={_onKeypress}
                      ></input>
                      <div className="ml-2 w-[48px] h-[48px] bg-secondary-10 rounded-full flex items-center justify-center cursor-pointer">
                        <img
                          src="/paper_plane.png"
                          alt="paper_plane"
                          onClick={sendMessage}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
