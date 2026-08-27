// src/screens/HomeScreen.tsx
import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import Typography from "../components/ui/Typography";
import ShopButton from "../components/ui/ShopButton";
import ShopInput from "../components/ui/ShopInput";
import { COLORS, SIZES } from "../constants/theme";
import { MOCK_PRODUCTS } from "../data/mockData";
import { formatCurrency } from "../utils/formatters";

const HomeScreen = () => {
    const [search, setSearch] = useState("");

    return (
        <View style={styles.container}>
            <Typography variant="h1" color={COLORS.primary} style={styles.headerTitle}>
                🛍️ CampusMart (23644681)
            </Typography>

            <ShopInput
                labelTitle="Tìm kiếm sản phẩm"
                placeholder="Nhập tên sản phẩm..."
                value={search}
                onChangeText={setSearch}
            />

            <Typography variant="h3" style={{ marginBottom: 12 }}>
                Sản phẩm nổi bật:
            </Typography>

            <FlatList
                data={MOCK_PRODUCTS.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Typography variant="h3" color={COLORS.text}>
                            {item.title}
                        </Typography>
                        <Typography variant="body2" color={COLORS.textMuted}>
                            {item.description}
                        </Typography>
                        <Typography variant="h2" color={COLORS.primary} style={{ marginTop: 8 }}>
                            {formatCurrency(item.price)}
                        </Typography>
                        <ShopButton
                            text="Thêm vào giỏ hàng"
                            onPressAction={() => {}}
                            customContainerStyle={{ marginTop: 12, height: 40 }}
                        />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SIZES.padding,
        paddingTop: SIZES.padding * 2,
    },
    headerTitle: {
        textAlign: "center",
        marginBottom: SIZES.padding,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginBottom: SIZES.padding,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
});

export default HomeScreen;
