// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {DatabaseProvider} from '@nozbe/watermelondb/react';
import React, {type ComponentType, useEffect, useState} from 'react';

import LocalConfig from '@assets/config.json';
import DeviceInfoProvider from '@context/device';
import ServerProvider from '@context/server';
import ThemeProvider from '@context/theme';
import UserLocaleProvider from '@context/user_locale';
import DatabaseManager from '@database/manager';
import {subscribeActiveServers} from '@database/subscription/servers';
import {secureGetFromRecord} from '@utils/types';
import {sanitizeUrl} from '@utils/url';

import type {Database} from '@nozbe/watermelondb';
import type ServersModel from '@typings/database/models/app/servers';

type State = {
    database: Database;
    serverUrl: string;
    serverDisplayName: string;
};

export function withServerDatabase<T extends JSX.IntrinsicAttributes>(Component: ComponentType<T>): ComponentType<T> {
    return function ServerDatabaseComponent(props: T) {
        const [state, setState] = useState<State | undefined>();

        const observer = (servers: ServersModel[]) => {
            const server = servers?.length ? servers.reduce((a, b) =>
                (b.lastActiveAt > a.lastActiveAt ? b : a),
            ) : undefined;

            if (server) {
                const database =
                    secureGetFromRecord(DatabaseManager.serverDatabases, server.url)?.database;

                if (database) {
                    const defaultUrl = LocalConfig.DefaultServerUrl ? sanitizeUrl(LocalConfig.DefaultServerUrl) : '';
                    const currentUrl = server.url ? sanitizeUrl(server.url) : '';
                    const displayName = (LocalConfig.DefaultServerName && defaultUrl && currentUrl === defaultUrl) ? LocalConfig.DefaultServerName : server.displayName;
                    setState({
                        database,
                        serverUrl: server.url,
                        serverDisplayName: displayName,
                    });
                }
            } else {
                setState(undefined);
            }
        };

        useEffect(() => {
            const subscription = subscribeActiveServers(observer);

            return () => {
                subscription?.unsubscribe();
            };
        }, []);

        if (!state?.database) {
            return null;
        }

        return (
            <DatabaseProvider
                database={state.database}
                key={state.serverUrl}
            >
                <DeviceInfoProvider>
                    <UserLocaleProvider database={state.database}>
                        <ServerProvider server={{displayName: state.serverDisplayName, url: state.serverUrl}}>
                            <ThemeProvider database={state.database}>
                                <Component {...props}/>
                            </ThemeProvider>
                        </ServerProvider>
                    </UserLocaleProvider>
                </DeviceInfoProvider>
            </DatabaseProvider>
        );
    };
}
