import pandas as pd
import requests
import time


API_URL = "https://api.zerogpt.com/api/detect/detectText"
API_KEY = "c8bb2a4e-3ef7-4770-8064-796a7d7af192"

reviews_df = pd.read_csv('movie_reviews.csv', skiprows=1, names=["title", "year", "genre", "review"])

def check_review_with_gptzero(review_text):
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    data = {
        'text': review_text
    }
    response = requests.post(API_URL, json=data, headers=headers)
    response.raise_for_status()
    return response.json()

results = []
for index, row in reviews_df.iterrows():
    review = row['review']
    try:
        result = check_review_with_gptzero(review)
        results.append(result)
        time.sleep(1)
    except Exception as e:
        print(f"Error processing review at index {index}: {e}")
        results.append({'error': str(e)})

reviews_df['gptzero_result'] = results
reviews_df.to_csv('movie_reviews_with_gptzero_results.csv', index=False)

print("Results saved to movie_reviews_with_gptzero_results.csv")
