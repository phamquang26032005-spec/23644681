// src/utils/formatters.ts

/** Định dạng tiền tệ VNĐ */
export const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

/** Kiểm tra email hợp lệ */
export const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};
