import React from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Feather from 'react-native-vector-icons/Feather';

import { RUSSIAN } from '../constants/colors';

const { height } = Dimensions.get('window');

const createInvitationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .max(20, 'Must be no longer than 20 characters')
    .matches(/^[ A-Za-z0-9_@./#&+-]*$/i, 'Username contains invalid characters')
    .required('Required')
});

function InvitationForm(props) {
  console.log({ props });
  if (props.loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          color={RUSSIAN.ORANGE}
          size={'large'}
        />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginRight: 8 }}
          onPress={() => props.navigation.goBack()}
        >
          <Feather
            name={'arrow-left-circle'}
            size={28}
            color={RUSSIAN.GRAY}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{'Create Invitation'}</Text>
      </View>
      {/* <View style={{marginBottom: 32, alignItems: 'center'}}>
        <Text style={{ color: RUSSIAN.LIGHT_GRAY, fontSize: 16 }}>{'Send an invitation to play.'}</Text>
      </View> */}
      <Formik
        initialValues={{
          username: '',
        }}
        validateOnChange
        validateOnBlur
        validationSchema={createInvitationSchema}
        onSubmit={({ username }, actions) => {
          props.createInvitation(username);

          actions.setSubmitting(false);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={'Opponent username'}
                placeholderTextColor={RUSSIAN.GRAY}
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
                  backgroundColor: RUSSIAN.ORANGE,
                  height: 40,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 150,
                  color: RUSSIAN.WHITE
                }}
                onPress={() => props.setShowMakeRequest(false)}
              >
                <Text style={{ color: RUSSIAN.WHITE }}>{'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isSubmitting || !Object.keys(touched).length || Object.keys(errors).length}
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
              props.invitationError ? <Text style={styles.inputError}>{props.invitationError}</Text> : null
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
    color: RUSSIAN.WHITE
  };

  if (isSubmitting || !Object.keys(touched).length || Object.keys(errors).length) {
    buttonStyles.backgroundColor = 'gray';
  }

  return buttonStyles;
};

const getInputStyles = (error, touched) => {
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
  subtitle: {
    fontSize: 16,
    color: 'black',
    marginBottom: 28
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
    width: '100%',
    padding: Platform.OS === 'android' ? 10 : 16
  },
  inputError: {
    color: RUSSIAN.ORANGE
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
    color: RUSSIAN.WHITE
  },
  loginLinkContainer: {
    marginTop: 50
  },
  linkText: { color: RUSSIAN.ORANGE }
});

export default InvitationForm;
