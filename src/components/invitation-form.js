import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import { useAuthentication } from '../../utils/authentication-service';

const { height } = Dimensions.get('window');

const createInvitationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .max(20, 'Must be no longer than 20 characters')
    .matches(/^[ A-Za-z0-9_@./#&+-]*$/i, 'Username contains invalid characters')
    .required('Required')
});

const CREATE_INVITATION_MUTATION = gql`
  mutation createInvitation($inviteeUsername: String!) {
  createInvitation(inviteeUsername: $inviteeUsername) {
    invitationId
    invitor {
      playerId
      username
    }
    invitee {
      playerId
      username
    }
  }
}
`;

function InvitationForm({ setShowMakeRequest }) {
  const [mutate, { data, loading, error }] = useMutation(CREATE_INVITATION_MUTATION, {
    onError: (err) => {
      if (/player with username [^\s\\]+ not found/.test(err)) {
        setInviteError('Invitation failed. Make sure username is correct.');
      } else if (/player attempting to invite self/.test(err)) {
        setInviteError("You can't invite yourself.");
      } else if (/Existing invitation with [^\s\\]+/.test(err)) {
        setInviteError("You have an existing invitation with that player.");
      } else {
        setInviteError('Something went wrong. Please try again.');
      }
    },
    onSuccess: () => {
      // this doesn't seem to get called.. Trying to await the mutate below
      console.log('success!');
      setInviteError(null);
      setShowMakeRequest(false);
    }
  });
  const [invitationError, setInviteError] = useState(null);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          color={'red'}
          size={'large'}
        />
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ marginVertical: 20 }}>{'Send Invitation to Play'}</Text>
      <Formik
        initialValues={{
          username: '',
        }}
        validateOnChange
        validateOnBlur
        validationSchema={createInvitationSchema}
        onSubmit={({ username }, actions) => {
          mutate({
            variables: {
              inviteeUsername: username
            }
          });

          actions.setSubmitting(false);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={'Opponent username'}
                style={getInputStyles(errors.username, touched.username)}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
              />
              {errors.username && touched.username ? (<Text style={styles.inputError}>{errors.username}</Text>) : null}
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "red",
                  height: 40,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 150,
                  color: 'white'
                }}
                onPress={() => setShowMakeRequest(false)}
              >
                <Text style={{ color: '#FFF' }}>{'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isSubmitting || !Object.keys(touched).length || Object.keys(errors).length}
                style={getSubmitButtonStyles(touched, errors, isSubmitting)}
                type="submit"
                onPress={handleSubmit}
              >
                {
                  isSubmitting
                    ? <ActivityIndicator color={'white'} />
                    : <Text style={styles.buttonText}>{'Send Invitation'}</Text>
                }
              </TouchableOpacity>
            </View>
            {
              invitationError ? <Text style={styles.inputError}>{invitationError}</Text> : null
            }
          </View>
        )}
      </Formik>
    </View>
  );
};


const getSubmitButtonStyles = (touched, errors, isSubmitting) => {
  const buttonStyles = {
    backgroundColor: "green",
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    color: 'white'
  };

  if (isSubmitting || !Object.keys(touched).length || Object.keys(errors).length) {
    buttonStyles.backgroundColor = 'gray';
  }

  return buttonStyles;
};

const getInputStyles = (error, touched) => {
  const style = { ...styles.input };

  if (touched && error) {
    style.borderBottomColor = 'red';
  }

  return style;
};

const styles = StyleSheet.create({
  signUpContainer: {
    alignItems: 'center'
  },
  loader: {
    marginTop: height * 0.15
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.15
  },
  title: {
    fontSize: 32,
    color: 'red', // unsure of colors and styles for now
    fontWeight: '500',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    marginBottom: 28
  },
  formContainer: {
    width: '90%'
  },
  inputContainer: {
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e0e0e0',
    width: '100%',
    padding: Platform.OS === 'android' ? 10 : 16
  },
  inputError: {
    color: 'red'
  },
  serverError: {
    height: 20,
    alignItems: 'center'
  },
  submitContainer: {
    alignSelf: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white'
  },
  loginLinkContainer: {
    marginTop: 50
  },
  linkText: { color: 'red' }
});

export default InvitationForm;
