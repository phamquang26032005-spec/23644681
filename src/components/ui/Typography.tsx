import React, { memo } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { FONTS, COLORS } from '../../constants/theme';

interface Props extends TextProps {
    variant?: keyof typeof FONTS;
    color?: string;
    children: React.ReactNode;
}

const Typography = ({ variant = 'body', color = COLORS.text, style, children, ...rest }: Props) => {
    return (
        <Text style={[FONTS[variant], { color }, style]} {...rest}>
            {children}
        </Text>
    );
};

export default memo(Typography);