import React, { memo } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import Typography from './Typography';
import { COLORS, SIZES } from '../../constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  variant?: 'primary' | 'outline';
}

const ShopButton = ({ title, onPress, isLoading, variant = 'primary' }: Props) => {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity 
      style={[styles.button, isPrimary ? styles.primary : styles.outline]} 
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? COLORS.surface : COLORS.primary} />
      ) : (
        <Typography variant="h2" color={isPrimary ? COLORS.surface : COLORS.primary}>
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});

export default memo(ShopButton);