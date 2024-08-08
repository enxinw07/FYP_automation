import pandas as pd

# Load the Excel file
excel_file = 'human-written-review.xlsx'
sheet_name = 'Sheet1'

# Read the Excel file
data = pd.read_excel(excel_file, sheet_name=sheet_name)

# Save it as a CSV file
csv_file = 'movie_reviews.csv'
data.to_csv(csv_file, index=False)

print(f"Excel file has been successfully converted to {csv_file}")
