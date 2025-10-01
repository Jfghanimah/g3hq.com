# g3hq.com

This is a Flask-based web application [https://g3hq.com] designed as a central hub for the G3. It provides various tools and services to track stats, share content, and connect.

## Features

-   **Smash Bros. Rankings**: An Elo-based ranking system for Super Smash Bros. Ultimate matches.
-   **Match Reporting**: A form to report match outcomes and automatically update player ratings.
-   **Player Management**: A simple interface to add new players to the ranking system.
-   **Media Share**: A gallery to view and share video clips.
-   **Custom Error Pages**: Styled, user-friendly pages for 404, 500, and other HTTP errors.

## Local Development Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/g3hq.com.git
    cd g3hq.com
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate
    
    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    *(Note: It's recommended to create a `requirements.txt` file for this. See suggestions below.)*
    ```bash
    pip install Flask python-dotenv
    ```

4.  **Configure environment variables:**
    Copy the `.env.example` file to a new file named `.env` and customize the values if needed.
    ```bash
    cp .env.example .env
    ```

5.  **Create data and media files:**
    -   Create an `elos.csv` file in the root directory with the headers: `Name,Character,Rating,Confidence`.
    -   Create the `app/static/media/` directory and place any video files you want to share inside it.

6.  **Run the application:**
    ```bash
    flask run
    ```
    The application will be available at `http://127.0.0.1:5000`.
