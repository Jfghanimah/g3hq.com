from flask import render_template

def handle_error(e):
    """
    Custom error handler for HTTP status codes.
    Renders a styled error page with context-specific messages.
    """
    # In case of a 500 error, the original exception is in e.original_exception
    # We can log it here for debugging if needed.
    # For example: current_app.logger.error(f"Server Error: {e.original_exception}")

    code = e.code if hasattr(e, 'code') else 500
    name = e.name if hasattr(e, 'name') else 'Internal Server Error'
    description = e.description if hasattr(e, 'description') else 'An unexpected error has occurred.'

    context = {
        'code': code,
        'message': name,
        'description': description
    }

    if code == 403:
        context['message'] = "Access Forbidden"
        context['description'] = "You don't have permission to access this page."
    elif code == 404:
        context['message'] = "Page Not Found"
        context['description'] = "The page you are looking for does not exist. It might have been moved or deleted."
    elif code == 500:
        context['message'] = "Something Went Wrong"
        context['description'] = "We're experiencing some trouble on our end. Please try again later."

    return render_template('error.html', **context), code