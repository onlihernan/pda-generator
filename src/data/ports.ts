export interface TariffRule {
    item: string;
    unit: 'TRN' | 'TRB' | 'LOA' | 'FIXED' | 'DRAFT';
    price: number;
    currency: 'USD' | 'ARS';
    description?: string;
}

export interface Port {
    id: string;
    name: string;
    tariffs: TariffRule[];
}

export interface City {
    id: string;
    name: string;
    ports: Port[];
}

export const CITIES: City[] = [
    {
        id: 'san-lorenzo',
        name: 'San Lorenzo',
        ports: [
            {
                id: 'vicentin',
                name: 'Vicentin',
                tariffs: [
                    { item: 'Harbor Dues', unit: 'TRN', price: 0.35, currency: 'USD', description: 'Per TRN per stay' },
                    { item: 'Mooring/Unmooring', unit: 'FIXED', price: 2500, currency: 'USD', description: 'Per operation' },
                    { item: 'Pilotage (River)', unit: 'FIXED', price: 15000, currency: 'USD', description: 'Estimated average' },
                ]
            },
            {
                id: 'san-benito',
                name: 'San Benito',
                tariffs: [
                    { item: 'Harbor Dues', unit: 'TRN', price: 0.38, currency: 'USD' },
                    { item: 'Mooring/Unmooring', unit: 'FIXED', price: 2600, currency: 'USD' },
                ]
            }
        ]
    },
    {
        id: 'rosario',
        name: 'Rosario',
        ports: [
            {
                id: 'tpr',
                name: 'Terminal Puerto Rosario (TPR)',
                tariffs: [
                    { item: 'Harbor Dues', unit: 'TRN', price: 0.40, currency: 'USD' },
                    { item: 'Security Fee', unit: 'FIXED', price: 500, currency: 'USD' },
                ]
            }
        ]
    },
    {
        id: 'buenos-aires',
        name: 'Buenos Aires',
        ports: [
            {
                id: 'trp',
                name: 'TRP',
                tariffs: [
                    { item: 'Harbor Dues', unit: 'TRN', price: 0.50, currency: 'USD' },
                    { item: 'Pilotage (Entry)', unit: 'DRAFT', price: 1000, currency: 'USD', description: 'Per meter of draft' },
                ]
            }
        ]
    }
];
