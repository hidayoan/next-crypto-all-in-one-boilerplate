import HeaderMenuMobile from "../HeaderMenuMobile";
import "./style.scss";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useCustomConnectWallet } from "@/crypto-all-in-one";
import { generateCode } from "@/helpers";
import { ButtonCustom } from "@/components";
import { HeaderMenuType } from "@/helpers/type";
import Image from "next/image";
import { Layout, Menu } from "antd";
const { Header } = Layout;

function HeaderMenu({ data }: HeaderMenuType) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    address,
    status,
    connect,
    disconnect,
    loading
  } = useCustomConnectWallet();

  const handleClick = async () => {
    if (status === "connected") {
      disconnect();
    } else {
      connect();
    }
  }

  const handleBackToLDP = () => {
    router.push('https://YOUR_WEBSITE_URL');
  }
  return (
    <Header style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <h3 className="logo" style={{background: 'white', borderRadius: '2px', height: '40px'}}>
        LOGO
      </h3>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[pathname]}
        style={{ flex: 1, minWidth: 0 }}
      >
        {data.map((item, index) => {
          if (item.type === "link") {
            return (
              <Menu.Item key={item.link}>
                <Link href={item.link}>
                  {item.name}
                </Link>
              </Menu.Item>
            );
          } else return <></>;
        })}
      </Menu>

      <div className="button">
        <ButtonCustom isLoading={loading} onClick={handleClick} content=
          {
            status === "connected" ? (
              generateCode(address as string)
            ) :
              status === "disconnected" ? (
                'Connect Wallet'
              ) :
                status === "unsupported" ? (
                  'Switch Network'
                ) : ''
          }
        />
      </div>
    </Header>
    // <div className="header-menu">
    //   <div className="header-menu-border">
    //     <div className="header-menu-border__logo" onClick={handleBackToLDP}>

    //     </div>
    //     <div className="header-menu-border__menu">
    //       <div className="menu">
    //         {data.map((item, index) => {
    //           if (item.type === "link") {
    //             return (
    //               <div key={index} className="menu-item">
    //                 <Link href={item.link} className={`custom-link ${pathname === item.link ? "active" : ""
    //                   }`}>
    //                   {item.name}
    //                 </Link>
    //               </div>
    //             );
    //           } else return <></>;
    //         })}
    //       </div>
    //     </div>
    //     <div className="header-menu-border__button">
    //       <div className="button">
    //         <ButtonCustom isLoading={loading} onClick={handleClick} content=
    //           {
    //             status === "connected" ? (
    //               generateCode(address as string)
    //             ) :
    //               status === "disconnected" ? (
    //                 'Connect Wallet'
    //               ) :
    //                 status === "unsupported" ? (
    //                   'Switch Network'
    //                 ) : ''
    //           }
    //         />
    //       </div>
    //       <HeaderMenuMobile data={data} />
    //     </div>
    //   </div>
    // </div>
  );
}

export default HeaderMenu;
