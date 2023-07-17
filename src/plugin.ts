import {
    createComponentExtension,
    createPlugin,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const litmusPlugin = createPlugin({
    id: 'litmus',
    routes: {
        root: rootRouteRef,
    },
});

export const EntityLitmusHistoryCard = litmusPlugin.provide(
    createComponentExtension({
        name: 'EntityArgoCDHistoryCard',
        component: {
            lazy: () =>
                import('./components/LitmusOverviewCard').then(
                    (m) => m.LitmusOverviewCard
                ),
        },
    })
);
