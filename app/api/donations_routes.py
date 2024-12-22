from flask import Blueprint, jsonify, request
from app.models import db, Donation
from flask_login import current_user, login_required

donation_routes = Blueprint('donations', __name__)


@donation_routes.route('/')
def get_all_donations():
    """
    Retrieves a list of all donations
    """
    donations = Donation.query.all()
    return jsonify([donation.to_dict() for donation in donations])




@donation_routes.route('/', methods=["POST"])
def add_donations():
    """
    Add a new donation to the system using a provided user ID.
    """
    data = request.get_json()

    # Validate required fields
    if not all(key in data for key in ['donor_name', 'amount', 'user_id']):
        return jsonify({'error': 'Missing required fields: donor_name, amount, or user_id'}), 400

    try:
        # Create a new donation object
        new_donation = Donation(
            donor_name=data['donor_name'],
            amount=float(data['amount']),
            frequency=data['frequency'],
            user_id=data['user_id'],
            donor_email=data['donor_email'],
            donor_phone=data['donor_phone']
        )

        # Add and commit to the database
        db.session.add(new_donation)
        db.session.commit()

        return jsonify(new_donation.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500



@donation_routes.route('/<int:id>', methods=['POST'])
def update_donation(id):
    """
    Update donation details.
    """
    donation = Donation.query.get_or_404(id)
    data = request.get_json()

    # Update the donation's properties
    donation.donor_name = data.get('donor_name', donation.donor_name)
    donation.amount = data.get('amount', donation.amount)
    donation.donor_email = data.get('donor_email', donation.donor_email)
    donation.donor_phone = data.get('donor_phone', donation.donor_phone)

    frequency = data.get('frequency')
    if frequency:
        donation.frequency = frequency

    db.session.commit()
    return jsonify(donation.to_dict())



@donation_routes.route('/<int:id>', methods=['DELETE'])
def delete_donation(id):
    """
    Delete a donation entry.
    """
    donation = Donation.query.get_or_404(id)
    db.session.delete(donation)
    db.session.commit()
    return jsonify({'message': 'Donation deleted successfully'}), 200

# optionally i can break this following route into more if i want to allow user to view subs in monthly only vice versa
@donation_routes.route('/subscriptions', methods=['GET'])
@login_required
def view_subscriptions():
    """
    View all donations with a frequency of 'monthly' or 'quarterly' to represent subscriptions.
    """
    subscriptions = Donation.query.filter(Donation.frequency.in_(['monthly', 'yearly'])).all()
    return jsonify([subscription.to_dict() for subscription in subscriptions])

@donation_routes.route('/user/<int:user_id>', methods=['GET'])
def view_donations_by_user(user_id):
    """
    Retrieve all donations made by a specific user.
    """
    donations = Donation.query.filter_by(user_id=user_id).all()
    if not donations:
        return jsonify({'message': 'No donations found for this user.'}), 404
    return jsonify([donation.to_dict() for donation in donations])
