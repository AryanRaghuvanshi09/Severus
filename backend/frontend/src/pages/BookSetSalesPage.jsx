import React, { useEffect, useState } from "react";
import { Paper, Typography, CircularProgress, Box, Grid, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import API from "../services/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BookSetSalesPage = () => {
  const [salesData, setSalesData] = useState({
    bookSetSales: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    fetchSalesData();
  }, [token]);

  const fetchSalesData = async () => {
    try {
      const bookSetsResponse = await API.get("/sales/book-sets", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSalesData({
        bookSetSales: bookSetsResponse.data.sales || [],
      });
      setLoading(false);
    } catch (error) {
      setError(error.response?.data || "Error fetching sales data");
      setLoading(false);
    }
  };

  const bookSetSalesChartData = {
    labels: salesData.bookSetSales.map((bookSet) => bookSet.bookSetName),
    datasets: [
      {
        label: "Total Revenue by Book Set",
        data: salesData.bookSetSales.map((bookSet) => bookSet.totalRevenue),
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  if (loading) {
    return <CircularProgress color="primary" className="loading-spinner" />;
  }

  if (error) {
    return <Typography color="error" className="error-message">{error}</Typography>;
  }

  return (
    <Box className="sales-page-container" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h3" gutterBottom align="center" className="sales-page-title">
        Book Set Sales
      </Typography>

      <Grid container spacing={4} sx={{ display: "flex", justifyContent: "center" }}>
        {/* Chart on the left */}
        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} className="chart-paper">
            <Typography variant="h6" align="center" className="chart-title">
              Revenue by Book Set
            </Typography>
            <Bar data={bookSetSalesChartData} className="chart" />
          </Paper>
        </Grid>

        {/* Accordion List on the right */}
        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} className="sales-list">
            <Typography variant="h6" align="center">Book Set Sales List</Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Click to expand the list</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                  <ul>
                    {salesData.bookSetSales.map((bookSet) => (
                      <li key={bookSet._id}>
                        <Typography variant="body1">
                          <strong>{bookSet.bookSetName}</strong>
                          <br />
                          School: {bookSet.school} <br />
                          Class: {bookSet.className} <br />
                          Quantity Sold: {bookSet.totalQuantitySold} <br />
                          Total Revenue: Rs.{bookSet.totalRevenue.toFixed(2)} <br />
                          Average Price: Rs.{bookSet.averagePrice.toFixed(2)}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookSetSalesPage;
