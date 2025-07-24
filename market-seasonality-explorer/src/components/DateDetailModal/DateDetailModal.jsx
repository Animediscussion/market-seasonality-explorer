import React from "react";
import { Modal, Descriptions } from "antd";

const DateDetailModal = ({ visible, onClose, data }) => {
  if (!data) return null;

  return (
    <Modal
      title={`Details for ${data.date}`}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Open">{data.open || "-"}</Descriptions.Item>
        <Descriptions.Item label="High">{data.high || "-"}</Descriptions.Item>
        <Descriptions.Item label="Low">{data.low || "-"}</Descriptions.Item>
        <Descriptions.Item label="Close">{data.close || "-"}</Descriptions.Item>
        <Descriptions.Item label="Volume">
          {data.volume || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Volatility">
          {data.volatility || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Price Change (%)">
          {data.priceChange || "-"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DateDetailModal;
