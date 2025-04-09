import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const {
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    isRegisterLoading,
  } = useContext(AuthContext);

  return (
    <>
      <Form onSubmit={registerUser}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#36393f",
          }}
        >
          <Col xs={6} className="register-col">
            <Stack gap={3} className="register-stack">
              {/* <img src="/Img/P2P.jpg" alt="Discord Logo" className="logo" /> */}
              <h2 style={{ color: "#ffffff" }}>Đăng Ký</h2>
              <Form.Control
                type="text"
                placeholder="Username"
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    name: e.target.value,
                  })
                }
                className="register-input"
              />
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    email: e.target.value,
                  })
                }
                className="register-input"
              />
              <Form.Control
                type="password"
                placeholder="Mật Khẩu"
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    password: e.target.value,
                  })
                }
                className="register-input"
              />

              <Button
                variant="primary"
                type="submit"
                className="register-button"
              >
                {isRegisterLoading ? "Registering..." : "Register"}
              </Button>
              {registerError?.error && (
                <Alert variant="danger">
                  <p>{registerError?.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Register;
