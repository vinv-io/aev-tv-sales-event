// Clean Architecture Server Actions
'use server';

import { EventApplicationService } from '../../application/services/EventApplicationService';
import { ProductApplicationService } from '../../application/services/ProductApplicationService';
import { CustomerApplicationService } from '../../application/services/CustomerApplicationService';
import { OrderApplicationService } from '../../application/services/OrderApplicationService';
import { CheckInApplicationService } from '../../application/services/CheckInApplicationService';
import { PackageApplicationService } from '../../application/services/PackageApplicationService';
import { LeaderboardApplicationService } from '../../application/services/LeaderboardApplicationService';
import { DomainError } from '../../shared/errors/DomainErrors';

// Initialize application services
const eventService = new EventApplicationService();
const productService = new ProductApplicationService();
const customerService = new CustomerApplicationService();
const orderService = new OrderApplicationService();
const checkInService = new CheckInApplicationService();
const packageService = new PackageApplicationService();
const leaderboardService = new LeaderboardApplicationService();

// Event Actions using Clean Architecture
export async function getEventsAction() {
  try {
    return await eventService.getEventsAsPlainObjects();
  } catch (error) {
    console.error('Error getting events:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get events');
  }
}

export async function getActiveEventsAction() {
  try {
    return await eventService.getActiveEventsAsPlainObjects();
  } catch (error) {
    console.error('Error getting active events:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get active events');
  }
}

export async function createEventAction(formData: FormData) {
  try {
    const name_en = formData.get('name_en') as string;
    const name_vi = formData.get('name_vi') as string;
    const type = formData.get('type') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const status = formData.get('status') === 'true';

    console.log('Form data received:', {
      name_en,
      name_vi,
      type,
      startDate,
      endDate,
      status
    });

    // Validate required fields
    if (!name_en || !name_vi || !type || !startDate || !endDate) {
      throw new Error('Missing required fields');
    }

    const name = {
      en: name_en,
      vi: name_vi
    };
    
    const eventData = {
      name,
      type,
      startDate,
      endDate,
      status
    };

    console.log('Creating event with data:', eventData);

    const event = await eventService.createEvent(eventData);
    return event.toPlainObject();
  } catch (error) {
    console.error('Error creating event:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create event');
  }
}

export async function updateEventAction(id: string, formData: FormData) {
  try {
    const updateData: any = {};
    
    const nameEn = formData.get('name_en') as string;
    const nameVi = formData.get('name_vi') as string;
    if (nameEn && nameVi) {
      updateData.name = { en: nameEn, vi: nameVi };
    }
    
    const type = formData.get('type') as string;
    if (type) updateData.type = type;
    
    const startDate = formData.get('startDate') as string;
    if (startDate) updateData.startDate = startDate;
    
    const endDate = formData.get('endDate') as string;
    if (endDate) updateData.endDate = endDate;
    
    const status = formData.get('status');
    if (status !== null) updateData.status = status === 'true';

    const event = await eventService.updateEvent(id, updateData);
    return event.toPlainObject();
  } catch (error) {
    console.error('Error updating event:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update event');
  }
}

export async function deleteEventAction(id: string) {
  try {
    await eventService.deleteEvent(id);
  } catch (error) {
    console.error('Error deleting event:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to delete event');
  }
}

// Product Actions using Clean Architecture
export async function getProductsAction() {
  try {
    return await productService.getProductsAsPlainObjects();
  } catch (error) {
    console.error('Error getting products:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get products');
  }
}

