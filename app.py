from flask import Flask, render_template

# Initialize the Flask application
app = Flask(__name__)

@app.route('/')
@app.route('/home')
def index():
    """
    Renders the main landing page.
    """
    return render_template('index.html')

if __name__ == '__main__':
    # Runs the app in debug mode for local development
    app.run(debug=True)
