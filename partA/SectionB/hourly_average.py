import pandas as pd
import dask.dataframe as dd
import sys
import os
from datetime import datetime


def load_and_clean_data(file_path):
    """
    Loads and cleans data from an Excel or Parquet file:
    - Converts 'timestamp' to datetime.
    - Removes duplicates, missing values, and ensures 'value' is numeric.
    """
    if file_path.endswith(".xlsx") or file_path.endswith(".xls"):
        df = pd.read_excel(file_path, parse_dates=['timestamp'])
    elif file_path.endswith(".parquet"):
        df = pd.read_parquet(file_path)
    else:
        raise ValueError("Unsupported file format. Please use Excel or Parquet.")

    if not pd.api.types.is_datetime64_any_dtype(df['timestamp']):
        try:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
        except Exception as e:
            raise ValueError(f"Error converting 'timestamp' column: {e}")

    if df.duplicated().sum() > 0:
        print("Warning: Duplicate rows found – removing them.")
        df = df.drop_duplicates()

    if df.isnull().sum().sum() > 0:
        print("Warning: Missing values found – removing rows.")
        df = df.dropna()

    if not pd.api.types.is_numeric_dtype(df['value']):
        print("Warning: Non-numeric values found in 'value' column – removing rows.")
        df = df[pd.to_numeric(df['value'], errors='coerce').notnull()]
        df['value'] = pd.to_numeric(df['value'])

    return df


def compute_hourly_averages(df):
    """
    Computes hourly averages for the 'value' column based on the 'timestamp'.
    """
    df['hour'] = df['timestamp'].dt.hour
    result = df.groupby('hour')['value'].mean().reset_index()
    result.columns = ['hour', 'average']
    return result


def split_and_process_daily(df, output_dir):
    """
    Splits data by day, computes hourly averages, and saves daily and overall averages to CSV files.
    """
    df['date'] = df['timestamp'].dt.date
    os.makedirs(output_dir, exist_ok=True)
    results = []

    for date, group in df.groupby('date'):
        daily_df = group.drop(columns='date')
        hourly_avg = compute_hourly_averages(daily_df)
        results.append(hourly_avg)

        date_str = date.strftime('%Y-%m-%d') if isinstance(date, datetime) else str(date)
        daily_file = os.path.join(output_dir, f"hourly_avg_{date_str}.csv")
        hourly_avg.to_csv(daily_file, index=False)

    final_df = pd.concat(results)
    overall_hourly_avg = final_df.groupby('hour')['average'].mean().reset_index()
    overall_hourly_avg.columns = ['hour', 'average']
    overall_hourly_avg.to_csv(os.path.join(output_dir, "overall_hourly_averages.csv"), index=False)
    final_df.to_csv(os.path.join(output_dir, "final_hourly_averages.csv"), index=False)

    return final_df


def main():
    """
    Main function to load data, compute hourly averages, and save results.
    """
    if len(sys.argv) < 2:
        print("Usage: python validate_data.py <file_path>")
        sys.exit(1)

    file_path = sys.argv[1]

    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        sys.exit(1)

    try:
        df = load_and_clean_data(file_path)
        print("\nData loaded successfully!")
        print(f"Number of rows: {len(df)}")
        print(f"Columns: {list(df.columns)}")
        print("\nPreview:")
        print(df.head(5))

        print("\nComputing hourly averages by day...")
        output_dir = "output_averages"
        final = split_and_process_daily(df, output_dir)
        print(f"\nDone. Final averages written to '{output_dir}/final_hourly_averages.csv'")

    except Exception as e:
        print(f"\nError: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()