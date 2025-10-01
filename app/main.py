import os
from flask import Flask, render_template, request, redirect, url_for, flash

from smash import get_player_data, get_color_for_name, process_match_report, add_player

# Initialize the Flask application
app = Flask(__name__)
app.secret_key = os.urandom(24) # Necessary for flash messaging

@app.route('/')
@app.route('/home')
@app.route('/index')
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
        winner_str = request.form.get("winner")
        loser_str = request.form.get("loser")

        success, message = process_match_report(winner_str, loser_str)

        if success:
            flash(message, 'success')
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

    return render_template("media-viewer.html", filename=filename, title=f"Viewing {filename}")


if __name__ == '__main__':
    # Runs the app in debug mode for local development
    app.run(debug=True)