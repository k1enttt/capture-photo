'use client';
export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen flex-col space-y-4">
      <h1 className="text-2xl font-bold">A simple photo capture website</h1>
      <button 
        className="w-40 h-10 bg-yellow-400 rounded-md transform transition-all duration-200 hover:translate-x-1 hover:translate-y-[-0.25rem] hover:shadow-lg hover:shadow-slate-300"
        onClick={() => window.location.href = '/capture'}
      >
        Let&apos;s say cheers!
      </button>
    </div>
  );
}
