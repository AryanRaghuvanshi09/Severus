import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Typography,
  Box,
  CircularProgress,
  Tab,
  Tabs,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import API from "../services/api";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

const SalesInsightsDashboard = () => {
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    productRevenue: 0,
    bookSetRevenue: 0,
    productsSales: [],
    bookSetSales: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(0);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [bookSetSearchQuery, setBookSetSearchQuery] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    fetchSalesData();
  }, [token]);

  const fetchSalesData = async () => {
    try {
      const revenueResponse = await API.get("/sales/revenue", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const productsResponse = await API.get("/sales/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookSetsResponse = await API.get("/sales/book-sets", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSalesData({
        totalRevenue: revenueResponse.data.totalRevenue || 0,
        productRevenue: revenueResponse.data.productRevenue || 0,
        bookSetRevenue: revenueResponse.data.bookSetRevenue || 0,
        productsSales: productsResponse.data.sales || [],
        bookSetSales: bookSetsResponse.data.sales || [],
      });
      setLoading(false);
    } catch (error) {
      setError(error.response?.data || "Error fetching sales data");
      setLoading(false);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const handleProductSearchChange = (event) => {
    setProductSearchQuery(event.target.value.toLowerCase());
  };

  const handleBookSetSearchChange = (event) => {
    setBookSetSearchQuery(event.target.value.toLowerCase());
  };

  const filteredProducts = salesData.productsSales.filter((product) =>
    product.productName.toLowerCase().includes(productSearchQuery)
  );

  const filteredBookSets = salesData.bookSetSales.filter((bookSet) =>
    bookSet.school.toLowerCase().includes(bookSetSearchQuery)
  );

  const pieChartData = {
    labels: ["Products", "Book Sets"],
    datasets: [
      {
        data: [salesData.productRevenue, salesData.bookSetRevenue],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  if (loading) {
    return <CircularProgress color="primary" />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: "2%", maxWidth: "1200px", margin: "auto" }}>
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{ fontSize: { xs: "1.5rem", sm: "2rem" }, marginBottom: "1rem" }}
      >
        Sales Insights Dashboard
      </Typography>

      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{ fontSize: { xs: "1rem", sm: "1.5rem" }, marginBottom: "1.5rem" }}
      >
        Total Revenue: ₹{(salesData.totalRevenue || 0).toFixed(2)}
      </Typography>

      <Tabs
        value={value}
        onChange={handleChangeTab}
        centered
        sx={{ marginBottom: "1rem" }}
      >
        <Tab label="Overview" />
        <Tab label="Product Sales" />
        <Tab label="Book Set Sales" />
      </Tabs>

      {value === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ padding: "2%", height: "100%" }}>
              <Typography variant="h6" align="center" mb={2}>
                Sales Overview (Products vs Book Sets)
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Pie data={pieChartData} />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ padding: "2%" }}>
              <Typography variant="h6" align="center" mb={2}>
                Revenue Breakdown
              </Typography>
              <Box sx={{ overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "10px" }}>
                        Category
                      </th>
                      <th style={{ textAlign: "right", padding: "10px" }}>
                        Revenue (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "10px" }}>Products</td>
                      <td style={{ textAlign: "right", padding: "10px" }}>
                        ₹{(salesData.productRevenue || 0).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "10px" }}>Book Sets</td>
                      <td style={{ textAlign: "right", padding: "10px" }}>
                        ₹{(salesData.bookSetRevenue || 0).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {(value === 1 || value === 2) && (
        <Box mt={3}>
          <Card sx={{ padding: "2%", width: "100%" }}>
            <Typography variant="h6" mb={2}>
              {value === 1 ? "Product Sales" : "Book Set Sales"}
            </Typography>
            <TextField
              label={value === 1 ? "Search Products" : "Search Book Sets"}
              fullWidth
              value={value === 1 ? productSearchQuery : bookSetSearchQuery}
              onChange={
                value === 1
                  ? handleProductSearchChange
                  : handleBookSetSearchChange
              }
              sx={{ marginBottom: "1rem" }}
            />
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: "400px", // Add vertical scroll
                overflowY: "auto",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {value === 1 ? "Product Name" : "School Name"}
                    </TableCell>
                    <TableCell align="right">Quantity Sold</TableCell>
                    <TableCell align="right">Revenue (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(value === 1 ? filteredProducts : filteredBookSets).map(
                    (item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          {value === 1 ? item.productName : item.school}
                        </TableCell>
                        <TableCell align="right">
                          {item.totalQuantitySold || 0}
                        </TableCell>
                        <TableCell align="right">
                          ₹{(item.totalRevenue || 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default SalesInsightsDashboard;
