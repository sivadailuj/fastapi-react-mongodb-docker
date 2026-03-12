from fastapi import APIRouter

from . import (
    login,
    users,
    clients,
    frames,
    inventory,
    manufacturing,
    materials,
    orders,
    packages,
    projects,
    shipments,
    suppliers,
)

api_router = APIRouter()
api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(frames.router, prefix="/frames", tags=["frames"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
api_router.include_router(
    manufacturing.router, prefix="/manufacturing", tags=["manufacturing"]
)
api_router.include_router(materials.router, prefix="/materials", tags=["materials"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(packages.router, prefix="/packages", tags=["packages"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(shipments.router, prefix="/shipments", tags=["shipments"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["suppliers"])


@api_router.get("/")
async def root():
    return {"message": "Backend API for FARM-docker operational !"}
