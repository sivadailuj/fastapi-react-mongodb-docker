from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class FrameStatus(Enum):
    """
    Enum for the status of a frame.
    """

    QUEUED = "queued"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class FrameBase(BaseModel):
    """
    Shared properties for frame models. Visible by anyone.
    """

    client_uuid: UUID = Field(..., description="The client associated with the frame.")
    project_uuid: UUID = Field(..., description="The project associated with the frame.")
    package_uuid: UUID = Field(..., description="The package associated with the frame.")
    ppo_id: str = Field(..., description="The ID of the PPO associated with the frame.")
    name: str = Field(..., description="The name of the frame.")
    type: str = Field(..., description="The type of the frame.")
    nwt: float = Field(..., description="The NWT of the frame.")
    assembly_file: str = Field(
        ..., description="The assembly file associated with the frame."
    )
    machine: str = Field(..., description="The machine associated with the frame.")
    status: FrameStatus = Field(
        default=FrameStatus.QUEUED, description="The status of the frame."
    )


class FrameCreate(FrameBase):
    """
    Properties to create a new frame. Visible by anyone.
    """

    pass


class FrameUpdate(BaseModel):
    """
    Properties to update a frame. Visible by anyone.
    """

    client_uuid: UUID | None = Field(
        default=None, description="The client associated with the frame."
    )
    project_uuid: UUID | None = Field(
        default=None, description="The project associated with the frame."
    )
    package_uuid: UUID | None = Field(
        default=None, description="The package associated with the frame."
    )
    ppo_id: str | None = Field(
        default=None, description="The ID of the PPO associated with the frame."
    )
    name: str | None = Field(default=None, description="The name of the frame.")
    type: str | None = Field(default=None, description="The type of the frame.")
    nwt: float | None = Field(default=None, description="The NWT of the frame.")
    assembly_file: str | None = Field(
        default=None, description="The assembly file associated with the frame."
    )
    machine: str | None = Field(
        default=None, description="The machine associated with the frame."
    )
    status: FrameStatus | None = Field(
        default=None, description="The status of the frame."
    )


class Frame(FrameBase):
    """
    Properties shared by models stored in the database. Visible by anyone.
    """

    uuid: UUID = Field(..., description="Unique identifier for the frame.")
    last_updated: datetime = Field(
        ..., description="Last updated timestamp for the frame."
    )
