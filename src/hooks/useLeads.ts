
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService, Lead, LeadPageResponse } from '@/services/leadService';
import { toast } from '@/hooks/use-toast';

export const useLeads = (pageNumber = 0, pageSize = 10, sortField = 'id', direction = 'ASC') => {
  return useQuery({
    queryKey: ['leads', pageNumber, pageSize, sortField, direction],
    queryFn: () => leadService.getAllLeads(pageNumber, pageSize, direction, sortField),
  });
};

export const useLead = (id: number) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadService.getLeadById(id),
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: leadService.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Success",
        description: "Lead created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, lead }: { id: number; lead: Partial<Lead> }) => 
      leadService.updateLead(id, lead),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      toast({
        title: "Success",
        description: "Lead updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: leadService.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    },
  });
};
