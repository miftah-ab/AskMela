import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          404
        </h1>
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-gray-100">Page Not Found</h2>
          <p className="text-gray-400">
            Oops! The page you're looking for has drifted into deep space. 
            Let's get you back to safety.
          </p>
        </div>
        <div className="pt-8">
          <Link 
            href="/" 
            className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-600 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}