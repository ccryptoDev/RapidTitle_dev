import React, { Fragment } from 'react';
import spinner from './spinner.gif';
import { useSelector } from 'react-redux';


const Spinner = () => {
  const loadingStatus = useSelector((state:any) => state.loading.loading);
  return <div className={`flex backdrop-blur-[2px] items-center fixed bg-black z-20 w-full h-full ${loadingStatus ? '' : 'hidden'}`}>
    <Fragment>
      <img 
        src={spinner}
        style={{ width: '50px', margin: 'auto', display: 'block' }}
        alt="Loading..."
      />
    </Fragment>
  </div>
};

export default Spinner;
