import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

// import { useAuthentication } from '../../utils/authentication-service';
import colors from '../../constants/colors';

const { height } = Dimensions.get('window');

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .max(20, 'Must be no longer than 20 characters')
    .matches(/^[ A-Za-z0-9_@./#&+-]*$/i, 'Username contains invalid characters')
    .required('Required'),
  password: Yup.string()
    .min(5, 'Must be at least 5 characters')
    .max(20, 'Must be no longer than 20 characters')
    .matches(/^[ A-Za-z0-9_@!$./#&+-]*$/i, 'Password contains invalid characters')
    .required('Required'),
  passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], "Passwords don't match").required('Confirm Password is required')
});

const CREATE_PLAYER_MUTATION = gql`
  mutation CreatePlayer($username: String!, $password: String!) {
    createPlayer(username: $username, password: $password) {
      token
    }
  }
`;

const SignUp = () => {
  const navigation = useNavigation();
  const [mutate, { data, loading, error }] = useMutation(CREATE_PLAYER_MUTATION);
  const goToLogIn = () => {
    navigation.navigate('LogIn');
  };

  // useAuthentication(data);

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
    <KeyboardAwareScrollView
      contentContainerStyle={styles.signUpContainer}
      scrollEnabled={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{'Sign Up'}</Text>
        <Text style={styles.subtitle}>{'Create an account an start playing!'}</Text>
      </View>
      <Formik
        initialValues={{
          username: '',
          password: '',
          passwordConfirm: ''
        }}
        validateOnChange
        validateOnBlur
        validationSchema={SignupSchema}
        onSubmit={({ username, password }, actions) => {
          mutate({
            variables: {
              username,
              password
            }
          });

          actions.setSubmitting(false);
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
              {errors.username && touched.username ? (<Text style={styles.inputError}>{errors.username}</Text>) : null}
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
              {errors.password && touched.password ? (<Text style={styles.inputError}>{errors.password}</Text>) : null}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>{'Password Confirmation'}</Text>
              <TextInput
                style={getInputStyles(errors.passwordConfirm, touched.passwordConfirm)}
                onChangeText={handleChange('passwordConfirm')}
                onBlur={handleBlur('passwordConfirm')}
                value={values.passwordConfirm}
                secureTextEntry
              />
              {errors.passwordConfirm && touched.passwordConfirm ? <Text style={styles.inputError}>{errors.passwordConfirm}</Text> : null}
            </View>
            <View style={styles.serverError}>
              {/* Todo: Check error for conflict. Show username exists error? */}
              {error ? <Text style={styles.inputError}>{'Something went wrong. Try again.'}</Text> : null}
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
                    ? <ActivityIndicator color={'white'} />
                    : <Text style={styles.buttonText}>{'Create Account'}</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
      <View style={styles.loginLinkContainer}>
        <Text style={styles.labelText}>
          {'Already have an account? '}
          <Text
            onPress={goToLogIn}
            style={styles.linkText}
          >
            {'Go to login.'}
          </Text>
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};


const getSubmitButtonStyles = (touched, errors, isSubmitting) => {
  const buttonStyles = {
    backgroundColor: colors.PINK,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    color: colors.WHITE
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
    alignItems: 'center',
    backgroundColor: colors.CHARCOAL,
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
    color: colors.PINK,
    fontWeight: '500',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: colors.GRAY,
    marginBottom: 28
  },
  formContainer: {
    width: '90%'
  },
  inputContainer: {
    marginBottom: 20,
    minHeight: 80
  },
  labelText: {
    color: colors.GRAY
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.DARK_CHARCOAL,
    width: '100%',
    color: colors.GRAY,
    padding: Platform.OS === 'android' ? 10 : 16,
    marginTop: 4
  },
  inputError: {
    color: colors.PINK
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
  linkText: {color: colors.PINK}
});

export default SignUp;
