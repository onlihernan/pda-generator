import React from 'react';
import type { ShipData, DraftCategory } from '../utils/calculator';
import { DRAFT_CATEGORIES } from '../utils/calculator';
import type { ExchangeRate } from '../services/exchangeRate';
import type { City, Port } from '../data/ports';

interface ShipFormProps {
    data: ShipData;
    onChange: (data: ShipData) => void;
    exchangeRate: ExchangeRate | null;
    selectedPort: Port | null;
    selectedCity: City | null;
}

export const ShipForm: React.FC<ShipFormProps> = ({ data, onChange, exchangeRate, selectedPort, selectedCity }) => {
    const handleChange = (field: keyof ShipData, value: string | boolean | number) => {
        onChange({ ...data, [field]: value });
    };

    const currentDollarValue = data.manualExchangeRate || exchangeRate?.sell || 0;
    const isSanPedroCampana = selectedCity?.id === 'campana' && selectedPort?.id === 'san-pedro';
    const isDelGuazu = selectedPort?.id === 'del-guazu';
    const isEuroamericaMaripasa = selectedPort?.id === 'euroamerica-maripasa';

    return (
        <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-bold mb-4">Vessel Particulars</h2>
            <div className="grid grid-cols-2">
                {/* Row 1 */}
                <div>
                    <label className="label">Vessel Name</label>
                    <input
                        type="text"
                        value={data.vesselName || ''}
                        onChange={(e) => handleChange('vesselName', e.target.value.toUpperCase())}
                        placeholder="e.g. MV GLORIOUS"
                    />
                </div>
                <div>
                    <label className="label">Days Alongside</label>
                    <input
                        type="number"
                        value={data.daysAlongside || ''}
                        onChange={(e) => handleChange('daysAlongside', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 2"
                    />
                </div>

                {/* Row 2 */}
                <div>
                    <label className="label">LOA [m]</label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.loa || ''}
                        onChange={(e) => handleChange('loa', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 225.00"
                    />
                </div>
                <div>
                    <label className="label">Beam [m]</label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.beam || ''}
                        onChange={(e) => handleChange('beam', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 32.20"
                    />
                </div>

                {/* Row 3 */}
                <div>
                    <label className="label">Depth Moulded [m]</label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.depthMoulded || ''}
                        onChange={(e) => handleChange('depthMoulded', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 19.50"
                    />
                </div>
                <div>
                    <label className="label">Net Tonnage (TRN)</label>
                    <input
                        type="number"
                        value={data.nrt || ''}
                        onChange={(e) => handleChange('nrt', parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 25000"
                    />
                </div>

                {/* Row 4 */}
                {isSanPedroCampana ? (
                    <div>
                        <label className="label">Gross Tonnage (TRB)</label>
                        <input
                            type="number"
                            value={data.grt || ''}
                            onChange={(e) => handleChange('grt', parseFloat(e.target.value) || 0)}
                            placeholder="e.g. 45000"
                        />
                    </div>
                ) : (
                    <div style={{ visibility: 'hidden' }}></div>
                )}
                {isSanPedroCampana ? (
                    <div>
                        <label className="label">Today's Dollar Value</label>
                        <input
                            type="number"
                            step="0.01"
                            value={currentDollarValue || ''}
                            onChange={(e) => handleChange('manualExchangeRate', parseFloat(e.target.value) || 0)}
                            placeholder="BCRA Dollar"
                        />
                        <div style={{ fontSize: '0.8em', color: 'var(--color-text-muted)', marginTop: '0.2em' }}>
                            Current date: {new Date().toLocaleDateString('es-AR')}
                        </div>
                    </div>
                ) : (
                    <div style={{ visibility: 'hidden' }}></div>
                )}

                {/* Row 5 - Vessel Type (conditional for Del Guazu) */}
                {isDelGuazu && (
                    <>
                        <div>
                            <label className="label">Vessel Type</label>
                            <select
                                value={data.vesselType || 'bulker'}
                                onChange={(e) => handleChange('vesselType', e.target.value)}
                            >
                                <option value="bulker">Bulker</option>
                                <option value="tanker">Tanker</option>
                            </select>
                        </div>
                        <div style={{ visibility: 'hidden' }}></div>
                    </>
                )}

                {/* Row 5B - Terminal Name (conditional for Euroamerica/Maripasa) */}
                {isEuroamericaMaripasa && (
                    <>
                        <div>
                            <label className="label">Terminal Name</label>
                            <select
                                value={data.terminalName || 'EUROAMERICA/MARIPASA'}
                                onChange={(e) => handleChange('terminalName', e.target.value)}
                            >
                                <option value="EUROAMERICA">EUROAMERICA</option>
                                <option value="MARIPASA">MARIPASA</option>
                                <option value="EUROAMERICA/MARIPASA">EUROAMERICA/MARIPASA</option>
                            </select>
                        </div>
                        <div style={{ visibility: 'hidden' }}></div>
                    </>
                )}

                {/* Row 6 - Drafts */}
                <div>
                    <label className="label">Arrival Draft</label>
                    <select
                        value={data.draftEntryCategory}
                        onChange={(e) => handleChange('draftEntryCategory', e.target.value as DraftCategory)}
                    >
                        {DRAFT_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="label">Departure Draft</label>
                    <select
                        value={data.draftExitCategory}
                        onChange={(e) => handleChange('draftExitCategory', e.target.value as DraftCategory)}
                    >
                        {DRAFT_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Row 7 - Origin/Dest */}
                <div>
                    <label className="label">Origin</label>
                    <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={data.isArgentineOrigin}
                                onChange={(e) => handleChange('isArgentineOrigin', e.target.checked)}
                                style={{ width: 'auto', marginRight: '0.5em' }}
                            />
                            Argentine Port
                        </label>
                    </div>
                </div>
                <div>
                    <label className="label">Destination</label>
                    <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={data.isArgentineDestination}
                                onChange={(e) => handleChange('isArgentineDestination', e.target.checked)}
                                style={{ width: 'auto', marginRight: '0.5em' }}
                            />
                            Argentine Port
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};
