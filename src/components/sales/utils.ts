
export const getStatusBadge = (status: string, type: 'order' | 'invoice' | 'delivery' | 'payment') => {
  const colorMap: { [key: string]: string } = {
    // Orders
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Confirmed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Shipped': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    // Invoices
    'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    'Sent': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Unpaid': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Partial': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    // Delivery
    'Prepared': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
