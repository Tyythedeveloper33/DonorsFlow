from datetime import datetime
from sqlalchemy.sql import func
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Statement(db.Model):
    __tablename__ = 'statements'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('donors.id')), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    generated_on = db.Column(db.DateTime, default=func.now(), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'donor_id': self.donor_id,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'generated_on': self.generated_on.isoformat(),
        }

    def __repr__(self):
        return f"<Statement for Donor {self.donor_id} from {self.start_date} to {self.end_date}>"
