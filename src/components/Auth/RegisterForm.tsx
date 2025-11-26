import React, { useState } from 'react';
import { Sprout, Mail, Lock, User, MapPin, Eye, EyeOff, Briefcase, Truck, DollarSign, Weight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    farm: '',
    role: 'AGRICULTOR',
    pricePerKm: '',
    maxCapacity: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    const checkbox = document.getElementById('aviso') as HTMLInputElement;
    if (checkbox && !checkbox.checked) {
      setError('Debes aceptar el Aviso de Privacidad');
      return;
    }

    if (formData.role === 'AGRICULTOR' && !formData.farm) {
      setError('Debes ingresar el nombre de la finca');
      return;
    }

    if (formData.role === 'LOGISTICA') {
      if (!formData.pricePerKm || parseFloat(formData.pricePerKm) <= 0) {
        setError('Debes ingresar un precio por kilómetro válido');
        return;
      }
      if (!formData.maxCapacity || parseFloat(formData.maxCapacity) <= 0) {
        setError('Debes ingresar la capacidad máxima de tu vehículo');
        return;
      }
    }

    setIsLoading(true);

    // Pasamos los datos extra como un objeto de configuración
    const extraData = formData.role === 'LOGISTICA' ? {
      pricePerKm: parseFloat(formData.pricePerKm),
      maxCapacity: parseFloat(formData.maxCapacity)
    } : { farm: formData.farm };

    const success = await register(
      formData.name, 
      formData.email, 
      formData.password, 
      formData.role === 'AGRICULTOR' ? formData.farm : '', 
      formData.role,
      extraData // Necesitamos actualizar la función register en AuthContext para aceptar esto
    );

    if (!success) {
      setError('El correo electrónico ya está registrado o hubo un error');
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {formData.role === 'LOGISTICA' ? (
              <Truck size={48} className="text-blue-600" />
            ) : (
              <Sprout size={48} className="text-green-600" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
          <p className="text-gray-600 mt-2">
            {formData.role === 'LOGISTICA' ? 'Únete a nuestra red de transporte' : 'Únete a la revolución agrícola'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo / Empresa</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={formData.role === 'LOGISTICA' ? "Transportes Rápidos S.A." : "Juan Pérez"}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="contacto@empresa.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuario</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="AGRICULTOR">Soy Agricultor</option>
                <option value="COMPRADOR">Soy Comprador</option>
                <option value="LOGISTICA">Soy Empresa de Logística</option>
              </select>
            </div>
          </div>

          {formData.role === 'AGRICULTOR' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Finca</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="farm"
                  value={formData.farm}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Finca Los Naranjos"
                  required
                />
              </div>
            </div>
          )}

          {formData.role === 'LOGISTICA' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarifa por Km ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="pricePerKm"
                    value={formData.pricePerKm}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej. 15.50"
                    step="0.50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacidad (Ton)</label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="maxCapacity"
                    value={formData.maxCapacity}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej. 10"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-2 text-sm text-gray-700">
            <input
              type="checkbox"
              id="aviso"
              required
              className="mt-1"
            />
            <label htmlFor="aviso">
              Acepto el <a href="/aviso-privacidad" className="text-green-600 underline">Aviso de Privacidad</a>
            </label>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium ${
              formData.role === 'LOGISTICA' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onToggleForm}
              className={`font-medium ${formData.role === 'LOGISTICA' ? 'text-blue-600 hover:text-blue-700' : 'text-green-600 hover:text-green-700'}`}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;