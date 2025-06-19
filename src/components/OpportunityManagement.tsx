
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, DollarSign, Calendar, User, MoreHorizontal } from 'lucide-react';

const OpportunityManagement = () => {
  const [opportunities, setOpportunities] = useState({
    'new': [
      {
        id: '1',
        title: 'Acme Corp - CRM Implementation',
        value: '$45,000',
        probability: '20%',
        closeDate: '2024-03-15',
        contact: 'John Smith',
        company: 'Acme Corp'
      },
      {
        id: '2',
        title: 'TechStart - Cloud Migration',
        value: '$78,000',
        probability: '15%',
        closeDate: '2024-04-01',
        contact: 'Sarah Johnson',
        company: 'TechStart Inc'
      }
    ],
    'qualified': [
      {
        id: '3',
        title: 'Global Solutions - ERP System',
        value: '$125,000',
        probability: '40%',
        closeDate: '2024-02-28',
        contact: 'Michael Chen',
        company: 'Global Solutions'
      }
    ],
    'proposal': [
      {
        id: '4',
        title: 'InnovaCorp - Digital Transformation',
        value: '$95,000',
        probability: '60%',
        closeDate: '2024-02-15',
        contact: 'Lisa Rodriguez',
        company: 'InnovaCorp'
      },
      {
        id: '5',
        title: 'FutureTech - Security Upgrade',
        value: '$32,000',
        probability: '65%',
        closeDate: '2024-03-01',
        contact: 'David Kim',
        company: 'FutureTech'
      }
    ],
    'negotiation': [
      {
        id: '6',
        title: 'MegaCorp - Infrastructure Overhaul',
        value: '$180,000',
        probability: '80%',
        closeDate: '2024-01-30',
        contact: 'Amanda Wilson',
        company: 'MegaCorp'
      }
    ],
    'closed': [
      {
        id: '7',
        title: 'SmallBiz - Website Redesign',
        value: '$15,000',
        probability: '100%',
        closeDate: '2024-01-15',
        contact: 'Robert Brown',
        company: 'SmallBiz LLC'
      }
    ]
  });

  const stages = [
    { id: 'new', title: 'New Opportunities', color: 'bg-blue-500' },
    { id: 'qualified', title: 'Qualified', color: 'bg-yellow-500' },
    { id: 'proposal', title: 'Proposal Sent', color: 'bg-orange-500' },
    { id: 'negotiation', title: 'Negotiation', color: 'bg-purple-500' },
    { id: 'closed', title: 'Closed Won', color: 'bg-green-500' }
  ];

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const items = Array.from(opportunities[source.droppableId as keyof typeof opportunities]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setOpportunities({
        ...opportunities,
        [source.droppableId]: items
      });
    } else {
      // Moving between columns
      const sourceItems = Array.from(opportunities[source.droppableId as keyof typeof opportunities]);
      const destItems = Array.from(opportunities[destination.droppableId as keyof typeof opportunities]);
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      setOpportunities({
        ...opportunities,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems
      });
    }
  };

  const getTotalValue = (stageId: string) => {
    const stageOpps = opportunities[stageId as keyof typeof opportunities];
    return stageOpps.reduce((total, opp) => {
      const value = parseInt(opp.value.replace(/[$,]/g, ''));
      return total + value;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opportunity Management</h1>
          <p className="text-gray-600 mt-1">Track deals through your sales pipeline</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus size={20} />
          <span>New Opportunity</span>
        </button>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <div key={stage.id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
              <h3 className="font-medium text-gray-900">{stage.title}</h3>
            </div>
            <p className="text-sm text-gray-600">
              {opportunities[stage.id as keyof typeof opportunities].length} deals
            </p>
            <p className="text-lg font-bold text-gray-900">
              ${getTotalValue(stage.id).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <h3 className="font-medium text-gray-900">{stage.title}</h3>
                    <span className="text-sm text-gray-500">
                      ({opportunities[stage.id as keyof typeof opportunities].length})
                    </span>
                  </div>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-32 ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : ''
                      } rounded-lg p-2`}
                    >
                      {opportunities[stage.id as keyof typeof opportunities].map((opportunity, index) => (
                        <Draggable key={opportunity.id} draggableId={opportunity.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white rounded-lg shadow-sm border p-4 ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900 text-sm leading-tight">
                                  {opportunity.title}
                                </h4>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal size={16} />
                                </button>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <DollarSign size={14} />
                                  <span className="font-medium">{opportunity.value}</span>
                                  <span>({opportunity.probability})</span>
                                </div>
                                
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Calendar size={14} />
                                  <span>{opportunity.closeDate}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <User size={14} />
                                  <span>{opportunity.contact}</span>
                                </div>
                                
                                <div className="pt-2 border-t">
                                  <span className="text-xs text-gray-500">{opportunity.company}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default OpportunityManagement;
