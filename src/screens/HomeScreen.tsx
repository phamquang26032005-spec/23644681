import React, { useState, useEffect, useMemo, memo, useCallback, useReducer } from 'react';
import { View, SafeAreaView, StyleSheet, Image, Pressable, ActivityIndicator, FlatList, Modal, Alert } from 'react-native';
import { STUDENT, examStamp, LAST_DIGIT, BANNER_IMAGE_ID, FLASH_SECONDS, VARIANT } from '../constants/student';
import Typography from '../components/ui/Typography';
import ShopInput from '../components/ui/ShopInput';
import ShopButton from '../components/ui/ShopButton';
import { COLORS, SIZES } from '../constants/theme';
import { useCountdown } from '../hooks/useCountdown';
import { fetchProducts, Product } from '../services/productApi';
import { useTheme } from '../contexts/ThemeContext';

// Reducer quản lý số lượng trong Modal (bắt buộc dùng useReducer)
type Action = { type: 'ADD' } | { type: 'REMOVE' } | { type: 'RESET' };
const quantityReducer = (state: number, action: Action) => {
  switch (action.type) {
    case 'ADD': return state + 1;
    case 'REMOVE': return state > 1 ? state - 1 : 1;
    case 'RESET': return 1;
    default: return state;
  }
};

const ProductCard = memo(({ item, onBook, isDark }: { item: Product, onBook: (item: Product) => void, isDark: boolean }) => (
  <Pressable style={[styles.card, isDark && styles.darkCard]} onPress={() => onBook(item)}>
    <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="contain" />
    <View style={styles.cardInfo}>
      <Typography variant="body" color={isDark ? COLORS.darkText : COLORS.text} style={{ fontWeight: 'bold' }} numberOfLines={1}>
        {item.title}
      </Typography>
      <Typography variant="body" color={COLORS.primary} style={{ fontWeight: 'bold', marginVertical: 4 }}>
        {item.price.toLocaleString('vi-VN')} đ
      </Typography>
      <Typography variant="caption" color={isDark ? COLORS.darkText : COLORS.textLight}>
        {item.categoryId === 'food' ? 'Đồ ăn' : item.categoryId === 'drink' ? 'Nước' : 'Học tập'}
      </Typography>
    </View>
    <View style={styles.cardAction}>
      <ShopButton title="Đặt" onPress={() => onBook(item)} />
    </View>
  </Pressable>
));

