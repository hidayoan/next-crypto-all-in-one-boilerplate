import { Button, Checkbox, Input, Modal, Switch } from "antd";
import React, { useState } from "react";
import "./style.scss";
import { Balance, SearchResult } from "@/components";
import { SelectTokenModalType } from "@/helpers/type";
import Image from "next/image";

function SelectTokenModal({ isModalOpen, setIsModalOpen, list = [], data, onChange }: SelectTokenModalType) {
    const [search, setSearch] = useState("");

    return (
        <div className="setting-modal">
            <Modal open={isModalOpen} onOk={() => {
                setIsModalOpen(false);
            }} onCancel={() => {
                setIsModalOpen(false);
            }}>
                <div className="setting">
                    <h3 className="title">Select a Token</h3>
                </div>
                <div className="content">
                    <div className="group-search" style={{ display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M21.4073 19.7527L16.9969 15.3422C18.0587 13.9286 18.6319 12.208 18.63 10.44C18.63 5.92406 14.9559 2.25 10.44 2.25C5.92406 2.25 2.25 5.92406 2.25 10.44C2.25 14.9559 5.92406 18.63 10.44 18.63C12.208 18.6319 13.9286 18.0587 15.3422 16.9969L19.7527 21.4073C19.9759 21.6069 20.2671 21.7134 20.5664 21.7051C20.8658 21.6967 21.1505 21.574 21.3623 21.3623C21.574 21.1505 21.6967 20.8658 21.7051 20.5664C21.7134 20.2671 21.6069 19.9759 21.4073 19.7527ZM4.59 10.44C4.59 9.28298 4.9331 8.15194 5.5759 7.18991C6.21871 6.22789 7.13235 5.47808 8.2013 5.0353C9.27025 4.59253 10.4465 4.47668 11.5813 4.70241C12.7161 4.92813 13.7584 5.48529 14.5766 6.30342C15.3947 7.12156 15.9519 8.16393 16.1776 9.29872C16.4033 10.4335 16.2875 11.6097 15.8447 12.6787C15.4019 13.7476 14.6521 14.6613 13.6901 15.3041C12.7281 15.9469 11.597 16.29 10.44 16.29C8.88905 16.2881 7.40216 15.6712 6.30548 14.5745C5.2088 13.4778 4.59186 11.9909 4.59 10.44Z" fill="#572613" />
                        </svg>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            bordered={false}
                            placeholder="Search name or paste address"
                            className="input"
                        />
                    </div>
                    <SearchResult list={list} search={search}
                        onChange={(item) => {
                            onChange(item)
                            setIsModalOpen(false)
                        }}
                    />
                    <div className="group-common">
                        <h3 className="name">
                            Common tokens
                        </h3>
                        <div className="line" style={{ marginBottom: '10px', borderBottom: '1px solid #ccc' }}>

                        </div>
                    </div>
                    <div className="group-token" style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                        {
                            list.map((item, index) => (
                                <div className="token" key={index} style={{ display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }}>
                                    <Image src={item.link} alt="" width={24} height={24} />
                                    <span>{item.value}</span>
                                </div>
                            ))
                        }
                        {/* {
                            list.map((item, index) => (
                                <div className="token" key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    <Image src={item.link} alt="" width={24} height={24} />
                                    <span>{item.value}</span>
                                </div>
                            ))
                        } */}
                    </div>
                    <div className="group-balance-token" style={{ marginTop: '10px' }}>
                        {
                            [...list].map((item, index) => (
                                <React.Fragment key={index}>
                                    <div
                                        className={`infor-token ${item.key === data.address ? 'active' : ''}`}
                                        onClick={() => {
                                            onChange(item)
                                            setIsModalOpen(false)
                                        }}
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', cursor: 'pointer', borderRadius: '10px', padding: '10px', border: '1px solid #ccc' }}
                                    >
                                        <div className="infor" style={{ display: 'flex', alignItems: 'center' }}>
                                            <Image src={item.link} alt="" width={24} height={24} />
                                            <div className="group-name-token">
                                                <span className="name">{item.value}</span>
                                            </div>
                                        </div>
                                        <div className="balance-token">
                                            <Balance tokenAddress={item.key} />
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default SelectTokenModal;
