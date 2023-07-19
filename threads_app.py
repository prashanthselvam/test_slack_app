import sqlite3
import uuid

# Replace 'mydatabase.db' with the name of your SQLite database file
database_file = "frontend/prisma/dev.db"


def insert_favorite_thread(user, content, link, reply_count, timestamp):
    # Connect to the SQLite database or create one if it doesn't exist
    connection = sqlite3.connect(database_file)

    # Create a cursor object to execute SQL commands
    cursor = connection.cursor()

    # Generate a UUID for the 'id' column
    new_id = str(uuid.uuid4())

    # Define the raw SQL insert query
    insert_query = """
            INSERT INTO FavoriteThreads (id, user, content, link, 
            reply_count, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        """

    # Execute the raw SQL query with the provided values
    cursor.execute(
        insert_query,
        (new_id, user, content, link, reply_count, timestamp),
    )
    connection.commit()
    connection.close()


# Example usage:
# link = 'https://example.com/thread/123'
# timestamp = '2023-07-16 12:34:56'
# content = 'This is a sample thread.'
# user = 'JohnDoe'
#
# insert_favorite_thread(link, timestamp, content, user)
