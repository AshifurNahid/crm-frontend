
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import TerritoryDetailView from '../components/TerritoryDetailView';
import { useTheme } from '../contexts/ThemeContext';

const TerritoryPage = () => {
  const { theme } = useTheme();
  const [selectedTerritory, setSelectedTerritory] = useState<any>(null);
  const [showDetailView, setShowDetailView] = useState(false);

  // Mock data for territories - this will be replaced with actual API calls
  const mockTerritories = [
    { id: '1', name: 'North America East', manager: 'John Smith', region: 'North America', status: 'Active', customersCount: 45 },
    { id: '2', name: 'Europe Central', manager: 'Sarah Johnson', region: 'Europe', status: 'Active', customersCount: 32 },
    { id: '3', name: 'Asia Pacific', manager: 'Michael Chen', region: 'Asia', status: 'Active', customersCount: 28 },
    { id: '4', name: 'Latin America', manager: 'Lisa Rodriguez', region: 'South America', status: 'Inactive', customersCount: 15 },
  ];

  const handleViewTerritory = (territory: any) => {
    setSelectedTerritory(territory);
    setShowDetailView(true);
  };

  const handleCloseDetailView = () => {
    setShowDetailView(false);
    setSelectedTerritory(null);
  };

  const handleEditTerritory = (id: string) => {
    // This will be implemented with actual navigation
    console.log('Edit territory:', id);
  };

  const handleDeleteTerritory = (id: string) => {
    // This will be implemented with actual API call
    console.log('Delete territory:', id);
  };

  if (showDetailView && selectedTerritory) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <TerritoryDetailView
            territory={selectedTerritory}
            onClose={handleCloseDetailView}
            onEdit={handleEditTerritory}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-gray-600 dark:text-gray-400">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900 dark:text-white">
                Territories
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Territory Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and organize your sales territories</p>
          </div>
          <Link to="/territory/create">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Territory
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Total Territories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockTerritories.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Active Territories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{mockTerritories.filter(t => t.status === 'Active').length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{mockTerritories.reduce((sum, t) => sum + t.customersCount, 0)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Regions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">{new Set(mockTerritories.map(t => t.region)).size}</p>
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
                  <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Customers</TableHead>
                  <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTerritories.map((territory) => (
                  <TableRow key={territory.id}>
                    <TableCell className="text-gray-900 dark:text-white font-medium">{territory.name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">{territory.manager}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">{territory.region}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={territory.status === 'Active' ? 'default' : 'secondary'}
                        className={territory.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }
                      >
                        {territory.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">{territory.customersCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTerritory(territory)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTerritory(territory.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTerritory(territory.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
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
    </div>
  );
};

export default TerritoryPage;
