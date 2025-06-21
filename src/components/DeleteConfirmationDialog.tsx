
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  isDeleting?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isDeleting = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
          {itemName && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {itemName}
              </p>
            </div>
          )}
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            This action cannot be undone.
          </p>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
