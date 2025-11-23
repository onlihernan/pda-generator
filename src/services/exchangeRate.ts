export interface ExchangeRate {
    buy: number;
    sell: number;
    date: string;
}

export const getUSDRate = async (): Promise<ExchangeRate> => {
    try {
        // Using dolarapi.com as a source for "Dolar Oficial"
        const response = await fetch('https://dolarapi.com/v1/dolares/oficial');
        if (!response.ok) {
            throw new Error('Failed to fetch rate');
        }
        const data = await response.json();
        return {
            buy: data.compra,
            sell: data.venta,
            date: data.fechaActualizacion
        };
    } catch (error) {
        console.warn('Error fetching exchange rate, using fallback:', error);
        // Fallback values if API fails
        return {
            buy: 980,
            sell: 1020,
            date: new Date().toISOString()
        };
    }
};
