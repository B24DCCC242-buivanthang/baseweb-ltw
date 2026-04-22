import { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Table, Button, Input, Select, Space, Popconfirm, message, Tag, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import OrderForm from './components/OrderForm';

const { Option } = Select;

const statusMap: any = {
	pending: { color: 'orange', text: 'Chờ xác nhận' },
	shipping: { color: 'blue', text: 'Đang giao' },
	done: { color: 'green', text: 'Hoàn thành' },
	cancel: { color: 'red', text: 'Đã hủy' },
};

const Page = ({ dispatch, order }: any) => {
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<any>(null);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState<string | undefined>();

	useEffect(() => {
		dispatch({ type: 'order/load' });
	}, []);

	const handleAdd = () => {
		setEditing(null);
		setOpen(true);
	};

	const handleSubmit = async (data: any) => {
		try {
			if (editing) {
				await dispatch({ type: 'order/update', payload: data });
				message.success('Cập nhật thành công');
			} else {
				await dispatch({ type: 'order/create', payload: data });
				message.success('Thêm thành công');
			}

			setOpen(false);
			setEditing(null);
		} catch (e: any) {
			message.error(e.message);
		}
	};

	const handleCancelOrder = async (id: string) => {
		try {
			await dispatch({ type: 'order/cancel', payload: id });
			message.success('Hủy đơn thành công');
		} catch (e: any) {
			message.error(e.message);
		}
	};

	const data = order.list
		.filter(
			(o: any) =>
				o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()),
		)
		.filter((o: any) => (status ? o.status === status : true));

	return (
		<Card title='Quản lý đơn hàng'>
			<Space style={{ marginBottom: 16 }}>
				<Input
					placeholder='Tìm theo mã hoặc khách...'
					onChange={(e) => setSearch(e.target.value)}
					style={{ width: 200 }}
				/>

				<Select placeholder='Lọc trạng thái' allowClear style={{ width: 180 }} onChange={(value) => setStatus(value)}>
					<Option value='pending'>Chờ xác nhận</Option>
					<Option value='shipping'>Đang giao</Option>
					<Option value='done'>Hoàn thành</Option>
					<Option value='cancel'>Đã hủy</Option>
				</Select>

				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm đơn
				</Button>
			</Space>

			<Table
				rowKey='id'
				dataSource={data}
				pagination={{ pageSize: 5 }}
				columns={[
					{
						title: 'Mã đơn',
						dataIndex: 'id',
					},
					{
						title: 'Khách hàng',
						dataIndex: 'customer',
					},
					{
						title: 'Ngày đặt',
						dataIndex: 'date',
						sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
					},
					{
						title: 'Tổng tiền',
						dataIndex: 'total',
						sorter: (a: any, b: any) => a.total - b.total,
					},
					{
						title: 'Trạng thái',
						render: (_: any, r: any) => <Tag color={statusMap[r.status].color}>{statusMap[r.status].text}</Tag>,
					},
					{
						title: 'Hành động',
						render: (_: any, r: any) => (
							<Space>
								<Button
									onClick={() => {
										setEditing(r);
										setOpen(true);
									}}
								>
									Sửa
								</Button>

								<Popconfirm title='Bạn có chắc muốn hủy đơn?' onConfirm={() => handleCancelOrder(r.id)}>
									<Button danger disabled={r.status !== 'pending'}>
										Hủy
									</Button>
								</Popconfirm>
							</Space>
						),
					},
				]}
			/>

			<OrderForm
				open={open}
				initialValues={editing}
				orders={order.list}
				onCancel={() => {
					setOpen(false);
					setEditing(null);
				}}
				onSubmit={handleSubmit}
			/>
		</Card>
	);
};

export default connect(({ order }: any) => ({ order }))(Page);
