from typing import Any
from uuid import UUID
from datetime import datetime
from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, HTTPException, Response
from pymongo import errors

from .. import models, schemas

router = APIRouter()


@router.post("", response_model=schemas.Frame, status_code=201)
async def create_frame(frame: schemas.FrameCreate = Body(...)) -> Any:
    """
    Create a new frame.
    """
    try:
        frame_doc = models.Frame(**frame.model_dump())
        setattr(frame_doc, "last_updated", frame_doc.last_updated.replace(microsecond=0))
        await frame_doc.insert()
        return frame_doc
    except errors.DuplicateKeyError:
        raise HTTPException(
            status_code=400, detail="Frame with this UUID already exists."
        )


@router.get("/{frame_uuid}", response_model=schemas.Frame)
async def get_frame(frame_uuid: UUID) -> Any:
    """
    Get a frame by UUID.
    """
    frame = await models.Frame.find_one(models.Frame.uuid == frame_uuid)
    if not frame:
        raise HTTPException(status_code=404, detail="Frame not found.")
    return frame


@router.patch("/{frame_uuid}", response_model=schemas.Frame)
async def update_frame(
    frame_uuid: UUID, frame_update: schemas.FrameUpdate = Body(...)
) -> Any:
    """
    Update a frame by UUID.
    """
    frame = await models.Frame.find_one(models.Frame.uuid == frame_uuid)
    if not frame:
        raise HTTPException(status_code=404, detail="Frame not found.")

    for field, value in frame_update.model_dump(exclude_unset=True).items():
        setattr(frame, field, value)

    setattr(frame, "last_updated", datetime.now().replace(microsecond=0).isoformat())

    try:
        await frame.save()
        return frame
    except RevisionIdWasChanged:
        raise HTTPException(
            status_code=409, detail="Conflict: Frame was updated by another process."
        )


@router.delete("/{frame_uuid}", status_code=204)
async def delete_frame(frame_uuid: UUID) -> Response:
    """
    Delete a frame by UUID.
    """
    frame = await models.Frame.find_one(models.Frame.uuid == frame_uuid)
    if not frame:
        raise HTTPException(status_code=404, detail="Frame not found.")

    await frame.delete()


@router.get("", response_model=list[schemas.Frame])
async def list_frames(
    limit: int | None = 25,
    offset: int | None = 0,
) -> Any:
    """
    List all frames.
    """
    frames = await models.Frame.find_all().skip(offset).limit(limit).to_list()
    return frames


@router.get("/package/{package_uuid}", response_model=list[schemas.Frame])
async def list_frames_by_package(
    package_uuid: UUID,
    limit: int | None = 25,
    offset: int | None = 0,
) -> Any:
    """
    List frames by package UUID.
    """
    frames = (
        await models.Frame.find(models.Frame.package_uuid == package_uuid)
        .skip(offset)
        .limit(limit)
        .to_list()
    )
    return frames
