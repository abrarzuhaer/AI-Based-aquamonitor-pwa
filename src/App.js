import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ArrowLeft,
  MoreVertical,
  Home,
  FileText,
  Bell,
  HelpCircle,
  Phone,
  Book,
  ClipboardList,
  AlertCircle,
  Droplet, // Water droplet for DO/Turbidity
  Thermometer, // Temperature
  FlaskConical, // Ammonia/pH/TDS (general chemistry)
  Activity, // General health/status indicator
  CalendarDays, // Reports
  Zap, // AI Alert
} from 'lucide-react';

// Mock Data for the demo
const mockData = {
  waterQuality: {
    status: 'Normal',
    do: '6.8 mg/L',
    ammonia: '0.2 mg/L',
    pH: '7.4',
    tds: '520 mg/L',
    temperature: '26.5°C',
    turbidity: '4 NTU',
  },
  reports: {
    weeklyReport: {
      dateRange: 'Apr 18, 2024 - Apr 22, 2024',
      healthStatus: 'Good',
      ammoniaIncrease: 'Checking ammonia, It levels & check ammonia increases.',
      chartData: [
        { name: 'Su', value: 6.5 },
        { name: 'M', value: 6.7 },
        { name: 'Tu', value: 7.0 },
        { name: 'W', value: 6.8 },
        { name: 'Th', value: 7.1 },
        { name: 'F', value: 6.9 },
        { name: 'Sa', value: 7.2 },
      ],
    },
  },
  alerts: [
    {
      type: 'AI Alert',
      message: 'Ammonia level above the threshold',
      details: 'Elevated ammonia levels detected. Consider immediate water change or reduce feeding.',
      time: null, // No specific time for AI alert
    },
    {
      type: 'Previous',
      message: 'Decrease in DO level',
      time: 'Today, 8.00 AM',
    },
    {
      type: 'Previous',
      message: 'pH out of range',
      time: 'Yesterday, 3.00 PM',
    },
  ],
  help: {
    helpline: '123-456-7890',
    guidelines: 'Refer to local aquaculture guidelines for optimal water parameters.',
    faq: 'Common questions about water quality and system operation.',
    reportProblem: 'Submit a detailed report regarding any system issues.',
  },
};

// Component for the header bar
const Header = ({ title, onBack, showMore = false }) => (
  <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-t-xl">
    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
      <ArrowLeft size={24} color="#3B82F6" />
    </button>
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    {showMore ? (
      <button className="p-2 rounded-full hover:bg-gray-100">
        <MoreVertical size={24} color="#3B82F6" />
      </button>
    ) : (
      <div className="w-8"></div> // Placeholder for alignment
    )}
  </div>
);

// Component for the bottom navigation bar
const NavBar = ({ currentPage, onNavigate }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around py-2 rounded-b-xl">
    <button
      className={`flex flex-col items-center p-2 rounded-lg ${currentPage === 'waterQuality' ? 'text-blue-500' : 'text-gray-500'} hover:bg-gray-100`}
      onClick={() => onNavigate('waterQuality')}
    >
      <Home size={24} />
      <span className="text-xs mt-1">Home</span>
    </button>
    <button
      className={`flex flex-col items-center p-2 rounded-lg ${currentPage === 'reports' ? 'text-blue-500' : 'text-gray-500'} hover:bg-gray-100`}
      onClick={() => onNavigate('reports')}
    >
      <FileText size={24} />
      <span className="text-xs mt-1">Reports</span>
    </button>
    <button
      className={`flex flex-col items-center p-2 rounded-lg ${currentPage === 'alerts' ? 'text-blue-500' : 'text-gray-500'} hover:bg-gray-100`}
      onClick={() => onNavigate('alerts')}
    >
      <Bell size={24} />
      <span className="text-xs mt-1">Alerts</span>
    </button>
    <button
      className={`flex flex-col items-center p-2 rounded-lg ${currentPage === 'help' ? 'text-blue-500' : 'text-gray-500'} hover:bg-gray-100`}
      onClick={() => onNavigate('help')}
    >
      <HelpCircle size={24} />
      <span className="text-xs mt-1">Help</span>
    </button>
  </div>
);

