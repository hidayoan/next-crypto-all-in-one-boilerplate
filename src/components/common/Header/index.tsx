import React from 'react';
import './style.scss'
import HeaderMenu from './components/HeaderMenu';

const LIST_HEADER_MENU = [
  {
    name: "Swap",
    link: "/swap",
    type: "link",
  },
  {
    name: "Liquidity",
    link: "/liquidity",
    type: "link",
  },
  {
    name: "Staking",
    link: "/staking",
    type: "link",
  },
  {
    name: "Yield Farming",
    link: "/farm",
    type: "link",
  },



];
function Header() {
  return (
    <div className='header'>
      <HeaderMenu data={LIST_HEADER_MENU} />
    </div>
  );
}

export default Header;