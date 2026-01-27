'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current && !videoError) {
      const video = videoRef.current;
      video.play().catch((error) => {
        console.log('Video autoplay prevented:', error);
        setVideoError(true);
      });
    }
  }, [videoError]);

  const videoUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || '/hero-video.mp4';

  return (
    <div className="relative w-full overflow-hidden">
      {/* Main Hero Section */}
      <div className="relative h-[85vh] min-h-[600px]">
        {/* Dark top bar */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-slate-900 z-10"></div>

      {/* Background Video */}
        <div className="absolute inset-0">
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
              onError={() => setVideoError(true)}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1492144534651-402be22a8c90?w=1920&h=1080&fit=crop')`
              }}
            />
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          </div>

        {/* Center Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed mb-4 italic">
            "Trải nghiệm xe hơi đẳng cấp với BiMax - nơi mọi hành trình đều là một trải nghiệm đặc biệt. Chúng tôi cam kết mang đến những chiếc xe chất lượng nhất với giá tốt nhất."
          </p>
          <p className="text-amber-400 text-sm mb-8 font-medium">
            — Đội ngũ BiMax Auto Motors
          </p>
          <Link
            href="/cars"
            className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-amber-400 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Khám phá ngay
          </Link>
      </div>

        {/* Curved Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <svg
            viewBox="0 0 1440 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-[140px]"
            preserveAspectRatio="none"
          >
            <path
              d="M0 140H1440V70C1200 25 900 10 720 18C520 28 260 65 0 90V140Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </div>

      {/* Partners Section */}
      <div className="bg-slate-50 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-slate-500 text-sm italic mb-12">Đối tác của chúng tôi</p>
          <div className="flex items-center justify-center gap-16 flex-wrap">
            <div className="relative w-40 h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
              <Image
                src="/imgs/logo toyota.png"
                alt="Toyota"
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
            <div className="relative w-40 h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
              <Image
                src="/imgs/logo honda.png"
                alt="Honda"
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
            <div className="relative w-40 h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
              <Image
                src="/imgs/logo audi.jpg"
                alt="Audi"
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
            <div className="relative w-40 h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
              <Image
                src="/imgs/logo bmw.png"
                alt="BMW"
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
            <div className="relative w-40 h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
              <Image
                src="/imgs/logo mec.jpg"
                alt="Mercedes"
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
