export interface Order {
	id: string;
	customer: string;
	date: string;
	status: 'pending' | 'shipping' | 'done' | 'cancel';
	items: any[];
	total: number;
}

const KEY = 'orders';

const mockData: Order[] = [
	{
		id: 'DH001',
		customer: 'Nguyễn Văn An',
		date: '2026-04-20',
		status: 'pending',
		items: [{ productId: 'p1', quantity: 2 }],
		total: 200,
	},
	{
		id: 'DH002',
		customer: 'Trần Thị Bình',
		date: '2026-04-18',
		status: 'shipping',
		items: [{ productId: 'p2', quantity: 1 }],
		total: 200,
	},
	{
		id: 'DH003',
		customer: 'Lê Văn Cương',
		date: '2026-04-15',
		status: 'done',
		items: [{ productId: 'p1', quantity: 1 }],
		total: 100,
	},
	{
		id: 'DH004',
		customer: 'Phạm Thị Dung',
		date: '2026-04-10',
		status: 'cancel',
		items: [{ productId: 'p2', quantity: 3 }],
		total: 600,
	},
	{
		id: 'DH005',
		customer: 'Hoàng Văn Chung',
		date: '2026-04-05',
		status: 'pending',
		items: [{ productId: 'p1', quantity: 5 }],
		total: 500,
	},
];

export const getOrders = (): Order[] => {
	localStorage.setItem(KEY, JSON.stringify(mockData));
	return mockData;
};

export const createOrder = (order: Order) => {
	const list = getOrders();

	if (list.find((o) => o.id === order.id)) {
		throw new Error('Mã đơn hàng đã tồn tại');
	}

	const newList = [...list, order];
	localStorage.setItem(KEY, JSON.stringify(newList));
	return newList;
};

export const updateOrder = (order: Order) => {
	const list = getOrders();
	const newList = list.map((o) => (o.id === order.id ? order : o));
	localStorage.setItem(KEY, JSON.stringify(newList));
	return newList;
};

export const cancelOrder = (id: string) => {
	const list = getOrders();

	const target = list.find((o) => o.id === id);
	if (target?.status !== 'pending') {
		throw new Error('Chỉ được hủy đơn chờ xác nhận');
	}

	const newList = list.map((o) => (o.id === id ? { ...o, status: 'cancel' } : o));

	localStorage.setItem(KEY, JSON.stringify(newList));
	return newList;
};
