import { Zap, Brain, Shield } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Charge',
    description: '80% charge in less than 15 minutes with our global Hyper-Network.',
  },
  {
    icon: Brain,
    title: 'Neural Pilot',
    description: 'Level 4 autonomous driving powered by dual-core neural processors.',
  },
  {
    icon: Shield,
    title: 'Luxe Concierge',
    description: '24/7 priority support and doorstep maintenance for every owner.',
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
            >
              <div className="flex justify-center mb-6">
                <feature.icon className="h-16 w-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


