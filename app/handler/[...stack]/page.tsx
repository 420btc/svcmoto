"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Star, Shield, Zap, Gift, Mail, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

type AuthMode = 'initial' | 'login' | 'register';

export default function AuthModal() {
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleGoogleAuth = () => {
    setLoading(true);
    
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/google/callback`;
    const scope = 'openid email profile';
    const responseType = 'code';
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=${responseType}`;
    
    window.location.href = googleAuthUrl;
  };

  const checkUserExists = async (email: string) => {
    try {
      const response = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking user:', error);
      return { exists: false };
    }
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      setError('Por favor ingresa tu email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCheck = await checkUserExists(email);
      
      if (userCheck.exists) {
        if (userCheck.user.authMethod === 'GOOGLE') {
          setError('Esta cuenta fue creada con Google. Por favor, inicia sesión con Google.');
          setLoading(false);
          return;
        }
        setAuthMode('login');
      } else {
        setAuthMode('register');
      }
    } catch (error) {
      setError('Error al verificar el usuario');
    }
    
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify({
          ...data.user,
          isAuthenticated: true,
          provider: 'email'
        }));
        
        localStorage.setItem('justConnected', 'true');
        localStorage.setItem('authAction', 'login');
        
        setSuccess('¡Inicio de sesión exitoso!');
        setTimeout(() => {
          router.push('/perfil');
        }, 1000);
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión');
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify({
          ...data.user,
          isAuthenticated: true,
          provider: 'email'
        }));
        
        localStorage.setItem('justConnected', 'true');
        localStorage.setItem('authAction', 'register');
        localStorage.setItem('isNewUser', 'true');
        
        setSuccess('¡Registro exitoso!');
        setTimeout(() => {
          router.push('/perfil');
        }, 1000);
      } else {
        setError(data.error || 'Error al registrarse');
      }
    } catch (error) {
      setError('Error de conexión');
    }

    setLoading(false);
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="w-full flex justify-center py-2 sm:py-4 min-h-full">
        <Card className="w-full max-w-lg relative max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="bangers-regular text-3xl text-blue-900 mb-2">
            {authMode === 'initial' && '¡Únete a SVC MOTO!'}
            {authMode === 'login' && '¡Bienvenido de vuelta!'}
            {authMode === 'register' && '¡Crea tu cuenta!'}
          </CardTitle>
          <p className="text-gray-600 text-lg">
            {authMode === 'initial' && 'Accede con Google o email y comienza tu aventura'}
            {authMode === 'login' && 'Inicia sesión en tu cuenta'}
            {authMode === 'register' && 'Completa tus datos para registrarte'}
          </p>
          {authMode !== 'initial' && (
            <Button
              variant="ghost"
              onClick={() => {
                setAuthMode('initial');
                setError('');
                setSuccess('');
                setEmail('');
                setPassword('');
                setName('');
                setPhone('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 mt-2"
            >
              ← Volver a opciones de acceso
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Mostrar errores y éxitos */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* Vista inicial */}
          {authMode === 'initial' && (
            <>
              {/* Google Auth Button */}
              <Button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full h-14 text-lg bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 hover:border-gray-400 shadow-md"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-3"></div>
                    Conectando...
                  </div>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuar con Google
                  </>
                )}
              </Button>
              
              {/* Separador */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">O continúa con email</span>
                </div>
              </div>
              
              {/* Email input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
                />
              </div>
              
              <Button
                onClick={handleEmailSubmit}
                disabled={loading || !email}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Verificando...' : 'Continuar'}
              </Button>
            </>
          )}

          {/* Vista de login */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          )}

          {/* Vista de registro */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono (opcional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Tu número de teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Crea una contraseña segura"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>
          )}
          
          {/* Beneficios de registrarse - Solo en vista inicial */}
          {authMode === 'initial' && (
            <div className="bg-orange-50 rounded-lg p-4 sm:p-6 mt-4 sm:mt-6">
              <h3 className="bangers-regular text-xl text-blue-900 mb-4 text-center">
                ¿Por qué registrarte?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-500 rounded-full p-2 mt-1">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Reservas Rápidas</h4>
                    <p className="text-sm text-gray-600">Reserva tu moto en segundos sin complicaciones</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-500 rounded-full p-2 mt-1">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Puntos y Descuentos</h4>
                    <p className="text-sm text-gray-600">Gana puntos por cada alquiler y obtén descuentos exclusivos</p>
                  </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 rounded-full p-2 mt-1">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Seguro Incluido</h4>
                  <p className="text-sm text-gray-600">Todos nuestros vehículos incluyen seguro completo</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 rounded-full p-2 mt-1">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">100% Eléctrico</h4>
                  <p className="text-sm text-gray-600">Contribuye al medio ambiente con nuestros vehículos eléctricos</p>
                </div>
              </div>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Al continuar, aceptas nuestros términos y condiciones
            </p>
            {/* Acceso discreto al panel admin */}
            <button
              onClick={() => router.push('/admin/verification')}
              className="mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              title="Panel de administración"
            >
              ⚙️
            </button>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}