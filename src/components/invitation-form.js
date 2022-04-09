import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Feather from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { RUSSIAN } from '../constants/colors';
import { CREATE_INVITATION_MUTATION } from '../constants/queries';
import { getInviteCreationError } from '../utils/errors';
import ErrorAlert from '../components/error-alert';

const createInvitationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .max(20, 'Must be no longer than 20 characters')
    .matches(/^[ A-Za-z0-9_@./#&+-]*$/i, 'Username contains invalid characters')
    .required('Required')
});

function InvitationForm(props) {
  const [selectedColor, setSelectedColor] = useState('w');
  const [invitationError, setInviteError] = useState(null);

  const [mutate] = useMutation(CREATE_INVITATION_MUTATION, {
    onError: (error) => {
      setInviteError(getInviteCreationError(error));
    },
    onCompleted: () => {
      props.navigation.navigate('Invitations', { updated: true });
    }
  });

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.wrapper}
      scrollEnabled={false}
    >
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() => props.navigation.goBack()}
          >
            <Feather
              name={'x'}
              size={28}
              color={RUSSIAN.GRAY}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{'Create Invitation'}</Text>
        </View>
        <Text style={styles.subTitle}>{'Invite an opponent to a game.'}</Text>
      </View>
      <Formik
        initialValues={{
          // TODO: fix this. erroring out
          username: props.route.params.opponent || '',
        }}
        validateOnChange
        validateOnBlur
        validationSchema={createInvitationSchema}
        onSubmit={({ username }, actions) => {
          mutate({
            variables: {
              inviteeUsername: username,
              invitorColor: selectedColor
            }
          });
          actions.setSubmitting(false);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>{'Who would you like to play?'}</Text>
              {
                invitationError ?
                  <ErrorAlert
                    invitationError={invitationError}
                    setError={setInviteError}
                  />
                  : null
              }
              <View style={styles.usernameInputGroup}>
                <TextInput
                  placeholder={'opponent username'}
                  placeholderTextColor={RUSSIAN.GRAY}
                  style={getInputStyles(errors.username, touched.username)}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  onFocus={() => {
                    if (invitationError) {
                      setInviteError(false);
                    }
                  }}
                  value={values.username}
                />
                {errors.username && touched.username ? (<Text style={styles.inputError}>{errors.username}</Text>) : null}
              </View>

              <Text style={styles.labelText}>{'Select a color:'}</Text>
              <View style={styles.selectColorButtons}>
                <TouchableOpacity
                  style={[getRadioStyles('w', selectedColor), styles.radioButton]}
                  onPress={() => setSelectedColor('w')}
                >
                  <Text style={styles.selectColorText}>{'white'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[getRadioStyles('b', selectedColor), styles.radioButton]}
                  onPress={() => setSelectedColor('b')}
                >
                  <Text style={styles.selectColorText}>{'black'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: RUSSIAN.ORANGE }]}
                onPress={() => props.navigation.goBack()}
              >
                <Text style={{ color: RUSSIAN.WHITE }}>{'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isSubmitting || !values.username || Object.keys(errors).length}
                style={getSubmitButtonStyles(values, errors, isSubmitting)}
                type="submit"
                onPress={handleSubmit}
              >
                {
                  isSubmitting
                    ? <ActivityIndicator color={RUSSIAN.WHITE} />
                    : <Text style={styles.buttonText}>{'Send Invitation'}</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};


function getRadioStyles(input, selected) {
  const inputStyles = { backgroundColor: RUSSIAN.DARK_GRAY };

  if (input === 'w' && selected === 'w') {
    inputStyles.backgroundColor = RUSSIAN.GREEN;
  } else if (input === 'b' && selected === 'b') {
    inputStyles.backgroundColor = RUSSIAN.GREEN;
  }

  return inputStyles;
}

function getSubmitButtonStyles(values, errors, isSubmitting) {
  const buttonStyles = {
    backgroundColor: RUSSIAN.GREEN,
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    color: RUSSIAN.WHITE
  };

  if (isSubmitting || !values.username || Object.keys(errors).length) {
    buttonStyles.backgroundColor = RUSSIAN.GRAY;
  }

  return buttonStyles;
}

function getInputStyles(error, touched) {
  const style = { ...styles.input };

  if (touched && error) {
    style.borderBottomColor = RUSSIAN.ORANGE;
  }

  return style;
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    backgroundColor: RUSSIAN.DARK,
    marginBottom: 16,
    height: '100%'
  },
  headerContainer: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16
  },
  title: {
    color: RUSSIAN.GREEN,
    fontSize: 32
  },
  selectColorButtons: {
    width: '90%',
    flexDirection: 'row'
  },
  radioButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
  },
  selectColorText: {
    color: RUSSIAN.WHITE
  },
  subTitleContainer: {
    marginBottom: 52
  },
  subTitle: {
    fontSize: 20,
    color: RUSSIAN.LIGHT_GRAY
  },
  labelText: {
    fontSize: 16,
    color: RUSSIAN.LIGHT_GRAY,
    marginBottom: 12
  },
  formContainer: {
    width: '100%',
    justifyContent: 'space-evenly',
    flex: 3
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  usernameInputGroup: {
    marginBottom: 24
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: RUSSIAN.GRAY,
    color: RUSSIAN.LIGHT_GRAY,
    padding: Platform.OS === 'android' ? 10 : 16
  },
  inputError: {
    color: RUSSIAN.ORANGE,
    fontSize: 13,
    marginTop: 6
  },
  buttonGroup: {
    alignItems: 'flex-end',
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14
  },
  button: {
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    color: RUSSIAN.WHITE
  },
  buttonText: {
    color: RUSSIAN.WHITE
  }
});

export default InvitationForm;
