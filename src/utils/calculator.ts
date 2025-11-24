import type { TariffRule } from '../data/ports';

export type DraftCategory =
    | 'Igual o menor a 8.53m (0%)'
    | 'Entre 8.53m y 9.14m (7.5%)'
    | 'Entre 9.14m y 9.75m (15%)'
    | 'Entre 9.75m y 10.36m (22.5%)'
    | 'Mayor a 10.36m (30%)';

export const DRAFT_CATEGORIES: DraftCategory[] = [
    'Igual o menor a 8.53m (0%)',
    'Entre 8.53m y 9.14m (7.5%)',
    'Entre 9.14m y 9.75m (15%)',
    'Entre 9.75m y 10.36m (22.5%)',
    'Mayor a 10.36m (30%)'
];

export interface ShipData {
    vesselName: string;
    daysAlongside: number;
    loa: number; // Eslora
    beam: number; // Manga
    depthMoulded: number; // Puntal (Depth Moulded)
    nrt: number; // TRN
    grt: number; // TRB
    draftEntryCategory: DraftCategory;
    draftExitCategory: DraftCategory;
    isArgentineOrigin: boolean;
    isArgentineDestination: boolean;
    manualExchangeRate?: number; // Optional override
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

const getDraftSurcharge = (category: DraftCategory): number => {
    if (category.includes('0%')) return 0;
    if (category.includes('7.5%')) return 0.075;
    if (category.includes('15%')) return 0.15;
    if (category.includes('22.5%')) return 0.225;
    if (category.includes('30%')) return 0.30;
    return 0;
};

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
                // Logic change: Since we don't have exact draft, we might use the surcharge logic
                // OR if the tariff price is "per meter", we can't calculate it accurately without meters.
                // For now, let's assume the "price" is a base fee and we apply the surcharge.
                // OR if the user intends this to be a "Pilotage" fee that varies by draft range.

                // Assumption: If unit is DRAFT, we take the price as a BASE and apply the MAX surcharge of entry/exit.
                // This is a placeholder logic.
                const entrySurcharge = getDraftSurcharge(ship.draftEntryCategory);
                const exitSurcharge = getDraftSurcharge(ship.draftExitCategory);
                const maxSurcharge = Math.max(entrySurcharge, exitSurcharge);

                // If price is e.g. 1000, and surcharge is 30%, total is 1300? 
                // Or is the price per meter? If per meter, we are stuck.
                // Let's assume for this prototype that DRAFT unit tariffs are "Fixed Base + Surcharge".
                amount = tariff.price * (1 + maxSurcharge);
                break;
            case 'FIXED':
                amount = tariff.price;
                break;
        }

        // Example adjustment for origin/dest (placeholder)
        // if (tariff.item.includes('Harbor Dues') && ship.isArgentineOrigin) { ... }

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
