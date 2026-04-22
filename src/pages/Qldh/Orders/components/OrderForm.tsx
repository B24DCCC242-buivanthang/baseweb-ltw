import { Modal, Form, Input, Select, InputNumber, DatePicker, Button, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';

const customers = ['Nguyễn Văn A', 'Trần Thị B'];

const products = [
  { id: 'p1', name: 'SP1', price: 100 },
  { id: 'p2', name: 'SP2', price: 200 },
];

export default ({ open, onCancel, onSubmit, initialValues, orders }: any) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) form.resetFields();
  }, [open]);

  const calcTotal = () => {
    const items = form.getFieldValue('items') || [];
    return items.reduce((sum: number, item: any) => {
      const p = products.find(x => x.id === item.productId);
      return sum + (item.quantity || 0) * (p?.price || 0);
    }, 0);
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    onSubmit({
      ...values,
      date: values.date.format('YYYY-MM-DD'),
      total: calcTotal(),
    });
  };

  return (
    <Modal visible={open} onOk={handleOk} onCancel={onCancel} destroyOnClose>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...initialValues,
          date: initialValues?.date ? dayjs(initialValues.date) : null,
          items: initialValues?.items || [{}],
          status: 'pending',
        }}
      >
        <Form.Item name="id" label="Mã đơn" rules={[{ required: true }]}>
          <Input disabled={!!initialValues} />
        </Form.Item>

        <Form.Item name="customer" label="Khách hàng" rules={[{ required: true }]}>
          <Select>
            {customers.map(c => (
              <Select.Option key={c}>{c}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(field => (
                <Space key={field.key}>
                  <Form.Item {...field} name={[field.name, 'productId']} rules={[{ required: true }]}>
                    <Select style={{ width: 150 }}>
                      {products.map(p => (
                        <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item {...field} name={[field.name, 'quantity']} rules={[{ required: true }]}>
                    <InputNumber min={1} />
                  </Form.Item>

                  <Button danger onClick={() => remove(field.name)}>X</Button>
                </Space>
              ))}

              <Button onClick={() => add()}>+ Thêm SP</Button>
            </>
          )}
        </Form.List>

        <Form.Item label="Tổng tiền">
          <b>{calcTotal()}</b>
        </Form.Item>
      </Form>
    </Modal>
  );
};