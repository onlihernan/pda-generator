
const calculateUF = (loa, beam, dm) => {
    let uf = Math.ceil((loa * beam * dm) / 800);
    return uf < 65 ? 65 : uf;
};

const calculatePortPilot = (
    uf,
    pilotBase,
    arrDraftPct,
    depDraftPct
) => {
    const tarifa = Math.ceil(uf * 14);
    const baseCalc = Math.ceil((tarifa + pilotBase) * 2);
    const arrDraftCalc = Math.ceil(tarifa * arrDraftPct);
    const depDraftCalc = Math.ceil(tarifa * depDraftPct);

    console.log('UF:', uf);
    console.log('Tarifa:', tarifa);
    console.log('PilotBase:', pilotBase);
    console.log('BaseCalc:', baseCalc);
    console.log('ArrDraftCalc:', arrDraftCalc);
    console.log('DepDraftCalc:', depDraftCalc);

    return Math.ceil(baseCalc + arrDraftCalc + depDraftCalc);
};

// User values
const loa = 200;
const beam = 32;
const depth = 15;
const pilotBase = 3550.25; // Default for Delta Dock
const arrDraftPct = 0;
const depDraftPct = 0.30; // 30%

const uf = calculateUF(loa, beam, depth);
const total = calculatePortPilot(uf, pilotBase, arrDraftPct, depDraftPct);

console.log('Total:', total);
