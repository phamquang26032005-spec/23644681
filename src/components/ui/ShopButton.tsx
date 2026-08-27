// src/components/ui/ShopButton.tsx
import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import Typography from './Typography';
import { COLORS, SIZES } from '../../constants/theme';

interface ButtonProps {
    text: string;
    onPressAction: () => void;
    isProcessing?: boolean;
    customContainerStyle?: ViewStyle;
}

const ShopButton = ({ text, onPressAction, isProcessing, customContainerStyle }: ButtonProps) => {
    return (
        <TouchableOpacity
            disabled={isProcessing}
            onPress={onPressAction}
            style={[styles.btnBase, customContainerStyle]}
        >
            {isProcessing ? (
                <ActivityIndicator color={COLORS.white} />
            ) : (
                <Typography color={COLORS.white} style={{ fontWeight: 'bold' }}>
                    {text}
                </Typography>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btnBase: {
        backgroundColor: COLORS.primary,
        height: 48,
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ShopButton;
