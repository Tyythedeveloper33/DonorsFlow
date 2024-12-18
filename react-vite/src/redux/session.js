const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const SET_DONATIONS = "session/setDonations"; // Changed from LOAD_DONATIONS to SET_DONATIONS

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
          dispatch(loadDonations(data)); // Dispatch the action to load donations
      } else {
          const errorMessage = await response.text(); // Get the error message from the response
          console.error('Failed to fetch donations. Status:', response.status, 'Message:', errorMessage);
      }
  } catch (error) {
      console.error('Error fetching donations:', error);
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
