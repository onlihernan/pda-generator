// Port-specific calculator implementations
import type { PortParameters } from '../data/portParameters';
import { getPortParameters } from '../data/portParameters';

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

export type VesselType = 'bulker' | 'tanker';

export interface ShipData {
    vesselName: string;
    daysAlongside: number;
    loa: number;
    beam: number;
    depthMoulded: number;
    nrt: number;
    grt: number;
    draftEntryCategory: DraftCategory;
    draftExitCategory: DraftCategory;
    isArgentineOrigin: boolean;
    isArgentineDestination: boolean;
    vesselType?: VesselType;
    manualExchangeRate?: number;
}

export interface CostItem {
    name: string;
    amountUSD: number;
    description?: string;
    customDisplayValue?: string;
}

export interface PDACalculation {
    items: CostItem[];
    totalUSD: number;
}

// Helper: Extract percentage from draft category
const getDraftPercentage = (category: DraftCategory): number => {
    if (category.includes('0%')) return 0;
    if (category.includes('7.5%')) return 0.075;
    if (category.includes('15%')) return 0.15;
    if (category.includes('22.5%')) return 0.225;
    if (category.includes('30%')) return 0.30;
    return 0;
};

// Helper: Calculate UF (Unidades de Facturación)
const calculateUF = (loa: number, beam: number, dm: number): number => {
    let uf = Math.ceil((loa * beam * dm) / 800);
    return uf < 65 ? 65 : uf;
};

// Helper: Calculate Free Pratique - ROUNDED UP
const calculateFreePratique = (nrt: number): number => {
    return Math.ceil((((nrt - 1001) * 6.9429 + 416574) / 840) + 50);
};

// Helper: Calculate Port Pilot - With rounding up on each step
const calculatePortPilot = (
    uf: number,
    pilotBase: number,
    arrDraftPct: number,
    depDraftPct: number
): number => {
    const tarifa = Math.ceil(uf * 14);
    const baseCalc = Math.ceil((tarifa + pilotBase) * 2);
    const arrDraftCalc = Math.ceil(tarifa * arrDraftPct);
    const depDraftCalc = Math.ceil(tarifa * depDraftPct);

    return Math.ceil(baseCalc + arrDraftCalc + depDraftCalc);
};

// Helper: Add common migration items
const addMigrations = (items: CostItem[], ship: ShipData, params: PortParameters) => {
    const inOut = params.migrationsInOut ?? 2500;
    const single = params.migrationsSingle ?? 1250;

    if (!ship.isArgentineOrigin && !ship.isArgentineDestination) {
        items.push({ name: 'Migrations (in/out)', amountUSD: inOut, description: 'In/out' });
    } else if (!ship.isArgentineOrigin) {
        items.push({ name: 'Migrations (in)', amountUSD: single, description: 'In' });
    } else if (!ship.isArgentineDestination) {
        items.push({ name: 'Migrations (out)', amountUSD: single, description: 'Out' });
    }
};

// Helper: Add free pratique and garbage
const addFreePratiqueAndGarbage = (items: CostItem[], ship: ShipData, params: PortParameters) => {
    if (!ship.isArgentineOrigin) {
        items.push({ name: 'Free Pratique', amountUSD: calculateFreePratique(ship.nrt) });
        items.push({ name: 'Garbage Insp', amountUSD: params.garbageInsp ?? 40 });
    }
};

// Terminal-Specific Calculators

