from flask import Blueprint, jsonify, request
from app.models import db, Donation, Donor, Subscription
from flask_login import current_user, login_required

donation_routes = Blueprint('donations', __name__)

# Create a new donation
@donation_routes.route('/', methods=["POST"])
def add_donation():
    """
    Add a new donation to the system.
    """
    data = request.get_json()

    # Validate required fields
    if not all(key in data for key in ['donor_id', 'amount']):
        return jsonify({'error': 'Missing required fields: donor_id or amount'}), 400

    try:
        # Create a new donation object
        new_donation = Donation(
            donor_id=data['donor_id'],
            amount=float(data['amount']),
        )

        # Add and commit to the database
        db.session.add(new_donation)
        db.session.commit()

        return jsonify(new_donation.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Update a donation
@donation_routes.route('/<int:id>', methods=['PUT'])
def update_donation(id):
    """
    Update donation details.
    """
    donation = Donation.query.get_or_404(id)
    data = request.get_json()

    # Update donation's properties
    donation.amount = data.get('amount', donation.amount)
    donation.frequency = data.get('frequency', donation.frequency)
    donation.donor_email = data.get('donor_email', donation.donor_email)
    donation.donor_phone = data.get('donor_phone', donation.donor_phone)

    db.session.commit()
    return jsonify(donation.to_dict())

# View a specific donation
@donation_routes.route('/<int:id>', methods=['GET'])
def view_donation(id):
    """
    View a specific donation.
    """
    donation = Donation.query.get_or_404(id)
    return jsonify(donation.to_dict())

# Delete a donation
@donation_routes.route('/<int:id>', methods=['DELETE'])
def delete_donation(id):
    """
    Delete a donation entry.
    """
    donation = Donation.query.get_or_404(id)
    print("donation", donation)
    db.session.delete(donation)
    db.session.commit()
    return jsonify({'message': 'Donation deleted successfully'}), 200

# View all donations by a specific donor
@donation_routes.route('/donors/<int:donor_id>', methods=['GET'])
def view_donations_by_donor(donor_id):
    """
    Retrieve all donations made by a specific donor.
    """
    donations = Donation.query.filter_by(donor_id=donor_id).all()
    if not donations:
        return jsonify({'message': 'No donations found for this donor.'}), 404
    return jsonify([donation.to_dict() for donation in donations])

# View donations by frequency (e.g., monthly or yearly)
@donation_routes.route('/subscriptions', methods=['GET'])
def view_subscription_donations():
    """
    View all donations with a frequency of 'Monthly' or 'Yearly' to represent subscriptions.
    """
    subscriptions = Donation.query.filter(Donation.frequency.in_(['Monthly', 'Yearly'])).all()
    return jsonify([subscription.to_dict() for subscription in subscriptions])

# View donations made by a specific user (if you still need this route)
@donation_routes.route('/user/<int:user_id>', methods=['GET'])
def view_donations_by_user(user_id):
    """
    Retrieve all donations made by a specific user.
    """
    donations = Donation.query.filter_by(user_id=user_id).all()
    if not donations:
        return jsonify({'message': 'No donations found for this user.'}), 404
    return jsonify([donation.to_dict() for donation in donations])
