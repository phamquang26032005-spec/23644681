// src/components/ui/ShopInput.tsx
import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import Typography from './Typography';
import { COLORS, SIZES } from '../../constants/theme';

interface InputProps extends TextInputProps {
    labelTitle?: string;
}

const ShopInput = ({ labelTitle, ...props }: InputProps) => {
    return (
        <View style={styles.container}>
            {labelTitle && (
                <Typography color={COLORS.textMuted} style={{ marginBottom: 6 }}>
                    {labelTitle}
                </Typography>
            )}
            <TextInput placeholderTextColor={COLORS.textMuted} style={styles.inputArea} {...props} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: SIZES.padding },
    inputArea: {
        height: 48,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
    }
});

export default ShopInput;