function calculateCarboclor(ship: ShipData, params: PortParameters): PDACalculation {
    const items: CostItem[] = [];
    const uf = calculateUF(ship.loa, ship.beam, ship.depthMoulded);
    const arrDraftPct = getDraftPercentage(ship.draftEntryCategory);
    const depDraftPct = getDraftPercentage(ship.draftExitCategory);

    items.push({
        name: 'Port dues',
        amountUSD: Math.ceil((params.portDuesFixed ?? 14100) * ship.daysAlongside),
        description: 'usd 14,100 first 24 hrs + usd 530 per additional hour (Sat/Sun/Holiday usd 16,900 24 hrs + usd 860 additional hour)'
    });

    items.push({
        name: 'Mooring/Unmooring',
        amountUSD: 0,
        description: 'included in port dues',
        customDisplayValue: 'included in port dues'
    });
    items.push({
        name: 'Oil Spill Prevention',
        amountUSD: 0,
        description: 'included in port dues',
        customDisplayValue: 'included in port dues'
    });
    items.push({ name: 'Light dues', amountUSD: Math.ceil(ship.nrt * (params.lightDuesRate ?? 0.058)) });
    items.push({
        name: 'Port Pilot',
        amountUSD: calculatePortPilot(uf, params.pilotBase ?? 2720, arrDraftPct, depDraftPct)
    });
    items.push({ name: 'Custom House (inward)', amountUSD: params.customHouse ?? 600, description: 'Inward' });

    addMigrations(items, ship, params);
    addFreePratiqueAndGarbage(items, ship, params);

    items.push({ name: 'Tallyclerk', amountUSD: Math.ceil((params.tallyClerk ?? 800) * ship.daysAlongside) });
    items.push({ name: 'Watchmen (optional)', amountUSD: Math.ceil((params.watchmen ?? 1850) * ship.daysAlongside), description: 'Optional' });
    items.push({ name: 'Custom house overtime', amountUSD: params.customHouseOT ?? 800 });

    const totalUSD = items.reduce((sum, item) => sum + item.amountUSD, 0);
    return { items, totalUSD };
}

function calculateDeltaDock(ship: ShipData, params: PortParameters): PDACalculation {
    const items: CostItem[] = [];
    const uf = calculateUF(ship.loa, ship.beam, ship.depthMoulded);
    const arrDraftPct = getDraftPercentage(ship.draftEntryCategory);
    const depDraftPct = getDraftPercentage(ship.draftExitCategory);

    let portDues = 0;
    const loaThreshold = params.portDuesLoaThreshold ?? 225;
    if (ship.loa > loaThreshold) {
        const rate = params.portDuesRateAboveThreshold ?? 0.45;
        const min = params.portDuesMinAboveThreshold ?? 5200;
        portDues = Math.ceil(Math.max(rate * ship.nrt, min) * ship.daysAlongside);
    } else {
        const rate = params.portDuesBelowThreshold ?? 0.43;
        const min = params.portDuesMinBelowThreshold ?? 4800;
        portDues = Math.ceil(Math.max(rate * ship.nrt, min) * ship.daysAlongside);
    }
    items.push({ name: 'Port dues', amountUSD: portDues });

    items.push({ name: 'Light dues', amountUSD: Math.ceil(ship.nrt * (params.lightDuesRate ?? 0.029)) });

    const ispsCharge = Math.ceil((params.ispsCharge ?? 900) * (params.ispsPerDay ? ship.daysAlongside : 1));
    items.push({ name: 'ISPS Charge', amountUSD: ispsCharge });

    items.push({
        name: 'Port Pilot',
        amountUSD: calculatePortPilot(uf, params.pilotBase ?? 3550.25, arrDraftPct, depDraftPct)
    });

    items.push({ name: 'Mooring/Unm', amountUSD: params.mooringUnmooring ?? 4200, description: 'NWH' });
    items.push({ name: 'Custom House (inward)', amountUSD: params.customHouse ?? 600, description: 'Inward' });

    addMigrations(items, ship, params);
    addFreePratiqueAndGarbage(items, ship, params);

    items.push({ name: 'Headclerk', amountUSD: Math.ceil((params.headClerk ?? 1100) * ship.daysAlongside) });
    items.push({ name: 'Watchmen (optional)', amountUSD: Math.ceil((params.watchmen ?? 1555) * ship.daysAlongside), description: 'Optional' });

    const totalUSD = items.reduce((sum, item) => sum + item.amountUSD, 0);
    return { items, totalUSD };
}

