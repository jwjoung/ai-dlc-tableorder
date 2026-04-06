const orderRepository = require('../repositories/orderRepository');
const sseService = require('./sseService');
const { AppError } = require('../middleware/errorHandler');
const { getDatabase } = require('../db/database');

const STATUS_TRANSITIONS = {
  pending: 'preparing',
  preparing: 'completed',
};

class OrderService {
  createOrder(storeId, tableId, sessionId, items) {
    if (!items || items.length === 0) {
      throw new AppError('주문 항목이 없습니다', 400, 'VALIDATION_ERROR');
    }

    const db = getDatabase();

    // Validate each menu item
    const orderItems = [];
    for (const item of items) {
      if (!item.menuId || !item.quantity || item.quantity < 1) {
        throw new AppError('주문 항목 정보가 올바르지 않습니다', 400, 'VALIDATION_ERROR');
      }

      const menu = db.prepare(
        'SELECT * FROM menu_items WHERE id = ? AND is_available = 1'
      ).get(item.menuId);

      if (!menu) {
        throw new AppError(`메뉴를 찾을 수 없거나 판매 중지된 메뉴입니다 (ID: ${item.menuId})`, 400, 'VALIDATION_ERROR');
      }

      orderItems.push({
        menu_item_id: menu.id,
        menu_name: menu.name,
        quantity: item.quantity,
        unit_price: menu.price,
      });
    }

    const order = orderRepository.createOrder(
      { store_id: storeId, table_id: tableId, session_id: sessionId },
      orderItems
    );

    // Get table number for SSE
    const table = db.prepare('SELECT table_number FROM tables WHERE id = ?').get(tableId);

    sseService.broadcast(storeId, 'new_order', {
      orderId: order.id,
      orderNumber: order.order_number,
      tableId,
      tableNumber: table?.table_number,
      items: order.items,
      totalAmount: order.total_amount,
      status: order.status,
      createdAt: order.created_at,
    });

    return order;
  }

  getOrdersBySession(tableId, sessionId) {
    return orderRepository.getOrdersBySession(tableId, sessionId);
  }

  getAllActiveOrders(storeId) {
    const orders = orderRepository.getAllOrdersByStore(storeId);

    // Group by table
    const tableMap = new Map();
    for (const order of orders) {
      const key = order.table_id;
      if (!tableMap.has(key)) {
        tableMap.set(key, {
          tableId: order.table_id,
          tableNumber: order.table_number,
          orders: [],
          totalAmount: 0,
        });
      }
      const tableData = tableMap.get(key);
      tableData.orders.push(order);
      tableData.totalAmount += order.total_amount;
    }

    return Array.from(tableMap.values());
  }

  updateOrderStatus(orderId, newStatus) {
    const order = orderRepository.getOrderById(orderId);
    if (!order) {
      throw new AppError('주문을 찾을 수 없습니다', 404, 'NOT_FOUND');
    }

    const expectedStatus = STATUS_TRANSITIONS[order.status];
    if (expectedStatus !== newStatus) {
      throw new AppError(
        `유효하지 않은 상태 변경입니다 (${order.status} → ${newStatus})`,
        400,
        'VALIDATION_ERROR'
      );
    }

    const updated = orderRepository.updateOrderStatus(orderId, newStatus);

    sseService.broadcast(order.store_id, 'order_updated', {
      orderId: updated.id,
      status: updated.status,
      tableId: updated.table_id,
    });

    return updated;
  }

  deleteOrder(orderId) {
    const order = orderRepository.getOrderById(orderId);
    if (!order) {
      throw new AppError('주문을 찾을 수 없습니다', 404, 'NOT_FOUND');
    }

    const { store_id: storeId, table_id: tableId } = order;

    orderRepository.deleteOrder(orderId);

    sseService.broadcast(storeId, 'order_deleted', {
      orderId,
      tableId,
    });
  }
}

module.exports = new OrderService();
