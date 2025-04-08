import pandas as pd
from collections import Counter
import heapq
import os

def convert_excel_to_csv(excel_file, csv_file):
    """Converts a large Excel file to CSV for faster reading"""
    df = pd.read_excel(excel_file, header=None)  # Read the Excel file
    df.to_csv(csv_file, index=False, header=False)  # Convert to CSV
    print(f"File successfully converted to CSV: {csv_file}")

def process_log_file_in_chunks(file_path, chunksize=10000):
    """Reads the CSV file in chunks and counts error codes"""
    error_counts = Counter()

    # Read in small chunks
    for chunk in pd.read_csv(file_path, header=None, chunksize=chunksize):
        for line in chunk[0].astype(str):  # Convert all lines to strings
            if "Error:" in line:
                error_code = line.split("Error:")[-1].strip()  # Extract error code
                error_counts[error_code] += 1

    return error_counts

def top_n_errors(error_counts, N):
    """Returns the N most common error codes"""
    return heapq.nlargest(N, error_counts.items(), key=lambda x: x[1])

# File names
excel_file = "logs.txt.xlsx"  # Excel file
csv_file = "logs.txt.csv"  # CSV file

# If the CSV file doesn't exist or the Excel file is larger than 100MB, convert it to CSV
if not os.path.exists(csv_file) or os.path.getsize(excel_file) > 100 * 1024 * 1024:
    convert_excel_to_csv(excel_file, csv_file)

N = 5  # The number of most common error codes

# Read and process the file in chunks
error_counts = process_log_file_in_chunks(csv_file)

# Find the most common errors
top_errors = top_n_errors(error_counts, N)

# Print the results
print("\nMost common error codes:")
for error, count in top_errors:
    print(f"{error}: {count}")