export async function createProductAction(formData: FormData) {
  try {
    const name = {
      en: formData.get('name_en') as string,
      vi: formData.get('name_vi') as string
    };
    
    const description = {
      en: formData.get('description_en') as string,
      vi: formData.get('description_vi') as string
    };
    
    const productData = {
      id: formData.get('id') as string,
      name,
      description,
      image: formData.get('image') as string || 'https://placehold.co/600x400.png',
      aiHint: formData.get('aiHint') as string || 'product package'
    };

    const product = await productService.createProduct(productData);
    return product.toPlainObject();
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create product');
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  try {
    const updateData: any = {};
    
    const nameEn = formData.get('name_en') as string;
    const nameVi = formData.get('name_vi') as string;
    if (nameEn && nameVi) {
      updateData.name = { en: nameEn, vi: nameVi };
    }
    
    const descriptionEn = formData.get('description_en') as string;
    const descriptionVi = formData.get('description_vi') as string;
    if (descriptionEn && descriptionVi) {
      updateData.description = { en: descriptionEn, vi: descriptionVi };
    }
    
    const image = formData.get('image') as string;
    if (image) updateData.image = image;
    
    const aiHint = formData.get('aiHint') as string;
    if (aiHint) updateData.aiHint = aiHint;

    const product = await productService.updateProduct(id, updateData);
    return product.toPlainObject();
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update product');
  }
}

export async function deleteProductAction(id: string) {
  try {
    await productService.deleteProduct(id);
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to delete product');
  }
}

// Customer Actions using Clean Architecture
export async function getCustomersAction() {
  try {
    return await customerService.getCustomersAsPlainObjects();
  } catch (error) {
    console.error('Error getting customers:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get customers');
  }
}

export async function createCustomerAction(formData: FormData) {
  try {
    const customerData = {
      phone: formData.get('phone') as string,
      shopName: formData.get('shopName') as string,
      address: formData.get('address') as string || undefined,
      email: formData.get('email') as string || undefined
    };

    const customer = await customerService.createCustomer(customerData);
    return customer.toPlainObject();
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create customer');
  }
}

export async function updateCustomerAction(id: string, formData: FormData) {
  try {
    const updateData: any = {};
    
    const phone = formData.get('phone') as string;
    if (phone) updateData.phone = phone;
    
    const shopName = formData.get('shopName') as string;
    if (shopName) updateData.shopName = shopName;
    
    const address = formData.get('address') as string;
    if (address) updateData.address = address;
    
    const email = formData.get('email') as string;
    if (email) updateData.email = email;

    const customer = await customerService.updateCustomer(id, updateData);
    return customer.toPlainObject();
  } catch (error) {
    console.error('Error updating customer:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update customer');
  }
}

export async function deleteCustomerAction(id: string) {
  try {
    await customerService.deleteCustomer(id);
  } catch (error) {
    console.error('Error deleting customer:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to delete customer');
  }
}

// Order Actions using Clean Architecture
export async function getOrdersAction() {
  try {
    const orders = await orderService.getAllOrders();
    return orders.map(order => order.toPlainObject());
  } catch (error) {
    console.error('Error getting orders:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get orders');
  }
}

export async function createOrderAction(formData: FormData) {
  try {
    const customerId = formData.get('customerId') as string;
    const customerName = formData.get('customerName') as string;
    const customerPhone = formData.get('customerPhone') as string;
    const productsJson = formData.get('products') as string;
    const totalAmount = parseInt(formData.get('totalAmount') as string) || 0;
    const notes = formData.get('notes') as string || undefined;

    const products = JSON.parse(productsJson);
    
    const orderData = {
      customerId,
      customerName,
      customerPhone,
      products,
      totalAmount,
      notes
    };

    const order = await orderService.createOrder(orderData);
    return order.toPlainObject();
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create order');
  }
}

export async function updateOrderAction(id: string, formData: FormData) {
  try {
    const updateData: any = {};
    
    const customerName = formData.get('customerName') as string;
    if (customerName) updateData.customerName = customerName;
    
    const customerPhone = formData.get('customerPhone') as string;
    if (customerPhone) updateData.customerPhone = customerPhone;
    
    const productsJson = formData.get('products') as string;
    if (productsJson) updateData.products = JSON.parse(productsJson);
    
    const status = formData.get('status') as string;
    if (status) updateData.status = status;
    
    const notes = formData.get('notes') as string;
    if (notes) updateData.notes = notes;

    const order = await orderService.updateOrder(id, updateData);
    return order.toPlainObject();
  } catch (error) {
    console.error('Error updating order:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update order');
  }
}

export async function deleteOrderAction(id: string) {
  try {
    await orderService.deleteOrder(id);
  } catch (error) {
    console.error('Error deleting order:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to delete order');
  }
}

export async function getOrderStatsAction() {
  try {
    return await orderService.getOrderStats();
  } catch (error) {
    console.error('Error getting order stats:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get order stats');
  }
}

// CheckIn Actions using Clean Architecture
export async function getCheckInsAction() {
  try {
    const checkIns = await checkInService.getAllCheckIns();
    return checkIns.map(checkIn => checkIn.toPlainObject());
  } catch (error) {
    console.error('Error getting check-ins:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get check-ins');
  }
}

export async function createCheckInAction(formData: FormData) {
  try {
    const checkInData = {
      customerId: formData.get('customerId') as string,
      customerPhone: formData.get('customerPhone') as string,
      shopName: formData.get('shopName') as string,
      eventId: formData.get('eventId') as string,
      location: formData.get('location') as string || undefined,
      notes: formData.get('notes') as string || undefined
    };

    const checkIn = await checkInService.createCheckIn(checkInData);
    return checkIn.toPlainObject();
  } catch (error) {
    console.error('Error creating check-in:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create check-in');
  }
}

export async function deleteCheckInAction(id: string) {
  try {
    await checkInService.deleteCheckIn(id);
  } catch (error) {
    console.error('Error deleting check-in:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to delete check-in');
  }
}

export async function getCheckInStatsAction(eventId?: string) {
  try {
    return await checkInService.getCheckInStats(eventId);
  } catch (error) {
    console.error('Error getting check-in stats:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get check-in stats');
  }
}

// Package Actions using Clean Architecture
export async function getPackagesAction() {
  try {
    const packages = await packageService.getAllPackages();
    return packages.map(pkg => pkg.toPlainObject());
  } catch (error) {
    console.error('Error getting packages:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get packages');
  }
}

export async function getActivePackagesAction() {
  try {
    const packages = await packageService.getActivePackages();
    return packages.map(pkg => pkg.toPlainObject());
  } catch (error) {
    console.error('Error getting active packages:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get active packages');
  }
}

export async function createPackageAction(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const productsJson = formData.get('products') as string;
    const discount = parseFloat(formData.get('discount') as string) || 0;
    const validFrom = formData.get('validFrom') as string || undefined;
    const validUntil = formData.get('validUntil') as string || undefined;

    const products = JSON.parse(productsJson);
    
    const packageData = {
      name,
      description,
      price,
      products,
      discount,
      validFrom,
      validUntil
    };

    const packageEntity = await packageService.createPackage(packageData);
    return packageEntity.toPlainObject();
  } catch (error) {
    console.error('Error creating package:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create package');
  }
}

