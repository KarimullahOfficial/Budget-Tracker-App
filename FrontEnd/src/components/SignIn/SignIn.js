import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import * as Yup from 'yup';  

function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = (values) => {
    setLoading(true);
    console.log(values);
    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');  // Redirect to the dashboard after successful login
    }, 2000);
  };

  // Handle Google Login (Simulating Google login)
  const handleGoogleLogin = () => {
    console.log('Logging in with Google');
    navigate('/dashboard');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Yup Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')  // Validate email format
      .required('Email is required'),   // Email is required
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')  // Validate password length
      .required('Password is required')  // Password is required
  });

  return (
    <div
      style={{
        backgroundImage: 'linear-gradient(to right, #f0ad4e, #ec971f)',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#fff',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="text-center">
          <p>
            Welcome To login<span style={{ fontWeight: 'bold' }}></span>
          </p>
        </div>
        <div className="mb-3">
          <Button
            variant="outline-primary"
            style={{
              width: '100%',
              display: 'block',
              borderRadius: '5px',
              padding: '12px 24px',
              border: '2px solid #f0ad4e',
            }}
            onClick={handleGoogleLogin}
          >
            <FontAwesomeIcon icon={faGoogle} style={{ marginRight: '10px' }} />
            Login with Google
          </Button>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}  // Initial form values
          validationSchema={validationSchema}  // Apply Yup validation schema
          onSubmit={handleSubmit}  // Form submit handler
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              {/* Email Field */}
              <div className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faEnvelope} style={{ color: '#f0ad4e' }} />
                  </InputGroup.Text>
                  <Field
                    type="email"
                    name="email"
                    className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}  // Show error if field is touched and invalid
                    placeholder="Your email"
                    aria-label="Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </InputGroup>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="invalid-feedback"
                  style={{ color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}
                />
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faLock} style={{ color: '#f0ad4e' }} />
                  </InputGroup.Text>
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}  // Show error if field is touched and invalid
                    placeholder="Your password"
                    aria-label="Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </InputGroup.Text>
                </InputGroup>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="invalid-feedback"
                  style={{ color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}
                />
              </div>

              {/* Submit Button */}
              <div className="mb-3">
                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    width: '100%',
                    display: 'block',
                    padding: '12px 24px',
                    borderRadius: '5px',
                    backgroundColor: '#5bc0de',
                    color: '#f0ad4e',
                    transition: 'transform 0.3s ease',
                  }}
                  disabled={loading}
                >
                  Log in <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '10px' }} />
                </Button>
              </div>

              {/* Loading State */}
              {loading && <div>Loading...</div>}
            </Form>
          )}
        </Formik>

        {/* Links */}
        <div className="text-center">
          <Link to="/dashboard" style={{ color: '#5bc0de' }}>Forgot password?</Link>
          <p>
            Don’t have an account?{' '}
            <Link to="/dashboard" style={{ color: '#5bc0de' }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;