// Water Quality Page Component
const WaterQuality = ({ data }) => (
  <div className="p-4 space-y-4">
    <div className="bg-blue-600 text-white p-4 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-semibold">Status</h2>
      <p className="text-4xl font-bold mt-2">{data.status}</p>
    </div>

    <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
      <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
        <div className="flex items-center space-x-2">
          <Droplet size={20} color="#3B82F6" />
          <span className="text-lg text-gray-700">DO</span>
        </div>
        <span className="text-lg font-medium text-gray-800">{data.do}</span>
      </div>
      <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
        <div className="flex items-center space-x-2">
          <FlaskConical size={20} color="#EF4444" />
          <span className="text-lg text-gray-700">Ammonia</span>
        </div>
        <span className="text-lg font-medium text-gray-800">{data.ammonia}</span>
      </div>
      <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
        <div className="flex items-center space-x-2">
          <FlaskConical size={20} color="#22C55E" />
          <span className="text-lg text-gray-700">pH</span>
        </div>
        <span className="text-lg font-medium text-gray-800">{data.pH}</span>
      </div>
      <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
        <div className="flex items-center space-x-2">
          <Droplet size={20} color="#F59E0B" />
          <span className="text-lg text-gray-700">TDS</span>
        </div>
        <span className="text-lg font-medium text-gray-800">{data.tds}</span>
      </div>
      <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
        <div className="flex items-center space-x-2">
          <Thermometer size={20} color="#6366F1" />
          <span className="text-lg text-gray-700">Temperature</span>
        </div>
        <span className="text-lg font-medium text-gray-800">{data.temperature}</span>
      </div>
      <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
        <div className="flex items-center space-x-2">
          <Activity size={20} color="#10B981" />
          <span className="text-lg text-gray-700">Turbidity</span>
        </div>
        <span className="text-lg font-medium text-gray-800">{data.turbidity}</span>
      </div>
    </div>

    <button className="w-full bg-blue-500 text-white py-3 rounded-xl shadow-md text-lg font-semibold hover:bg-blue-600 transition-colors">
      Measure
    </button>
  </div>
);

// Reports Page Component
const Reports = ({ data }) => (
  <div className="p-4 space-y-4">
    <div className="bg-white p-4 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Weekly Report</h2>
        <CalendarDays size={24} color="#3B82F6" />
      </div>
      <p className="text-gray-600 text-sm">{data.weeklyReport.dateRange}</p>
      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.weeklyReport.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis hide={true} domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
      <div className="flex items-center justify-between py-2 border-b border-gray-200">
        <span className="text-lg text-gray-700">Water Health</span>
        <span className="text-lg font-medium text-green-500">{data.weeklyReport.healthStatus}</span>
      </div>
      <div className="py-2">
        <h3 className="text-lg font-medium text-gray-800">Ammonia Increase</h3>
        <p className="text-gray-600 text-sm mt-1">{data.weeklyReport.ammoniaIncrease}</p>
      </div>
      <button className="w-full text-blue-500 text-left py-2 hover:bg-gray-100 rounded-lg px-2 transition-colors">
        AI Advisory &gt;
      </button>
    </div>

    <button className="w-full text-blue-500 text-left py-2 hover:bg-gray-100 rounded-lg px-2 transition-colors">
      Previous &gt;
    </button>
  </div>
);

