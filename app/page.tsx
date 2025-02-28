'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Theme context for dark mode
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

// TypeScript interfaces
interface OverviewData {
  totalRuns: number;
  totalMiles: number;
  totalPtcActiveMiles: number;
  totalPtcActivePercentage: number;
  totalEnforcements: number;
  totalFaults: number;
  totalInits: number;
  totalCutOutTrips: number;
}

interface ChartDataItem {
  name: string;
  value: number;
}

interface DashboardData {
  overview: OverviewData;
  topLocosByMiles: ChartDataItem[];
  topLocosByRuns: ChartDataItem[];
  bottomByPtcPercentage: ChartDataItem[];
  ptcPercentageDistribution: ChartDataItem[];
  runCountDistribution: ChartDataItem[];
  initsDistribution: ChartDataItem[];
  enforcementsDistribution: ChartDataItem[];
}

interface MetricCardProps {
  title: string;
  value: string | number;
  color: string;
  bgColor: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  color, 
  bgColor, 
  icon, 
  trend 
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl border-l-4 ${color} metric-card`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h2>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`${bgColor} p-3 rounded-full`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

// Theme Provider Component
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
    
    // Apply dark mode class to body
    if (prefersDarkMode) {
      document.body.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Sidebar Component
const Sidebar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  
  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} w-64 fixed h-full p-5 transition-all duration-200`}>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-xl font-bold">MARC PTC Dashboard</h1>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <nav>
        <ul className="space-y-2">
          <li>
            <a href="#" className={`flex items-center p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}>
              <span className="mr-3">📊</span>
              <span>Overview</span>
            </a>
          </li>
          <li>
            <a href="#" className={`flex items-center p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}>
              <span className="mr-3">🚂</span>
              <span>Locomotives</span>
            </a>
          </li>
          <li>
            <a href="#" className={`flex items-center p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}>
              <span className="mr-3">⚠️</span>
              <span>Faults</span>
            </a>
          </li>
          <li>
            <a href="#" className={`flex items-center p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}>
              <span className="mr-3">📝</span>
              <span>Reports</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

