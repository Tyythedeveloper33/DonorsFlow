from .db import db, environment, SCHEMA, add_prefix_for_prod

class Donor(db.Model):
    __tablename__ = 'donors'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    phone = db.Column(db.String(10), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

    # Relationships
    donations = db.relationship("Donation", backref="donor", lazy="joined")
    subscriptions = db.relationship("Subscription", backref="donor", lazy="joined")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'user_id': self.user_id,
            'subscriptions': [subscription.to_dict() for subscription in self.subscriptions],
            'donations': [donation.to_dict() for donation in self.donations]
        }