// Alerts Page Component
const Alerts = ({ alerts }) => (
  <div className="p-4 space-y-4">
    {alerts.map((alert, index) => (
      <div key={index} className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-center space-x-3 mb-3">
          {alert.type === 'AI Alert' ? (
            <Zap size={24} color="#F59E0B" />
          ) : (
            <Bell size={24} color="#3B82F6" />
          )}
          <h3 className="text-lg font-semibold text-gray-800">{alert.type}</h3>
        </div>
        <p className="text-gray-700">{alert.message}</p>
        {alert.time && <p className="text-gray-500 text-sm mt-1">{alert.time}</p>}
        {alert.type === 'AI Alert' && (
          <div className="flex space-x-3 mt-4">
            <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
              View Details
            </button>
            <button className="flex-1 border border-blue-500 text-blue-500 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
              Contact Helpline
            </button>
          </div>
        )}
      </div>
    ))}
    <button className="w-full text-blue-500 text-left py-2 hover:bg-gray-100 rounded-lg px-2 transition-colors">
      Previous &gt;
    </button>
  </div>
);

// Help Page Component
const Help = ({ data }) => (
  <div className="p-4 space-y-4">
    <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
      <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex items-center space-x-3">
          <Phone size={20} color="#3B82F6" />
          <span className="text-lg text-gray-700">Helpline</span>
        </div>
        <ArrowLeft size={20} className="rotate-180 text-gray-500" />
      </button>
      <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex items-center space-x-3">
          <Book size={20} color="#3B82F6" />
          <span className="text-lg text-gray-700">Water Quality Guidelines</span>
        </div>
        <ArrowLeft size={20} className="rotate-180 text-gray-500" />
      </button>
      <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex items-center space-x-3">
          <ClipboardList size={20} color="#3B82F6" />
          <span className="text-lg text-gray-700">Frequently Asked Questions</span>
        </div>
        <ArrowLeft size={20} className="rotate-180 text-gray-500" />
      </button>
      <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex items-center space-x-3">
          <AlertCircle size={20} color="#3B82F6" />
          <span className="text-lg text-gray-700">Report a Problem</span>
        </div>
        <ArrowLeft size={20} className="rotate-180 text-gray-500" />
      </button>
    </div>
  </div>
);


// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('waterQuality'); // Default page

  const renderPage = () => {
    switch (currentPage) {
      case 'waterQuality':
        return <WaterQuality data={mockData.waterQuality} />;
      case 'reports':
        return <Reports data={mockData.reports} />;
      case 'alerts':
        return <Alerts alerts={mockData.alerts} />;
      case 'help':
        return <Help data={mockData.help} />;
      default:
        return <WaterQuality data={mockData.waterQuality} />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'waterQuality':
        return 'Water Quality';
      case 'reports':
        return 'Reports';
      case 'alerts':
        return 'Alerts';
      case 'help':
        return 'Help';
      default:
        return 'Water Quality';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-100 shadow-lg rounded-xl overflow-hidden my-4">
        <Header
          title={getPageTitle()}
          onBack={() => {
            // Implement back logic if needed, for now, just navigate to home
            setCurrentPage('waterQuality');
          }}
          showMore={currentPage === 'reports'} // Show more icon only on reports page
        />
        <main className="p-4 pb-20"> {/* Add padding-bottom for the fixed navbar */}
          {renderPage()}
        </main>
        <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>
    </div>
  );
};

export default App;


// import React, { useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import {
//   ArrowLeft,
//   MoreVertical,
//   Home,
//   FileText,
//   Bell,
//   HelpCircle,
//   Phone,
//   Book,
//   ClipboardList,
//   AlertCircle,
//   Droplet, // Water droplet for DO/Turbidity
//   Thermometer, // Temperature
//   FlaskConical, // Ammonia/pH/TDS (general chemistry)
//   Activity, // General health/status indicator
//   CalendarDays, // Reports
//   Zap, // AI Alert
// } from 'lucide-react';

