import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://rugundu:vincent@localhost:5432/maasaidb')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'super-secret-key')
    PESAPAL_CONSUMER_KEY = os.getenv("PESAPAL_CONSUMER_KEY", "2EYi8Qt2PS2F0n8CwsB5Ere6vYtisZJl")
    PESAPAL_CONSUMER_SECRET = os.getenv("PESAPAL_CONSUMER_SECRET", "NuDfwSxa16CojrAmpj5cCxS8lDA=")
    PESAPAL_CALLBACK_URL = os.getenv("PESAPAL_CALLBACK_URL", "https://cybqa.pesapal.com/pesapalv3")
    PESAPAL_BASE_URL = "https://cybqa.pesapal.com/pesapalv3"