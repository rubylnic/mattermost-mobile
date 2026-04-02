// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {StyleProp, TextStyle} from 'react-native';

import type {AvailableScreens} from '@typings/screens/navigation';

export type SectionNoticeButtonProps = {
    onClick: () => void;
    text: string;
    loading?: boolean;
    trailingIcon?: string;
    leadingIcon?: string;
};

export type SectionNoticeType = 'info' | 'success' | 'danger' | 'welcome' | 'warning' | 'hint';

export type SectionNoticeProps = {
    title: string;
    titleTextStyle?: StyleProp<TextStyle>;
    text?: string;
    primaryButton?: SectionNoticeButtonProps;
    secondaryButton?: SectionNoticeButtonProps;
    linkButton?: SectionNoticeButtonProps;
    type?: SectionNoticeType;
    isDismissable?: boolean;
    onDismissClick?: () => void;
    location: AvailableScreens;
    tags?: string[];
    testID?: string;
    squareCorners?: boolean;
};