// Chart Container Component
interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-200`}>
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      {children}
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
    <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading dashboard data...</p>
  </div>
);

// Error Display Component
interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-lg mb-4">
      <div className="flex items-center">
        <span className="text-2xl mr-2">⚠️</span>
        <p className="font-bold">Error</p>
      </div>
      <p>{message}</p>
    </div>
    <button 
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      onClick={() => window.location.reload()}
    >
      Retry
    </button>
  </div>
);

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real Next.js app, you would likely fetch this from an API endpoint
        // For this example, we're simulating the data fetch
        
        // In production, you would use something like:
        // const response = await fetch('/api/ptc-data');
        // const jsonData = await response.json();
        
        // Simulated data for this example
        setData({
          overview: {
            totalRuns: 144,
            totalMiles: 4645.7,
            totalPtcActiveMiles: 4527.98,
            totalPtcActivePercentage: 97.47,
            totalEnforcements: 3,
            totalFaults: 3928,
            totalInits: 162,
            totalCutOutTrips: 216
          },
          topLocosByMiles: [
            { name: "MARC 7850", value: 194.49 },
            { name: "MARC 7851", value: 191.52 },
            { name: "MARC 7761", value: 170.53 },
            { name: "MARC 21", value: 168.46 },
            { name: "MARC 7849", value: 155.25 },
            { name: "MARC 7855", value: 132.06 },
            { name: "MARC 8056", value: 129.97 },
            { name: "MARC 80", value: 129.26 },
            { name: "MARC 34", value: 129.19 },
            { name: "MARC 7757", value: 128.87 }
          ],
          topLocosByRuns: [
            { name: "MARC 8056", value: 7 },
            { name: "MARC 8058", value: 7 },
            { name: "MARC 7851", value: 6 },
            { name: "MARC 8045", value: 6 },
            { name: "MARC 8049", value: 6 },
            { name: "MARC 11", value: 5 },
            { name: "MARC 7850", value: 5 },
            { name: "MARC 7852", value: 5 },
            { name: "MARC 7855", value: 5 },
            { name: "MARC 17", value: 4 }
          ],
          bottomByPtcPercentage: [
            { name: "MARC 8058", value: 85.1 },
            { name: "MARC 8050", value: 91.47 },
            { name: "MARC 8049", value: 92.6 },
            { name: "MARC 8045", value: 93.05 },
            { name: "MARC 8046", value: 93.79 },
            { name: "MARC 32", value: 93.82 },
            { name: "MARC 17", value: 94.22 },
            { name: "MARC 7759", value: 94.81 },
            { name: "MARC 8054", value: 94.94 },
            { name: "MARC 7760", value: 95.04 }
          ],
          ptcPercentageDistribution: [
            { name: "90-95%", value: 8 },
            { name: "95-97%", value: 7 },
            { name: "97-99%", value: 18 },
            { name: "99-100%", value: 14 }
          ],
          runCountDistribution: [
            { name: "1 run", value: 7 },
            { name: "2 runs", value: 16 },
            { name: "3 runs", value: 11 },
            { name: "4 runs", value: 5 },
            { name: "5+ runs", value: 9 }
          ],
          initsDistribution: [
            { name: "Successful", value: 121 },
            { name: "Failed", value: 18 },
            { name: "Incomplete", value: 23 }
          ],
          enforcementsDistribution: [
            { name: "Predictive", value: 1 },
            { name: "Reactive", value: 2 },
            { name: "Emergency", value: 0 }
          ]
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update the colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const PTC_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6']; // Red to Blue gradient for PTC metrics
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} />;
  }

  if (!data) {
    return <ErrorDisplay message="No data available" />;
  }

  return (
    <ThemeProvider>
      <div className="bg-gray-50 dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-200">
        <Sidebar />
        
        <div className="ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold">
                Daily Report - February 26, 2025
              </h1>
              <div className="flex space-x-2">
                <button className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center">
                  <span className="mr-2">📥</span>
                  Export
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200 flex items-center">
                  <span className="mr-2">🔄</span>
                  Refresh Data
                </button>
              </div>
            </div>
            
            {/* Summary Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-wrap gap-4 justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Daily Summary</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Overall system performance: <span className="font-bold text-green-500">{data.overview.totalPtcActivePercentage}%</span>
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Inactive</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Faults</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Key Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard 
                title="Total Runs" 
                value={data.overview.totalRuns} 
                color="bg-blue-100" 
                bgColor="bg-blue-50"
                icon={<span className="text-blue-500">🚂</span>}
              />
              <MetricCard 
                title="Total Miles" 
                value={data.overview.totalMiles.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                color="bg-green-100" 
                bgColor="bg-green-50"
                icon={<span className="text-green-500">🌍</span>}
              />
              <MetricCard 
                title="PTC Active Miles" 
                value={data.overview.totalPtcActiveMiles.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                color="bg-indigo-100" 
                bgColor="bg-indigo-50"
                icon={<span className="text-indigo-500">🚋</span>}
              />
              <MetricCard 
                title="PTC Active %" 
                value={`${data.overview.totalPtcActivePercentage}%`} 
                color="bg-purple-100" 
                bgColor="bg-purple-50"
                icon={<span className="text-purple-500">🚋</span>}
              />
              <MetricCard 
                title="Total Enforcements" 
                value={data.overview.totalEnforcements} 
                color="bg-red-100" 
                bgColor="bg-red-50"
                icon={<span className="text-red-500">🚂</span>}
              />
              <MetricCard 
                title="Total Faults" 
                value={data.overview.totalFaults.toLocaleString()} 
                color="bg-yellow-100" 
                bgColor="bg-yellow-50"
                icon={<span className="text-yellow-500">🚂</span>}
              />
              <MetricCard 
                title="Total Initializations" 
                value={data.overview.totalInits} 
                color="bg-teal-100" 
                bgColor="bg-teal-50"
                icon={<span className="text-teal-500">🚂</span>}
              />
              <MetricCard 
                title="Cut Out Trips" 
                value={data.overview.totalCutOutTrips} 
                color="bg-orange-100" 
                bgColor="bg-orange-50"
                icon={<span className="text-orange-500">🚂</span>}
              />
            </div>
            
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Top 10 Locomotives by Miles */}
              <ChartContainer title="Top 10 Locomotives by Miles">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.topLocosByMiles} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                    <XAxis type="number" className="dark:text-gray-400" />
                    <YAxis dataKey="name" type="category" width={80} className="dark:text-gray-400" />
                    <Tooltip 
                      formatter={(value: number) => value.toFixed(2)} 
                      contentStyle={{ 
                        backgroundColor: 'var(--tooltip-bg)',
                        borderColor: 'var(--tooltip-border)',
                        color: 'var(--tooltip-text)'
                      }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" name="Miles" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Top 10 Locomotives by Runs */}
              <ChartContainer title="Top 10 Locomotives by Runs">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.topLocosByRuns} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                    <XAxis type="number" className="dark:text-gray-400" />
                    <YAxis dataKey="name" type="category" width={80} className="dark:text-gray-400" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--tooltip-bg)',
                        borderColor: 'var(--tooltip-border)',
                        color: 'var(--tooltip-text)'
                      }}
                    />
                    <Bar dataKey="value" fill="#10b981" name="Runs" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* PTC Active Percentage Distribution */}
              <ChartContainer title="PTC Active Percentage Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.ptcPercentageDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.ptcPercentageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PTC_COLORS[index % PTC_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => value} 
                      contentStyle={{ 
                        backgroundColor: 'var(--tooltip-bg)',
                        borderColor: 'var(--tooltip-border)',
                        color: 'var(--tooltip-text)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Bottom 10 Locomotives by PTC Active Percentage */}
              <ChartContainer title="Bottom 10 Locomotives by PTC Active %">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.bottomByPtcPercentage} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                    <XAxis type="number" domain={[80, 100]} className="dark:text-gray-400" />
                    <YAxis dataKey="name" type="category" width={80} className="dark:text-gray-400" />
                    <Tooltip 
                      formatter={(value: number) => value.toFixed(2) + '%'} 
                      contentStyle={{ 
                        backgroundColor: 'var(--tooltip-bg)',
                        borderColor: 'var(--tooltip-border)',
                        color: 'var(--tooltip-text)'
                      }}
                    />
                    <Bar dataKey="value" fill="#f97316" name="PTC Active %" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            {/* Charts Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Run Count Distribution */}
              <ChartContainer title="Run Count Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.runCountDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.runCountDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => value} 
                      contentStyle={{ 
                        backgroundColor: 'var(--tooltip-bg)',
                        borderColor: 'var(--tooltip-border)',
                        color: 'var(--tooltip-text)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Initialization Distribution */}
              <ChartContainer title="Initialization Results">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.initsDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#4CAF50" /> {/* Successful */}
                      <Cell fill="#F44336" /> {/* Failed */}
                      <Cell fill="#FFC107" /> {/* Incomplete */}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => value} 
                      contentStyle={{ 
                        backgroundColor: 'var(--tooltip-bg)',
                        borderColor: 'var(--tooltip-border)',
                        color: 'var(--tooltip-text)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Enforcement Distribution */}
              <ChartContainer title="Enforcements by Type">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.enforcementsDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                    <XAxis dataKey="name" className="dark:text-gray-400" />
                    <YAxis className="dark:text-gray-400" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--tooltip-bg)',
                        borderColor: 'var(--tooltip-border)',
                        color: 'var(--tooltip-text)'
                      }}
                    />
                    <Bar dataKey="value" fill="#8884d8" name="Count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            {/* Summary of Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all duration-200">
              <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Overall PTC system performance is high with 97.47% PTC active miles across all runs.</li>
                <li>MARC locomotive 8058 has the lowest PTC active percentage at 85.1%, indicating potential issues.</li>
                <li>Most locomotives (32 out of 48) maintain PTC active percentages above 97%.</li>
                <li>Only 3 enforcements occurred during this reporting period, with 2 being reactive and 1 predictive.</li>
                <li>There were 3,928 total faults recorded, indicating areas for potential system improvements.</li>
                <li>Initialization success rate is 74.69%, with 18 failed and 23 incomplete initializations.</li>
                <li>Locomotives 8056 and 8058 had the highest number of runs (7 each).</li>
                <li>Locomotive 7850 traveled the most miles (194.49) with an excellent PTC active percentage of 99.04%.</li>
              </ul>
            </div>
            
            {/* Footer */}
            <footer className="text-center text-gray-500 dark:text-gray-400 pb-8">
              <p>© 2025 MARC PTC Monitoring System. All rights reserved.</p>
              <p className="text-sm mt-2">Data refreshed: February 26, 2025 at 11:59 PM</p>
            </footer>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;