function calculateEuroamericaMaripasa(ship: ShipData, params: PortParameters): PDACalculation {
    const items: CostItem[] = [];
    const uf = calculateUF(ship.loa, ship.beam, ship.depthMoulded);
    const arrDraftPct = getDraftPercentage(ship.draftEntryCategory);
    const depDraftPct = getDraftPercentage(ship.draftExitCategory);

    let portDues = 0;
    const baseMin = params.portDuesMin ?? 1625;
    const baseRate = params.portDuesRate ?? 0.26;
    const weekendRate = params.portDuesRateWeekend ?? 0.32;

    if (ship.daysAlongside <= 5) {
        portDues = Math.ceil(Math.max(baseRate * ship.nrt, baseMin) * ship.daysAlongside);
    } else {
        const weekendDaysFactor = 2 * Math.floor(ship.daysAlongside / 7);
        const regularDays = ship.daysAlongside - weekendDaysFactor;

        if (ship.nrt * baseRate >= baseMin) {
            portDues = Math.ceil((baseRate * ship.nrt * regularDays) + (weekendRate * ship.nrt * weekendDaysFactor));
        } else {
            portDues = Math.ceil((baseMin * regularDays) + (2000 * Math.floor(ship.daysAlongside / 7)));
        }
    }
    items.push({
        name: 'Port dues',
        amountUSD: portDues,
        description: 'bss fm Mon-Fri at usd 0.26xNRTxday (if she is along during Sat/Sun/Hol: usd 0.32xNRTxday)'
    });

    items.push({ name: 'Light dues', amountUSD: Math.ceil(ship.nrt * (params.lightDuesRate ?? 0.058)) });

    const ispsCharge = Math.ceil((params.ispsCharge ?? 950) * (params.ispsPerDay ? ship.daysAlongside : 1));
    items.push({ name: 'ISPS Charge', amountUSD: ispsCharge });

    items.push({
        name: 'Port Pilot',
        amountUSD: calculatePortPilot(uf, params.pilotBase ?? 2720, arrDraftPct, depDraftPct)
    });

    items.push({ name: 'Mooring/Unm', amountUSD: params.mooringUnmooring ?? 3281, description: 'NWH' });
    items.push({ name: 'Custom House (inward)', amountUSD: params.customHouse ?? 600, description: 'Inward' });

    addMigrations(items, ship, params);
    addFreePratiqueAndGarbage(items, ship, params);

    items.push({ name: 'Headclerk', amountUSD: Math.ceil((params.headClerk ?? 1100) * ship.daysAlongside) });
    items.push({ name: 'Watchmen (optional)', amountUSD: Math.ceil((params.watchmen ?? 1555) * ship.daysAlongside), description: 'Optional' });

    const totalUSD = items.reduce((sum, item) => sum + item.amountUSD, 0);
    return { items, totalUSD };
}

function calculatePanAmericanEnergy(ship: ShipData, params: PortParameters): PDACalculation {
    const items: CostItem[] = [];
    const uf = calculateUF(ship.loa, ship.beam, ship.depthMoulded);
    const arrDraftPct = getDraftPercentage(ship.draftEntryCategory);
    const depDraftPct = getDraftPercentage(ship.draftExitCategory);

    items.push({ name: 'Port dues', amountUSD: 0, description: 'N/A' });
    items.push({ name: 'Light dues', amountUSD: Math.ceil(ship.nrt * (params.lightDuesRate ?? 0.058)) });
    items.push({
        name: 'Port Pilot',
        amountUSD: calculatePortPilot(uf, params.pilotBase ?? 2720, arrDraftPct, depDraftPct)
    });

    items.push({ name: 'Mooring/Unm', amountUSD: params.mooringUnmooring ?? 4200, description: 'in NWH' });
    items.push({ name: 'Custom House (inward)', amountUSD: params.customHouse ?? 600, description: 'Inward' });

    addMigrations(items, ship, params);
    addFreePratiqueAndGarbage(items, ship, params);

    items.push({ name: 'Custom surveyor', amountUSD: params.customSurveyor ?? 1200 });
    items.push({ name: 'Headclerk', amountUSD: Math.ceil((params.headClerk ?? 1100) * ship.daysAlongside) });
    items.push({ name: 'Watchmen (optional)', amountUSD: Math.ceil((params.watchmen ?? 1850) * ship.daysAlongside), description: 'Optional' });

    const totalUSD = items.reduce((sum, item) => sum + item.amountUSD, 0);
    return { items, totalUSD };
}

