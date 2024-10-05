var Host = import.meta.env.VITE_BACKEND_URL;
import Cookies from 'js-cookie';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
	user: null,
	token: Cookies.get('token') || null,
	userType: Cookies.get('userType') || null,
	status: 'idle',
	id: Cookies.get('id') || null,
	error: null,
};

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, newPassword }) => {
    try {
        const data = { newPassword };

        const customConfig = {
            headers: { "Content-Type": "application/json" },
        };

        // Call the API endpoint with the reset token included in the URL
        const response = await axios.post(`${Host}/api/resetPassword/${token}`, data, customConfig);
        const json = await response.data;

        if (json.error === true) {
            return json; // Pass the error response to the component
        }

        return { error: false, msg: "Password reset successfully" };

    } catch (error) {
        return { error: true, msg: error.response?.data?.message || 'An error occurred during password reset' };
    }
});


export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (userData) => {
	try {
	  const data = {
		email: userData.email,
	  };
  
	  const customConfig = {
		headers: { "Content-Type": "application/json" },
	  };
  
	  const response = await axios.post(`${Host}/api/ForgotPassword`, data, customConfig);
	  const json = await response.data;
  
	  if (json.error === true) {
		return json; // Pass the error response to the component
	  }
  
	  return { error: false, msg: "Password reset email sent successfully" };
	} catch (error) {
	  return { error: true, msg: error.response?.data?.msg || 'An error occurred' };
	}
  });

export const resetPasswordWithOldPassword = createAsyncThunk(
    'auth/resetPasswordWithOldPassword',
    async (passwordData) => {
        try {
            const { values, bool } = passwordData;

			if (bool) {

				const data = {
					oldPassword: values.oldpassword,
					newPassword: values.confirm,
				};
	
				const customConfig = {
					headers: {
						"Content-Type": "application/json",
						'token': Cookies.get('token'), // Add token from cookies for authorization
					},
				};
	
				const response = await axios.post(`${Host}/api/resetPasswordWithOldPassword`, data, customConfig);
				const json = await response.data;
	
				if (json.error === true) {
					return json; // Pass the error response to the component
				}
	
				return { error: false, msg: "Password reset successfully" };
				
			} else{

				return { error: true, msg: "Password Validation error" };

			}

        

        } catch (error) {
            return { error: true, msg: error.response?.data?.msg || 'An error occurred during password reset' };
        }
    }
);



export const loginUser = createAsyncThunk('auth/loginUser', async (userData) => {
	try {
		var values = userData.values;
		if (userData.bool === true) {
			var data = {
				email: values.Email,
				password: values.Password,
			};

			const customConfig = {
				headers: { "Content-Type": "application/json" },
			};

			const response = await axios.post(
				`${Host}/api/login`,
				data,
				customConfig
			);
			const json = await response.data;

			if (json.error === true) {
                return json;  // Pass the error response to the component
            }

            return { error: false, token: json.token, user:json.user  , msg: "Login successful" };

		} else {
            return { error: true, msg: 'Validation failed' };
        }
    } catch (error) {
		console.log(error)
        return { error: true, msg: error.response?.data?.message || 'An error occurred' };
    }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
    try {
        const values = userData.values;
        if (userData.bool) {
            const { Name, Phone, Email, Password } = values;
            const NewUser = { name: Name, phone: Phone, password: Password };

            if (Email) { NewUser.email = Email.toLowerCase(); }

            const customConfig = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const response = await axios.post(
                `${Host}/api/Auth/Register`,
                NewUser,
                customConfig
            );

            const json = response.data;

            if (json.error === true) {
                return json;  // Pass the error response to the component
            }

            return { error: false, token: json.token, id:json.id, msg: "Registration successful" };

        } else {
            return { error: true, msg: 'Validation failed' };
        }
    } catch (error) {
        return { error: true, msg: error.response?.data?.msg || 'An error occurred' };
    }
});


const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.user = null;
			state.token = null;
			Cookies.remove('token');
			Cookies.remove('id');
			Cookies.remove('userType');
			Cookies.remove('userName');
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = action.payload.error ?  'succeeded' : 'failed';
				if (!action.payload.error) {
					state.token = action.payload.token;
					state.id = action.payload.user._id;
					state.userType = action.payload.user.userType;
				}
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.status = action.payload.error ?  'succeeded' : 'failed';
				if (!action.payload.error) {
					state.token = action.payload.token;
					state.id = action.payload.id;
				}
			})
			.addCase(forgotPassword.fulfilled, (state, action) => {
				if (action.payload.error) {
				  state.error = action.payload.msg;
				} else {
				  state.error = null;
				}
			})
			.addCase(resetPasswordWithOldPassword.fulfilled, (state, action) => {
				if (action.payload.error) {
				  state.error = action.payload.msg;
				} else {
				  state.error = null;
				}
			})
			.addCase(resetPassword.fulfilled, (state, action) => {
				if (action.payload.error) {
				  state.error = action.payload.msg;
				} else {
				  state.error = null;
				}
			})
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
