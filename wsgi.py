from app.main import app

if __name__ == "__main__":
    # This allows you to run the app using `python wsgi.py` for development
    # The main purpose is for the WSGI server to import the `app` object.
    app.run()