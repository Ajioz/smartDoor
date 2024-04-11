import React from 'react'
import { Backbtn, Container, EmailConfirmed } from "../theme/theme";
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const ConfirmPage = () => {

    const navigate = useNavigate();
    return (
      <Container>
        <EmailConfirmed>
          <h3>Email Confirmed!</h3>
          <section>
            <Backbtn onClick={() => navigate("/")}>
              <FaArrowLeft /> Back
            </Backbtn>
          </section>
        </EmailConfirmed>
      </Container>
    );
}

export default ConfirmPage