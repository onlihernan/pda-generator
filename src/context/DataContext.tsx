import React, { createContext, useState, useEffect, useContext } from 'react';
import { CITIES } from '../data/ports';
import type { City, TariffRule } from '../data/ports';
import type { PortParameters } from '../data/portParameters';
import { DEFAULT_PORT_PARAMETERS } from '../data/portParameters';

interface DataContextType {
    cities: City[];
    getPortParameters: (portId: string) => PortParameters;
    updatePortParameters: (cityId: string, portId: string, params: PortParameters) => void;
    resetPortParameters: (cityId: string, portId: string) => void;
    updateTariff: (cityId: string, portId: string, tariffIndex: number, newTariff: TariffRule) => void;
    addTariff: (cityId: string, portId: string, tariff: TariffRule) => void;
    deleteTariff: (cityId: string, portId: string, tariffIndex: number) => void;
    resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cities, setCities] = useState<City[]>([]);

    // Load from LocalStorage or use default
    useEffect(() => {
        const savedData = localStorage.getItem('pda_cities_data');
        if (savedData) {
            try {
                setCities(JSON.parse(savedData));
            } catch (e) {
                console.error('Failed to parse saved data', e);
                setCities(CITIES);
            }
        } else {
            setCities(CITIES);
        }
    }, []);

    // Save to LocalStorage whenever cities change
    useEffect(() => {
        if (cities.length > 0) {
            localStorage.setItem('pda_cities_data', JSON.stringify(cities));
        }
    }, [cities]);

    const getPortParameters = (portId: string): PortParameters => {
        // Find port in cities
        for (const city of cities) {
            const port = city.ports.find(p => p.id === portId);
            if (port && port.parameters) {
                return port.parameters;
            }
        }
        // Fallback to defaults
        return DEFAULT_PORT_PARAMETERS[portId] || {};
    };

    const updatePortParameters = (cityId: string, portId: string, params: PortParameters) => {
        setCities(prevCities => prevCities.map(city => {
            if (city.id !== cityId) return city;
            return {
                ...city,
                ports: city.ports.map(port => {
                    if (port.id !== portId) return port;
                    return { ...port, parameters: params };
                })
            };
        }));
    };

    const resetPortParameters = (cityId: string, portId: string) => {
        setCities(prevCities => prevCities.map(city => {
            if (city.id !== cityId) return city;
            return {
                ...city,
                ports: city.ports.map(port => {
                    if (port.id !== portId) return port;
                    return { ...port, parameters: undefined };
                })
            };
        }));
    };

    const updateTariff = (cityId: string, portId: string, tariffIndex: number, newTariff: TariffRule) => {
        setCities(prevCities => prevCities.map(city => {
            if (city.id !== cityId) return city;
            return {
                ...city,
                ports: city.ports.map(port => {
                    if (port.id !== portId) return port;
                    const newTariffs = [...port.tariffs];
                    newTariffs[tariffIndex] = newTariff;
                    return { ...port, tariffs: newTariffs };
                })
            };
        }));
    };

    const addTariff = (cityId: string, portId: string, tariff: TariffRule) => {
        setCities(prevCities => prevCities.map(city => {
            if (city.id !== cityId) return city;
            return {
                ...city,
                ports: city.ports.map(port => {
                    if (port.id !== portId) return port;
                    return { ...port, tariffs: [...port.tariffs, tariff] };
                })
            };
        }));
    };

    const deleteTariff = (cityId: string, portId: string, tariffIndex: number) => {
        setCities(prevCities => prevCities.map(city => {
            if (city.id !== cityId) return city;
            return {
                ...city,
                ports: city.ports.map(port => {
                    if (port.id !== portId) return port;
                    const newTariffs = port.tariffs.filter((_, index) => index !== tariffIndex);
                    return { ...port, tariffs: newTariffs };
                })
            };
        }));
    };

    const resetData = () => {
        if (confirm('Are you sure you want to reset all data to defaults? This cannot be undone.')) {
            setCities(CITIES);
            localStorage.removeItem('pda_cities_data');
        }
    };

    return (
        <DataContext.Provider value={{
            cities,
            getPortParameters,
            updatePortParameters,
            resetPortParameters,
            updateTariff,
            addTariff,
            deleteTariff,
            resetData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
