// src/services/api.ts
import { API_URL } from "../constants/theme";

export const fetchProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products`);
        return await response.json();
    } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
        throw error;
    }
};
