import React, { BaseSyntheticEvent, useState } from 'react';
import './index.view.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import avatar from '../../../assets/img/avatar.png';
import FooterCard from './FooterCard';

function Footer() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[151px] flex justify-center relative bg-gradient-to-b from-[#ffffff00] from-0% via-[#AAB2FA] via-70% to-[#FF7095] to-100%">
      <FooterCard
        title={'Not registered in customers name'}
        icon={'user'}
        data={'470/2750'}
        withBorder
      />
      <FooterCard
        title={'Car traded has lien that has to be paid.'}
        icon={'creditCard'}
        data={'153/2750'}
        withBorder
      />
      <FooterCard
        title={'purchase has out of state title'}
        icon={'map'}
        data={'120/2750'}
        withBorder
      />
      <FooterCard
        title={'not have title at time of purchase'}
        icon={'circleInfo'}
        data={'115/2750'}
      />
    </div>
  );
}

export default Footer;
