import csv
import os
import time

import requests
from dotenv import load_dotenv

load_dotenv()

ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
ETHERSCAN_API_URL = os.getenv("ETHERSCAN_API_URL")

CONTRACTS_DIR = "downloaded_contracts"

if not os.path.exists(CONTRACTS_DIR):
    os.makedirs(CONTRACTS_DIR)


def get_contract_source(contract_address, api_key):
    params = {
        "module": "contract",
        "action": "getsourcecode",
        "address": contract_address,
        "apikey": api_key,
    }
    response = requests.get(ETHERSCAN_API_URL, params=params)
    return response.json()


def save_contract_source(filename, source_code):
    with open(filename, "w", encoding="utf-8") as file:
        file.write(source_code)


def read_last_processed():
    try:
        with open("last_processed.txt", "r") as file:
            return file.read().strip()
    except FileNotFoundError:
        return None


def save_last_processed(contract_address):
    with open("last_processed.txt", "w") as file:
        file.write(contract_address)


def process_contracts():
    last_processed = read_last_processed()
    start_processing = not bool(last_processed)

    with open(
        r"C:\python\documentation-helper\contracts.csv",
        mode="r",
        newline="",
        encoding="utf-8",
    ) as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            if start_processing or last_processed == row["ContractAddress"]:
                start_processing = True
                print(
                    f"Processing contract: {row['ContractName']} at {row['ContractAddress']}"
                )
                response = get_contract_source(
                    row["ContractAddress"], ETHERSCAN_API_KEY
                )

                if response["status"] == "1" and response["result"]:
                    source_code = response["result"][0]["SourceCode"]
                    filename = os.path.join(
                        CONTRACTS_DIR,
                        f"{row['ContractName']}_{row['ContractAddress']}.sol",
                    )
                    save_contract_source(filename, source_code)
                    print(f"Contract {row['ContractName']} saved.")
                else:
                    print(
                        f"Failed to fetch source code for {row['ContractName']} at {row['ContractAddress']}."
                    )

                save_last_processed(row["ContractAddress"])
                time.sleep(
                    0.3
                )  # rate limit of etherscan 5 requests per second for free tiers - threshold to avoid rate limit
        print((f"Iam done with number of {len(row)} verified contract"))


if __name__ == "__main__":
    process_contracts()