// // Mock Data for the demo
// const mockData = {
//   waterQuality: {
//     status: 'Normal',
//     do: '6.8 mg/L',
//     ammonia: '0.2 mg/L',
//     pH: '7.4',
//     tds: '520 mg/L',
//     temperature: '26.5°C',
//     turbidity: '4 NTU',
//   },
//   reports: {
//     weeklyReport: {
//       dateRange: 'Apr 18, 2024 - Apr 22, 2024',
//       healthStatus: 'Good',
//       ammoniaIncrease: 'Checking ammonia, It levels & check ammonia increases.',
//       chartData: [
//         { name: 'Su', value: 6.5 },
//         { name: 'M', value: 6.7 },
//         { name: 'Tu', value: 7.0 },
//         { name: 'W', value: 6.8 },
//         { name: 'Th', value: 7.1 },
//         { name: 'F', value: 6.9 },
//         { name: 'Sa', value: 7.2 },
//       ],
//     },
//   },
//   alerts: [
//     {
//       type: 'AI Alert',
//       message: 'Ammonia level above the threshold',
//       details: 'Elevated ammonia levels detected. Consider immediate water change or reduce feeding.',
//       time: null, // No specific time for AI alert
//     },
//     {
//       type: 'Previous',
//       message: 'Decrease in DO level',
//       time: 'Today, 8.00 AM',
//     },
//     {
//       type: 'Previous',
//       message: 'pH out of range',
//       time: 'Yesterday, 3.00 PM',
//     },
//   ],
//   help: {
//     helpline: '123-456-7890',
//     guidelines: 'Refer to local aquaculture guidelines for optimal water parameters.',
//     faq: 'Common questions about water quality and system operation.',
//     reportProblem: 'Submit a detailed report regarding any system issues.',
//   },
// };

// // Component for the header bar
// const Header = ({ title, onBack, showMore = false }) => (
//   <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-t-xl">
//     <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
//       <ArrowLeft size={24} color="#3B82F6" />
//     </button>
//     <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
//     {showMore ? (
//       <button className="p-2 rounded-full hover:bg-gray-100">
//         <MoreVertical size={24} color="#3B82F6" />
//       </button>
//     ) : (
//       <div className="w-8"></div> // Placeholder for alignment
//     )}
//   </div>
// );

// // Component for the bottom navigation bar
// const NavBar = ({ currentPage, onNavigate }) => (
//   <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around py-2 rounded-b-xl">
//     <button
//       className={`flex flex-col items-center p-2 rounded-lg ${currentPage === 'waterQuality' ? 'text-blue-500' : 'text-gray-500'} hover:bg-gray-100`}
//       onClick={() => onNavigate('waterQuality')}
//     >
//       <Home size={24} />
//       <span className="text-xs mt-1">Home</span>
//     </button>
//     <button
//       className={`flex flex-col items-center p-2 rounded-lg ${currentPage === 'reports' ? 'text-blue-500' : 'text-gray-500'} hover:bg-gray-100`}
//       onClick={() => onNavigate('reports')}
//     >
//       <FileText size={24} />
//       <span className="text-xs mt-1">Reports</span>
//     </button>
//     <button
//       className={`flex flex-col items-center p-2 rounded-lg ${currentPage === 'alerts' ? 'text-blue-500' : 'text-gray-500'} hover:bg-gray-100`}
//       onClick={() => onNavigate('alerts')}
//     >
//       <Bell size={24} />
//       <span className="text-xs mt-1">Alerts</span>
//     </button>
//     <button
//       className={`flex flex-col items-center p-2 rounded-lg ${currentPage === 'help' ? 'text-blue-500' : 'text-gray-500'} hover:bg-gray-100`}
//       onClick={() => onNavigate('help')}
//     >
//       <HelpCircle size={24} />
//       <span className="text-xs mt-1">Help</span>
//     </button>
//   </div>
// );

// // Water Quality Page Component
// const WaterQuality = ({ data }) => (
//   <div className="p-4 space-y-4">
//     <div className="bg-blue-600 text-white p-4 rounded-xl shadow-md text-center">
//       <h2 className="text-xl font-semibold">Status</h2>
//       <p className="text-4xl font-bold mt-2">{data.status}</p>
//     </div>

