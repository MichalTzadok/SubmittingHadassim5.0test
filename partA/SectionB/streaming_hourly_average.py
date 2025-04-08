import pandas as pd
from datetime import datetime
from collections import defaultdict
import os


class StreamingHourlyAverager:
    def __init__(self):
        # Data storage for daily and global hourly averages
        self.daily_hourly_data = defaultdict(lambda: [0.0, 0])
        self.global_hourly_data = defaultdict(lambda: [0.0, 0])

    def validate_record(self, timestamp, value):
        """
        Validates the record:
        - Checks the date format.
        - Checks if the value is valid (non-null and numeric).
        """
        try:
            # Validate date format
            pd.to_datetime(timestamp)
        except Exception:
            print(f"Invalid timestamp: {timestamp}")
            return False

        if pd.isnull(value) or not isinstance(value, (int, float)):
            print(f"Invalid value: {value}")
            return False

        return True

    def process_record(self, timestamp, value):
        """
        Processes a single record: validates and updates averages.
        """
        if not self.validate_record(timestamp, value):
            return

        dt = pd.to_datetime(timestamp)
        # Key based on (date, hour)
        key = (dt.date(), dt.hour)
        self.daily_hourly_data[key][0] += value
        self.daily_hourly_data[key][1] += 1

        # Global key based only on hour
        self.global_hourly_data[dt.hour][0] += value
        self.global_hourly_data[dt.hour][1] += 1

    def get_daily_hourly_averages(self):
        """
        Returns daily hourly averages as a DataFrame.
        """
        data = []
        for (date, hour), (total, count) in sorted(self.daily_hourly_data.items()):
            start_time = datetime.combine(date, datetime.min.time()).replace(hour=hour)
            avg = total / count
            data.append({"date": date, "hour": hour, "start_time": start_time, "average": avg})
        return pd.DataFrame(data).sort_values(by=["date", "hour"])

    def get_global_hourly_averages(self):
        """
        Returns global hourly averages as a DataFrame.
        """
        data = []
        for hour, (total, count) in sorted(self.global_hourly_data.items()):
            avg = total / count
            data.append({"hour": hour, "average": avg})
        return pd.DataFrame(data)

    def save_to_csv(self, daily_file_path, global_file_path):
        """
        Saves the daily and global averages to CSV files.
        """
        daily_averages = self.get_daily_hourly_averages()
        daily_averages.to_csv(daily_file_path, index=False)
        print(f"Daily averages saved to {daily_file_path}")

        global_averages = self.get_global_hourly_averages()
        global_averages.to_csv(global_file_path, index=False)
        print(f"Global averages saved to {global_file_path}")


# Example usage
averager = StreamingHourlyAverager()

# Streaming data simulation
streaming_data = [
    {"timestamp": "2025-06-10 06:15:00", "value": 10},
    {"timestamp": "2025-06-10 06:45:00", "value": 11},
    {"timestamp": "2025-06-10 07:15:00", "value": 8},
    {"timestamp": "2025-06-11 06:00:00", "value": 9},
    {"timestamp": "2025-06-11 07:00:00", "value": 7},
    {"timestamp": "2025-06-10 07:00:00", "value": 7.5},  # Potential duplicate
    {"timestamp": "invalid_timestamp", "value": 5},  # Invalid timestamp
    {"timestamp": "2025-06-11 06:30:00", "value": None},  # Invalid value
]

for record in streaming_data:
    averager.process_record(record["timestamp"], record["value"])

# Save to CSV
output_dir = "output"
os.makedirs(output_dir, exist_ok=True)

daily_file_path = os.path.join(output_dir, "daily_hourly_averages.csv")
global_file_path = os.path.join(output_dir, "global_hourly_averages.csv")

averager.save_to_csv(daily_file_path, global_file_path)
