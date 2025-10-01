from flask import Flask, render_template, request, redirect, url_for

from smash import get_player_data, get_color_for_name, process_match_report

# Initialize the Flask application
app = Flask(__name__)

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

        # Call the new logic function from smash.py
        success, message = process_match_report(winner_str, loser_str)

        if not success:
            # For now, just return the error message.
            # In the future, this could use Flask's flash messaging.
            return message, 400
        
        return redirect(url_for('smash'))

    # For a GET request
    players = get_player_data()
    sorted_players = sorted(players, key=lambda player: (player['Name'], player['Character']))
    return render_template("smash-report.html", players=sorted_players, title="Report a Match")


if __name__ == '__main__':
    # Runs the app in debug mode for local development
    app.run(debug=True)