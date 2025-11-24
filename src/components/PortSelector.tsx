import React from 'react';
import { useData } from '../context/DataContext';
import type { City, Port } from '../data/ports';

interface PortSelectorProps {
    selectedCity: City | null;
    selectedPort: Port | null;
    onCityChange: (city: City) => void;
    onPortChange: (port: Port) => void;
}

export const PortSelector: React.FC<PortSelectorProps> = ({
    selectedCity,
    selectedPort,
    onCityChange,
    onPortChange,
}) => {
    const { cities } = useData();

    return (
        <div className="card fade-in">
            <h2 className="text-xl font-bold mb-4">Select Location</h2>
            <div className="grid grid-cols-2">
                <div>
                    <label className="label">Branch</label>
                    <select
                        value={selectedCity?.id || ''}
                        onChange={(e) => {
                            const city = cities.find(c => c.id === e.target.value);
                            if (city) onCityChange(city);
                        }}
                    >
                        <option value="" disabled>Select a branch...</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="label">Port / Terminal</label>
                    <select
                        value={selectedPort?.id || ''}
                        onChange={(e) => {
                            const port = selectedCity?.ports.find(p => p.id === e.target.value);
                            if (port) onPortChange(port);
                        }}
                        disabled={!selectedCity}
                    >
                        <option value="" disabled>Select a port...</option>
                        {selectedCity?.ports.map(port => (
                            <option key={port.id} value={port.id}>{port.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
