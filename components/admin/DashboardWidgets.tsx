'use client';

import { memo } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, Users, DollarSign, Target } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  period: string;
  icon: React.ReactNode;
  color: string;
}

export const KPICard = memo(function KPICard({ title, value, change, changeType, period, icon, color }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative z-0">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        {changeType === 'up' ? (
          <ArrowUp className="w-5 h-5 text-emerald-500" />
        ) : (
          <ArrowDown className="w-5 h-5 text-red-500" />
        )}
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="flex items-center gap-2 text-sm">
        <span className={changeType === 'up' ? 'text-emerald-500' : 'text-red-500'}>
          {changeType === 'up' ? '↑' : '↓'}
          {change}
        </span>
        <span className="text-slate-500">so với {period}</span>
      </div>
      <div className="text-sm text-slate-500 mt-2">{title}</div>
    </div>
  );
});

export const RevenueChart = memo(function RevenueChart() {
  const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
  const data = [45, 52, 48, 61, 55, 67, 72, 68, 75, 80, 85, 90];
  const maxValue = Math.max(...data);

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative z-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Doanh thu</h3>
          <div className="text-2xl font-bold text-slate-900">$32.209</div>
          <div className="text-sm text-emerald-500">+22% so với tháng trước</div>
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer relative z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-2 mb-6">
        {['1D', '1W', '1M', '6M', '1Y', 'ALL'].map((period) => (
          <button
            key={period}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition cursor-pointer relative z-10 ${
              period === '1Y'
                ? 'bg-purple-100 text-purple-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {period}
          </button>
        ))}
      </div>
      <div className="h-48 flex items-end gap-2">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="relative w-full h-full flex items-end">
              <div
                className="w-full bg-slate-200 rounded-t"
                style={{ height: `${(value / maxValue) * 100}%` }}
              >
                <div
                  className="w-full bg-purple-600 rounded-t"
                  style={{ height: '60%' }}
                ></div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">{months[index]}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

export const CalendarWidget = memo(function CalendarWidget() {
  const currentDate = new Date();
  const month = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dates = [5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative z-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Lịch</h3>
        <button className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer relative z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-900">{month}</h4>
        <div className="flex gap-2">
          <button className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer relative z-10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer relative z-10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map((day) => (
          <div key={day} className="text-center text-xs text-slate-500 font-medium">
            {day}
          </div>
        ))}
        {dates.map((date) => (
          <div
            key={date}
            className={`text-center py-2 rounded-lg ${
              date === 8
                ? 'bg-purple-100 text-purple-600 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {date}
          </div>
        ))}
      </div>
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-900">Mesh Weekly Meeting</div>
            <div className="text-xs text-slate-500">9.00 am - 10.00 am</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 bg-gradient-to-br from-purple-400 to-amber-400 rounded-full border-2 border-white"
                  ></div>
                ))}
              </div>
              <span className="text-xs text-slate-500">+7</span>
              <a href="#" className="text-xs text-purple-600 hover:underline">
                On Google Meet
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-900">Gamification Demo</div>
            <div className="text-xs text-slate-500">10.45 am - 11.45 am</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex -space-x-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full border-2 border-white"
                  ></div>
                ))}
              </div>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                On Slack
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const LeadsManagement = memo(function LeadsManagement() {
  const leads = [
    { name: 'Đủ điều kiện', value: 85, color: 'bg-purple-600' },
    { name: 'Đã liên hệ', value: 65, color: 'bg-purple-500' },
    { name: 'Mất', value: 25, color: 'bg-purple-400' },
    { name: 'Thành công', value: 70, color: 'bg-purple-600' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative z-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Quản lý khách hàng tiềm năng</h3>
        <button className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer relative z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      <div className="flex gap-4 mb-6">
        {['Trạng thái', 'Nguồn', 'Chất lượng'].map((tab, index) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer relative z-10 ${
              index === 0
                ? 'bg-purple-100 text-purple-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {leads.map((lead) => (
          <div key={lead.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">{lead.name}</span>
              <span className="text-sm text-slate-500">{lead.value}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className={`${lead.color} h-3 rounded-full transition-all`}
                style={{ width: `${lead.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export const TopCountry = memo(function TopCountry() {
  const countries = [
    { name: 'Australia', percentage: 48 },
    { name: 'Malaysia', percentage: 33 },
    { name: 'Indonesia', percentage: 25 },
    { name: 'Singapore', percentage: 17 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative z-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Quốc gia hàng đầu</h3>
        <button className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer relative z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      <div className="mb-6">
        {/* Simple map representation */}
        <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {/* Simplified map shapes */}
            <path
              d="M20 30 L40 25 L50 40 L35 50 Z"
              fill="purple"
              opacity="0.6"
            />
            <path
              d="M60 20 L80 15 L90 35 L75 45 Z"
              fill="purple"
              opacity="0.5"
            />
            <path
              d="M100 25 L120 20 L130 40 L115 50 Z"
              fill="purple"
              opacity="0.4"
            />
            <path
              d="M140 30 L160 25 L170 45 L155 55 Z"
              fill="purple"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>
      <div className="space-y-3">
        {countries.map((country, index) => (
          <div key={country.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-500">{index + 1}.</span>
              <span className="text-sm font-medium text-slate-700">{country.name}</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">{country.percentage}%</span>
          </div>
        ))}
      </div>
      <a href="#" className="block text-sm text-purple-600 hover:underline mt-4">
        View more →
      </a>
    </div>
  );
});

export const RetentionRate = memo(function RetentionRate() {
  const categories = [
    { name: 'Doanh nghiệp vừa và nhỏ', color: 'bg-purple-600' },
    { name: 'Khởi nghiệp', color: 'bg-blue-500' },
    { name: 'Doanh nghiệp lớn', color: 'bg-purple-800' },
  ];
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [
    [60, 65, 70, 75, 80, 85, 90],
    [20, 18, 15, 12, 10, 8, 5],
    [15, 12, 10, 8, 5, 2, 0],
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative z-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Tỷ lệ giữ chân</h3>
          <div className="text-2xl font-bold text-slate-900">95%</div>
          <div className="text-sm text-emerald-500">+12% so với tháng trước</div>
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer relative z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-4 mb-6">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
            <span className="text-sm text-slate-600">{cat.name}</span>
          </div>
        ))}
      </div>
      <div className="h-48 flex items-end gap-2">
        {months.map((month, monthIndex) => (
          <div key={month} className="flex-1 flex flex-col items-center">
            <div className="relative w-full h-full flex flex-col-reverse">
              {data.map((values, catIndex) => (
                <div
                  key={catIndex}
                  className={`${categories[catIndex].color} w-full rounded-t`}
                  style={{ height: `${values[monthIndex]}%` }}
                ></div>
              ))}
            </div>
            <div className="text-xs text-slate-500 mt-2">{month}</div>
          </div>
        ))}
      </div>
    </div>
  );
});
