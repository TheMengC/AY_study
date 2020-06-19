export const routes = [
    {
        name: '订单管理',
        path: '/tradeManagement',
        abstract: true,
        children: [
            {
                name: '退款管理',
                default: true,
                component: 'refundManagement',
                path: '/refundManagement',
                icon: 'iconfont-tuikuanguanli',

            },
            {
                name: '订单信息',
                default: true,
                component: 'orderManagement',
                path: '/orderManagement',
                icon: 'iconfont-tuikuanguanli',

            }
        ],
    }
];
export const defaultPath = '/tradeManagement/refundManagement';
