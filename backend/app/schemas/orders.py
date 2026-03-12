from datetime import datetime, date
from uuid import UUID

from pydantic import BaseModel, Field, model_validator


class OrderBase(BaseModel):
    """
    Shared properties for order models. Visible by anyone.
    """

    client_uuid: UUID = Field(
        ..., description="The UUID of the client associated with the order."
    )
    project_uuid: UUID = Field(
        ..., description="The UUID of the project associated with the order."
    )
    job_no: str = Field(..., description="The job number for the order.")
    purchase_order: str = Field(
        ..., description="The purchase order number for the order."
    )
    phase: str = Field(..., description="The phase of the order.")
    batch: str = Field(..., description="The batch number for the order.")
    area: str = Field(..., description="The area associated with the order.")
    level: str = Field(..., description="The level associated with the order.")
    planned_start_date: date = Field(
        ..., description="The planned start date for the order."
    )
    planned_end_date: date = Field(..., description="The planned end date for the order.")
    status: str = Field(..., description="The status of the order.")

    @model_validator(mode="after")
    def _validate_dates(self):
        if self.planned_start_date > self.planned_end_date:
            raise ValueError("Start date must be before end date.")
        return self


class OrderCreate(OrderBase):
    """
    Properties to create a new order. Visible by anyone.
    """

    pass


class OrderUpdate(BaseModel):
    """
    Properties to update an order. Visible by anyone.
    """

    client_uuid: UUID | None = Field(
        default=None, description="The UUID of the client associated with the order."
    )
    project_uuid: UUID | None = Field(
        default=None, description="The UUID of the project associated with the order."
    )
    job_no: str | None = Field(default=None, description="The job number for the order.")
    purchase_order: str | None = Field(
        default=None, description="The purchase order number for the order."
    )
    phase: str | None = Field(default=None, description="The phase of the order.")
    batch: str | None = Field(default=None, description="The batch number for the order.")
    area: str | None = Field(
        default=None, description="The area associated with the order."
    )
    level: str | None = Field(
        default=None, description="The level associated with the order."
    )
    planned_start_date: date | None = Field(
        default=None, description="The planned start date for the order."
    )
    planned_end_date: date | None = Field(
        default=None, description="The planned end date for the order."
    )
    status: str | None = Field(default=None, description="The status of the order.")


class Order(OrderBase):
    """
    Properties shared by models stored in the database. Visible by anyone.
    """

    uuid: UUID = Field(..., description="Unique identifier for the order.")
    last_updated: datetime = Field(
        ..., description="Last updated timestamp for the order."
    )
