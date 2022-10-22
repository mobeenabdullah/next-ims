import { FC, useState, useEffect } from "react";
import Loading from "../components/Loading";
import { Button, TextField, Typography } from "@mui/material";
import styles from './client-form.module.scss';

const ClientForm: FC = (props : any) => {
  const [name, setName] = useState(props.clientData.name);
  const [companyName, setCompanyName] = useState(props.clientData.companyName);
  const [address, setAddress] = useState(props.clientData.address);
  const [iban, setIban] = useState(props.clientData.iban);
  const [vat, setVat] = useState(props.clientData.vat);
  const [registrationNumber, setRegistrationNumber] = useState(props.clientData.registrationNumber);
  const [swift, setSwift] = useState(props.clientData.swift);
  const [email, setEmail] = useState(props.clientData.email);
  const [invalidName, setInvalidName] = useState(false);
  const [invalidCompanyName, setInvalidCompanyName] = useState(false);
  const [invalidAddress, setInvalidAddress] = useState(false);
  const [invalidVat, setInvalidVat] = useState(false);
  const [invalidRegistrationNumber, setInvalidRegistrationNumber] =useState(false);
  const [inValidEmail, setInValidEmail] = useState(false);
  const [inValidEmailMessage, setInValidEmailMessage] = useState("");
  const [invalidIban, setInvalidIban] = useState(false);
  const [invalidSwift, setInvalidSwift] = useState(false);
  const isLoading = props.loading;
  const submitClient = props.handleSubmitClient;

  useEffect(() => {
    if(props.successMessage) {
      setName('');
      setCompanyName('');
      setAddress('');
      setIban('');
      setVat('');
      setRegistrationNumber('');
      setSwift('');
      setEmail('');
    }
  }, [props.successMessage])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const emailValidRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (name === "" || name.length < 3 || name.length > 16) {
      setInvalidName(true);
      return;
    } else {
      setInvalidName(false);
    }
    if (email === "") {
      setInValidEmail(true);
      setInValidEmailMessage("Email is required!");
      return;
    } else {
      setInValidEmail(false);
      setInValidEmailMessage("");
    }
    if (!email.match(emailValidRegex)) {
      setInValidEmail(true);
      setInValidEmailMessage("Email format is invalid!");
      return;
    } else {
      setInValidEmail(false);
      setInValidEmailMessage("");
    }
    if (companyName === "") {
      setInvalidCompanyName(true);
      return;
    } else {
      setInvalidCompanyName(false);
    }
    if (address === "") {
      setInvalidAddress(true);
      return;
    } else {
      setInvalidAddress(false);
    }
    if (iban === "") {
      setInvalidIban(true);
      return;
    } else {
      setInvalidIban(false);
    }
    if (registrationNumber === "") {
      setInvalidRegistrationNumber(true);
      return;
    } else {
      setInvalidRegistrationNumber(false);
    }
    if (swift === "") {
      setInvalidSwift(true);
      return;
    } else {
      setInvalidSwift(false);
    }

    if (vat === "") {
      setInvalidVat(true);
      return;
    } else {
      setInvalidVat(false);
    }

    let clientData = {
      email: email,
      name: name,
      iban: iban,
      swift: swift,
      companyDetails: {
        name: companyName,
        vatNumber: vat,
        regNumber: registrationNumber,
        address: address,
      },
    };
    submitClient(clientData);
  };

  return (
    <>
      <form className="form" noValidate onSubmit={handleSubmit}>
        <Typography component="p" data-test="form-success"></Typography>
        <Typography component="p" color="error" data-test="form-error"></Typography>
        <TextField
          error={invalidName ? true : false}
          helperText={invalidName ? "Client name must be 3-16 character long!" : ""}
          variant="outlined"
          margin="normal"
          fullWidth
          id="name"
          label="Name"
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          disabled={isLoading ? true : false}
          data-test="client-name"
        />
        <Typography
          component="p"
          color="error"
          data-test="client-name-error"
        ></Typography>
        <TextField
          error={inValidEmail ? true : false}
          helperText={inValidEmail ? inValidEmailMessage : ""}
          variant="outlined"
          margin="normal"
          fullWidth
          name="email"
          label="Email"
          id="email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          data-test="client-email"
          disabled={isLoading ? true : false}
        />
        <Typography
          component="p"
          color="error"
          data-test="client-email-error"
        ></Typography>
        <TextField
          error={invalidCompanyName ? true : false}
          helperText={
            invalidCompanyName ? "Company name is required!" : ""
          }
          variant="outlined"
          margin="normal"
          fullWidth
          id="company_name"
          label="Company Name"
          name="company_name"
          onChange={(e) => setCompanyName(e.target.value)}
          value={companyName}
          data-test="client-company-name"
          disabled={isLoading ? true : false}
        />
        <Typography
          component="p"
          color="error"
          data-test="client-company-name-error"
        ></Typography>
        <TextField
          error={invalidAddress ? true : false}
          helperText={
            invalidAddress ? "Company address is required!" : ""
          }
          variant="outlined"
          margin="normal"
          fullWidth
          id="company_address"
          label="Company Address"
          name="company_address"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          data-test="client-company-address"
          disabled={isLoading ? true : false}
        />
        <Typography
          component="p"
          color="error"
          data-test="client-company-address-error"
        ></Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="company_iban"
          label="IBAN"
          name="company_iban"
          onChange={(e) => setIban(e.target.value)}
          value={iban}
          data-test="client-company-iban"
          disabled={isLoading ? true : false}
          error={invalidIban ? true : false}
          helperText={invalidIban ? "IBAN is required!" : ""}
        />
        <Typography
          component="p"
          color="error"
          data-test="client-company-iban-error"
        ></Typography>
        <TextField
          error={invalidRegistrationNumber ? true : false}
          helperText={
            invalidRegistrationNumber
              ? "Registration number is required!"
              : ""
          }
          variant="outlined"
          margin="normal"
          fullWidth
          id="registry_number"
          label="Registry Number"
          name="registry_number"
          type="number"
          onChange={(e) => setRegistrationNumber(e.target.value)}
          value={registrationNumber}
          data-test="client-company-reg"
          disabled={isLoading ? true : false}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Typography
          component="p"
          color="error"
          data-test="client-company-reg-error"
        ></Typography>
        <TextField
          error={invalidSwift ? true : false}
          helperText={invalidSwift ? "Swift is required!" : ""}
          variant="outlined"
          margin="normal"
          fullWidth
          id="swift"
          label="SWIFT"
          name="swift"
          onChange={(e) => setSwift(e.target.value)}
          value={swift}
          data-test="client-company-swift"
          disabled={isLoading ? true : false}
        />
        <Typography
          component="p"
          color="error"
          data-test="client-company-swift-error"
        ></Typography>
        <TextField
          error={invalidVat ? true : false}
          helperText={invalidVat ? "Vat number is required!" : ""}
          variant="outlined"
          margin="normal"
          fullWidth
          id="vat_number"
          label="VAT Number"
          name="vat_number"
          type="number"
          onChange={(e) => setVat(e.target.value)}
          value={vat}
          data-test="client-company-vat"
          InputLabelProps={{
            shrink: true,
          }}
          disabled={isLoading ? true : false}
        />
        <Typography
          component="p"
          color="error"
          data-test="client-company-vat-error"
        ></Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={styles.submit}
          data-test="submit-client"
          disabled={isLoading ? true : false}
        >
          {isLoading ? <Loading /> : "submit"}
        </Button>
      </form>
    </>
  );
};

export default ClientForm;
