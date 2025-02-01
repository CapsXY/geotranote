import React, { useState, useRef, useEffect } from 'react';
import { ClipboardList, Plus, X, Search } from 'lucide-react';

type ServiceType = 'ordinario' | 'operacao' | 'ras';
type SectorType = 'primeiro' | 'segundo' | 'terceiro_quarto' | 'outros';

interface Infraction {
  type: string;
  quantity: number;
}

interface FormData {
  responsibleName: string;
  serviceType: ServiceType;
  sector: SectorType;
  infractions: Infraction[];
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    responsibleName: '',
    serviceType: 'ordinario',
    sector: 'primeiro',
    infractions: []
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedInfraction, setSelectedInfraction] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sample infractions for the dropdown
  const infractionOptions = [
    'Ausência de licença ambiental',
    'Descarte irregular de resíduos',
    'Poluição sonora'
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Formulário salvo com sucesso!');
  };

  const handleAddInfraction = () => {
    if (selectedInfraction && quantity > 0) {
      setFormData({
        ...formData,
        infractions: [...formData.infractions, { type: selectedInfraction, quantity }]
      });
      setSelectedInfraction('');
      setSearchTerm('');
      setQuantity(1);
      setIsSidebarOpen(false);
    }
  };

  const handleSelectInfraction = (infraction: string) => {
    setSelectedInfraction(infraction);
    setSearchTerm(infraction);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <ClipboardList className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">GEOTRANOTE</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome do responsável */}
              <div>
                <label 
                  htmlFor="responsibleName" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nome do responsável
                </label>
                <input
                  type="text"
                  id="responsibleName"
                  value={formData.responsibleName}
                  onChange={(e) => setFormData({...formData, responsibleName: e.target.value})}
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
                        name="serviceType"
                        value={option.value}
                        checked={formData.serviceType === option.value}
                        onChange={(e) => setFormData({...formData, serviceType: e.target.value as ServiceType})}
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
                    { value: 'primeiro', label: '1º Distrito' },
                    { value: 'segundo', label: '2º Distrito' },
                    { value: 'terceiro_quarto', label: '3º e 4º Distrito' },
                    { value: 'outros', label: 'Outros' }
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

              {/* Infrações */}
              <div>
                <h2 className="text-sm font-medium text-gray-700 mb-4">Tipos de infrações</h2>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Adicionar infração
                </button>

                {/* Grid de infrações */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Header do grid */}
                  <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
                    <div className="px-4 py-3 text-sm font-medium text-gray-700">
                      Infração
                    </div>
                    <div className="px-4 py-3 text-sm font-medium text-gray-700 text-right">
                      Quantidade
                    </div>
                  </div>

                  {/* Conteúdo do grid */}
                  {formData.infractions.length > 0 ? (
                    formData.infractions.map((infraction, index) => (
                      <div 
                        key={index} 
                        className="grid grid-cols-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="px-4 py-3 text-sm text-gray-900">
                          {infraction.type}
                        </div>
                        <div className="px-4 py-3 text-sm text-gray-900 text-right">
                          {infraction.quantity}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-gray-500 bg-gray-50 bg-opacity-50">
                      Nenhuma infração registrada
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
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