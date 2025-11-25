import React, { useState, useEffect } from 'react';
import type { PortParameters } from '../../data/portParameters';
import { DEFAULT_PORT_PARAMETERS } from '../../data/portParameters';

interface ParameterEditorProps {
    portId: string;
    portName: string;
    parameters: PortParameters;
    onUpdate: (params: PortParameters) => void;
    onReset: () => void;
}

export const ParameterEditor: React.FC<ParameterEditorProps> = ({
    portId,
    portName,
    parameters,
    onUpdate,
    onReset
}) => {
    const [editedParams, setEditedParams] = useState<PortParameters>(parameters);
    const defaults = DEFAULT_PORT_PARAMETERS[portId] || {};

    useEffect(() => {
        setEditedParams(parameters);
    }, [parameters, portId]);

    const handleChange = (field: keyof PortParameters, value: number | boolean) => {
        setEditedParams(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onUpdate(editedParams);
    };

    const handleResetField = (field: keyof PortParameters) => {
        setEditedParams(prev => ({
            ...prev,
            [field]: defaults[field]
        }));
    };

    const isFieldEnabled = (field: keyof PortParameters): boolean => {
        // Common fields used by almost everyone (with exceptions)
        const commonFields: (keyof PortParameters)[] = [
            'customHouse', 'watchmen', 'garbageInsp',
            'migrationsInOut', 'migrationsSingle', 'pilotBase'
        ];
        if (commonFields.includes(field)) return true;

        // Port-specific logic
        switch (portId) {
            case 'carboclor':
                return ['portDuesFixed', 'lightDuesRate', 'tallyClerk', 'customHouseOT'].includes(field);
            case 'delta-dock':
                return [
                    'headClerk', 'lightDuesRate', 'ispsCharge', 'ispsPerDay', 'mooringUnmooring',
                    'portDuesLoaThreshold', 'portDuesRateAboveThreshold', 'portDuesBelowThreshold',
                    'portDuesMinAboveThreshold', 'portDuesMinBelowThreshold'
                ].includes(field);
            case 'euroamerica-maripasa':
                return [
                    'headClerk', 'portDuesRate', 'portDuesRateWeekend', 'portDuesMin', 'lightDuesRate',
                    'ispsCharge', 'ispsPerDay', 'mooringUnmooring'
                ].includes(field);
            case 'pan-american-energy':
                return ['headClerk', 'lightDuesRate', 'mooringUnmooring', 'customSurveyor'].includes(field);
            case 'siderca':
                return ['headClerk', 'lightDuesRate', 'mooringUnmooring'].includes(field);
            case 'san-pedro':
                return [
                    'headClerk', 'portDuesRate', 'lightDuesGrtRate', 'lightDuesMultiplier',
                    'lightDuesSurchargeThreshold', 'lightDuesSurchargeFactor',
                    'ispsBaseFactor', 'ispsNrtRate', 'mooringUnmooring', 'boatForMooring'
                ].includes(field);
            case 'del-guazu':
                return [
                    'headClerk', 'ispsCharge', 'ispsPerDay', 'mooringUnmooring', 'tugboat',
                    'portDuesLoaThreshold', 'portDuesRateAboveThreshold', 'portDuesBelowThreshold',
                    'portDuesMinAboveThreshold', 'portDuesMinBelowThreshold',
                    'tankerDuesLoa150', 'tankerDuesLoa175', 'tankerDuesLoa175Plus'
                ].includes(field);
            case 'las-palmas':
                return [
                    'headClerk', 'portDuesRate', 'portDuesMin', 'lightDuesRate', 'ispsCharge',
                    'ispsPerDay', 'mooringUnmooring'
                ].includes(field);
            case 'vitco':
                return [
                    'portDuesFixed', 'portDuesAdditional', 'lightDuesRate',
                    'tallyClerk', 'customHouseOT'
                ].includes(field);
            default:
                return true;
        }
    };

    const renderNumberInput = (
        label: string,
        field: keyof PortParameters,
        description?: string
    ) => {
        const value = editedParams[field] as number | undefined;
        const defaultValue = defaults[field] as number | undefined;
        const enabled = isFieldEnabled(field);

        return (
            <div style={{ marginBottom: '1em', opacity: enabled ? 1 : 0.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                    <label style={{ width: '250px', fontWeight: '500' }}>{label}</label>
                    <input
                        type="number"
                        step="0.01"
                        value={value ?? ''}
                        onChange={(e) => handleChange(field, parseFloat(e.target.value) || 0)}
                        style={{
                            width: '150px',
                            backgroundColor: enabled ? 'var(--color-bg)' : '#e2e8f0',
                            cursor: enabled ? 'text' : 'not-allowed'
                        }}
                        disabled={!enabled}
                    />
                    <button
                        onClick={() => handleResetField(field)}
                        style={{ padding: '0.3em 0.7em', fontSize: '0.9em' }}
                        disabled={!enabled}
                    >
                        Reset
                    </button>
                </div>
                {description && (
                    <div style={{ fontSize: '0.85em', color: 'var(--color-text-muted)', marginTop: '0.3em' }}>
                        {description} {defaultValue !== undefined && `(default: ${defaultValue})`}
                    </div>
                )}
            </div>
        );
    };

    const renderCheckbox = (
        label: string,
        field: keyof PortParameters,
        description?: string
    ) => {
        const value = editedParams[field] as boolean | undefined;
        const enabled = isFieldEnabled(field);

        return (
            <div style={{ marginBottom: '1em', opacity: enabled ? 1 : 0.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                    <label style={{ width: '250px', fontWeight: '500' }}>{label}</label>
                    <input
                        type="checkbox"
                        checked={value ?? false}
                        onChange={(e) => handleChange(field, e.target.checked)}
                        style={{ width: 'auto', cursor: enabled ? 'pointer' : 'not-allowed' }}
                        disabled={!enabled}
                    />
                    <button
                        onClick={() => handleResetField(field)}
                        style={{ padding: '0.3em 0.7em', fontSize: '0.9em' }}
                        disabled={!enabled}
                    >
                        Reset
                    </button>
                </div>
                {description && (
                    <div style={{ fontSize: '0.85em', color: 'var(--color-text-muted)', marginTop: '0.3em' }}>
                        {description}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ padding: '1em', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '8px' }} >
            <h3 style={{ marginBottom: '1em' }}>Parameter Editor - {portName}</h3>

            {/* Common Parameters */}
            < h4 style={{ marginTop: '1.5em', marginBottom: '1em' }}> Common Parameters</h4 >
            {renderNumberInput('Light Dues Rate', 'lightDuesRate', 'Rate per NRT')}
            {renderNumberInput('Custom House', 'customHouse', 'Fixed fee')}
            {renderNumberInput('Headclerk (per day)', 'headClerk')}
            {renderNumberInput('Watchmen (per day)', 'watchmen')}
            {renderNumberInput('Tallyclerk (per day)', 'tallyClerk')}
            {renderNumberInput('Garbage Inspection', 'garbageInsp')}
            {renderNumberInput('Migrations (In/Out)', 'migrationsInOut')}
            {renderNumberInput('Migrations (Single)', 'migrationsSingle')}

            {/* Port-Specific Parameters */}
            <h4 style={{ marginTop: '1.5em', marginBottom: '1em' }}>Port-Specific Parameters</h4>
            {renderNumberInput('Pilot Base', 'pilotBase', 'Base constant for pilot calculation')}
            {renderNumberInput('Mooring/Unmooring', 'mooringUnmooring')}
            {renderNumberInput('ISPS Charge', 'ispsCharge')}
            {renderCheckbox('ISPS Per Day', 'ispsPerDay', 'Check if ISPS is charged per day')}

            {/* Port Dues Section */}
            <h4 style={{ marginTop: '1.5em', marginBottom: '1em' }}>Port Dues Configuration</h4>
            {renderNumberInput('Port Dues (Fixed)', 'portDuesFixed', 'Fixed rate per day')}
            {renderNumberInput('Port Dues (Rate)', 'portDuesRate', 'Rate per NRT')}
            {renderNumberInput('Port Dues (Minimum)', 'portDuesMin', 'Minimum threshold')}
            {renderNumberInput('Port Dues (Additional)', 'portDuesAdditional', 'Additional day rate')}
            {renderNumberInput('Port Dues (Weekend Rate)', 'portDuesRateWeekend', 'Weekend/holiday rate')}

            {/* LOA-based Parameters (Delta Dock, Del Guazu) */}
            <h4 style={{ marginTop: '1.5em', marginBottom: '1em' }}>LOA-Based Configuration</h4>
            {renderNumberInput('LOA Threshold', 'portDuesLoaThreshold', 'LOA threshold in meters')}
            {renderNumberInput('Rate Above Threshold', 'portDuesRateAboveThreshold')}
            {renderNumberInput('Rate Below Threshold', 'portDuesBelowThreshold')}
            {renderNumberInput('Min Above Threshold', 'portDuesMinAboveThreshold')}
            {renderNumberInput('Min Below Threshold', 'portDuesMinBelowThreshold')}

            {/* San Pedro Specific */}
            <h4 style={{ marginTop: '1.5em', marginBottom: '1em' }}>San Pedro Specific</h4>
            {renderNumberInput('Light Dues GRT Rate', 'lightDuesGrtRate')}
            {renderNumberInput('Light Dues Multiplier', 'lightDuesMultiplier')}
            {renderNumberInput('Light Dues Surcharge Threshold', 'lightDuesSurchargeThreshold', 'GRT threshold')}
            {renderNumberInput('Light Dues Surcharge Factor', 'lightDuesSurchargeFactor')}
            {renderNumberInput('ISPS Base Factor', 'ispsBaseFactor')}
            {renderNumberInput('ISPS NRT Rate', 'ispsNrtRate')}
            {renderNumberInput('Boat for Mooring', 'boatForMooring')}

            {/* Del Guazu Specific */}
            <h4 style={{ marginTop: '1.5em', marginBottom: '1em' }}>Del Guazu - Tanker Rates</h4>
            {renderNumberInput('Tanker Dues (LOA < 150m)', 'tankerDuesLoa150')}
            {renderNumberInput('Tanker Dues (150m ≤ LOA < 175m)', 'tankerDuesLoa175')}
            {renderNumberInput('Tanker Dues (LOA ≥ 175m)', 'tankerDuesLoa175Plus')}
            {renderNumberInput('Tugboat', 'tugboat', 'Compulsory if LOA > 120m')}

            {/* Other Specific Parameters */}
            <h4 style={{ marginTop: '1.5em', marginBottom: '1em' }}>Other Specifics</h4>
            {renderNumberInput('Custom Surveyor', 'customSurveyor', 'Pan American Energy specific')}
            {renderNumberInput('Custom House OT', 'customHouseOT', 'Overtime charges')}

            {/* Action Buttons */}
            <div style={{ marginTop: '2em', display: 'flex', gap: '1em' }}>
                <button
                    onClick={handleSave}
                    style={{
                        padding: '0.7em 1.5em',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                >
                    Save All Changes
                </button>
                <button
                    onClick={onReset}
                    style={{
                        padding: '0.7em 1.5em',
                        backgroundColor: 'var(--color-danger)',
                        color: 'white'
                    }}
                >
                    Reset All to Defaults
                </button>
            </div>
        </div >
    );
};
