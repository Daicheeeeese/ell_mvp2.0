import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ backgroundColor: '#00E5FF' }} className="border-b mt-0">
      <div style={{ padding: '0 64px' }} className="flex justify-between items-center">
        <Link href="/" className="text-white no-underline">
          <h1 className="text-2xl font-bold py-3 select-none">BBC English</h1>
        </Link>
        
        <nav>
          <Link 
            href="/reservations" 
            className="text-white hover:text-gray-200 no-underline"
          >
            My Reservations
          </Link>
        </nav>
      </div>
    </header>
  );
} 