function calculateSiderca(ship: ShipData, params: PortParameters): PDACalculation {
    const items: CostItem[] = [];
    const uf = calculateUF(ship.loa, ship.beam, ship.depthMoulded);
    const arrDraftPct = getDraftPercentage(ship.draftEntryCategory);
    const depDraftPct = getDraftPercentage(ship.draftExitCategory);

    items.push({ name: 'Port dues', amountUSD: 0, description: 'N/A' });
    items.push({ name: 'ISPS Charge', amountUSD: 0, description: 'N/A' });
    items.push({ name: 'Light dues', amountUSD: Math.ceil(ship.nrt * (params.lightDuesRate ?? 0.058)) });
    items.push({
        name: 'Port Pilot',
        amountUSD: calculatePortPilot(uf, params.pilotBase ?? 2720, arrDraftPct, depDraftPct)
    });

    items.push({ name: 'Mooring/Unm', amountUSD: params.mooringUnmooring ?? 4200, description: 'NWH' });
    items.push({ name: 'Custom House (inward)', amountUSD: params.customHouse ?? 600, description: 'Inward' });

    addMigrations(items, ship, params);
    addFreePratiqueAndGarbage(items, ship, params);

    items.push({ name: 'Headclerk', amountUSD: Math.ceil((params.headClerk ?? 1100) * ship.daysAlongside) });
    items.push({ name: 'Watchmen (optional)', amountUSD: Math.ceil((params.watchmen ?? 1555) * ship.daysAlongside), description: 'Optional' });

    const totalUSD = items.reduce((sum, item) => sum + item.amountUSD, 0);
    return { items, totalUSD };
}

function calculateSanPedro(ship: ShipData, params: PortParameters, exchangeRate: number): PDACalculation {
    const items: CostItem[] = [];
    const uf = calculateUF(ship.loa, ship.beam, ship.depthMoulded);
    const arrDraftPct = getDraftPercentage(ship.draftEntryCategory);
    const depDraftPct = getDraftPercentage(ship.draftExitCategory);

    items.push({ name: 'Port dues', amountUSD: Math.ceil((params.portDuesRate ?? 0.4) * ship.nrt * ship.daysAlongside) });

    const grtThreshold = params.lightDuesSurchargeThreshold ?? 20000;
    const ft = ship.grt > grtThreshold ? (params.lightDuesSurchargeFactor ?? 1.15) : 1.00;
    const lightDues = Math.ceil(ship.grt * (params.lightDuesGrtRate ?? 0.25) * (params.lightDuesMultiplier ?? 1.10) * ft);
    items.push({ name: 'Light dues', amountUSD: lightDues });

    const baseFactor = params.ispsBaseFactor ?? 43015.50;
    const nrtRate = params.ispsNrtRate ?? 1.8;
    const ispsCharge = Math.ceil((((6 * ship.daysAlongside) * 3 * baseFactor) + ship.nrt * nrtRate) / exchangeRate);
    items.push({
        name: 'ISPS Charge',
        amountUSD: ispsCharge,
        description: 'Port safety dues will be increased depending on total vessel´s stay'
    });

    items.push({
        name: 'Port Pilot',
        amountUSD: calculatePortPilot(uf, params.pilotBase ?? 2900, arrDraftPct, depDraftPct)
    });

    items.push({ name: 'Mooring/Unm', amountUSD: params.mooringUnmooring ?? 4800 });
    items.push({ name: 'Boat for mooring/unm', amountUSD: params.boatForMooring ?? 2900 });
    items.push({ name: 'Custom House (inward)', amountUSD: params.customHouse ?? 600, description: 'Inward' });

    addMigrations(items, ship, params);
    addFreePratiqueAndGarbage(items, ship, params);

    items.push({ name: 'Headclerk', amountUSD: Math.ceil((params.headClerk ?? 1100) * ship.daysAlongside) });
    items.push({ name: 'Watchmen (optional)', amountUSD: Math.ceil((params.watchmen ?? 1555) * ship.daysAlongside), description: 'Optional' });

    const totalUSD = items.reduce((sum, item) => sum + item.amountUSD, 0);
    return { items, totalUSD };
}

