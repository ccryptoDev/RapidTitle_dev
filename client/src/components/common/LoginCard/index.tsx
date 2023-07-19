import React, { BaseSyntheticEvent, useState, useEffect } from 'react';
import './index.view.css';
import loginLogo1 from 'assets/img/login_logo_1.png';
import loginLogo2 from 'assets/img/login_logo_2.png';
import loginLogo3 from 'assets/img/login_logo_3.png';
import EmailIcon from 'assets/icons/emailIcon.svg';
import LockIcon from 'assets/icons/lockIcon.svg';
import google from 'assets/icons/google.svg';
import facebook from 'assets/icons/facebook.svg';
import okta from 'assets/icons/okta.svg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { login } from 'store/actions/auth';

function LoginCard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showImage, setShowImage] = useState(loginLogo1);
  const onSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    let formData = { email, password };
    let result = await login(formData);
    if (result === true) {
      navigate('/');
    }
  };

  const changeCarrousel = () => {
    setShowImage((prev) => {
      if (prev === loginLogo2) return loginLogo3;
      if (prev === loginLogo1) return loginLogo2;
      return loginLogo1;
    });
  };

  useEffect(() => {
    const changeImage = setInterval(changeCarrousel, 3000);
    return () => {
      clearInterval(changeImage);
    };
  }, []);

  return (
    <div className="h-[755px] w-[1084px] relative flex drop-shadow-[0_24px_24px_rgba(0,0,0,0.25)] bg-primary-0/[.8] rounded-[30px] backdrop-blur-[35px]">
      <img src={showImage} alt="carrousel login" />
      <span className="absolute left-5 bottom-14 font-bold w-80 h-11 text-3xl leading-10 text-primary-0">
        Get the Quickening!
      </span>

      {/* right side form */}
      <div className="w-full flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-4 mb-10">
          <h1 className="p-3 text-center text-[60px] leading-[72px] text-secondary-100 font-bold">
            Welcome back Rapid
            <span className="text-[60px] leading-[72px] text-accent1-100">
              Title
            </span>
          </h1>
          <p className="text-sm text-primary-50">Continue with</p>
        </div>
        <p className="flex justify-between gap-6 mb-[48px]">
          <a href="/" className="flex">
            <img src={google} alt="google" className="w-[24px] h-[24px]" />
            <span className="ml-2">Google</span>
          </a>
          <a href="/" className="flex">
            <img src={facebook} alt="facebook" className="w-[24px] h-[24px]" />
            <span className="ml-2">Facebook</span>
          </a>
          <a href="/" className="flex">
            <img src={okta} alt="okta" className="w-[24px] h-[24px]" />
            <span className="ml-2">Okta</span>
          </a>
        </p>
        <div className="2xl:px-[70px] ">
          <form action="#" method="POST">
            <input type="hidden" name="remember" value="true" />
            <div className="flex flex-col gap-5">
              <div className="relative w-[370px] h-[58px] px-4 flex justify-between items-center bg-primary-0 border-2 border-secondary-70 rounded-lg focus-within:ring-1 focus-within:ring-secondary-100 focus-within:border-secondary-100">
                <div className="flex flex-col">
                  <p className="font-inter font-medium text-xs text-primary-50">
                    Email
                  </p>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete={'off'}
                    required
                    className="w-full bg-primary-0 outline-none placeholder:text-primary-50"
                    placeholder="JohnDoe@email.com"
                  />
                </div>
                <img src={EmailIcon} alt="email icon" />
              </div>
              <div className="relative w-[370px] h-[58px] px-4 flex justify-between items-center bg-primary-0 border-2 border-secondary-70 rounded-lg focus-within:ring-1 focus-within:ring-secondary-100 focus-within:border-secondary-100">
                <div className="flex flex-col">
                  <p className="font-inter font-medium text-xs text-primary-50">
                    Password
                  </p>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-primary-0 outline-none placeholder:text-primary-50"
                    placeholder="*************************"
                  />
                </div>
                <img src={LockIcon} alt="lock icon" />
              </div>
            </div>

            <div className="mt-2 mb-6 flex items-center text-primary-50 gap-1">
              Did you forgot your password?
              <Link
                to="/auth/forget"
                className="font-medium text-accent1-100 hover:text-red-500"
              >
                Click here
              </Link>
            </div>

            <button
              type="submit"
              onClick={onSubmit}
              className="mb-6 mx-auto flex h-[54px] items-center rounded-md px-7 bg-secondary-100 text-primary-0 font-inter text-[18px] font-bold hover:bg-accent1-90"
            >
              LogIn
            </button>

            <div className="text-center text-primary-50">
              <p className=""> Don't have an account? </p>
              <Link
                // to="#"
                // TODO: uncomment this when signup page is ready
                to="/auth/signup"
                className="font-medium text-accent1-100 hover:text-red-500"
              >
                Signup
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default LoginCard;
