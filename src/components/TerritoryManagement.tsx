
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TerritoryDetailView from './TerritoryDetailView';

const TerritoryManagement = () => {
  const [selectedTerritory, setSelectedTerritory] = useState<any>(null);
  const [showDetailView, setShowDetailView] = useState(false);

  // Mock data for territories
  const mockTerritories = [
    { 
      id: '1', 
      name: 'North America East', 
      manager: 'John Smith', 
      region: 'North America', 
      status: 'Active',
      customersCount: 45
    },
    { 
      id: '2', 
      name: 'Europe Central', 
      manager: 'Sarah Johnson', 
      region: 'Europe', 
      status: 'Active',
      customersCount: 32
    },
    { 
      id: '3', 
      name: 'Asia Pacific', 
      manager: 'Michael Chen', 
      region: 'Asia', 
      status: 'Active',
      customersCount: 28
    },
    { 
      id: '4', 
      name: 'Latin America', 
      manager: 'Lisa Rodriguez', 
      region: 'South America', 
      status: 'Inactive',
      customersCount: 15
    },
  ];

  const handleViewTerritory = (territory: any) => {
    setSelectedTerritory(territory);
    setShowDetailView(true);
  };

  const handleEditTerritory = (id: string) => {
    console.log('Edit territory:', id);
  };

  const handleDeleteTerritory = (id: string) => {
    console.log('Delete territory:', id);
  };

  const handleCloseDetailView = () => {
    setShowDetailView(false);
    setSelectedTerritory(null);
  };

  if (showDetailView && selectedTerritory) {
    return (
      <TerritoryDetailView
        territory={selectedTerritory}
        onClose={handleCloseDetailView}
        onEdit={handleEditTerritory}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Territory Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your sales territories and assignments</p>
        </div>
        <Link to="/territory/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Territory
          </Button>
        </Link>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Territories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockTerritories.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Territories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {mockTerritories.filter(t => t.status === 'Active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {mockTerritories.reduce((sum, t) => sum + t.customersCount, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Customers/Territory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(mockTerritories.reduce((sum, t) => sum + t.customersCount, 0) / mockTerritories.length)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Territories Table */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">All Territories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900 dark:text-white">Territory Name</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Manager</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Region</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Customers</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTerritories.map((territory) => (
                <TableRow key={territory.id}>
                  <TableCell className="text-gray-900 dark:text-white font-medium">
                    {territory.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {territory.manager}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {territory.region}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {territory.customersCount}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={territory.status === 'Active' ? 'default' : 'secondary'}
                      className={territory.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                      }
                    >
                      {territory.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTerritory(territory)}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTerritory(territory.id)}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTerritory(territory.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TerritoryManagement;
