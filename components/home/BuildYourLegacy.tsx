'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

export default function BuildYourLegacy() {
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedPack, setSelectedPack] = useState('standard');

  const colors = [
    { name: 'blue', value: '#3b82f6' },
    { name: 'white', value: '#ffffff' },
    { name: 'gray', value: '#4b5563' },
    { name: 'black', value: '#000000' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold mb-16 text-slate-900">
          BUILD YOUR LEGACY
          <div className="w-32 h-1 bg-blue-500 mt-4"></div>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-sm text-slate-500 mb-4">01. CHASSIS FINISH:</div>
              <div className="flex gap-4">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? 'border-blue-500 scale-110'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                    style={{ backgroundColor: color.value }}
                  >
                    {selectedColor === color.name && (
                      <Check className="h-6 w-6 text-slate-900 mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-sm text-slate-500 mb-4">02. PERFORMANCE PACK:</div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pack"
                    value="standard"
                    checked={selectedPack === 'standard'}
                    onChange={(e) => setSelectedPack(e.target.value)}
                    className="w-5 h-5 text-blue-500"
                  />
                  <span className="text-slate-900">Standard Dual Motor</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pack"
                    value="insane"
                    checked={selectedPack === 'insane'}
                    onChange={(e) => setSelectedPack(e.target.value)}
                    className="w-5 h-5 text-blue-500"
                  />
                  <span className="text-slate-900">Insane Mode (Tri-Motor)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Center - Car Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full h-64 md:h-96">
              <Image
                src="https://images.unsplash.com/photo-1492144534651-402be22a8c90?w=800&h=600&fit=crop"
                alt="Custom Car"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Right Panel - Price & Specs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="mb-6">
              <div className="text-sm text-slate-500 mb-2">ESTIMATED PRICE</div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-slate-900">$184,500</span>
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">READY TO SHIP</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-sm text-slate-500 mb-1">0-60 MPH</div>
                <div className="text-2xl font-bold text-slate-900">2.1s</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">TOP SPEED</div>
                <div className="text-2xl font-bold text-slate-900">205 MPH</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">RANGE</div>
                <div className="text-2xl font-bold text-slate-900">420 mi</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">DRIVE</div>
                <div className="text-2xl font-bold text-slate-900">AWD</div>
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white py-4 font-semibold rounded-xl hover:bg-slate-800 transition-colors">
              RESERVE NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


