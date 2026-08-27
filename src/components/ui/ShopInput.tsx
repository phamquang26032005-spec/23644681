import React, { memo } from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import Typography from './Typography';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

interface Props extends TextInputProps {
    label?: string;
    error?: boolean;
}

const ShopInput = ({ label, error, style, ...rest }: Props) => {
    return (
        <View style={styles.container}>
            {label && <Typography variant="caption" style={styles.label}>{label}</Typography>}
            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError,
                    style
                ]}
                placeholderTextColor={COLORS.textLight}
                {...rest}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 12 },
    label: { marginBottom: 4 },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        paddingHorizontal: SIZES.padding,
        paddingVertical: 12,
        color: COLORS.text,
        backgroundColor: COLORS.surface,
        ...FONTS.body,
    },
    inputError: {
        borderColor: COLORS.error,
    },
});

export default memo(ShopInput);