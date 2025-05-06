import uuid
import logging
import os
import requests
from requests_oauthlib import OAuth1
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from extensions import db
from models import User, News, ContactMessage, WarriorApplication, Product, Order
from decorators import admin_required

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Configure Pesapal credentials
PESAPAL_CONSUMER_KEY = os.getenv("PESAPAL_CONSUMER_KEY", "2EYi8Qt2PS2F0n8CwsB5Ere6vYtisZJl")
PESAPAL_CONSUMER_SECRET = os.getenv("PESAPAL_CONSUMER_SECRET", "NuDfwSxa16CojrAmpj5cCxS8lDA=")
PESAPAL_BASE_URL = os.getenv("PESAPAL_BASE_URL", "https://cybqa.pesapal.com/pesapalv3")

# Enable CORS for all API routes
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize Logging
logging.basicConfig(level=logging.DEBUG)

@app.route("/")
def index():
    return "Flask server is running!"

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
jwt = JWTManager(app)


# ------------------------------
# Request Parsers
# ------------------------------

warrior_parser = reqparse.RequestParser()
warrior_parser.add_argument("name", type=str, required=True, help="Name is required")
warrior_parser.add_argument("age", type=int, required=True, help="Age is required")
warrior_parser.add_argument("email", type=str, required=True, help="Email is required")
warrior_parser.add_argument("phone", type=str, required=True, help="Phone number is required")
warrior_parser.add_argument("reason", type=str, required=True, help="Reason is required")

register_parser = reqparse.RequestParser()
register_parser.add_argument("username", type=str, required=True, help="Username is required")
register_parser.add_argument("email", type=str, required=True, help="Email is required")
register_parser.add_argument("password", type=str, required=True, help="Password is required")
register_parser.add_argument("role", type=str, default="user")

login_parser = reqparse.RequestParser()
login_parser.add_argument("username", type=str, required=True, help="Username is required")
login_parser.add_argument("password", type=str, required=True, help="Password is required")

news_parser = reqparse.RequestParser()
news_parser.add_argument("title", type=str, required=True, help="Title is required")
news_parser.add_argument("content", type=str, required=True, help="Content is required")
news_parser.add_argument("image_url", type=str, required=False, help="Image URL is optional")

contact_parser = reqparse.RequestParser()
contact_parser.add_argument("name", type=str, required=True, help="Name is required")
contact_parser.add_argument("email", type=str, required=True, help="Email is required")
contact_parser.add_argument("subject", type=str, required=True, help="Subject is required")
contact_parser.add_argument("message", type=str, required=True, help="Message is required")


# ------------------------------
# Resources
# ------------------------------

class WarriorApplicationResource(Resource):
    def options(self):
        return {}, 200

    def post(self):
        data = warrior_parser.parse_args()
        try:
            application = WarriorApplication(**data)
            db.session.add(application)
            db.session.commit()
            return {"message": "Warrior application submitted successfully!"}, 201
        except Exception as e:
            app.logger.error("Database Error: %s", str(e), exc_info=True)
            return {"error": "Internal Server Error"}, 500


class UserRegister(Resource):
    def options(self):
        return {}, 200

    def post(self):
        data = register_parser.parse_args()
        if User.query.filter((User.username == data["username"]) | (User.email == data["email"])).first():
            return {"message": "User with that username or email already exists"}, 400

        user = User(username=data["username"], email=data["email"], role=data["role"])
        user.set_password(data["password"])

        try:
            db.session.add(user)
            db.session.commit()
            return {"message": "User registered successfully"}, 201
        except Exception as e:
            app.logger.error("Error registering user: %s", str(e), exc_info=True)
            return {"error": "Internal Server Error"}, 500


class UserLogin(Resource):
    def options(self):
        return {}, 200

    def post(self):
        data = login_parser.parse_args()
        user = User.query.filter_by(username=data["username"]).first()
        if not user or not user.check_password(data["password"]):
            return {"message": "Invalid credentials"}, 401
        access_token = create_access_token(identity={"id": user.id, "role": user.role})
        return {"access_token": access_token}, 200







class CheckoutResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        total = data.get("total")
        items = data.get("items")

        # Validate required fields
        if not total or not isinstance(total, (int, float)) or total <= 0:
            return {"message": "Invalid checkout data"}, 400

        # Generate a unique merchant reference for the order
        reference = str(uuid.uuid4())

        # Step 1: Get Pesapal Access Token
        auth_url = f"{PESAPAL_BASE_URL}/api/Auth/RequestToken"
        auth_payload = {
            "consumer_key": PESAPAL_CONSUMER_KEY,
            "consumer_secret": PESAPAL_CONSUMER_SECRET
        }
        auth_headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        try:
            auth_response = requests.post(auth_url, json=auth_payload, headers=auth_headers)
            if auth_response.status_code != 200:
                app.logger.error("Pesapal Auth Error: %s", auth_response.text)
                return {"error": "Pesapal Authentication Failed"}, 500
            auth_data = auth_response.json()
            access_token = auth_data.get("token") or auth_data.get("access_token")
            if not access_token:
                app.logger.error("Pesapal Auth Error: No token returned. Full response: %s", auth_response.text)
                return {"error": "Pesapal Authentication Failed"}, 500
        except Exception as e:
            app.logger.error("Pesapal Auth Exception: %s", str(e), exc_info=True)
            return {"error": "Pesapal Authentication Exception"}, 500

        # Step 2: Prepare Order Data for SubmitOrderRequest
        order_data = {
            "id": reference,
            "currency": "USD",  # Update this if needed
            "amount": float(total),
            "description": "Purchase from Maasai Legacy",
            "callback_url": app.config.get("PESAPAL_CALLBACK_URL"),
            "notification_id": app.config.get("PESAPAL_NOTIFICATION_ID"),
            "redirect_mode": "TOP_WINDOW",
            "billing_address": {
                "email_address": "customer@example.com",
                "phone_number": "0712345678",
                "country_code": "KE",
                "first_name": "Customer",
                "middle_name": "",
                "last_name": "Test",
                "line_1": "Street 123",
                "line_2": "",
                "city": "Nairobi",
                "state": "",
                "postal_code": "",
                "zip_code": ""
            }
        }

        # Step 3: Submit Order Request to Pesapal
        submit_url = f"{PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest"
        submit_headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        try:
            submit_response = requests.post(submit_url, json=order_data, headers=submit_headers)
            if submit_response.status_code == 200:
                submit_data = submit_response.json()
                redirect_url = submit_data.get("redirect_url")
                if redirect_url:
                    return {"redirectUrl": redirect_url}, 200
                else:
                    app.logger.error("Pesapal SubmitOrderRequest Error: %s", submit_response.text)
                    return {"error": "Pesapal Order Submission Failed"}, 500
            else:
                app.logger.error("Pesapal SubmitOrderRequest Error: %s", submit_response.text)
                return {"error": "Pesapal Order Submission Failed"}, 500
        except Exception as e:
            app.logger.error("Pesapal SubmitOrderRequest Exception: %s", str(e), exc_info=True)
            return {"error": "Pesapal Order Submission Exception"}, 500



class ContactResource(Resource):
    def options(self):
        return {}, 200

    def post(self):
        data = contact_parser.parse_args()
        try:
            contact_msg = ContactMessage(**data)
            db.session.add(contact_msg)
            db.session.commit()
            return {"message": "Contact message submitted successfully!"}, 201
        except Exception as e:
            app.logger.error("Error submitting contact message: %s", str(e), exc_info=True)
            return {"error": "Internal Server Error"}, 500
# ------------------------------
# News Resource
# ------------------------------

class NewsResource(Resource):
    def options(self, news_id=None):
        return {}, 200

    def get(self, news_id=None):
        try:
            if news_id:
                news = News.query.get(news_id)
                if not news:
                    return {"message": "News article not found"}, 404
                return {
                    "id": news.id,
                    "title": news.title,
                    "content": news.content,
                    "image_url": news.image_url,
                    "created_at": news.created_at.strftime("%Y-%m-%d %H:%M:%S")
                }, 200

            news_list = News.query.all()
            return {
                "news": [
                    {
                        "id": n.id,
                        "title": n.title,
                        "content": n.content,
                        "image_url": n.image_url,
                        "created_at": n.created_at.strftime("%Y-%m-%d %H:%M:%S")
                    } for n in news_list
                ]
            }, 200
        except Exception as e:
            app.logger.error("Error fetching news: %s", str(e), exc_info=True)
            return {"error": "Internal Server Error"}, 500

    @admin_required
    def post(self):
        data = request.get_json()
        if not data.get("title") or not data.get("content"):
            return {"message": "Title and content are required"}, 400

        try:
            new_news = News(
                title=data["title"],
                content=data["content"],
                image_url=data.get("image_url")
            )
            db.session.add(new_news)
            db.session.commit()
            return {"message": "News article created successfully!"}, 201
        except Exception as e:
            app.logger.error("Error creating news: %s", str(e), exc_info=True)
            return {"error": "Internal Server Error"}, 500

    @admin_required
    def put(self, news_id):
        data = request.get_json()
        news = News.query.get(news_id)
        if not news:
            return {"message": "News article not found"}, 404

        if not data.get("title") or not data.get("content"):
            return {"message": "Title and content are required"}, 400

        try:
            news.title = data.get("title", news.title)
            news.content = data.get("content", news.content)
            news.image_url = data.get("image_url", news.image_url)
            db.session.commit()
            return {"message": "News article updated successfully!"}, 200
        except Exception as e:
            app.logger.error("Error updating news: %s", str(e), exc_info=True)
            return {"error": "Internal Server Error"}, 500

    @admin_required
    def delete(self, news_id):
        news = News.query.get(news_id)
        if not news:
            return {"message": "News article not found"}, 404

        try:
            db.session.delete(news)
            db.session.commit()
            return {"message": "News article deleted successfully!"}, 200
        except Exception as e:
            app.logger.error("Error deleting news: %s", str(e), exc_info=True)
            return {"error": "Internal Server Error"}, 500


