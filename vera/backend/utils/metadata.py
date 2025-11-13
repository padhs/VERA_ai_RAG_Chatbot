import json
import os
from datetime import datetime

METADATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "docs_metadata.json")


def load_metadata() -> list[dict]:
    if not os.path.exists(METADATA_FILE):
        return []

    with open(METADATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_metadata(metadata: list[dict]) -> None:
    os.makedirs(os.path.dirname(METADATA_FILE), exist_ok=True)
    with open(METADATA_FILE, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4)


def update_metadata(
    *,
    collection: str,
    vectors: int,
    embed_model: str,
    domain: str,
    source: str,
) -> None:
    data = load_metadata()

    timestamp = datetime.utcnow().isoformat() + "Z"

    for entry in data:
        if entry.get("collection") == collection:
            entry.update(
                {
                    "vectors": vectors,
                    "embed_model": embed_model,
                    "domain": domain,
                    "source": source,
                    "indexed_at": timestamp,
                }
            )
            save_metadata(data)
            return

    data.append(
        {
            "collection": collection,
            "vectors": vectors,
            "embed_model": embed_model,
            "domain": domain,
            "source": source,
            "indexed_at": timestamp,
        }
    )

    save_metadata(data)

