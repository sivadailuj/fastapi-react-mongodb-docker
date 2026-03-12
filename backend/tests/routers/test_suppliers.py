import pytest

from httpx import AsyncClient
from uuid import UUID
from app.config.config import settings

from app.schemas import Address
from app.schemas import SupplierCreate as Create
from app.schemas import SupplierUpdate as Update
from app.schemas import Supplier as Schema

from ..utils import verify_update_data

PREFIX = "/suppliers"

create_address = Address(
    street="123 Main St",
    city="City",
    state="FL",
    zip_code="12345",
    country="US",
)

create_data = Create(
    company="company",
    contact_person="Test Constact",
    short_name="cmp",
    address=create_address,
    email="email@example.com",
    mobile="1234567890",
    office="9876543210",
    position="position",
)

update_address = Address(
    street="456 Main St",
    city="UpdateCity",
    state="GA",
    zip_code="54321",
    country="USA",
)

update_data = Update(
    company="company2",
    contact_person="Update Constact",
    short_name="cmp2",
    address=update_address,
    email="update@example.com",
    mobile="0147852369",
    office="9632587410",
    position="position2",
)


@pytest.mark.anyio
async def test_create(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    ret_json = response.json()
    assert create_data == Create.model_validate(ret_json)


@pytest.mark.anyio
async def test_get(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    create_json = response.json()
    response = await client.get(f"{settings.API_V1_STR}{PREFIX}/{create_json['uuid']}")
    assert response.status_code == 200
    ret_json = response.json()
    assert Schema.model_validate(create_json) == Schema.model_validate(ret_json)


@pytest.mark.anyio
async def test_update(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    create_json = response.json()
    response = await client.patch(
        f"{settings.API_V1_STR}{PREFIX}/{create_json['uuid']}",
        json=update_data.model_dump(exclude_unset=True, mode="json"),
    )
    assert response.status_code == 200
    ret_json = response.json()
    verify_update_data(create_data, update_data, Schema.model_validate(ret_json))


@pytest.mark.anyio
async def test_delete(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    create_json = response.json()
    response = await client.delete(f"{settings.API_V1_STR}{PREFIX}/{create_json['uuid']}")
    assert response.status_code == 204
    response = await client.get(f"{settings.API_V1_STR}{PREFIX}/{create_json['uuid']}")
    assert response.status_code == 404