//     <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
//       <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
//         <div className="flex items-center space-x-2">
//           <Droplet size={20} color="#3B82F6" />
//           <span className="text-lg text-gray-700">DO</span>
//         </div>
//         <span className="text-lg font-medium text-gray-800">{data.do}</span>
//       </div>
//       <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
//         <div className="flex items-center space-x-2">
//           <FlaskConical size={20} color="#EF4444" />
//           <span className="text-lg text-gray-700">Ammonia</span>
//         </div>
//         <span className="text-lg font-medium text-gray-800">{data.ammonia}</span>
//       </div>
//       <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
//         <div className="flex items-center space-x-2">
//           <FlaskConical size={20} color="#22C55E" />
//           <span className="text-lg text-gray-700">pH</span>
//         </div>
//         <span className="text-lg font-medium text-gray-800">{data.pH}</span>
//       </div>
//       <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
//         <div className="flex items-center space-x-2">
//           <Droplet size={20} color="#F59E0B" />
//           <span className="text-lg text-gray-700">TDS</span>
//         </div>
//         <span className="text-lg font-medium text-gray-800">{data.tds}</span>
//       </div>
//       <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
//         <div className="flex items-center space-x-2">
//           <Thermometer size={20} color="#6366F1" />
//           <span className="text-lg text-gray-700">Temperature</span>
//         </div>
//         <span className="text-lg font-medium text-gray-800">{data.temperature}</span>
//       </div>
//       <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
//         <div className="flex items-center space-x-2">
//           <Activity size={20} color="#10B981" />
//           <span className="text-lg text-gray-700">Turbidity</span>
//         </div>
//         <span className="text-lg font-medium text-gray-800">{data.turbidity}</span>
//       </div>
//     </div>

//     <button className="w-full bg-blue-500 text-white py-3 rounded-xl shadow-md text-lg font-semibold hover:bg-blue-600 transition-colors">
//       Measure
//     </button>
//   </div>
// );

// // Reports Page Component
// const Reports = ({ data }) => (
//   <div className="p-4 space-y-4">
//     <div className="bg-white p-4 rounded-xl shadow-md">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">Weekly Report</h2>
//         <CalendarDays size={24} color="#3B82F6" />
//       </div>
//       <p className="text-gray-600 text-sm">{data.weeklyReport.dateRange}</p>
//       <div className="mt-4 h-48">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data.weeklyReport.chartData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//             <XAxis dataKey="name" axisLine={false} tickLine={false} />
//             <YAxis hide={true} domain={['dataMin - 1', 'dataMax + 1']} />
//             <Tooltip />
//             <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>

//     <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
//       <div className="flex items-center justify-between py-2 border-b border-gray-200">
//         <span className="text-lg text-gray-700">Water Health</span>
//         <span className="text-lg font-medium text-green-500">{data.weeklyReport.healthStatus}</span>
//       </div>
//       <div className="py-2">
//         <h3 className="text-lg font-medium text-gray-800">Ammonia Increase</h3>
//         <p className="text-gray-600 text-sm mt-1">{data.weeklyReport.ammoniaIncrease}</p>
//       </div>
//       <button className="w-full text-blue-500 text-left py-2 hover:bg-gray-100 rounded-lg px-2 transition-colors">
//         AI Advisory &gt;
//       </button>
//     </div>

//     <button className="w-full text-blue-500 text-left py-2 hover:bg-gray-100 rounded-lg px-2 transition-colors">
//       Previous &gt;
//     </button>
//   </div>
// );

