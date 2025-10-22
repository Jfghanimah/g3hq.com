import os
from flask import Flask, render_template, request, redirect, url_for, flash
from markupsafe import Markup

from .smash import get_player_data, get_color_for_name, process_match_report, add_player
from .error_handler import handle_error

# Initialize the Flask application
app = Flask(__name__)

# Load configuration from environment variables
# SECRET_KEY is crucial for session security (flash messages).
# Use a default for local dev, but set a strong, stable key in production.
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-should-be-changed')
app.config['SMASH_PASSPHRASE'] = os.environ.get('SMASH_PASSPHRASE', 'G3')

# Define the path for the shared clipboard file within the instance folder
CLIPBOARD_FILE = os.path.join(app.instance_path, 'clipboard.txt')

# Ensure the instance folder exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass
@app.route('/home')
@app.route('/index')
@app.route('/')
def home():
    """Renders the main landing page."""
    return render_template('home.html')


@app.route("/smash")
def smash():
    """Reads Smash Elo data, adds a unique color to each player, sorts, and renders the page."""
    players = get_player_data()
    # Add a unique, consistent color to each player based on their name
    for player in players:
        player['color'] = get_color_for_name(player['Name'])
        
    sorted_players = sorted(players, key=lambda player: player['Rating'], reverse=True)
    return render_template("smash.html", players=sorted_players, title="Smash Ranks")


@app.route("/smash/report", methods=["GET", "POST"])
def smash_report():
    """Handles both displaying the match report form and processing the submitted data."""
    if request.method == "POST":
        passphrase_submitted = request.form.get("passphrase")
        if passphrase_submitted != app.config['SMASH_PASSPHRASE']:
            flash("Invalid passphrase. Please try again.", 'danger')
            return redirect(url_for('smash_report'))

        winner_str = request.form.get("winner")
        loser_str = request.form.get("loser")

        success, message = process_match_report(winner_str, loser_str)

        if success:
            flash(Markup(message), 'success')
            return redirect(url_for('smash'))
        else:
            flash(message, 'danger')
            return redirect(url_for('smash_report'))

    # For a GET request, display the form
    players = get_player_data()
    sorted_players = sorted(players, key=lambda player: (player['Name'], player['Character']))
    return render_template("smash-report.html", players=sorted_players, title="Report a Match")


@app.route("/smash/add", methods=["GET", "POST"])
def smash_add_player():
    """Handles both displaying the add player form and processing the submission."""
    if request.method == "POST":
        player_name = request.form.get("name")
        player_char = request.form.get("character")

        success, message = add_player(player_name, player_char)

        if success:
            flash(message, 'success')
            return redirect(url_for('smash'))
        else:
            flash(message, 'danger')
            return redirect(url_for('smash_add_player'))

    return render_template("smash-add.html", title="Add a Player")


@app.route('/clipboard', methods=['GET', 'POST'])
def clipboard():
    """Displays and handles updates to a shared clipboard."""
    if request.method == 'POST':
        content = request.form.get('content', '')
        try:
            with open(CLIPBOARD_FILE, 'w', encoding='utf-8') as f:
                f.write(content)
            flash('Clipboard updated successfully!', 'success')
        except IOError as e:
            # Log the error for debugging
            app.logger.error(f"Error writing to clipboard file: {e}")
            flash('Error: Could not update the clipboard.', 'danger')
        return redirect(url_for('clipboard'))

    # For a GET request, read the content and display the page
    content = ''
    if os.path.exists(CLIPBOARD_FILE):
        try:
            with open(CLIPBOARD_FILE, 'r', encoding='utf-8') as f:
                content = f.read()
        except IOError as e:
            app.logger.error(f"Error reading clipboard file: {e}")
            flash('Error: Could not read the clipboard content.', 'danger')
            
    return render_template('clipboard.html', content=content, title='Shared Clipboard')

@app.route("/media")
def media_share():
    """Renders a page listing available videos from the static/media directory."""
    media_dir = os.path.join(app.static_folder, 'media')
    videos = []

    # Ensure the media directory exists
    if os.path.exists(media_dir):
        # Supported video extensions
        supported_extensions = ('.mp4', '.webm', '.mov', '.ogg')
        
        for filename in sorted(os.listdir(media_dir)):
            if filename.lower().endswith(supported_extensions):
                videos.append(filename)
    else:
        # If the directory doesn't exist, create it.
        os.makedirs(media_dir)

    return render_template("media.html", videos=videos, title="Media Share")


def get_video_mimetype(filename):
    """Returns the MIME type for a given video filename based on its extension."""
    ext_map = {
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.ogg': 'video/ogg',
        '.mov': 'video/quicktime'
    }
    return ext_map.get(os.path.splitext(filename)[1].lower())

@app.route("/media/<path:filename>")
def media_viewer(filename):
    """Renders a page to view a single video."""
    # Basic security: ensure the file exists in the media directory
    media_dir = os.path.join(app.static_folder, 'media')
    filepath = os.path.join(media_dir, filename)

    # Check if the file exists and is within the intended directory
    if not os.path.exists(filepath) or not os.path.abspath(filepath).startswith(os.path.abspath(media_dir)):
        flash("Video not found or access denied.", "danger")
        return redirect(url_for('media_share'))

    video_type = get_video_mimetype(filename)

    return render_template("media-viewer.html", filename=filename, video_type=video_type, title=f"Viewing {filename}")


# Register custom error handlers
app.register_error_handler(403, handle_error)
app.register_error_handler(404, handle_error)
app.register_error_handler(500, handle_error)

if __name__ == '__main__':
    # Runs the app in debug mode for local development
    app.run(debug=True)