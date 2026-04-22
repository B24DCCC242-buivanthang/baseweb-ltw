import { getOrders, createOrder, updateOrder, cancelOrder } from '@/services/Qldh/order';

export default {
	namespace: 'order',

	state: {
		list: [],
	},

	reducers: {
		setOrders(state: any, { payload }: any) {
			return { ...state, list: payload };
		},
	},

	effects: {
		*load(_: any, { call, put }: any) {
			const data = yield call(getOrders);
			yield put({ type: 'setOrders', payload: data });
		},

		*create({ payload }: any, { call, put }: any) {
			const data = yield call(createOrder, payload);
			yield put({ type: 'setOrders', payload: data });
		},

		*update({ payload }: any, { call, put }: any) {
			const data = yield call(updateOrder, payload);
			yield put({ type: 'setOrders', payload: data });
		},

		*cancel({ payload }: any, { call, put }: any) {
			const data = yield call(cancelOrder, payload);
			yield put({ type: 'setOrders', payload: data });
		},
	},
};
