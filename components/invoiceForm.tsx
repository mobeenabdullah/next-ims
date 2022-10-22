import { FC, useEffect, useState } from "react";
import Loading from "./Loading";
import Autocomplete from '@mui/material/Autocomplete';
import { Button, TextField, Typography, Stack, Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import IconButton from "@mui/material/IconButton";
import styles from './invoice-form.module.scss';
import {useRouter} from 'next/router';

const InvoiceForm: FC = (props : any) => {
  const router = useRouter();
  const submitInvoice = props.submitInvoice;
  const invoiceData = props.invoice;
  const isLoading = props.loading;
  const clients = props.clients || [];

  // console.log(invoiceData);

  const currentClient = () => {
    let currentClient = [];
    if(router.query.clientId) {
      currentClient = props.clients.length && props.clients.filter((client:any) => client.id === router.query.clientId);
    } else if(invoiceData && invoiceData.client_id) {
      currentClient = props.clients.length && props.clients.filter((client:any) => client.id === invoiceData?.client_id);
    } else {
      currentClient = [{id: '', label: ''}];
    }

    return currentClient.length > 0 ? currentClient[0] : {id: '', label: ''};
    
  }

  const dateFormat = (format: string, timeStamp: any) => {
      let date;
      //parse the input date
      if(timeStamp) {
        date = new Date(timeStamp);
      } else {
        date = new Date();
      }
      //extract the parts of the date
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();    
      //replace the month
      format = format.replace("MM", month.toString().padStart(2,"0"));        
      //replace the year
      if (format.indexOf("yyyy") > -1) {
          format = format.replace("yyyy", year.toString());
      } else if (format.indexOf("yy") > -1) {
          format = format.replace("yy", year.toString().substr(2,2));
      }
      //replace the day
      format = format.replace("dd", day.toString().padStart(2,"0"));
      return format;
    }

    const [company, setCompany] = useState<any>(currentClient); 
    const [date, setDate] = useState(dateFormat('yyyy-MM-dd', invoiceData?.date) || dateFormat('yyyy-MM-dd', ''));
    const [dueDate, setDueDate] = useState(invoiceData?.dueDate ? dateFormat('yyyy-MM-dd', invoiceData.dueDate) : '');
    const [invoiceNumber, setInvoiceNumber] = useState(invoiceData?.invoice_number);
    const [projectCode, setProjectCode] = useState(invoiceData?.projectCode);
    const [dueDateError, setDueDateError] = useState('');
    const [dateError, setDateError] = useState('');
    const [total, setTotal] = useState(invoiceData?.value);
    const [invoiceNumberError, setInvoiceNumberError] = useState('');
    const [projectCodeError, setProjectCodeError] = useState('');
    const [companyError, setCompanyError] = useState((router.query.clientId && !company.id) ? 'Client not found for this id, Please select client for invoice' :'');
    const [invoiceError, setInvoiceError] = useState(false);
    const [invoiceErrorMessage, setInvoiceErrorMessage] = useState('');

    const [invoiceItemFieldsError, setInvoiceItemFieldsError] = useState('');
    let [invoiceItemFields, setInvoiceItemFields] = useState( [
        { description: '', value: 0, error: '', errorType: '' }
    ]);

    useEffect(() => {
      if(props.successMessage) {
        setInvoiceNumber('');
        setCompany(currentClient);
        dateFormat('yyyy-MM-dd', '');
        setProjectCode('');
        setTotal(0);
        setDueDate('');
        setInvoiceItemFields([
          { description: '', value: 0, error: '', errorType: '' }
        ]);
      }
    }, [props.successMessage])

    useEffect(() => {
      if(!invoiceData?.invoice_number) {
        setInvoiceError(true);
        setInvoiceErrorMessage('Invoice not found!')
      } else {
        if(invoiceData && invoiceData.meta && invoiceData.meta.items) {
          setInvoiceItemFields(invoiceData.meta.items);
        }
      }
    }, [])

    const handleInvoiceItemChange = (index: number, event: any) => {
        event.preventDefault();
        let totalValue = 0;
        let invoiceItem: any = invoiceItemFields;
        invoiceItem[index][event.target.name] = event.target.value;
        setInvoiceItemFields([...invoiceItem]);
        invoiceItem.forEach((item, index) => {
          if(item.value < 1){
            addErrorInvoiceItem(index, 'value', 'Value should be greater than 0!');
          } else {
            addErrorInvoiceItem(index, '', '');
          }
          totalValue = parseInt(totalValue.toString()) + parseInt(item.value.toString());
        })
        setTotal(totalValue);
    }
    
    const addInvoiceItem = () => {
        let newfield = { description: '', value: 0, error: '', errorType: '' }
        setInvoiceItemFields([...invoiceItemFields, newfield])
        setInvoiceItemFieldsError('');
    }

    const removeInvoiceItem = (index: number) => {
        let invoiceItem: any = invoiceItemFields;
        let totalValue = 0;
        if(invoiceItemFields.length > 1) {
          invoiceItem.splice(index,1);
          setInvoiceItemFields([...invoiceItem]);
          invoiceItem.forEach((item, index) => {
            totalValue = parseInt(totalValue.toString()) + parseInt(item.value.toString());
          })
          setTotal(totalValue);
          setInvoiceItemFieldsError('');
        } else {
          setInvoiceItemFieldsError('Minimum one item is required ');
        }
    }

    const addErrorInvoiceItem = (index: number, type: string, error: string) => {
        let invoiceItem: any = invoiceItemFields;
        invoiceItem[index]['error'] = error;
        invoiceItem[index]['errorType'] = type;
        setInvoiceItemFields([...invoiceItem]);
    }

    const handleClientChange = (event: React.SyntheticEvent, value: any) => {
        event.preventDefault();
        setCompany(value);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
    
        if(!date) {
          setDateError('Invoice date is required!');
          return;
        } else {
          setDateError('');
        }
    
        if(!dueDate) {
          setDueDateError('Invoice due date is required!');
          return;
        } else {
          setDueDateError('');
        }
    
        if(new Date(dueDate).getTime() < new Date(date).getTime()) {
          setDueDateError('Invoice due date should be greater than invoice date!');
          return;
        } else {
          setDueDateError('');
        }
    
        if(invoiceNumber.length < 3) {
          setInvoiceNumberError('Invoice number must be 3 character long!');
          return;
        } else {
          setInvoiceNumberError('');
        }
    
        if(projectCode && projectCode.length < 3) {
          setProjectCodeError('Project code must be 3 character long!');
          return;
        } else {
          setProjectCodeError('');
        }
    
        if(company.hasOwnProperty('id') && company.id) {
          setCompanyError('');
        } else {
          setCompanyError('Please Select invoice client!');
          return;
        }
    
        invoiceItemFields.forEach((item, index) => {
          if(item.description.length  < 3) {
            addErrorInvoiceItem(index, 'description' ,'Description character should be greater than 3!');
            return;
          } else {
            addErrorInvoiceItem(index, '', '');
          }

          if(item.value < 1) {
            addErrorInvoiceItem(index, 'value', 'Value should be greater than 0!');
            return;
          } else {
            addErrorInvoiceItem(index, '', '');
          }
        })
    
        const invoiceDetails = {
          "id": invoiceData?.id || '',
          "invoice_number": invoiceNumber,
          "client_id": company.id,
          "date": new Date(date).getTime(),
          "dueDate": new Date(dueDate).getTime(),
          "value": total,
          "projectCode": projectCode,
          "meta" : {
            "items": invoiceItemFields
          }
        }
        
        submitInvoice(invoiceDetails);
      }

    return (
      <>
      <Stack className="paper" sx={{maxWidth: {xs: "100%", sm: "100%", md: "100%", lg: "100%"}, width: "100%", paddingBottom: {xs: '2rem', sm: '2rem'}}}>
        <Stack spacing={2} sx={{width: '100%',}}>
            {(invoiceError && !invoiceNumber && router.query.id) && (
              <Alert severity="error" data-test='not-found-message'>{invoiceErrorMessage}</Alert>
            )}
        </Stack>
      </Stack>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
          <Typography component="p" data-test="form-success"></Typography>
          <Typography component="p" color="error" data-test="form-error"></Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            id="date"
            label="Invoice Date"
            data-test="invoice-date"
            name="date"
            type="date"
            value={date}
            error={dateError ? true : false}
            helperText={dateError ? dateError : ""}
            onChange={(e: any) => setDate(e.target.value)}
          />
          <Typography component="p" color="error" data-test="invoice-date-error"></Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            id="due-date"
            label="Invoice Due Date"
            data-test="invoice-due-date"
            name="due-date"
            type="date"
            value={dueDate}
            error={dueDateError ? true : false}
            helperText={dueDateError ? dueDateError : ""}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Typography component="p" color="error" data-test="invoice-due-date-error"></Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="number"
            label="Invoice Number"
            name="number"
            data-test="invoice-number"
            value={invoiceNumber}
            error={invoiceNumberError ? true : false}
            helperText={invoiceNumberError ? invoiceNumberError : ""}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
          <Typography component="p" color="error" data-test="invoice-number-error"></Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="project-code"
            label="Invoice Project Code"
            name="project-code"
            data-test="invoice-project-code"
            value={projectCode}
            error={projectCodeError ? true : false}
            helperText={projectCodeError ? projectCodeError : ""}
            onChange={(e) => setProjectCode(e.target.value)}
          />
          <Typography component="p" color="error" data-test="invoice-project-code-error"></Typography>
          
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={clients}
            data-test='invoice-company-id'
            onChange={handleClientChange}
            value={company}
            isOptionEqualToValue={(option: any, value: any) =>
              option === value
            }
            renderInput={(params) => <TextField {...params} label="Invoice Client" />}
          />
          <Typography component="p" color="error" data-test="invoice-company-id-error">{companyError}</Typography>
          
          {invoiceItemFields.map((fields, index) => {
            return (
              <Box sx={{display: 'flex', alignItems: 'top', gap: '10px'}} key={index} data-test={`invoice-item-${index}`}>
                <Box>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    id={`item-description-${index}`}
                    label="Item Description"
                    name="description"
                    type="text"
                    value={fields.description}
                    data-test="invoice-item-description"
                    onChange={event => handleInvoiceItemChange(index, event)}
                  />
                  <Typography component="p" color="error" sx={{ fontSize: '12px', marginBottom: '10px', lineHeight: '1'}}  data-test="invoice-description-error">{fields.errorType === 'description' && fields.error}</Typography>
                </Box>
                <Box>                  
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id={`item-value-${index}`}
                    label="Item value"
                    name="value"
                    type="number"
                    value={fields.value}
                    data-test="invoice-item-value"
                    onChange={event => handleInvoiceItemChange(index, event)}
                  />
                  <Typography component="p" color="error" data-test="invoice-value-error">{fields.errorType === 'value' && fields.error}</Typography>
                </Box>                 
                <Box>
                  <IconButton
                      onClick={() => removeInvoiceItem(index)}
                    >
                      <DeleteOutlineOutlinedIcon/>
                    </IconButton>                          
                </Box>
              </Box>
            )
          })}
          <Typography component="p" color="error" sx={{ fontSize: '12px', marginBottom: '20px', lineHeight: '1'}} data-test="invoice-item-error">{invoiceItemFieldsError}</Typography>
          <Box display="flex" alignItems='center' sx={{gap: "45px", width: "100%", flex: "1"}} mb={'20px'}>
            <Button variant="contained" onClick={addInvoiceItem}>Add Invoice Item</Button>            
            <Typography component="p" sx={{fontSize: '20px', marginBottom: '0px', lineHeight: '1'}} data-test="invoice-total">Total Amount: {total}</Typography>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={styles.submit}
            disabled={isLoading ? true : false}
          >
            {isLoading ? <Loading /> : "submit"}
          </Button>
      </form>
      </>
    );
    
}

export default InvoiceForm;
