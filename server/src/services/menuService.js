const menuRepository = require('../repositories/menuRepository');
const { AppError } = require('../middleware/errorHandler');

class MenuService {
  getAllMenus(storeId, isAdmin = false) {
    const categories = menuRepository.getAllCategories(storeId);
    const menus = isAdmin
      ? menuRepository.getAllMenus(storeId)
      : menuRepository.getAvailableMenus(storeId);

    return categories.map(cat => ({
      ...cat,
      menus: menus.filter(m => m.category_id === cat.id),
    }));
  }

  getMenuById(id) {
    const menu = menuRepository.getMenuById(id);
    if (!menu) {
      throw new AppError('메뉴를 찾을 수 없습니다', 404, 'NOT_FOUND');
    }
    return menu;
  }

  createMenu(storeId, data) {
    this.validateMenu(data);

    const category = menuRepository.getCategoryById(data.category_id);
    if (!category) {
      throw new AppError('존재하지 않는 카테고리입니다', 400, 'VALIDATION_ERROR');
    }

    const duplicate = menuRepository.findByNameInCategory(data.category_id, data.name);
    if (duplicate) {
      throw new AppError('같은 카테고리에 동일한 이름의 메뉴가 있습니다', 409, 'CONFLICT');
    }

    const displayOrder = menuRepository.getMaxDisplayOrder(data.category_id) + 1;

    return menuRepository.createMenu({
      store_id: storeId,
      category_id: data.category_id,
      name: data.name.trim(),
      price: data.price,
      description: data.description,
      image_url: data.image_url,
      display_order: displayOrder,
    });
  }

  updateMenu(id, data) {
    const existing = menuRepository.getMenuById(id);
    if (!existing) {
      throw new AppError('메뉴를 찾을 수 없습니다', 404, 'NOT_FOUND');
    }

    this.validateMenu(data);

    const category = menuRepository.getCategoryById(data.category_id);
    if (!category) {
      throw new AppError('존재하지 않는 카테고리입니다', 400, 'VALIDATION_ERROR');
    }

    const duplicate = menuRepository.findByNameInCategory(data.category_id, data.name, id);
    if (duplicate) {
      throw new AppError('같은 카테고리에 동일한 이름의 메뉴가 있습니다', 409, 'CONFLICT');
    }

    return menuRepository.updateMenu(id, {
      category_id: data.category_id,
      name: data.name.trim(),
      price: data.price,
      description: data.description,
      image_url: data.image_url,
    });
  }

  deleteMenu(id) {
    const existing = menuRepository.getMenuById(id);
    if (!existing) {
      throw new AppError('메뉴를 찾을 수 없습니다', 404, 'NOT_FOUND');
    }
    menuRepository.softDeleteMenu(id);
  }

  updateMenuOrder(id, direction) {
    const menu = menuRepository.getMenuById(id);
    if (!menu) {
      throw new AppError('메뉴를 찾을 수 없습니다', 404, 'NOT_FOUND');
    }

    const menus = menuRepository.getMenusByCategory(menu.category_id);
    const currentIndex = menus.findIndex(m => m.id === id);

    if (currentIndex === -1) {
      throw new AppError('메뉴를 찾을 수 없습니다', 404, 'NOT_FOUND');
    }

    let targetIndex;
    if (direction === 'up') {
      targetIndex = currentIndex - 1;
    } else if (direction === 'down') {
      targetIndex = currentIndex + 1;
    } else {
      throw new AppError('direction은 up 또는 down이어야 합니다', 400, 'VALIDATION_ERROR');
    }

    if (targetIndex < 0 || targetIndex >= menus.length) {
      throw new AppError('더 이상 이동할 수 없습니다', 400, 'VALIDATION_ERROR');
    }

    const current = menus[currentIndex];
    const target = menus[targetIndex];

    menuRepository.swapMenuOrder(
      current.id, current.display_order,
      target.id, target.display_order
    );
  }

  // --- Categories ---

  getCategories(storeId) {
    return menuRepository.getAllCategories(storeId);
  }

  createCategory(storeId, data) {
    if (!data.name || !data.name.trim()) {
      throw new AppError('카테고리 이름을 입력해주세요', 400, 'VALIDATION_ERROR');
    }
    if (data.name.trim().length > 50) {
      throw new AppError('카테고리 이름은 50자 이내로 입력해주세요', 400, 'VALIDATION_ERROR');
    }

    const displayOrder = menuRepository.getMaxCategoryOrder(storeId) + 1;
    return menuRepository.createCategory(storeId, data.name.trim(), displayOrder);
  }

  updateCategory(id, data) {
    const existing = menuRepository.getCategoryById(id);
    if (!existing) {
      throw new AppError('카테고리를 찾을 수 없습니다', 404, 'NOT_FOUND');
    }

    if (!data.name || !data.name.trim()) {
      throw new AppError('카테고리 이름을 입력해주세요', 400, 'VALIDATION_ERROR');
    }
    if (data.name.trim().length > 50) {
      throw new AppError('카테고리 이름은 50자 이내로 입력해주세요', 400, 'VALIDATION_ERROR');
    }

    return menuRepository.updateCategory(
      id,
      data.name.trim(),
      data.display_order !== undefined ? data.display_order : existing.display_order
    );
  }

  deleteCategory(id) {
    const existing = menuRepository.getCategoryById(id);
    if (!existing) {
      throw new AppError('카테고리를 찾을 수 없습니다', 404, 'NOT_FOUND');
    }

    const menuCount = menuRepository.getMenuCountByCategory(id);
    if (menuCount > 0) {
      throw new AppError(
        '카테고리에 메뉴가 존재합니다. 메뉴를 먼저 삭제하거나 이동해주세요',
        400,
        'VALIDATION_ERROR'
      );
    }

    menuRepository.deleteCategory(id);
  }

  // --- Validation ---

  validateMenu(data) {
    if (!data.name || !data.name.trim()) {
      throw new AppError('메뉴 이름을 입력해주세요', 400, 'VALIDATION_ERROR');
    }
    if (data.name.trim().length > 100) {
      throw new AppError('메뉴 이름은 100자 이내로 입력해주세요', 400, 'VALIDATION_ERROR');
    }
    if (data.price === undefined || data.price === null) {
      throw new AppError('가격을 입력해주세요', 400, 'VALIDATION_ERROR');
    }
    if (typeof data.price !== 'number' || data.price < 0 || !Number.isInteger(data.price)) {
      throw new AppError('가격은 0 이상의 정수여야 합니다', 400, 'VALIDATION_ERROR');
    }
    if (!data.category_id) {
      throw new AppError('카테고리를 선택해주세요', 400, 'VALIDATION_ERROR');
    }
    if (data.description && data.description.length > 500) {
      throw new AppError('설명은 500자 이내로 입력해주세요', 400, 'VALIDATION_ERROR');
    }
  }
}

module.exports = new MenuService();
