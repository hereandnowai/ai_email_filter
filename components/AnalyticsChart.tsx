import React, { useContext } from 'react';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { AnalyticsChartData, AppTheme } from '../types';
import { ThemeContext } from '../contexts';
import { ACCENT_COLOR_DETAILS } from '../constants';


interface AnalyticsChartProps {
  data: AnalyticsChartData[];
  type: 'bar' | 'pie';
  title: string;
  colors?: string[]; // For Pie chart
}

const DEFAULT_PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899']; // blue, green, yellow, red, indigo, pink

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, type, title, colors = DEFAULT_PIE_COLORS }) => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) throw new Error("ThemeContext not found");
  const { theme, accentColor } = themeContext; // Use theme from context
  const accentDetails = ACCENT_COLOR_DETAILS[accentColor];

  const barFillColor = accentDetails.barFill;

  const isDark = theme === AppTheme.Dark;

  const tooltipBgColor = isDark ? 'rgba(55, 65, 81, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const tooltipBorderColor = isDark ? '#4B5563' : '#E5E7EB';
  const tooltipLabelColor = isDark ? '#F3F4F6' : '#1F2937';
  const tooltipItemColor = isDark ? '#D1D5DB' : '#4B5563';
  const axisTickColor = isDark ? '#9CA3AF' : '#6B7280';
  const legendTextColor = isDark ? '#D1D5DB' : '#4B5563';
  const labelStyleColor = isDark ? '#D1D5DB' : '#4B5563';

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, x, y } = props;
    const RADIAN = Math.PI / 180;
    // const radius = innerRadius + (outerRadius - innerRadius) * 0.5; // label position inside slice
    const radius = outerRadius + 15; // label position outside slice
    const lx = cx + radius * Math.cos(-midAngle * RADIAN);
    const ly = cy + radius * Math.sin(-midAngle * RADIAN);
    const labelText = `${name} (${(percent * 100).toFixed(0)}%)`;

    return (
      <text
        x={lx}
        y={ly}
        fill={labelStyleColor}
        textAnchor={lx > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="0.75rem" // Slightly smaller font for labels
      >
        {labelText}
      </text>
    );
  };


  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="name" tick={{ fill: axisTickColor }} className="text-xs" />
              <YAxis tick={{ fill: axisTickColor }} className="text-xs" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: tooltipBgColor, 
                  borderColor: tooltipBorderColor,
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                }}
                labelStyle={{ color: tooltipLabelColor, fontWeight: 'bold' }}
                itemStyle={{ color: tooltipItemColor }} 
              />
              <Legend wrapperStyle={{ fontSize: '0.8rem', color: legendTextColor, paddingTop: '10px' }} />
              <Bar dataKey="value" fill={barFillColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart margin={{ top: 5, right: 5, bottom: 30, left: 5 }}> {/* Added bottom margin for legend */}
              <Pie
                data={data}
                cx="50%"
                cy="45%" // Adjust cy to make space for legend
                labelLine={true} // Enable label lines
                outerRadius={80} // Adjust radius
                fill="#8884d8" // Default fill, overridden by Cell
                dataKey="value"
                nameKey="name"
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ 
                  backgroundColor: tooltipBgColor, 
                  borderColor: tooltipBorderColor,
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                }}
                labelStyle={{ color: tooltipLabelColor, fontWeight: 'bold' }}
                itemStyle={{ color: tooltipItemColor }} 
              />
              <Legend wrapperStyle={{ fontSize: '0.75rem', color: legendTextColor, paddingTop: '10px' }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;