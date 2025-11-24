import React, { useState, useEffect } from 'react';
import type { PDACalculation, ShipData } from '../utils/calculator';
import type { ExchangeRate } from '../services/exchangeRate';

interface PDAResultProps {
    calculation: PDACalculation | null;
    exchangeRate: ExchangeRate | null;
    shipData: ShipData;
    portName: string;
}

export const PDAResult: React.FC<PDAResultProps> = ({ calculation, exchangeRate, shipData, portName }) => {
    const [copied, setCopied] = useState(false);
    const [generatedText, setGeneratedText] = useState('');

    useEffect(() => {
        if (calculation) {
            const dateStr = new Date().toLocaleDateString();
            // Use manual rate if provided, otherwise fetch rate, otherwise 0
            const currentRate = shipData.manualExchangeRate || exchangeRate?.sell || 0;
            const rateStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ARS' }).format(currentRate);

            const text = `PROFORMA DISBURSEMENT ACCOUNT (ESTIMATION)
------------------------------------------
Port: ${portName}
Date: ${dateStr}

VESSEL PARTICULARS
------------------
Vessel Name: ${shipData.vesselName || 'N/A'}
Days Alongside: ${shipData.daysAlongside}
LOA: ${shipData.loa} m
Beam: ${shipData.beam} m
Depth Moulded: ${shipData.depthMoulded} m
NRT: ${shipData.nrt}
GRT: ${shipData.grt}

Arrival Draft: ${shipData.draftEntryCategory}
Departure Draft: ${shipData.draftExitCategory}

Origin: ${shipData.isArgentineOrigin ? 'Argentine Port' : 'Foreign Port'}
Destination: ${shipData.isArgentineDestination ? 'Argentine Port' : 'Foreign Port'}

ESTIMATED COSTS (USD)
---------------------
${calculation.items.map(item => `${item.name.padEnd(30)}: $${item.amountUSD.toFixed(2)}`).join('\n')}
---------------------
TOTAL ESTIMATED               : $${calculation.totalUSD.toFixed(2)}

Exchange Rate used: ${rateStr} / USD
------------------------------------------
* This is an estimation. Actual costs may vary.
`;
            setGeneratedText(text);
        }
    }, [calculation, exchangeRate, shipData, portName]);

    if (!calculation) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const currentRate = shipData.manualExchangeRate || exchangeRate?.sell || 0;

    return (
        <div className="card fade-in" style={{ animationDelay: '0.2s', borderColor: 'var(--color-accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="text-xl font-bold" style={{ margin: 0 }}>PDA Result</h2>
                <button
                    onClick={handleCopy}
                    style={{
                        backgroundColor: copied ? '#10b981' : 'var(--color-primary)',
                        minWidth: '140px'
                    }}
                >
                    {copied ? 'Copied!' : 'Copy for Email'}
                </button>
            </div>

            <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)' }}>
                <span className="text-sm text-muted">Exchange Rate used: </span>
                <strong>{formatCurrency(currentRate, 'ARS')} / USD</strong>
            </div>

            {/* Visual Table for Quick View */}
            <table className="table" style={{ marginBottom: '1.5rem' }}>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th style={{ textAlign: 'right' }}>Amount (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    {calculation.items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td style={{ textAlign: 'right' }}>{formatCurrency(item.amountUSD, 'USD')}</td>
                        </tr>
                    ))}
                    <tr className="total-row">
                        <td style={{ textAlign: 'right' }}>TOTAL</td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(calculation.totalUSD, 'USD')}</td>
                    </tr>
                </tbody>
            </table>

            {/* Text Area for Manual Copying */}
            <div>
                <label className="label">Email Format (Text)</label>
                <textarea
                    readOnly
                    value={generatedText}
                    style={{
                        width: '100%',
                        height: '300px',
                        fontFamily: 'monospace',
                        fontSize: '0.9em',
                        padding: '1rem',
                        backgroundColor: '#0f172a',
                        color: '#e2e8f0',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        resize: 'vertical'
                    }}
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                />
                <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>
                    Click inside the box to select all text.
                </p>
            </div>
        </div>
    );
};
