import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import './Login.css'

export default function Login(props) {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      if (props.location.state !== undefined) {
        history.push(props.location.state.linkto)
      } else {
        history.push("/")
      }
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  return (
    <div className="login-card-div">
      <Card className="login-card">
        <Card.Body className="login-card-body">
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 login-button" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <div className="w-100 text-center mt-">
            Need an account? <Link to={{
              pathname: "/signup",
              state: props.location.state !== undefined ? { linkto: props.location.state.linkto } : undefined
            }}>Sign Up</Link>
          </div>
        </Card.Body>
      </Card>
    </div >
  )
}
