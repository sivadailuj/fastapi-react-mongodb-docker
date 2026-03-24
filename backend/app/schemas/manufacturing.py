from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class ManufacturingStatus(Enum):
    """
    Enum for manufacturing status.
    """

    QUEUED = "queued"
    IN_PROGRESS = "in_progress"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class ManufacturingBase(BaseModel):
    """
    Shared properties for manufacturing models. Visible by anyone.
    """

    client_uuid: UUID = Field(
        ..., description="The client associated with the manufacturing item."
    )
    project_uuid: UUID = Field(
        ..., description="The project associated with the manufacturing item."
    )
    ppo_id: str = Field(..., description="The PPO ID of the manufacturing item.")
    job_no: str = Field(..., description="The job number of the manufacturing item.")
    rfy_file: str = Field(..., description="The RFY file of the manufacturing item.")
    material_uuid: UUID = Field(
        ..., description="The material associated with the manufacturing item."
    )
    status: ManufacturingStatus = Field(
        ..., description="The status of the manufacturing item."
    )


class ManufacturingCreate(ManufacturingBase):
    """
    Properties to create a new manufacturing item. Visible by anyone.
    """

    pass


class ManufacturingUpdate(BaseModel):
    """
    Properties to update a manufacturing item. Visible by anyone.
    """

    client_uuid: UUID | None = Field(
        default=None, description="The client associated with the manufacturing item."
    )
    project_uuid: UUID | None = Field(
        default=None, description="The project associated with the manufacturing item."
    )
    ppo_id: str | None = Field(
        default=None, description="The PPO ID of the manufacturing item."
    )
    job_no: str | None = Field(
        default=None, description="The job number of the manufacturing item."
    )
    rfy_file: str | None = Field(
        default=None, description="The RFY file of the manufacturing item."
    )
    material_uuid: UUID | None = Field(
        default=None, description="The material associated with the manufacturing item."
    )
    status: ManufacturingStatus | None = Field(
        default=None, description="The status of the manufacturing item."
    )


class Manufacturing(ManufacturingBase):
    """
    Properties shared by models stored in the database. Visible by anyone.
    """

    uuid: UUID = Field(..., description="Unique identifier for the manufacturing item.")
    last_updated: datetime = Field(
        ..., description="Last updated timestamp for the manufacturing item."
    )
