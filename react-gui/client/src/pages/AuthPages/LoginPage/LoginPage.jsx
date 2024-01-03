import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import userService from "../../../utils/userService";

import styles from "../AuthPage.module.css";

export default function LoginPage({ onSignupOrLogin }) {
  const navigate = useNavigate();
  const [formObj, setFormObj] = useState({
    email: "",
    password: "",
  });

  const onFinish = async (values) => {
    try {
      await userService.login(formObj);
    } catch (err) {
      alert(err.message);
      // console.log(err);
    }
    onSignupOrLogin();
  };

  return (
    <div className={styles.AuthPage}>
      <Form name="login_form" className={styles.authForm} onFinish={onFinish}>
        <Button
          onClick={() => navigate("/")}
          style={{ position: "absolute", top: "10px", left: "10px" }}
          type="link"
        >
          <ArrowLeftOutlined /> Back
        </Button>
        <h2>Login to Smart Contract Assistant</h2>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            type="email"
            className={styles.Input}
            placeholder="Email"
            value={formObj.email}
            bordered={false}
            onChange={(e) =>
              setFormObj({
                ...formObj,
                email: e.target.value,
              })
            }
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            type="password"
            className={styles.Input}
            placeholder="Password"
            value={formObj.password}
            bordered={false}
            onChange={(e) =>
              setFormObj({
                ...formObj,
                password: e.target.value,
              })
            }
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="ghost"
            className={styles.authFormButton}
          >
            Log in
          </Button>
        </Form.Item>
        <div className={styles.switchLink}>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </Form>
    </div>
  );
}
