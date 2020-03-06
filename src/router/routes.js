const routes = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('pages/Index.vue') }],
    },
    {
        path: '/about',
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('pages/About.vue') }],
    },
    {
        path: '/extension',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', component: () => import('pages/Extension.vue') },
        ],
    },
    {
        path: '/recovery',
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('pages/Recovery.vue') }],
    },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '*',
        component: () => import('pages/Error404.vue'),
    });
}

export default routes;
