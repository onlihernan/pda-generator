// Default parameters for each port terminal

export interface PortParameters {
    // Common costs
    lightDuesRate?: number;
    customHouse?: number;
    headClerk?: number;
    watchmen?: number;
    tallyClerk?: number;
    garbageInsp?: number;

    // Migrations
    migrationsInOut?: number;
    migrationsSingle?: number;

    // Port-specific
    pilotBase?: number;
    mooringUnmooring?: number;
    ispsCharge?: number;
    ispsPerDay?: boolean;

    // Port dues (varies by terminal)
    portDuesFixed?: number;
    portDuesRate?: number;
    portDuesMin?: number;
    portDuesAdditional?: number;
    portDuesRateWeekend?: number;

    // LOA-based thresholds (Delta Dock, Del Guazu)
    portDuesLoaThreshold?: number;
    portDuesRateAboveThreshold?: number;
    portDuesBelowThreshold?: number;
    portDuesMinAboveThreshold?: number;
    portDuesMinBelowThreshold?: number;

    // Special parameters
    customSurveyor?: number;
    boatForMooring?: number;
    tugboat?: number;
    customHouseOT?: number;

    // San Pedro specific
    lightDuesGrtRate?: number;
    lightDuesMultiplier?: number;
    lightDuesSurchargeThreshold?: number;
    lightDuesSurchargeFactor?: number;
    ispsBaseFactor?: number;
    ispsNrtRate?: number;

    // Del Guazu tanker-specific
    tankerDuesLoa150?: number;
    tankerDuesLoa175?: number;
    tankerDuesLoa175Plus?: number;
}

export const DEFAULT_PORT_PARAMETERS: Record<string, PortParameters> = {
    'carboclor': {
        portDuesFixed: 14100,
        lightDuesRate: 0.058,
        pilotBase: 2720,
        customHouse: 600,
        tallyClerk: 800,
        watchmen: 1850,
        customHouseOT: 800,
        migrationsInOut: 2500,
        migrationsSingle: 1250,
        garbageInsp: 40,
    },

    'delta-dock': {
        lightDuesRate: 0.029,
        ispsCharge: 900,
        ispsPerDay: true,
        pilotBase: 3550.25,
        mooringUnmooring: 4200,
        customHouse: 600,
        headClerk: 1100,
        watchmen: 1555,
        migrationsInOut: 2500,
        migrationsSingle: 1250,
        garbageInsp: 40,
        // LOA-based logic
        portDuesLoaThreshold: 225,
        portDuesRateAboveThreshold: 0.45,
        portDuesBelowThreshold: 0.43,
        portDuesMinAboveThreshold: 5200,
        portDuesMinBelowThreshold: 4800,
    },

    'euroamerica-maripasa': {
        portDuesRate: 0.26,
        portDuesRateWeekend: 0.32,
        portDuesMin: 1625,
        lightDuesRate: 0.058,
        ispsCharge: 950,
        ispsPerDay: false,
        pilotBase: 2720,
        mooringUnmooring: 3281,
        customHouse: 600,
        headClerk: 1100,
        watchmen: 1555,
        migrationsInOut: 2500,
        migrationsSingle: 1250,
        garbageInsp: 40,
    },

    'pan-american-energy': {
        lightDuesRate: 0.058,
        pilotBase: 2720,
        mooringUnmooring: 4200,
        customHouse: 600,
        customSurveyor: 1200,
        headClerk: 1100,
        watchmen: 1850,
        migrationsInOut: 2500,
        migrationsSingle: 1250,
        garbageInsp: 40,
    },

    'siderca': {
        lightDuesRate: 0.058,
        pilotBase: 2720,
        mooringUnmooring: 4200,
        customHouse: 600,
        headClerk: 1100,
        watchmen: 1555,
        migrationsInOut: 2500,
        migrationsSingle: 1250,
        garbageInsp: 40,
    },

    'san-pedro': {
        portDuesRate: 0.4,
        lightDuesGrtRate: 0.25,
        lightDuesMultiplier: 1.10,
        lightDuesSurchargeThreshold: 20000,
        lightDuesSurchargeFactor: 1.15,
        ispsBaseFactor: 43015.50,
        ispsNrtRate: 1.8,
        pilotBase: 2900,
        mooringUnmooring: 4800,
        boatForMooring: 2900,
        customHouse: 600,
        headClerk: 1100,
        watchmen: 1555,
        migrationsInOut: 2500,
        migrationsSingle: 1250,
        garbageInsp: 40,
    },

    'del-guazu': {
        ispsCharge: 900,
        ispsPerDay: true,
        pilotBase: 3020,
        mooringUnmooring: 4200,
        customHouse: 600,
        headClerk: 1100,
        watchmen: 1555,
        tugboat: 21000,
        migrationsInOut: 2500,
        migrationsSingle: 1250,
        garbageInsp: 40,
        // Bulker (same as Delta Dock)
        portDuesLoaThreshold: 225,
        portDuesRateAboveThreshold: 0.45,
        portDuesBelowThreshold: 0.43,
        portDuesMinAboveThreshold: 5200,
        portDuesMinBelowThreshold: 4800,
        // Tanker-specific
        tankerDuesLoa150: 4200,
        tankerDuesLoa175: 4800,
        tankerDuesLoa175Plus: 5800,
    },

    'las-palmas': {
        portDuesRate: 0.37,
        portDuesMin: 2000,
        lightDuesRate: 0.029,
        ispsCharge: 500,
        ispsPerDay: false,
        pilotBase: 3222.5,
        mooringUnmooring: 2900,
        customHouse: 600,
        headClerk: 1100,
        watchmen: 1555,
        migrationsInOut: 2500,
        migrationsSingle: 1250,
        garbageInsp: 40,
    },

    'vitco': {
        portDuesFixed: 8900,
        portDuesAdditional: 5000,
        lightDuesRate: 0.029,
        pilotBase: 2770,
        customHouse: 600,
        tallyClerk: 800,
        watchmen: 1555,
        customHouseOT: 1600,
        migrationsInOut: 2500,
        migrationsSingle: 1250,
        garbageInsp: 40,
    },
};

export const getPortParameters = (portId: string): PortParameters => {
    return DEFAULT_PORT_PARAMETERS[portId] || {};
};
