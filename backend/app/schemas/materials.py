from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class MaterialStatus(Enum):
    """
    Enum for material status.
    """

    QUEUED = "queued"
    IN_PROGRESS = "in_progress"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class MaterialBase(BaseModel):
    """
    Shared properties for material models. Visible by anyone.
    """

    client_uuid: UUID = Field(..., description="The client associated with the material.")
    project_uuid: UUID = Field(
        ..., description="The project associated with the material."
    )
    order_uuid: UUID = Field(..., description="The order associated with the material.")
    manufacturing_uuid: UUID = Field(
        ..., description="The manufacturing process associated with the material."
    )
    ppo_id: str = Field(..., description="The PPO ID of the material.")
    machine: str = Field(..., description="The machine associated with the material.")
    required_nwt: float = Field(..., description="The required NWT of the material.")
    available_nwt: float = Field(..., description="The available NWT of the material.")
    status: MaterialStatus = Field(..., description="The status of the material.")


class MaterialCreate(MaterialBase):
    """
    Properties to create a new material. Visible by anyone.
    """

    pass


class MaterialUpdate(MaterialBase):
    """
    Properties to update a material. Visible by anyone.
    """

    client_uuid: UUID | None = Field(
        default=None, description="The client associated with the material."
    )
    project_uuid: UUID | None = Field(
        default=None, description="The project associated with the material."
    )
    order_uuid: UUID | None = Field(
        default=None, description="The order associated with the material."
    )
    manufacturing_uuid: UUID | None = Field(
        default=None,
        description="The manufacturing process associated with the material.",
    )
    ppo_id: str | None = Field(default=None, description="The PPO ID of the material.")
    machine: str | None = Field(
        default=None, description="The machine associated with the material."
    )
    required_nwt: float | None = Field(
        default=None, description="The required NWT of the material."
    )
    available_nwt: float | None = Field(
        default=None, description="The available NWT of the material."
    )
    status: MaterialStatus | None = Field(
        default=None, description="The status of the material."
    )


class Material(MaterialBase):
    """
    Properties shared by models stored in the database. Visible by anyone.
    """

    uuid: UUID = Field(..., description="Unique identifier for the material.")
    last_updated: datetime = Field(
        ..., description="Last updated timestamp for the material."
    )
