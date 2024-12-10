from app.models import db
from datetime import datetime, timezone
class Donation(db.Model):
    __tablename__ = 'donations'

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    frequency = db.Column(db.String(50))  # 'one-time', 'monthly', 'yearly'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    statement_id = db.Column(db.Integer, db.ForeignKey('statements.id'))

    def __repr__(self):
        return f"<Donation ${self.amount} - {self.frequency}>"

    @property
    def donation_type(self):
        return self.frequency
