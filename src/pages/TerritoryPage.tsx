
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TerritoryPage = () => {
  // Mock data for territories
  const mockTerritories = [
    { id: '1', name: 'North America East', manager: 'John Smith', region: 'North America', status: 'Active' },
    { id: '2', name: 'Europe Central', manager: 'Sarah Johnson', region: 'Europe', status: 'Active' },
    { id: '3', name: 'Asia Pacific', manager: 'Michael Chen', region: 'Asia', status: 'Active' },
    { id: '4', name: 'Latin America', manager: 'Lisa Rodriguez', region: 'South America', status: 'Inactive' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Territory Management</h1>
                <Link to="/territory/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Territory
                  </Button>
                </Link>
              </div>
              <div className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-900 dark:text-white">Territory Name</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Manager</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Region</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTerritories.map((territory) => (
                      <TableRow key={territory.id}>
                        <TableCell className="text-gray-900 dark:text-white font-medium">{territory.name}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">{territory.manager}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">{territory.region}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            territory.status === 'Active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {territory.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TerritoryPage;
