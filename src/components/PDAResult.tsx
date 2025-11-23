import React from 'react';
import type { PDACalculation } from '../utils/calculator';
import type { ExchangeRate } from '../services/exchangeRate';

interface PDAResultProps {
    calculation: PDACalculation | null;
    exchangeRate: ExchangeRate | null;
}

export const PDAResult: React.FC<PDAResultProps> = ({ calculation, exchangeRate }) => {
    if (!calculation) return null;

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    return (
        <div className="card fade-in" style={{ animationDelay: '0.2s', borderColor: 'var(--color-accent)' }}>
            <h2 className="text-xl font-bold mb-4">Proforma Disbursement Account</h2>

            {exchangeRate && (
                <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)' }}>
                    <span className="text-sm text-muted">Exchange Rate (BNA Venta): </span>
                    <strong>{formatCurrency(exchangeRate.sell, 'ARS')} / USD</strong>
                    <span className="text-sm text-muted" style={{ marginLeft: '1em' }}>
                        Updated: {new Date(exchangeRate.date).toLocaleDateString()}
                    </span>
                </div>
            )}

            <table className="table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Description</th>
                        <th style={{ textAlign: 'right' }}>Amount (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    {calculation.items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td className="text-sm text-muted">{item.description}</td>
                            <td style={{ textAlign: 'right' }}>{formatCurrency(item.amountUSD, 'USD')}</td>
                        </tr>
                    ))}
                    <tr className="total-row">
                        <td colSpan={2} style={{ textAlign: 'right' }}>TOTAL ESTIMATED</td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(calculation.totalUSD, 'USD')}</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ marginTop: '1rem', fontSize: '0.8em', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                * This is an estimation. Actual costs may vary.
            </div>
        </div>
    );
};
