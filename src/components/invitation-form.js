import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Feather from 'react-native-vector-icons/Feather';

import { RUSSIAN } from '../constants/colors';
import { CREATE_INVITATION_MUTATION } from '../constants/queries';
import { getInviteCreationError } from '../utils/errors';

const { height } = Dimensions.get('window');

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
      props.route.params.refetch();
      props.navigation.goBack();
    }
  });

  return (
    <View style={styles.wrapper}>
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
      <Formik
        initialValues={{
          username: '',
        }}
        validateOnChange
        validateOnBlur
        validationSchema={createInvitationSchema}
        onSubmit={({ username }) => {
          mutate({
            variables: {
              inviteeUsername: username,
              inviteeColor: selectedColor
            }
          });
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>{'Who would you like to play?'}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={'opponent username'}
                placeholderTextColor={RUSSIAN.GRAY}
                style={getInputStyles(errors.username, touched.username)}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
              />
              {errors.username && touched.username ? (<Text style={styles.inputError}>{errors.username}</Text>) : null}
            </View>
            <View>
              <Text style={styles.subtitle}>{'Select a color:'}</Text>
              <View style={styles.selectColorWrapper}>
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
                disabled={false}
                // disabled={isSubmitting || !Object.keys(touched).length || Object.keys(errors).length}
                style={getSubmitButtonStyles(touched, errors, isSubmitting)}
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
            {
              invitationError ? <Text style={styles.inputError}>{invitationError}</Text> : null
            }
          </View>
        )}
      </Formik>
    </View>
  );
};


function getRadioStyles(input, selected) {
  const inputStyles = { backgroundColor: RUSSIAN.GRAY };

  if (input === 'w' && selected === 'w') {
    inputStyles.backgroundColor = RUSSIAN.GREEN;
  } else if (input === 'b' && selected === 'b') {
    inputStyles.backgroundColor = RUSSIAN.GREEN;
  }

  return inputStyles;
}

function getSubmitButtonStyles(touched, errors, isSubmitting) {
  const buttonStyles = {
    backgroundColor: RUSSIAN.GREEN,
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    color: RUSSIAN.WHITE
  };

  // if (isSubmitting || !Object.keys(touched).length || Object.keys(errors).length) {
  //   buttonStyles.backgroundColor = RUSSIAN.GRAY;
  // }

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
    paddingHorizontal: 8,
    backgroundColor: RUSSIAN.DARK,
    marginBottom: 16,
    height: '100%'
  },
  loader: {
    marginTop: height * 0.15
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
  selectColorWrapper: {
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
  subtitle: {
    fontSize: 16,
    color: RUSSIAN.LIGHT_GRAY,
    marginBottom: 12
  },
  formContainer: {
    width: '100%'
  },
  inputContainer: {
    marginBottom: 24
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: RUSSIAN.GRAY,
    color: RUSSIAN.LIGHT_GRAY,
    padding: Platform.OS === 'android' ? 10 : 16
  },
  buttonGroup: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    color: RUSSIAN.WHITE
  },
  inputError: {
    color: RUSSIAN.ORANGE
  },
  serverError: {
    height: 20,
    alignItems: 'center'
  },
  buttonText: {
    color: RUSSIAN.WHITE
  },
  loginLinkContainer: {
    marginTop: 50
  },
  linkText: { color: RUSSIAN.ORANGE }
});

export default InvitationForm;
