import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Modal, // Import Modal component
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CraigSchulmanImage from "../images/CraigSchulman.jpg";
import FPCG_Church_Image from "../images/FPCG_Church_Image.jpg";
import PaymentForm from "../components/PaymentForm";
import "../styles/HomePageStyles.css"; // Import CSS file for custom styling

function HomePage() {
  const [premiumQuantity, setPremiumQuantity] = useState(0);
  const [standardQuantity, setStandardQuantity] = useState(0);
  const [studentQuantity, setStudentQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal open/close

  const handleQuantityChange = (e, type) => {
    const value = parseInt(e.target.value);
    if (type === "premium") {
      setPremiumQuantity(value >= 0 ? value : 0);
    } else if (type === "standard") {
      setStandardQuantity(value >= 0 ? value : 0);
    } else if (type === "student") {
      setStudentQuantity(value >= 0 ? value : 0);
    }
  };

  useEffect(() => {
    setTotalPrice(premiumQuantity * 65 + standardQuantity * 40 + studentQuantity * 25);
  }, [premiumQuantity, standardQuantity, studentQuantity]);

  const handleCheckout = () => {
    setIsModalOpen(true); // Open the modal when "Go To Checkout" button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="container">
      <div className="left-section">
        <Typography variant="h5">Craig Schulman on Broadway</Typography>
        <Typography variant="subtitle1" style={{ fontSize: "1.2rem" }}>
          Sunday, June 9, 2024 at 3:00pm
        </Typography>
        <img
          src={CraigSchulmanImage}
          alt="Craig Schulman"
          className="concert-image"
        />
      </div>
      <div className="right-section">
        <img
          src={FPCG_Church_Image}
          alt="First Presbyterian Church of Greenlawn"
          className="church-image"
        />
        <Typography variant="subtitle2" className="address">
          First Presbyterian Church of Greenlawn
        </Typography>
        <Typography variant="subtitle2" className="address">
          497 Pulaski Road
        </Typography>
        <Typography variant="subtitle2" className="address">
          Greenlawn, New York 11722
        </Typography>
        <Typography variant="subtitle2" className="address">
          (631)261-2150
        </Typography>
        {/* Add more address details if needed */}
      </div>

      <div className="tickets-section">
        <Typography variant="h4">Tickets</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tickets</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Premium*</TableCell>
                <TableCell>$65</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={premiumQuantity}
                    onChange={(e) => handleQuantityChange(e, "premium")}
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
                <TableCell>${(premiumQuantity * 65).toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Standard</TableCell>
                <TableCell>$40</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={standardQuantity}
                    onChange={(e) => handleQuantityChange(e, "standard")}
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
                <TableCell>${(standardQuantity * 40).toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Student**</TableCell>
                <TableCell>$25</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={studentQuantity}
                    onChange={(e) => handleQuantityChange(e, "student")}
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
                <TableCell>${(studentQuantity * 25).toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Charge</TableCell>
                <TableCell></TableCell>
                <TableCell>{}</TableCell>
                <TableCell>${totalPrice.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Button
        variant="contained"
        className="checkout-button"
        onClick={handleCheckout} // Call handleCheckout on button click
      >
        Go To Checkout
      </Button>

      {/* Modal for PaymentForm */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className="modal-container">
          <Paper elevation={3} className="modal-paper">
            <Typography variant="h6" align="center">
              Checkout
            </Typography>
            <PaymentForm
              premiumQuantity={premiumQuantity}
              standardQuantity={standardQuantity}
              studentQuantity={studentQuantity}
              totalPrice={totalPrice}
            />
          </Paper>
        </div>
      </Modal>

      <div style={{ padding: ".5vh" }}>
        <Typography variant="body1" style={{ fontSize: "0.9rem" }}>
          * Premium seats include seating in the front, and an after-concert
          reception, including a Question-and-Answer Meet-and-Greet with Mr.
          Schulman
        </Typography>
        <Typography variant="body1" style={{ fontSize: "0.9rem" }}>
          ** Ticket sales will be used to replace the church's organ. Tax
          deductible to the extent allowable by law. Suggested value of ticket
          is $25
        </Typography>
      </div>
    </div>
  );
}

export default HomePage;

