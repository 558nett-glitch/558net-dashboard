import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard = ({ title, children }: ChartCardProps) => {
  const { isDark } = useTheme();
  return (
    <div className={cn(
      'rounded-2xl p-5 border',
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
    )}>
      <h3 className={cn('text-sm font-semibold mb-4', isDark ? 'text-white' : 'text-slate-900')}>
        {title}
      </h3>
      {children}
    </div>
  );
};

export const GrowthChart = ({ data }: { data: { month: string; count: number }[] }) => {
  const { isDark } = useTheme();
  const axisColor = isDark ? '#64748b' : '#94a3b8';

  return (
    <ChartCard title="📈 Pertumbuhan Pelanggan">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
          <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#fff',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              borderRadius: '8px',
              color: isDark ? '#fff' : '#0f172a',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorGrowth)"
            name="Pelanggan Baru"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export const PaymentPieChart = ({ data }: { data: { name: string; value: number; color: string }[] }) => {
  const { isDark } = useTheme();

  return (
    <ChartCard title="💳 Status Pembayaran">
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="60%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#fff',
                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-600')}>{item.name}</span>
              </div>
              <span className={cn('text-xs font-bold', isDark ? 'text-white' : 'text-slate-900')}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
};

export const PackageBarChart = ({ data }: { data: { name: string; value: number }[] }) => {
  const { isDark } = useTheme();
  const axisColor = isDark ? '#64748b' : '#94a3b8';

  return (
    <ChartCard title="📦 Paket Internet Terpopuler">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} horizontal={false} />
          <XAxis type="number" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: axisColor, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#fff',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="value" name="Pelanggan" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][i % 5]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export const StatusBarChart = ({ data }: { data: { name: string; value: number; color: string }[] }) => {
  const { isDark } = useTheme();
  const axisColor = isDark ? '#64748b' : '#94a3b8';

  return (
    <ChartCard title="👥 Status Pelanggan">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
          <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#fff',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', color: axisColor }} />
          <Bar dataKey="value" name="Jumlah" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
