"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Star, Shield, Zap, Gift } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const [loading, setLoading] = useState(false);
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

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg relative">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <CardHeader className="text-center pb-6">
          <CardTitle className="bangers-regular text-3xl text-blue-900 mb-2">
            ¡Únete a SVC MOTO!
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Accede con Google y comienza tu aventura
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Google Auth Button - Más grande */}
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
          
          {/* Beneficios de registrarse */}
          <div className="bg-orange-50 rounded-lg p-6 mt-6">
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
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Al continuar, aceptas nuestros términos y condiciones
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}