import json
import os

import weaviate
from colorama import Fore, Style, init
from dotenv import load_dotenv
from langchain.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import Language, RecursiveCharacterTextSplitter
from tqdm import tqdm

from constants import HTMLS_DIR

load_dotenv()

htmls_directory = HTMLS_DIR

client = weaviate.Client("http://localhost:8080")


def create_schema():
    existing_classes = client.schema.get()["classes"]
    class_names = [cls["class"] for cls in existing_classes]

    if "SmartContract" in class_names:
        print(
            f"{Fore.YELLOW}Class 'SmartContract' already exists in Weaviate schema.{Style.RESET_ALL}"
        )
    else:
        schema = {
            "classes": [
                {
                    "class": "SmartContract",
                    "description": "A class for storing smart contracts with vectorization",
                    "vectorizer": "text2vec-contextionary", 
                    "moduleConfig": {
                        "text2vec-contextionary": {"model": "ada", "type": "text"}
                    }, 
                    "properties": [
                        {
                            "name": "text",
                            "dataType": ["text"],
                            "moduleConfig": {
                                "text2vec-contextionary": {
                                    "skip": False,
                                    "vectorizePropertyName": False,
                                }
                            },
                            "description": "The content of the smart contract",
                        },
                        {
                            "name": "source",
                            "dataType": ["string"],
                            "description": "The source or origin of the smart contract",
                        },
                    ],
                }
            ]
        }
        client.schema.create(schema)
        print(
            f"{Fore.GREEN}Schema 'SmartContract' created successfully.{Style.RESET_ALL}"
        )


def load_progress():
    try:
        with open("progress_html.json", "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return {"last_index": -1}


def save_progress(last_index):
    with open("progress_html.json", "w") as file:
        json.dump({"last_index": last_index}, file)


def ingest_docs() -> None:
    progress = load_progress()
    start_index = progress["last_index"] + 1

    loader = DirectoryLoader(
        htmls_directory,
        glob="**/*.html",
        use_multithreading=True,
        show_progress=True,
        loader_cls=TextLoader,
    )
    raw_documents = loader.load()

    print(f"{Fore.GREEN}Found {len(raw_documents)} contract files{Style.RESET_ALL}")

    sol_splitter = RecursiveCharacterTextSplitter(
        chunk_size=400, chunk_overlap=50, separators=["\n\n", "\n", " ", ""]
    )

    documents = sol_splitter.split_documents(documents=raw_documents)
    print(f"{Fore.GREEN}Splitted into {len(documents)} chunks{Style.RESET_ALL}")

    for i in tqdm(
        range(start_index, len(documents)), desc="Processing", colour="green"
    ):
        doc = documents[i]
        page_content = doc.page_content if hasattr(doc, "page_content") else ""
        source = doc.metadata.get("source", "") if hasattr(doc, "metadata") else ""

        data_object = {
            "text": page_content,
            "source": source,
        }

        try:
            # print(f"{Fore.GREEN}Adding document at index {i}")
            client.data_object.create(data_object, class_name="SmartContract")
            save_progress(i)
        except Exception as e:
            print(
                f"{Fore.RED}Failed to insert document at index {i}: {e}{Style.RESET_ALL}"
            )

            break
            # continue

    print(f"{Fore.BLUE}****** Added documents to Weaviate ******{Style.RESET_ALL}")


if __name__ == "__main__":
    init()  # colorama
    create_schema()
    ingest_docs()
