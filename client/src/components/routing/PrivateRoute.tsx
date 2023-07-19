import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../spinner/Spinner';
import { getMetaMaskInstalled, getUserAddress } from 'utils/useWeb3';
import { setAlert } from 'store/actions/alert';

type PrivateRouteTypes = {
  component : any;
  auth : any;
}
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading }
}:PrivateRouteTypes) => {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  
  if (loading) return <Spinner />;
  if (isAuthenticated) {
    // if(pathname !== '/'){
    //   if(!getMetaMaskInstalled()){
    //     setAlert('Please install metamask to continue');
    //     return <Navigate to="/" />;
    //   }
    //   getUserAddress().then(addr => {
    //     if(!addr){
    //       setAlert('Please connect your wallet to continue');
    //       navigate('/?connectwallet=true')
    //     }
    //   })
    // }
    return <Component />;
  }

  return <Navigate to="/auth/login" />;
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state : any) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