function calculateDelGuazu(ship: ShipData, params: PortParameters): PDACalculation {
    const items: CostItem[] = [];
    const uf = calculateUF(ship.loa, ship.beam, ship.depthMoulded);
    const arrDraftPct = getDraftPercentage(ship.draftEntryCategory);
    const depDraftPct = getDraftPercentage(ship.draftExitCategory);

    let portDues = 0;
    if (ship.vesselType === 'bulker') {
        const loaThreshold = params.portDuesLoaThreshold ?? 225;
        if (ship.loa > loaThreshold) {
            const rate = params.portDuesRateAboveThreshold ?? 0.45;
            const min = params.portDuesMinAboveThreshold ?? 5200;
            portDues = Math.ceil(Math.max(rate * ship.nrt, min) * ship.daysAlongside);
        } else {
            const rate = params.portDuesBelowThreshold ?? 0.43;
            const min = params.portDuesMinBelowThreshold ?? 4800;
            portDues = Math.ceil(Math.max(rate * ship.nrt, min) * ship.daysAlongside);
        }
    } else if (ship.vesselType === 'tanker') {
        if (ship.loa < 150) {
            portDues = Math.ceil((params.tankerDuesLoa150 ?? 4200) * ship.daysAlongside);
        } else if (ship.loa >= 150 && ship.loa < 175) {
            portDues = Math.ceil((params.tankerDuesLoa175 ?? 4800) * ship.daysAlongside);
        } else {
            portDues = Math.ceil((params.tankerDuesLoa175Plus ?? 5800) * ship.daysAlongside);
        }
    }
    items.push({ name: 'Port dues', amountUSD: portDues });

    const ispsCharge = Math.ceil((params.ispsCharge ?? 900) * (params.ispsPerDay ? ship.daysAlongside : 1));
    items.push({ name: 'ISPS Charge', amountUSD: ispsCharge });

    items.push({
        name: 'Port Pilot',
        amountUSD: calculatePortPilot(uf, params.pilotBase ?? 3020, arrDraftPct, depDraftPct)
    });

    items.push({ name: 'Mooring/Unm', amountUSD: params.mooringUnmooring ?? 4200, description: 'NWH' });
    items.push({ name: 'Custom House (inward)', amountUSD: params.customHouse ?? 600, description: 'Inward' });

    addMigrations(items, ship, params);
    addFreePratiqueAndGarbage(items, ship, params);

    items.push({ name: 'Headclerk', amountUSD: Math.ceil((params.headClerk ?? 1100) * ship.daysAlongside) });
    items.push({ name: 'Watchmen (optional)', amountUSD: Math.ceil((params.watchmen ?? 1555) * ship.daysAlongside), description: 'Optional' });
    items.push({
        name: 'Tugboat',
        amountUSD: params.tugboat ?? 21000,
        description: 'Compulsory only for departure of vessels exceeding 120 m LOA'
    });

    const totalUSD = items.reduce((sum, item) => sum + item.amountUSD, 0);
    return { items, totalUSD };
}

