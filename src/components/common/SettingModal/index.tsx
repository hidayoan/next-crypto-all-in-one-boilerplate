import { Button, Checkbox, InputNumber, Modal, Switch } from "antd";
import React, { useState } from "react";
import "./style.scss";
import { SettingModalFormType, SettingModalType } from "@/helpers/type";

function SettingModal({ isOpenModal, setIsOpenModal, asyncField }: SettingModalType) {
  const [form, setForm] = useState<SettingModalFormType>({
    slippageTolerance: 0.5,
    transactionDeadline: 2,
    autoRouterAPI: false,
    expertMode: false,
  })

  return (
    <Modal open={isOpenModal} onCancel={() => setIsOpenModal(false)} wrapClassName="setting-modal" footer={null}>
      <div className="setting">
        <h1 className="title">Settings</h1>
      </div>
      <div className="content">
        <div className="group">
          <div className="name-line">
            <h3 className="name">Slippage tolerance</h3>
            <div className="line"></div>
          </div>
          <div className="group-input">
            <InputNumber
              value={form.slippageTolerance}
              onChange={(value) => {
                setForm({ ...form, slippageTolerance: value });
                asyncField && asyncField({ slippageTolerance: value });
              }}
              min={0}
              controls={false} className="input"
            />
            <Button
              className="btn-auto"
              onClick={() => {
                setForm({ ...form, slippageTolerance: 0.5, transactionDeadline: 2 });
                asyncField && asyncField({ slippageTolerance: 0.5, transactionDeadline: 2 });
              }}
            >
              AUTO
            </Button>
          </div>
        </div>
        <div className="group">
          <div className="name-line">
            <h3 className="name">Tx dealine (mins)</h3>
            <div className="line"></div>
          </div>
          <div className="group-input">
            <InputNumber
              value={form.transactionDeadline}
              onChange={(value) => {
                setForm({ ...form, transactionDeadline: value as number });
                asyncField && asyncField({ transactionDeadline: value });
              }}
              min={0}
              controls={false}
              className="input"
            />
          </div>
        </div>
        <div className="group">
          <div className="name-line">
            <h3 className="name">Tx dealine (mins)</h3>
            <div className="line"></div>
          </div>
          <div className="group-checkbox">
            <div className="name-checkbox">
              <h3 className="name">
              </h3>
              <div className="checkbox">
                <Checkbox>
                  Auto Router API
                </Checkbox>
              </div>
            </div>
            <div className="name-checkbox">
              <h3 className="name">
              </h3>
              <div className="checkbox">
                <Checkbox>
                  Flippy sounds
                </Checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default SettingModal;
