import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
// Import CSS file for additional styles

const Login = () => {
  const { loginUser, loginError, loginInfo, updateLoginInfo, isLoginLoading } =
    useContext(AuthContext);

  return (
    <>
      <Form onSubmit={loginUser}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#36393f",
          }}
        >
          <Col xs={6} className="login-col">
            <Stack gap={3} className="login-stack">
              {/* <img src="/Img/P2P.jpg" alt="Discord Logo" className="logo" />  */}
              <h2 style={{ color: "#ffffff" }}>Đăng Nhập</h2>

              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  updateLoginInfo({
                    ...loginInfo,
                    email: e.target.value,
                  })
                }
                className="login-input"
              />
              <Form.Control
                type="password"
                placeholder="Mật khẩu"
                onChange={(e) =>
                  updateLoginInfo({
                    ...loginInfo,
                    password: e.target.value,
                  })
                }
                className="login-input"
              />
              <Button variant="primary" type="submit" className="login-button">
                {isLoginLoading ? "Getting you in..." : "Login"}
              </Button>
              {loginError?.error && (
                <Alert variant="danger">
                  <p>{loginError?.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Login;
