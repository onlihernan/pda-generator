import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import type { TariffRule } from '../../data/ports';

export const AdminPanel: React.FC = () => {
    const { cities, updateTariff, addTariff, deleteTariff, resetData } = useData();
    const { logout } = useAuth();

    const [selectedCityId, setSelectedCityId] = useState<string>('');
    const [selectedPortId, setSelectedPortId] = useState<string>('');
    const [editingTariff, setEditingTariff] = useState<{ index: number, rule: TariffRule } | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const selectedCity = cities.find(c => c.id === selectedCityId);
    const selectedPort = selectedCity?.ports.find(p => p.id === selectedPortId);

    const handleSave = () => {
        if (selectedCity && selectedPort && editingTariff) {
            updateTariff(selectedCity.id, selectedPort.id, editingTariff.index, editingTariff.rule);
            setEditingTariff(null);
        }
    };

    const handleAdd = (rule: TariffRule) => {
        if (selectedCity && selectedPort) {
            addTariff(selectedCity.id, selectedPort.id, rule);
            setIsAdding(false);
        }
    };

    const emptyRule: TariffRule = { item: '', unit: 'TRN', price: 0, currency: 'USD', description: '' };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="text-xl font-bold">Tariff Management</h2>
                <div>
                    <button onClick={resetData} style={{ marginRight: '1rem', backgroundColor: '#ef4444' }}>Reset Defaults</button>
                    <button onClick={logout} style={{ backgroundColor: 'transparent', border: '1px solid var(--color-border)' }}>Logout</button>
                </div>
            </div>

            <div className="card mb-4">
                <div className="grid grid-cols-2">
                    <div>
                        <label className="label">Select City</label>
                        <select value={selectedCityId} onChange={(e) => { setSelectedCityId(e.target.value); setSelectedPortId(''); }}>
                            <option value="">Select City...</option>
                            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="label">Select Port</label>
                        <select value={selectedPortId} onChange={(e) => setSelectedPortId(e.target.value)} disabled={!selectedCityId}>
                            <option value="">Select Port...</option>
                            {selectedCity?.ports.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {selectedPort && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 className="font-bold text-lg">Tariffs for {selectedPort.name}</h3>
                        <button onClick={() => setIsAdding(true)} disabled={isAdding || !!editingTariff}>+ Add Rule</button>
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Unit</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedPort.tariffs.map((tariff, index) => (
                                <tr key={index}>
                                    {editingTariff?.index === index ? (
                                        <>
                                            <td><input value={editingTariff.rule.item} onChange={e => setEditingTariff({ ...editingTariff, rule: { ...editingTariff.rule, item: e.target.value } })} /></td>
                                            <td>
                                                <select value={editingTariff.rule.unit} onChange={e => setEditingTariff({ ...editingTariff, rule: { ...editingTariff.rule, unit: e.target.value as any } })}>
                                                    <option value="TRN">TRN</option>
                                                    <option value="TRB">TRB</option>
                                                    <option value="LOA">LOA</option>
                                                    <option value="DRAFT">DRAFT</option>
                                                    <option value="FIXED">FIXED</option>
                                                </select>
                                            </td>
                                            <td><input type="number" value={editingTariff.rule.price} onChange={e => setEditingTariff({ ...editingTariff, rule: { ...editingTariff.rule, price: parseFloat(e.target.value) } })} /></td>
                                            <td>
                                                <button onClick={handleSave} style={{ marginRight: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.8em' }}>Save</button>
                                                <button onClick={() => setEditingTariff(null)} style={{ backgroundColor: '#64748b', padding: '0.2rem 0.5rem', fontSize: '0.8em' }}>Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{tariff.item}</td>
                                            <td>{tariff.unit}</td>
                                            <td>{tariff.price} {tariff.currency}</td>
                                            <td>
                                                <button onClick={() => setEditingTariff({ index, rule: tariff })} style={{ marginRight: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.8em' }}>Edit</button>
                                                <button onClick={() => deleteTariff(selectedCity!.id, selectedPort.id, index)} style={{ backgroundColor: '#ef4444', padding: '0.2rem 0.5rem', fontSize: '0.8em' }}>Del</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            {isAdding && (
                                <TariffRowEditor
                                    initialRule={emptyRule}
                                    onSave={handleAdd}
                                    onCancel={() => setIsAdding(false)}
                                />
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const TariffRowEditor: React.FC<{ initialRule: TariffRule, onSave: (r: TariffRule) => void, onCancel: () => void }> = ({ initialRule, onSave, onCancel }) => {
    const [rule, setRule] = useState(initialRule);
    return (
        <tr>
            <td><input value={rule.item} onChange={e => setRule({ ...rule, item: e.target.value })} placeholder="Item Name" /></td>
            <td>
                <select value={rule.unit} onChange={e => setRule({ ...rule, unit: e.target.value as any })}>
                    <option value="TRN">TRN</option>
                    <option value="TRB">TRB</option>
                    <option value="LOA">LOA</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="FIXED">FIXED</option>
                </select>
            </td>
            <td><input type="number" value={rule.price} onChange={e => setRule({ ...rule, price: parseFloat(e.target.value) })} placeholder="Price" /></td>
            <td>
                <button onClick={() => onSave(rule)} style={{ marginRight: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.8em' }}>Add</button>
                <button onClick={onCancel} style={{ backgroundColor: '#64748b', padding: '0.2rem 0.5rem', fontSize: '0.8em' }}>Cancel</button>
            </td>
        </tr>
    );
};
