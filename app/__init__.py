from flask import Flask, render_template
from app.extensions import db, ma
from app.api import api_bp
from app.config import DevelopmentConfig

def create_app(config_class=DevelopmentConfig):
    """
    Factory function to create the Flask application.

    Args:
        config_class (object): The configuration class to use for the application.

    Returns:
        Flask: The created Flask application.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    app.register_blueprint(api_bp)
    register_extensions(app)
    
    @app.route('/')
    def index():
        return render_template('index.html')
    
    return app


def register_extensions(app):
    db.init_app(app)
    ma.init_app(app)