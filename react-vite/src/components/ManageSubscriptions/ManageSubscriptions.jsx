import "./ManageSubscriptions.css";

export default function ManageSubscriptions() {
  return (
    <div className="manage-subscriptions-container">
      <h1 className="manage-subscriptions-title">Manage Subscriptions</h1>
      <p className="manage-subscriptions-subtitle">
        Create and manage recurring donations for users
      </p>
      <form className="manage-subscriptions-form">
        <div className="form-group">
          <label htmlFor="user-select">Select User</label>
          <select id="user-select" className="form-control">
            <option value="">-- Select a User --</option>
            {/* Replace with dynamic user options */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="subscription-amount">Subscription Amount</label>
          <input
            type="number"
            id="subscription-amount"
            className="form-control"
            placeholder="$0.00"
          />
        </div>
        <div className="form-group">
          <label htmlFor="frequency">Frequency</label>
          <select id="frequency" className="form-control">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="start-date">Start Date</label>
          <input type="date" id="start-date" className="form-control" />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            Create Subscription
          </button>
          <button type="button" className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
     
    </div>
  );
}
