import React, { useState } from "react";
import { Drawer } from "antd";
import "./style.scss";
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { HeaderMenuType } from "@/helpers/type";

function HeaderMenuMobile({ data }: HeaderMenuType) {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };
  const pathname = usePathname();
  return (
    <div className="header-menu-mobile">
      <div
        onClick={showDrawer}
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
        </svg>
      </div>
      <Drawer
        placement="right"
        onClose={closeDrawer}
        open={open}
        rootClassName="header-menu-mobile__drawer"
        closeIcon={
          <div style={{ width: "15px", height: "15px" }}>
            <svg
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
            </svg>
          </div>
        }
      >
        <div className="header-menu-mobile__list">
          {data.map((item, index) => (
            <div className="menu-item" key={index}>
              <Link href={item.link} className={`custom-link ${pathname === item.link ? "active" : ""
                }`}>

                {item.name}
              </Link>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}

export default HeaderMenuMobile;
