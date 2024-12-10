from datetime import datetime, timezone
from app.models import db

class Statement(db.Model):
    __tablename__ = 'statements'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    generated_on = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<Statement for User {self.user_id} from {self.start_date} to {self.end_date}>"
