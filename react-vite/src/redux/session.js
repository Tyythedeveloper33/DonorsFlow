const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const SET_DONATIONS = "session/setDonations"; // Changed from LOAD_DONATIONS to SET_DONATIONS
const UPDATE_DONATION = "session/updateDonation"; // Changed from LOAD_DONATIONS to SET_DONATIONS
const ADD_DONATION = "session/addDonation"; // Changed from LOAD_DONATIONS to SET_DONATIONS

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

// Action creator for loading donations
const setDonations = (donations) => ({
  type: SET_DONATIONS, // Use SET_DONATIONS here
  payload: donations
});
const updateDonations = (donation)=>({
  type: UPDATE_DONATION,
  payload:donation
})
const addDonation = (donation)=>({
type: ADD_DONATION,
payload:donation
})

export const thunkAuthenticate = () => async (dispatch) => {
  const response = await fetch("/api/auth/");
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }
    dispatch(setUser(data)); // Dispatch setUser after user is authenticated
  }
};

export const thunkLogin = (credentials) => async (dispatch) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data)); // Dispatch setUser for login
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data)); // Dispatch setUser after signup
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

// Thunk to load donations
export const thunkLoadDonations = (id) => async (dispatch) => {
  if (!id) {
      console.error('Invalid user ID provided to thunkLoadDonations');
      return; // Exit if ID is invalid
  }

  console.log('Dispatching thunkLoadDonations with user ID:', id);
  try {
      const response = await fetch(`/api/donations/user/${id}`);
      console.log('Response status:', response.status); // Log the response status

      if (response.ok) {
          const data = await response.json(); // Parse the response as JSON
          console.log('Donations data:', data); // Log the fetched data
          dispatch(setDonations(data)); // Dispatch the action to load donations
      } else {
          const errorMessage = await response.text(); // Get the error message from the response
          console.error('Failed to fetch donations. Status:', response.status, 'Message:', errorMessage);
      }
  } catch (error) {
      console.error('Error fetching donations:', error);
  }
};
export const thunkUpdateDonation = (credentials) => async (dispatch) => {
  const response = await fetch(`/api/donations/${credentials.id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateDonations(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};
// stuck trying to add donor , getting a 401 unauthorized from api/auth
export const thunkAddDonor = (donor) => async (dispatch) => {
  console.log('about to take off!!!')
  const response = await fetch("/api/donations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donor),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addDonation(data))
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return { errors: errorMessages };
  } else {
    return { errors: { server: "Something went wrong. Please try again." } };
  }
};

const initialState = {
  user: {
    donations: [], // Initialize donations as an empty array
    // other user properties like username, id, etc.
  }
};

function sessionReducer(state = initialState, action) {
  console.log('Reducer received action:', action);
  switch (action.type) {
    case SET_USER:
      // Ensure donations are not overwritten, if donations already exist
      return {
        ...state,
        user: {
          ...action.payload,
          donations: action.payload.donations || [] // Safe fallback to an empty array
        }
      };
    case REMOVE_USER:
      return { ...state, user: null };
      case UPDATE_DONATION:
  return {
    ...state,
    user: {
      ...state.user,
      donations: state.user.donations.map((donation) =>
        donation.id === action.payload.id ? action.payload : donation
      ),
    },
  };

    case SET_DONATIONS: // Use SET_DONATIONS here
      return {
        ...state,
        user: { ...state.user, donations: action.payload }, // Update donations
      };
    default:
      return state;
  }
}

export default sessionReducer;