// // Alerts Page Component
// const Alerts = ({ alerts }) => (
//   <div className="p-4 space-y-4">
//     {alerts.map((alert, index) => (
//       <div key={index} className="bg-white p-4 rounded-xl shadow-md">
//         <div className="flex items-center space-x-3 mb-3">
//           {alert.type === 'AI Alert' ? (
//             <Zap size={24} color="#F59E0B" />
//           ) : (
//             <Bell size={24} color="#3B82F6" />
//           )}
//           <h3 className="text-lg font-semibold text-gray-800">{alert.type}</h3>
//         </div>
//         <p className="text-gray-700">{alert.message}</p>
//         {alert.time && <p className="text-gray-500 text-sm mt-1">{alert.time}</p>}
//         {alert.type === 'AI Alert' && (
//           <div className="flex space-x-3 mt-4">
//             <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
//               View Details
//             </button>
//             <button className="flex-1 border border-blue-500 text-blue-500 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
//               Contact Helpline
//             </button>
//           </div>
//         )}
//       </div>
//     ))}
//     <button className="w-full text-blue-500 text-left py-2 hover:bg-gray-100 rounded-lg px-2 transition-colors">
//       Previous &gt;
//     </button>
//   </div>
// );

// // Help Page Component
// const Help = ({ data }) => (
//   <div className="p-4 space-y-4">
//     <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
//       <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
//         <div className="flex items-center space-x-3">
//           <Phone size={20} color="#3B82F6" />
//           <span className="text-lg text-gray-700">Helpline</span>
//         </div>
//         <ArrowLeft size={20} className="rotate-180 text-gray-500" />
//       </button>
//       <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
//         <div className="flex items-center space-x-3">
//           <Book size={20} color="#3B82F6" />
//           <span className="text-lg text-gray-700">Water Quality Guidelines</span>
//         </div>
//         <ArrowLeft size={20} className="rotate-180 text-gray-500" />
//       </button>
//       <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
//         <div className="flex items-center space-x-3">
//           <ClipboardList size={20} color="#3B82F6" />
//           <span className="text-lg text-gray-700">Frequently Asked Questions</span>
//         </div>
//         <ArrowLeft size={20} className="rotate-180 text-gray-500" />
//       </button>
//       <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
//         <div className="flex items-center space-x-3">
//           <AlertCircle size={20} color="#3B82F6" />
//           <span className="text-lg text-gray-700">Report a Problem</span>
//         </div>
//         <ArrowLeft size={20} className="rotate-180 text-gray-500" />
//       </button>
//     </div>
//   </div>
// );


// // Main App Component
// const App = () => {
//   const [currentPage, setCurrentPage] = useState('waterQuality'); // Default page

//   const renderPage = () => {
//     switch (currentPage) {
//       case 'waterQuality':
//         return <WaterQuality data={mockData.waterQuality} />;
//       case 'reports':
//         return <Reports data={mockData.reports} />;
//       case 'alerts':
//         return <Alerts alerts={mockData.alerts} />;
//       case 'help':
//         return <Help data={mockData.help} />;
//       default:
//         return <WaterQuality data={mockData.waterQuality} />;
//     }
//   };

//   const getPageTitle = () => {
//     switch (currentPage) {
//       case 'waterQuality':
//         return 'Water Quality';
//       case 'reports':
//         return 'Reports';
//       case 'alerts':
//         return 'Alerts';
//       case 'help':
//         return 'Help';
//       default:
//         return 'Water Quality';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 font-sans flex flex-col items-center">
//       <div className="w-full max-w-md bg-gray-100 shadow-lg rounded-xl overflow-hidden my-4">
//         <Header
//           title={getPageTitle()}
//           onBack={() => {
//             // Implement back logic if needed, for now, just navigate to home
//             setCurrentPage('waterQuality');
//           }}
//           showMore={currentPage === 'reports'} // Show more icon only on reports page
//         />
//         <main className="p-4 pb-20"> {/* Add padding-bottom for the fixed navbar */}
//           {renderPage()}
//         </main>
//         <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
//       </div>
//     </div>
//   );
// };

// export default App;
