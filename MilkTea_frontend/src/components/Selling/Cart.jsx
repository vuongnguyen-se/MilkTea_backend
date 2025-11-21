import React from 'react';
import { List, Button, Tag, Space, Empty, Popconfirm } from 'antd';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatCurrency } from '../utils/formatCurrency';
import '../../styles/Selling.css';


const Cart = ({ items, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="sales-column sales-cart">
      <div className="sales-column-header">
        <h3>Đơn hàng hiện tại</h3>
        {items.length > 0 && (
          <Tag color="orange">{items.length} món</Tag>
        )}
      </div>

      {items.length === 0 ? (
        <div className="cart-empty">
          <Empty description="Chưa có sản phẩm trong giỏ" />
        </div>
      ) : (
        <List
          dataSource={items}
          renderItem={(item) => (
            <List.Item
              className="cart-item"
              actions={[
                <Space key="qty" size="small">
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => onDecrease(item.id)}
                  />
                  <span className="cart-item-quantity">
                    {item.quantity}
                  </span>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => onIncrease(item.id)}
                  />
                </Space>,
                <Popconfirm
                  key="remove"
                  title="Xóa món này?"
                  onConfirm={() => onRemove(item.id)}
                >
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <div className="cart-item-title">
                    <span>{item.name}</span>
                    <span className="cart-item-price">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                }
                description={
                  <div className="cart-item-desc">
                    <div>
                      Size {item.size} • Đường {item.sugar}% • Đá{' '}
                      {item.ice}%
                    </div>
                    {item.toppings?.length > 0 && (
                      <div className="cart-item-toppings">
                        {item.toppings.map((t) => (
                          <Tag key={t.id} color="green">
                            {t.name}
                          </Tag>
                        ))}
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Cart;
