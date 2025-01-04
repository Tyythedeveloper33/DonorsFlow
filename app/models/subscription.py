from datetime import datetime, timezone
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Subscription(db.Model):
    __tablename__ = 'subscriptions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)  # e.g., 'Monthly', 'Yearly'
    start_date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    end_date = db.Column(db.DateTime, nullable=True)  # Nullable for ongoing subscriptions
    donor_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('donors.id')), nullable=False)
    amount = db.Column(db.Integer, nullable=False)

    donations = db.relationship("Donation", backref="subscription", lazy="joined")

    def to_dict(self):
        return {
        'id': self.id,
        'type': self.type,
        'start_date': self.start_date,
        'end_date': self.end_date,
        'donor_id': self.donor_id,
        'amount': self.amount,  # Ensure this field is included
        'donations': [donation.to_dict() for donation in self.donations]
    }
