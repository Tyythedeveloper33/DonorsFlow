from flask import Blueprint, jsonify, request
from app.models import db, Donation, Donor, Subscription
from flask_login import current_user, login_required

subscription_routes = Blueprint('subscriptions', __name__)
@subscription_routes.route('/', methods=["POST"])
def create_subscription():
    try:
        # Extract the type and donor_id from the request body
        data = request.get_json()
        type = data.get('type')
        donor_id = data.get('donor_id')
        amount= data.get('amount')

        # Validate required fields
        if not type or not donor_id:
            return jsonify({"error": "Both 'type' and 'donor_id' are required"}), 400

        # Verify the donor exists
        donor = Donor.query.get(donor_id)
        if not donor:
            return jsonify({"error": "Donor not found"}), 404

        # Create the new subscription
        subscription = Subscription(
            type=type,
            donor_id=donor_id,
            amount=amount
        )

        # Save the subscription to the database
        db.session.add(subscription)
        db.session.commit()

        return jsonify(subscription.to_dict()), 201

    except Exception as e:
        print(f"Error creating subscription: {e}")
        return jsonify({"error": "An error occurred while creating the subscription"}), 500

@subscription_routes.route('/<int:id>', methods=["PUT"])
def update_subscription(id):
    try:
        # Extract the type and amount from the request body
        data = request.get_json()
        type = data.get('type')
        amount = data.get('amount')

        # Validate required fields
        if not type or amount is None:
            return jsonify({"error": "Both 'type' and 'amount' are required"}), 400

        # Fetch the subscription to update
        subscription = Subscription.query.get(id)
        if not subscription:
            return jsonify({"error": "Subscription not found"}), 404

        # Update the subscription fields
        if type:
            subscription.type = type
        if amount is not None:
            subscription.amount = amount

        # Commit the changes to the database
        db.session.commit()

        # Return the updated subscription
        return jsonify(subscription.to_dict()), 200

    except Exception as e:
        print(f"Error updating subscription: {e}")
        return jsonify({"error": "An error occurred while updating the subscription"}), 500

@subscription_routes.route('/<int:id>', methods=["DELETE"])
def delete_subscription(id):
    try:
        # Find the subscription by ID
        subscription = Subscription.query.get(id)
        if not subscription:
            return jsonify({"error": "Subscription not found"}), 404

        # Delete the subscription
        db.session.delete(subscription)
        db.session.commit()

        # Return a success message
        return jsonify({"message": "Subscription deleted successfully"}), 200

    except Exception as e:
        print(f"Error deleting subscription: {e}")
        return jsonify({"error": "An error occurred while deleting the subscription"}), 500