const HomeScreen = () => {
  const stamp = examStamp();
  const { timeLeft, formatted } = useCountdown(FLASH_SECONDS);
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('study'); // MSSV đuôi 1 bắt đầu bằng study
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, dispatchQuantity] = useReducer(quantityReducer, 1);

  // Thứ tự chip chuẩn cho MSSV đuôi 1: Học tập -> Nước -> Đồ ăn -> Tất cả
  const CATEGORIES = [
    { id: 'study', name: 'Học tập' },
    { id: 'drink', name: 'Nước' },
    { id: 'food', name: 'Đồ ăn' },
    { id: 'all', name: 'Tất cả' },
  ];

  const loadData = () => {
    setLoading(true); setError(false);
    fetchProducts()
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  };

  useEffect(() => {
    let alive = true;
    loadData();
    return () => { alive = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'all' || p.categoryId === activeCategory;
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const handleBook = useCallback((item: Product) => {
    setSelectedProduct(item);
    setModalVisible(true);
  }, []);

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
    dispatchQuantity({ type: 'RESET' });
  };

  const handleConfirm = () => {
    if (!selectedProduct) return;
    Alert.alert(
      `CampusMart · ${STUDENT.mssv}`,
      `${STUDENT.hoTen} (#${stamp}) đã ghi nhận: ${selectedProduct.title} × ${quantity}. Nhận tại quầy KTX.`,
      [{ text: "Xong", onPress: handleCloseModal }]
    );
  };

  const isFlashEnded = timeLeft <= 0;
  const isDarkStyle = isDarkMode;

  const IdentityBar = () => (
    <View style={[styles.identityBar, isDarkStyle && styles.darkIdentityBar]}>
      <Typography variant="caption" color={isDarkMode ? COLORS.darkText : COLORS.text} style={styles.identityText}>
        TH1 · {STUDENT.mssv} · {STUDENT.hoTen} · #{stamp}
      </Typography>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, isDarkStyle && { backgroundColor: COLORS.darkBackground }]}>
      {/* Nếu số cuối chẵn hiện ở trên, lẻ hiện ở dưới. Đuôi 1 sẽ hiện ở dưới */}
      {LAST_DIGIT % 2 === 0 && <IdentityBar />}
      
      <View style={styles.container}>
        {/* Header chuẩn theo hình mẫu: Trái là CAMPUSMART, Phải là nút Sáng/Tối và đồng hồ Flash */}
        <View style={styles.header}>
          <View>
            <Typography variant="h1" color={COLORS.primary}>CAMPUSMART</Typography>
            <Typography variant="body" color={isDarkStyle ? COLORS.darkText : COLORS.textLight}>
              Tiện lợi KTX
            </Typography>
          </View>
          
          <View style={styles.headerRight}>
            <Pressable style={styles.themeBtn} onPress={toggleTheme}>
              <Typography variant="body" color={COLORS.primary}>Sáng / Tối</Typography>
            </Pressable>
            <Typography variant="body" color={COLORS.secondary} style={styles.flashText}>
              Flash {formatted}
            </Typography>
          </View>
        </View>

        {/* Ô tìm kiếm */}
        <ShopInput placeholder={`Tìm món, nước, đồ dùng — ${STUDENT.mssv}`} value={searchQuery} onChangeText={setSearchQuery} />

        {/* Banner xanh đậm đặc căn giữa y hệt mẫu đề */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerPureSolid}>
            <Typography variant="h2" color={COLORS.surface} style={{ textAlign: 'center' }}>Đặt nhanh · Nhận tại quầy</Typography>
            <Typography variant="caption" color={COLORS.surface} style={{ textAlign: 'center' }}>Cửa hàng tiện lợi ký túc xá 24/7</Typography>
          </View>
        </View>

        {/* Các nút danh mục (Chips) */}
        <View style={styles.chipRow}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <Pressable key={cat.id} style={[styles.chip, isActive && styles.chipActive]} onPress={() => setActiveCategory(cat.id)}>
                <Typography variant="body" color={isActive ? COLORS.surface : COLORS.primary}>{cat.name}</Typography>
              </Pressable>
            );
          })}
        </View>

        {/* Danh sách sản phẩm (3 trạng thái: Đang tải, Có dữ liệu, Lỗi mạng) */}
        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.centerBox}><ActivityIndicator size="large" color={COLORS.primary} /><Typography variant="body" color={isDarkStyle ? COLORS.darkText : COLORS.text} style={{ marginTop: 12 }}>Đang tải món...</Typography></View>
          ) : error ? (
            <View style={styles.centerBox}>
              <Typography variant="body" color={COLORS.error} style={{ fontWeight: 'bold' }}>{STUDENT.mssv}</Typography>
              <Typography variant="body" color={isDarkStyle ? COLORS.darkText : COLORS.text} style={{ marginBottom: 16 }}>Không tải được dữ liệu món.</Typography>
              <ShopButton title="Thử lại" onPress={loadData} />
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={item => `${STUDENT.mssv}-${item.id}`}
              renderItem={({ item }) => <ProductCard item={item} onBook={handleBook} isDark={isDarkStyle} />}
              ListEmptyComponent={<View style={styles.centerBox}><Typography variant="body" color={isDarkStyle ? COLORS.darkText : COLORS.text}>Không có món phù hợp</Typography></View>}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>

      {/* Dòng định danh nằm ở chân màn hình cho MSSV đuôi lẻ (số 1) */}
      {LAST_DIGIT % 2 !== 0 && <IdentityBar />}

      {/* Modal Đặt món (Câu 3a) */}
      <Modal visible={modalVisible} transparent={true} animationType={VARIANT.modalAnimation}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkStyle && { backgroundColor: COLORS.darkSurface }]}>
            <IdentityBar />
            
            {selectedProduct && (
              <View style={styles.modalBody}>
                <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} resizeMode="contain" />
                <Typography variant="h2" color={isDarkStyle ? COLORS.darkText : COLORS.text} style={{ textAlign: 'center', marginVertical: 8 }}>{selectedProduct.title}</Typography>
                <Typography variant="h2" color={COLORS.primary} style={{ textAlign: 'center' }}>
                  {selectedProduct.price.toLocaleString('vi-VN')} đ
                </Typography>
                <Typography variant="body" color={isDarkStyle ? COLORS.darkText : COLORS.textLight} style={{ textAlign: 'center', marginVertical: 4 }}>
                  Danh mục: {selectedProduct.categoryId === 'food' ? 'Đồ ăn' : selectedProduct.categoryId === 'drink' ? 'Nước' : 'Học tập'}
                </Typography>
                <Typography variant="caption" color={isDarkStyle ? COLORS.darkText : COLORS.textLight} numberOfLines={2} style={{ textAlign: 'center', marginBottom: 16 }}>
                  {selectedProduct.description}
                </Typography>

                <View style={styles.qtyContainer}>
                  <Pressable style={styles.qtyBtn} onPress={() => dispatchQuantity({ type: 'REMOVE' })}>
                    <Typography variant="h2" color={COLORS.primary}>-</Typography>
                  </Pressable>
                  <Typography variant="h2" color={isDarkStyle ? COLORS.darkText : COLORS.text} style={{ marginHorizontal: 20 }}>{quantity}</Typography>
                  <Pressable style={styles.qtyBtn} onPress={() => dispatchQuantity({ type: 'ADD' })}>
                    <Typography variant="h2" color={COLORS.primary}>+</Typography>
                  </Pressable>
                </View>

                <ShopButton 
                  title={isFlashEnded ? "Hết giờ flash-sale" : "Xác nhận đặt"} 
                  onPress={handleConfirm} 
                  isLoading={isFlashEnded} 
                />
                <View style={{ height: 8 }} />
                <ShopButton title="Đóng" onPress={handleCloseModal} variant="outline" />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: SIZES.padding, paddingBottom: 0 },
  identityBar: { backgroundColor: COLORS.surface, paddingVertical: 8, alignItems: 'center', borderBottomWidth: 1, borderTopWidth: 1, borderColor: COLORS.border },
  darkIdentityBar: { backgroundColor: COLORS.darkSurface, borderColor: COLORS.primary },
  identityText: { fontWeight: 'bold' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, marginTop: 24 },
  headerRight: { alignItems: 'flex-end' },
  themeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 20, marginBottom: 4 },
  flashText: { fontWeight: 'bold' },
  bannerContainer: { height: 100, borderRadius: SIZES.radius, overflow: 'hidden', marginBottom: 16 },
  bannerPureSolid: { flex: 1, backgroundColor: '#0B4F4A', justifyContent: 'center', alignItems: 'center', borderRadius: SIZES.radius },
  chipRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary, backgroundColor: COLORS.surface },
  chipActive: { backgroundColor: COLORS.primary },
  listContainer: { flex: 1 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: SIZES.radius, padding: 12, marginBottom: 12, alignItems: 'center' },
  darkCard: { backgroundColor: COLORS.darkSurface },
  cardImage: { width: 60, height: 60, borderRadius: SIZES.radius, marginRight: 12, backgroundColor: COLORS.background },
  cardInfo: { flex: 1 },
  cardAction: { marginLeft: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
  modalContent: { width: '100%', backgroundColor: COLORS.surface, borderRadius: SIZES.radius, overflow: 'hidden' },
  modalBody: { padding: SIZES.padding },
  modalImage: { width: '100%', height: 150, backgroundColor: COLORS.background, borderRadius: SIZES.radius, marginBottom: 16 },
  qtyContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  qtyBtn: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: SIZES.radius, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
});

export default HomeScreen;