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

            const safePortName = portName || '';
            const isSanPedro = safePortName.toLowerCase().includes('san pedro');
            const isDeltaDock = safePortName.toLowerCase().includes('delta dock');
            const isLasPalmas = safePortName.toLowerCase().includes('las palmas');
            const isEuroamericaMaripasa = safePortName.toLowerCase().includes('euroamerica') || safePortName.toLowerCase().includes('maripasa');
            const vesselName = (shipData.vesselName || 'N/A').toUpperCase();

            // Use terminal name for Euroamerica/Maripasa if specified
            const displayPortName = (isEuroamericaMaripasa && shipData.terminalName)
                ? shipData.terminalName
                : safePortName.toUpperCase();

            // Format: VESSEL – PORT – DAYS days along:
            const header = `${vesselName} – ${displayPortName} – ${shipData.daysAlongside} days along:`;

            let text = `PROFORMA DISBURSEMENT ACCOUNT (ESTIMATION)
------------------------------------------

${header}
---------------------
${calculation.items.map(item => {
                const amountStr = item.customDisplayValue || `usd ${Math.ceil(item.amountUSD)}`;
                const itemLine = `${item.name.padEnd(30)}: ${amountStr}`;
                // Add description on next line if it exists
                return item.description ? `${itemLine}\n${' '.repeat(32)}(${item.description})` : itemLine;
            }).join('\n')}
---------------------
TOTAL ESTIMATED               : usd ${Math.ceil(calculation.totalUSD)}

------------------------------------------
* This is an estimation. Actual costs may vary.
`;

            if (isSanPedro) {
                text += `
Take into account Customs authorization for vessel stay in case the ship does not operate during OT: USD 300–350 per shift.
(*) Port safety dues will be increased depending on the vessel's total stay.
(**) Remember that pilots recommend not exceeding 200 meters LOA.
`;
            }

            if (isDeltaDock || isLasPalmas) {
                text += `
If no operation takes place during overtime, a permanence charge of USD 350 per shift will apply.
`;
            }

            console.log('Generated Email Text:', text);
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
                            <td style={{ textAlign: 'right' }}>
                                {item.customDisplayValue || `$${Math.ceil(item.amountUSD)}`}
                            </td>
                        </tr>
                    ))}
                    <tr className="total-row">
                        <td style={{ textAlign: 'right' }}>TOTAL</td>
                        <td style={{ textAlign: 'right' }}>${Math.ceil(calculation.totalUSD)}</td>
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
