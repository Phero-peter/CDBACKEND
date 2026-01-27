import Link from 'next/link';
import { ArrowRight, Globe, Settings, Plus } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Logo size="lg" />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Đem đến trải nghiệm xe hơi tốt nhất cho bạn. Chất lượng - Uy tín - Giá tốt.
            </p>
          </div>

          {/* Models */}
          <div>
            <h3 className="font-semibold mb-4 uppercase tracking-wider">MODELS</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/cars" className="hover:text-blue-600 transition">
                  Shadow GT
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-blue-600 transition">
                  Spectre E
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-blue-600 transition">
                  Zenith
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 uppercase tracking-wider">COMPANY</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/about" className="hover:text-blue-600 transition">
                  Innovations
                </Link>
              </li>
              <li>
                <Link href="/showrooms" className="hover:text-blue-600 transition">
                  Showrooms
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-blue-600 transition">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Stay Tuned */}
          <div>
            <h3 className="font-semibold mb-4 uppercase tracking-wider">STAY TUNED</h3>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 bg-slate-50 border border-slate-200 rounded px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            © 2024 BiMax Auto Motors. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button className="text-slate-400 hover:text-blue-600 transition">
              <Globe className="h-5 w-5" />
            </button>
            <button className="text-slate-400 hover:text-blue-600 transition">
              <Settings className="h-5 w-5" />
            </button>
            <button className="text-slate-400 hover:text-blue-600 transition">
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}


