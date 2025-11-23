import type { TariffRule } from '../data/ports';

export interface ShipData {
    loa: number; // Eslora
    beam: number; // Manga
    depth: number; // Puntal
    nrt: number; // TRN
    grt: number; // TRB
    draftEntry: number; // Calado entrada
    draftExit: number; // Calado salida
    isArgentinePort: boolean; // Coming from/going to Argentine port?
}

export interface CostItem {
    name: string;
    amountUSD: number;
    description?: string;
}

export interface PDACalculation {
    items: CostItem[];
    totalUSD: number;
}

export const calculatePDA = (tariffs: TariffRule[], ship: ShipData): PDACalculation => {
    const items: CostItem[] = tariffs.map(tariff => {
        let amount = 0;

        switch (tariff.unit) {
            case 'TRN':
                amount = tariff.price * ship.nrt;
                break;
            case 'TRB':
                amount = tariff.price * ship.grt;
                break;
            case 'LOA':
                amount = tariff.price * ship.loa;
                break;
            case 'DRAFT':
                // Usually based on max draft or specific entry/exit rules. 
                // For simplicity, taking the max of entry/exit for now.
                amount = tariff.price * Math.max(ship.draftEntry, ship.draftExit);
                break;
            case 'FIXED':
                amount = tariff.price;
                break;
        }

        // Adjustments based on origin/destination could be applied here
        // For example, some taxes might be lower if coming from an Argentine port
        // This is a placeholder for such logic
        if (tariff.item.includes('Harbor Dues') && ship.isArgentinePort) {
            // Example: 50% discount if coming from Argentine port (hypothetical rule)
            // amount = amount * 0.5; 
        }

        return {
            name: tariff.item,
            amountUSD: amount,
            description: tariff.description
        };
    });

    const totalUSD = items.reduce((sum, item) => sum + item.amountUSD, 0);

    return {
        items,
        totalUSD
    };
};