# ------------------------------
# Product Resource
# ------------------------------

class ProductResource(Resource):
    def options(self):
        return {}, 200

    def get(self):
        try:
            products = Product.query.all()
            result = [
                {
                    "id": p.id,
                    "name": p.name,
                    "price": p.price,
                    "description": p.description,
                    "image_url": p.image_url
                } for p in products
            ]
            return {"products": result}, 200
        except Exception as e:
            app.logger.error("Error fetching products: %s", str(e), exc_info=True)
            return {"error": "Internal Server Error"}, 500

    @admin_required
    def post(self):
        data = request.get_json()
        if not data.get("name") or not data.get("price") or not data.get("description"):
            return {"message": "Name, price, and description are required"}, 400

        try:
            product = Product(
                name=data["name"],
                price=data["price"],
                description=data["description"],
                image_url=data.get("image_url")
            )
            db.session.add(product)
            db.session.commit()
            return {"message": "Product created successfully!"}, 201
        except Exception as e:
            app.logger.error("Error creating product: %s", str(e), exc_info=True)
            return {"error": "Internal Server Error"}, 500

    @admin_required
    def put(self, product_id):
        data = request.get_json()
        product = Product.query.get(product_id)
        if not product:
            return {"message": "Product not found"}, 404

        try:
            product.name = data.get("name", product.name)
            product.price = data.get("price", product.price)
            product.description = data.get("description", product.description)
            product.image_url = data.get("image_url", product.image_url)
            db.session.commit()
            return {"message": "Product updated successfully!"}, 200
        except Exception as e:
            app.logger.error("Error updating product: %s", str(e), exc_info=True)
            return {"error": "Internal Server Error"}, 500

    @admin_required
    def delete(self, product_id):
        product = Product.query.get(product_id)
        if not product:
            return {"message": "Product not found"}, 404

        try:
            db.session.delete(product)
            db.session.commit()
            return {"message": "Product deleted successfully!"}, 200
        except Exception as e:
            app.logger.error("Error deleting product: %s", str(e), exc_info=True)
            return {"error": "Internal Server Error"}, 500


# ------------------------------
# Admin Dashboard Resource
# ------------------------------

class AdminDashboardResource(Resource):
    @admin_required
    def get(self):
        try:
            # Fetch news and products directly from the database
            news_list = News.query.all()
            products_list = Product.query.all()

            # Prepare the response data
            news_data = [
                {
                    "id": n.id,
                    "title": n.title,
                    "content": n.content,
                    "image_url": n.image_url,
                    "created_at": n.created_at.strftime("%Y-%m-%d %H:%M:%S")
                } for n in news_list
            ]

            products_data = [
                {
                    "id": p.id,
                    "name": p.name,
                    "price": float(p.price),  # Ensure price is serialized as a float
                    "description": p.description,
                    "image_url": p.image_url
                } for p in products_list
            ]

            return jsonify({"news": news_data, "products": products_data}), 200
        except Exception as e:
            app.logger.error("Error fetching admin dashboard data: %s", str(e), exc_info=True)
            return jsonify({"error": "Internal Server Error"}), 500
        
# Endpoint Registrations
# ------------------------------
api.add_resource(WarriorApplicationResource, "/api/warrior-application")
api.add_resource(UserRegister, "/api/signup")
api.add_resource(UserLogin, "/api/login")
api.add_resource(ProductResource, "/api/product", "/api/product/<int:product_id>")
api.add_resource(CheckoutResource, "/api/checkout")
api.add_resource(NewsResource, "/api/news", "/api/news/<int:news_id>")
api.add_resource(AdminDashboardResource, "/api/admin/dashboard")
api.add_resource(ContactResource, "/api/contact")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)