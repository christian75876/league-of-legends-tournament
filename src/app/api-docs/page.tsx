'use client';

import 'swagger-ui-react/swagger-ui.css';
import swaggerSpec from '../../../swagger.json';
import dynamic from 'next/dynamic';
import { div } from 'framer-motion/client';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-lg text-gray-600">Cargado documentació API...</p>
    </div>
  ),
});

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">API Documentation</h1>
          <p className="mt-2 text-gray-600">
            Documentación completa de la API del Torneo de League of Legends
          </p>
        </header>
        <div className="rounded-lg bg-white shadow-sm">
          <SwaggerUI spec={swaggerSpec} docExpansion="list" defaultModelExpandDepth={1} />
        </div>
      </div>
    </div>
  );
}
