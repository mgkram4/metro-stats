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
  allLocomotives: LocomotiveData[];
  faultDetails: FaultData[];
  hourlyActivity: HourlyData[];
  trainRoutes: TrainRouteData[];
  initializationLogs: InitializationLog[];
  geographicData: GeographicPoint[];
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
const Sidebar: React.FC<{ onSectionChange: (section: string) => void }> = ({ onSectionChange }) => {
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
            <button onClick={() => onSectionChange('overview')} className={`w-full flex items-center p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}>
              <span className="mr-3">📊</span>
              <span>Overview</span>
            </button>
          </li>
          <li>
            <button onClick={() => onSectionChange('locomotives')} className={`w-full flex items-center p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}>
              <span className="mr-3">🚂</span>
              <span>Locomotives</span>
            </button>
          </li>
          <li>
            <button onClick={() => onSectionChange('faults')} className={`w-full flex items-center p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}>
              <span className="mr-3">⚠️</span>
              <span>Faults</span>
            </button>
          </li>
          <li>
            <button onClick={() => onSectionChange('reports')} className={`w-full flex items-center p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}>
              <span className="mr-3">📝</span>
              <span>Reports</span>
            </button>
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

// New interfaces for detailed data
interface LocomotiveData {
  id: string;
  runs: number;
  miles: number;
  ptcActiveMiles: number;
  ptcActivePercentage: number;
  faults: number;
  enforcements: number;
  initializations: number;
  cutOutTrips: number;
}

interface FaultData {
  id: number;
  locomotive: string;
  timestamp: string;
  faultCode: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  resolved: boolean;
}

interface HourlyData {
  hour: number;
  activeRuns: number;
  totalMiles: number;
  ptcActiveMiles: number;
  faults: number;
  enforcements: number;
}

interface TrainRouteData {
  routeId: string;
  routeName: string;
  locomotives: string[];
  totalRuns: number;
  totalMiles: number;
  ptcActivePercentage: number;
  faults: number;
}

interface InitializationLog {
  id: number;
  locomotive: string;
  timestamp: string;
  status: 'Successful' | 'Failed' | 'Incomplete';
  duration: number;
  faultCodes: string[];
}

interface GeographicPoint {
  id: number;
  latitude: number;
  longitude: number;
  eventType: 'Fault' | 'Enforcement' | 'Initialization' | 'CutOut';
  locomotive: string;
  timestamp: string;
  details: string;
}

// Add a new TabView component for organizing the expanded data
interface TabViewProps {
  tabs: {
    id: string;
    label: string;
    icon: React.ReactNode;
    content: React.ReactNode;
  }[];
}

const TabView: React.FC<TabViewProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  
  return (
    <div className="mb-8">
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`flex items-center py-3 px-4 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

// Data Table component for displaying detailed records
interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
  pagination?: boolean;
  searchable?: boolean;
  sortable?: boolean;
}

function DataTable<T>({ 
  data, 
  columns, 
  pagination = true, 
  searchable = true,
  sortable = true
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  // Filter data based on search term
  const filteredData = searchable 
    ? data.filter(item => 
        Object.values(item as Record<string, unknown>).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;
    
  // Sort data if sortable
  const sortedData = sortable && sortConfig 
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : filteredData;
    
  // Paginate data
  const paginatedData = pagination 
    ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedData;
    
  const handleSort = (key: keyof T | string) => {
    if (!sortable) return;
    
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  scope="col" 
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {sortable && sortConfig && sortConfig.key === column.key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {column.render 
                      ? column.render(item)
                      : String(item[column.key as keyof T] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(Math.ceil(filteredData.length / rowsPerPage) - 1, page + 1))}
              disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{page * rowsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min((page + 1) * rowsPerPage, filteredData.length)}
                </span>{' '}
                of <span className="font-medium">{filteredData.length}</span> results
              </p>
            </div>
            <div>
              <select
                className="mr-4 px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-700"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(0);
                }}
              >
                {[5, 10, 25, 50, 100].map(value => (
                  <option key={value} value={value}>
                    {value} per page
                  </option>
                ))}
              </select>
              <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">First</span>
                  ⟪
                </button>
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  ←
                </button>
                {Array.from({ length: Math.min(5, Math.ceil(filteredData.length / rowsPerPage)) }, (_, i) => {
                  const pageNumber = page - 2 + i;
                  if (pageNumber < 0 || pageNumber >= Math.ceil(filteredData.length / rowsPerPage)) {
                    return null;
                  }
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        page === pageNumber
                          ? 'bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(Math.ceil(filteredData.length / rowsPerPage) - 1, page + 1))}
                  disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  →
                </button>
                <button
                  onClick={() => setPage(Math.ceil(filteredData.length / rowsPerPage) - 1)}
                  disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Last</span>
                  ⟫
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Map component for geographic data visualization
interface MapViewProps {
  data: GeographicPoint[];
}

const MapView: React.FC<MapViewProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-[500px] flex items-center justify-center">
      <p className="text-gray-500">
        Map visualization would be implemented here with libraries like react-leaflet or react-map-gl.
        The map would display {data.length} geographic points with different markers for faults, enforcements, etc.
      </p>
    </div>
  );
};

// Time Series Chart component
interface TimeSeriesProps {
  data: HourlyData[];
}

const TimeSeriesChart: React.FC<TimeSeriesProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
        <XAxis 
          dataKey="hour" 
          className="dark:text-gray-400"
          tickFormatter={(hour) => `${hour}:00`}
        />
        <YAxis className="dark:text-gray-400" />
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'var(--tooltip-bg)',
            borderColor: 'var(--tooltip-border)',
            color: 'var(--tooltip-text)'
          }}
          formatter={(value, name) => [value, name]}
          labelFormatter={(hour) => `Hour: ${hour}:00`}
        />
        <Legend />
        <Bar dataKey="activeRuns" name="Active Runs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="faults" name="Faults" fill="#ef4444" radius={[4, 4, 0, 0]} />
        <Bar dataKey="enforcements" name="Enforcements" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeSection, setActiveSection] = useState<string>("overview");

  // Function to fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate a delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate simulated data
      const simulatedData: DashboardData = {
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
        topLocosByMiles: [{ name: "MARC 7850", value: 194.49 }],
        topLocosByRuns: [{ name: "MARC 8056", value: 7 }],
        bottomByPtcPercentage: [{ name: "MARC 8058", value: 85.1 }],
        ptcPercentageDistribution: [{ name: ">97%", value: 32 }],
        runCountDistribution: [{ name: "1-3 Runs", value: 28 }],
        initsDistribution: [{ name: "Successful", value: 121 }],
        enforcementsDistribution: [{ name: "Reactive", value: 2 }],
        allLocomotives: [{ id: "MARC 7850", runs: 5, miles: 194.49, ptcActiveMiles: 192.62, ptcActivePercentage: 99.04, faults: 82, enforcements: 0, initializations: 3, cutOutTrips: 4 }],
        faultDetails: [{ id: 1, locomotive: "MARC 7850", timestamp: "2025-02-26T08:00:00", faultCode: "F123", description: "PTC Communication Error", severity: "Low", resolved: true }],
        hourlyActivity: [{ hour: 8, activeRuns: 12, totalMiles: 386.4, ptcActiveMiles: 377.9, faults: 327, enforcements: 0 }],
        trainRoutes: [{ routeId: "MARC-01", routeName: "Penn Line", locomotives: ["MARC 7850"], totalRuns: 42, totalMiles: 1354.8, ptcActivePercentage: 98.2, faults: 1147 }],
        initializationLogs: [{ id: 1, locomotive: "MARC 7850", timestamp: "2025-02-26T05:30:00", status: "Successful", duration: 180, faultCodes: [] }],
        geographicData: [{ id: 1, latitude: 39.3045, longitude: -76.6162, eventType: "Initialization", locomotive: "MARC 7850", timestamp: "2025-02-26T05:30:00", details: "Normal startup" }]
      };
      
      setData(simulatedData);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle refresh button click
  const handleRefresh = () => {
    fetchData();
  };

  // Function to export data as CSV
  const handleExport = () => {
    if (!data) return;
    
    // Determine which data to export based on active section
    let csvContent = '';
    let filename = '';
    
    if (activeSection === 'overview') {
      // Export summary data
      csvContent = 'Metric,Value\n';
      csvContent += `Total Runs,${data.overview.totalRuns}\n`;
      csvContent += `Total Miles,${data.overview.totalMiles}\n`;
      csvContent += `PTC Active Miles,${data.overview.totalPtcActiveMiles}\n`;
      csvContent += `PTC Active Percentage,${data.overview.totalPtcActivePercentage}\n`;
      csvContent += `Total Enforcements,${data.overview.totalEnforcements}\n`;
      csvContent += `Total Faults,${data.overview.totalFaults}\n`;
      csvContent += `Total Initializations,${data.overview.totalInits}\n`;
      csvContent += `Cut Out Trips,${data.overview.totalCutOutTrips}\n`;
      filename = 'MARC_PTC_Overview.csv';
    } else if (activeSection === 'locomotives') {
      // Export locomotive data
      csvContent = 'Locomotive ID,Runs,Miles,PTC Active Miles,PTC Active %,Faults,Enforcements,Initializations,Cut Out Trips\n';
      data.allLocomotives.forEach(loco => {
        csvContent += `${loco.id},${loco.runs},${loco.miles.toFixed(2)},${loco.ptcActiveMiles.toFixed(2)},${loco.ptcActivePercentage.toFixed(2)},${loco.faults},${loco.enforcements},${loco.initializations},${loco.cutOutTrips}\n`;
      });
      filename = 'MARC_PTC_Locomotives.csv';
    } else if (activeSection === 'faults') {
      // Export fault data
      csvContent = 'ID,Locomotive,Timestamp,Fault Code,Description,Severity,Status\n';
      data.faultDetails.forEach(fault => {
        csvContent += `${fault.id},${fault.locomotive},${fault.timestamp},${fault.faultCode},"${fault.description}",${fault.severity},${fault.resolved ? 'Resolved' : 'Open'}\n`;
      });
      filename = 'MARC_PTC_Faults.csv';
    } else {
      // Default export - all locomotives
      csvContent = 'Locomotive ID,Runs,Miles,PTC Active Miles,PTC Active %,Faults,Enforcements,Initializations,Cut Out Trips\n';
      data.allLocomotives.forEach(loco => {
        csvContent += `${loco.id},${loco.runs},${loco.miles.toFixed(2)},${loco.ptcActiveMiles.toFixed(2)},${loco.ptcActivePercentage.toFixed(2)},${loco.faults},${loco.enforcements},${loco.initializations},${loco.cutOutTrips}\n`;
      });
      filename = 'MARC_PTC_Data.csv';
    }
    
    // Create a download link and trigger the download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // Create detailed data tabs
  const detailedDataTabs = [
    {
      id: 'locomotives',
      label: 'Locomotives',
      icon: '🚂',
      content: (
        <DataTable
          data={data.allLocomotives}
          columns={[
            { key: 'id', header: 'Locomotive ID' },
            { key: 'runs', header: 'Runs' },
            { 
              key: 'miles', 
              header: 'Miles', 
              render: (item) => item.miles.toFixed(2) 
            },
            { 
              key: 'ptcActiveMiles', 
              header: 'PTC Active Miles', 
              render: (item) => item.ptcActiveMiles.toFixed(2) 
            },
            { 
              key: 'ptcActivePercentage', 
              header: 'PTC Active %', 
              render: (item) => (
                <span className={item.ptcActivePercentage < 95 ? 'text-red-500' : 'text-green-500'}>
                  {item.ptcActivePercentage.toFixed(2)}%
                </span>
              )
            },
            { key: 'faults', header: 'Faults' },
            { key: 'enforcements', header: 'Enforcements' },
            { key: 'initializations', header: 'Initializations' },
            { key: 'cutOutTrips', header: 'Cut Out Trips' }
          ]}
        />
      )
    },
    {
      id: 'faults',
      label: 'Fault Details',
      icon: '⚠️',
      content: (
        <DataTable
          data={data.faultDetails}
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'locomotive', header: 'Locomotive' },
            { 
              key: 'timestamp', 
              header: 'Time', 
              render: (item) => new Date(item.timestamp).toLocaleTimeString() 
            },
            { key: 'faultCode', header: 'Fault Code' },
            { key: 'description', header: 'Description' },
            { 
              key: 'severity', 
              header: 'Severity',
              render: (item) => {
                const colors = {
                  'Low': 'bg-blue-100 text-blue-800',
                  'Medium': 'bg-yellow-100 text-yellow-800',
                  'High': 'bg-orange-100 text-orange-800',
                  'Critical': 'bg-red-100 text-red-800'
                };
                return (
                  <span className={`px-2 py-1 rounded-full text-xs ${colors[item.severity]}`}>
                    {item.severity}
                  </span>
                );
              }
            },
            { 
              key: 'resolved', 
              header: 'Status',
              render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs ${item.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {item.resolved ? 'Resolved' : 'Open'}
                </span>
              )
            }
          ]}
        />
      )
    },
    {
      id: 'hourly',
      label: 'Hourly Activity',
      icon: '🕒',
      content: (
        <div>
          <TimeSeriesChart data={data.hourlyActivity} />
          <div className="mt-6">
            <DataTable
              data={data.hourlyActivity}
              columns={[
                { 
                  key: 'hour', 
                  header: 'Hour', 
                  render: (item) => `${item.hour}:00` 
                },
                { key: 'activeRuns', header: 'Active Runs' },
                { 
                  key: 'totalMiles', 
                  header: 'Total Miles', 
                  render: (item) => item.totalMiles.toFixed(2) 
                },
                { 
                  key: 'ptcActiveMiles', 
                  header: 'PTC Active Miles', 
                  render: (item) => item.ptcActiveMiles.toFixed(2) 
                },
                { 
                  key: 'ptcActivePercentage', 
                  header: 'PTC Active %', 
                  render: (item) => ((item.ptcActiveMiles / item.totalMiles) * 100).toFixed(2) + '%'
                },
                { key: 'faults', header: 'Faults' },
                { key: 'enforcements', header: 'Enforcements' }
              ]}
            />
          </div>
        </div>
      )
    },
    {
      id: 'routes',
      label: 'Train Routes',
      icon: '🛤️',
      content: (
        <DataTable
          data={data.trainRoutes}
          columns={[
            { key: 'routeId', header: 'Route ID' },
            { key: 'routeName', header: 'Route Name' },
            { 
              key: 'locomotives', 
              header: 'Locomotives',
              render: (item) => (
                <div className="max-w-xs overflow-hidden">
                  <p className="truncate">{item.locomotives.join(', ')}</p>
                </div>
              )
            },
            { key: 'totalRuns', header: 'Total Runs' },
            { 
              key: 'totalMiles', 
              header: 'Total Miles', 
              render: (item) => item.totalMiles.toFixed(2) 
            },
            { 
              key: 'ptcActivePercentage', 
              header: 'PTC Active %', 
              render: (item) => (
                <span className={item.ptcActivePercentage < 95 ? 'text-red-500' : 'text-green-500'}>
                  {item.ptcActivePercentage.toFixed(2)}%
                </span>
              )
            },
            { key: 'faults', header: 'Faults' }
          ]}
        />
      )
    },
    {
      id: 'initializations',
      label: 'Initializations',
      icon: '🔄',
      content: (
        <DataTable
          data={data.initializationLogs}
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'locomotive', header: 'Locomotive' },
            { 
              key: 'timestamp', 
              header: 'Time', 
              render: (item) => new Date(item.timestamp).toLocaleTimeString() 
            },
            { 
              key: 'status', 
              header: 'Status',
              render: (item) => {
                const colors = {
                  'Successful': 'bg-green-100 text-green-800',
                  'Failed': 'bg-red-100 text-red-800',
                  'Incomplete': 'bg-yellow-100 text-yellow-800'
                };
                return (
                  <span className={`px-2 py-1 rounded-full text-xs ${colors[item.status]}`}>
                    {item.status}
                  </span>
                );
              }
            },
            { 
              key: 'duration', 
              header: 'Duration', 
              render: (item) => `${(item.duration / 60).toFixed(1)} min` 
            },
            { 
              key: 'faultCodes', 
              header: 'Fault Codes',
              render: (item) => item.faultCodes.join(', ') || 'None'
            }
          ]}
        />
      )
    },
    {
      id: 'map',
      label: 'Geographic Data',
      icon: '🗺️',
      content: (
        <div>
          <MapView data={data.geographicData} />
          <div className="mt-6">
            <DataTable
              data={data.geographicData}
              columns={[
                { key: 'id', header: 'ID' },
                { key: 'locomotive', header: 'Locomotive' },
                { 
                  key: 'eventType', 
                  header: 'Event Type',
                  render: (item) => {
                    const colors = {
                      'Fault': 'bg-red-100 text-red-800',
                      'Enforcement': 'bg-yellow-100 text-yellow-800',
                      'Initialization': 'bg-blue-100 text-blue-800',
                      'CutOut': 'bg-purple-100 text-purple-800'
                    };
                    return (
                      <span className={`px-2 py-1 rounded-full text-xs ${colors[item.eventType]}`}>
                        {item.eventType}
                      </span>
                    );
                  }
                },
                { 
                  key: 'timestamp', 
                  header: 'Time', 
                  render: (item) => new Date(item.timestamp).toLocaleTimeString() 
                },
                { 
                  key: 'coordinates', 
                  header: 'Coordinates',
                  render: (item) => `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`
                },
                { key: 'details', header: 'Details' }
              ]}
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <ThemeProvider>
      <div className="bg-gray-50 dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-200">
        <Sidebar onSectionChange={setActiveSection} />
        
        <div className="ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold">
                Daily Report - February 26, 2025
              </h1>
              <div className="flex space-x-2">
                <button 
                  onClick={handleExport}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">📥</span>
                  Export
                </button>
                <button 
                  onClick={handleRefresh}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200 flex items-center"
                >
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
                color="border-blue-500" 
                bgColor="bg-blue-50"
                icon={<span className="text-blue-500">🚂</span>}
              />
              <MetricCard 
                title="Total Miles" 
                value={data.overview.totalMiles.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                color="border-green-500" 
                bgColor="bg-green-50"
                icon={<span className="text-green-500">🌍</span>}
              />
              <MetricCard 
                title="PTC Active Miles" 
                value={data.overview.totalPtcActiveMiles.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                color="border-indigo-500" 
                bgColor="bg-indigo-50"
                icon={<span className="text-indigo-500">🚋</span>}
              />
              <MetricCard 
                title="PTC Active %" 
                value={`${data.overview.totalPtcActivePercentage}%`} 
                color="border-purple-500" 
                bgColor="bg-purple-50"
                icon={<span className="text-purple-500">🚋</span>}
              />
              <MetricCard 
                title="Total Enforcements" 
                value={data.overview.totalEnforcements} 
                color="border-red-500" 
                bgColor="bg-red-50"
                icon={<span className="text-red-500">🚂</span>}
              />
              <MetricCard 
                title="Total Faults" 
                value={data.overview.totalFaults.toLocaleString()} 
                color="border-yellow-500" 
                bgColor="bg-yellow-50"
                icon={<span className="text-yellow-500">🚂</span>}
              />
              <MetricCard 
                title="Total Initializations" 
                value={data.overview.totalInits} 
                color="border-teal-500" 
                bgColor="bg-teal-50"
                icon={<span className="text-teal-500">🚂</span>}
              />
              <MetricCard 
                title="Cut Out Trips" 
                value={data.overview.totalCutOutTrips} 
                color="border-orange-500" 
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
                      formatter={(value: number) => value.toFixed(2)} 
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
            
            {/* Detailed Data Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all duration-200">
              <h2 className="text-xl font-semibold mb-4">Detailed Data</h2>
              <TabView tabs={detailedDataTabs} />
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