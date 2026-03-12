import pytest

from httpx import AsyncClient
from uuid import UUID
from app.config.config import settings

from app.schemas import Address
from app.schemas import ProjectCreate as Create
from app.schemas import ProjectUpdate as Update
from app.schemas import Project as Schema

from ..utils import verify_update_data

PREFIX = "/projects"

create_address = Address(
    street="123 Main St",
    city="City",
    state="FL",
    zip_code="12345",
    country="US",
)

create_data = Create(
    name="project",
    client_uuid=UUID(int=1),
    category="cat",
    address=create_address,
    sow="sow",
    type="type",
    construction_type="const_type",
    models="1",
    phase_volleys="1",
    stories="1",
    units="1",
)

update_address = Address(
    street="456 Main St",
    city="UpdateCity",
    state="GA",
    zip_code="54321",
    country="USA",
)

update_data = Update(
    name="project2",
    client_uuid=UUID(int=2),
    category="cat2",
    address=update_address,
    sow="sow2",
    type="type2",
    construction_type="const_type2",
    # models="2",
    phase_volleys="2",
    stories="2",
    units="2",
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
