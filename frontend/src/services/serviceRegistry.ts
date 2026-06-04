import inventoryService from './inventory.service'
import frameService from './frame.service'
import projectService from './project.service'
import orderService from './order.service'
import { QueryParams } from '../models/PaginatedResponse'

type ServiceInstance = Record<string, unknown>

interface ServiceRegistryEntry {
  service: ServiceInstance
  getByMethod: string
  parentUuidField: string
  createMethod: string
  updateMethod: string
  deleteMethod: string
}

const serviceRegistry: Record<string, ServiceRegistryEntry> = {
  inventory: {
    service: inventoryService as unknown as ServiceInstance,
    getByMethod: 'getInventoriesBySupplier',
    parentUuidField: 'supplier_uuid',
    createMethod: 'createInventory',
    updateMethod: 'updateInventory',
    deleteMethod: 'deleteInventory',
  },
  frame: {
    service: frameService as unknown as ServiceInstance,
    getByMethod: 'getFramesByPackage',
    parentUuidField: 'package_uuid',
    createMethod: 'createFrame',
    updateMethod: 'updateFrame',
    deleteMethod: 'deleteFrame',
  },
  project: {
    service: projectService as unknown as ServiceInstance,
    getByMethod: 'getProjectsByClient',
    parentUuidField: 'client_uuid',
    createMethod: 'createProject',
    updateMethod: 'updateProject',
    deleteMethod: 'deleteProject',
  },
  order: {
    service: orderService as unknown as ServiceInstance,
    getByMethod: 'getOrdersByProject',
    parentUuidField: 'project_uuid',
    createMethod: 'createOrder',
    updateMethod: 'updateOrder',
    deleteMethod: 'deleteOrder',
  },
}

export async function fetchRelatedData(
  entityType: string,
  parentUuid: string,
  params?: Partial<QueryParams>,
): Promise<unknown[]> {
  const entry = serviceRegistry[entityType]
  if (!entry) {
    throw new Error(`No service registry entry for entity type: ${entityType}`)
  }

  const method = (entry.service as Record<string, unknown>)[entry.getByMethod]
  if (!method) {
    throw new Error(
      `Service does not have method: ${entry.getByMethod} for entity type: ${entityType}`,
    )
  }

  const queryParams: QueryParams = {
    offset: params?.offset || 0,
    limit: params?.limit || 100,
    search: params?.search || '',
    sortBy: params?.sortBy || '',
    sortOrder: params?.sortOrder || 1,
  }

  return (await (method as (uuid: string, params: QueryParams) => Promise<unknown[]>).call(
    entry.service,
    parentUuid,
    queryParams,
  )) as unknown[]
}

export function getServiceForEntityType(entityType: string): ServiceInstance {
  const entry = serviceRegistry[entityType]
  if (!entry) {
    throw new Error(`No service registry entry for entity type: ${entityType}`)
  }
  return entry.service
}

export function getParentUuidField(entityType: string): string {
  const entry = serviceRegistry[entityType]
  if (!entry) {
    throw new Error(`No service registry entry for entity type: ${entityType}`)
  }
  return entry.parentUuidField
}

export function getServiceMethods(entityType: string) {
  const entry = serviceRegistry[entityType]
  if (!entry) {
    throw new Error(`No service registry entry for entity type: ${entityType}`)
  }
  return {
    create: entry.createMethod,
    update: entry.updateMethod,
    delete: entry.deleteMethod,
  }
}
