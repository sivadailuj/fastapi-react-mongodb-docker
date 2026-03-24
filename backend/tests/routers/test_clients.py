import pytest

from httpx import AsyncClient
from uuid import UUID
from app.config.config import settings

from app.schemas import ClientCreate as CreateSchema
from app.schemas import ClientUpdate as UpdateSchema
from app.schemas import Client as Schema
from app.schemas import Address

from ..utils import verify_update_data

PREFIX = "/clients"

create_address = Address(
    street="123 Main St", city="City", state="FL", zip_code="12345", country="US"
)

company_name = "Test Company"

create_data = CreateSchema(
    company=company_name,
    category="Test Category",
    address=create_address,
    mobile="1234567890",
    email="test@example.com",
)

update_address = Address(
    street="456 Main St",
    city="UpdateCity",
    state="GA",
    zip_code="65432",
    country="USA",
)

update_data = UpdateSchema(
    company="Updated Company",
    # category="Updated Category",
    # address=update_address,
    mobile="0987654321",
    email="update@example.com",
    fax="1234567890",
)


@pytest.mark.anyio
async def test_create(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    ret_json = response.json()
    assert create_data == CreateSchema.model_validate(ret_json)


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


@pytest.mark.anyio
async def test_get_all(client: AsyncClient) -> None:
    # Create multiple clients
    for i in range(3):
        response = await client.post(
            f"{settings.API_V1_STR}{PREFIX}",
            json=create_data.model_dump(mode="json"),
        )
        assert response.status_code == 201

    # Get all clients
    response = await client.get(f"{settings.API_V1_STR}{PREFIX}")
    assert response.status_code == 200
    ret_json = response.json()
    assert isinstance(ret_json, dict)
    assert len(ret_json["items"]) >= 3
    assert ret_json["total"] >= 3


@pytest.mark.anyio
async def test_search(client: AsyncClient) -> None:
    response = await client.post(
        f"{settings.API_V1_STR}{PREFIX}", json=create_data.model_dump(mode="json")
    )
    assert response.status_code == 201
    response = await client.get(f"{settings.API_V1_STR}{PREFIX}", params={"search": company_name})
    assert response.status_code == 200
    ret_json = response.json()
    assert isinstance(ret_json, dict)
    assert len(ret_json["items"]) == 1
    assert ret_json["items"][0]["company"] == company_name


@pytest.mark.anyio
async def test_sort(client: AsyncClient) -> None:
    # Create multiple clients with different company names
    companies = ["Alpha", "Charlie", "Bravo"]
    for company in companies:
        data = CreateSchema(
            company=company,
            category="Test Category",
            address=create_address,
            mobile="1234567890",
            email=f"{company.lower()}@example.com",
        )
        response = await client.post(
            f"{settings.API_V1_STR}{PREFIX}", json=data.model_dump(mode="json")
        )
        assert response.status_code == 201

    # Sort clients by company name in ascending order
    response = await client.get(f"{settings.API_V1_STR}{PREFIX}", params={"sortBy": "company", "sortOrder": 1})
    assert response.status_code == 200
    ret_json = response.json()
    sorted_companies = [client["company"] for client in ret_json["items"] ]
    assert sorted_companies == sorted(companies)

    # Sort clients by company name in descending order
    response = await client.get(f"{settings.API_V1_STR}{PREFIX}", params={"sortBy": "company", "sortOrder": -1})
    assert response.status_code == 200
    ret_json = response.json()
    sorted_companies_desc = [client["company"] for client in ret_json["items"]]
    assert sorted_companies_desc == sorted(companies, reverse=True)
