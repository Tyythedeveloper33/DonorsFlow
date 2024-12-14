from flask import Blueprint, request, jsonify
from datetime import datetime
from app.models import db, Statement, Donation
from flask_login import current_user, login_required

statements_bp = Blueprint('statements', __name__)

@statements_bp.route('/', methods=['POST'])
@login_required
def create_statement():
    """
    route for creating a donation
    """
    data = request.get_json()

    # Validate input
    user_id = data.get('user_id')
    start_date_str = data.get('start_date')
    end_date_str = data.get('end_date')

    if not user_id or not start_date_str or not end_date_str:
        return jsonify({"error": "user_id, start_date, and end_date are required."}), 400

    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    if start_date > end_date:
        return jsonify({"error": "start_date cannot be after end_date."}), 400

    # (Optional) Check for overlapping statements for the same user
    overlapping_statement = Statement.query.filter(
        Statement.user_id == user_id,
        Statement.start_date <= end_date,
        Statement.end_date >= start_date
    ).first()

    if overlapping_statement:
        return jsonify({"error": "Overlapping statement exists for the user."}), 400

    # Create and save the new statement
    new_statement = Statement(
        user_id=user_id,
        start_date=start_date,
        end_date=end_date
    )
    db.session.add(new_statement)
    db.session.commit()

    return jsonify({
        "message": "Statement created successfully.",
        "statement": {
            "id": new_statement.id,
            "user_id": new_statement.user_id,
            "start_date": str(new_statement.start_date),
            "end_date": str(new_statement.end_date),
            "generated_on": new_statement.generated_on.isoformat()
        }
    }), 201

@statements_bp.route('/<int:id>', methods=['GET'])
@login_required
def view_statement(id):
    statement = Statement.query.get_or_404(id)
    """
    route for viewing a specific statement based on statement id
    """
    # Query donations between start_date and end_date
    donations = Donation.query.filter(
        Donation.date >= statement.start_date,
        Donation.date <= statement.end_date
    ).all()

    # Format the donations as a list of dictionaries
    donation_data = [
        {
            "id": donation.id,
            "amount": donation.amount,
            "date": donation.date,
            "user_id": donation.user_id
        }
        for donation in donations
    ]

    # Return the JSON response
    return jsonify({
        "id": statement.id,
        "user_id": statement.user_id,
        "start_date": statement.start_date,
        "end_date": statement.end_date,
        "generated_on": statement.generated_on,
        "donations": donation_data
    })