function calculateLasPalmas(ship: ShipData, params: PortParameters): PDACalculation {
    const items: CostItem[] = [];
    const uf = calculateUF(ship.loa, ship.beam, ship.depthMoulded);
    const arrDraftPct = getDraftPercentage(ship.draftEntryCategory);
    const depDraftPct = getDraftPercentage(ship.draftExitCategory);

    const rate = params.portDuesRate ?? 0.37;
    const min = params.portDuesMin ?? 2000;
    const portDues = Math.ceil(Math.max(rate * ship.nrt, min) * ship.daysAlongside);
    items.push({ name: 'Port dues', amountUSD: portDues });

    const ispsCharge = Math.ceil((params.ispsCharge ?? 500) * (params.ispsPerDay ? ship.daysAlongside : 1));
    items.push({ name: 'ISPS Charge', amountUSD: ispsCharge });

    items.push({ name: 'Light dues', amountUSD: Math.ceil(ship.nrt * (params.lightDuesRate ?? 0.029)) });
    items.push({
        name: 'Port Pilot',
        amountUSD: calculatePortPilot(uf, params.pilotBase ?? 3222.5, arrDraftPct, depDraftPct)
    });

    items.push({ name: 'Mooring/Unm', amountUSD: params.mooringUnmooring ?? 2900, description: 'NWH' });
    items.push({ name: 'Custom House (inward)', amountUSD: params.customHouse ?? 600, description: 'Inward' });

    addMigrations(items, ship, params);
    addFreePratiqueAndGarbage(items, ship, params);

    items.push({ name: 'Headclerk', amountUSD: Math.ceil((params.headClerk ?? 1100) * ship.daysAlongside) });
    items.push({ name: 'Watchmen (optional)', amountUSD: Math.ceil((params.watchmen ?? 1555) * ship.daysAlongside) });

    const totalUSD = items.reduce((sum, item) => sum + item.amountUSD, 0);
    return { items, totalUSD };
}

function calculateVitco(ship: ShipData, params: PortParameters): PDACalculation {
    const items: CostItem[] = [];
    const uf = calculateUF(ship.loa, ship.beam, ship.depthMoulded);
    const arrDraftPct = getDraftPercentage(ship.draftEntryCategory);
    const depDraftPct = getDraftPercentage(ship.draftExitCategory);

    let portDues = params.portDuesFixed ?? 8900;
    if (ship.daysAlongside > 1) {
        portDues += Math.ceil((params.portDuesAdditional ?? 5000) * (ship.daysAlongside - 1));
    }
    items.push({
        name: 'Port dues',
        amountUSD: portDues,
        description: 'usd 10,680 first day + usd 2,760 per each additional 12 hours / add 20% if vessel has steel wires'
    });

    items.push({ name: 'Mooring/Unmooring', amountUSD: 0, description: 'included in port dues' });
    items.push({ name: 'Oil Spill Prevention', amountUSD: 0, description: 'included in port dues' });
    items.push({ name: 'Light dues', amountUSD: Math.ceil(ship.nrt * (params.lightDuesRate ?? 0.029)) });
    items.push({
        name: 'Port Pilot',
        amountUSD: calculatePortPilot(uf, params.pilotBase ?? 2770, arrDraftPct, depDraftPct)
    });

    items.push({ name: 'Custom House (inward)', amountUSD: params.customHouse ?? 600, description: 'Inward' });

    addMigrations(items, ship, params);
    addFreePratiqueAndGarbage(items, ship, params);

    items.push({ name: 'Tallyclerk', amountUSD: Math.ceil((params.tallyClerk ?? 800) * ship.daysAlongside) });
    items.push({ name: 'Watchmen (optional)', amountUSD: Math.ceil((params.watchmen ?? 1555) * ship.daysAlongside), description: 'Optional' });
    items.push({ name: 'Custom house overtime', amountUSD: params.customHouseOT ?? 1600 });

    const totalUSD = items.reduce((sum, item) => sum + item.amountUSD, 0);
    return { items, totalUSD };
}

// Main Calculator Router
export const calculatePDA = (
    portId: string,
    ship: ShipData,
    exchangeRate?: number,
    customParams?: PortParameters
): PDACalculation => {
    const params = customParams || getPortParameters(portId);
    const rate = exchangeRate || 1450;

    if (portId === 'carboclor') return calculateCarboclor(ship, params);
    if (portId === 'delta-dock') return calculateDeltaDock(ship, params);
    if (portId === 'euroamerica-maripasa') return calculateEuroamericaMaripasa(ship, params);
    if (portId === 'pan-american-energy') return calculatePanAmericanEnergy(ship, params);
    if (portId === 'siderca') return calculateSiderca(ship, params);
    if (portId === 'san-pedro') return calculateSanPedro(ship, params, rate);
    if (portId === 'del-guazu') return calculateDelGuazu(ship, params);
    if (portId === 'las-palmas') return calculateLasPalmas(ship, params);
    if (portId === 'vitco') return calculateVitco(ship, params);

    return { items: [], totalUSD: 0 };
};
