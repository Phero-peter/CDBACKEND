import Hero from '@/components/home/Hero';
import NewArrivals from '@/components/home/NewArrivals';

export default function HomePage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <Hero />
      <NewArrivals />
    </div>
  );
}


