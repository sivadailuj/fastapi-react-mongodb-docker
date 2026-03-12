from typing import Any
from uuid import UUID
from datetime import datetime
from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, HTTPException, Response
from pymongo import errors

from .. import models, schemas

router = APIRouter()


@router.post("", response_model=schemas.Order, status_code=201)
async def create_order(
    order: schemas.OrderCreate = Body(...),
) -> Any:
    """
    Create a new order.
    """
    try:
        order_doc = models.Order(**order.model_dump())
        setattr(order_doc, "last_updated", order_doc.last_updated.replace(microsecond=0))
        await order_doc.insert()
        return order_doc
    except errors.DuplicateKeyError:
        raise HTTPException(
            status_code=400, detail="Order with this UUID already exists."
        )


@router.get("/{order_uuid}", response_model=schemas.Order)
async def get_order(order_uuid: UUID) -> Any:
    """
    Get an order by UUID.
    """
    order = await models.Order.find_one(models.Order.uuid == order_uuid)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order


@router.patch("/{order_uuid}", response_model=schemas.Order)
async def update_order(
    order_uuid: UUID,
    order_update: schemas.OrderUpdate = Body(...),
) -> Any:
    """
    Update an order by UUID.
    """
    order = await models.Order.find_one(models.Order.uuid == order_uuid)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    for field, value in order_update.model_dump(exclude_unset=True).items():
        setattr(order, field, value)

    setattr(order, "last_updated", datetime.now().replace(microsecond=0).isoformat())

    try:
        await order.save()
        return order
    except RevisionIdWasChanged:
        raise HTTPException(
            status_code=409,
            detail="Order has been modified by another process. Please refresh and try again.",
        )


@router.delete("/{order_uuid}", status_code=204)
async def delete_order(order_uuid: UUID) -> Response:
    """
    Delete an order by UUID.
    """
    order = await models.Order.find_one(models.Order.uuid == order_uuid)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    await order.delete()


@router.get("", response_model=list[schemas.Order])
async def list_orders(
    limit: int | None = 25,
    offset: int | None = 0,
) -> Any:
    """
    List all orders.
    """
    orders = await models.Order.find_all().skip(offset).limit(limit).to_list()
    return orders


@router.get("/project/{project_uuid}", response_model=list[schemas.Order])
async def list_orders_by_project(
    project_uuid: UUID,
    limit: int | None = 25,
    offset: int | None = 0,
) -> Any:
    """
    List all orders for a specific project.
    """
    orders = (
        await models.Order.find(models.Order.project_uuid == project_uuid)
        .skip(offset)
        .limit(limit)
        .to_list()
    )
    return orders
