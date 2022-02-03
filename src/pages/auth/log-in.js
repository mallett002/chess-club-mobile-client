import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import { logInFetch, authenticateUser } from '../../utils/authentication-service';
import { AppContext } from '../../utils/context';
import colors, { RUSSIAN } from '../../constants/colors';

const { height } = Dimensions.get('window');

const LogInSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .max(20, 'Must be no longer than 20 characters')
    .matches(/^[ A-Za-z0-9_@./#&+-]*$/i, 'Username contains invalid characters')
    .required('Required'),
  password: Yup.string()
    .min(5, 'Must be at least 5 characters')
    .max(20, 'Must be no longer than 20 characters')
    .matches(/^[ A-Za-z0-9_@!$./#&+-]*$/i, 'Password contains invalid characters')
    .required('Required')
});


const LogIn = () => {
  const navigation = useNavigation();
  const { setAccessToken, setUsername, setPlayerId } = useContext(AppContext);
  const [error, setError] = useState(null);

  const goToSignUp = () => {
    navigation.navigate('SIGNUP');
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.LogInContainer}
      scrollEnabled={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{'Player Login'}</Text>
        <Text style={styles.subtitle}>{"Log in and start playing!"}</Text>
      </View>
      <Formik
        initialValues={{
          username: '',
          password: ''
        }}
        validateOnChange
        validateOnBlur
        validationSchema={LogInSchema}
        onSubmit={async ({username, password}, actions) => {
          const token = await logInFetch(username, password);

          if (token) {
            await authenticateUser(token, setAccessToken, setUsername, setPlayerId);
            actions.setSubmitting(false);      
          } else {
            setError('Something went wrong.');
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>{'Username'}</Text>
              <TextInput
                style={getInputStyles(errors.username, touched.username)}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
              />
              {errors.username && touched.username ? (<Text style={styles.textError}>{errors.username}</Text>) : null}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>{'Password'}</Text>
              <TextInput
                style={getInputStyles(errors.password, touched.password)}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
              />
              {errors.password && touched.password ? (<Text style={styles.textError}>{errors.password}</Text>) : null}
            </View>
            <View style={styles.serverError}>
              {error ? <Text style={styles.textError}>{'Something went wrong. Check username and password'}</Text> : null}
            </View>
            <View style={styles.submitContainer}>
              <TouchableOpacity
                disabled={isSubmitting || !Object.keys(touched).length || Object.keys(errors).length}
                style={getSubmitButtonStyles(touched, errors, isSubmitting)}
                type="submit"
                onPress={handleSubmit}
              >
                {
                  isSubmitting
                    ? <ActivityIndicator color={colors.WHITE} />
                    : <Text style={styles.buttonText}>{'Login'}</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
      <View style={styles.loginLinkContainer}>
        <Text style={styles.labelText}>
          {"Not registered? "}
          <Text
            onPress={goToSignUp}
            style={styles.linkText}
          >
            {'Create an account.'}
          </Text>
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};


const getSubmitButtonStyles = (touched, errors, isSubmitting) => {
  const buttonStyles = {
    backgroundColor: RUSSIAN.ORANGE,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    color: 'white'
  };

  if (isSubmitting || !Object.keys(touched).length || Object.keys(errors).length) {
    buttonStyles.backgroundColor = RUSSIAN.DARK_GRAY;
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
  LogInContainer: {
    alignItems: 'center',
    backgroundColor: RUSSIAN.DARK,
    height: '100%'
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
    color: RUSSIAN.ORANGE,
    fontWeight: '500',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: RUSSIAN.GRAY,
    marginBottom: 28
  },
  formContainer: {
    width: '90%'
  },
  inputContainer: {
    marginBottom: 20,
    height: 80
  },
  labelText: {
    color: RUSSIAN.GRAY
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: RUSSIAN.GRAY,
    width: '100%',
    color: RUSSIAN.GRAY,
    padding: Platform.OS === 'android' ? 10 : 16,
    marginTop: 4
  },
  textError: {
    color: RUSSIAN.ORANGE
  },
  serverError: {
    height: 20
  },
  submitContainer: {
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: colors.WHITE
  },
  loginLinkContainer: {
    marginTop: 50
  },
  linkText: {color: RUSSIAN.ORANGE}
});

export default LogIn;
