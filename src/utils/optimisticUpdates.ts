import { QueryClient } from '@tanstack/react-query';

// Utility function để tạo optimistic updates
export const createOptimisticUpdate = <T>(
  queryClient: QueryClient,
  queryKey: (string | number)[],
  updateFn: (oldData: T) => T
) => {
  return queryClient.setQueryData(queryKey, (oldData: T) => {
    if (!oldData) return oldData;
    return updateFn(oldData);
  });
};

// Helper để cập nhật item trong array
export const updateItemInArray = <T extends { _id: string }>(
  items: T[],
  itemId: string,
  updates: any
): T[] => {
  return items.map(item => 
    item._id === itemId ? { ...item, ...updates } : item
  );
};

// Helper để thêm item vào array
export const addItemToArray = <T>(items: T[], newItem: T): T[] => {
  return [newItem, ...items];
};

// Helper để xóa item khỏi array
export const removeItemFromArray = <T extends { _id: string }>(
  items: T[],
  itemId: string
): T[] => {
  return items.filter(item => item._id !== itemId);
};

// Helper để cập nhật nested data structure
export const updateNestedData = <T>(
  oldData: any,
  path: string[],
  updateFn: (data: any) => any
): T => {
  if (!oldData) return oldData;
  
  const newData = { ...oldData };
  let current = newData;
  
  // Navigate to the nested path
  for (let i = 0; i < path.length - 1; i++) {
    if (current[path[i]]) {
      current[path[i]] = { ...current[path[i]] };
      current = current[path[i]];
    }
  }
  
  // Update the final property
  const lastKey = path[path.length - 1];
  if (current[lastKey]) {
    current[lastKey] = updateFn(current[lastKey]);
  }
  
  return newData;
};

// Predefined optimistic updates cho các trường hợp phổ biến
export const optimisticUpdates = {
  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: (
    queryClient: QueryClient,
    page: number,
    orderId: string,
    newStatus: string
  ) => {
    createOptimisticUpdate(
      queryClient,
      ['orders', page],
      (oldData: any) => ({
        ...oldData,
        data: {
          ...oldData.data,
          orders: updateItemInArray(oldData.data?.orders || [], orderId, {
            status: newStatus,
            updated_at: new Date().toISOString()
          })
        }
      })
    );
  },

  // Cập nhật thông tin user
  updateUser: (
    queryClient: QueryClient,
    page: number,
    userId: string,
    updates: any
  ) => {
    createOptimisticUpdate(
      queryClient,
      ['users', page],
      (oldData: any) => ({
        ...oldData,
        data: {
          ...oldData.data,
          users: updateItemInArray(oldData.data?.users || [], userId, updates)
        }
      })
    );
  },

  // Cập nhật thông tin sản phẩm
  updateProduct: (
    queryClient: QueryClient,
    page: number,
    filters: any,
    productId: string,
    updates: any
  ) => {
    createOptimisticUpdate(
      queryClient,
      ['products', page, filters.filterName, filters.filterBrand, filters.filterCategory, filters.filterPriceMin, filters.filterPriceMax],
      (oldData: any) => ({
        ...oldData,
        data: {
          ...oldData.data,
          products: updateItemInArray(oldData.data?.products || [], productId, updates)
        }
      })
    );
  },

  // Thêm phản hồi admin cho review
  addAdminReply: (
    queryClient: QueryClient,
    page: number,
    reviewId: string,
    replyContent: string
  ) => {
    createOptimisticUpdate(
      queryClient,
      ['reviews', page],
      (oldData: any) => ({
        ...oldData,
        data: {
          ...oldData.data,
          reviews: oldData.data?.reviews?.map((review: any) => {
            if (review._id === reviewId) {
              return {
                ...review,
                adminReplies: [
                  ...(review.adminReplies || []),
                  {
                    content: replyContent,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    admin: { name: 'Admin' }
                  }
                ]
              };
            }
            return review;
          })
        }
      })
    );
  }
};
