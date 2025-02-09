import { useState, useRef, useEffect } from 'react';
import { Plus, X, Search } from 'lucide-react';
import supabase from '../supabase';
import infractionOptions from '../infractionOptions';

type ServiceType = 'ordinario' | 'operacao' | 'ras';
type SectorType = 'GEOTRAN - 1º Distrito' | 'GEOTRAN - 2º Distrito' | 'GEOTRAN - 3º/4º Distrito' | '1º Distrito' | '2º Distrito' | '3º Distrito' | '4º Distrito' | 'GEDAM' | 'GRE' | 'GMAP' | 'ROMU' | 'RAS' | 'Operação';

interface Infraction {
  infraction_type: string;
  quantity: number;
  report_uid?: string;
}

interface FormData {
  responsible_name: string;
  service_name: ServiceType;
  sector: SectorType;
  car_removals: number;
  motorcycle_removals: number;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    responsible_name: '',
    service_name: 'ordinario',
    sector: 'GEOTRAN - 1º Distrito',
    car_removals: 0,
    motorcycle_removals: 0
  });
  const [infractions, setInfractions] = useState<Infraction[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedInfraction, setSelectedInfraction] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Filter infractions based on search term
  const filteredInfractions = infractionOptions.filter(infraction =>
    infraction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    supabase.auth.getSession()
      .then(() => {
        setSupabaseError(null);
        console.log('Supabase connection successful!');
      })
      .catch((error) => {
        console.error('Supabase connection failed:', error);
        if (error.message.includes('404')) {
          setSupabaseError('Erro 404 ao conectar com o Supabase. Verifique a URL.');
        } else {
          setSupabaseError('Erro ao conectar com o Supabase. Verifique as configurações.');
        }
        console.log('Supabase error details:', error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      // Save main report data
      const { data: reportData, error: reportError } = await supabase
        .from('geotranote_reports')
        .insert([
          {
            responsible_name: formData.responsible_name,
            service_name: formData.service_name,
            sector: formData.sector,
            car_removals: formData.car_removals,
            motorcycle_removals: formData.motorcycle_removals
          }
        ]).select('uid').single();

      console.log('reportData:', reportData);
      console.log('reportError:', reportError);

      if (reportError) {
        console.error('Error saving report data to Supabase:', reportError);
        console.error('Supabase report error details:', reportError);
        setFormError('Erro ao salvar o formulário.');
        return;
      }

      // Save infractions after report data is saved
      if (infractions.length > 0 && reportData) {
        console.log('Attempting to insert infractions:', infractions);
        
        const infractionData = infractions.map(infraction => ({
          infraction_type: infraction.infraction_type,
          quantity: infraction.quantity,
          report_uid: reportData.uid // Use report_uid from reportData
        }));
        
        console.log('Formatted infraction data:', infractionData);

        const { data: insertedInfractions, error: infractionsError } = await supabase
          .from('infractions')
          .insert(infractionData)
          .select('*');

        if (infractionsError) {
          console.error('Detailed infraction error:', infractionsError);
          throw infractionsError;
        }
      }

      console.log('Data saved to Supabase');
      alert('Formulário salvo com sucesso!');
      setFormData({
        responsible_name: '',
        service_name: 'ordinario',
        sector: 'GEOTRAN - 1º Distrito',
        car_removals: 0,
        motorcycle_removals: 0
      });
      setInfractions([]);
    } catch (error) {
      console.error('Full error object:', error);
      setFormError('Erro ao salvar os dados. Por favor, tente novamente.');
    }
  };

  const handleAddInfraction = () => {
    if (selectedInfraction && quantity > 0) {
      setInfractions([...infractions, { infraction_type: selectedInfraction, quantity: quantity }]);
      setSelectedInfraction('');
      setSearchTerm('');
      setQuantity(1);
      setIsSidebarOpen(false);
    }
  };

  const handleRemoveInfraction = (index: number) => {
    const newInfractions = [...infractions];
    newInfractions.splice(index, 1);
    setInfractions(newInfractions);
  };

  const handleSelectInfraction = (infraction: string) => {
    setSelectedInfraction(infraction);
    setSearchTerm(infraction);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 font-roboto antialiased">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold text-gray-800">GEOTRANOTE</h1>
              <h2 className="text-md font-medium text-gray-600">Sistema de Relatórios de Trânsito</h2>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {supabaseError && (
              <div className="text-red-500 mb-4">
                {supabaseError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome do responsável */}
              <div>
                <label 
                  htmlFor="responsible_name" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nome do responsável
                </label>
                <input
                  type="text"
                  id="responsible_name"
                  value={formData.responsible_name}
                  onChange={(e) => setFormData({...formData, responsible_name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Tipo de serviço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de serviço
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'ordinario', label: 'Ordinário' },
                    { value: 'operacao', label: 'Operação' },
                    { value: 'ras', label: 'RAS' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={option.value}
                        name="service_name"
                        value={option.value}
                        checked={formData.service_name === option.value}
                        onChange={(e) => setFormData({...formData, service_name: e.target.value as ServiceType})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor={option.value}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Setor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Setor
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'GEOTRAN - 1º Distrito', label: 'GEOTRAN - 1º Distrito' },
                    { value: 'GEOTRAN - 2º Distrito', label: 'GEOTRAN - 2º Distrito' },
                    { value: 'GEOTRAN - 3º/4º Distrito', label: 'GEOTRAN - 3º/4º Distrito' },
                    { value: '1º Distrito', label: '1º Distrito' },
                    { value: '2º Distrito', label: '2º Distrito' },
                    { value: '3º Distrito', label: '3º Distrito' },
                    { value: '4º Distrito', label: '4º Distrito' },
                    { value: 'GEDAM', label: 'GEDAM' },
                    { value: 'GRE', label: 'GRE' },
                    { value: 'GMAP', label: 'GMAP' },
                    { value: 'ROMU', label: 'ROMU' },
                    { value: 'RAS', label: 'RAS' },
                    { value: 'Operação', label: 'Operação' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={option.value}
                        name="sector"
                        value={option.value}
                        checked={formData.sector === option.value}
                        onChange={(e) => setFormData({...formData, sector: e.target.value as SectorType})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor={option.value}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantidade de REMOÇÕES */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quantidade de REMOÇÕES</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="car_removals" className="block text-sm font-medium text-gray-700 mb-2">
                      Carro(s)
                    </label>
                    <input
                      type="number"
                      id="car_removals"
                      min="0"
                      value={formData.car_removals}
                      onChange={(e) => setFormData({...formData, car_removals: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="motorcycle_removals" className="block text-sm font-medium text-gray-700 mb-2">
                      Moto(s)
                    </label>
                    <input
                      type="number"
                      id="motorcycle_removals"
                      min="0"
                      value={formData.motorcycle_removals}
                      onChange={(e) => setFormData({...formData, motorcycle_removals: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-center">
                {formError && (
                  <div className="text-red-500 mb-4">
                    {formError}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Salvar formulário
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Sidebar with transition */}
      <div
        className={`fixed inset-0 overflow-hidden z-50 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className={`fixed inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="relative w-96">
              <div className="h-full flex flex-col bg-white shadow-xl">
                {/* Header */}
                <div className="px-4 py-6 bg-gray-50 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Informe a infração</h2>
                    <button
                      type="button"
                      onClick={() => setIsSidebarOpen(false)}
                      className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="px-4 sm:px-6 py-6 space-y-6">
                    {/* Searchable Dropdown */}
                    <div ref={dropdownRef} className="relative">
                      <label htmlFor="infraction" className="block text-sm font-medium text-gray-700 mb-2">
                        Selecione a infração
                      </label>
                      <div className="relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setIsDropdownOpen(true);
                            }}
                            onClick={() => setIsDropdownOpen(true)}
                            placeholder="Pesquisar infração..."
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                        {isDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                            <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                              {filteredInfractions.map((infraction) => (
                                <li
                                  key={infraction}
                                  onClick={() => handleSelectInfraction(infraction)}
                                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 text-gray-900"
                                >
                                  {infraction}
                                </li>
                              ))}
                              {filteredInfractions.length === 0 && (
                                <li className="text-gray-500 select-none relative py-2 pl-3 pr-9">
                                  Nenhuma infração encontrada
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity Input */}
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                        Quantidade
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex-shrink-0 px-4 py-4 flex justify-end space-x-2 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setIsSidebarOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={handleAddInfraction}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
