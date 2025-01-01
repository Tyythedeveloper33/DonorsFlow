from flask import Blueprint, jsonify, request
from app.models import db, Donor, Subscription, Donation
from flask_login import current_user, login_required

donor_routes = Blueprint('donors', __name__)

# Create a new donor
@donor_routes.route('/', methods=["POST"])
def add_donor():
    """
    Add a new donor to the system.
    """
    data = request.get_json()

    # Validate required fields
    if not all(key in data for key in ['name', 'email', 'phone', 'user_id']):
        return jsonify({'error': 'Missing required fields: name, email, phone, or user_id'}), 400

    try:
        # Create a new donor object
        new_donor = Donor(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            user_id=data['user_id']
        )
        print('------------------------------------------------')
        print(new_donor)
        # Add and commit to the database
        db.session.add(new_donor)
        db.session.commit()

        return jsonify(new_donor.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Update donor information
@donor_routes.route('/<int:id>', methods=['PUT'])
def update_donor(id):
    """
    Update donor details.
    """
    donor = Donor.query.get_or_404(id)
    data = request.get_json()

    # Update the donor's properties
    donor.name = data.get('donor_name', donor.name)
    donor.email = data.get('donor_email', donor.email)
    donor.phone = data.get('donor_phone', donor.phone)

    db.session.commit()
    return jsonify(donor.to_dict())

# View a specific donor
@donor_routes.route('/<int:id>', methods=['GET'])
def view_donor(id):
    """
    View a specific donor.
    """
    donor = Donor.query.get_or_404(id)
    return jsonify(donor.to_dict())

# Delete a donor
@donor_routes.route('/<int:id>', methods=['DELETE'])
def delete_donor(id):
    """
    Delete a donor entry.
    """
    print('id', id)
    donor = Donor.query.get_or_404(id)
    print('found the donor', donor.name)

    try:
        db.session.delete(donor)  # Pass the donor object, not donor.id
        db.session.commit()  # Commit the changes to the database
        return jsonify({'message': 'Donor deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()  # Rollback the session in case of error
        print('Error deleting donor:', e)
        return jsonify({'error': 'Failed to delete donor'}), 500

# View all donors for a user
@donor_routes.route('/user/<int:user_id>', methods=['GET'])
def view_donors_by_user(user_id):
    """
    Retrieve all donors for a specific user.
    """
    donors = Donor.query.filter_by(user_id=user_id).all()
    if not donors:
        return jsonify({'message': 'No donors found for this user.'}), 404
    return jsonify([donor.to_dict() for donor in donors])

# View donations for a specific donor
@donor_routes.route('/<int:donor_id>/donations', methods=['GET'])
def view_donations_by_donor(donor_id):
    """
    Retrieve all donations made by a specific donor.
    """
    donations = Donation.query.filter_by(donor_id=donor_id).all()
    if not donations:
        return jsonify({'message': 'No donations found for this donor.'}), 404
    return jsonify([donation.to_dict() for donation in donations])

# View subscriptions for a specific donor
@donor_routes.route('/<int:donor_id>/subscriptions', methods=['GET'])
def view_subscriptions_by_donor(donor_id):
    """
    Retrieve all subscriptions for a specific donor.
    """
    subscriptions = Subscription.query.filter_by(donor_id=donor_id).all()
    if not subscriptions:
        return jsonify({'message': 'No subscriptions found for this donor.'}), 404
    return jsonify([subscription.to_dict() for subscription in subscriptions])
