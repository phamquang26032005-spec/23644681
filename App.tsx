// TH1 | 23644681 | PHAM VAN QUANG | #236446
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { COLORS } from './src/constants/theme';

const MainApp = () => {
  // Chúng ta sẽ truyền thông tin theme xuống HomeScreen qua props hoặc xử lý trực tiếp
  return <HomeScreen />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};