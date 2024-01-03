import weaviate

client = weaviate.Client("http://localhost:8080")

data_obj = {"text": "Sample contract content", "source": "Sample source information"}

try:
    data_uuid = client.data_object.create(
        data_obj,
        "SmartContract",
        consistency_level=weaviate.data.replication.ConsistencyLevel.ALL,
    )
    print("Data inserted, UUID:", data_uuid)
except Exception as e:
    print("Failed to insert data:", e)
