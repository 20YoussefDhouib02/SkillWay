import os
import json

def count_json_entries(directory):
    # Iterate over all files in the specified directory
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            file_path = os.path.join(directory, filename)
            with open(file_path, 'r', encoding='utf-8') as file:
                try:
                    data = json.load(file)
                    # Count the number of entries in the JSON data
                    entry_count = len(data)
                    print(f"{entry_count}")
                except json.JSONDecodeError:
                    print(f"Error decoding JSON from file: {filename}")
                except UnicodeDecodeError:
                    print(f"Unicode error while reading file: {filename}")

if __name__ == "__main__":
    current_directory = os.getcwd()
    count_json_entries(current_directory)
