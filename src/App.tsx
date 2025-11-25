import { useState, useEffect } from 'react';
import { PortSelector } from './components/PortSelector';
import { ShipForm } from './components/ShipForm';
import { PDAResult } from './components/PDAResult';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminPanel } from './components/Admin/AdminPanel';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import type { City, Port } from './data/ports';
import { calculatePDA } from './utils/calculator';
import type { ShipData, PDACalculation } from './utils/calculator';
import { getUSDRate } from './services/exchangeRate';
import type { ExchangeRate } from './services/exchangeRate';

function AppContent() {
  const { cities, getPortParameters } = useData();
  const { isAuthenticated } = useAuth();

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const [shipData, setShipData] = useState<ShipData>({
    vesselName: '',
    daysAlongside: 0,
    loa: 0,
    beam: 0,
    depthMoulded: 0,
    nrt: 0,
    grt: 0,
    draftEntryCategory: 'Igual o menor a 8.53m (0%)',
    draftExitCategory: 'Igual o menor a 8.53m (0%)',
    isArgentineOrigin: false,
    isArgentineDestination: false
  });

  const [calculation, setCalculation] = useState<PDACalculation | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      const rate = await getUSDRate();
      setExchangeRate(rate);
    };
    fetchRate();
  }, []);

  useEffect(() => {
    if (selectedPort && shipData.nrt > 0) {
      const rate = shipData.manualExchangeRate || exchangeRate?.sell;
      const params = getPortParameters(selectedPort.id);
      const result = calculatePDA(selectedPort.id, shipData, rate, params);
      setCalculation(result);
    } else {
      setCalculation(null);
    }
  }, [selectedPort, shipData, exchangeRate, getPortParameters]);

  // Reset selection if cities data changes (e.g. after admin update)
  useEffect(() => {
    if (selectedCity) {
      const updatedCity = cities.find(c => c.id === selectedCity.id);
      if (updatedCity) {
        setSelectedCity(updatedCity);
        if (selectedPort) {
          const updatedPort = updatedCity.ports.find(p => p.id === selectedPort.id);
          if (updatedPort) setSelectedPort(updatedPort);
        }
      }
    }
  }, [cities]);

  const handleCityChange = (city: City) => {
    setSelectedCity(city);
    setSelectedPort(null);
  };

  if (isAuthenticated) {
    return <AdminPanel />;
  }

  if (showAdminLogin) {
    return (
      <div>
        <button onClick={() => setShowAdminLogin(false)} style={{ margin: '1rem', backgroundColor: 'transparent', color: 'var(--color-text-muted)' }}>← Back</button>
        <AdminLogin />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
        <h1>PDA Generator</h1>
        <p className="text-muted">Proforma Disbursement Account Calculator</p>
        <button
          onClick={() => setShowAdminLogin(true)}
          style={{ position: 'absolute', top: 0, right: 0, fontSize: '0.8em', padding: '0.4em 0.8em', backgroundColor: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          Admin
        </button>
      </header>

      <main>
        <div className="grid" style={{ gap: '2rem' }}>
          <PortSelector
            selectedCity={selectedCity}
            selectedPort={selectedPort}
            onCityChange={handleCityChange}
            onPortChange={setSelectedPort}
          />

          {selectedPort && (
            <>
              <ShipForm
                data={shipData}
                onChange={setShipData}
                exchangeRate={exchangeRate}
                selectedPort={selectedPort}
                selectedCity={selectedCity}
              />

              <PDAResult
                calculation={calculation}
                exchangeRate={exchangeRate}
                shipData={shipData}
                portName={selectedPort.name}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
