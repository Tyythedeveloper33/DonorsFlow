from datetime import datetime, timezone
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Donation(db.Model):
    __tablename__ = 'donations'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    donor_name = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    frequency = db.Column(db.String(50), default="one-time", nullable=True)


    def to_dict(self):
        return {
            'id': self.id,
            'donor_name': self.donor_name,
            'amount': self.amount,
            'date': self.date,
            'user_id': self.user_id,
        }