export async function updatePackageAction(id: string, formData: FormData) {
  try {
    const updateData: any = {};
    
    const name = formData.get('name') as string;
    if (name) updateData.name = name;
    
    const description = formData.get('description') as string;
    if (description) updateData.description = description;
    
    const price = formData.get('price') as string;
    if (price) updateData.price = parseFloat(price);
    
    const productsJson = formData.get('products') as string;
    if (productsJson) updateData.products = JSON.parse(productsJson);
    
    const discount = formData.get('discount') as string;
    if (discount) updateData.discount = parseFloat(discount);
    
    const isActive = formData.get('isActive') as string;
    if (isActive) updateData.isActive = isActive === 'true';
    
    const validFrom = formData.get('validFrom') as string;
    if (validFrom) updateData.validFrom = validFrom;
    
    const validUntil = formData.get('validUntil') as string;
    if (validUntil) updateData.validUntil = validUntil;

    const packageEntity = await packageService.updatePackage(id, updateData);
    return packageEntity.toPlainObject();
  } catch (error) {
    console.error('Error updating package:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update package');
  }
}

export async function deletePackageAction(id: string) {
  try {
    await packageService.deletePackage(id);
  } catch (error) {
    console.error('Error deleting package:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to delete package');
  }
}

// Leaderboard Actions using Clean Architecture
export async function getLeaderboardAction(limit: number = 10) {
  try {
    const leaderboard = await leaderboardService.getLeaderboard(limit);
    return leaderboard.map(entry => entry.toPlainObject());
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get leaderboard');
  }
}

export async function getLeaderboardByDateRangeAction(startDate: string, endDate: string, limit: number = 10) {
  try {
    const leaderboard = await leaderboardService.getLeaderboardByDateRange(startDate, endDate, limit);
    return leaderboard.map(entry => entry.toPlainObject());
  } catch (error) {
    console.error('Error getting leaderboard by date range:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get leaderboard by date range');
  }
}

export async function getCustomerRankingAction(customerId: string) {
  try {
    return await leaderboardService.getCustomerRanking(customerId);
  } catch (error) {
    console.error('Error getting customer ranking:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get customer ranking');
  }
}

export async function getTopPerformersAction(threshold: number = 80) {
  try {
    const topPerformers = await leaderboardService.getTopPerformers(threshold);
    return topPerformers.map(entry => entry.toPlainObject());
  } catch (error) {
    console.error('Error getting top performers:', error);
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get top performers');
  }
}
