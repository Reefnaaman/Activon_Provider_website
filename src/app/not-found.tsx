import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <AlertCircle className="h-24 w-24 text-gray-400 mx-auto mb-4" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Business Not Found
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          The business you're looking for doesn't exist or is not active.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
      </div>
    </main>
  );
}