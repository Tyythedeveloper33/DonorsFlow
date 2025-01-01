from datetime import datetime, timezone
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Donation(db.Model):
    __tablename__ = 'donations'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('donors.id')), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    # date is coming back incorrect need to figure out how to get correct date
    date = db.Column(db.DateTime, default=datetime.utcnow)  # Use datetime.now(tz=timezone.utc)
    subscription_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('subscriptions.id')), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'donor_id': self.donor_id,
            'subscription_id': self.subscription_id,
            'amount': self.amount,
            'date': self.date
        }
