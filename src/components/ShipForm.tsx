import React from 'react';
import type { ShipData } from '../utils/calculator';

interface ShipFormProps {
    data: ShipData;
    onChange: (data: ShipData) => void;
}

export const ShipForm: React.FC<ShipFormProps> = ({ data, onChange }) => {
    const handleChange = (field: keyof ShipData, value: string | boolean) => {
        if (typeof value === 'boolean') {
            onChange({ ...data, [field]: value });
        } else {
            onChange({ ...data, [field]: parseFloat(value) || 0 });
        }
    };

    return (
        <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-bold mb-4">Vessel Particulars</h2>
            <div className="grid grid-cols-2">
                <div>
                    <label className="label">LOA (Eslora) [m]</label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.loa || ''}
                        onChange={(e) => handleChange('loa', e.target.value)}
                        placeholder="e.g. 225.00"
                    />
                </div>
                <div>
                    <label className="label">Beam (Manga) [m]</label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.beam || ''}
                        onChange={(e) => handleChange('beam', e.target.value)}
                        placeholder="e.g. 32.20"
                    />
                </div>
                <div>
                    <label className="label">Depth (Puntal) [m]</label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.depth || ''}
                        onChange={(e) => handleChange('depth', e.target.value)}
                        placeholder="e.g. 19.50"
                    />
                </div>
                <div>
                    <label className="label">NRT (TRN)</label>
                    <input
                        type="number"
                        value={data.nrt || ''}
                        onChange={(e) => handleChange('nrt', e.target.value)}
                        placeholder="e.g. 25000"
                    />
                </div>
                <div>
                    <label className="label">GRT (TRB)</label>
                    <input
                        type="number"
                        value={data.grt || ''}
                        onChange={(e) => handleChange('grt', e.target.value)}
                        placeholder="e.g. 45000"
                    />
                </div>
                <div>
                    <label className="label">Origin/Dest</label>
                    <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={data.isArgentinePort}
                                onChange={(e) => handleChange('isArgentinePort', e.target.checked)}
                                style={{ width: 'auto', marginRight: '0.5em' }}
                            />
                            Argentine Port
                        </label>
                    </div>
                </div>
                <div>
                    <label className="label">Draft Entry (Calado) [m]</label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.draftEntry || ''}
                        onChange={(e) => handleChange('draftEntry', e.target.value)}
                        placeholder="e.g. 10.50"
                    />
                </div>
                <div>
                    <label className="label">Draft Exit (Calado) [m]</label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.draftExit || ''}
                        onChange={(e) => handleChange('draftExit', e.target.value)}
                        placeholder="e.g. 11.00"
                    />
                </div>
            </div>
        </div>
    );
};
